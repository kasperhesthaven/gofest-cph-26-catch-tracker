const CACHE_NAME = 'gofest-cph-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
];

// Install Event: Cache standard assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Fetch Event: Network-first, fallback to Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if found
        if (response) return response;
        
        // Otherwise try to fetch from network
        return fetch(event.request).then(networkResponse => {
          // Dynamically cache new resources (like CDN updates)
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }).catch(() => {
        // Fail gracefully when entirely offline
        console.log('Offline and resource not in cache:', event.request.url);
      })
  );
});
