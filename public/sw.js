/**
 * Service Worker - DDoS Tespiti Uygulaması
 * Network-first strateji: her zaman en güncel sürümü sunar,
 * yalnızca çevrimdışıyken önbellekten yanıt verir.
 */

const CACHE_NAME = 'ddos-bso-v4.0.0';

// Kurulum — eski SW'yi hemen devre dışı bırak, eski cacheler silinsin
self.addEventListener('install', (event) => {
    console.log('Service Worker v4 kuruluyor — eski cache temizleniyor...');
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.map((n) => caches.delete(n)))
        ).then(() => self.skipWaiting())
    );
});

// Etkinleştirme — tüm eski önbellekleri temizle
self.addEventListener('activate', (event) => {
    console.log('Service Worker etkinleştiriliyor...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eski önbellek siliniyor:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// İstekleri işle — Network-first: önce ağ, yalnızca çevrimdışıyken önbellek
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (!url.protocol.startsWith('http') || request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Başarılı ağ yanıtını önbelleğe kaydet (çevrimdışı yedek olarak)
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Ağ başarısız — önbellekten sun
                return caches.match(request).then((cached) => {
                    if (cached) return cached;

                    if (request.destination === 'document') {
                        return caches.match('/');
                    }

                    return new Response('Çevrimdışı moddasınız.', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                    });
                });
            })
    );
});

console.log('Service Worker yüklendi (network-first) — Versiyon:', CACHE_NAME);
