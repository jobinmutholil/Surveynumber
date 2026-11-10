const CACHE_NAME = 'survey-app-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ആപ്പ് ആദ്യമായി ഓപ്പൺ ചെയ്യുമ്പോൾ ആവശ്യമായ ഫയലുകൾ കാഷെ ചെയ്യുന്നു
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// പഴയ കാഷെകൾ ഉണ്ടെങ്കിൽ അവ കളയുന്നു
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

// നെറ്റ്വർക്ക് ലഭ്യമല്ലെങ്കിൽ കാഷെ ചെയ്ത ഫയലുകൾ കാണിക്കുന്നു
self.addEventListener('fetch', (event) => {
    // GET റിക്വസ്റ്റുകൾ മാത്രം കൈകാര്യം ചെയ്യുക
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                // ഇന്റർനെറ്റ് ഇല്ലെങ്കിൽ കാഷെയിൽ നിന്ന് നൽകുക
                return caches.match(event.request);
            })
    );
});
