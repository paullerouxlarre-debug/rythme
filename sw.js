/* Rythme : fonctionne hors ligne. Les données restent dans le téléphone (localStorage).
   Stratégie : réseau d'abord (toujours la dernière version), cache en secours hors connexion. */
const C='rythme-1793381019';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const same=new URL(r.url).origin===location.origin;
  e.respondWith(caches.open(C).then(async c=>{
    try{
      const net=await fetch(same?new Request(r,{cache:'no-cache'}):r);
      if(net&&(net.ok||net.type==='opaque'))c.put(r,net.clone());
      return net;
    }catch(err){
      const hit=await c.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await c.match('./index.html'):null);
      if(hit)return hit;throw err;
    }
  }));
});
