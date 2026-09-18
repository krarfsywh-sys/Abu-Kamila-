// Service Worker - KARRAR PWA
const CACHE_NAME = 'abu-kamila-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// تثبيت
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تفعيل
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// اعتراض الطلبات - يشتغل بدون إنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // نخزن فقط الملفات المحلية
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      }).catch(() => {
        // إذا ما فيه إنترنت، نرجع الصفحة الرئيسية
        return caches.match('./index.html');
      });
    })
  );
});
