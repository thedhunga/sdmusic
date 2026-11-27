/* Sur — learning paths. Each lesson: what to learn, chords to drill (opens the
   chord-change trainer), a target tempo, and songs from the library to play. */
window.COURSES = {
  guitar: {
    label: 'Guitar', blurb: 'From your first chord to barre chords and capo tricks. Drill each lesson until the changes are clean at the target tempo, then play the songs.',
    lessons: [
      { id: 'g1', title: 'Tune up and hold the guitar', chords: ['Em', 'E'], bpm: 50,
        steps: ['Tune to E A D G B E (thickest to thinnest). Use the tuning notes below.', 'Thumb behind the neck, fingertips just behind the fret wire, wrist relaxed.', 'Play Em: two fingers. Strum all six strings and listen for buzz. Then add one finger to get E.', 'Ready for a second chord? Drunken Sailor only needs Em and D.'],
        songs: ['drunken-sailor'] },
      { id: 'g2', title: 'First minor chords: Em and Am', chords: ['Em', 'Am'], bpm: 60,
        steps: ['Am uses the same finger shape as E, moved one string over.', 'Lift and place all fingers together, like a stamp, never one at a time.', 'One strum per bar, then two, then four.'],
        songs: ['house-of-the-rising-sun'] },
      { id: 'g3', title: 'D and A: the bright chords', chords: ['D', 'A', 'Em'], bpm: 60,
        steps: ['D is a small triangle on the top three strings; don’t strum the low E or A.', 'A is three fingers in a row on the 2nd fret.', 'Keep your first finger as an anchor where you can.'],
        songs: ['with-or-without-you'] },
      { id: 'g4', title: 'G and C: four-chord songs', chords: ['G', 'C', 'D', 'Em'], bpm: 70,
        steps: ['G and C are the hardest open chords: practise the change G → C slowly, 20 times.', 'Now cycle G C D Em. This loop plays hundreds of songs.', 'When it is clean at 70 bpm, play Knockin’ on Heaven’s Door.'],
        songs: ['knockin-on-heavens-door', 'zombie', 'amazing-grace'] },
      { id: 'g5', title: 'Strumming: D - D U - U D U', chords: ['G', 'C', 'D'], bpm: 80,
        steps: ['Your hand moves down on every beat and up on every “&”, even when it misses the strings.', 'Count out loud: 1, 2 &, (3) & 4 &.', 'For Nepali lok geet try the 6/8 madal lilt: D - U D U U, accent the first beat.'],
        songs: ['resham-firiri', 'sweet-home-alabama'] },
      { id: 'g6', title: 'Fingerpicking arpeggios', chords: ['Am', 'C', 'D', 'F', 'E'], bpm: 60,
        steps: ['Thumb plays the bass note of each chord; fingers 1-2-3 play strings G-B-e.', 'Pattern: bass, G, B, e, B, G (six notes, perfect for 6/8).', 'F here can be the small 4-string F (xx3211) until barre chords come.'],
        songs: ['house-of-the-rising-sun', 'scarborough-fair', 'wish-you-were-here'] },
      { id: 'g7', title: 'Power chords and palm muting', chords: ['E5', 'G5', 'A5', 'C5'], bpm: 90,
        steps: ['Two fingers, two or three strings: root and fifth. Mute everything else.', 'Same shape everywhere: slide it to any fret.', 'Rest the edge of your strumming hand on the strings by the bridge for the chugging verse sound.'],
        songs: ['smells-like-teen-spirit', 'livin-on-a-prayer'] },
      { id: 'g8', title: 'Barre chords: F, Bm, F#m', chords: ['F', 'Bm', 'F#m', 'C#m'], bpm: 60,
        steps: ['Roll the first finger slightly onto its bony edge and pull back with the arm, not the thumb.', 'Bm is the Am shape moved up two frets with a barre.', 'Expect buzz for a week or two. Five minutes a day beats an hour on Sunday.'],
        songs: ['hotel-california', 'losing-my-religion', 'dont-stop-believin'] },
      { id: 'g9', title: 'Capo and transposing', chords: ['Em7', 'G', 'Dsus4', 'A7sus4'], bpm: 87,
        steps: ['A capo moves every chord up one semitone per fret, so easy shapes fit any key.', 'Wonderwall: capo 2, Em7 shapes, keep the top two strings pressed the whole time.', 'Use − and + on any song to put it in your singing key.'],
        songs: ['wonderwall', 'every-breath-you-take'] }
    ]
  },
  piano: {
    label: 'Piano', blurb: 'Learn the keyboard, build chords from formulas, then play songs with both hands.',
    lessons: [
      { id: 'p1', title: 'Find your way around the keys', chords: ['C'], bpm: 60, demo: [60, 62, 64, 65, 67, 69, 71, 72],
        steps: ['C is the white key just left of every group of two black keys.', 'Thumb on middle C. Play the C major scale: C D E F G A B C (use the demo).', 'Fingering, right hand: 1 2 3, thumb under, 1 2 3 4 5.'],
        songs: ['twinkle-twinkle'] },
      { id: 'p2', title: 'Major triads: C, F, G', chords: ['C', 'F', 'G'], bpm: 60,
        steps: ['A major triad = root + 4 semitones + 3 semitones. Count every key, black and white.', 'Right hand fingers 1-3-5 on C E G. Move the same shape to F A C and G B D.', 'This is I–IV–V in C, the same family of chords as Resham Firiri.'],
        songs: ['resham-firiri', 'amazing-grace'] },
      { id: 'p3', title: 'Minor triads and the pop progression', chords: ['C', 'G', 'Am', 'F'], bpm: 70,
        steps: ['Minor triad = root + 3 + 4. Lower the middle note of a major chord by one key.', 'Am, Dm and Em are all white keys.', 'C G Am F is the most-used loop in pop and rock.'],
        songs: ['zombie', 'knockin-on-heavens-door'] },
      { id: 'p4', title: 'Two hands: left-hand roots', chords: ['G', 'D', 'Am', 'C'], bpm: 70,
        steps: ['Left hand plays only the root note, one octave lower (the blue key in the diagrams).', 'Right hand holds the triad (red keys).', 'Start with both hands on beat 1 only, then the left hand on 1 and 3.'],
        songs: ['knockin-on-heavens-door', 'with-or-without-you'] },
      { id: 'p5', title: 'Inversions: smooth changes', chords: ['C', 'F/C', 'G/B', 'C'], bpm: 70,
        steps: ['An inversion is the same notes in a different order: F/C is C F A.', 'Keep shared notes still and move the others the shortest way.', 'Your hand should barely move between C, F/C and G/B.'],
        songs: ['wish-you-were-here'] },
      { id: 'p6', title: 'Rhythm: steady eighths', chords: ['E', 'B', 'C#m', 'A'], bpm: 100,
        steps: ['Right hand repeats the chord on every eighth note: 1 & 2 & 3 & 4 &.', 'Left hand holds the root for the whole bar.', 'This is the Don’t Stop Believin’ piano part. Black keys appear, so slow down.'],
        songs: ['dont-stop-believin', 'every-breath-you-take'] },
      { id: 'p7', title: 'Seventh chords', chords: ['G7', 'Cmaj7', 'Am7', 'D7'], bpm: 70,
        steps: ['Dominant 7 = major triad + ♭7 (bluesy, wants to resolve).', 'Major 7 = major triad + 7 (dreamy).', 'Minor 7 = minor triad + ♭7 (soft, jazzy).'],
        songs: ['when-the-saints', 'amazing-grace'] },
      { id: 'p8', title: 'Minor keys and rock ballads', chords: ['Am', 'Em', 'Dm', 'G', 'F'], bpm: 90,
        steps: ['In A minor the home chord is Am; F and G lead back to it.', 'Play the left hand an octave lower for a fuller sound.', 'Losing My Religion and Hotel California live in minor keys.'],
        songs: ['losing-my-religion', 'hotel-california', 'scarborough-fair'] }
    ]
  }
};
