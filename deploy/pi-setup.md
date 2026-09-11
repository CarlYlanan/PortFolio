# Raspberry Pi — Instagram sync host (recommended)

Your Pi runs 24/7, so it is the right home for the midnight sync. The desktop
can run the same timer as a stopgap, but if it is off at 00:00 nothing happens.

## What the Pi needs

- `git`, `pnpm` (Node 20+), `fish`, `curl`
- The repo cloned to e.g. `~/portfolio`
- A git credential for **pushing** (see below) — this is what triggers Vercel/Coolify to redeploy
- `~/.config/portfolio/instagram.env` **on the Pi** with your session cookie
  (copy it from the desktop: `scp ~/.config/portfolio/instagram.env pi:~/.config/portfolio/`)

## 1. Clone + deps

```sh
cd ~
git clone <your-repo-url> portfolio
cd portfolio
pnpm install
```

## 2. Git credential needed for `git push`

The sync script commits the generated data + images and pushes. Use either:

- **GitHub PAT in the URL** — store it outside the repo so it never leaks:
  ```sh
  git remote set-url origin https://<USERNAME>:<TOKEN>@github.com/<you>/<repo>.git
  # or store credentials once:
  git config --global credential.helper store
  ```
- **Deploy key (SSH)** — generate one, add to GitHub repo Deploy keys (write access):
  ```sh
  ssh-keygen -t ed25519 -C "pi-sync" -f ~/.ssh/portfolio_sync
  cat ~/.ssh/portfolio_sync.pub   # → add to GitHub repo settings
  git remote set-url origin git@github.com:<you>/<repo>.git
  # ~/.ssh/config: Host github.com → IdentityFile ~/.ssh/portfolio_sync
  ```

## 3. Env file (cookie stays on this machine)

```sh
mkdir -p ~/.config/portfolio
chmod 600 ~/.config/portfolio/instagram.env
nano ~/.config/portfolio/instagram.env
# contents:
#   INSTAGRAM_USERNAME=caaaaaaaylllll
#   INSTAGRAM_SESSIONID=<from browser>
#   VERCELL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...   # optional
```

**Never put this file inside the repo.** It is read from the home dir only.

## 4. Install the user timer (1:00 NZST local)

```sh
mkdir -p ~/.config/systemd/user
cp deploy/portfolio-sync.service deploy/portfolio-sync.timer ~/.config/systemd/user/
# Edit ~/.config/systemd/user/portfolio-sync.service:
#   WorkingDirectory=%h/portfolio   (Pi clone path)
#   ExecStart=/usr/bin/fish %h/portfolio/scripts/sync-instagram.fish
# Edit ~/.config/systemd/user/portfolio-sync.timer:
#   OnCalendar=*-*-* 01:00:00        (1am NZST local)
systemctl --user daemon-reload
systemctl --user enable --now portfolio-sync.timer
loginctl enable-linger $(whoami)   # let the timer fire while logged out
```

Check: `systemctl --user list-timers portfolio-sync.timer` and
`journalctl --user -u portfolio-sync.service -f`.

## What a run does

```
probe (1 request) ──► fetch posts ──► pnpm build ──► git commit + push ──► Vercel redeploys
```

If Instagram still has the IP throttled, the probe fails → the script exits 0
("keeping last good data") and **nothing is pushed** — the site keeps its last
synced gallery and the cooldown is left to expire instead of being extended.