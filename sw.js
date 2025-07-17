// sw.js
const CACHE_NAME = 'paris-guide-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/images/eiffel.jpg',
  '/images/louvre.jpg',
  '/images/notredame.jpg',
  '/images/montmartre.jpg',
  '/images/orsay.jpg',
  '/images/champs.jpg',
  '/images/versailles.jpg',
  '/images/sainte_chapelle.jpg',
  '/images/luxembourg.jpg',
  '/images/moulinrouge.jpg',
  '/images/perelachaise.jpg',
  '/images/seine.jpg'
];

// インストールイベント
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチイベント
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// アクティベートイベント
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});