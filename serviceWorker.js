const cacheName = 'bard-pwa-v1';
const assets = [
    '/pwa.html',
    '/style.css',
    '/app.js',
];

self.addEventListener('install', async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(assets);
});
self.addEventListener('fetch', event => {
const url = new URL(event.request.url);
if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.ogg')) {
        event.respondWith(cacheFirst(event.request));
        return;
    }
});
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

