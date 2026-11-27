/* Browser smoke test: opens every view and checks for errors.
   Needs Playwright (`npm i -g playwright` or run where it is installed): `node tests/smoke.js` */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html'));
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/index.html`;
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = [], external = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('request', r => { if (!r.url().startsWith('http://localhost')) external.push(r.url()); });
  let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.error('FAIL', m); } else console.log('ok  ', m); };
  const text = () => p.evaluate(() => document.querySelector('#app').innerText);

  await p.goto(base + '#library'); await p.waitForTimeout(500);
  ok(/Your songbook/.test(await text()), 'library renders');
  await p.goto(base + '#song-resham-firiri'); await p.waitForTimeout(300);
  ok(/रेशम फिरिरी/.test(await text()), 'Nepali song renders');
  ok(await p.evaluate(() => document.fonts.check('16px Mukta', 'रेशम')), 'Mukta font loads locally');

  // capo: guitar shows shapes, "Real chords" adds the capo back
  await p.goto(base + '#song-wonderwall'); await p.waitForTimeout(300);
  await p.click('[data-i="guitar"]'); await p.waitForTimeout(100);
  const first = () => p.evaluate(() => document.querySelector('#sheet .c[data-c]').textContent);
  ok(await first() === 'Em7', 'Wonderwall shows capo 2 shape Em7');
  await p.click('[data-cv="real"]'); await p.waitForTimeout(100);
  ok(await first() === 'F#m7', 'Real chords shows F#m7');
  await p.click('[data-cv="shapes"]'); await p.waitForTimeout(100);

  // favourites by name
  await p.goto(base + '#song-resham-firiri'); await p.waitForTimeout(200);
  await p.click('#fav'); await p.fill('#fname', 'Simon'); await p.click('#fok'); await p.waitForTimeout(200);
  ok(await p.getAttribute('#fav', 'aria-pressed') === 'true', 'favourite saved under a name');
  ok(/Favourite of Simon/.test(await p.textContent('#favby')), 'song shows whose favourite it is');
  await p.goto(base + '#library'); await p.waitForTimeout(300);
  await p.click('.chips.favs button'); await p.waitForTimeout(200);
  ok(/Simon’s favourites[\s\S]*Resham Firiri/.test(await text()), 'library filters by a person’s favourites');

  for (const h of ['#song-bardali', '#learn', '#add', '#song-kehi-mitho-baat-gara']) { await p.goto(base + h); await p.waitForTimeout(300); ok((await text()).length > 50, h + ' renders'); }
  ok(errs.length === 0, 'no console errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
  ok(external.length === 0, 'no third-party requests' + (external.length ? ': ' + external.join(' ') : ''));
  await b.close(); server.close();
  console.log(fails ? `${fails} smoke check(s) failed` : 'Smoke test passed');
  process.exit(fails ? 1 : 0);
})();
