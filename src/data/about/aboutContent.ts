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
      body: 'I am a technically minded person with a growing interest in systems, automation, and privacy-respecting infrastructure. I have been moving away from large cloud platforms and toward self-hosted tools that let me run media, files, and local AI services on my own terms. I like working with hardware, setting up containers, and solving problems hands-on, especially when the result is something practical, fast, and reliable. I care about clear communication, technical honesty, and building things that are useful before they are impressive.',
    },
    {
      id: 'what-ive-done',
      title: 'What I’ve Done',
      body: 'For a five-person internship project with the Auckland Health Board, I helped build an automated triage diagnosis system that took in documents such as PDFs, extracted the relevant text, separated patient information from patient notes, and passed that information into a rules-based workflow before producing a final document for doctors to review. The aim was to reduce the amount of manual triage work and make the intake process faster, more organized, and more useful for clinical staff.',
      bullets: [
        'Built a document intake and triage workflow for clinical document processing.',
        'Separated patient notes from patient metadata before creating a diagnosis structure.',
        'Worked with text extraction and rules-based preprocessing for an LLM-assisted decision pipeline.',
        'Structured patient information into a final document suitable for doctor review.',
      ],
    },
    {
      id: 'gaming',
      title: 'Gaming & Media',
      body: 'I play a lot of video games, mostly rhythm and FPS games, with the occasional story-driven title. I am currently still in Natlan with Genshin Impact, and I spend time with osu! mostly in standard mode while starting to learn mania, Overwatch, Sound Voltex, and maimai. I am still learning maimai and SDVX, but I am getting to a decent level. I also read light novels, manhwa, and manga, and I have a long-running interest in Japanese media such as Sanrio, Hatsune Miku, Ado, 9Lana, and Kasane Teto. My all-time favourite manga is Haikyuu.',
    },
    {
      id: 'interests',
      title: 'Interests',
      body: 'I like learning about computers and servers, and I enjoy finding open-source alternatives to closed first-party applications. Navidrome and OpenMouse are examples of the kinds of services I like to explore because they replace a commercial or closed experience with something more personal and more transparent. I like technology as a whole because it is always changing, and communities can change the direction of the conversation through open projects, honest documentation, and better tools. I spend a lot of the day reading, gaming, exploring self-hosted services, checking what might fit into a Docker stack, or looking at dotfiles and Linux configurations from other users to understand how they organize their desktops.',
      bullets: [
        'Open-source alternatives for music and desktop workflows.',
        'Linux systems, server tools, self-hosting, and Docker stacks.',
        'Exploring dotfiles, desktops, and custom Linux configuration.',
        'Japanese media, rhythm gaming, FPS games, and manga culture.',
      ],
    },
    {
      id: 'goals',
      title: 'Goals',
      body: 'My current goals are mostly practical and personal. I want to get back into badminton, reach a 600pp score in osu! at some point, clear a 14 master chart in maimai, get PUC in anything or clear an 18 in Sound Voltex, and eventually build a significant home server that can replace most of the cloud services I rely on today. The main career goal is to get a job, ideally in help desk or systems administration, and the technology goal is to build a home server that can cover the same needs as a cloud setup while staying private, understandable, and reliable.',
      bullets: [
        'Return to badminton.',
        'Reach a 600pp score in osu! someday.',
        'Clear a 14 master chart in maimai.',
        'Get PUC in anything or clear an 18 in Sound Voltex.',
        'Get a job in help desk or systems administration.',
        'Build a home server that replaces cloud needs.',
      ],
    },
    {
      id: 'skills',
      title: 'Skills',
      body: 'I work mostly in the front-end space, but I care a great deal about the systems behind the interface: clear structure, readable code, and a simple path from idea to execution. I like working with React, TypeScript, CSS, Linux, and the way software can be shaped into a thoughtful web experience.',
      bullets: [
        { item: 'React', usage: 'Building front-end interfaces' },
        { item: 'TypeScript', usage: 'Typed UI and application structure' },
        { item: 'CSS', usage: 'Layout, spacing, and visual polish' },
        { item: 'Linux', usage: 'Daily systems and workflow architecture' },
        { item: 'Systems thinking', usage: 'Designing practical and maintainable tooling' },
      ],
    },
  ],
  markers: [
    { id: 'statement', label: '01 // statement' },
    { id: 'what-ive-done', label: '02 // what ive done' },
    { id: 'gaming', label: '03 // gaming' },
    { id: 'interests', label: '04 // interests' },
    { id: 'goals', label: '05 // goals' },
    { id: 'skills', label: '06 // skills' },
  ],
}
