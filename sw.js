// Service Worker - Copa Vicente 2026
const CACHE = 'copa-vicente-v3';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './copa.vicente.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instala e pré-cacheia os arquivos principais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

// Ativa e limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estratégia: rede primeiro, fallback para cache (mantém dados atualizados)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, clone)).catch(() => {});
      return response;
    }).catch(() => caches.match(event.request))
  );
});
