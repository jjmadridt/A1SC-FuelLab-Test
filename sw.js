// Fuel Lab PWA: network-first navigation to avoid stale updates.
const CACHE = 'fuel-lab-pwa-v1';
const ASSETS = ['./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',event => {event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event => {
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}
 event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
