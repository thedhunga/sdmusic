/* Data and music-theory checks. No dependencies: `node tests/check.js` */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = { window: {}, console }; ctx.self = ctx.window; vm.createContext(ctx);
for (const f of ['js/music.js', 'js/songs.js', 'js/lessons.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const { Music: M, SEED_SONGS: songs, CATEGORIES: cats, COURSES: courses } = ctx.window;
let fails = 0;
const ok = (cond, msg) => { if (!cond) { fails++; console.error('FAIL', msg); } };

// music.js
ok(M.transposeChord('G', 2) === 'A', 'G +2 = A');
ok(M.transposeChord('Em7', 7) === 'Bm7', 'Em7 +7 = Bm7');
ok(M.transposeChord('D/F#', -2, true) === 'C/E', 'D/F# -2 = C/E');
ok(M.transposeKey('F#m', -2).name === 'Em', 'F#m -2 = Em');
for (const c of ['C', 'Am', 'F#m', 'Bbm', 'Fsus2', 'Em7', 'A7sus4', 'Cmaj7', 'D/F#', 'E5', 'Cadd9']) ok(M.parseChord(c), 'parses ' + c);

// songs.js
const ids = new Set(), catIds = new Set(cats.map(c => c.id));
for (const s of songs) {
  ok(!ids.has(s.id), 'duplicate id ' + s.id); ids.add(s.id);
  ok(['full', 'chords', 'wishlist'].includes(s.status), s.id + ': status');
  ok(catIds.has(s.category), s.id + ': category');
  ok(s.status === 'wishlist' ? !s.chordpro : !!s.chordpro, s.id + ': chordpro matches status');
  // copyright rule: full lyrics only for traditional or public-domain songs
  if (s.status === 'full') ok(/traditional/i.test(s.artist) || (s.year && s.year < 1930), s.id + ': full lyrics must be traditional or public domain');
  if (s.status === 'chords' && /nepali/.test(s.category)) ok(/check against the recording/i.test(s.note || ''), s.id + ': unverified chords must say "check against the recording"');
  const re = /\[([^\]]+)\]/g; let m;
  while ((m = re.exec(s.chordpro || ''))) {
    const c = m[1].trim();
    ok(M.parseChord(c), `${s.id}: chord [${c}] parses`);
    ok(M.guitarShape(c), `${s.id}: guitar shape for ${c}`);
  }
}

// lessons.js
for (const [k, c] of Object.entries(courses)) for (const l of c.lessons) {
  ok(l.songs.length > 0 || l.demo, `${k}/${l.id}: has a song to play`);
  for (const id of l.songs) ok(ids.has(id), `${k}/${l.id}: song ${id} exists`);
  for (const ch of l.chords) ok(M.parseChord(ch), `${k}/${l.id}: chord ${ch} parses`);
}

// service worker caches every shipped file
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
for (const f of fs.readdirSync(path.join(root, 'fonts')).filter(f => f.endsWith('.woff2'))) ok(sw.includes('./fonts/' + f), 'sw caches fonts/' + f);
for (const f of fs.readdirSync(path.join(root, 'icons'))) ok(sw.includes('./icons/' + f), 'sw caches icons/' + f);

console.log(fails ? `${fails} check(s) failed` : `All checks passed (${songs.length} songs)`);
process.exit(fails ? 1 : 0);
