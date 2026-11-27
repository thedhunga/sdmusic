/* Sur — starter library.
   status: "full"     = lyrics + chords (public-domain / traditional only)
           "chords"   = chord chart, no lyrics (copyrighted song: add your own lyrics)
           "wishlist" = details only; find the chords and add them in the app
   Chord charts are written as ChordPro: [C]lyric, {c: Section}, {soc}/{eoc} for chorus. */
window.SEED_SONGS = [
{
  id: 'resham-firiri', title: 'Resham Firiri', titleNe: 'रेशम फिरिरी', artist: 'Traditional (Nepali folk)', year: null,
  category: 'nepali-folk', key: 'G', bpm: 96, time: '6/8', capo: 0, duration: 200, strum: 'D - D U D U',
  tags: ['folk','lok geet','beginner','3 chords'], status: 'full',
  note: 'A simple three-chord arrangement for learning. Verses differ from village to village, so add the ones you know.',
  chordpro: `{c: Refrain}
{soc}
[G]रेशम फिरिरी, रेशम फि[D]रिरी
[G]उडेर जाउँ कि [C]डाँडामा भन्[G]ज्याङ, रेशम [D]फिरि[G]री
{eoc}

{c: Verse 1}
[G]एकनाले बन्दुक, दुइनाले [D]बन्दुक, मृगलाई [G]ताकेको
[G]मृगलाई मैले [C]ताकेको होइन, [G]मायालाई [D]डाके[G]को

{c: Refrain}
{soc}
[G]रेशम फिरिरी, रेशम फि[D]रिरी
[G]उडेर जाउँ कि [C]डाँडामा भन्[G]ज्याङ, रेशम [D]फिरि[G]री
{eoc}`
},
{
  id: 'house-of-the-rising-sun', title: 'The House of the Rising Sun', artist: 'Traditional (American folk)', year: null,
  category: 'roots', key: 'Am', bpm: 116, time: '6/8', capo: 0, duration: 240, strum: 'Arpeggio: bass-3-2-1-2-3 per chord',
  tags: ['folk','arpeggio','minor','beginner','rock roots'], status: 'full',
  note: 'The traditional ballad. This is the famous rock chord pattern; pick each chord as a slow arpeggio.',
  chordpro: `{c: Intro}
[Am] [C] [D] [F] | [Am] [E] [Am] [E]

{c: Verse 1}
There [Am]is a [C]house in [D]New Or[F]leans
They [Am]call the [C]Rising [E]Sun [E]
And it's [Am]been the [C]ruin of [D]many a poor [F]boy
And [Am]God, I [E]know I'm [Am]one [C] [D] [F] [Am] [E] [Am] [E]

{c: Verse 2}
My [Am]mother [C]was a [D]tailor [F]
She [Am]sewed my [C]new blue [E]jeans [E]
My [Am]father [C]was a [D]gamblin' [F]man
[Am]Down in [E]New Or[Am]leans [C] [D] [F] [Am] [E] [Am] [E]

{c: Verse 3}
Now the [Am]only [C]thing a [D]gambler [F]needs
Is a [Am]suitcase [C]and a [E]trunk [E]
And the [Am]only [C]time he's [D]satis[F]fied
Is [Am]when he's [E]on a [Am]drunk [C] [D] [F] [Am] [E] [Am] [E]

{c: Outro}
[Am] [C] [D] [F] | [Am] [E] [Am]`
},
{
  id: 'scarborough-fair', title: 'Scarborough Fair', artist: 'Traditional (English ballad)', year: null,
  category: 'roots', key: 'Am', bpm: 104, time: '3/4', capo: 0, duration: 190, strum: 'D - D - D -  (waltz: one-two-three)',
  tags: ['folk','waltz','minor','dorian'], status: 'full',
  note: 'A waltz in A Dorian. The D major chord (instead of Dm) gives it that old-world colour.',
  chordpro: `{c: Verse 1}
[Am]Are you going to [G]Scarborough [Am]Fair?
[C]Parsley, [Am]sage, rose[D]mary and [Am]thyme
Re[Am]member [C]me to one who [G]lives there
[Am]She once [G]was a true love of [Am]mine

{c: Verse 2}
[Am]Tell her to make me a [G]cambric [Am]shirt
[C]Parsley, [Am]sage, rose[D]mary and [Am]thyme
With[Am]out no [C]seams nor [G]needlework
[Am]Then she'll [G]be a true love of [Am]mine`
},
{
  id: 'amazing-grace', title: 'Amazing Grace', artist: 'John Newton (1779)', year: 1779,
  category: 'roots', key: 'G', bpm: 84, time: '3/4', capo: 0, duration: 180, strum: 'D - D U D U',
  tags: ['hymn','waltz','beginner','4 chords'], status: 'full',
  note: 'The classic first song for a new player: G, C, D and one Em.',
  chordpro: `{c: Verse 1}
A[G]mazing [G7]grace, how [C]sweet the [G]sound
That saved a wretch like [D]me
I [G]once was [G7]lost, but [C]now am [G]found
Was [Em]blind, but [D]now I [G]see

{c: Verse 2}
'Twas [G]grace that [G7]taught my [C]heart to [G]fear
And grace my fears re[D]lieved
How [G]precious [G7]did that [C]grace ap[G]pear
The [Em]hour I [D]first be[G]lieved`
},

/* ---------- chord charts (add your own lyrics) ---------- */
{ id: 'hotel-california', title: 'Hotel California', artist: 'Eagles', year: 1976, category: 'rock-70s', key: 'Bm', bpm: 74, time: '4/4', capo: 7, duration: 390,
  strum: 'Fingerpicked arpeggios; capo 7 lets you use Em shapes', tags: ['classic rock','minor','8-bar loop','solo'], status: 'chords',
  chordpro: `{c: Verse (one chord per bar)}
[Bm] [F#] [A] [E] | [G] [D] [Em] [F#]

{c: Chorus}
{soc}
[G] [D] [F#] [Bm] | [G] [D] [Em] [F#]
{eoc}

{c: Outro solo — same as verse}
[Bm] [F#] [A] [E] | [G] [D] [Em] [F#]` },
{ id: 'knockin-on-heavens-door', title: "Knockin' on Heaven's Door", artist: 'Bob Dylan', year: 1973, category: 'rock-70s', key: 'G', bpm: 68, time: '4/4', capo: 0, duration: 150,
  strum: 'D - D U - U D U', tags: ['beginner','4 chords','ballad'], status: 'chords',
  chordpro: `{c: Verse}
[G] [D] [Am] [Am] | [G] [D] [C] [C]

{c: Chorus}
{soc}
[G] [D] [Am] [Am] | [G] [D] [C] [C]
{eoc}` },
{ id: 'wish-you-were-here', title: 'Wish You Were Here', artist: 'Pink Floyd', year: 1975, category: 'rock-70s', key: 'G', bpm: 60, time: '4/4', capo: 0, duration: 330,
  strum: 'D - D U U D U', tags: ['acoustic','classic rock','ballad'], status: 'chords',
  chordpro: `{c: Intro}
[Em7] [G] [Em7] [G] | [Em7] [A7sus4] [Em7] [A7sus4] [G]

{c: Verse}
[C] [D/F#] [Am] [G] | [D/F#] [C] [Am] [G]` },
{ id: 'sweet-home-alabama', title: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', year: 1974, category: 'rock-70s', key: 'D', bpm: 98, time: '4/4', capo: 0, duration: 280,
  strum: 'D - D U - U D U', tags: ['3 chords','southern rock','loop'], status: 'chords',
  chordpro: `{c: Whole song (riff loop)}
[D] [Cadd9] [G] [G] | [D] [Cadd9] [G] [G]` },

{ id: 'sweet-child-o-mine', title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987, category: 'rock-80s', key: 'D', bpm: 125, time: '4/4', capo: 0, duration: 355,
  strum: 'Driving eighths; famous intro riff over D', tags: ['hard rock','riff'], status: 'chords',
  chordpro: `{c: Verse}
[D] [D] [C] [C] | [G] [G] [D] [D]

{c: Chorus}
{soc}
[A] [C] [D] [D]
{eoc}

{c: Bridge ("where do we go")}
[Em] [G] [A] [C] [D]` },
{ id: 'livin-on-a-prayer', title: "Livin' on a Prayer", artist: 'Bon Jovi', year: 1986, category: 'rock-80s', key: 'Em', bpm: 123, time: '4/4', capo: 0, duration: 250,
  strum: 'Palm-muted eighths in verse, open in chorus', tags: ['arena rock','minor'], status: 'chords',
  chordpro: `{c: Verse}
[Em] [C] [D] [Em]

{c: Chorus}
{soc}
[Em] [C] [D] [G] | [C] [D] [Em]
{eoc}` },
{ id: 'with-or-without-you', title: 'With or Without You', artist: 'U2', year: 1987, category: 'rock-80s', key: 'D', bpm: 110, time: '4/4', capo: 0, duration: 296,
  strum: 'Steady eighth notes, the same loop the whole song', tags: ['4 chords','loop','beginner'], status: 'chords',
  chordpro: `{c: Whole song}
[D] [A] [Bm] [G]` },
{ id: 'every-breath-you-take', title: 'Every Breath You Take', artist: 'The Police', year: 1983, category: 'rock-80s', key: 'Ab', bpm: 117, time: '4/4', capo: 1, duration: 253,
  strum: 'Arpeggiated eighths. Recording is in A♭; with capo 1, play the G shapes', tags: ['arpeggio','pop rock'], status: 'chords',
  chordpro: `{c: Verse (shapes with capo 1)}
[G] [G] [Em] [Em] | [C] [D] [G] [G]` },
{ id: 'dont-stop-believin', title: "Don't Stop Believin'", artist: 'Journey', year: 1981, category: 'rock-80s', key: 'E', bpm: 119, time: '4/4', capo: 0, duration: 250,
  strum: 'Piano: steady eighths, left hand on the root', tags: ['piano','arena rock','4 chords'], status: 'chords',
  chordpro: `{c: Intro / Verse}
[E] [B] [C#m] [A] | [E] [B] [G#m] [A]` },

{ id: 'wonderwall', title: 'Wonderwall', artist: 'Oasis', year: 1995, category: 'rock-90s', key: 'F#m', bpm: 87, time: '4/4', capo: 2, duration: 258,
  strum: 'D - D U - U D U (16ths feel), capo 2', tags: ['britpop','acoustic','capo'], status: 'chords',
  chordpro: `{c: Verse (shapes, capo 2)}
[Em7] [G] [Dsus4] [A7sus4]` },
{ id: 'smells-like-teen-spirit', title: 'Smells Like Teen Spirit', artist: 'Nirvana', year: 1991, category: 'rock-90s', key: 'Fm', bpm: 117, time: '4/4', capo: 0, duration: 301,
  strum: 'Power chords, loud chorus, muted verse', tags: ['grunge','power chords','riff'], status: 'chords',
  chordpro: `{c: Riff (verse and chorus)}
[F5] [Bb5] [Ab5] [Db5]` },
{ id: 'zombie', title: 'Zombie', artist: 'The Cranberries', year: 1994, category: 'rock-90s', key: 'Em', bpm: 84, time: '4/4', capo: 0, duration: 306,
  strum: 'D - D U - U D U', tags: ['alt rock','4 chords','loop'], status: 'chords',
  chordpro: `{c: Whole song}
[Em] [C] [G] [D]` },
{ id: 'losing-my-religion', title: 'Losing My Religion', artist: 'R.E.M.', year: 1991, category: 'rock-90s', key: 'Am', bpm: 125, time: '4/4', capo: 0, duration: 268,
  strum: 'Mandolin-style eighths', tags: ['alt rock','minor'], status: 'chords',
  chordpro: `{c: Verse}
[Am] [Em] [Am] [Em] | [Am] [Em] [Dm] [G]

{c: Chorus}
{soc}
[F] [Dm] [G] [Am]
{eoc}` },
{ id: 'creep', title: 'Creep', artist: 'Radiohead', year: 1992, category: 'rock-90s', key: 'G', bpm: 92, time: '4/4', capo: 0, duration: 238,
  strum: 'Arpeggio in verse, heavy strum in chorus', tags: ['alt rock','4 chords'], status: 'chords',
  chordpro: `{c: Whole song}
[G] [B] [C] [Cm]` },

/* ---------- Nepali wishlist: details only, chords to be added ---------- */
{ id: 'kehi-mitho-baat-gara', title: 'Kehi Mitho Baat Gara', titleNe: 'केही मीठो बात गर', artist: 'Narayan Gopal', category: 'nepali-classic', status: 'wishlist', tags: ['swar samrat','adhunik'] },
{ id: 'yo-samjhine-man-chha', title: 'Yo Samjhine Man Chha', titleNe: 'यो सम्झिने मन छ', artist: 'Narayan Gopal', category: 'nepali-classic', status: 'wishlist', tags: ['swar samrat','adhunik'] },
{ id: 'gaun-gaun-bata-utha', title: 'Gaun Gaun Bata Utha', titleNe: 'गाउँ गाउँबाट उठ', artist: 'Ramesh & Rayan', category: 'nepali-classic', status: 'wishlist', tags: ['jana geet'] },
{ id: 'bhedako-oon-jasto', title: 'Bhedako Oon Jasto', titleNe: 'भेडाको ऊन जस्तो', artist: 'Nepathya', category: 'nepali-classic', status: 'wishlist', tags: ['folk rock'] },
{ id: 'wildfire', title: 'Wildfire', artist: 'Bipul Chettri', category: 'nepali-modern', status: 'wishlist', tags: ['folk','acoustic'] },
{ id: 'hataarindai-bataasindai', title: 'Hataarindai Bataasindai', titleNe: 'हतारिँदै बतासिँदै', artist: 'Sajjan Raj Vaidya', category: 'nepali-modern', status: 'wishlist', tags: ['acoustic','pop'] },
{ id: 'bardali', title: 'Bardali', titleNe: 'बार्दली', artist: 'Sushant KC', category: 'nepali-modern', status: 'wishlist', tags: ['pop'] }
];

window.CATEGORIES = [
  { id: 'nepali-folk',    label: 'Nepali folk',     ne: 'लोक गीत' },
  { id: 'nepali-classic', label: 'Nepali classics', ne: 'पुराना गीत' },
  { id: 'nepali-modern',  label: 'Nepali modern',   ne: 'नयाँ गीत' },
  { id: 'rock-70s',       label: '70s rock' },
  { id: 'rock-80s',       label: '80s rock' },
  { id: 'rock-90s',       label: '90s rock' },
  { id: 'roots',          label: 'Folk & roots' },
  { id: 'other',          label: 'Other' }
];
