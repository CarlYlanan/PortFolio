#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const mediaRoot = path.join(projectRoot, 'public', 'media')

const groupFolders = {
  gallery: 'gallery',
  articles: 'articles',
  setup: 'setup',
  social: 'social',
}

const galleryOutputByGroup = {
  gallery: path.join(projectRoot, 'src', 'data', 'gallery', 'generatedLocationGalleries.ts'),
  articles: path.join(projectRoot, 'src', 'data', 'articles', 'generatedLocationGalleries.ts'),
  setup: path.join(projectRoot, 'src', 'data', 'setup', 'generatedLocationGalleries.ts'),
  social: path.join(projectRoot, 'src', 'data', 'social', 'generatedLocationGalleries.ts'),
}

const webImageExt = new Set(['.jpg', '.jpeg', '.png', '.jpe'])
const skipVideoExt = new Set(['.mov', '.mp4', '.webm'])

async function listFiles(sourceDir) {
  try {
    return await fs.readdir(sourceDir, { withFileTypes: true })
  } catch {
    return []
  }
}

function ffmpegConvert(input, output) {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-y', '-i', input, '-frames:v', '1', output], {
    encoding: 'utf8',
    stdio: 'ignore',
  })

  return result.status === 0
}

function rawFileOutput(fileName) {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.heic.jpg')) {
    return fileName.slice(0, fileName.length - '.HEIC.jpg'.length) + '.jpg'
  }
  if (lower.endsWith('.heif.jpg')) {
    return fileName.slice(0, fileName.length - '.HEIF.jpg'.length) + '.jpg'
  }
  if (lower.endsWith('.heic')) {
    return fileName.slice(0, fileName.length - '.HEIC'.length) + '.jpg'
  }
  if (lower.endsWith('.heif')) {
    return fileName.slice(0, fileName.length - '.HEIF'.length) + '.jpg'
  }
  return null
}

function isRawFile(fileName) {
  const lower = fileName.toLowerCase()
  return lower.endsWith('.heic.jpg') || lower.endsWith('.heif.jpg') || lower.endsWith('.heic') || lower.endsWith('.heif')
}

async function collectFolders(sourceDir) {
  const folders = []

  async function walk(currentDir) {
    try {
      const entries = await listFiles(currentDir)
      const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
      const imageFiles = entries.filter((entry) => entry.isFile() && webImageExt.has(path.extname(entry.name).toLowerCase()))

      if (imageFiles.length > 0) {
        folders.push(currentDir)
      }

      for (const directory of directories) {
        await walk(path.join(currentDir, directory))
      }
    } catch {
      // ignore folders that disappear during the traversal
    }
  }

  await walk(sourceDir)
  return folders
}

async function normalizeFolder(sourceDir, folder) {
  try {
    await fs.access(sourceDir)
  } catch {
    console.log(`[skip] ${folder}: source folder does not exist`)
    return []
  }

  const files = (await listFiles(sourceDir)).filter((entry) => entry.isFile())
  const sorted = files.sort((a, b) => a.name.localeCompare(b.name))

  let converted = 0
  let copied = 0
  let skipped = 0
  const gallery = []

  for (const file of sorted) {
    const input = path.join(sourceDir, file.name)
    const ext = path.extname(file.name).toLowerCase()

    if (skipVideoExt.has(ext)) {
      skipped += 1
      await fs.rm(input, { force: true })
      continue
    }

    if (isRawFile(file.name)) {
      const outputName = rawFileOutput(file.name)
      if (!outputName) {
        continue
      }

      const output = path.join(sourceDir, outputName)
      await fs.rm(output, { force: true })

      const ok = ffmpegConvert(input, output)
      if (!ok) {
        console.log(`[warn] failed conversion ${input}`)
        continue
      }

      converted += 1
      await fs.rm(input, { force: true })

      const mtime = (await fs.stat(output)).mtimeMs
      gallery.push({
        title: `${folder}-${outputName}`,
        src: outputName,
        alt: `${folder} trip image`,
        aspectRatio: '4 / 3',
        folder,
        capturedAt: new Date(mtime).toISOString(),
      })

      continue
    }

    if (webImageExt.has(ext)) {
      copied += 1
      const mtime = (await fs.stat(input)).mtimeMs
      gallery.push({
        title: `${folder}-${file.name}`,
        src: file.name,
        alt: `${folder} trip image`,
        aspectRatio: '4 / 3',
        folder,
        capturedAt: new Date(mtime).toISOString(),
      })
    }
  }

  console.log(`[ok] ${folder}: converted=${converted}, copied=${copied}, skipped=${skipped}, total=${converted + copied}`)
  return gallery
}

async function scanGroup(group) {
  const groupRoot = path.join(mediaRoot, group)

  try {
    await fs.access(groupRoot)
  } catch {
    return {}
  }

  const observedFolders = await collectFolders(groupRoot)
  const galleries = {}

  for (const folderPath of observedFolders) {
    const folder = path.basename(folderPath)
    const items = await normalizeFolder(folderPath, folder)
    if (items.length === 0) {
      continue
    }

    galleries[folder] = items
  }

  return galleries
}

async function writeGalleries(group, galleries) {
  const groupFoldersList = Object.keys(galleries)
  const paths = groupFoldersList.map((folder) => {
    const items = galleries[folder] ?? []
    const itemRows = items.map((item) => `    { title: ${JSON.stringify(item.title)}, src: ${JSON.stringify(item.src)}, alt: ${JSON.stringify(item.alt)}, aspectRatio: ${JSON.stringify(item.aspectRatio)}, folder: ${JSON.stringify(item.folder)}, capturedAt: ${JSON.stringify(item.capturedAt)} }`)
    return `  ${JSON.stringify(folder)}: [\n${itemRows.join(',\n')}\n  ]`
  })

  const output = `import type { GalleryItem } from '../../types'\n\nexport const generatedLocationGalleries: Record<string, GalleryItem[]> = {\n${paths.join(',\n')}\n}\n`

  await fs.mkdir(path.dirname(galleryOutputByGroup[group]), { recursive: true })
  await fs.writeFile(galleryOutputByGroup[group], output)
}

async function main() {
  if (!await ensureFfmpeg()) {
    console.log('[fatal] ffmpeg is required but was not found in PATH')
    process.exit(1)
  }

  for (const group of Object.keys(groupFolders)) {
    const galleries = await scanGroup(group)
    await writeGalleries(group, galleries)
  }
}

async function ensureFfmpeg() {
  const result = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8', stdio: 'ignore' })
  return result.status === 0
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
