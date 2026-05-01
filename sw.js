const CACHE = "apprentissage-v5";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app-state.js",
  "/app-renard.js",
  "/app-nav.js",
  "/app-init.js",
  "/app-gamification.js",
  "/app-analytics.js",
  "/app-sons.js",
  "/app-histoire.js",
  "/games-maths.js",
  "/games-formes.js",
  "/games-temps.js",
  "/games-argent.js",
  "/games-avance.js",
  "/games-langage.js",
  "/games-algo.js",
  "/favicon.svg",
  "/icon-192.svg",
  "/icon-512.svg",
  "/manifest.json",
  "/app-profils.js",
  "/app-params.js",
  "/politique-confidentialite.html",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("message", e => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
