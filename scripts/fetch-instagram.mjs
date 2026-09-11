#!/usr/bin/env node
// Instagram → portfolio sync.
//
// Usage:
//   pnpm fetch:instagram <username> [--limit N]
//   INSTAGRAM_USERNAME=carly pnpm fetch:instagram
//
// - Tries keyless anonymous access (public endpoints, no login) first.
//   Instagram now IP-gates anonymous access on many networks; if that
//   happens, export your browser's `sessionid` cookie and run with
//   INSTAGRAM_SESSIONID=… — your normal Instagram login, not an API key.
// - 429 rate-limit responses are retried with increasing backoff.
// - Downloads every post's display image into public/media/social/instagram/
//   (already-downloaded posts are skipped, so runs are incremental).
// - Regenerates src/data/social/generatedInstagramPosts.ts with ALL posts,
//   newest first, each carrying a `link` back to the original post.
// - On failure the previously generated file is left untouched, so the site
//   keeps working with the last good data.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const mediaDir = path.join(projectRoot, 'public', 'media', 'social', 'instagram')
const outputTs = path.join(projectRoot, 'src', 'data', 'social', 'generatedInstagramPosts.ts')

// Preview placeholders created while waiting for the first real sync.
// Once a real sync succeeds, these are no longer referenced and get removed.
const DEMO_IMAGE_PREFIX = 'demo-'

const IG_APP_ID = '936619743392459'
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const PAGE_SIZE = 33
const MAX_PAGES = 500
const REQUEST_DELAY_MS = 450
const RETRIES = 3
const BACKOFF_MS = 45_000
const DOWNLOAD_CONCURRENCY = 4

function parseArgs(argv) {
  const args = { username: '', limit: Infinity, probe: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--limit') {
      i += 1
      args.limit = Number.parseInt(argv[i], 10)
    } else if (arg === '--probe') {
      args.probe = true
    } else if (!arg.startsWith('--') && args.username === '') {
      args.username = arg
    }
  }
  if (args.username === '') args.username = process.env.INSTAGRAM_USERNAME ?? ''
  return args
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Instagram's web API needs cookies. We first try fully anonymous:
// visit the profile page, harvest Set-Cookie (csrftoken, ig_did, …)
// and replay them on every API call. Many networks are now IP-gated
// ("require_login"), so if you export your own browser session cookie
// (INSTAGRAM_SESSIONID — your normal Instagram login, not an API key)
// it is used as a reliable fallback.
const cookieJar = new Map()

function storeCookies(response) {
  for (const cookie of response.headers.getSetCookie?.() ?? []) {
    const pair = cookie.split(';')[0]
    const eq = pair.indexOf('=')
    if (eq > 0) cookieJar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
}

function igHeaders(referer) {
  const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'referer': referer,
    'user-agent': USER_AGENT,
    'x-ig-app-id': IG_APP_ID,
    'x-requested-with': 'XMLHttpRequest',
  }
  if (cookieJar.size > 0) {
    headers.cookie = cookieHeader()
    const csrf = cookieJar.get('csrftoken')
    if (csrf) headers['x-csrftoken'] = csrf
  }
  return headers
}

async function bootstrapSession(username) {
  if (process.env.INSTAGRAM_SESSIONID && !cookieJar.has('sessionid')) {
    cookieJar.set('sessionid', process.env.INSTAGRAM_SESSIONID)
  }
  const response = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
    headers: {
      'accept': 'text/html,application/xhtml+xml',
      'accept-language': 'en-US,en;q=0.9',
      'user-agent': USER_AGENT,
    },
    redirect: 'follow',
  })
  storeCookies(response)
  if (!response.ok && response.status !== 302) {
    throw new Error(`could not open instagram.com/${username} (HTTP ${response.status})`)
  }
}

async function fetchJson(url, referer) {
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(url, { headers: igHeaders(referer) })
    storeCookies(response)
    if (response.ok) return response.json()

    // 429 = temporary rate limit ("wait a few minutes") — back off and retry.
    if (response.status === 429 && attempt < RETRIES) {
      const wait = BACKOFF_MS * (attempt + 1)
      console.log(`[wait] rate-limited (429), retrying in ${Math.round(wait / 1000)}s …`)
      await sleep(wait)
      continue
    }
    throw new Error(`HTTP ${response.status} ${response.statusText} for ${new URL(url).pathname}`)
  }
}

