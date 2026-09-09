import type { StandardTabContent } from '../../types'

export const setupContent: StandardTabContent = {
  id: 'setup', eyebrow: 'Setup / 03', title: 'Tools that stay out of the way.', summary: 'A practical inventory of the systems I use to think, make, and experiment.',
  sections: [
    {
      id: 'linux', title: 'Linux',
      body: 'The daily desktop is built around a calm, fast Linux experience with a focus on keeping the interface minimal and the workflow quick. The system is designed to stay light, useful, and easy to maintain while still feeling personal enough to carry through the day.',
      bullets: [
        { item: 'CachyOS', usage: 'Base system' },
        { item: 'PipeWire', usage: 'Audio layer', url: 'https://github.com/CarlYlanan/Desktop-Config/tree/main/pipewire/pipewire.conf.d' },
        { item: 'rofi', usage: 'App Launcher', url: 'https://github.com/CarlYlanan/Desktop-Config/tree/main/rofi' },
        { item: 'Waybar', usage: 'Status bar', url: 'https://github.com/CarlYlanan/Desktop-Config/tree/main/waybar' },
        { item: 'wlogout', usage: 'Power screen', url: 'https://github.com/CarlYlanan/Desktop-Config/tree/main/wlogout' },
        { item: 'Niri', usage: 'Window manager', url: 'https://github.com/CarlYlanan/Desktop-Config/tree/main/niri' },
        { item: 'mako', usage: 'Notification daemon', url: 'https://github.com/CarlYlanan/Desktop-Config/tree/main/mako' },
        { item: 'fastfetch', usage: 'System fetch', url: 'https://github.com/CarlYlanan/Desktop-Config/tree/main/fastfetch' },
      ],
      rootLink: { title: 'My setup dotfiles for daily use', url: 'https://github.com/CarlYlanan/Desktop-Config' },
    },
    {
      id: 'systems', title: 'Systems',
      body: 'The workstation is built around a multi-monitor desk that aims to feel balanced, practical, and comfortable enough to stay in for long sessions. I like keeping the hardware side useful rather than decorative, so older consoles, a compact keyboard setup, personal audio gear, and a fast gaming-focused desktop all have a role in the same overall rhythm of the desk.',
      bullets: [
        'Xbox 360 with AbadUpdate softmod.',
        'PlayStation 4 with GoldHen.',
        'SNES Mini with Hakchi.',
        'Monsgeek M1W v3 HE keyboard.',
        'Pulsar X2h mini Muichiro.',
        'Beyerdynamic DT770 Pro headphones.',
        'Logitech G560 speakers and Blue Yeti Nano microphone.',
        'Fosi F5 Pro DAC.',
        'MSI G274QPX QHD 240Hz monitor.',
        'Gigabyte G24F 165Hz display.',
        'Lian Li Dan A3 chassis with Ryzen 7 5700X and RX 7700 XT.',
        'Crucial P3 1TB NVMe storage.',
      ],
    },
    {
      id: 'server-networking', title: 'Server / Networking',
      body: 'The network side is a small self-hosting layer that tries to keep personal services close to the desk while still remaining organized enough to use regularly. I keep a few services in motion for learning and daily use, with a mixture of privacy-minded tools, local media, and network filtering that helps everything feel a little more consistent.',
      bullets: [
        'Raspberry Pi 8GB with Raspberry Pi OS Lite.',
        'Cloudflare tunnel and Docker Compose for the website.',
        'Two Navidrome instances for music.',
        'AdGuard Home for network-wide ad blocking.',
        'Xiaomi AX3000 mesh plus Netgear RAX50 V2 and Orbi WiFi 6 access points.',
        'Isolated 5G network for VR gaming.',
        'IBM X3300 M4 rack server with 192GB DDR3 for cold storage.',
      ],
    },
  ], markers: [{ id: 'linux', label: '01 // linux' }, { id: 'systems', label: '02 // systems' }, { id: 'server-networking', label: '03 // server / networking' }],
}
