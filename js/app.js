/* Sur — app UI. Classic script, runs from file:// or hosted. */
{
const M = window.Music;
const CATS = window.CATEGORIES;
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = $('#app');
const catLabel = id => (CATS.find(c => c.id === id) || { label: 'Other' }).label;
const fmtTime = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const slug = s => (String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'song') ;

/* ---------------- prefs (per device) ---------------- */
const prefs = (() => { try { return JSON.parse(localStorage.getItem('sur.prefs') || '{}'); } catch { return {}; } })();
function savePrefs() { try { localStorage.setItem('sur.prefs', JSON.stringify(prefs)); } catch {} }
prefs.inst ||= 'guitar'; prefs.fs ||= 1; prefs.speed ||= 1; prefs.tp ||= {};

/* ---------------- store: shared songbook in the artifact db, device copy as fallback ---------------- */
let userSongs = {};          // id -> song (shared songbook)
let db = null, userApi = null, myId = null, amOwner = false, readOnly = false, storeNote = 'Saved on this device';
function loadLocal() { try { userSongs = JSON.parse(localStorage.getItem('sur.songs') || '{}'); } catch { userSongs = {}; } }
function saveLocal() { try { localStorage.setItem('sur.songs', JSON.stringify(userSongs)); } catch {} }
loadLocal();

const ID_RE = /^[A-Za-z0-9_\-.:~@+]{1,120}$/;
function clean(s, keepMeta) {
  const str = (v, n = 200) => (typeof v === 'string' ? v : v == null ? '' : String(v)).slice(0, n).trim();
  const num = (v, lo, hi) => { const n = Number(v); return Number.isFinite(n) && n >= lo && n <= hi ? Math.round(n) : null; };
  const cp = str(s.chordpro, 60000);
  const out = {
    id: slug(str(s.id) || str(s.title)), title: str(s.title) || 'Untitled', titleNe: str(s.titleNe), artist: str(s.artist),
    year: num(s.year, 1000, 2100), category: CATS.some(c => c.id === s.category) ? s.category : 'other',
    key: str(s.key, 8), bpm: num(s.bpm, 30, 260), time: str(s.time, 8) || '4/4', capo: num(s.capo, 0, 12) || 0,
    duration: num(s.duration, 20, 1800), strum: str(s.strum, 120), note: str(s.note, 600),
    tags: (Array.isArray(s.tags) ? s.tags : String(s.tags || '').split(',')).map(t => str(t, 30).toLowerCase()).filter(Boolean).slice(0, 12),
    chordpro: cp, status: !cp ? 'wishlist' : hasLyrics(cp) ? 'full' : 'chords', source: 'user',
    addedBy: typeof s.addedBy === 'string' && ID_RE.test(s.addedBy) ? s.addedBy : null,
    updatedBy: typeof s.updatedBy === 'string' && ID_RE.test(s.updatedBy) ? s.updatedBy : null,
    updatedAt: keepMeta && typeof s.updatedAt === 'string' ? s.updatedAt.slice(0, 40) : new Date().toISOString()
  };
  return out;
}
function hasLyrics(cp) {
  return cp.split('\n').some(l => !/^\s*\{/.test(l) && !SECTION_RE.test(l) && l.replace(/\[[^\]]*\]/g, '').replace(/[|\s\-x0-9]/g, '').length > 2);
}
async function saveSong(song) {
  const prev = userSongs[song.id];
  const s = clean({ ...song, addedBy: (prev && prev.addedBy) || song.addedBy || myId, updatedBy: myId });
  userSongs[s.id] = s; saveLocal();
  if (db && !readOnly) {
    try { await db.collection('songs').doc(s.id).set(s); }
    catch (e) {
      if (e && e.code === 'invalid_argument') { readOnly = true; storeNote = 'You can read this songbook but not add to it, so this song is kept on this device only'; }
      toast(e && e.code === 'quota_exceeded' ? 'The songbook is full: delete a song first' : 'Saved on this device only');
    }
  }
  return s;
}
async function deleteSong(id) {
  delete userSongs[id]; saveLocal();
  if (db && !readOnly) { try { await db.collection('songs').doc(id).delete(); } catch { toast('Removed on this device only'); } }
}
function allSongs() {
  const map = new Map(window.SEED_SONGS.map(s => [s.id, { ...s, source: 'seed' }]));
  for (const s of Object.values(userSongs)) map.set(s.id, { ...s, override: map.has(s.id) });
  return [...map.values()];
}
const getSong = id => allSongs().find(s => s.id === id);
const canDelete = s => s.source === 'user' && (amOwner || !s.addedBy || s.addedBy === myId || !db);

/* ---------------- personal profile: plays, likes, lessons, practice time (private per person) ---------------- */
const localDay = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
function emptyProfile() { return { v: 1, plays: {}, likes: {}, lessons: {}, days: {}, drill: {} }; }
function normProfile(p) {
  const e = emptyProfile(); if (!p || typeof p !== 'object') return e;
  for (const k of ['plays', 'likes', 'lessons', 'days', 'drill']) if (p[k] && typeof p[k] === 'object' && !Array.isArray(p[k])) e[k] = { ...p[k] };
  return e;
}
let profile = (() => { try { return normProfile(JSON.parse(localStorage.getItem('sur.profile') || 'null')); } catch { return emptyProfile(); } })();
let profRef = null, pushT = null, pushing = false, pushAgain = false;
function touchProfile() {
  // keep it small: last 120 days, 400 songs, 200 drilled chords
  const trim = (o, n, by) => { const ks = Object.keys(o); if (ks.length > n) ks.sort(by).slice(0, ks.length - n).forEach(k => delete o[k]); };
  trim(profile.days, 120, (a, b) => a < b ? -1 : 1);
  trim(profile.plays, 400, (a, b) => (profile.plays[a].last || 0) - (profile.plays[b].last || 0));
  trim(profile.drill, 200, (a, b) => profile.drill[a] - profile.drill[b]);
  try { localStorage.setItem('sur.profile', JSON.stringify(profile)); } catch {}
  if (profRef) { clearTimeout(pushT); pushT = setTimeout(pushProfile, 2000); }
}
async function pushProfile() {
  if (!profRef) return;
  if (pushing) { pushAgain = true; return; }
  pushing = true;
  try { await profRef.set(JSON.parse(JSON.stringify(profile))); } catch {}
  pushing = false;
  if (pushAgain) { pushAgain = false; pushT = setTimeout(pushProfile, 1500); }
}
function addPractice(secs) { const d = localDay(); profile.days[d] = (profile.days[d] || 0) + secs; }
function streak() {
  let n = 0; const d = new Date();
  if (!(profile.days[localDay(d)] >= 60)) d.setDate(d.getDate() - 1);
  while (profile.days[localDay(d)] >= 60) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const baseChord = c => { const p = M.parseChord(c); return p ? M.noteName(p.root, false) + p.qual : c; };
function knownChords() {
  const k = new Set();
  for (const [id, p] of Object.entries(profile.plays)) if (p.n > 0) { const s = getSong(id); if (s) songChords(s.chordpro).forEach(c => k.add(baseChord(c))); }
  for (const c of Object.values(window.COURSES)) for (const l of c.lessons) if (profile.lessons[l.id]) l.chords.forEach(ch => k.add(baseChord(ch)));
  for (const [c, secs] of Object.entries(profile.drill)) if (secs >= 60) k.add(baseChord(c));
  return k;
}

(async () => {
  if (!window.claude || !window.claude.use) return;
  try { [db, userApi] = await Promise.all([window.claude.use('db'), window.claude.use('user')]); } catch { db = null; }
  if (userApi) {
    try { myId = await userApi.id(); amOwner = await userApi.isOwner(); const w = await userApi.can('data.write'); if (w === false) { readOnly = true; } } catch {}
  }
  if (!db) return;
  storeNote = readOnly ? 'You can read this shared songbook. Ask its owner for Contributor access to add songs' : 'Songs you add go into the shared songbook';
  let first = true;
  const timer = setTimeout(() => { if (first) toast('Shared songbook not reachable yet; showing this device’s copy'); }, 10000);
  db.collection('songs').onSnapshot(snap => {
    if (!snap.metadata.fromCache) clearTimeout(timer);
    const next = {};
    snap.docs.forEach(d => { const v = d.data(); if (v && v.title) { const c = clean({ ...v, id: d.id }, true); next[c.id] = c; } });
    if (first && !snap.metadata.fromCache) {
      first = false;
      const pending = Object.values(userSongs).filter(s => !next[s.id]);
      pending.forEach(s => { next[s.id] = s; });
      if (pending.length && !readOnly) setTimeout(() => pending.forEach(s => db.collection('songs').doc(s.id).set(s).catch(() => {})), 0);
    }
    userSongs = next; saveLocal();
    if (!editing && !location.hash.startsWith('#song-')) route();
  }, () => { clearTimeout(timer); db = null; storeNote = 'Saved on this device'; });
  if (myId) {
    profRef = db.collection('data/users/' + myId).doc('profile');
    let got = false;
    profRef.onSnapshot(snap => {
      if (snap.metadata.fromCache || got) return;
      got = true;
      if (snap.exists) { profile = normProfile(snap.data()); try { localStorage.setItem('sur.profile', JSON.stringify(profile)); } catch {} if (!editing && !location.hash.startsWith('#song-')) route(); }
      else if (Object.keys(profile.plays).length || Object.keys(profile.lessons).length) setTimeout(pushProfile, 0);
    }, () => { profRef = null; });
  }
})();

/* ---------------- ChordPro parsing ---------------- */
const SECTION_RE = /^\s*\[?\s*(intro|verse|chorus|pre-?chorus|bridge|outro|solo|interlude|instrumental|refrain|hook|coda|ending|riff|tag|antara|sthayi|asthayi)(\s*[\w\d().'"’\-–— ]*)\]?\s*:?\s*$/i;
function parseCP(text) {
  const meta = {}, blocks = [];
  let cur = null, chorus = false, tab = null;
  const newBlock = (label, kind) => { cur = { label, kind: kind || (chorus ? 'chorus' : 'verse'), lines: [] }; blocks.push(cur); };
  const openBlock = (label, kind) => { if (cur && !cur.lines.length) { cur.kind = kind; if (label) cur.label = label; } else newBlock(label, kind); };
  for (const raw of String(text || '').replace(/\r/g, '').split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (tab) { if (/^\{\s*(eot|end_of_tab)\s*\}/i.test(line)) { tab = null; } else tab.text += line + '\n'; continue; }
    const d = /^\{\s*([a-z_]+)\s*(?::\s*(.*?))?\s*\}$/i.exec(line.trim());
    if (d) {
      const k = d[1].toLowerCase(), v = d[2] || '';
      if (['t', 'title'].includes(k)) meta.title = v;
      else if (['st', 'subtitle', 'artist'].includes(k)) meta.artist = v;
      else if (['key', 'capo', 'tempo', 'time'].includes(k)) meta[k] = v;
      else if (['soc', 'start_of_chorus'].includes(k)) { chorus = true; openBlock(v, 'chorus'); }
      else if (['eoc', 'end_of_chorus'].includes(k)) { chorus = false; cur = null; }
      else if (['sov', 'start_of_verse', 'sob', 'start_of_bridge'].includes(k)) openBlock(v, /bridge|sob/.test(k) ? 'bridge' : 'verse');
      else if (['eov', 'end_of_verse', 'eob', 'end_of_bridge'].includes(k)) cur = null;
      else if (['c', 'comment', 'ci', 'comment_italic', 'cb'].includes(k)) {
        if (!cur || cur.lines.length) newBlock(v); else cur.label = v;
      }
      else if (['sot', 'start_of_tab'].includes(k)) { if (!cur) newBlock(''); tab = { type: 'tab', text: '' }; cur.lines.push(tab); }
      continue;
    }
    const sec = SECTION_RE.exec(line);
    if (sec && !M.parseChord(line.replace(/[[\]]/g, '').trim())) { newBlock(line.replace(/[[\]:]/g, '').trim()); continue; }
    if (!cur) newBlock('');
    if (!line.trim()) { if (cur.lines.length && !chorus) cur = null; else if (cur.lines.length) cur.lines.push({ type: 'empty' }); continue; }
    cur.lines.push(parseLine(line));
  }
  return { meta, blocks: blocks.filter(b => b.lines.length || b.label) };
}
function parseLine(line) {
  const segs = []; const re = /\[([^\]]*)\]/g; let last = 0, m, chord = null;
  while ((m = re.exec(line))) {
    const before = line.slice(last, m.index);
    if (before || chord !== null) segs.push({ chord, text: before });
    chord = m[1].trim(); last = re.lastIndex;
  }
  const rest = line.slice(last);
  if (rest || chord !== null) segs.push({ chord, text: rest });
  const onlyChords = segs.every(s => !s.text.replace(/[\s|\-–x0-9/.]+/g, ''));
  return { type: 'lyric', segs, onlyChords };
}
function songChords(cp) {
  const out = []; const re = /\[([^\]]+)\]/g; let m;
  while ((m = re.exec(cp || ''))) { const c = m[1].trim(); if (M.parseChord(c) && !out.includes(c)) out.push(c); }
  return out;
}
function songSequence(cp) {
  const out = []; const re = /\[([^\]]+)\]/g; let m;
  while ((m = re.exec(cp || ''))) { const c = m[1].trim(); if (M.parseChord(c)) out.push(c); }
  return out;
}

/* chords-above-lyrics → ChordPro (for text pasted from chord websites) */
function isChordLine(l) {
  const toks = l.trim().split(/\s+/).filter(Boolean);
  if (!toks.length) return false;
  const ok = toks.filter(t => M.parseChord(t.replace(/[()]/g, '')) || /^(\||-+|x\d+|\d+x|\/|%|N\.?C\.?)$/i.test(t));
  return ok.length === toks.length && toks.some(t => M.parseChord(t.replace(/[()]/g, '')));
}
function convertChordsOverLyrics(text) {
  const lines = text.replace(/\r/g, '').replace(/\t/g, '    ').split('\n'); const out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i], n = lines[i + 1];
    if (/\[[A-G][^\]]*\]/.test(l) && !isChordLine(l.replace(/[[\]]/g, ' '))) { out.push(l); continue; } // already chordpro
    if (isChordLine(l)) {
      const pos = []; const re = /\S+/g; let m;
      while ((m = re.exec(l))) pos.push({ i: m.index, c: m[0] });
      if (n != null && n.trim() && !isChordLine(n) && !SECTION_RE.test(n)) {
        let lyr = n; const pad = Math.max(...pos.map(p => p.i)) + 1; if (lyr.length < pad) lyr = lyr.padEnd(pad, ' ');
        for (let k = pos.length - 1; k >= 0; k--) {
          const c = pos[k].c.replace(/[()]/g, '');
          if (M.parseChord(c)) lyr = lyr.slice(0, pos[k].i) + '[' + c + ']' + lyr.slice(pos[k].i);
        }
        out.push(lyr.replace(/\s+$/, '')); i++;
      } else out.push(pos.map(p => M.parseChord(p.c.replace(/[()]/g, '')) ? '[' + p.c.replace(/[()]/g, '') + ']' : p.c).join(' '));
      continue;
    }
    const sec = SECTION_RE.exec(l);
    if (sec) { out.push('{c: ' + l.replace(/[[\]:]/g, '').trim() + '}'); continue; }
    out.push(l);
  }
  return out.join('\n');
}

