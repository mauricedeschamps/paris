const CACHE_NAME = 'paris-guide-v4';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'imedia_Commons_%28cropped%29.jpg',
  'images/https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/250px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9Q4EzkuhPEb-e1Lr83hoXNaOkDnvG-5OZf8gwTRAhyTPgiSv-c1RvBK4&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl24y2x9bKnN9OgNpf9gczpVwD8bS3It0TwA&s',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQB9eJ0EnhMbZCCMBglAD0ecB88SF696TPX36XwsgyoQQishDeL0GzumO4&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJ3lATxURK0ezyyp2Og-L7cg0XMwcg4L-lo0fEUWNbXk6Dw4wYhdUz2Eb&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSezjIIpCjGA0-l5O3XYyxxnWSL-0EJ7JLUFJ-3tta7p01rQlN5RlFzOao&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNqsPjM_CPBsKDioJrAADJi-sWkeCwmlmgLVyjoXxcaMcoh0nOAV5zzlo7&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm0KL3R4q8qZYb3MeCKFSUjxqhrH2618jwOnbJVy2BnJpdiJKqw2uW0tSp&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeq3e_QgPdeFZd3w-KqdEo0YJ8wpVERnDSUkYSe04xuM1tFNQWZeYvoow&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5jgeoKzUiNfrooK1MO4uC_Gd8aL1zGhzWv2SSsuCpIpdUCZZQUxt1QoU&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR39d_wrAtU5p2NahrOcTEZLezBj7s3EukepR19eu6cFQWbZwpP61I_sXU&s=10',
  'images/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREOB0kVDBUmPIPTqlTvfDaBMJWLe7SjC32iOUX1MjefNcBNE0ii3XinY59&s=10',
  'icons/icon-192x192.png'
  'icons/icon-512×512.png'
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
