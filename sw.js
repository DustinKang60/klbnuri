// KLBnuri Service Worker
// 버전을 바꾸면 캐시가 자동으로 갱신됩니다
const CACHE_VERSION = 'klbnuri-202603021106';
const CACHE_NAME = CACHE_VERSION;

// 설치: 새 캐시 생성
self.addEventListener('install', function(e) {
  console.log('[SW] 설치:', CACHE_NAME);
  // 즉시 활성화 (기다리지 않음)
  self.skipWaiting();
});

// 활성화: 이전 캐시 전부 삭제
self.addEventListener('activate', function(e) {
  console.log('[SW] 활성화, 이전 캐시 삭제');
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) {
              console.log('[SW] 삭제:', k);
              return caches.delete(k);
            })
      );
    }).then(function() {
      // 현재 열린 페이지도 즉시 제어
      return self.clients.claim();
    })
  );
});

// fetch: 항상 네트워크 우선, 실패시 캐시
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
