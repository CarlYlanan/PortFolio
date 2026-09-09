import type { StandardTabContent } from '../../types'

export const homeContent: StandardTabContent = {
  id: 'home', eyebrow: 'Portfolio / 2026', title: 'A quiet corner of the internet.',
  summary: 'Hi, I’m Carly. This is a small collection of the things I’m learning, making, and paying attention to.',
  sections: [
    { id: 'intro', title: '01 // intro', body: 'I enjoy building thoughtful digital spaces with simple interfaces and a little room to breathe.' },
    { id: 'summary', title: '02 // summary', body: 'Currently exploring front-end development, Linux, and the relationship between hardware and software.' },
    { id: 'stack', title: '03 // stack', body: 'React, TypeScript, CSS, Linux, and whatever tool helps turn a good idea into something tangible.' },
  ], markers: [{ id: 'intro', label: '01 // intro' }, { id: 'summary', label: '02 // summary' }, { id: 'stack', label: '03 // stack' }],
}
