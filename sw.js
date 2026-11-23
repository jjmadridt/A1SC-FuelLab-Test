// Fuel Lab PWA update lifecycle: wait for user approval before activating a new worker.
const CACHE = 'fuel-lab-pwa-v130';
const ASSETS = ['./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',event => {event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('message',event=>{if(event.data && event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fuel-lab-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event => {
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}
 event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
