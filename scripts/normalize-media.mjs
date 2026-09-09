#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const mediaRoot = path.join(projectRoot, 'public', 'media', 'home', 'locations')
const galleryOutput = path.join(projectRoot, 'src', 'data', 'home', 'generatedLocationGalleries.ts')
const sourceFolders = ['japan1', 'japan2', 'sydney', 'sports']

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

async function normalizeFolder(folder) {
  const sourceDir = path.join(mediaRoot, folder)

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
    const lowerName = file.name.toLowerCase()

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

async function writeGalleries(galleries) {
  const paths = sourceFolders.map((folder) => {
    const items = galleries[folder] ?? []
    const itemRows = items.map((item) => `    { title: ${JSON.stringify(item.title)}, src: ${JSON.stringify(item.src)}, alt: ${JSON.stringify(item.alt)}, aspectRatio: ${JSON.stringify(item.aspectRatio)}, folder: ${JSON.stringify(item.folder)}, capturedAt: ${JSON.stringify(item.capturedAt)} }`)
    return `  ${JSON.stringify(folder)}: [\n${itemRows.join(',\n')}\n  ]`
  })

  const output = `import type { GalleryItem } from '../../types'\n\nexport const generatedLocationGalleries: Record<string, GalleryItem[]> = {\n${paths.join(',\n')}\n}\n`

  await fs.mkdir(path.dirname(galleryOutput), { recursive: true })
  await fs.writeFile(galleryOutput, output)
}

async function main() {
  if (!await ensureFfmpeg()) {
    console.log('[fatal] ffmpeg is required but was not found in PATH')
    process.exit(1)
  }

  const galleries = {}
  for (const folder of sourceFolders) {
    galleries[folder] = await normalizeFolder(folder)
  }

  await writeGalleries(galleries)
}

async function ensureFfmpeg() {
  const result = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8', stdio: 'ignore' })
  return result.status === 0
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
