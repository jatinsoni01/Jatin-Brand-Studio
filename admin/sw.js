// Admin JBS — Service Worker
const CACHE_NAME = 'admin-jbs-cache-v1';
const APP_SHELL = [
  '/admin/index.html',
  '/admin/dashboard.html',
  '/admin/css/admin.css',
  '/admin/js/admin.js',
  '/admin/js/auth.js',
  '/admin/assets/icons/icon-192.png',
  '/admin/assets/icons/icon-512.png',
  '/admin/manifest.json'
];

// Install: pre-cache the admin app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch((err) => console.warn('Admin JBS SW precache skipped:', err))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fall back to cache (keeps Firebase/auth data fresh, supports offline shell)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith('/admin/')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('/admin/index.html')))
  );
});
