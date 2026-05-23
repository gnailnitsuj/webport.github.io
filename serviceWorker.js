const cacheName = 'bard-pwa-v1';
const AUDIO_CACHE = 'dynamic-audio-v1';
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
    const cache = await caches.open(AUDIO_CACHE);
    const cached = await cache.match(request, { ignoreSearch: true });
    //const cachedResponse = await caches.match(request);
    return cached || fetch(request);
}

