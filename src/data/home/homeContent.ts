import type { StandardTabContent } from '../../types'

export const homeContent: StandardTabContent = {
  id: 'home',
  eyebrow: 'Portfolio / 2026',
  title: 'Portfolio thingy',
  summary: 'yapyap.',
  sections: [
    {
      id: 'intro',
      title: '01 // intro',
      body: 'This is a small personal collection of the systems, ideas, and study that make up my current digital life. I keep it intentionally simple and quiet, because most of the best work feels better when it leaves room for attention.',
    },
    {
      id: 'gaming',
      title: '02 // gaming & media',
      body: 'I game alot. Mostly rhythm, fps or story games. Main games below.',
      bullets: [
        'Genshin Impact — still in Natlan, mostly playing around the story and taking breaks when I feel burnout.',
        'osu! — mainly standard mode (Rank 7000 Global), with some learning in mania and other rhythm formats.',
        'Overwatch, Sound Voltex, maimai, and Genshin Impact.',
        'Light novels, manhwa, manga, and Japanese media — including Sanrio, Hatsune Miku, Ado, 9Lana, Kasane Teto, and Haikyuu.',
      ],
    },
    {
      id: 'interests',
      title: '03 // interests',
      body: 'I like computers and servers, and open-source alternatives, and linux stuff.',
      bullets: [
        'Open-source alternatives for music and desktop workflows.',
        'Linux systems, server tools, self-hosting, and Docker stacks.',
        'Exploring dotfiles, desktops, and custom Linux configuration.',
        'Japanese media, rhythm gaming, FPS games, and manga culture.',
      ],
    },
    {
      id: 'goals',
      title: '04 // goals',
      body: 'My goals are semi realistic and semi unreachable.',
      bullets: [
        'Get back into shape (Mainly by playing badminton).',
        'Reach a 600pp score in osu! someday.',
        'Clear a 14 master chart in maimai.',
        'Get PUC in anything or clear an 18 in Sound Voltex.',
        'Get a job in help desk or systems administration (mostly just get a job).',
        'Build a home server that replaces cloud needs.',
      ],
    },
    {
      id: 'skills',
      title: '05 // skills',
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
    { id: 'intro', label: '01 // intro' },
    { id: 'gaming', label: '02 // gaming & media' },
    { id: 'interests', label: '03 // interests' },
    { id: 'goals', label: '04 // goals' },
    { id: 'skills', label: '05 // skills' },
  ],
}
