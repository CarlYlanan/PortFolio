import type { ContentSection, GalleryGroup, GalleryItem, GeneratedGalleryFolder, SectionMarker } from '../../types'
import { generatedGalleryFolders, generatedLocationGalleries } from './generatedLocationGalleries'

interface FolderOverride { section?: string; title?: string; pinned?: string[]; hidden?: boolean; order?: number }

// Exceptions to the folder conventions, keyed by path relative to /media/gallery.
// Everything not listed here is generated from the folder structure.
const OVERRIDES: Record<string, FolderOverride> = {
  favourites: { title: 'Media', pinned: ['kenma.jpg'] },
  'favourites/games': { hidden: true },
  // Ordering only - titles come from the folder names themselves.
  'travels/japan {6 Sep 2024 - 14 Sep 2024}': { order: 1 },
  'travels/japan {21 Nov 2025 - 27 Nov 2025}': { order: 2 },
}

// Top-level folder order. Unlisted folders sort alphabetically after these.
const SECTION_ORDER = ['favourites', 'travels']

function titleCase(value: string): string {
  const words = value.replace(/[-_.]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (words === '') {
    return value
  }

  return words.replace(/\b\w/g, (char) => char.toUpperCase())
}

function withPinnedFirst(items: GalleryItem[], pinned: string[]): GalleryItem[] {
  const front = pinned
    .map((src) => items.find((item) => item.src === src))
    .filter((item): item is GalleryItem => item !== undefined)
  const rest = items.filter((item) => !pinned.includes(item.src))
  return [...front, ...rest]
}

function slugify(value: string): string {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return slug === '' ? 'gallery' : slug
}

function sectionRank(key: string): number {
  const index = SECTION_ORDER.indexOf(key)
  return index === -1 ? SECTION_ORDER.length : index
}

export function buildGallery(): { sections: ContentSection[]; markers: SectionMarker[] } {
  // Un-pinned carousels stack by addition order (folder creation time), newest at the bottom.
  const addedTime = (folder: GeneratedGalleryFolder) => {
    const parsed = Date.parse(folder.addedAt ?? '')
    return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed
  }

  const folders = [...generatedGalleryFolders].sort((a, b) => {
    const left = OVERRIDES[a.key]?.order ?? a.order ?? Number.MAX_SAFE_INTEGER
    const right = OVERRIDES[b.key]?.order ?? b.order ?? Number.MAX_SAFE_INTEGER
    return left - right || addedTime(a) - addedTime(b) || a.title.localeCompare(b.title)
  })

  const groupsBySection = new Map<string, GalleryGroup[]>()

  for (const folder of folders) {
    const items = generatedLocationGalleries[folder.key] ?? []
    if (items.length === 0) {
      continue
    }

    const override = OVERRIDES[folder.key] ?? {}
    if (override.hidden) {
      continue
    }

    const group: GalleryGroup = {
      id: `gallery-${slugify(folder.path)}`,
      title: override.title ?? folder.title,
      mediaFolder: folder.path === '' ? '/media/gallery' : `/media/gallery/${folder.path}`,
      items: override.pinned ? withPinnedFirst(items, override.pinned) : items,
      sortBy: override.pinned ? 'custom' : 'date',
    }

    const section = override.section ?? folder.section
    const existing = groupsBySection.get(section)
    if (existing) {
      existing.push(group)
    } else {
      groupsBySection.set(section, [group])
    }
  }

  const sectionKeys = [...groupsBySection.keys()].sort((a, b) => sectionRank(a) - sectionRank(b) || a.localeCompare(b))

  const sections: ContentSection[] = sectionKeys.map((key) => ({
    id: slugify(key),
    title: titleCase(key),
    body: '',
    galleries: groupsBySection.get(key) ?? [],
  }))

  const markers: SectionMarker[] = sections.map((section, index) => ({
    id: section.id,
    label: `${String(index + 1).padStart(2, '0')} // ${section.title.toLowerCase()}`,
  }))

  return { sections, markers }
}