import type { StandardTabContent } from '../../types'

export const aboutContent: StandardTabContent = {
  id: 'about',
  eyebrow: 'About / 01',
  title: 'Building systems, learning by doing.',
  summary: 'A short look at the work, interests, and direction behind the projects.',
  sections: [
    {
      id: 'statement',
      title: 'Personal Statement',
      body: 'I am a technically minded person with a growing interest in systems, automation, and privacy-respecting infrastructure. I have been moving away from large cloud platforms and toward self-hosted tools that let me run media, files, and local AI services on my own terms. I like working with hardware, setting up containers, and solving problems hands-on, especially when the result is something practical, fast, and reliable. I care about clear communication, technical honesty, and building things that are useful before they are impressive.',
    },
    {
      id: 'what-ive-done',
      title: 'What I’ve Done',
      body: 'For a five-person internship project with the Auckland District Health Board, I helped build an automated triage diagnosis system that took in documents such as PDFs, extracted the relevant text, separated patient information from patient notes, and passed that information into a rules-based workflow before producing a final document for doctors to review. The aim was to reduce the amount of manual triage work and make the intake process faster, more organized, and more useful for clinical staff.',
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
      body: 'I spend a lot of time with rhythm games, FPS games, and the occasional story-driven title. I usually keep a few games active at once, but I am most consistent with the games below.',
      bullets: [
        'Genshin Impact — still in Natlan, mostly playing around the story and taking breaks when I feel burnout.',
        'osu! — mainly standard mode (Rank 7000 Global), with some learning in mania and other rhythm formats.',
        'Overwatch, Sound Voltex, and maimai — active learning and casual play alongside osu! and Genshin Impact.',
        'Light novels, manhwa, manga, and Japanese media — including Sanrio, Hatsune Miku, Ado, 9Lana, Kasane Teto, and Haikyuu.',
      ],
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
        'Get back into shape (Mainly by playing badminton).',
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
      body: 'While I studied and majored in data science, my strongest interest is in the hardware and systems side of technology. I enjoy working with servers, Linux environments, self-hosted services, containers, networking, and the practical work of keeping infrastructure running reliably. I am also learning front-end development to broaden my skills and avoid being locked into only the data science side of computing. I like building a stronger understanding of how software, systems, hardware, and user-facing tools fit together in a real environment.',
      bullets: [
        { item: 'System Administration', usage: 'Linux, Ubuntu Server, Debian, CachyOS/Arch, Proxmox VE, SSH/VNC, systemd, permissions' },
        { item: 'Infrastructure & DevOps', usage: 'Docker, Compose, reverse proxying, Nginx Proxy Manager, Cloudflare Tunnels, Tailscale' },
        { item: 'Networking & Security', usage: 'DNS, DHCP/static IP, LAN/WAN, NFS/SMB, firewalls, port forwarding' },
        { item: 'Data & Automation', usage: 'Python, PostgreSQL, LangChain, Ollama, Bash, Git/GitHub, JSON/YAML, PII anonymization' },
        { item: 'Hardware & Tools', usage: 'IBM x3300 diagnostics, RAID/LVM, PC assembly and configuration' },
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
