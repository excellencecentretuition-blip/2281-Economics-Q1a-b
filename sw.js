const CACHE_NAME = 'econ2281-pwa-v2-full';
const URLS = [
  './',
  './index.html',
  './partA_data.js',
  './partB_data.js',
  './partC_data.js',
  './partD_data.js',
  './sectionB_partA_data.js',
  './sectionB_partB_data.js',
  './icon.svg',
  './manifest.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.url.startsWith('http') && !e.request.url.startsWith(self.location.origin)) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (res) {
      return res || fetch(e.request).then(function (r) {
        if (!r || r.status !== 200 || r.type !== 'basic') return r;
        var clone = r.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(e.request, clone);
        });
        return r;
      });
    })
  );
});
