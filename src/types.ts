export type TabId = 'home' | 'gallery' | 'larper' | 'setup' | 'social'

export interface NavigationTab { id: TabId; label: string }
export interface SectionMarker { id: string; label: string }
export interface ReferenceLink { title: string; url: string }
export interface BulletItem { item: string; usage: string; url?: string }
export type BulletEntry = string | BulletItem
export interface GalleryItem { title?: string; src: string; alt?: string; aspectRatio?: string; folder?: string; capturedAt?: string; link?: string }
export interface GeneratedGalleryFolder { key: string; path: string; name: string; title: string; section: string; order: number | null; count: number }
export interface GalleryGroup { id: string; title: string; mediaFolder?: string; items: GalleryItem[]; sortBy?: 'date' | 'name' | 'custom' }
export interface ContentSection { id: string; title: string; body: string; bullets?: BulletEntry[]; references?: ReferenceLink[]; rootLink?: ReferenceLink; galleries?: GalleryGroup[] }
export interface StandardTabContent {
  id: Exclude<TabId, 'social' | 'larper'>
  eyebrow: string
  title: string
  summary: string
  sections: ContentSection[]
  markers: SectionMarker[]
}
export interface SocialEntry { id: string; name: string; url: string; reason: string }
export interface InstagramContent {
  id: string
  handle: string
  profileUrl: string
  posts: GalleryItem[]
}
export interface SocialTabContent {
  id: 'social'
  eyebrow: string
  title: string
  summary: string
  instagram?: InstagramContent
  socials: SocialEntry[]
  markers: SectionMarker[]
}
export interface Article {
  id: string
  title: string
  summary: string
  updated?: string
  sections: ContentSection[]
}
export interface ArticlesTabContent {
  id: 'larper'
  eyebrow: string
  title: string
  summary: string
  articles: Article[]
}
export type TabContent = StandardTabContent | SocialTabContent | ArticlesTabContent