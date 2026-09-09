export type TabId = 'home' | 'about' | 'larper' | 'setup' | 'friends'

export interface NavigationTab { id: TabId; label: string }
export interface SectionMarker { id: string; label: string }
export interface ReferenceLink { title: string; url: string }
export interface BulletItem { item: string; usage: string; url?: string }
export type BulletEntry = string | BulletItem
export interface ContentSection { id: string; title: string; body: string; bullets?: BulletEntry[]; references?: ReferenceLink[]; rootLink?: ReferenceLink }
export interface StandardTabContent {
  id: Exclude<TabId, 'friends'>
  eyebrow: string
  title: string
  summary: string
  sections: ContentSection[]
  markers: SectionMarker[]
}
export interface FriendEntry { id: string; name: string; url: string; reason: string }
export interface FriendsTabContent {
  id: 'friends'
  eyebrow: string
  title: string
  summary: string
  friends: FriendEntry[]
  markers: SectionMarker[]
}
export type TabContent = StandardTabContent | FriendsTabContent