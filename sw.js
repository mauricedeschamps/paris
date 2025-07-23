const CACHE_NAME = 'paris-guide-v4';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'images/eiffel.jpg',
  'images/louvre.jpg',
  'images/notredame.jpg',
  'images/montmartre.jpg',
  'images/orsay.jpg',
  'images/champs.jpg',
  'images/versailles.jpg',
  'images/sainte_chapelle.jpg',
  'images/luxembourg.jpg',
  'images/moulinrouge.jpg',
  'images/perelachaise.jpg',
  'images/seine.jpg',
  'icons/icon-192x192.png'
];

// インストールイベント
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベートイベント
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// service-worker.js
self.addEventListener('install', () => {
  self.skipWaiting(); // 即時更新を強制
});

// フェッチイベント
self.addEventListener('fetch', event => {
  // 外部リクエストは直接フェッチ
  if (event.request.url.indexOf('http') !== 0) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがある場合は返す
        if (response) {
          return response;
        }
        
        // ネットワークから取得
        return fetch(event.request)
          .then(response => {
            // 有効なレスポンスをキャッシュ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});
