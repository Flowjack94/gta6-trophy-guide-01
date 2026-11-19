# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Flowjack94/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Flowjack94/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 PS5 trophies** in Grand Theft Auto VI, built for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) ("Build the best GTA 6 trophy guide", $250 in USDC).

## What it does

- **All 55 trophies** — name, official description, grade (1 platinum, 2 gold, 6 silver, 46 bronze) and a guide in our own words for each one.
- **Checklist saved in your browser** (localStorage), with **export** (download JSON) and **import** (upload JSON), a progress bar and per-grade counts.
- **Filters** — by grade, by kind (story / collectible / activity / robbery / money / exploration / combat), by earned/unearned, by missable, plus text search.
- **Spoiler mode (on by default)** — hides the 28 hidden/story trophies' names, descriptions and guides until they are earned or until you turn spoilers on.
- **Roadmap to the platinum** in four stages: story first → open world → clean-up → 100% completion.
- **Missable flags** — only *Positive Mental Attitude* is reported as possibly missable (Lucia's balcony meditation in Chapter 1 disappears after that chapter; GTA VI has no mission replay). Every other trophy honestly says "no missable report confirmed yet".
- **Sources section** citing the Exophase list as reported 18 Nov 2026 (via PlanetGTA6, cross-checked with PSNProfiles and TrueAchievements) and PowerPyx.

## Honesty note

Rockstar has **not** published an official trophy list. This guide uses the list as reported from PlayStation Network on 18 Nov 2026 — names, descriptions and grades as reported, guides written in our own words. Anything not yet confirmed is labelled as such. Cheats disable trophies.

## Run it

```bash
node serve.ts
```

Then open http://localhost:8080. The app is fully static and works offline — it makes zero network requests and loads nothing from outside `app/`.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide app (Vice City sunset / neon design, original CSS art only — no Rockstar logo or official artwork).
- `app/data/trophies.json` — the 55 verified trophies with guides.
- `screenshots/` — real renders of the app running in a browser (see `shots.json`).
- `main.ts` — copies `app/` + `screenshots/` to the output dir and writes `dossier.json` via `vendor/makefun-frontend.ts`.
