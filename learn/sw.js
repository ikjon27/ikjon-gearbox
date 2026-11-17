/* IKJON portal service worker: lets the installed app open without internet.
   It keeps only the sign-in page and icons. The lessons are kept separately, on approved devices only,
   and every sign-in, device check and progress save still goes to the IKJON server. */
const VERSION = "ikjon-learn-2";
const SHELL = ["/learn/", "/learn/manifest.webmanifest", "/learn/icons/icon-192.png", "/learn/icons/icon-512.png", "/learn/icons/favicon-48.png", "/learn/icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if(r.method !== "GET") return;
  const u = new URL(r.url); if(u.origin !== location.origin || !u.pathname.startsWith("/learn/")) return;   // never touch the server calls
  if(r.mode === "navigate" || u.pathname === "/learn/" || u.pathname === "/learn/index.html"){
    // newest sign-in page when online, saved copy when offline
    e.respondWith(fetch(r).then(res => { if(res.ok){ const cp = res.clone(); caches.open(VERSION).then(c => c.put("/learn/", cp)); } return res; }).catch(() => caches.match("/learn/")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r)));
});