/* ---------------- rendering helpers ---------------- */
function viewChord(c, st) {
  if (!M.parseChord(c)) return c;
  const t = M.transposeChord(c, st.tp, st.flats);
  return st.numbers ? M.roman(c, st.baseKey) : t;
}
function renderSheet(cp, st) {
  const { blocks } = parseCP(cp);
  return blocks.map(b => {
    const lab = b.label ? `<div class="sec-l">${esc(b.label)}</div>` : '';
    const body = b.lines.map(l => {
      if (l.type === 'empty') return '<div class="ln">&nbsp;</div>';
      if (l.type === 'tab') return `<pre class="tab">${esc(l.text)}</pre>`;
      if (l.onlyChords) {
        return `<div class="ln chords-only">` + l.segs.map(s => {
          const parts = [];
          if (s.chord != null) parts.push(M.parseChord(s.chord) ? `<span class="sg"><span class="c" data-c="${esc(M.transposeChord(s.chord, st.tp, st.flats))}">${esc(viewChord(s.chord, st))}</span></span>` : `<span class="bar">${esc(s.chord)}</span>`);
          const bars = s.text.trim(); if (bars) parts.push(`<span class="bar">${esc(bars)}</span>`);
          return parts.join('');
        }).join('') + '</div>';
      }
      const hasCh = l.segs.some(s => s.chord);
      const pieces = [];
      for (const sg of l.segs) {
        const words = sg.text.split(/(?<=\s)/);
        pieces.push({ chord: sg.chord, text: words.shift() || '' });
        for (const w of words) pieces.push({ chord: null, text: w });
      }
      const groups = []; let g = [];
      for (const p of pieces) { g.push(p); if (/\s$/.test(p.text)) { groups.push(g); g = []; } }
      if (g.length) groups.push(g);
      const chordHTML = c => c == null ? (hasCh ? '<span class="c"></span>' : '') : M.parseChord(c) ? `<span class="c" data-c="${esc(M.transposeChord(c, st.tp, st.flats))}">${esc(viewChord(c, st))}</span>` : `<span class="c">${esc(c)}</span>`;
      const html = groups.map(gr => `<span class="wd">${gr.map(p => `<span class="sg">${chordHTML(p.chord)}<span class="w">${esc(p.text || (p.chord != null ? ' ' : ''))}</span></span>`).join('')}</span>`).join('');
      return `<div class="ln${hasCh ? ' hasch' : ''}">${html}</div>`;
    }).join('');
    return `<section class="sec${b.kind === 'chorus' ? ' chorus' : ''}">${lab}${body}</section>`;
  }).join('');
}
function chordBox(c, inst, extra = '') {
  const pv = M.parseChord(c); const sh = M.guitarShape(c);
  const svg = inst === 'piano' ? M.pianoSVG(c) : M.guitarSVG(c);
  const note = inst === 'guitar' && sh && !sh.exact ? '<small>simplified</small>' : '';
  return `<button class="cbox ${extra}" data-play="${esc(c)}" aria-label="Play ${esc(c)}"><b>${esc(c)}</b>${svg}${note}</button>`;
}
function badges(s) {
  const b = [];
  if (s.status === 'full') b.push('<span class="pill red">Lyrics + chords</span>');
  else if (s.status === 'chords') b.push('<span class="pill">Chords only</span>');
  else b.push('<span class="pill blue">Wishlist</span>');
  if (s.source === 'user') b.push(`<span class="pill">${s.override ? 'Edited' : 'Mine'}</span>`);
  if (s.capo) b.push(`<span class="pill">Capo ${esc(s.capo)}</span>`);
  return b.join('');
}
function card(s) {
  return `<a class="card" href="#song-${esc(s.id)}"><span class="t">${esc(s.title)}${s.titleNe ? ` <span class="ne">${esc(s.titleNe)}</span>` : ''}</span><span class="k">${esc(s.key || '')}</span><span class="a">${esc(s.artist || 'Unknown')}${s.year ? ' · ' + esc(s.year) : ''}</span><span class="b">${badges(s)}</span></a>`;
}
function searchLinks(s) {
  const q = encodeURIComponent(`${s.title} ${s.artist || ''} chords`);
  const y = encodeURIComponent(`${s.title} ${s.artist || ''}`);
  return `<a class="btn sm" href="https://www.google.com/search?q=${q}" target="_blank" rel="noopener">Find chords on the web</a> <a class="btn sm" href="https://www.youtube.com/results?search_query=${y}" target="_blank" rel="noopener">Listen on YouTube</a>`;
}


