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

const webImageExt = new Set(['.jpg', '.jpeg', '.jpe', '.png', '.gif', '.webp', '.avif'])
const convertImageExt = new Set(['.heic', '.heif', '.tif', '.tiff', '.bmp'])
const skipVideoExt = new Set(['.mov', '.mp4', '.webm'])
const discoverableExt = new Set([...webImageExt, ...convertImageExt])

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

function magickConvert(input, output) {
  const result = spawnSync('magick', [input, output], {
    encoding: 'utf8',
    stdio: 'ignore',
  })

  return result.status === 0
}

function heifConvert(input, output) {
  const result = spawnSync('heif-convert', [input, output], {
    encoding: 'utf8',
    stdio: 'ignore',
  })

  return result.status === 0
}

// HEIC/HEIF files are HEVC tile grids - ffmpeg would only extract a thumbnail
// tile, so they require a real HEIF decoder (heif-convert or ImageMagick with
// libheif). Plain TIFF/BMP convert fine with ffmpeg.
function convertImage(input, output, ext) {
  if (ext === '.heic' || ext === '.heif') {
    if (heifConvert(input, output)) return 'heif-convert'
    if (magickConvert(input, output)) return 'magick'
    return null
  }

  return ffmpegConvert(input, output) ? 'ffmpeg' : null
}

async function removeSidecarOutputs(sourceDir, outputName) {
  const base = outputName.replace(/\.[^.]+$/, '')
  const entries = await listFiles(sourceDir)
  for (const entry of entries) {
    if (entry.isFile() && entry.name.startsWith(`${base}-`) && /\.jpe?g$/i.test(entry.name)) {
      await fs.rm(path.join(sourceDir, entry.name), { force: true })
    }
  }
}

function convertedFileName(fileName) {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.heic.jpg')) {
    return fileName.slice(0, fileName.length - '.heic.jpg'.length) + '.jpg'
  }
  if (lower.endsWith('.heif.jpg')) {
    return fileName.slice(0, fileName.length - '.heif.jpg'.length) + '.jpg'
  }

  const ext = path.extname(fileName)
  if (convertImageExt.has(ext.toLowerCase())) {
    return `${fileName.slice(0, fileName.length - ext.length)}.jpg`
  }

  return null
}

function isConvertible(fileName) {
  const lower = fileName.toLowerCase()
  return lower.endsWith('.heic.jpg') || lower.endsWith('.heif.jpg') || convertImageExt.has(path.extname(fileName).toLowerCase())
}

function probeAspectRatio(filePath) {
  const result = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', filePath], {
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    return '4 / 3'
  }

  const first = (result.stdout.trim().split('\n')[0] ?? '').trim()
  const [width, height] = first.split('x').map((value) => Number.parseInt(value, 10))
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return '4 / 3'
  }

  return `${width} / ${height}`
}

