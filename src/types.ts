export type TabId = 'home' | 'about' | 'education' | 'setup' | 'friends'

export interface NavigationTab { id: TabId; label: string }
export interface SectionMarker { id: string; label: string }
export interface ContentSection { id: string; title: string; body: string }
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