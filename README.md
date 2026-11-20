# Methods Study

Photos of Maths Methods work, sorted into topics and sub-topics automatically, with revision notes underneath.
Live at **https://methods-study.adrian11jonker.workers.dev** – installable as an app, works offline for photos you've already opened.

- **Upload** photos (camera or files). On the owner's device each one is saved to this repo and the free AI looks at it
  to choose a topic (making new topics/sub-topics only when nothing fits) and a short title. Change anything in the list that appears.
- **Click a photo** to see it big, then **Full screen** (zoom, swipe / arrow keys for the next one).
- **✦ Ask** – the helper: "move the chain rule photos into Calculus", "rename this topic"… It suggests, you press **Do it**.
- **Notes** under each photo are written once a week by Claude (see `docs/WEEKLY.md`).
- **Friends** who open the link see your photos and notes (read-only). Photos they upload stay on their own device.

## Setting up (Cloudflare → Workers → methods-study → Settings → Variables and secrets)

| Secret | What |
|---|---|
| `GITHUB_TOKEN` | Fine-grained GitHub token, **Contents: Read and write** on `CaseoH231/Methods-study` only |
| `APP_PASSCODE` | Your passcode – needed to upload or change anything |
| `OWNER_IPS` | Optional: your home address(es) for the AI features (the app shows the value under ⋯ More → This device) |

Then on your laptop: ⋯ More → **Log in as owner…** and enter the passcode once. On someone else's laptop, use ⋯ More → **Log out (owner)** when you're done.

## Files

`index.html`, `style.css`, `app.js` (the app), `lib.js` (library rules, shared with the Worker), `worker/` (API: GitHub storage,
sorting, helper, access lock), `sw.js` (offline), `vendor/katex` (maths rendering, MIT), `tools/` (deploy packer, weekly notes helper),
`data/library.json` + `photos/` (the owner's library), `tests/` (`bash tests/run_tests.sh`).
