const CACHE_NAME = 'eb-cache-v28';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './rezeptbilder/pfanne.jpg',
  './rezeptbilder/pasta.jpg',
  './rezeptbilder/bowl.jpg',
  './rezeptbilder/salat.jpg',
  './rezeptbilder/ofen.jpg',
  './rezeptbilder/eintopf.jpg',
  './rezeptbilder/wrap.jpg',
  './rezeptbilder/kohl.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Kein skipWaiting hier: Update wartet, bis der User im Banner klickt
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// Listen for skip-waiting message from the app
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