/* ---------------- taste + recommendations ---------------- */
const decade = y => y ? Math.floor(y / 10) * 10 : null;
function taste() {
  const t = { cat: {}, artist: {}, tag: {}, dec: {}, total: 0 };
  const add = (s, w) => {
    t.total += w;
    t.cat[s.category] = (t.cat[s.category] || 0) + w;
    if (s.artist && !/^traditional/i.test(s.artist)) t.artist[s.artist] = (t.artist[s.artist] || 0) + w;
    (s.tags || []).forEach(g => { t.tag[g] = (t.tag[g] || 0) + w; });
    const d = decade(s.year); if (d) t.dec[d] = (t.dec[d] || 0) + w;
  };
  const ids = new Set([...Object.keys(profile.plays), ...Object.keys(profile.likes).filter(k => profile.likes[k])]);
  for (const id of ids) {
    const s = getSong(id); if (!s) continue;
    const p = profile.plays[id] || { n: 0, sec: 0 };
    add(s, Math.min(6, p.n + p.sec / 180) + (profile.likes[id] ? 3 : 0));
  }
  return t;
}
const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(e => e[0]);
function recommend(n = 6, context = null) {
  const t = taste(), known = knownChords(), cold = t.total === 0, now = Date.now();
  const norm = o => { const m = Math.max(1, ...Object.values(o)); return k => (o[k] || 0) / m; };
  const fc = norm(t.cat), fa = norm(t.artist), ft = norm(t.tag), fd = norm(t.dec);
  const ctxChords = context ? new Set(songChords(context.chordpro)) : null;
  const ranked = allSongs().filter(s => !context || s.id !== context.id).map(s => {
    let score = 0; const why = [];
    const c = fc(s.category); score += 3 * c; if (c > 0.5) why.push(`you play a lot of ${catLabel(s.category)}`);
    const a = fa(s.artist); score += 3 * a; if (a > 0.3) why.push(`you like ${s.artist}`);
    const tg = (s.tags || []).reduce((m, g) => Math.max(m, ft(g)), 0); score += 1.5 * tg;
    const d = fd(decade(s.year)); score += 1.5 * d; if (d > 0.6 && c <= 0.5) why.push(`more from the ${decade(s.year)}s`);
    const cs = songChords(s.chordpro);
    if (cs.length && known.size) { const f = cs.filter(x => known.has(baseChord(x))).length / cs.length; score += 2.5 * f; if (f === 1) why.push('you already know every chord'); else if (f >= 0.6) why.push('uses chords you know'); }
    if (context) {
      if (s.category === context.category) score += 2;
      if (s.artist && s.artist === context.artist) score += 2;
      if (ctxChords.size && cs.length) { const sh = cs.filter(x => ctxChords.has(x)).length; score += 3 * sh / new Set([...ctxChords, ...cs]).size; if (sh >= 2 && !why.length) why.push(`shares ${sh} chords with this song`); }
    }
    const p = profile.plays[s.id];
    if (!p) { score += 1.5; if (!cold && why.length < 2) why.push('new to you'); }
    else { score -= 1.5 + Math.min(2, p.n * 0.4); if (now - (p.last || 0) < 6 * 3600e3) score -= 3; }
    if (profile.likes[s.id]) { score += 1; why.unshift('you liked it'); }
    if (s.status === 'wishlist') score -= 2.5;
    if (cold) { if ((s.tags || []).includes('beginner')) { score += 3; why.push('a good first song'); } if (s.status === 'full') score += 1; }
    return { o: s, score, why: why.slice(0, 2) };
  }).sort((a, b) => b.score - a.score);
  // keep it varied: at most two from one category unless there is nothing else
  const out = [], per = {};
  for (const x of ranked) { if (out.length >= n) break; if ((per[x.o.category] || 0) < 2 || n === 1) { out.push(x); per[x.o.category] = (per[x.o.category] || 0) + 1; } }
  for (const x of ranked) { if (out.length >= n) break; if (!out.includes(x)) out.push(x); }
  return out;
}
function playAgain(n = 4) {
  return allSongs().map(s => { const p = profile.plays[s.id]; const w = (p ? p.n + p.sec / 180 : 0) + (profile.likes[s.id] ? 3 : 0); return { o: s, score: w, why: [p && p.n ? `played ${p.n}×` : '', profile.likes[s.id] ? 'liked' : ''].filter(Boolean) }; })
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, n);
}
function tasteLine() {
  const t = taste(); if (!t.total) return '';
  const cats = top(t.cat, 2).map(catLabel), known = [...knownChords()].slice(0, 8);
  return `You play mostly <b>${esc(cats.join(' and '))}</b>${known.length ? ` · chords you know: ${known.map(c => `<b>${esc(c)}</b>`).join(' ')}` : ''}`;
}

