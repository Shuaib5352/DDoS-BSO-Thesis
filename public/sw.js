/**
 * Service Worker - DDoS Tespiti Uygulaması
 * Çevrimdışı desteği ve veri önbelleklemesi
 */

const CACHE_NAME = 'ddos-bso-v2.0.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Kurulum - Uygulamayı kuruntuya hazırla
self.addEventListener('install', (event) => {
    console.log('Service Worker kuruluyor...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Temel varlıklar önbelleğe alınıyor');
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn('Bazı varlıklar önbelleğe alınamadı:', err);
            });
        })
    );

    self.skipWaiting();
});

// Etkinleştirme - Eski önbellekleri temizle
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

// İstekleri işle - Çevrimdışı modda çalış
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Sadece HTTP(S) istekleri
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // GET istekleri için - Önce önbellekten, sonra ağdan
    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    return response;
                }

                return fetch(request)
                    .then((response) => {
                        // Sadece başarılı yanıtları önbelleğe al
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Yanıtın kopyasını önbelleğe al
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });

                        return response;
                    })
                    .catch(() => {
                        // Ağ başarısız - önceki sürümü sunma
                        return caches.match(request).then((response) => {
                            if (response) {
                                return response;
                            }

                            // Çevrimdışı sayfası
                            if (request.destination === 'document') {
                                return caches.match('/');
                            }

                            return new Response(
                                'Çevrimdışı moddasınız. Lütfen internet bağlantısını kontrol edin.',
                                {
                                    status: 503,
                                    statusText: 'Hizmet Kullanılamaz',
                                    headers: new Headers({
                                        'Content-Type': 'text/plain; charset=utf-8'
                                    })
                                }
                            );
                        });
                    });
            })
        );
    }
});

// Arka planda senkronizasyon (gelecekteki genişleme için)
self.addEventListener('sync', (event) => {
    if (event.tag === 'veri-senkronizasyonu') {
        event.waitUntil(
            fetch('/api/senkronize')
                .then((response) => response.json())
                .catch(() => {
                    console.log('Senkronizasyon başarısız - daha sonra denenir');
                })
        );
    }
});

// Bildirim işleme
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'DDoS Tespiti Uygulaması',
        icon: '/icon-192.png',
        badge: '/icon-96.png',
        tag: 'ddos-notification'
    };

    event.waitUntil(self.registration.showNotification(data.title || 'Bildirim', options));
});

console.log('Service Worker yüklendi - Versiyon:', CACHE_NAME);
