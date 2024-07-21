// sw.js

// vChanged
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open('app-shell-v1').then((cache) => {
                return cache.addAll([
                    '/index.html',
                    '/main.js',
                    '/styles.css',
                ]);
            }),
            caches.open('data-v1').then((cache) => {
                return cache.addAll([
                    '/api/companies',
                    // other data URLs...
                ]);
            }),
        ])
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // If a cached response is available, return it
                return cachedResponse;
            }

            // If no cached response is available, fetch from the network
            return fetch(event.request).then((networkResponse) => {
                // Determine the correct cache based on the request URL
                let cacheName = event.request.url.includes('/api/') ? 'data-v1' : 'app-shell-v1';

                // Cache the network response for future use
                return caches.open(cacheName).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});