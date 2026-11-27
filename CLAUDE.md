# CLAUDE.md — Sur songbook (thedhunga/sdmusic)

Lyrics-and-chords app for guitar and piano, Nepali songs first, then rock (70s–90s).
Plain HTML/CSS/JS: no build step, no dependencies, no framework. Keep it that way
unless there is a strong reason; it must keep working when opened straight from disk.

## Run
- `python3 -m http.server 8000` (or `npx serve .`), then open http://localhost:8000
- Opening `index.html` directly also works (no offline cache or install prompt then).
- Tests: `node tests/check.js` (no deps) and `node tests/smoke.js` (Playwright).
- Capo songs: chordpro holds capo shapes, `key` is the sounding key.

## Layout
- `js/music.js`: chord parsing, transpose, guitar shapes, piano voicings, SVG diagrams, Web Audio
- `js/songs.js`: starter library (`SEED_SONGS`) and `CATEGORIES`
- `js/lessons.js`: guitar and piano courses (`COURSES`)
- `js/app.js`: all views (library, song, learn, editor), store, profile, recommendations, router
- `sw.js` + `manifest.webmanifest` + `icon.svg`: installable app and offline cache.
  Bump `CACHE` in `sw.js` whenever shipped files change.

## Rules
- **Lyrics copyright:** only traditional or public-domain songs get full lyrics (`status: "full"`).
  Copyrighted songs get chord charts only (`"chords"`) or details only (`"wishlist"`).
  Never paste copyrighted lyrics into `songs.js`.
- Do not present chord progressions from memory as verified; say "check against the recording".
- Everything from the shared database or other users is untrusted: escape with `esc()` or use textContent.
- Hosted copy: published as a Claude artifact (slug `4cf263b1-601b-4974-bb73-c3ad9604e225`)
  with capabilities db, user (profile scope), downloads, desktop. Shared songs live in
  `songs/<id>`; private per-person data in `data/users/<id>/profile`.
- No analytics or trackers.
