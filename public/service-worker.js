const CACHE_NAME = 'mistress-alexa-cache-v1';
const urlsToCache = [
  '/',
  '/chat.html',
  '/style.css',
  '/icon.png'
];

// Install and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
