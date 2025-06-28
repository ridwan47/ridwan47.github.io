const CACHE_NAME = 'bkash-calc-v1';
const urlsToCache = [
    '/', // Caches the root URL (your index.html)
    '/index.html', // Explicitly cache index.html
    '/manifest.json', // Your web app manifest
    // Add any other static assets if you had separate CSS/JS files
    // For now, Tailwind is from CDN, so no need to cache it explicitly here.
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete outdated caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
