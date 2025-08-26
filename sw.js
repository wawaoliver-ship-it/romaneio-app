const CACHE = "romaneio-v16";
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./index.html","./app.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"])));
});
self.addEventListener("fetch", e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
