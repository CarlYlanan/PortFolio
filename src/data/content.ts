import type { NavigationTab, TabContent, TabId } from '../types'
import { friendsContent } from './social/friendsContent'
import { homeContent } from './home/homeContent'
import { galleryContent } from './gallery/galleryContent'
import { articlesContent } from './articles/articlesContent'
import { setupContent } from './setup/setupContent'

export const navigationTabs: NavigationTab[] = [
  { id: 'home', label: 'Home' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'larper', label: 'Articles' },
  { id: 'setup', label: 'Setup' },
  { id: 'social', label: 'Social' },
]

export const contentByTab: Record<TabId, TabContent> = {
  home: homeContent,
  gallery: galleryContent,
  larper: articlesContent,
  setup: setupContent,
  social: friendsContent,
}
