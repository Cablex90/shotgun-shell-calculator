const CACHE_NAME = "shellcalc-cache-v1";
const urlsToCache = [
  "/index.html",
  "/offline.html",
  "/bootstrap-5.3.3/css/bootstrap.css",
  "/bootstrap-5.3.3/js/bootstrap.bundle.min.js",
  "/style.css",
  "/script.js",
  "/manifest.json",
  
  // Icons
  "/img/icon-192.png",
  "/img/icon-512.png",
  "/img/shell.png",
  
  // Animal images
  "/img/pheasant.png",
  "/img/pigeon.png",
  "/img/crow.png",
  "/img/goose.png",
  "/img/duck.png",
  "/img/fox.png",
  "/img/coyote.png",
  "/img/golden-jackal.png",
  "/img/hare.png",
  "/img/rabbit.png",
  "/img/squirrel.png"
];

// Install event: cache all assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event: remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch event: serve from cache, fallback to network, fallback to offline page
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request)
        .catch(() => {
          // Wenn HTML angefragt wird, offline.html zurückgeben
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html");
          }
        })
      )
  );
});
