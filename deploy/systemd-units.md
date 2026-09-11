# systemd user units — Instagram sync (no root needed)

Files:
- `portfolio-sync.service` — oneshot: runs `scripts/sync-instagram.fish`
- `portfolio-sync.timer` — fires daily at 00:00 (`Persistent=true` catches up missed runs)

## What a run does

```
probe (1 request) ──► fetch posts ──► pnpm build ──► git commit + push ──► Vercel/Coolify redeploys
```

If Instagram still has the IP throttled, the probe fails and the script exits 0
without pushing — the site keeps the last good gallery and the cooldown is left
alone (no retry backoff that would extend it).

## Install (desktop stopgap)

```sh
mkdir -p ~/.config/systemd/user
cp deploy/portfolio-sync.service deploy/portfolio-sync.timer ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now portfolio-sync.timer
loginctl enable-linger carly   # let the timer fire while logged out
```

For the always-on Raspberry Pi this is the permanent host — follow
`deploy/pi-setup.md` instead (it also covers the git credential the push needs).

## Verify / operate

```sh
systemctl --user list-timers portfolio-sync.timer   # next fire time
systemctl --user start portfolio-sync.service       # trigger a run now
journalctl --user -u portfolio-sync.service -f      # watch output
```
