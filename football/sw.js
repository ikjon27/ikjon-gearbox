/* IKJON Football Training — offline after the first visit. */
const VERSION="ikjon-fb-202611091800";
const FILES=["./","index.html","manifest.webmanifest","/rehab/icons/favicon-48.png","/rehab/icons/icon-192.png","/rehab/icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("ikjon-fb-")&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==location.origin)return;
 if(!u.pathname.startsWith("/football/")&&!FILES.includes(u.pathname))return;
 /* network first for the page so updates arrive quickly; cache when offline */
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put("index.html",cp));return res}).catch(()=>caches.match("index.html")));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r)))});
