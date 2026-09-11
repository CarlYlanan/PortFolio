# Instagram → Social tab (auto-sync)

The Social tab shows an Instagram carousel. A script mirrors your **public**
profile's posts into the repo, and the site renders the local copies. Each card
links back to the original post. **No Meta developer API key is involved.**

## One-time setup

```sh
pnpm fetch:instagram <your-username>   # downloads posts + writes src/data/social/generatedInstagramPosts.ts
pnpm build
```

### If Instagram rejects the anonymous sync (IP-gating)

Instagram has been turning off anonymous access from datacenter/VPN ranges.
The script tells you when this happens ("require_login" / 401). The fix uses
**your own Instagram session — still not an API key**:

1. Log into instagram.com in your browser.
2. DevTools → Application → Cookies → `https://www.instagram.com` → copy `sessionid`.
3. Put it in an env file the sync reads, e.g. `~/.config/portfolio/instagram.env`:
   ```sh
   INSTAGRAM_USERNAME=<your-handle>
   INSTAGRAM_SESSIONID=<paste>
   ```
4. Source it in the sync script call (systemd: `EnvironmentFile=` in
   `portfolio-sync.service`; cron: `. ~/.config/portfolio/instagram.env &&` before the script).

Sessions can expire every few weeks — when the sync log says `require_login`,
refresh the cookie. Anonymous access may still work fine on residential
networks; the script always tries that first.

Images land in `public/media/social/instagram/<shortcode>.jpg`. Already-downloaded
posts are skipped on later runs, so syncs are incremental (only new posts fetched).

## Midnight auto-sync

The site is a static build, so "live" sync means: **refresh → rebuild → push**.
A successful sync commits the new post images + generated data and `git push`es
them; if Vercel/Coolify watches that repo, the push itself triggers redeploy.
No secret ever leaves the machine running the sync.

### Where it should run
Your Raspberry Pi runs 24/7 — use it as the permanent sync host so the timer
never depends on a desktop being awake. Follow **`deploy/pi-setup.md`** (includes
setting up a git credential for the push trigger).

### Desktop stopgap
Until the Pi is set up, run it on a desktop instead:

```sh
mkdir -p ~/.config/systemd/user
cp deploy/portfolio-sync.service deploy/portfolio-sync.timer ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now portfolio-sync.timer
loginctl enable-linger carly    # let the timer fire while logged out
```

### cron (equivalent)
```cron
0 0 * * * cd /home/carly/Documents/Codes/portfolio && ./scripts/sync-instagram.fish <username> >> /tmp/portfolio-instagram-sync.log 2>&1
```

`sync-instagram.fish` = probe (skip cleanly if throttled) → fetch → `pnpm build`
→ `git add` generated data/images → `git commit` → `git push` → optional
`$VERCELL_DEPLOY_HOOK` ping (set it in the env file if you use a manual trigger).

## Fragility & fallbacks

This uses Instagram's public web endpoints unofficially. If they throttle or
change them, the script **fails without touching the previous data** — the site
keeps building with the last good gallery until the scraper is fixed. Fallbacks:

- `pip install instaloader` then swap the fetch step for
  `instaloader --login-free -DIRs <username>`-style export, or
- RSS-Bridge (self-hosted, fits your Docker stack) in front of the profile.