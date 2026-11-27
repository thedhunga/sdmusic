/* Sur offline cache: serve the app shell from cache, refresh it in the background. */
const CACHE = 'sur-v4';
const SHELL = ['./', './index.html', './styles.css', './icon.svg', './manifest.webmanifest',
  './js/music.js', './js/songs.js', './js/lessons.js', './js/app.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png',
  './fonts/mukta.css', './fonts/mukta-400-devanagari.woff2', './fonts/mukta-400-latin-ext.woff2', './fonts/mukta-400-latin.woff2', './fonts/mukta-600-devanagari.woff2', './fonts/mukta-600-latin-ext.woff2', './fonts/mukta-600-latin.woff2', './fonts/mukta-700-devanagari.woff2', './fonts/mukta-700-latin-ext.woff2', './fonts/mukta-700-latin.woff2', './fonts/mukta-800-devanagari.woff2', './fonts/mukta-800-latin-ext.woff2', './fonts/mukta-800-latin.woff2'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