async function collectFolders(sourceDir) {
  const folders = []

  async function walk(currentDir) {
    try {
      const entries = await listFiles(currentDir)
      const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
      const imageFiles = entries.filter((entry) => entry.isFile() && discoverableExt.has(path.extname(entry.name).toLowerCase()))

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

// Minimal EXIF reader: pulls the capture date straight out of JPEG metadata
// so sorting works on any machine without external tools.
function readExifCaptureDate(buffer) {
  try {
    if (buffer.length < 12 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
      return null
    }

    let offset = 2
    while (offset + 4 <= buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1
        continue
      }

      const marker = buffer[offset + 1]
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2
        continue
      }
      if (marker === 0xda || marker === 0xd9) {
        break
      }

      const segmentLength = buffer.readUInt16BE(offset + 2)
      if (marker === 0xe1 && segmentLength >= 8 && buffer.toString('latin1', offset + 4, offset + 8) === 'Exif') {
        const date = readExifDateFromTiff(buffer, offset + 10)
        if (date) {
          return date
        }
      }

      offset += 2 + segmentLength
    }
  } catch {
    // malformed EXIF - fall back to file dates
  }

  return null
}

function readExifDateFromTiff(buffer, tiffStart) {
  if (tiffStart + 8 > buffer.length) {
    return null
  }

  const byteOrder = buffer.toString('latin1', tiffStart, tiffStart + 2)
  const little = byteOrder === 'II'
  if (!little && byteOrder !== 'MM') {
    return null
  }

  const read16 = (offset) => (little ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset))
  const read32 = (offset) => (little ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset))
  const dateAt = (entryOffset) => {
    const type = read16(entryOffset + 2)
    const count = read32(entryOffset + 4)
    if (type !== 2 || count < 19) {
      return null
    }
    const valueOffset = count <= 4 ? entryOffset + 8 : tiffStart + read32(entryOffset + 8)
    if (valueOffset + 19 > buffer.length) {
      return null
    }
    const raw = buffer.toString('latin1', valueOffset, valueOffset + 19)
    const match = raw.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}:\d{2}:\d{2})$/)
    return match ? `${match[1]}-${match[2]}-${match[3]}T${match[4]}` : null
  }
  const scanIfd = (ifdOffset) => {
    if (ifdOffset < 0 || ifdOffset + 2 > buffer.length) {
      return null
    }
    const entryCount = read16(ifdOffset)
    let subIfd = null
    let original = null
    let digitized = null
    let modify = null
    for (let index = 0; index < entryCount; index += 1) {
      const entryOffset = ifdOffset + 2 + index * 12
      if (entryOffset + 12 > buffer.length) {
        break
      }
      const tag = read16(entryOffset)
      if (tag === 0x8769) {
        subIfd = tiffStart + read32(entryOffset + 8)
      } else if (tag === 0x9003 && !original) {
        original = dateAt(entryOffset)
      } else if (tag === 0x9004 && !digitized) {
        digitized = dateAt(entryOffset)
      } else if (tag === 0x0132 && !modify) {
        modify = dateAt(entryOffset)
      }
    }
    return { subIfd, original, digitized, modify }
  }

  const ifd0 = scanIfd(tiffStart + read32(tiffStart + 4))
  if (!ifd0) {
    return null
  }

  let date = ifd0.original ?? ifd0.digitized
  if (!date && ifd0.subIfd !== null) {
    const exifIfd = scanIfd(ifd0.subIfd)
    if (exifIfd) {
      date = exifIfd.original ?? exifIfd.digitized ?? exifIfd.modify
    }
  }

  return date ?? ifd0.modify ?? null
}

async function normalizeFolder(sourceDir, label, folder) {
  try {
    await fs.access(sourceDir)
  } catch {
    console.log(`[skip] ${label}: source folder does not exist`)
    return []
  }

  const files = (await listFiles(sourceDir)).filter((entry) => entry.isFile())
  const sorted = files.sort((a, b) => a.name.localeCompare(b.name))

  let converted = 0
  let copied = 0
  let skipped = 0
  let ignored = 0
  const gallery = []

  for (const file of sorted) {
    const input = path.join(sourceDir, file.name)
    const ext = path.extname(file.name).toLowerCase()

    if (skipVideoExt.has(ext)) {
      skipped += 1
      console.log(`[skip] video left in place: ${path.relative(projectRoot, input)}`)
      continue
    }

    if (isConvertible(file.name)) {
      const outputName = convertedFileName(file.name)
      if (!outputName) {
        continue
      }

      const output = path.join(sourceDir, outputName)
      await fs.rm(output, { force: true })

      const tool = convertImage(input, output, ext)
      if (!tool) {
        console.log(`[warn] no decoder could convert ${input} - original left in place`)
        console.log('[warn] hint: install a HEIC decoder (sudo dnf install libheif-tools) or drop JPG exports instead')
        continue
      }
      console.log(`[convert] ${tool}: ${file.name} -> ${outputName}`)

      converted += 1
      await fs.rm(input, { force: true })
      await removeSidecarOutputs(sourceDir, outputName)

      const mtime = (await fs.stat(output)).mtimeMs
      const captured = (await readExifCaptureDate(await fs.readFile(output))) ?? new Date(mtime).toISOString()
      gallery.push({
        title: `${label}-${outputName}`,
        src: outputName,
        alt: `${label} trip image`,
        aspectRatio: probeAspectRatio(output),
        folder,
        capturedAt: captured,
      })

      continue
    }

    if (webImageExt.has(ext)) {
      copied += 1
      const mtime = (await fs.stat(input)).mtimeMs
      const captured = (await readExifCaptureDate(await fs.readFile(input))) ?? new Date(mtime).toISOString()
      gallery.push({
        title: `${label}-${file.name}`,
        src: file.name,
        alt: `${label} trip image`,
        aspectRatio: probeAspectRatio(input),
        folder,
        capturedAt: captured,
      })
    } else {
      ignored += 1
    }
  }

  console.log(`[ok] ${label}: converted=${converted}, copied=${copied}, skipped=${skipped}, ignored=${ignored}, total=${converted + copied}`)
  return gallery
}

