// Monetag Service Worker Integration
self.options = {
    "domain": "5gvci.com",
    "zoneId": 11707483
};
self.lary = "";
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');

// FileZenith Offline PWA Cache Engine
const CACHE_NAME = 'filezenith-v1';
const PRECACHE_ASSETS = [
  '/',
  '/studio',
  '/manifest.json',
  '/1.png',
  '/logo.png',
  '/pdf/compress',
  '/pdf/edit',
  '/image/pics-to-pdf',
  '/image/passport-maker',
  '/image/remove-background',
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-while-revalidate for static assets, network-first for pages
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET requests, API, admin, and Next.js static/HMR assets
  const url = new URL(request.url);
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.includes('webpack') ||
    url.pathname.includes('turbopack') ||
    url.pathname.includes('hot-reloader')
  ) {
    return;
  }

  // Network-first strategy for HTML pages, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match('/')))
    );
    return;
  }

  // Stale-while-revalidate for static assets (images, fonts, scripts, WASM)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
