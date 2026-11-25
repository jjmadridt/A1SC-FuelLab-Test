// Fuel Lab: explicit update approval, fresh navigation and version-scoped fallback.
const CACHE = 'fuel-lab-pwa-v180-beta-simple';
const ASSETS = ['./icon-192.png','./icon-512.png','./manifest.webmanifest'];
const PAGE = new URL('./index.html',self.registration.scope).href;
self.addEventListener('install',event => {event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(asset=>new Request(asset,{cache:'reload'})))));});
self.addEventListener('message',event=>{if(event.data && event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fuel-lab-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event => {
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  const url=new URL(request.url),scope=new URL(self.registration.scope);
  const appPage=url.pathname===scope.pathname||url.pathname===new URL(PAGE).pathname;
  if(!appPage)return;
  event.respondWith((async()=>{
   try{
    const response=await fetch(request,{cache:'no-store'});
    if(response.ok&&response.headers.get('content-type')?.includes('text/html')){
     try{const cache=await caches.open(CACHE);await cache.put(PAGE,response.clone());}catch(_){}
    }
    return response;
   }catch(_){const cached=await (await caches.open(CACHE)).match(PAGE);return cached||Response.error();}
  })());return;
 }
 event.respondWith(fetch(request).catch(async()=>await (await caches.open(CACHE)).match(request)||Response.error()));
});