let toastT;
function toast(msg) {
  let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600);
}
function setNav(name) { document.querySelectorAll('.nav a').forEach(a => a.dataset.v === name ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')); }

/* ---------------- LIBRARY ---------------- */
let libFilter = 'all', libQuery = '';
function viewLibrary() {
  setNav('library');
  const songs = allSongs();
  const counts = Object.fromEntries(CATS.map(c => [c.id, songs.filter(s => s.category === c.id).length]));
  app.innerHTML = `<div class="wrap">
    <div class="hero"><h1>Your songbook</h1>
      <p>Lyrics and chords for guitar and piano, with auto-scroll for playing along. Open a song, tap any chord to hear it, and press Play to scroll.</p>
      <div class="search"><input type="search" id="q" placeholder="Search songs, artists, chords (e.g. Am)…" value="${esc(libQuery)}" aria-label="Search songs"><a class="btn pri" href="#add">Add a song</a></div>
      <div class="chips" role="group" aria-label="Filter by category">
        <button data-f="all" aria-pressed="${libFilter === 'all'}">All ${songs.length}</button>
        ${CATS.filter(c => counts[c.id]).map(c => `<button data-f="${c.id}" aria-pressed="${libFilter === c.id}">${esc(c.label)} ${counts[c.id]}</button>`).join('')}
        <button data-f="liked" aria-pressed="${libFilter === 'liked'}">Liked ${songs.filter(s => profile.likes[s.id]).length}</button>
        <button data-f="mine" aria-pressed="${libFilter === 'mine'}">Added by me ${songs.filter(isMine).length}</button>
        <button data-f="community" aria-pressed="${libFilter === 'community'}">Community ${songs.filter(s => s.source === 'user').length}</button>
        <button data-f="wishlist" aria-pressed="${libFilter === 'wishlist'}">Wishlist ${songs.filter(s => s.status === 'wishlist').length}</button>
      </div></div>
    <div id="res"></div>
    <div class="tools"><span class="mute">${esc(storeNote)}.</span><button class="btn sm" id="exp">Back up songs</button><button class="btn sm" id="imp">Restore or import</button>${amOwner ? '<button class="btn sm" id="shr">Share with friends</button>' : ''}</div>
  </div>`;
  const draw = () => {
    const q = libQuery.toLowerCase().trim();
    const F = { all: () => true, mine: isMine, community: s => s.source === 'user', liked: s => profile.likes[s.id], wishlist: s => s.status === 'wishlist' };
    let list = songs.filter(F[libFilter] || (s => s.category === libFilter));
    if (q) list = list.filter(s => [s.title, s.titleNe, s.artist, s.year, catLabel(s.category), ...(s.tags || []), ...songChords(s.chordpro)].join(' ').toLowerCase().includes(q));
    const res = $('#res');
    if (!list.length) { res.innerHTML = `<div class="empty"><p>No songs match “${esc(libQuery)}”.</p><a class="btn pri" href="#add">Add it yourself</a></div>`; return; }
    if (libFilter === 'all' && !q) {
      const recs = recommend(4), tl = tasteLine(), again = playAgain();
      res.innerHTML = `<div class="shelf"><h2>For you</h2><span class="ne">${tl ? '' : 'start here'}</span></div>${tl ? `<p class="mute taste">${tl}</p>` : ''}<div class="list">${recs.map(cardWhy).join('')}</div>`
        + (again.length ? `<div class="shelf"><h2>Play again</h2></div><div class="list">${again.map(cardWhy).join('')}</div>` : '') + CATS.map(c => { const rank = { full: 0, chords: 1, wishlist: 2 }; const l = list.filter(s => s.category === c.id).sort((a, b) => rank[a.status] - rank[b.status]); return l.length ? `<div class="shelf"><h2>${esc(c.label)}</h2>${c.ne ? `<span class="ne">${esc(c.ne)}</span>` : ''}</div><div class="list">${l.map(card).join('')}</div>` : ''; }).join('');
    } else res.innerHTML = `<div class="list">${list.map(card).join('')}</div>`;
  };
  draw();
  $('#q').addEventListener('input', e => { libQuery = e.target.value; draw(); });
  app.querySelectorAll('.chips button').forEach(b => b.addEventListener('click', () => { libFilter = b.dataset.f; viewLibrary(); }));
  $('#exp').addEventListener('click', exportSongs);
  $('#shr') && $('#shr').addEventListener('click', shareHelp);
  $('#imp').addEventListener('click', importDialog);
}

const isMine = s => s.source === 'user' && (s.addedBy ? s.addedBy === myId : true);
const cardWhy = x => card(x.o).replace(/<\/a>$/, `<span class="why">${esc(x.why.join(' · '))}</span></a>`);
function shareHelp() {
  dialog(`<h2>Share your songbook</h2>
    <p>Everyone you share with sees the same songbook, and the songs they add show up for you too.</p>
    <ol><li>Open <b>Share</b> at the top of this page.</li><li>Invite friends by email, or share the link with your team.</li><li>Give them <b>Contributor</b> access if they should add songs. <b>Viewer</b> access lets them read and play only. People outside your organization can add songs only if you invite them as <b>Editor</b>.</li></ol>
    <p class="mute">Each person’s likes, play history, practice time and course progress stay private to them. Anyone who can add songs can also edit songs, so share edit access with people you trust.</p>
    <div class="row"><button class="btn pri" data-close>Got it</button></div>`);
}
async function exportSongs() {
  const data = JSON.stringify({ app: 'sur', version: 1, exported: new Date().toISOString(), songs: Object.values(userSongs) }, null, 2);
  if (!Object.keys(userSongs).length) { toast('No songs of your own to back up yet'); return; }
  try {
    const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
    if (dl) { await dl.save({ filename: 'sur-songs.json', data }); return; }
  } catch {}
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = 'sur-songs.json'; a.click(); } catch {}
  dialog(`<h2>Your songs as JSON</h2><p class="mute">If the download did not start, copy this text and keep it somewhere safe.</p><textarea rows="12" readonly>${esc(data)}</textarea><div class="row" style="margin-top:12px"><button class="btn pri" data-copy>Copy</button><button class="btn" data-close>Close</button></div>`, box => {
    box.querySelector('[data-copy]').addEventListener('click', () => navigator.clipboard.writeText(data).then(() => toast('Copied'), () => toast('Select the text and copy it')));
  });
}
function importDialog() {
  dialog(`<h2>Restore or import</h2><p class="mute">Choose a backup file, or paste backup JSON or a chord sheet copied from a website.</p>
    <input type="file" id="impf" accept=".json,.txt,.cho,.chopro,.chordpro,application/json,text/plain">
    <textarea id="impt" rows="8" placeholder="Paste here…" style="margin-top:10px"></textarea>
    <div class="row" style="margin-top:12px"><button class="btn pri" id="impgo">Import</button><button class="btn" data-close>Cancel</button></div>`, box => {
    box.querySelector('#impf').addEventListener('change', e => { const f = e.target.files[0]; if (f) f.text().then(t => { box.querySelector('#impt').value = t; }); });
    box.querySelector('#impgo').addEventListener('click', async () => {
      const t = box.querySelector('#impt').value.trim(); if (!t) return;
      let parsed = null; try { parsed = JSON.parse(t); } catch {}
      if (parsed) {
        const list = Array.isArray(parsed) ? parsed : parsed.songs || [];
        let n = 0; for (const s of list) { if (s && s.title) { await saveSong(s); n++; } }
        closeDialog(); toast(`Imported ${n} song${n === 1 ? '' : 's'}`); route();
      } else { closeDialog(); draft = { chordpro: /\[[A-G]/.test(t) ? t : convertChordsOverLyrics(t) }; if (location.hash === '#add') route(); else location.hash = '#add'; }
    });
  });
}
function dialog(html, bind) {
  closeDialog();
  const d = document.createElement('div'); d.className = 'dialog'; d.innerHTML = `<div class="box" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(d);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) closeDialog(); });
  bind && bind(d.querySelector('.box'));
  const f = d.querySelector('input,textarea,button'); f && f.focus();
}
function closeDialog() { const d = $('.dialog'); d && d.remove(); }

/* ---------------- SONG ---------------- */
let scroll = { on: false, raf: 0, last: 0, acc: 0 }, metro = null, wake = null;
let session = null, drillSecs = 0;
function flushSession(force) {
  if (session && session.unflushed && (force || session.unflushed >= 30)) {
    const p = profile.plays[session.id] ||= { n: 0, sec: 0, last: 0 };
    p.sec += session.unflushed; p.last = Date.now(); addPractice(session.unflushed);
    if (!session.counted && session.secs >= 30) { p.n++; session.counted = true; }
    session.unflushed = 0; touchProfile();
  }
  if (drillSecs && (force || drillSecs >= 30)) {
    addPractice(drillSecs);
    [...new Set(trainer.chords)].forEach(c => { profile.drill[c] = (profile.drill[c] || 0) + Math.round(drillSecs / Math.max(1, new Set(trainer.chords).size)); });
    drillSecs = 0; touchProfile();
  }
}
setInterval(() => {
  if (session && location.hash === '#song-' + session.id && (scroll.on || (metro && metro.running))) { session.secs++; session.unflushed++; }
  if (trainer.run) drillSecs++;
  flushSession(false);
}, 1000);
addEventListener('pagehide', () => flushSession(true));
document.addEventListener('visibilitychange', () => { if (document.hidden) flushSession(true); });
function finishSong(next) {
  if (session) { flushSession(true); if (!session.counted) { const p = profile.plays[session.id] ||= { n: 0, sec: 0, last: 0 }; p.n++; p.last = Date.now(); session.counted = true; touchProfile(); } }
  if (!next) { toast('End of song'); return; }
  dialog(`<h2>Nice work</h2><p>Up next: <b>${esc(next.o.title)}</b>${next.o.artist ? ' · ' + esc(next.o.artist) : ''}</p>${next.why.length ? `<p class="mute">Because ${esc(next.why.join(' and '))}.</p>` : ''}
    <div class="row"><a class="btn pri" href="#song-${esc(next.o.id)}" data-close>Play it</a><button class="btn" data-close>Stay here</button></div>`);
}
function stopScroll() {
  scroll.on = false; cancelAnimationFrame(scroll.raf);
  const b = $('#go'); if (b) b.textContent = 'Play';
  if (wake) { wake.release().catch(() => {}); wake = null; }
}
function viewSong(id) {
  const s = getSong(id);
  if (!s) { app.innerHTML = `<div class="wrap"><div class="empty"><p>That song is not in your songbook.</p><a class="btn" href="#library">Back to songs</a></div></div>`; return; }
  setNav('library');
  const tp = prefs.tp[id] || 0;
  const kt = M.transposeKey(s.key, tp);
  const st = { tp, flats: kt ? kt.flats : false, numbers: !!prefs.numbers, baseKey: s.key };
  const chords = songChords(s.chordpro).map(c => M.transposeChord(c, tp, st.flats));
  const dur = s.duration || 210;
  const next = recommend(1, s)[0];
  session = { id, secs: 0, unflushed: 0, counted: false };
  app.innerHTML = `
    <div class="wrap shead"><a class="back" href="#library">← All songs</a>
      <h1>${esc(s.title)}</h1>${s.titleNe ? `<div class="ne">${esc(s.titleNe)}</div>` : ''}
      <div class="by">${esc(s.artist || 'Unknown artist')}${s.year ? ' · ' + esc(s.year) : ''} · ${esc(catLabel(s.category))}</div>
      <div class="row" style="margin:0 0 10px;align-items:center"><button class="btn sm" id="like" aria-pressed="${!!profile.likes[s.id]}">${profile.likes[s.id] ? 'Liked' : 'Like'}</button><span class="mute" id="who" style="font-size:15px"></span>${profile.plays[s.id] ? `<span class="mute" style="font-size:15px">Played ${profile.plays[s.id].n}× · ${fmtTime(profile.plays[s.id].sec)}</span>` : ''}</div>
      <div class="meta">${s.key ? `<span class="pill red">Key ${esc(kt ? kt.name : s.key)}${tp ? ` (orig. ${esc(s.key)})` : ''}</span>` : ''}${s.capo ? `<span class="pill">Capo ${esc(s.capo)}</span>` : ''}${s.bpm ? `<span class="pill">${esc(s.bpm)} bpm</span>` : ''}${s.time ? `<span class="pill">${esc(s.time)}</span>` : ''}${s.strum ? `<span class="pill blue">Strum: ${esc(s.strum)}</span>` : ''}</div>
    </div>
    ${s.status !== 'wishlist' ? `<div class="rail"><div class="wrap">
      <div class="tp" role="group" aria-label="Transpose"><button id="tdn" aria-label="Transpose down">−</button><output>${tp > 0 ? '+' + tp : tp} st</output><button id="tup" aria-label="Transpose up">+</button></div>
      <div class="seg" role="group" aria-label="Instrument"><button data-i="guitar" aria-pressed="${prefs.inst === 'guitar'}">Guitar</button><button data-i="piano" aria-pressed="${prefs.inst === 'piano'}">Piano</button></div>
      <button class="btn sm" id="num" aria-pressed="${st.numbers}" title="Show chords as numbers in the key (I, IV, V)">I–IV–V</button>
      <div class="seg" role="group" aria-label="Text size"><button id="fsd" aria-label="Smaller text">A−</button><button id="fsu" aria-label="Larger text">A+</button></div>
      ${s.bpm ? `<button class="btn sm" id="met" aria-pressed="false" title="Metronome at ${esc(s.bpm)} bpm">Metronome</button>` : ''}
      <button class="btn sm" id="stage" aria-pressed="${document.body.classList.contains('stage')}" title="Hide everything except the lyrics">Stage view</button>
      <a class="btn sm" href="#learn" id="prac">Practise chords</a>
      <a class="btn sm" href="#edit-${esc(s.id)}">Edit</a>
    </div></div>` : ''}
    <div class="wrap">
      ${s.status === 'chords' ? `<div class="banner"><b>Chords only.</b> Lyrics are copyrighted, so they're not included. Tap <a href="#edit-${esc(s.id)}">Edit</a> to add lyrics from your own songbook. ${searchLinks(s)}</div>` : ''}
      ${s.status === 'wishlist' ? `<div class="banner"><b>No chords yet.</b> Find a chord sheet you trust, copy it, then paste it into the editor. Chords written above the lyrics are converted for you.<div class="row" style="margin-top:10px">${searchLinks(s)} <a class="btn sm pri" href="#edit-${esc(s.id)}">Add chords</a></div></div>` : ''}
      ${s.note ? `<p class="mute">${esc(s.note)}</p>` : ''}
      ${chords.length ? `<div class="strip" id="strip">${chords.map(c => chordBox(c, prefs.inst)).join('')}</div>` : ''}
      <div class="sheet" id="sheet" style="--fs:${prefs.fs}">${renderSheet(s.chordpro, st)}</div>
      <div class="similar"><div class="shelf"><h2>Play next</h2><span class="ne">based on this song and what you like</span></div><div class="list">${recommend(4, s).map(cardWhy).join('') || '<p class="mute">Add more songs to see suggestions.</p>'}</div></div>
    </div>
    ${s.status !== 'wishlist' ? `<div class="player" role="region" aria-label="Auto-scroll"><div class="in">
      <button class="go" id="go">Play</button>
      <button id="top" aria-label="Back to start">⟲</button>
      <label class="tm" for="spd">Speed</label><input type="range" id="spd" min="0.25" max="3" step="0.05" value="${prefs.speed}" aria-label="Scroll speed"><span class="sp" id="spv">${prefs.speed.toFixed(2)}×</span>
      <span class="tm" id="eta">≈ ${fmtTime(dur / prefs.speed)}</span>
      <button id="unstage" ${document.body.classList.contains('stage') ? '' : 'hidden'}>Exit stage</button>
      ${next ? `<a class="nextbtn" href="#song-${esc(next.o.id)}" title="Up next: ${esc(next.o.title)}">Next: ${esc(next.o.title)}</a>` : ''}
    </div></div>` : ''}`;

  // events
  $('#like').addEventListener('click', e => { if (profile.likes[id]) delete profile.likes[id]; else profile.likes[id] = Date.now(); touchProfile(); const on = !!profile.likes[id]; e.currentTarget.setAttribute('aria-pressed', on); e.currentTarget.textContent = on ? 'Liked' : 'Like'; toast(on ? 'Liked: your suggestions will lean this way' : 'Removed from liked songs'); });
  if (s.addedBy && userApi) userApi.profiles([s.addedBy]).then(ps => { const p = ps[s.addedBy], w = $('#who'); if (w && p) w.textContent = 'Added by ' + (p.isMe ? 'you' : p.name || 'a contributor'); }).catch(() => {});
  app.querySelectorAll('[data-play]').forEach(b => b.addEventListener('click', () => M.playChord(b.dataset.play, prefs.inst)));
  $('#sheet').addEventListener('click', e => {
    const c = e.target.closest('.c[data-c]'); if (!c) return;
    M.playChord(c.dataset.c, prefs.inst);
    const box = [...document.querySelectorAll('.cbox')].find(b => b.dataset.play === c.dataset.c);
    if (box) { document.querySelectorAll('.cbox.hot').forEach(x => x.classList.remove('hot')); box.classList.add('hot'); box.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
  });
  const re = () => { const y = scrollY; viewSong(id); scrollTo(0, y); };
  $('#tup') && $('#tup').addEventListener('click', () => { prefs.tp[id] = M.mod(tp + 1 + 6, 12) - 6; savePrefs(); re(); });
  $('#tdn') && $('#tdn').addEventListener('click', () => { prefs.tp[id] = M.mod(tp - 1 + 6, 12) - 6; savePrefs(); re(); });
  app.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { prefs.inst = b.dataset.i; savePrefs(); re(); }));
  $('#num') && $('#num').addEventListener('click', () => { prefs.numbers = !prefs.numbers; savePrefs(); re(); });
  $('#fsu') && $('#fsu').addEventListener('click', () => { prefs.fs = Math.min(2.2, +(prefs.fs + 0.1).toFixed(2)); savePrefs(); $('#sheet').style.setProperty('--fs', prefs.fs); });
  $('#fsd') && $('#fsd').addEventListener('click', () => { prefs.fs = Math.max(0.7, +(prefs.fs - 0.1).toFixed(2)); savePrefs(); $('#sheet').style.setProperty('--fs', prefs.fs); });
  $('#prac') && $('#prac').addEventListener('click', () => { trainer.chords = songSequence(s.chordpro).map(c => M.transposeChord(c, tp, st.flats)).slice(0, 32); trainer.from = s.title; if (s.bpm) trainer.bpm = Math.min(120, s.bpm); });
  if (!$('#go')) return;
  const rate = () => { const max = document.documentElement.scrollHeight - innerHeight; const start = $('#sheet').getBoundingClientRect().top + scrollY - 130; return Math.max(8, (max - Math.max(0, start)) / dur) * prefs.speed; };
  const step = t => {
    if (!scroll.on) return;
    const dt = Math.min(0.1, (t - scroll.last) / 1000); scroll.last = t;
    scroll.acc += rate() * dt;
    if (scroll.acc >= 1) { const px = Math.floor(scroll.acc); scroll.acc -= px; scrollBy(0, px); }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) { stopScroll(); finishSong(next); return; }
    const left = (document.documentElement.scrollHeight - innerHeight - scrollY) / rate();
    const eta = $('#eta'); if (eta) eta.textContent = fmtTime(left) + ' left';
    scroll.raf = requestAnimationFrame(step);
  };
  const start = async () => {
    const sheetTop = $('#sheet').getBoundingClientRect().top;
    if (sheetTop > 200) scrollTo({ top: scrollY + sheetTop - 130, behavior: 'smooth' });
    scroll.on = true; scroll.acc = 0; $('#go').textContent = 'Pause';
    try { wake = navigator.wakeLock ? await navigator.wakeLock.request('screen') : null; } catch { wake = null; }
    setTimeout(() => { scroll.last = performance.now(); scroll.raf = requestAnimationFrame(step); }, sheetTop > 200 ? 700 : 0);
  };
  $('#go').addEventListener('click', () => scroll.on ? stopScroll() : start());
  $('#top').addEventListener('click', () => { stopScroll(); scrollTo({ top: 0, behavior: 'smooth' }); $('#eta').textContent = '≈ ' + fmtTime(dur / prefs.speed); });
  $('#spd').addEventListener('input', e => { prefs.speed = +e.target.value; savePrefs(); $('#spv').textContent = prefs.speed.toFixed(2) + '×'; if (!scroll.on) $('#eta').textContent = '≈ ' + fmtTime(dur / prefs.speed); });
  $('#stage').addEventListener('click', e => {
    const on = document.body.classList.toggle('stage'); e.currentTarget.setAttribute('aria-pressed', on); $('#unstage').hidden = !on;
    try { on ? document.documentElement.requestFullscreen?.().catch(() => {}) : document.fullscreenElement && document.exitFullscreen().catch(() => {}); } catch {}
  });
  $('#unstage').addEventListener('click', () => { document.body.classList.remove('stage'); $('#unstage').hidden = true; $('#stage').setAttribute('aria-pressed', 'false'); try { document.fullscreenElement && document.exitFullscreen().catch(() => {}); } catch {} });
  const mb = $('#met');
  if (mb) mb.addEventListener('click', () => {
    if (metro && metro.running) { metro.stop(); mb.setAttribute('aria-pressed', 'false'); return; }
    metro = M.Metronome(); metro.bpm = s.bpm; metro.beats = parseInt(s.time) || 4; metro.start(); mb.setAttribute('aria-pressed', 'true');
  });
}
document.addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select,[contenteditable]')) return;
  const go = $('#go'); if (!go) return;
  if (e.code === 'Space') { e.preventDefault(); go.click(); }
  else if (e.key === 'ArrowUp' && scroll.on) { e.preventDefault(); const r = $('#spd'); r.value = Math.min(3, +r.value + 0.1); r.dispatchEvent(new Event('input')); }
  else if (e.key === 'ArrowDown' && scroll.on) { e.preventDefault(); const r = $('#spd'); r.value = Math.max(0.25, +r.value - 0.1); r.dispatchEvent(new Event('input')); }
});

/* ---------------- LEARN ---------------- */
const trainer = { chords: ['G', 'C', 'D', 'Em'], bpm: 70, per: 4, from: '', strum: true, run: null };
const PRESETS = {
  'Folk basics (G C D Em)': ['G', 'C', 'D', 'Em'],
  'Rock in E (E A B7)': ['E', 'A', 'B7'],
  'Pop 4 chords (C G Am F)': ['C', 'G', 'Am', 'F'],
  'Minor ballad (Am F C G)': ['Am', 'F', 'C', 'G'],
  'Power chords (E5 G5 A5 C5)': ['E5', 'G5', 'A5', 'C5'],
  'Barre practice (F Bm F#m C#m)': ['F', 'Bm', 'F#m', 'C#m']
};
const explorer = { root: 0, q: '' };
let openLesson = null;
function rerenderLearn() { const y = scrollY; viewLearn(); scrollTo(0, y); }
function courseHTML() {
  const track = prefs.course === 'piano' ? 'piano' : 'guitar', C = window.COURSES[track];
  const done = C.lessons.filter(l => profile.lessons[l.id]).length;
  const nextL = C.lessons.find(l => !profile.lessons[l.id]);
  const open = openLesson || (nextL && nextL.id);
  const week = Object.entries(profile.days).filter(([d]) => (Date.now() - new Date(d + 'T12:00:00')) < 7 * 864e5).reduce((a, [, v]) => a + v, 0);
  const st = streak();
  const lessonHTML = (l, i) => {
    const learned = !!profile.lessons[l.id];
    const songs = l.songs.map(getSong).filter(Boolean);
    return `<details class="lesson${learned ? ' done' : ''}" data-lesson="${l.id}" ${l.id === open ? 'open' : ''}>
      <summary><span class="lnum">Lesson ${i + 1}</span><span class="ltitle">${esc(l.title)}</span>${learned ? '<span class="pill red">Learned</span>' : ''}</summary>
      <ul>${l.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="strip">${l.chords.map(c => chordBox(c, track)).join('')}</div>
      <div class="row">
        <button class="btn pri sm" data-drill="${l.id}">Drill these chords · goal ${l.bpm} bpm</button>
        ${l.demo ? `<button class="btn sm" data-demo="${l.id}">Play the scale</button>` : ''}
        ${track === 'guitar' && l.id === 'g1' ? '<button class="btn sm" data-goto="tuner">Tuning notes</button>' : ''}
        <button class="btn sm" data-learned="${l.id}" aria-pressed="${learned}">${learned ? 'Learned' : 'Mark as learned'}</button>
      </div>
      ${songs.length ? `<p class="songs">Then play: ${songs.map(x => `<a href="#song-${esc(x.id)}">${esc(x.title)}</a>`).join(' · ')}</p>` : ''}
    </details>`;
  };
  return `<section class="course" aria-labelledby="co-h">
    <div class="stats"><div><b>${Math.round((profile.days[localDay()] || 0) / 60)}</b><span>min today</span></div><div><b>${Math.round(week / 60)}</b><span>min this week</span></div><div><b>${st}</b><span>day streak</span></div><div><b>${done}/${C.lessons.length}</b><span>${esc(C.label.toLowerCase())} lessons</span></div></div>
    <div class="row" style="justify-content:space-between;align-items:center;margin:18px 0 6px"><h2 id="co-h" style="margin:0">${esc(C.label)} course</h2>
      <div class="seg" role="group" aria-label="Course"><button data-course="guitar" aria-pressed="${track === 'guitar'}">Guitar</button><button data-course="piano" aria-pressed="${track === 'piano'}">Piano</button></div></div>
    <p class="mute" style="margin:0 0 10px">${esc(C.blurb)}</p>
    <div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="${C.lessons.length}" aria-valuenow="${done}"><i style="width:${Math.round(100 * done / C.lessons.length)}%"></i></div>
    ${C.lessons.map(lessonHTML).join('')}
  </section>`;
}
const quiz = { level: 'easy', answer: null, score: 0, tries: 0, msg: '' };
const QUIZ_LEVELS = { easy: ['', 'm'], medium: ['', 'm', '7', 'sus4'], hard: ['', 'm', '7', 'maj7', 'm7', 'dim'] };
function viewLearn() {
  setNav('learn');
  const exName = M.noteName(explorer.root, false) + explorer.q;
  const iv = M.intervals(explorer.q);
  app.innerHTML = `<div class="wrap">
  <div class="hero"><h1>Learn</h1><p>Step-by-step courses for guitar and piano. Practice time counts automatically while you drill chords or play along with a song.</p></div>
  ${courseHTML()}
  <div class="grid2">
    <section class="panel" aria-labelledby="ex-h"><h2 id="ex-h">Chord finder</h2>
      <div class="roots" role="group" aria-label="Root note">${M.SHARP.map((n, i) => `<button data-r="${i}" aria-pressed="${explorer.root === i}">${n}</button>`).join('')}</div>
      <div class="field"><label for="exq">Chord type</label><select id="exq">${Object.keys(M.QUAL_NAMES).map(q => `<option value="${q}" ${q === explorer.q ? 'selected' : ''}>${esc(M.noteName(explorer.root, false) + q)} · ${M.QUAL_NAMES[q]}</option>`).join('')}</select></div>
      <div class="big">${M.guitarSVG(exName, { w: 150, h: 180 })}${M.pianoSVG(exName, { ww: 15, h: 96 })}</div>
      <div class="notes">${iv.map(i => `<span>${M.noteName(explorer.root + i, false)}<em>${M.INTERVAL_NAMES[i] || i}</em></span>`).join('')}</div>
      <p class="mute" style="text-align:center;font-size:14px;margin:8px 0">Piano: <span style="color:var(--blue);font-weight:700">blue</span> = left hand, <span style="color:var(--red);font-weight:700">red</span> = right hand</p>
      <div class="row" style="justify-content:center"><button class="btn" data-pg="guitar">Hear on guitar</button><button class="btn" data-pg="piano">Hear on piano</button></div>
    </section>
    <section class="panel" aria-labelledby="tr-h"><h2 id="tr-h">Chord-change trainer</h2>
      <p>${trainer.from ? `Chords from <b>${esc(trainer.from)}</b>. ` : ''}Switch on beat 1 of each bar. Start slow; speed up when the change is clean.</p>
      <div class="trainer" aria-live="polite"><div class="now" id="tnow">${esc(trainer.chords[0] || '—')}</div><div class="nx" id="tnext">next: ${esc(trainer.chords[1] || trainer.chords[0] || '')}</div>
        <div id="tdiag" class="big" style="margin:6px 0">${trainer.chords[0] ? (prefs.inst === 'piano' ? M.pianoSVG(trainer.chords[0], { ww: 13, h: 80 }) : M.guitarSVG(trainer.chords[0], { w: 130, h: 156 })) : ''}</div>
        <div class="dots" id="tdots">${Array.from({ length: trainer.per }, () => '<i></i>').join('')}</div></div>
      <div class="field"><label for="tch">Chords (space separated)</label><input type="text" id="tch" value="${esc(trainer.chords.join(' '))}"></div>
      <div class="row" style="margin-top:8px">
        <div class="field"><label for="tpre">Presets</label><select id="tpre"><option value="">Choose…</option>${Object.keys(PRESETS).map(k => `<option>${esc(k)}</option>`).join('')}</select></div>
        <div class="field"><label for="tbpm">Tempo <span id="tbv">${trainer.bpm}</span> bpm</label><input type="range" id="tbpm" min="40" max="160" value="${trainer.bpm}" style="accent-color:var(--red)"></div>
        <div class="field"><label for="tper">Beats per chord</label><select id="tper">${[2, 4, 8].map(n => `<option ${n === trainer.per ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn pri" id="tgo">${trainer.run ? 'Stop' : 'Start'}</button>
        <div class="seg" role="group" aria-label="Instrument"><button data-i="guitar" aria-pressed="${prefs.inst === 'guitar'}">Guitar</button><button data-i="piano" aria-pressed="${prefs.inst === 'piano'}">Piano</button></div>
        <button class="btn sm" id="tstr" aria-pressed="${trainer.strum}">Play the chord too</button></div>
    </section>
    <section class="panel" aria-labelledby="qz-h"><h2 id="qz-h">Ear trainer</h2>
      <p>Press play, listen, and name the chord type. Major sounds bright, minor sounds sad, 7th sounds bluesy and unresolved.</p>
      <div class="row"><button class="btn pri" id="qplay">${quiz.answer ? 'Play again' : 'Play a chord'}</button>
        <div class="seg" role="group" aria-label="Level">${Object.keys(QUIZ_LEVELS).map(l => `<button data-l="${l}" aria-pressed="${quiz.level === l}">${l[0].toUpperCase() + l.slice(1)}</button>`).join('')}</div></div>
      <div class="quiz">${QUIZ_LEVELS[quiz.level].map(q => `<button class="btn" data-a="${q}" ${quiz.answer ? '' : 'disabled'}>${esc(M.QUAL_NAMES[q])}</button>`).join('')}</div>
      <p aria-live="polite" id="qmsg">${quiz.msg}</p><p class="mute">Score ${quiz.score} / ${quiz.tries}</p>
    </section>
    <section class="panel" id="tuner" aria-labelledby="tu-h"><h2 id="tu-h">Tuning notes</h2>
      <p>Pluck a string and tap its button. Turn the peg until both sound the same and the wobble stops.</p>
      <div class="roots" style="grid-template-columns:repeat(6,minmax(0,1fr))">${[['E', 40], ['A', 45], ['D', 50], ['G', 55], ['B', 59], ['e', 64]].map(([n, m]) => `<button data-tune="${m}">${n}</button>`).join('')}</div>
      <p class="mute" style="font-size:14px">Thickest string (low E) on the left. The piano’s A above middle C is 440 Hz: <button class="btn sm" data-tune="69" data-pno>Play A440</button></p>
    </section>
    <section class="panel" aria-labelledby="ls-h"><h2 id="ls-h">Reference</h2>
      <details><summary>Reading a guitar chord diagram</summary><p>Vertical lines are strings: thickest (low E) on the left, thinnest (high e) on the right. Horizontal lines are frets. A dot means press there; ○ means play the open string; × means don't play it. A number on the left (for example 5) means the diagram starts at that fret, and a long bar means one finger presses several strings (a barre).</p></details>
      <details><summary>Building piano chords</summary><p>Count semitones (every key, black and white) up from the root.</p>
        <table><tr><th>Chord</th><th>Formula</th><th>Example in C</th></tr><tr><td>Major</td><td>R + 4 + 3</td><td>C E G</td></tr><tr><td>Minor</td><td>R + 3 + 4</td><td>C E♭ G</td></tr><tr><td>Dominant 7</td><td>major + ♭7</td><td>C E G B♭</td></tr><tr><td>Major 7</td><td>major + 7</td><td>C E G B</td></tr><tr><td>sus4</td><td>R + 5 + 2</td><td>C F G</td></tr></table>
        <p>Left hand plays the root low (or the note after the slash, as in D/F♯); right hand plays the chord.</p></details>
      <details><summary>Capo and transposing</summary><p>A capo raises every chord by one semitone per fret. Wonderwall is in F♯ minor, but with a capo on 2 you play easy Em shapes. In any song, use the − and + buttons to move the whole song into a key that suits your voice; the diagrams follow.</p></details>
      <details><summary>Strum notation</summary><p><b>D</b> = down strum, <b>U</b> = up strum, <b>-</b> = skip a beat while your hand keeps moving. The common folk pattern <b>D - D U - U D U</b> counts as “1 2 & 3 & 4 &” with the hand moving down on numbers and up on “&”.</p></details>
      <details><summary>The number system (I–IV–V)</summary><p>Number the chords by their place in the key. In G: G = I, Am = ii, Bm = iii, C = IV, D = V, Em = vi. Many songs share the same numbers. Resham Firiri and Knockin' on Heaven's Door are both built on I, IV and V, so once you know the shape you can play it in any key. Turn on <b>I–IV–V</b> in a song to see its numbers.</p></details>
      <details><summary>Madal rhythm for Nepali folk</summary><p>Many lok geet sit in a lilting 6/8 feel (“dha-tin-ta, dha-tin-ta”). On guitar, strum D on 1 and 4 with light U strums between: <b>D - U D U U</b>. Keep it relaxed and let the bass note ring.</p></details>
    </section>
  </div></div>`;
  const stopTrainer = () => { if (trainer.run) { trainer.run.stop(); trainer.run = null; flushSession(true); } };
  // course
  app.querySelectorAll('[data-course]').forEach(b => b.addEventListener('click', () => { prefs.course = b.dataset.course; prefs.inst = b.dataset.course; savePrefs(); openLesson = null; rerenderLearn(); }));
  app.querySelectorAll('details.lesson').forEach(d => d.addEventListener('toggle', () => { if (d.open) openLesson = d.dataset.lesson; }));
  const findLesson = id => Object.values(window.COURSES).flatMap(c => c.lessons).find(l => l.id === id);
  app.querySelectorAll('[data-drill]').forEach(b => b.addEventListener('click', () => {
    const l = findLesson(b.dataset.drill); stopTrainer();
    trainer.chords = l.chords.slice(); trainer.bpm = Math.max(40, l.bpm - 10); trainer.from = l.title; openLesson = l.id;
    rerenderLearn(); $('#tr-h').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  app.querySelectorAll('[data-demo]').forEach(b => b.addEventListener('click', () => M.playNotes(findLesson(b.dataset.demo).demo, 'piano')));
  app.querySelectorAll('[data-learned]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.learned;
    if (profile.lessons[id]) delete profile.lessons[id]; else { profile.lessons[id] = Date.now(); toast('Lesson learned. On to the next one'); openLesson = null; }
    touchProfile(); rerenderLearn();
  }));
  app.querySelectorAll('.course [data-play]').forEach(b => b.addEventListener('click', () => M.playChord(b.dataset.play, prefs.course === 'piano' ? 'piano' : 'guitar')));
  app.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.goto).scrollIntoView({ behavior: 'smooth' })));
  app.querySelectorAll('[data-tune]').forEach(b => b.addEventListener('click', () => M.playNotes([+b.dataset.tune], b.hasAttribute('data-pno') ? 'piano' : 'guitar')));
  // explorer
  app.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { explorer.root = +b.dataset.r; rerenderLearn(); M.playChord(M.noteName(explorer.root, false) + explorer.q, prefs.inst); }));
  $('#exq').addEventListener('change', e => { explorer.q = e.target.value; rerenderLearn(); M.playChord(M.noteName(explorer.root, false) + explorer.q, prefs.inst); });
  app.querySelectorAll('[data-pg]').forEach(b => b.addEventListener('click', () => M.playChord(exName, b.dataset.pg)));
  // trainer
  $('#tch').addEventListener('change', e => { trainer.chords = e.target.value.split(/[\s,|]+/).filter(c => M.parseChord(c)); trainer.from = ''; stopTrainer(); rerenderLearn(); });
  $('#tpre').addEventListener('change', e => { if (PRESETS[e.target.value]) { trainer.chords = PRESETS[e.target.value].slice(); trainer.from = ''; stopTrainer(); rerenderLearn(); } });
  $('#tbpm').addEventListener('input', e => { trainer.bpm = +e.target.value; $('#tbv').textContent = trainer.bpm; if (trainer.run) trainer.run.bpm = trainer.bpm; });
  $('#tper').addEventListener('change', e => { trainer.per = +e.target.value; stopTrainer(); rerenderLearn(); });
  $('#tstr').addEventListener('click', e => { trainer.strum = !trainer.strum; e.currentTarget.setAttribute('aria-pressed', trainer.strum); });
  app.querySelectorAll('.panel [data-i]').forEach(b => b.addEventListener('click', () => { prefs.inst = b.dataset.i; savePrefs(); stopTrainer(); rerenderLearn(); }));
  $('#tgo').addEventListener('click', () => {
    if (trainer.run) { stopTrainer(); $('#tgo').textContent = 'Start'; return; }
    if (!trainer.chords.length) { toast('Add some chords first'); return; }
    const m = M.Metronome(); m.bpm = trainer.bpm; m.beats = trainer.per; trainer.run = m;
    m.onBeat = (b, t) => {
      const idx = Math.floor(b / trainer.per) % trainer.chords.length, beat = b % trainer.per;
      const c = trainer.chords[idx], nx = trainer.chords[(idx + 1) % trainer.chords.length];
      if (beat === 0) {
        $('#tnow').textContent = c; $('#tnext').textContent = 'next: ' + nx;
        $('#tdiag').innerHTML = prefs.inst === 'piano' ? M.pianoSVG(c, { ww: 13, h: 80 }) : M.guitarSVG(c, { w: 130, h: 156 });
        if (trainer.strum) M.playChord(c, prefs.inst);
      }
      document.querySelectorAll('#tdots i').forEach((d, i) => d.classList.toggle('on', i <= beat));
    };
    m.start(); $('#tgo').textContent = 'Stop';
  });
  // quiz
  app.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', () => { quiz.level = b.dataset.l; quiz.answer = null; quiz.msg = ''; rerenderLearn(); }));
  $('#qplay').addEventListener('click', () => {
    if (!quiz.answer) { const qs = QUIZ_LEVELS[quiz.level]; quiz.answer = { root: Math.floor(Math.random() * 12), q: qs[Math.floor(Math.random() * qs.length)] }; quiz.msg = 'Listen… which type is it?'; }
    const name = M.noteName(quiz.answer.root, false) + quiz.answer.q;
    M.playChord(name, prefs.inst);
    if ($('#qmsg').textContent !== quiz.msg) { rerenderLearn(); }
    app.querySelectorAll('[data-a]').forEach(b => b.disabled = false);
  });
  app.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
    if (!quiz.answer) return;
    const name = M.noteName(quiz.answer.root, false) + quiz.answer.q;
    quiz.tries++;
    if (b.dataset.a === quiz.answer.q) { quiz.score++; quiz.msg = `<span class="ok">Correct: ${esc(name)} (${esc(M.QUAL_NAMES[quiz.answer.q])}).</span>`; }
    else quiz.msg = `<span class="bad">Not quite: it was ${esc(name)} (${esc(M.QUAL_NAMES[quiz.answer.q])}).</span>`;
    quiz.answer = null; rerenderLearn();
  }));
}

