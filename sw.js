const CACHE_NAME = 'paris-guide-v3';
const OFFLINE_URL = 'offline.html';
const urlsToCache = [
  '/',
  'index.html',
  'offline.html',
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
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベートイベント
self.addEventListener('activate', event => {
  // 古いキャッシュを削除
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // すべてのクライアントを制御
  self.clients.claim();
});

// フェッチイベント: ネットワーク優先、フォールバックでキャッシュ
self.addEventListener('fetch', event => {
  // 外部リソースはキャッシュしない
  if (event.request.url.startsWith('http') && 
      !event.request.url.includes('localhost') &&
      !event.request.url.includes('127.0.0.1')) {
    return fetch(event.request);
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // レスポンスが有効ならキャッシュ
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // ネットワークエラー時はキャッシュから取得
        return caches.match(event.request)
          .then(response => {
            // キャッシュにない場合はオフラインページを表示
            if (!response && event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return response;
          });
      })
  );
});

// プッシュ通知イベント（将来の拡張用）
self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'Paris Travel Guide';
  const options = {
    body: data.body || 'New update available!',
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-96x96.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});