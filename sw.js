const CACHE_NAME = "graincalc-cache-v1";
const urlsToCache = [
  "/index.html",
  "/bootstrap-5.3.3/css/bootstrap.css",
  "/bootstrap-5.3.3/js/bootstrap.bundle.min.js",
  "/script.js",
  "/img/shell.png",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});
