// troque a versão para forçar atualização quando editar o app
const CACHE = "romaneio-v18";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll([
        "./",
        "./index.html",
        "./app.html",
        "./manifest.webmanifest",
        "./icon-192.png",
        "./icon-512.png",
      ])
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

// Estratégia: somente GET da mesma origem. POSTs para Apps Script passam direto.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // não intercepta chamadas ao Google Apps Script nem POSTs
  if (req.method !== "GET") return;
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
    )
  );
});
