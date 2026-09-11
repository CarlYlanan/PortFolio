import type { ArticlesTabContent } from '../../types'

export const articlesContent: ArticlesTabContent = {
  id: 'larper', eyebrow: 'Articles / 02', title: 'Notes from the desk.', summary: 'Longer write-ups on the systems I run — the Linux desktop and the home server, and why I run them the way I do.',
  articles: [
    {
      id: 'linux-desktop', title: 'Linux Desktop', updated: '2026-09-11',
      summary: 'Distributions, desktop environments, gaming, the terminal, and building a desktop that feels like your own.',
      sections: [
    {
      id: 'distributions', title: 'Distributions',
      body: 'Distributions define the shape of the Linux experience before the user even interacts with a desktop. They decide the package format, the update rhythm, the default software model, and the level of maintenance that the machine asks of you. Server distributions such as Ubuntu Server and Red Hat are designed around reliability, uptime, and sustained administration rather than visual polish. Daily-driver releases such as Ubuntu, Mint, Zorin, and Fedora aim to make the first transition from another operating system feel less intimidating by offering familiar layouts, packaged software stores, and fixed release cycles. Rolling distributions such as CachyOS and Nobara move more quickly and let the user decide when to refresh software, which creates a different relationship with the operating system: less forced change, more discretion, and a stronger sense of ownership. The best choice depends on whether the system is meant to feel stable, familiar, or highly adaptable. For many people, the real question is whether they want an experience that is predictable and safe, or one that is flexible enough to grow with their workflow. In that sense, the distribution is not just a base layer. It is a design decision about what kind of everyday relationship a computer should have with its user.',
      bullets: [
        'Server distributions such as Ubuntu Server and Red Hat prioritise stability and long-term maintenance.',
        'Daily-driver distributions such as Ubuntu, Mint, and Zorin focus on familiarity and user comfort.',
        'Rolling distributions such as CachyOS and Nobara keep updates available through package managers without forcing a sudden system migration.',
      ],
      references: [
        { title: 'Zorin OS', url: 'https://zorin.com/os' },
        { title: 'CachyOS', url: 'https://cachyos.org' },
        { title: 'Linux Mint', url: 'https://linuxmint.com' },
        { title: 'Nobara Project', url: 'https://nobaraproject.org' },
        { title: 'Bazzite', url: 'https://bazzite.gg' },
      ],
    },
    {
      id: 'desktop-environments', title: 'Desktop Environments',
      body: 'If the distribution provides the operating system base, the desktop environment is the interface that gives that base a visual and practical rhythm. It decides how windows appear, how workspaces are arranged, how the taskbar behaves, and whether the experience feels familiar or intentionally different. For users moving from Windows, KDE Plasma and Cinnamon are popular starting points because they carry a strong sense of conventional desktop structure while still leaving room for customization. KDE Plasma is especially flexible, from layout and widgets to visual shaping, while Cinnamon is more conservative and keeps the feel of a stable, traditional graphical shell. GNOME and XFCE provide other patterns: GNOME leans toward a more modern and minimalist interaction model, while XFCE is lightweight and conservative for people who want a system that stays quiet and practical. Tiling environments move away from the traditional window model entirely. Instead of freely moving windows around, a tiling environment organizes them automatically into a grid or a scrollable workspace, which makes the desktop feel more intentional and keyboard-driven. Hyprland, Niri, i3, and Sway are examples of this idea. Some users are interested in the visual finish and the optionality of a full custom desktop; others want a quick, resource-efficient environment that remains effective. In every case, the desktop environment is the thing that turns an operating system into a personal working environment.',
      bullets: [
        'KDE Plasma is rich and configurable for people who want a familiar desktop with strong control over layout and design.',
        'Cinnamon is traditional and calm, especially for people who want a stable system without much friction.',
        'GNOME and XFCE provide different trade-offs between simplicity, resource use, and workflow style.',
        'Tiling environments such as Hyprland, Niri, i3, and Sway turn the screen into a more intentional system of spatial organisation.',
      ],
      references: [
        { title: 'CachyOS Desktop Environments', url: 'https://wiki.cachyos.org/installation/desktop_environments' },
        { title: 'Hyprland', url: 'https://hypr.land' },
        { title: 'Niri', url: 'https://github.com/niri-wm/niri' },
        { title: 'KDE Plasma', url: 'https://kde.org/plasma-desktop' },
        { title: 'r/unixporn', url: 'https://reddit.com/r/unixporn' },
      ],
    },
    {
      id: 'gaming', title: 'Gaming',
      body: 'Linux gaming has become much more practical because the operating system now has enough compatibility support and community knowledge to make the experience less experimental. Steam remains the easiest gateway because it ships with Proton, Valve’s compatibility layer that translates Windows APIs into Linux-friendly calls with the help of Wine, DXVK, and VKD3D. The result is that many Windows games can run through Steam on Linux with a level of speed and compatibility that makes the operating system feel closer to a serious gaming platform than an ideological curiosity. The practical workflow is often simple: check compatibility in ProtonDB, make sure the right launcher is available, then install the game and see how the system behaves. In that sense, Linux gaming depends not only on the operating system but on a wider infrastructure of compatibility reports, driver support, launchers, and driver translations. The largest barrier is not raw performance but the variety of anti-cheat systems that do not always tolerate a fully user-controlled operating system. Easy Anti-Cheat, BattlEye, and Vanguard each represent a different relationship with Linux support, because the game must be able to trust the environment before the user can play. That is why launchers such as Lutris, Heroic Games Launcher, and Bottles matter: they extend the base experience beyond Steam and give users a way to manage custom prefixes, run games from outside the default storefront, and adjust compatibility settings in a more deliberate way.',
      bullets: [
        'Proton translates Windows APIs into Linux-friendly code paths using Wine, DXVK, and VKD3D.',
        'ProtonDB is helpful for judging game compatibility before installation.',
        'Anti-cheat systems such as Easy Anti-Cheat, BattlEye, and Vanguard have a major effect on Linux support.',
        'Lutris, Heroic, and Bottles give optional paths for games outside the Steam ecosystem.',
      ],
      references: [
        { title: 'ProtonDB', url: 'https://protondb.com' },
        { title: 'Are We Anti-Cheat Yet?', url: 'https://areweanticheatyet.com' },
        { title: 'Glorious Eggroll Proton GE', url: 'https://github.com/GloriousEggroll/proton-ge-custom' },
        { title: 'Steam Deck Verified', url: 'https://steamdeck.com/en/verified' },
        { title: 'Heroic Games Launcher', url: 'https://heroicgameslauncher.com' },
        { title: 'Lutris', url: 'https://lutris.net' },
        { title: 'Bottles', url: 'https://usebottles.com' },
      ],
    },
    {
      id: 'terminal', title: 'The Terminal (CLI)',
      body: 'The terminal is the part of Linux that turns a graphical operating system into a system of decisions, commands, and precise control. It is not only useful for complicated work. It is the interface where the user learns how files flow through the system, how packages are installed, and how the computer can be directed without the friction of menus and panels. The first barrier is usually the idea that the terminal is mysterious or dangerous, but in practice it is just a way of asking the computer to do a defined thing in a very direct language. Important commands begin with a simple mental map: pwd tells you where you are, ls shows the contents of a directory, and cd moves you through the filesystem. From there, package managers such as apt, pacman, and paru give the user access to the software ecosystem in a way that differs across distributions. Commands such as cat, mv, and rm move through the file system by action rather than by interface, which can be fast but also means that the user has to be careful with destructive operations. The same mental discipline is useful when editing files: nano is a simple and accessible first editor, while vim becomes a deeper skill that rewards learning structure and movement across a file. The point of the terminal is not to replace the desktop. It is to make the system easier to understand and more honest about what it is doing.',
      bullets: [
        'pwd shows the active folder, ls shows the listing, and cd changes the working directory.',
        'Package managers vary by distribution, including apt, pacman, and paru.',
        'Commands such as cat, mv, and rm are useful but require caution because they can create or remove data quickly.',
        'Nano is approachable for editing files, while Vim gives a more efficient long-term editing workflow for people who invest in learning it.',
      ],
      references: [
        { title: 'Linux Commands Cheat Sheet', url: 'https://geeksforgeeks.org/linux-unix/linux-commands-cheat-sheet' },
        { title: 'Linux Command Library', url: 'https://linuxcommandlibrary.com' },
        { title: 'Vim Adventures', url: 'https://vim-adventures.com' },
      ],
    },
    {
      id: 'ricing', title: 'Ricing',
      body: 'Ricing is the practice of turning a Linux desktop into a coherent piece of personal software, where the visual choices and the technical layout are treated as one design project rather than separate concerns. It can start with a ready-made shell, with dotfiles, or with a collection of independent utilities that are intentionally arranged to feel unified. The distinction matters because a preconfigured quickshell often offers a complete visual system from the start, while dotfiles assemble the same kind of environment from smaller parts such as a bar, a launcher, a logout screen, a terminal, and a wallpaper. Ricing is usually about building a system that feels clean and specific enough to support work without feeling cold or generic. The tools that define this style are often simple and modular: Waybar manages the top bar and status information, Rofi or Wofi provides launch and search, Wlogout handles power actions, and SDDM handles the login experience before the user reaches the desktop. The application layer becomes part of the same vocabulary through terminal emulators such as Kitty and Alacritty, and utility tools such as Fastfetch that show the machine’s status in a polished and readable way. A strong rice should make the system more pleasant to inhabit, but it should also remain understandable enough that it can be maintained, debugged, and evolved over time.',
      bullets: [
        'Bar and launcher style can be built from Waybar, Rofi, Wofi, and Wlogout.',
        'Quickshell and dotfiles make it possible to assemble a design from reusable pieces rather than one fixed theme.',
        'Applications such as Kitty, Alacritty, Fastfetch, and SDDM extend the visual identity of the desktop.',
        'A good rice should balance polish, technical understanding, and the ability to maintain the system over time.',
      ],
      references: [
        { title: 'Noctalia', url: 'https://github.com/noctalia' },
        { title: 'DankMaterialShell', url: 'https://github.com/dankmaterialshell' },
        { title: 'Celestia', url: 'https://github.com/celestia' },
        { title: 'Waybar', url: 'https://github.com/Alexays/Waybar' },
        { title: 'Rofi', url: 'https://github.com/davatorium/rofi' },
        { title: 'Fastfetch', url: 'https://github.com/fastfetch-cli/fastfetch' },
      ],
    },
      ],
    },
    {
      id: 'server', title: 'Server', updated: '2026-09-11',
      summary: 'Why I self-host: privacy without permission slips, cheaper than subscriptions, a calmer network for the whole household, and services that run themselves.',
      sections: [
        {
          id: 'privacy', title: 'Privacy',
          body: 'The main reason I run my own services is the current trend of mainstream companies: they compromise on privacy in order to maximise profits and collect user data. Self-hosting lets me manage my own privacy directly, on my own terms, instead of trusting a dashboard or filing deletion requests and hoping they are honoured. The data that matters lives on hardware I control, not on servers that treat it as a product to be sold.',
        },
        {
          id: 'cost', title: 'Cost',
          body: 'Self-hosted alternatives quietly replace subscriptions I would otherwise pay for. Music is the obvious example — the stack streams my own library instead of a premium plan, and the money I do spend goes into hardware I own rather than a recurring fee. The specific services are listed in the Setup tab; here it is enough to say the stack pays for itself.',
        },
        {
          id: 'a-calmer-network', title: 'A calmer network',
          body: 'Ad blocking at the DNS level smooths browsing for the entire household, not just one browser on one machine. Every device on the network gets the benefit without installing anything. The one gap that still gets through is YouTube ads on mobile and TV — YouTube\'s ad policy keeps those out of reach — so I treat that as a known limit rather than a fight worth having.',
        },
        {
          id: 'self-reliance', title: 'Self-reliance & power',
          body: 'The server makes me self-reliant on automation, both hardware and software, depending on the services I run. It monitors the stack 24/7 at a fraction of the power a desktop would draw — there is no need to power on a laptop or desktop just to keep a handful of services alive. Small, always-on, and efficient: it is the difference between running services and babysitting them.',
        },
        {
          id: 'the-stack', title: 'The stack, briefly',
          body: 'Everything above runs on a Raspberry Pi 8GB with Docker Compose. A Cloudflare tunnel replaces open ports, Navidrome serves the music, AdGuard Home does the blocking, and an IBM X3300 rack server keeps the cold storage. This page is the why; the Setup tab is the what.',
          bullets: [
            'A Cloudflare tunnel exposes the website without open ports.',
            'Two Navidrome instances serve separate music libraries.',
            'AdGuard Home filters ads for every device on the network.',
            'IBM X3300 M4 with 192GB DDR3 for offline cold storage.',
          ],
          references: [
            { title: 'Navidrome', url: 'https://www.navidrome.org' },
            { title: 'AdGuard Home', url: 'https://adguard.com/en/adguard-home/overview.html' },
            { title: 'Docker Compose', url: 'https://docs.docker.com/compose/' },
          ],
        },
      ],
    },
  ],
}
