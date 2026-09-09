import type { FriendsTabContent, NavigationTab, StandardTabContent, TabContent, TabId } from '../types'

export const navigationTabs: NavigationTab[] = [
  { id: 'home', label: 'Home' }, { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' }, { id: 'setup', label: 'Setup' }, { id: 'friends', label: 'Friends' },
]

export const homeContent: StandardTabContent = {
  id: 'home', eyebrow: 'Portfolio / 2026', title: 'A quiet corner of the internet.',
  summary: 'Hi, I’m Carly. This is a small collection of the things I’m learning, making, and paying attention to.',
  sections: [
    { id: 'intro', title: '01 // intro', body: 'I enjoy building thoughtful digital spaces with simple interfaces and a little room to breathe.' },
    { id: 'summary', title: '02 // summary', body: 'Currently exploring front-end development, Linux, and the relationship between hardware and software.' },
    { id: 'stack', title: '03 // stack', body: 'React, TypeScript, CSS, Linux, and whatever tool helps turn a good idea into something tangible.' },
  ], markers: [{ id: 'intro', label: '01 // intro' }, { id: 'summary', label: '02 // summary' }, { id: 'stack', label: '03 // stack' }],
}

export const aboutContent: StandardTabContent = {
  id: 'about', eyebrow: 'About / 01', title: 'Curious by nature, careful by craft.', summary: 'A little context about the person behind the projects.',
  sections: [
    { id: 'statement', title: 'Personal Statement', body: 'I care about useful work, clear thinking, and making technology feel more human. The best projects are often the ones that do their job quietly.' },
    { id: 'interests', title: 'Interests', body: 'Interface design, self-hosting, accessible systems, small computers, long walks, and excellent documentation.' },
    { id: 'inspirations', title: 'Inspirations', body: 'Things made with restraint: old operating systems, independent magazines, carefully set type, and people who share what they learn.' },
  ], markers: [{ id: 'statement', label: '01 // statement' }, { id: 'interests', label: '02 // interests' }, { id: 'inspirations', label: '03 // inspirations' }],
}

export const educationContent: StandardTabContent = {
  id: 'education', eyebrow: 'Education / 02', title: 'Learning in public, one layer at a time.', summary: 'A working record of the concepts and subjects shaping my practice.',
  sections: [
    { id: 'overview', title: 'Academic Overview', body: 'Placeholder for degree details, institutions, dates, and the broader context behind my studies.' },
    { id: 'coursework', title: 'Coursework Highlights', body: 'Placeholder for courses in computer science, design, writing, systems thinking, or any other useful rabbit hole.' },
  ], markers: [{ id: 'overview', label: '01 // overview' }, { id: 'coursework', label: '02 // coursework' }],
}

export const setupContent: StandardTabContent = {
  id: 'setup', eyebrow: 'Setup / 03', title: 'Tools that stay out of the way.', summary: 'A practical inventory of the systems I use to think, make, and experiment.',
  sections: [
    { id: 'linux', title: 'Linux Setup', body: 'Placeholder for distribution, terminal, editor, window manager, and the small scripts that make the environment feel like home.' },
    { id: 'modded', title: 'Modded Systems', body: 'Placeholder for custom hardware, firmware, and the joy of understanding how a device works from the inside out.' },
    { id: 'pi-server', title: 'Pi Server', body: 'Placeholder for self-hosted services, local automations, and the tiny server quietly doing useful work.' },
  ], markers: [{ id: 'linux', label: '01 // linux' }, { id: 'modded', label: '02 // modded' }, { id: 'pi-server', label: '03 // pi-server' }],
}

export const friendsContent: FriendsTabContent = {
  id: 'friends', eyebrow: 'Friends / 04', title: 'People worth visiting.', summary: 'A short list of thoughtful people and places on the web.',
  friends: [
    { id: 'user1', name: 'User1', url: 'https://example.com/user1', reason: 'For making generous notes and sharing the process.' },
    { id: 'user2', name: 'User2', url: 'https://example.com/user2', reason: 'For a distinctive point of view and excellent projects.' },
    { id: 'user3', name: 'User3', url: 'https://example.com/user3', reason: 'For curiosity, kindness, and consistently good links.' },
  ], markers: [{ id: 'user1', label: '01 // user1' }, { id: 'user2', label: '02 // user2' }, { id: 'user3', label: '03 // user3' }],
}

export const contentByTab: Record<TabId, TabContent> = { home: homeContent, about: aboutContent, education: educationContent, setup: setupContent, friends: friendsContent }