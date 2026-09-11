import type { StandardTabContent } from '../../types'

export const setupContent: StandardTabContent = {
  id: 'setup', eyebrow: 'Setup / 03', title: 'The daily drivers of my life.', summary: 'This is a list of software and hardware that I use daily that accomodates my lifestyle in any way.',
  sections: [
    {
      id: 'linux', title: 'Linux',
      body: 'My desktop is built around CachyOS and a Niri. The stack tries to remain light: rofi is the launcher, Waybar and a few scripts carry the interface, and wlogout gives the power screen a personal finish. I like using this setup as it allows me to control everything to the detail and be free from unnecessary bloat.',
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
      body: 'The hardware side is mostly practical. An Xbox 360 runs an AbadUpdate softmod, the PlayStation 4 runs GoldHen, and the SNES Mini is rebuilt with Hakchi so older systems stay useful instead of turning into shelves. The desk also carries a compact workstation layer: a Monsgeek M1W v3 HE keyboard, a Pulsar X2h mini Muichiro, Beyerdynamic DT770 Pro headphones, Logitech G560 speakers, a Blue Yeti Nano microphone, and a Fosi F5 Pro DAC. The display setup is split between an MSI G274QPX QHD 240Hz monitor, and a Gigabyte G24F 165Hz display. The main tower lives in a Lian Li Dan A3 case with an AMD Ryzen 7 5700X, a Gigabyte RX 7700 XT, and a Crucial P3 1TB NVMe for the main storage layer.',
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
      ],
    },
    {
      id: 'server-networking', title: 'Server / Networking',
      body: 'The network is split between a Raspberry Pi 8GB running Raspberry Pi OS Lite, a Cloudflare tunnel, Docker Compose, two Navidrome instances, and AdGuard Home for full-network ad blocking. The wireless layer uses a Xiaomi AX3000 mesh, a Netgear Nighthawk RAX50, and an Orbi WiFi 6 access point setup, with a separate isolated 5G network for VR gaming. There is also an IBM X3300 M4 rack server with 192GB DDR3 for cold storage and anything that needs to stay offline.',
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
