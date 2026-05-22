const cacheName = 'bard-pwa-v1';
const assets = [
    '/webport.github.io/pwa.html',
    '/webport.github.io/style.css',
    '/webport.github.io/app.js'
];

self.addEventListener('install', async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(assets);
});
self.addEventListener('fetch', event => {
    event.respondWith(cacheFirst(event.request));
});
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