async function fetchProfile(username) {
  await bootstrapSession(username)
  const encoded = encodeURIComponent(username)

  // Primary: public web profile endpoint (www host, cookie-bootstrapped).
  try {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encoded}`
    const json = await fetchJson(url, `https://www.instagram.com/${username}/`)
    const user = json?.data?.user
    if (user) return user
  } catch (error) {
    if (!process.env.INSTAGRAM_SESSIONID) {
      console.log('[warn] anonymous access rejected — Instagram is IP-gating this network.')
      console.log('[warn] re-run with INSTAGRAM_SESSIONID=<your browser cookie> for a reliable sync (see deploy/README.md).')
    }
    console.log(`[warn] www host failed: ${error.message}`)
  }

  // Fallback: same endpoint on the mobile API host.
  const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encoded}`
  const json = await fetchJson(url, `https://www.instagram.com/${username}/`)
  const user = json?.data?.user
  if (!user) {
    throw new Error(`profile "@${username}" not found (or Instagram returned an unexpected payload)`)
  }
  return user
}

async function fetchFeedPage(userId, maxId) {
  const base = `https://www.instagram.com/api/v1/feed/user/${userId}/`
  const url = maxId
    ? `${base}?count=${PAGE_SIZE}&max_id=${encodeURIComponent(maxId)}`
    : `${base}?count=${PAGE_SIZE}`
  return fetchJson(url, 'https://www.instagram.com/')
}

function postFromApiItem(item, username) {
  const code = item.code
  if (!code) return null

  const media = item.carousel_media?.[0] ?? item
  const candidates = media.image_versions2?.candidates ?? []
  const candidate = candidates.find((c) => (c.width ?? 0) > 0 && (c.width ?? 0) <= 1440) ?? candidates[0]
  if (!candidate?.url) return null

  const takenAt = new Date((item.taken_at ?? 0) * 1000).toISOString()
  const caption = item.caption?.text ?? ''
  const snippet = caption.split('\n')[0].trim().slice(0, 48)
  const width = media.dimensions?.width ?? 4
  const height = media.dimensions?.height ?? 5

  return {
    code,
    src: `${code}.jpg`,
    displayUrl: candidate.url,
    title: snippet !== '' ? snippet : `instagram-${code}`,
    alt: caption !== '' ? caption.slice(0, 140) : `Instagram post by @${username}`,
    aspectRatio: `${width} / ${height}`,
    capturedAt: takenAt,
    link: `https://www.instagram.com/p/${code}/`,
  }
}

async function collectAllPosts(username, limit) {
  const profile = await fetchProfile(username)
  const userId = profile.pk ?? profile.id
  if (!userId) throw new Error('could not resolve user id from profile')

  const posts = []
  const seen = new Set()
  let maxId = null
  let pages = 0

  while (pages < MAX_PAGES) {
    const feed = await fetchFeedPage(userId, maxId)
    const items = feed?.items ?? []
    if (items.length === 0) break

    for (const item of items) {
      const post = postFromApiItem(item, username)
      if (post && !seen.has(post.code)) {
        seen.add(post.code)
        posts.push(post)
      }
      if (posts.length >= limit) break
    }

    pages += 1
    maxId = feed?.next_max_id ?? null
    const moreAvailable = Boolean(feed?.more_available) && Boolean(maxId)
    if (posts.length >= limit || !moreAvailable) break

    await sleep(REQUEST_DELAY_MS + Math.random() * 250)
  }

  return { profile, posts }
}

