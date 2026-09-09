import type { StandardTabContent } from '../../types'

export const homeContent: StandardTabContent = {
  id: 'home',
  eyebrow: 'Portfolio / 2026',
  title: 'A quiet corner of the internet.',
  summary: 'Hi, I’m Carly. This is a small collection of the things I’m learning, making, and paying attention to.',
  sections: [
    {
      id: 'intro',
      title: '01 // intro',
      body: 'This is a small personal collection of the systems, ideas, and study that make up my current digital life. I keep it intentionally simple and quiet, because most of the best work feels better when it leaves room for attention.',
    },
    {
      id: 'focus',
      title: '02 // focus',
      body: 'I am currently learning through the process of building better interfaces, designing more thoughtful web pages, and understanding how Linux, hardware, and software fit together in a single working rhythm.',
    },
    {
      id: 'direction',
      title: '03 // direction',
      body: 'I am interested in clear design, useful systems, and the kind of digital spaces that make a person feel more grounded when they sit down to work. This collection is a record of that process as it continues to unfold.',
    },
  ],
  markers: [
    { id: 'intro', label: '01 // intro' },
    { id: 'focus', label: '02 // focus' },
    { id: 'direction', label: '03 // direction' },
  ],
}
