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

{
  id: 'drunken-sailor', title: 'What Shall We Do with the Drunken Sailor', artist: 'Traditional (sea shanty)', year: null,
  category: 'roots', key: 'Em', bpm: 112, time: '4/4', capo: 0, duration: 120, strum: 'D - D - D - D -  (one strum per beat)',
  tags: ['shanty','beginner','2 chords','minor'], status: 'full',
  note: 'A two-chord shanty for your first week: Em and D. Keep strumming Em and move to D only where it is marked.',
  chordpro: `{c: Verse}
[Em]What shall we do with a drunken sailor?
[D]What shall we do with a drunken sailor?
[Em]What shall we do with a drunken sailor?
[D]Ear-ly in the [Em]morning

{c: Chorus}
{soc}
[Em]Way hay and up she rises
[D]Way hay and up she rises
[Em]Way hay and up she rises
[D]Ear-ly in the [Em]morning
{eoc}

{c: Verse 2}
[Em]Put him in the long boat till he's sober
[D]Put him in the long boat till he's sober
[Em]Put him in the long boat till he's sober
[D]Ear-ly in the [Em]morning`
},
{
  id: 'twinkle-twinkle', title: 'Twinkle, Twinkle, Little Star', artist: 'Jane Taylor (1806), traditional tune', year: 1806,
  category: 'roots', key: 'C', bpm: 90, time: '4/4', capo: 0, duration: 60, strum: 'Piano: right hand melody from middle C, left hand roots',
  tags: ['beginner','piano','3 chords','nursery'], status: 'full',
  note: 'The melody starts on C and only uses the notes of the C major scale, so it is a good first tune for both hands.',
  chordpro: `{c: Verse}
[C]Twinkle, twinkle, [F]little [C]star
[F]How I wonder [C]what you [G]are [C]
[C]Up above the [F]world so [C]high [G]
[C]Like a diamond [F]in the [C]sky [G]
[C]Twinkle, twinkle, [F]little [C]star
[F]How I wonder [C]what you [G]are [C]`
},
{
  id: 'when-the-saints', title: 'When the Saints Go Marching In', artist: 'Traditional (spiritual)', year: null,
  category: 'roots', key: 'G', bpm: 104, time: '4/4', capo: 0, duration: 120, strum: 'D - D U - U D U, swing it',
  tags: ['spiritual','jazz','seventh chords','beginner'], status: 'full',
  note: 'G7 and D7 pull back home to C and G: the sound of seventh chords.',
  chordpro: `{c: Verse}
Oh, when the [G]saints go marching in
Oh, when the saints go marching [D7]in
Oh Lord, I [G]want to [G7]be in that [C]number
When the [G]saints go [D7]marching [G]in

{c: Verse 2}
Oh, when the [G]sun refuse to shine
Oh, when the sun refuse to [D7]shine
Oh Lord, I [G]want to [G7]be in that [C]number
When the [G]sun re[D7]fuse to [G]shine`
},

/* ---------- chord charts (add your own lyrics) ---------- */
{ id: 'hotel-california', title: 'Hotel California', artist: 'Eagles', year: 1976, category: 'rock-70s', key: 'Bm', bpm: 74, time: '4/4', capo: 7, duration: 390,
  strum: 'Fingerpicked arpeggios', tags: ['classic rock','minor','8-bar loop','solo'], status: 'chords',
  chordpro: `{c: Verse (one chord per bar)}
[Em] [B] [D] [A] | [C] [G] [Am] [B]

{c: Chorus}
{soc}
[C] [G] [B] [Em] | [C] [G] [Am] [B]
{eoc}

{c: Outro solo — same as verse}
[Em] [B] [D] [A] | [C] [G] [Am] [B]` },
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
  strum: 'Arpeggiated eighths', tags: ['arpeggio','pop rock'], status: 'chords',
  chordpro: `{c: Verse}
[G] [G] [Em] [Em] | [C] [D] [G] [G]` },
{ id: 'dont-stop-believin', title: "Don't Stop Believin'", artist: 'Journey', year: 1981, category: 'rock-80s', key: 'E', bpm: 119, time: '4/4', capo: 0, duration: 250,
  strum: 'Piano: steady eighths, left hand on the root', tags: ['piano','arena rock','4 chords'], status: 'chords',
  chordpro: `{c: Intro / Verse}
[E] [B] [C#m] [A] | [E] [B] [G#m] [A]` },

