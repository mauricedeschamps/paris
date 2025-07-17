const CACHE_NAME = 'paris-guide-v5';
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

// フェッチイベント: キャッシュファースト戦略
self.addEventListener('fetch', event => {
  // インストールプロンプトを表示するために重要なリクエスト
  if (event.request.url.includes('install-promotion')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあれば返す
        if (response) {
          return response;
        }
        
        // キャッシュになければネットワークから取得
        return fetch(event.request)
          .then(response => {
            // キャッシュ可能なレスポンスをキャッシュに追加
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