function folderLabel(name) {
  const stripped = name.replace(/^\d+[-_. ]+/, '')
  const words = stripped.replace(/[{}()]+/g, ' ').replace(/[-_.]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (words === '') {
    return name
  }

  return words.replace(/\b\w/g, (char) => char.toUpperCase())
}

function folderOrder(name) {
  const match = name.match(/^(\d+)[-_. ]/)
  return match ? Number.parseInt(match[1], 10) : null
}

function relativeFolderPath(groupRoot, folderPath) {
  return path.relative(groupRoot, folderPath).split(path.sep).join('/')
}

async function folderAddedAt(folderPath) {
  try {
    const stats = await fs.stat(folderPath)
    return new Date(stats.birthtimeMs || stats.mtimeMs).toISOString()
  } catch {
    return new Date(0).toISOString()
  }
}

async function scanGroup(group) {
  const groupRoot = path.join(mediaRoot, group)

  try {
    await fs.access(groupRoot)
  } catch {
    return { galleries: {}, folders: [] }
  }

  const observedFolders = await collectFolders(groupRoot)
  const galleries = {}
  const folders = []

  for (const folderPath of observedFolders) {
    const relative = relativeFolderPath(groupRoot, folderPath)
    const name = relative === '' ? group : path.basename(folderPath)
    const key = relative === '' ? group : relative
    const items = await normalizeFolder(folderPath, folderLabel(name), key)

    if (items.length === 0) {
      continue
    }

    galleries[key] = items
    folders.push({
      key,
      path: relative,
      name,
      title: name,
      section: relative === '' ? group : relative.split('/')[0],
      order: folderOrder(name),
      addedAt: await folderAddedAt(folderPath),
      count: items.length,
    })
  }

  return { galleries, folders }
}

async function writeGalleries(group, data) {
  const { galleries, folders } = data
  const groupFoldersList = Object.keys(galleries)
  const paths = groupFoldersList.map((folder) => {
    const items = galleries[folder] ?? []
    const itemRows = items.map((item) => `    { title: ${JSON.stringify(item.title)}, src: ${JSON.stringify(item.src)}, alt: ${JSON.stringify(item.alt)}, aspectRatio: ${JSON.stringify(item.aspectRatio)}, folder: ${JSON.stringify(item.folder)}, capturedAt: ${JSON.stringify(item.capturedAt)} }`)
    return `  ${JSON.stringify(folder)}: [\n${itemRows.join(',\n')}\n  ]`
  })

  const folderRows = folders.map((folder) => `    { key: ${JSON.stringify(folder.key)}, path: ${JSON.stringify(folder.path)}, name: ${JSON.stringify(folder.name)}, title: ${JSON.stringify(folder.title)}, section: ${JSON.stringify(folder.section)}, order: ${folder.order === null ? 'null' : folder.order}, count: ${folder.count}, addedAt: ${JSON.stringify(folder.addedAt)} }`)

  const output = `import type { GalleryItem, GeneratedGalleryFolder } from '../../types'\n\nexport const generatedLocationGalleries: Record<string, GalleryItem[]> = {\n${paths.join(',\n')}\n}\n\nexport const generatedGalleryFolders: GeneratedGalleryFolder[] = [\n${folderRows.join(',\n')}\n]\n`

  await fs.mkdir(path.dirname(galleryOutputByGroup[group]), { recursive: true })
  await fs.writeFile(galleryOutputByGroup[group], output)
}

async function main() {
  if (!await ensureFfmpeg()) {
    console.log('[fatal] ffmpeg is required but was not found in PATH')
    process.exit(1)
  }

  for (const group of Object.keys(groupFolders)) {
    const data = await scanGroup(group)
    await writeGalleries(group, data)
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