{ id: 'wonderwall', title: 'Wonderwall', artist: 'Oasis', year: 1995, category: 'rock-90s', key: 'F#m', bpm: 87, time: '4/4', capo: 2, duration: 258,
  strum: 'D - D U - U D U (16ths feel)', tags: ['britpop','acoustic','capo'], status: 'chords',
  chordpro: `{c: Verse}
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

/* ---------- Nepali songs: chord charts from community sheets (unverified) ---------- */
{ id: 'kehi-mitho-baat-gara', title: 'Kehi Mitho Baat Gara', titleNe: 'केही मीठो बात गर', artist: 'Narayan Gopal', category: 'nepali-classic', key: 'D', capo: 2, time: '4/4', status: 'chords', tags: ['swar samrat','adhunik'],
  strum: 'Slow ballad strum',
  note: 'Chords from a community chord sheet, not verified: check against the recording before you rely on them. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro / Verse}
[C] [Em7] [Am7] [Fsus2] | [C] [Em7] [Am7] [Fsus2]
[F] [C] [F] [C] | [F] [Fm] [C] | [C] [Em7] [Am7] [Fsus2]

{c: Chorus}
{soc}
[C] [Em7] [Am7] [Fsus2] | [C] [Em7] [Am7] [Fsus2]
{eoc}

{c: Outro}
[F] [C] [F] [C] | [F] [Fm] [C] | [C] [Em7] [Am7] [Fsus2]` },
{ id: 'yo-samjhine-man-chha', title: 'Yo Samjhine Man Chha', titleNe: 'यो सम्झिने मन छ', artist: 'Narayan Gopal', category: 'nepali-classic', key: 'Eb', capo: 3, time: '4/4', status: 'chords', tags: ['swar samrat','adhunik'],
  strum: 'Gentle strum',
  note: 'Chords from a community chord sheet, not verified: check against the recording before you rely on them. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Chorus}
{soc}
[C] [Dm] [C] [G] | [C] [Em] [C]
[C] [Dm] [C] [G] | [C] [Em] [C]
{eoc}

{c: Verse (play twice)}
[C] [Am] [Em] [C] | [Em] [Bbm] [F] | [C] [G] [C]
[C] [Dm] [C] [G] | [C] [Em] [C]

{c: Chorus}
{soc}
[C] [Dm] [C] [G] | [C] [Em] [C]
{eoc}` },
{ id: 'hataarindai-bataasindai', title: 'Hataarindai Bataasindai', titleNe: 'हतारिँदै बतासिँदै', artist: 'Sajjan Raj Vaidya', category: 'nepali-modern', key: 'A', capo: 2, time: '4/4', status: 'chords',
  tags: ['acoustic', 'pop'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Verse (x2)}
[G] [D] [Cadd9] [G] [D]

{c: Chorus (x2)}
{soc}
[Em] [G] [Cadd9] [G] [D] | [G] [D] [Cadd9] [G] [D]
{eoc}

{c: Verse 2}
[Em] [G] [Cadd9] [G] [D] | [Em] [G] [C] [G] [D] [G]

{c: Instrumental}
[G] [D] [Cadd9] [G] [D] | [G] [D] [Cadd9] [G] [D]
[Em] [G] [Cadd9] [G] [D] | [Em] [G] [Cadd9] [G] [D] [G]

{c: Bridge (x2)}
[Cadd9] [Em] [G] [D] | [Cadd9] [Em] [G] [D]

{c: Instrumental 2}
[C] [Em] [G] [D] | [C] [Em] [G] [D]
[C] [Em] [G] [D] | [C] [Em] [G] [D] [G]

{c: Then play the Verse, then Chorus}` },
{ id: 'bardali', title: 'Bardali', titleNe: 'बार्दली', artist: 'Sushant KC (ft. Indrakala Rai)', category: 'nepali-modern', key: 'Eb', capo: 3, time: '4/4', status: 'chords',
  tags: ['pop', 'duet'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[C] [G] [F] [G] [C] | [C] [G] [F] [G] [C]

{c: Verse}
[C] [G] [F] [G] [C] | [C] [G] [F] [G] [C]

{c: Pre-chorus}
[F] [C] [E] [Dm] [F] [G] | [F] [C] [E] [Dm] [F] [G]
[F] [C] [E] [Dm] [F] [C] | [F] [C] [E] [Dm] [F] [G]

{c: Chorus}
{soc}
[C] [G] [F] [G] [C] | [C] [G] [F] [G] [C]
{eoc}

{c: Bridge (x2)}
[Dm] [F] [G] [F] [G]

{c: Then play the Pre-chorus and Chorus again}` },
{ id: 'samjhi-baschhu', title: 'Samjhi Baschhu', titleNe: 'सम्झी बस्छु', artist: '1974 AD', category: 'nepali-band', key: 'E', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'ballad'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[E] [F#m] [G#m] [A] | [C] [B] [B7] [E]

{c: Verse}
[E] [F#m] [G#m] [A] | [C] [B] [B7] [E]
[E] [F#m] [G#m] [A]

{c: Chorus}
{soc}
[B] [A] [B] [A] | [G#] [C#m] [B7] [E]
{eoc}` },
{ id: 'chari-1974-ad', title: 'Chari', titleNe: 'चरी', artist: '1974 AD', category: 'nepali-band', key: 'G', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'acoustic'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[G] [Cadd9] [G] [D] | [Dsus4] [Dsus2]

{c: Verse (x2)}
[G] [Cadd9] [G] [D] | [G] [D] [G] [Em]
[G] [Em] [G]

{c: Bridge}
[C] [G] [C] [G] | [D] [G] [D] [G]

{c: Verse 2}
[C] [G] [C] [G] | [D] [G] [D] [G]
[Em] [G] [Em] [G] | [Em] [G] [Em] [G]` },
{ id: 'resham-nepathya', title: 'Resham', titleNe: 'रेशम', artist: 'Nepathya', category: 'nepali-band', key: 'B', capo: 4, time: '4/4', status: 'chords',
  tags: ['band', 'folk rock'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[G] [G] [G]

{c: Verse (x3)}
[G] | [G] [Am]
[D] [G] | [G]
[G] [Am] | [D] [G]
[Am] [D] | [D] [G]

{c: Outro}
[G] [G]` },
{ id: 'taal-ko-pani', title: 'Taal Ko Pani', titleNe: 'तालको पानी', artist: 'Nepathya', category: 'nepali-band', key: 'B', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'folk rock'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Verse (x2)}
[B] [C#m] | [B] [G#m] [B]
[B] [C#m] [G#m] [B]

{c: Ending}
[B] [C#m] | [B] [G#m] [B]
[B] [C#m] | [B] [G#m] [B]
[B] [E] | [B] [E]
[B] [E] [B] [E] | [B] [E] [B] [E]` },
{ id: 'jeevan-ho-gham-chhaya', title: 'Jeevan Ho Gham Chhaya', titleNe: 'जीवन हो घाम छाया', artist: 'Nepathya', category: 'nepali-band', key: 'C', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'folk rock'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro (x2)}
[C] [Dm] [F]

{c: Verse (x4)}
[C] [Dm] [F] [C]

{c: Chorus}
{soc}
[C] [Em] [Am] [Dm] | [F] [G] [C]
[Dm] [F] [C]
{eoc}

{c: Verse 2 (x2)}
[C] [Dm] [F] [C]

{c: Chorus (x2)}
{soc}
[C] [Em] [Am] [Dm] | [F] [G] [C]
[Dm] [F] [C]
{eoc}` },
{ id: 'aagani-bhari', title: 'Aagani Bhari', titleNe: '', artist: 'Nepathya', category: 'nepali-band', key: 'C', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'folk rock'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Verse}
[C] [F] [G] [C] | [F] [G] [C]

{c: Chorus}
{soc}
[C] [F] [C] [F] | [G] [C] [F] [G]
[C] [F] [G] [C]
{eoc}

{c: Outro}
[C] [F] [C] [F] | [G] [C]` },
{ id: 'gurasai-fulyo', title: 'Gurasai Fulyo', titleNe: '', artist: '1974 AD', category: 'nepali-band', key: 'A', capo: 0, time: '4/4', status: 'chords',
  tags: ['band'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[A] [Bm] [D] [E] | [E] [A] [A]

{c: Verse (x2)}
[A] [D] [Bm] [A] | [C#m] [Bm] [E] [A]` },
{ id: 'samjhine-mutu', title: 'Samjhine Mutu', titleNe: 'सम्झिने मुटु', artist: 'The Edge Band', category: 'nepali-band', key: 'A', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'ballad'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[A] [C#m] [Bm] | [A] [C#m] [Bm]
[A] [C#m] [Bm] | [A]

{c: Chorus}
{soc}
[A] [C#m] [Bm] [A] | [A] [C#m] [Bm] [A]
[A] [F#m] [Bm] [D] | [A] [C#m] [D]
[A] [C#m] [D] [A]
{eoc}

{c: Verse (x2)}
[A] [C#m] [Bm] | [C#m] [D] [F#m] [Bm]
[C#m] [Bm] [A] [C#m] [Bm] | [A] [C#m]
[Bm] [A]

{c: Solo}
[A] [C#m] [D] | [A] [C#m] [D]
[A] [C#m] [D] | [A]` },
{ id: 'dhun', title: 'Dhun', titleNe: 'धुन', artist: 'Rockheads', category: 'nepali-band', key: 'F', capo: 5, time: '4/4', status: 'chords',
  tags: ['band', 'rock'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[C] [G]

{c: Verse 1}
[C] [Fmaj7] [G] [G7] | [C] [Fmaj7] [G] [C]

{c: Chorus}
{soc}
[F] [C] [F] [G7] | [C] [F] [C] [F]
[G] [G7] [C]
{eoc}

{c: Verse 2}
[C] [F] [Dm] [C] | [C] [F] [G] [C]

{c: Bridge}
[C] [G] [C] [G]

{c: Outro}
[F] [C] [F] [G7] | [C] [F] [C] [F]
[Dm] [G7] [C]` },
{ id: 'mero-lagi', title: 'Mero Lagi', titleNe: 'मेरो लागि', artist: 'Cobweb', category: 'nepali-band', key: 'C#m', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'rock'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[C#m] [A]

{c: Verse}
[C#m] [A] | [C#m] [A]

{c: Chorus (x2)}
{soc}
[E] [F#m] [A] [B] | [E] [F#m] [A] [B]
[C#m] [A] [E] [E] | [C#m] [A] [B] [B]
[C#m] [A] [E] [E] | [C#m] [A] [B] [B]
{eoc}` },
{ id: 'asaar', title: 'Asaar', titleNe: 'असार', artist: 'Bipul Chettri', category: 'nepali-modern', key: 'A', capo: 0, time: '4/4', status: 'chords',
  tags: ['acoustic', 'folk'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[A] [F#m] [E]

{c: Verse 1}
[A] [A/D] [A] [A/D] | [F#m] [D] [E] [D]
[A] [D] [A] [D] | [A] [D] [A] [F#m]
[F#m] [F#m] [F#m] [E] | [F#m] [D] [A] [E]

{c: Chorus}
{soc}
[F#m] [D] [A] [E] | [F#m] [D] [A] [E]
[F#m] [D] [A] [E] | [F#m] [D] [A] [E]
[F#m] [D] [F#m] [D] | [E] [E] [A]
{eoc}

{c: Verse 2}
[A] [D] [A] [D] | [F#m] [D] [E] [D]
[A] [D] [A] [D] | [A] [A] [A] [D] [A]

{c: Outro}
[A] [D] [A] [D]` },
{ id: 'sasto-mutu', title: 'Sasto Mutu', titleNe: 'सस्तो मुटु', artist: 'Sajjan Raj Vaidya', category: 'nepali-modern', key: 'G', capo: 0, time: '4/4', status: 'chords',
  tags: ['acoustic', '2 chords', 'beginner'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[Em7] [G] [D]

{c: Verse (x3)}
[G] [Cadd9] | [G] [Cadd9]

{c: Interlude}
[G] [Cadd9]` },
{ id: 'kuraakaani', title: 'Kuraakaani', titleNe: 'कुराकानी', artist: 'Sajjan Raj Vaidya', category: 'nepali-modern', key: 'C', capo: 0, time: '4/4', status: 'chords',
  tags: ['acoustic', '4 chords'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Verse (x2)}
[C] [F] | [C] [F]
[C] [F] | [C] [F]
[Am] [F] | [C] [G]
[Am] [F] | [C] [G]

{c: Chorus}
{soc}
[Am] [F] | [C] [G]
[Am] [F] | [C] [G]
[C] [F] | [C] [F]
[C] [F] | [C] [F]
{eoc}` },
{ id: 'yo-mann-ta-mero-nepali-ho', title: 'Yo Mann Ta Mero Nepali Ho', titleNe: 'यो मन त मेरो नेपाली हो', artist: '1974 AD', category: 'nepali-band', key: 'C', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'patriotic', 'sing-along'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro (x2)}
[C] [Em7] [Am] [F] | [Dm] [G7] [G7] [C] [C]

{c: Verse (x2)}
[C] [Em] [Am] [F] | [Dm] [G] [F] [C]

{c: Verse, second half}
[E] [Am] [F] [G] | [C] [F] [G] [C]
[E] [G] [C]

{c: Verse variation}
[C] [Em] [Am] [F] | [Dm] [G] [F] [C]
[C] [Em] [Am] [F] | [Dm] [G] [C]

{c: Bridge}
[E5] [A5] [G5] [C]

{c: Riff}
[A5] [A5] [G5] [C5] | [C5] [A5] [A5] [G5]
[F5] [G5]

{c: Solo}
[C] [Em] [Am] [Am] | [F] [G] [C]` },
{ id: 'phool-ko-aankha-ma', title: 'Phool Ko Aankha Ma', titleNe: 'फूलको आँखामा', artist: 'Ani Choying Drolma', category: 'nepali-modern', key: 'C', capo: 0, time: '4/4', status: 'chords',
  tags: ['devotional', 'sing-along'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[Am] [Em] | [C] [Dm]
[Dm] [C] | [G] [C]
[C] [F] | [C] [Dm]
[Dm] [C] | [G] [C]

{c: Verse (x2)}
[C] [Dm] | [C] [Dm]
[Am] [C] | [G] [C]
[C] [F] | [C] [Dm]
[Dm] [C] | [G] [C]` },
{ id: 'timi-pari', title: 'Timi Pari', titleNe: '', artist: 'Kandara', category: 'nepali-band', key: 'C', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'folk'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[C] [Dm] | [Dm] [F] [G] [C]
[C] [Dm] | [Dm] [F] [G] [C]
[F] [G] [C] | [F] [G] [C]
[Dm] [G] [C] | [Dm] [G] [C]

{c: Verse (x2)}
[C] [Dm] | [C] [Dm]
[F] [G] [F] [G] | [C] [Dm]
[F] [C]` },
{ id: 'bhedi-gothaima', title: 'Bhedi Gothaima', titleNe: '', artist: 'Kandara', category: 'nepali-band', key: 'A', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'folk'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro (x2)}
[A] [F#m] [Bm] [E]

{c: Opening}
[A] | [F#m] [Bm]
[D] [E] [A] | [Bm] [E]
[A] [D]

{c: Verse (x2)}
[A] | [F#m] [Bm]
[A] [F#m] [Bm] | [D] [E]
[Bm] [A] | [D] [A]
[E] [A] | [Bm] [E]
[A] [D]

{c: Outro}
[A] | [F#m] [Bm]
[D] [E] [A] | [Bm] [E]
[A] [D]` },
{ id: 'timi-bhane', title: 'Timi Bhane', titleNe: 'तिमी भने', artist: 'Albatross', category: 'nepali-band', key: 'E', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'rock'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Intro}
[E] [F#add11] [Asus2] | [E] [F#add11] [Asus2] [Asus2]

{c: Verse (x2)}
[E5] [E5] [C#madd9] [C#5] | [C#madd9] [C#5] [Asus2] [F#add11] [Asus2]

{c: Chorus}
{soc}
[C#5] [B5] [C#5] [F#add11] | [Asus2] [C#5] [Asus2]
[E] [F#add11] [Asus2] [Asus2]
{eoc}` },
{ id: 'yo-dil-mero', title: 'Yo Dil Mero', titleNe: '', artist: 'The Edge Band', category: 'nepali-band', key: 'C', capo: 0, time: '4/4', status: 'chords',
  tags: ['band', 'ballad'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Verse}
[C] [F] [G] [C] | [C] [F] [G] [C]
[C] [G] [C] [Dm] | [Am] [F] [F]

{c: Pre-chorus (x2)}
[Fm] [F] [C]

{c: Chorus (x2)}
{soc}
[C] [F] [C]
{eoc}` },
{ id: 'gahiro-gahiro', title: 'Gahiro Gahiro', titleNe: 'गहिरो गहिरो', artist: 'Bipul Chettri', category: 'nepali-modern', key: 'Am', capo: 0, time: '4/4', status: 'chords',
  tags: ['acoustic', 'folk', 'minor'],
  note: 'Chords from a community chord sheet, not verified: check against the recording. Lyrics are copyrighted, so add your own.',
  chordpro: `{c: Verse}
[Am] [F] [C] [G] | [Am] [F] [G]
[Am] [F] [C] [G] | [Am] [F] [G]
[Am] [F] | [Am] [F]
[C] [Em] [F] [G] | [Am] [F]

{c: Chorus}
{soc}
[Am] [F] [C] [G] | [Am] [F] [G]
[Am] [F] [C] [G] | [Am] [F] [G]
[Am] [F] | [Am] [F]
[C] [Em] [F] [G]
{eoc}

{c: Verse 2}
[Am] [F] | [Am] [F]
[C] [Em] [F] [G] | [Am] [F] [C] [G]
[Am] [F] [G] | [Am] [F] [C] [G]
[Am] [F] [G]` },
];

window.CATEGORIES = [
  { id: 'nepali-folk',    label: 'Nepali folk',     ne: 'लोक गीत' },
  { id: 'nepali-classic', label: 'Nepali classics', ne: 'पुराना गीत' },
  { id: 'nepali-modern',  label: 'Nepali modern',   ne: 'नयाँ गीत' },
  { id: 'nepali-band',    label: 'Nepali bands',    ne: 'ब्यान्ड' },
  { id: 'rock-70s',       label: '70s rock' },
  { id: 'rock-80s',       label: '80s rock' },
  { id: 'rock-90s',       label: '90s rock' },
  { id: 'roots',          label: 'Folk & roots' },
  { id: 'other',          label: 'Other' }
];
