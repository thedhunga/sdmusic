# सुर Sur — lyrics & chords songbook

A web app for playing and learning songs on **guitar and piano**: chord sheets with
chords over the lyrics, guitar fretboard and piano keyboard diagrams for every chord,
auto-scroll for playing along, guitar and piano courses, and suggestions that learn
from what you play.

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```sh
npx serve .        # or: python3 -m http.server
```

## What's inside

| File | What it does |
| --- | --- |
| `index.html` | Page shell |
| `styles.css` | All styling (light and dark) |
| `js/music.js` | Chord parsing, transposing, guitar shapes, piano voicings, SVG diagrams, audio (piano tone, plucked guitar, metronome) |
| `js/songs.js` | Starter library and categories |
| `js/lessons.js` | Guitar and piano courses |
| `js/app.js` | The app: songbook, song view, auto-scroll, Learn page, editor, sharing and recommendations |

## Songs

Songs are written in [ChordPro](https://www.chordpro.org/) style: put the chord in
square brackets right before the syllable where it changes.

```
{c: Verse 1}
[G]रेशम फिरिरी, रेशम फि[D]रिरी
{soc}
[G] [C] | [D] [G]
{eoc}
```

The editor also accepts chords written on the line above the lyrics (the format most
chord websites use) and converts them.

Each song has a `status`:

- `full`: lyrics and chords. Only for traditional or public-domain songs.
- `chords`: chord chart only. The lyrics are copyrighted, so people add their own.
- `wishlist`: details only, waiting for someone to add the chords.

## Shared songbook and private progress

When it runs as a Claude artifact, the app uses the artifact's database:

- `songs/<id>`: the **shared songbook**. Everyone the owner gives Contributor access
  can add and edit songs.
- `data/users/<id>/profile`: each person's **private** plays, likes, lesson progress
  and practice minutes. These drive the "For you" suggestions.

Run as a plain web page, it stores everything in the browser's localStorage instead.
Use **Back up songs** and **Restore or import** to move songs between the two.
