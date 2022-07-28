const CACHE_NAME = "koko-cache";
const offlineUrl = ["/offline/index.html"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(offlineUrl);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch((error) => {
      console.log("error--->>", error);
      return caches.match(offlineUrl);
    })
  );

  return;
});
