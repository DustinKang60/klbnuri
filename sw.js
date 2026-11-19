const CACHE_NAME = 'klbnuri-v2';
const ASSETS = [
  '/klbnuri/',
  '/klbnuri/index.html',
  '/klbnuri/manifest.json',
  '/klbnuri/icon-192.png',
  '/klbnuri/icon-512.png',
  // 화면을 그리는 라이브러리. 예전엔 unpkg 에서 받아 통신 없으면 앱이 안 떴다.
  '/klbnuri/vendor/react.production.min.js',
  '/klbnuri/vendor/react-dom.production.min.js',
  '/klbnuri/vendor/babel.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 주의: dustinkang60.github.io 의 앱들은 저장 공간(Cache Storage)을 함께 쓴다.
// 자기 이름으로 시작하는 캐시만 지워야 한다 — 전부 지우면 다른 앱의 오프라인 저장분이 날아가
// 그 앱이 해외·오프라인에서 아예 안 열린다.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('klbnuri-') && k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 캐시 우선. 통신이 안 될 때 화면 요청이면 저장해 둔 index.html 로 대신한다.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => {
      if (e.request.mode === 'navigate') return caches.match('/klbnuri/index.html');
      return Response.error();
    }))
  );
});
