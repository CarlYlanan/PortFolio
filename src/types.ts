export type TabId = 'home' | 'about' | 'larper' | 'setup' | 'social'

export interface NavigationTab { id: TabId; label: string }
export interface SectionMarker { id: string; label: string }
export interface ReferenceLink { title: string; url: string }
export interface BulletItem { item: string; usage: string; url?: string }
export type BulletEntry = string | BulletItem
export interface GalleryItem { title: string; src: string; alt?: string; aspectRatio?: string; folder?: string; capturedAt?: string }
export interface ContentSection { id: string; title: string; body: string; bullets?: BulletEntry[]; references?: ReferenceLink[]; rootLink?: ReferenceLink; gallery?: GalleryItem[]; mediaFolder?: string }
export interface StandardTabContent {
  id: Exclude<TabId, 'social'>
  eyebrow: string
  title: string
  summary: string
  sections: ContentSection[]
  markers: SectionMarker[]
}
export interface SocialEntry { id: string; name: string; url: string; reason: string }
export interface SocialTabContent {
  id: 'social'
  eyebrow: string
  title: string
  summary: string
  socials: SocialEntry[]
  markers: SectionMarker[]
}
export type TabContent = StandardTabContent | SocialTabContent