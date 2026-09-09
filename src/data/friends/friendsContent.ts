import type { FriendsTabContent } from '../../types'

export const friendsContent: FriendsTabContent = {
  id: 'friends', eyebrow: 'Friends / 04', title: 'People worth visiting.', summary: 'A short list of thoughtful people and places on the web.',
  friends: [
    { id: 'user1', name: 'User1', url: 'https://example.com/user1', reason: 'For making generous notes and sharing the process.' },
    { id: 'user2', name: 'User2', url: 'https://example.com/user2', reason: 'For a distinctive point of view and excellent projects.' },
    { id: 'user3', name: 'User3', url: 'https://example.com/user3', reason: 'For curiosity, kindness, and consistently good links.' },
  ], markers: [{ id: 'user1', label: '01 // user1' }, { id: 'user2', label: '02 // user2' }, { id: 'user3', label: '03 // user3' }],
}
