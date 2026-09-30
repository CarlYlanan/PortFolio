#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const filesDir = path.join(scriptDir, 'files')
const outputFile = path.join(scriptDir, 'generatedArticles.ts')

const META_KEY = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/
const HEADING = /^#\s+(.*)$/
const BULLET = /^[-*]\s+(.*)$/
const REFERENCE = /^\^\s*(.*)$/

async function listTextFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.txt') && !entry.name.startsWith('_') && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

function slugify(value) {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return slug === '' ? 'article' : slug
}

function titleFromId(id) {
  return id.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function parseReference(line) {
  const separator = line.indexOf('|')
  if (separator === -1) return null
  const title = line.slice(0, separator).trim()
  const url = line.slice(separator + 1).trim()
  if (title === '' || url === '') return null
  return { title, url }
}

function parseSource(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const meta = {}
  let index = 0

  // Leading `key: value` lines form the front matter block.
  for (; index < lines.length; index += 1) {
    const line = lines[index]
    if (line.trim() === '') continue
    const match = line.match(META_KEY)
    if (!match) break
    meta[match[1].toLowerCase()] = match[2].trim()
  }

  const sections = []
  let current = null

  const ensureSection = () => {
    if (current === null) {
      current = { title: meta.title || 'Overview', bodyLines: [], bullets: [], references: [] }
      sections.push(current)
    }
    return current
  }

  for (; index < lines.length; index += 1) {
    const line = lines[index]

    const heading = line.match(HEADING)
    if (heading) {
      current = { title: heading[1].trim(), bodyLines: [], bullets: [], references: [] }
      sections.push(current)
      continue
    }

    const bullet = line.match(BULLET)
    if (bullet) {
      ensureSection().bullets.push(bullet[1].trim())
      continue
    }

    const reference = line.match(REFERENCE)
    if (reference) {
      const parsed = parseReference(reference[1])
      if (parsed) ensureSection().references.push(parsed)
      continue
    }

    ensureSection().bodyLines.push(line)
  }

  return { meta, sections }
}

function finalizeSection(section, usedIds) {
  const baseId = slugify(section.title)
  let id = baseId
  let counter = 2
  while (usedIds.has(id)) {
    id = `${baseId}-${counter}`
    counter += 1
  }
  usedIds.add(id)

  const finalized = {
    id,
    title: section.title,
    body: section.bodyLines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
  }
  if (section.bullets.length > 0) finalized.bullets = section.bullets
  if (section.references.length > 0) finalized.references = section.references
  return finalized
}

function buildArticle(fileName, source, stats) {
  const { meta, sections } = parseSource(source)
  const id = slugify(meta.id || fileName.replace(/\.txt$/i, ''))
  const usedIds = new Set()

  const article = {
    id,
    title: meta.title || titleFromId(id),
    summary: meta.summary || '',
    sections: sections.map((section) => finalizeSection(section, usedIds)),
  }
  if (meta.updated) article.updated = meta.updated

  const parsed = Date.parse(meta.updated || '')
  const time = Number.isNaN(parsed) ? (stats.birthtimeMs || stats.mtimeMs) : parsed
  return { article, time }
}

function serializeArticle(article) {
  const lines = [
    '  {',
    `    id: ${JSON.stringify(article.id)},`,
    `    title: ${JSON.stringify(article.title)},`,
    `    summary: ${JSON.stringify(article.summary)},`,
  ]
  if (article.updated !== undefined) lines.push(`    updated: ${JSON.stringify(article.updated)},`)

  lines.push('    sections: [')
  for (const section of article.sections) {
    lines.push(
      '      {',
      `        id: ${JSON.stringify(section.id)},`,
      `        title: ${JSON.stringify(section.title)},`,
      `        body: ${JSON.stringify(section.body)},`,
    )
    if (section.bullets) {
      lines.push('        bullets: [')
      for (const bullet of section.bullets) lines.push(`          ${JSON.stringify(bullet)},`)
      lines.push('        ],')
    }
    if (section.references) {
      lines.push('        references: [')
      for (const reference of section.references) lines.push(`          { title: ${JSON.stringify(reference.title)}, url: ${JSON.stringify(reference.url)} },`)
      lines.push('        ],')
    }
    lines.push('      },')
  }
  lines.push('    ],', '  },')
  return lines.join('\n')
}

function render(articles) {
  const header = [
    '// AUTO-GENERATED by src/data/articles/extract-articles.mjs - do not edit by hand.',
    '// Drop *.txt files in src/data/articles/files, then run `pnpm articles:extract`',
    '// (or save a file while `pnpm dev` is running) to regenerate this module.',
    "import type { Article } from '../../types'",
    '',
  ].join('\n')

  const body = articles.length === 0
    ? 'export const generatedArticles: Article[] = []\n'
    : `export const generatedArticles: Article[] = [\n${articles.map(serializeArticle).join('\n')}\n]\n`

  return `${header}\n${body}`
}

export async function extractArticles() {
  const names = await listTextFiles(filesDir)
  const rows = []

  for (const name of names) {
    const filePath = path.join(filesDir, name)
    const source = await fs.readFile(filePath, 'utf8')
    const stats = await fs.stat(filePath)
    const { article, time } = buildArticle(name, source, stats)

    if (article.sections.length === 0) {
      console.log(`[skip] ${name}: no sections found`)
      continue
    }

    rows.push({ article, time })
  }

  rows.sort((left, right) => right.time - left.time || left.article.title.localeCompare(right.article.title))

  const articles = rows.map((row) => row.article)
  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  await fs.writeFile(outputFile, render(articles))

  return { count: articles.length, outputFile }
}

const invokedDirectly = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (invokedDirectly) {
  extractArticles()
    .then(({ count, outputFile }) => {
      console.log(`[ok] articles: ${count} file(s) -> ${path.relative(process.cwd(), outputFile)}`)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
