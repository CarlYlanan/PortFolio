import type { StandardTabContent } from '../../types'

export const aboutContent: StandardTabContent = {
  id: 'about',
  eyebrow: 'About / 01',
  title: 'Curious by nature, careful by craft.',
  summary: 'A little context about the person behind the projects.',
  sections: [
    {
      id: 'statement',
      title: 'Personal Statement',
      body: 'I build with a soft sense of structure. I like services that feel clear, tools that feel thoughtful, and systems that leave enough room for people to keep learning.',
    },
    {
      id: 'hobbies',
      title: 'Hobbies',
      body: 'A good hobby keeps the mind honest. I spend time exploring hardware, experimenting in the terminal, collecting small workflows, and learning how systems become more pleasant when they are put together with care.',
      bullets: [
        'Desktop customization and Linux ricing.',
        'Repairing or repurposing old hardware.',
        'Trying out new software tools and keeping useful notes.',
        'Reading about interface design, operating systems, and digital culture.',
      ],
    },
    {
      id: 'interests',
      title: 'Interests',
      body: 'My interests are not very broad in the usual sense. They tend to orbit around technology, craft, documentation, and the way people make a home in software.',
      bullets: [
        'Interface design and minimalist user experience.',
        'Self-hosting and private cloud alternatives.',
        'Linux systems, window managers, and shell workflow design.',
        'Low-friction automation and useful digital archives.',
      ],
    },
    {
      id: 'skills',
      title: 'Skills',
      body: 'I work mostly in the front-end space, but I care a great deal about the systems behind the interface: clear structure, readable code, and a simple path from idea to execution.',
      bullets: [
        { item: 'React', usage: 'Building front-end interfaces' },
        { item: 'TypeScript', usage: 'Typed UI and application structure' },
        { item: 'CSS', usage: 'Layout, spacing, and visual polish' },
        { item: 'Linux', usage: 'Daily systems and workflow architecture' },
        { item: 'Systems thinking', usage: 'Designing practical and maintainable tooling' },
      ],
    },
    {
      id: 'values',
      title: 'Values',
      body: 'I value useful work over unnecessary complexity. I like documentation that helps people understand why something was built, and I prefer systems that are calm enough to keep working over time.',
    },
  ],
  markers: [
    { id: 'statement', label: '01 // statement' },
    { id: 'hobbies', label: '02 // hobbies' },
    { id: 'interests', label: '03 // interests' },
    { id: 'skills', label: '04 // skills' },
    { id: 'values', label: '05 // values' },
  ],
}