async function downloadNewImages(posts) {
  await fs.mkdir(mediaDir, { recursive: true })
  const existing = new Set(await fs.readdir(mediaDir))
  // Drop stale preview images now that the real gallery is in play.
  for (const name of existing) {
    if (name.startsWith(DEMO_IMAGE_PREFIX)) {
      await fs.rm(path.join(mediaDir, name), { force: true })
      console.log(`[cleanup] removed preview image ${name}`)
    }
  }
  const pending = posts.filter((post) => !existing.has(post.src))

  let downloaded = 0
  let failed = 0
  const queue = [...pending]

  async function worker() {
    while (queue.length > 0) {
      const post = queue.shift()
      try {
        const response = await fetch(post.displayUrl, { headers: { 'user-agent': USER_AGENT, referer: 'https://www.instagram.com/' } })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const buffer = Buffer.from(await response.arrayBuffer())
        await fs.writeFile(path.join(mediaDir, post.src), buffer)
        downloaded += 1
      } catch (error) {
        failed += 1
        console.log(`[warn] failed to download ${post.src}: ${error.message}`)
      }
      await sleep(120 + Math.random() * 180)
    }
  }

  await Promise.all(Array.from({ length: Math.min(DOWNLOAD_CONCURRENCY, queue.length) }, worker))
  return { downloaded, failed }
}

async function writeGeneratedFile(username, posts) {
  const profileUrl = `https://www.instagram.com/${username}/`
  const usedTitles = new Set()

  const rows = posts.map((post) => {
    let title = post.title
    if (usedTitles.has(title)) title = `${title} · ${post.code}`
    usedTitles.add(title)

    return `    { title: ${JSON.stringify(title)}, src: ${JSON.stringify(post.src)}, alt: ${JSON.stringify(post.alt)}, aspectRatio: ${JSON.stringify(post.aspectRatio)}, folder: 'instagram', capturedAt: ${JSON.stringify(post.capturedAt)}, link: ${JSON.stringify(post.link)} }`
  })

  const output = `import type { GalleryItem } from '../../types'

// AUTO-GENERATED by scripts/fetch-instagram.mjs — do not edit by hand.
// Last synced: ${new Date().toISOString()}

export const instagramProfile = { handle: ${JSON.stringify(username)}, profileUrl: ${JSON.stringify(profileUrl)} }

export const generatedInstagramPosts: GalleryItem[] = [
${rows.join(',\n')}
]
`

  await fs.mkdir(path.dirname(outputTs), { recursive: true })
  await fs.writeFile(outputTs, output)
}

async function main() {
  const { username, limit, probe } = parseArgs(process.argv.slice(2))
  if (username === '') {
    console.log('[fatal] no username given. Usage: pnpm fetch:instagram <username> [--limit N]')
    process.exit(1)
  }

  if (probe) {
    // Single lightweight request — no retries, no backoff. Exit 0 if the API is
    // reachable, exit 1 if rate-limited or unreachable (so the sync script can
    // skip cleanly without extending any active cooldown).
    console.log(`[probe] checking API status for @${username} …`)
    try {
      await bootstrapSession(username)
      const encoded = encodeURIComponent(username)
      const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encoded}`
      const probeResult = await fetchJson(url, `https://www.instagram.com/${username}/`, { retries: 0 })
      const user = probeResult?.data?.user
      if (!user) {
        console.log(`[probe] responded but no user data for @${username}`)
        process.exit(1)
      }
      console.log(`[probe] ok — @${username} reachable (${user.username}, ${user.follower_count ?? '?'} followers)`)
      process.exit(0)
    } catch (error) {
      console.log(`[probe] blocked: ${error.message}`)
      process.exit(1)
    }
  }

  console.log(`[sync] fetching posts for @${username}${Number.isFinite(limit) ? ` (limit ${limit})` : ''} …`)
  let result
  try {
    result = await collectAllPosts(username, limit)
  } catch (error) {
    console.log(`[fatal] could not fetch Instagram data: ${error.message}`)
    console.log('[fatal] keeping the previously generated file untouched (site still builds with last good data).')
    process.exit(1)
  }

  const { posts } = result
  posts.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime())

  if (posts.length === 0) {
    console.log('[fatal] no posts found — refusing to overwrite the generated file with an empty gallery.')
    process.exit(1)
  }

  const { downloaded, failed } = await downloadNewImages(posts)
  if (downloaded === 0 && failed > 0) {
    console.log('[fatal] every image download failed — keeping the previously generated file untouched.')
    process.exit(1)
  }

  await writeGeneratedFile(username, posts)

  console.log(`[ok] @${username}: posts=${posts.length}, downloaded=${downloaded}, already-present=${posts.length - downloaded - failed}, failed=${failed}`)
  console.log(`[ok] wrote ${path.relative(projectRoot, outputTs)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})