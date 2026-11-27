/* Sur — music theory, chord shapes, audio. No dependencies. */
(function () {
  const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const PC = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11,Cb:11,'E#':5,Fb:4,'B#':0};
  const mod = (n, m) => ((n % m) + m) % m;

  // chord formulas (semitones from root)
  const QUAL = {
    '':[0,4,7], 'maj':[0,4,7], 'M':[0,4,7], 'm':[0,3,7], 'min':[0,3,7], '-':[0,3,7], '5':[0,7],
    '7':[0,4,7,10], 'maj7':[0,4,7,11], 'M7':[0,4,7,11], 'm7':[0,3,7,10], 'min7':[0,3,7,10], 'mmaj7':[0,3,7,11],
    '6':[0,4,7,9], 'm6':[0,3,7,9], '9':[0,4,7,10,14], 'm9':[0,3,7,10,14], 'maj9':[0,4,7,11,14],
    'add9':[0,4,7,14], 'add2':[0,2,4,7], 'madd9':[0,3,7,14], 'sus2':[0,2,7], 'sus4':[0,5,7], 'sus':[0,5,7],
    '7sus4':[0,5,7,10], '7sus2':[0,2,7,10], 'dim':[0,3,6], 'dim7':[0,3,6,9], 'm7b5':[0,3,6,10],
    'aug':[0,4,8], '+':[0,4,8], '11':[0,4,7,10,14,17], '13':[0,4,7,10,14,21], '7#9':[0,4,7,10,15]
  };
  const QUAL_NAMES = {'':'major','m':'minor','5':'power','7':'dominant 7th','maj7':'major 7th','m7':'minor 7th','sus2':'suspended 2nd','sus4':'suspended 4th','7sus4':'7 sus4','add9':'add 9','6':'major 6th','m6':'minor 6th','9':'dominant 9th','dim':'diminished','dim7':'diminished 7th','m7b5':'half-diminished','aug':'augmented'};
  const INTERVAL_NAMES = {0:'R',2:'2',3:'♭3',4:'3',5:'4',6:'♭5',7:'5',8:'♯5',9:'6',10:'♭7',11:'7',14:'9',15:'♯9',17:'11',21:'13'};

  function parseChord(s) {
    if (!s) return null;
    const m = /^([A-G])([#b]?)([^/\s]*)(?:\/([A-G][#b]?))?$/.exec(s.trim());
    if (!m) return null;
    const rootName = m[1] + m[2];
    if (!(rootName in PC)) return null;
    let qual = m[3];
    if (!(qual in QUAL) && !/^(maj|min|m|M|dim|aug|sus|add|\+|°|ø)?\d{0,2}((sus|add|maj|no|b|#|\+|-)\d{0,2})*(\([^)]*\))?$/.test(qual)) return null;
    return { root: PC[rootName], rootName, qual, bass: m[4] ? PC[m[4]] : null, bassName: m[4] || null };
  }
  function intervals(q) {
    if (q in QUAL) return QUAL[q];
    if (/^m(?!aj)/.test(q)) return QUAL.m;
    return QUAL[''];
  }
  function chordNotes(name) {
    const c = parseChord(name); if (!c) return null;
    return intervals(c.qual).map(i => mod(c.root + i, 12));
  }
  const FLAT_KEYS = new Set(['F','Bb','Eb','Ab','Db','Gb','Dm','Gm','Cm','Fm','Bbm','Ebm']);
  function noteName(pc, flats) { return (flats ? FLAT : SHARP)[mod(pc, 12)]; }
  function transposeChord(name, n, flats) {
    const c = parseChord(name); if (!c || !n) return name;
    let out = noteName(c.root + n, flats) + c.qual;
    if (c.bass != null) out += '/' + noteName(c.bass + n, flats);
    return out;
  }
  function transposeKey(key, n) {
    if (!key) return key;
    const c = parseChord(key); if (!c) return key;
    const target = mod(c.root + n, 12), minor = /^m(?!aj)/.test(c.qual);
    const flatName = FLAT[target] + (minor ? 'm' : '');
    const flats = FLAT_KEYS.has(flatName);
    return { name: noteName(target, flats) + (minor ? 'm' : ''), flats };
  }
  const ROMAN = ['I','♭II','II','♭III','III','IV','♯IV','V','♭VI','VI','♭VII','VII'];
  function roman(chordName, key) {
    const c = parseChord(chordName), k = parseChord(key || '');
    if (!c || !k) return chordName;
    let r = ROMAN[mod(c.root - k.root, 12)];
    const q = c.qual;
    const minorish = /^m(?!aj)/.test(q) || /dim|m7b5/.test(q);
    if (minorish) r = r.toLowerCase();
    let suffix = q.replace(/^m(?!aj)/, '').replace(/^min/, '');
    if (/^dim/.test(q)) suffix = '°' + q.replace('dim', '');
    if (q === 'm7b5') suffix = 'ø7';
    let out = r + suffix;
    if (c.bass != null) out += '/' + ROMAN[mod(c.bass - k.root, 12)];
    return out;
  }

  // ---------- guitar shapes: strings low E → high e, -1 = muted ----------
  const OPEN = {
    'C':[-1,3,2,0,1,0],'C7':[-1,3,2,3,1,0],'Cmaj7':[-1,3,2,0,0,0],'Cadd9':[-1,3,2,0,3,0],'C/G':[3,3,2,0,1,0],'C/B':[-1,2,2,0,1,0],'Csus2':[-1,3,0,0,1,3],'Csus4':[-1,3,3,0,1,1],
    'D':[-1,-1,0,2,3,2],'Dm':[-1,-1,0,2,3,1],'D7':[-1,-1,0,2,1,2],'Dmaj7':[-1,-1,0,2,2,2],'Dm7':[-1,-1,0,2,1,1],'Dsus2':[-1,-1,0,2,3,0],'Dsus4':[-1,-1,0,2,3,3],'D/F#':[2,0,0,2,3,2],'D/A':[-1,0,0,2,3,2],'D5':[-1,-1,0,2,3,-1],
    'E':[0,2,2,1,0,0],'Em':[0,2,2,0,0,0],'E7':[0,2,0,1,0,0],'Em7':[0,2,2,0,3,0],'Emaj7':[0,2,1,1,0,0],'Esus4':[0,2,2,2,0,0],'E5':[0,2,2,-1,-1,-1],'Em/D':[-1,-1,0,0,0,0],
    'F':[1,3,3,2,1,1],'Fmaj7':[-1,-1,3,2,1,0],'F/C':[-1,3,3,2,1,1],
    'G':[3,2,0,0,0,3],'G7':[3,2,0,0,0,1],'Gmaj7':[3,2,0,0,0,2],'G/B':[-1,2,0,0,0,3],'G6':[3,2,0,0,0,0],'Gsus4':[3,-1,0,0,1,3],'G5':[3,5,5,-1,-1,-1],
    'A':[-1,0,2,2,2,0],'Am':[-1,0,2,2,1,0],'A7':[-1,0,2,0,2,0],'Am7':[-1,0,2,0,1,0],'Amaj7':[-1,0,2,1,2,0],'Asus2':[-1,0,2,2,0,0],'Asus4':[-1,0,2,2,3,0],'A7sus4':[-1,0,2,0,3,0],'A5':[-1,0,2,2,-1,-1],'Am/G':[3,0,2,2,1,0],
    'B7':[-1,2,1,2,0,2]
  };
  const E_SHAPE = {'':[0,2,2,1,0,0],'m':[0,2,2,0,0,0],'7':[0,2,0,1,0,0],'m7':[0,2,0,0,0,0],'sus4':[0,2,2,2,0,0],'7sus4':[0,2,0,2,0,0],'5':[0,2,2,-1,-1,-1],'maj7':[0,-1,1,1,0,-1],'6':[0,-1,-1,1,2,0]};
  const A_SHAPE = {'':[-1,0,2,2,2,0],'m':[-1,0,2,2,1,0],'7':[-1,0,2,0,2,0],'m7':[-1,0,2,0,1,0],'maj7':[-1,0,2,1,2,0],'sus2':[-1,0,2,2,0,0],'sus4':[-1,0,2,2,3,0],'7sus4':[-1,0,2,0,3,0],'dim':[-1,0,1,2,1,-1],'m7b5':[-1,0,1,0,1,-1],'5':[-1,0,2,2,-1,-1],'6':[-1,0,2,2,2,2],'dim7':[-1,0,1,2,1,2],'aug':[-1,0,3,2,2,1],'m6':[-1,0,2,-1,1,2]};
  const SIMPLIFY = {'maj':'','M':'','min':'m','-':'m','M7':'maj7','min7':'m7','add9':'','add2':'','madd9':'m','9':'7','m9':'m7','maj9':'maj7','sus':'sus4','7sus2':'7','11':'7','13':'7','7#9':'7','+':'aug','mmaj7':'m'};
  const OPEN_STR = [40,45,50,55,59,64]; // E2 A2 D3 G3 B3 E4

  function guitarShape(name) {
    const c = parseChord(name); if (!c) return null;
    const key = noteName(c.root, false) + c.qual + (c.bassName ? '/' + noteName(c.bass, false) : '');
    const keyF = noteName(c.root, true) + c.qual + (c.bassName ? '/' + noteName(c.bass, true) : '');
    if (OPEN[key]) return { frets: OPEN[key], exact: true };
    if (OPEN[keyF]) return { frets: OPEN[keyF], exact: true };
    let q = c.qual, exact = !c.bassName;
    const base = noteName(c.root, false) + q;
    if (c.bassName && OPEN[base]) return { frets: OPEN[base], exact: false };
    if (!(q in E_SHAPE) && !(q in A_SHAPE)) {
      if (q in SIMPLIFY) q = SIMPLIFY[q]; else q = /^m(?!aj)/.test(q) ? 'm' : '';
      exact = false;
      const simp = noteName(c.root, false) + q;
      if (OPEN[simp]) return { frets: OPEN[simp], exact };
    }
    const cands = [];
    if (E_SHAPE[q]) cands.push({ rel: E_SHAPE[q], fret: mod(c.root - 4, 12) });
    if (A_SHAPE[q]) cands.push({ rel: A_SHAPE[q], fret: mod(c.root - 9, 12) });
    if (!cands.length) return null;
    cands.sort((a, b) => a.fret - b.fret);
    const best = cands[0];
    return { frets: best.rel.map(r => r < 0 ? -1 : r + best.fret), exact, barre: best.fret > 0 ? best.fret : 0 };
  }
  function guitarMidi(frets) { return frets.map((f, i) => f < 0 ? null : OPEN_STR[i] + f).filter(n => n != null); }

  function pianoVoicing(name) {
    const c = parseChord(name); if (!c) return null;
    const iv = intervals(c.qual);
    const right = iv.map(i => { let n = 60 + c.root + i; while (n > 83) n -= 12; return n; });
    const left = [48 + (c.bass != null ? c.bass : c.root)];
    return { left, right: [...new Set(right)].sort((a, b) => a - b) };
  }

  // ---------- SVG renderers ----------
  function guitarSVG(name, opts = {}) {
    const sh = guitarShape(name);
    const W = opts.w || 92, H = opts.h || 112;
    if (!sh) return `<svg viewBox="0 0 ${W} ${H}" class="diag" role="img" aria-label="No diagram for ${name}"><text x="${W/2}" y="${H/2}" text-anchor="middle" class="d-txt">?</text></svg>`;
    const f = sh.frets, pos = f.filter(x => x > 0), max = Math.max(0, ...pos), min = pos.length ? Math.min(...pos) : 0;
    const start = max <= 4 ? 1 : min;
    const left = 16, top = 22, gw = W - 26, gh = H - 34, sx = gw / 5, fy = gh / 4;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="diag" role="img" aria-label="Guitar ${name}: ${f.map(x => x < 0 ? 'x' : x).join(' ')}">`;
    if (start === 1) s += `<rect x="${left}" y="${top - 3}" width="${gw}" height="3" class="d-nut"/>`;
    else s += `<text x="${left - 4}" y="${top + fy * 0.68}" text-anchor="end" class="d-fr">${start}</text>`;
    for (let i = 0; i <= 4; i++) s += `<line x1="${left}" x2="${left + gw}" y1="${top + i * fy}" y2="${top + i * fy}" class="d-line"/>`;
    for (let i = 0; i < 6; i++) s += `<line y1="${top}" y2="${top + gh}" x1="${left + i * sx}" x2="${left + i * sx}" class="d-line"/>`;
    // barre: lowest fret spans strings
    const bf = min, bIdx = f.map((x, i) => x === bf ? i : -1).filter(i => i >= 0);
    if (bf > 0 && bIdx.length >= 3 && bIdx[0] <= 1) {
      const a = bIdx[0], b = bIdx[bIdx.length - 1], y = top + (bf - start + 0.5) * fy;
      s += `<rect x="${left + a * sx - 5}" y="${y - 5}" width="${(b - a) * sx + 10}" height="10" rx="5" class="d-dot"/>`;
    }
    f.forEach((x, i) => {
      const cx = left + i * sx;
      if (x < 0) s += `<text x="${cx}" y="${top - 8}" text-anchor="middle" class="d-mx">×</text>`;
      else if (x === 0) s += `<circle cx="${cx}" cy="${top - 11}" r="3.2" class="d-open"/>`;
      else s += `<circle cx="${cx}" cy="${top + (x - start + 0.5) * fy}" r="5.2" class="d-dot"/>`;
    });
    return s + '</svg>';
  }
  const BLACK = new Set([1,3,6,8,10]);
  function pianoSVG(name, opts = {}) {
    const v = pianoVoicing(name);
    const lo = 48, hi = 83, whites = [];
    for (let n = lo; n <= hi; n++) if (!BLACK.has(n % 12)) whites.push(n);
    const ww = opts.ww || 11, W = whites.length * ww, H = opts.h || 54, bh = H * 0.6, bw = ww * 0.62;
    const L = new Set(v ? v.left : []), R = new Set(v ? v.right : []);
    let s = `<svg viewBox="0 0 ${W + 1} ${H + 1}" class="kbd" role="img" aria-label="Piano ${name}">`;
    whites.forEach((n, i) => {
      const cls = L.has(n) ? 'k-w k-l' : R.has(n) ? 'k-w k-r' : 'k-w';
      s += `<rect x="${i * ww + .5}" y=".5" width="${ww}" height="${H}" rx="1.5" class="${cls}"/>`;
    });
    let wi = 0;
    for (let n = lo; n <= hi; n++) {
      if (BLACK.has(n % 12)) {
        const cls = L.has(n) ? 'k-b k-l' : R.has(n) ? 'k-b k-r' : 'k-b';
        s += `<rect x="${wi * ww - bw / 2 + .5}" y=".5" width="${bw}" height="${bh}" rx="1.2" class="${cls}"/>`;
      } else wi++;
    }
    return s + '</svg>';
  }

  // ---------- audio ----------
  let ctx = null, master = null;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.7; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function pianoNote(m, t, dur = 1.8, vel = 0.22) {
    const a = audio(); if (!a) return;
    const g = a.createGain(), lp = a.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2600;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(([mult, type, amp]) => {
      const o = a.createOscillator(), og = a.createGain();
      o.type = type; o.frequency.value = hz(m) * mult; og.gain.value = amp;
      o.connect(og).connect(g); o.start(t); o.stop(t + dur + 0.05);
    });
    g.connect(lp).connect(master);
  }
  const ksCache = new Map();
  function pluckBuffer(m) {
    if (ksCache.has(m)) return ksCache.get(m);
    const a = audio(), sr = a.sampleRate, len = Math.floor(sr * 2.4), buf = a.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / hz(m)));
    for (let i = 0; i < N; i++) d[i] = Math.random() * 2 - 1;
    for (let i = N; i < len; i++) d[i] = 0.497 * (d[i - N] + d[i - N + 1]);
    // lowpass the initial burst a bit
    for (let i = 1; i < N; i++) d[i] = 0.5 * (d[i] + d[i - 1]);
    ksCache.set(m, buf); return buf;
  }
  function guitarNote(m, t, vel = 0.5) {
    const a = audio(); if (!a) return;
    const src = a.createBufferSource(), g = a.createGain();
    src.buffer = pluckBuffer(m); g.gain.value = vel;
    src.connect(g).connect(master); src.start(t);
  }
  function playChord(name, instrument = 'guitar', when) {
    const a = audio(); if (!a) return;
    const t = when || a.currentTime + 0.02;
    if (instrument === 'piano') {
      const v = pianoVoicing(name); if (!v) return;
      v.left.forEach(n => pianoNote(n, t, 2.2, 0.2)); v.right.forEach(n => pianoNote(n, t + 0.01, 1.8, 0.16));
    } else {
      const sh = guitarShape(name); if (!sh) return;
      guitarMidi(sh.frets).forEach((n, i) => guitarNote(n, t + i * 0.028, 0.42));
    }
  }
  function playNotes(midis, instrument = 'piano', gap = 0.32) {
    const a = audio(); if (!a) return;
    const t0 = a.currentTime + 0.03;
    midis.forEach((m, i) => instrument === 'piano' ? pianoNote(m, t0 + i * gap, 1.2, 0.2) : guitarNote(m, t0 + i * gap, 0.5));
  }
  function click(t, accent) {
    const a = audio(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.frequency.value = accent ? 1600 : 1050;
    g.gain.setValueAtTime(accent ? 0.5 : 0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.06);
  }
  // look-ahead metronome
  function Metronome() {
    let timer = null, next = 0, beat = 0;
    const api = { bpm: 80, beats: 4, onBeat: null, running: false, sound: true };
    api.start = () => {
      const a = audio(); if (!a) return;
      api.running = true; beat = 0; next = a.currentTime + 0.08;
      timer = setInterval(() => {
        while (next < a.currentTime + 0.12) {
          const b = beat, t = next;
          if (api.sound) click(t, b % api.beats === 0);
          const delay = Math.max(0, (t - a.currentTime) * 1000);
          setTimeout(() => api.running && api.onBeat && api.onBeat(b, t), delay);
          beat++; next += 60 / api.bpm;
        }
      }, 25);
    };
    api.stop = () => { api.running = false; clearInterval(timer); timer = null; };
    return api;
  }

  window.Music = { SHARP, FLAT, QUAL, QUAL_NAMES, INTERVAL_NAMES, parseChord, intervals, chordNotes, noteName, transposeChord, transposeKey, roman,
    guitarShape, guitarSVG, pianoSVG, pianoVoicing, playChord, playNotes, audio, Metronome, mod };
})();
