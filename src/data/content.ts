import type { NavigationTab, TabContent, TabId } from '../types'
import { aboutContent } from './about/aboutContent'
import { friendsContent } from './friends/friendsContent'
import { homeContent } from './home/homeContent'
import { larperContent } from './larper/larperContent'
import { setupContent } from './setup/setupContent'

export const navigationTabs: NavigationTab[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'larper', label: 'Larper' },
  { id: 'setup', label: 'Setup' },
  { id: 'friends', label: 'Friends' },
]

export const contentByTab: Record<TabId, TabContent> = {
  home: homeContent,
  about: aboutContent,
  larper: larperContent,
  setup: setupContent,
  friends: friendsContent,
}
