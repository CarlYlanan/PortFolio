#!/usr/bin/env fish
# Instagram → portfolio midnight sync.
# Called by the systemd timer / cron; safe to run manually:
#   ./scripts/sync-instagram.fish
#
# Flow: probe (1 request, skip cleanly if still blocked) → fetch → build →
# commit + push (triggers Vercel/Coolify redeploy). No secret ever leaves this
# machine — the session cookie lives in ~/.config/portfolio/instagram.env.
#
# Env: INSTAGRAM_USERNAME (or pass as $argv[1]), optional VERCELL_DEPLOY_HOOK.

set -l dir (dirname (status dirname))/..
cd $dir

set -l envfile ~/.config/portfolio/instagram.env
if test -f $envfile
  source $envfile
  export INSTAGRAM_USERNAME INSTAGRAM_SESSIONID
end

set -l user $INSTAGRAM_USERNAME
if set -q argv[1]
  set user $argv[1]
end
if test -z "$user"
  echo "[fatal] set INSTAGRAM_USERNAME or pass the handle: ./scripts/sync-instagram.fish <username>"
  exit 1
end

# 1. Probe — one request, no retry backoff. If Instagram still has this IP
#    rate-limited, bow out cleanly and keep the last good data.
pnpm fetch:instagram $user --probe
if test $status -ne 0
  echo "[sync] probe failed — Instagram still blocked; keeping last good data."
  exit 0
end

# 2. Fetch + generate.
pnpm fetch:instagram $user
if test $status -ne 0
  echo "[sync] fetch failed — keeping last good data."
  exit 1
end

# 3. Verify it compiles before shipping anything.
pnpm build
if test $status -ne 0
  echo "[sync] build failed — nothing pushed."
  exit 1
end

# 4. Commit the generated data + images, then push (triggers Vercel/Coolify redeploy).
#    The env file is never part of the repo, so the cookie does not leave this machine.
set -l stamp (date -Iseconds)
git add public/media/social/instagram src/data/social/generatedInstagramPosts.ts
git commit -m "chore: sync instagram posts ($stamp)" -q
set -l commit_status $status
if test $commit_status -eq 1
  echo "[sync] no changes — already up to date, nothing pushed."
  exit 0
else if test $commit_status -ne 0
  echo "[sync] git commit failed (exit $commit_status) — check git identity on this host."
  exit 1
end
git push
if test $status -ne 0
  echo "[sync] push failed — check git credentials on this host."
  exit 1
end

# 5. Optional deploy-hook ping for Vercel. Set VERCELL_DEPLOY_HOOK in the env
#    file if you use a CI-less trigger; harmless if empty.
if test -n "$VERCELL_DEPLOY_HOOK"
  curl -fsS -X POST "$VERCELL_DEPLOY_HOOK" > /dev/null
  echo "[sync] deploy hook triggered."
end

echo "[sync] done "(date -Iseconds)