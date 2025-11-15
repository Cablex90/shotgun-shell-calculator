const CACHE_NAME = "shellcalc-cache-v2"; // Neue Version
const urlsToCache = [
  "./index.html",
  "./bootstrap-5.3.3/css/bootstrap.css",
  "./bootstrap-5.3.3/js/bootstrap.bundle.min.js",
  "./script.js",
  "./style.css",
  "./manifest.json",
  "./img/shell.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/pheasant.png",
  "./img/pigeon.png",
  "./img/crow.png",
  "./img/goose.png",
  "./img/duck.png",
  "./img/fox.png",
  "./img/coyote.png",
  "./img/golden-jackal.png",
  "./img/hare.png",
  "./img/rabbit.png",
  "./img/squirrel.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Fallback für HTML-Dokumente
        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }
      });
    })
  );
});

// Activate: alte Caches löschen
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
