# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

DealSpot — a static Amazon affiliate deals site for 7 EU marketplaces (IT, DE, ES, UK, NL, FR, BE), deployed via GitHub Pages directly from `main` (no staging environment; a push to `main` is a deploy). Plain HTML/CSS/vanilla JS, no framework, no build step, no `package.json`, no dependencies, no test suite.

## Commands

There is no build/lint/test tooling. Useful commands during development:

- **Local preview**: `python -m http.server 8765` from the repo root, then open `http://localhost:8765/index.html`. Opening `index.html` directly via `file://` will not work correctly for the `fetch()` call in `site.js` — it needs to be served over HTTP.
- **Syntax-check a JS file after editing**: `node --check assets/site.js` (swap the filename) — this is the only available correctness check, there is no test runner.
- **Manually trigger the weekly automation**: GitHub → Actions → "Weekly deal check" → Run workflow (uses `workflow_dispatch`, no need to wait for the Monday cron).

## Architecture

**Affiliate tags have one source of truth**: `assets/config.js` exports a `COUNTRIES` map (domain, flag, tag, status per country) plus `buildDealUrl()` (search-query link) and `buildAsinUrl()` (direct product link). Never hardcode a tag anywhere else — every link in the site is built from this file so that re-approving or losing a marketplace's affiliation is a one-line change.

**Deal content is merged from two sources at render time**, in `assets/site.js`:
- `assets/deals.js` — a hand-curated, permanent `DEALS` array, edited directly.
- `assets/deals-auto.json` — regenerated weekly by `scripts/fetch-deals.js` (run by `.github/workflows/weekly-deals-check.yml`), and loaded client-side via `fetch()` at page load (not a `<script>` tag, since it's data, not code).

Both get concatenated and rendered into the `#latest-grid` / `#picks-grid` grids based on each deal's `section` field. A deal's `category` must match a key in `assets/icons.js`'s `CATEGORY_ICONS`, or it silently falls back to the `smartphone` icon.

**The weekly automation is currently wired up but inert.** `scripts/fetch-deals.js` calls the Keepa API to check prices for the ASINs in `assets/watchlist.json`, but the Keepa key has no active paid subscription (calls fail with HTTP 402, handled gracefully — the script just writes `[]`). Switching to Amazon's own PA-API was evaluated as a free alternative, but PA-API access requires 3 qualifying sales in the trailing 180 days to become eligible and then 10 qualifying sales per rolling 30 days to keep access — the account doesn't meet this yet. Don't assume `deals-auto.json` has real content until one of these two paths is unblocked.

**Keepa doesn't cover NL/BE** as separate domains, so `KEEPA_DOMAIN_IDS` in `fetch-deals.js` intentionally omits them — those two marketplaces can only get new deals via manual edits to `deals.js`, never through the automated script.

**`status: 'pending'` vs `'active'`** in `COUNTRIES`: when a country has no live tag yet, `site.js` renders a "🔄 Affiliate link renewing" note and links to Amazon without a tag instead of a monetized link.

**The legal/about pages describe the actual sourcing process on purpose** (`about.html`, `disclosure.html`, `privacy.html`) — e.g. `about.html` explicitly distinguishes hand-written notes from auto-generated ones. These pages exist to match Amazon Associates program requirements around content authenticity, so keep their wording in sync whenever the deal-sourcing method changes (e.g. if the automation becomes active, or if PA-API replaces Keepa).