/* ---------------- EDITOR ---------------- */
let draft = null, editing = false;
function diatonic(key) {
  const k = M.parseChord(key || ''); if (!k) return [];
  const minor = /^m(?!aj)/.test(k.qual);
  const steps = minor ? [[0, 'm'], [2, 'dim'], [3, ''], [5, 'm'], [7, 'm'], [7, ''], [8, ''], [10, '']] : [[0, ''], [2, 'm'], [4, 'm'], [5, ''], [7, ''], [9, 'm'], [7, '7'], [10, '']];
  const t = M.transposeKey(key, 0);
  return [...new Set(steps.map(([i, q]) => M.noteName(k.root + i, t && t.flats) + q))];
}
function viewEditor(id) {
  editing = true;
  setNav(id ? 'library' : 'add');
  const base = id ? getSong(id) : null;
  if (id && !base) { location.hash = '#library'; return; }
  const s = { title: '', titleNe: '', artist: '', year: '', category: 'nepali-modern', key: '', bpm: '', time: '4/4', capo: 0, duration: '', strum: '', tags: [], note: '', chordpro: '', ...(base || {}), ...(draft || {}) };
  draft = null;
  app.innerHTML = `<div class="wrap"><div class="hero"><a class="back" href="${id ? '#song-' + esc(id) : '#library'}">← ${id ? 'Back to song' : 'All songs'}</a><h1>${id ? 'Edit song' : 'Add a song'}</h1>
    <p>Paste a chord sheet from anywhere. If the chords sit on the line above the words, press <b>Convert</b> and they move into place. ${esc(storeNote)}.</p></div>
  <form class="ed" id="ef" novalidate>
    <div>
      <div class="fgrid">
        <div class="field wide"><label for="f-title">Title *</label><input type="text" id="f-title" required value="${esc(s.title)}"></div>
        <div class="field wide"><label for="f-titleNe">Title in Nepali</label><input type="text" id="f-titleNe" value="${esc(s.titleNe)}" placeholder="रेशम फिरिरी"></div>
        <div class="field wide"><label for="f-artist">Artist</label><input type="text" id="f-artist" value="${esc(s.artist)}"></div>
        <div class="field"><label for="f-category">Category</label><select id="f-category">${CATS.map(c => `<option value="${c.id}" ${c.id === s.category ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}</select></div>
        <div class="field"><label for="f-year">Year</label><input type="number" id="f-year" inputmode="numeric" value="${esc(s.year || '')}"></div>
        <div class="field"><label for="f-key">Key</label><input type="text" id="f-key" value="${esc(s.key)}" placeholder="G or Am"></div>
        <div class="field"><label for="f-capo">Capo</label><input type="number" id="f-capo" min="0" max="12" value="${esc(s.capo || 0)}"></div>
        <div class="field"><label for="f-bpm">Tempo (bpm)</label><input type="number" id="f-bpm" value="${esc(s.bpm || '')}"></div>
        <div class="field"><label for="f-time">Time</label><input type="text" id="f-time" value="${esc(s.time)}"></div>
        <div class="field"><label for="f-dur">Length (m:ss)</label><input type="text" id="f-dur" value="${s.duration ? fmtTime(s.duration) : ''}" placeholder="3:30"></div>
        <div class="field wide"><label for="f-strum">Strum pattern</label><input type="text" id="f-strum" value="${esc(s.strum)}" placeholder="D - D U - U D U"></div>
        <div class="field wide"><label for="f-tags">Tags (comma separated)</label><input type="text" id="f-tags" value="${esc((s.tags || []).join(', '))}" placeholder="adhunik, acoustic, beginner"></div>
      </div>
      <div class="field" style="margin-top:14px"><label for="f-cp">Chord sheet</label>
        <div class="pal" id="pal"></div>
        <textarea id="f-cp" rows="18" spellcheck="false" placeholder="{c: Verse 1}&#10;[G]रेशम फिरिरी, रेशम फि[D]रिरी&#10;&#10;or paste chords above lyrics:&#10;G              D&#10;Resham firiri, resham firiri">${esc(s.chordpro)}</textarea></div>
      <div class="row" style="margin-top:8px"><button type="button" class="btn sm" id="conv">Convert chords-above-lyrics</button><button type="button" class="btn sm" data-ins="{c: Verse}">+ Verse</button><button type="button" class="btn sm" data-ins="{soc}&#10;&#10;{eoc}">+ Chorus</button><button type="button" class="btn sm" data-ins="{c: Intro}&#10;[G] [C] [D] [G]">+ Chord bar</button></div>
      <div class="field" style="margin-top:12px"><label for="f-note">Notes</label><textarea id="f-note" rows="2">${esc(s.note)}</textarea></div>
      <div class="row" style="margin-top:16px"><button class="btn pri" type="submit">Save song</button>${base && canDelete(base) ? `<button type="button" class="btn" id="del">${base.override ? 'Undo my changes' : 'Delete song'}</button>` : ''}<span id="links"></span></div>
    </div>
    <div><h2>Preview</h2><div class="preview"><div class="sheet" id="pv"></div></div>
      <details><summary>How to write chords</summary><p>Put the chord in square brackets right before the syllable where it changes: <code>[G]रेशम फिरिरी, रेशम फि[D]रिरी</code>. A line of only chords becomes a chord bar: <code>[G] [C] | [D] [G]</code>. Label sections with <code>{c: Verse 1}</code>; wrap a chorus in <code>{soc}</code> … <code>{eoc}</code>.</p></details>
    </div>
  </form></div>`;
  const ta = $('#f-cp'), pv = $('#pv');
  const pal = () => { const d = diatonic($('#f-key').value.trim()); $('#pal').innerHTML = d.length ? '<small>Tap to insert:</small>' + d.map(c => `<button type="button" data-c="${esc(c)}">${esc(c)}</button>`).join('') : '<small>Enter a key to get a chord palette.</small>'; };
  const prev = () => { pv.innerHTML = renderSheet(ta.value, { tp: 0, flats: false }) || '<p class="mute">Your chord sheet shows here.</p>'; };
  const links = () => { const t = $('#f-title').value.trim(); $('#links').innerHTML = t ? searchLinks({ title: t, artist: $('#f-artist').value.trim() }) : ''; };
  pal(); prev(); links();
  const insert = txt => { const a = ta.selectionStart, b = ta.selectionEnd; ta.setRangeText(txt, a, b, 'end'); ta.focus(); prev(); };
  $('#pal').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { insert('[' + b.dataset.c + ']'); M.playChord(b.dataset.c, prefs.inst); } });
  app.querySelectorAll('[data-ins]').forEach(b => b.addEventListener('click', () => insert('\n' + b.dataset.ins + '\n')));
  $('#f-key').addEventListener('input', pal);
  ['f-title', 'f-artist'].forEach(i => $('#' + i).addEventListener('input', links));
  let pt; ta.addEventListener('input', () => { clearTimeout(pt); pt = setTimeout(prev, 150); });
  $('#conv').addEventListener('click', () => { ta.value = convertChordsOverLyrics(ta.value); prev(); toast('Converted'); });
  const del = $('#del');
  if (del) del.addEventListener('click', () => dialog(`<h2>${base.override ? 'Undo your changes?' : 'Delete this song?'}</h2><p>${base.override ? 'The song goes back to the original version.' : esc(base.title) + ' will be removed from your songbook.'}</p><div class="row"><button class="btn pri" id="yes">${base.override ? 'Undo changes' : 'Delete'}</button><button class="btn" data-close>Cancel</button></div>`, box => {
    box.querySelector('#yes').addEventListener('click', async () => { await deleteSong(base.id); closeDialog(); editing = false; location.hash = base.override ? '#song-' + base.id : '#library'; });
  }));
  $('#ef').addEventListener('submit', async e => {
    e.preventDefault();
    const title = $('#f-title').value.trim(); if (!title) { $('#f-title').focus(); toast('Add a title'); return; }
    const dm = /^(\d+):(\d{1,2})$/.exec($('#f-dur').value.trim());
    let cp = ta.value;
    if (cp.split('\n').some(isChordLine) && !/\[[A-G]/.test(cp)) cp = convertChordsOverLyrics(cp);
    const saved = await saveSong({
      id: base ? base.id : uniqueId(slug(title)), title, titleNe: $('#f-titleNe').value, artist: $('#f-artist').value, year: $('#f-year').value,
      category: $('#f-category').value, key: $('#f-key').value, capo: $('#f-capo').value, bpm: $('#f-bpm').value, time: $('#f-time').value,
      duration: dm ? +dm[1] * 60 + +dm[2] : null, strum: $('#f-strum').value, tags: $('#f-tags').value, note: $('#f-note').value, chordpro: cp, status: cp.trim() ? '' : 'wishlist'
    });
    editing = false; toast('Saved'); location.hash = '#song-' + saved.id;
  });
}
function uniqueId(id) { const ids = new Set(allSongs().map(s => s.id)); let n = id, i = 2; while (ids.has(n)) n = id + '-' + i++; return n; }

/* ---------------- router ---------------- */
function route() {
  const h = location.hash.slice(1);
  flushSession(true);
  if (!h.startsWith('song-')) session = null;
  if (!h.startsWith('song-')) { stopScroll(); document.body.classList.remove('stage'); }
  if (metro && metro.running && !h.startsWith('song-')) metro.stop();
  if (trainer.run && h !== 'learn') { trainer.run.stop(); trainer.run = null; }
  if (!h.startsWith('edit-') && h !== 'add') editing = false;
  if (h.startsWith('song-')) viewSong(h.slice(5));
  else if (h === 'learn') viewLearn();
  else if (h === 'add') viewEditor(null);
  else if (h.startsWith('edit-')) viewEditor(h.slice(5));
  else viewLibrary();
}
const topEl = document.querySelector('.top');
if (topEl && window.ResizeObserver) new ResizeObserver(() => document.documentElement.style.setProperty('--toph', topEl.offsetHeight + 'px')).observe(topEl);
let lastHash = null;
addEventListener('hashchange', () => { if (location.hash !== lastHash) { lastHash = location.hash; route(); scrollTo(0, 0); } });
lastHash = location.hash; route();
}
