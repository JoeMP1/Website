//Service Worker is important cuz it allows us to use the app OFFLINE

const Cache_name = "website-cache-v1"; //name of the cache storage, can be anything

const StaticCache = [ //they are files stored offline so that when user opens the app
    "/Website/", // the browser download these and stores them locally
    "/Website/index.html", //so that the website can work offline
    "/Website/styling.css",
    "/Website/manifest.json",
    "/Website/icons/SUBWAY-192x192.png",
    "/Website/icons/SUBWAY-512x512.png",
    "/Website/offline.html"
];


//this works when Service Worker works for the first time
self.addEventListener("install", e =>{
    e.waitUntil(
        caches.open(Cache_name)
        .then((cache) => {
            return cache.addAll(StaticCache);
        })
    );
    self.skipWaiting();
});


self.addEventListener("activate", e =>{
    e.waitUntil(
        caches.keys().then((keys) =>{
            return Promise.all(
                keys.map((key) => {
                    if(key !== Cache_name){
                        return caches.delete(key)
                    }
                })
            );
        })
    );
    self.clients.claim();
})

self.addEventListener("fetch", e =>{
    const request = e.request;

    if(request.mode === "navigate"){
        e.respondWith(
            fetch(request).catch(() => caches.match("/Website/offline.html"))
        );
        return;
    }

    e.respondWith(
        caches.match(request).then((cached) =>{
            return(
                cached || fetch(request).then((response) =>{
                    const copy = response.clone();
                    caches.open(Cache_name).then((cache) =>{
                        cache.put(request,copy);
                    });
                    return response;
                })
            );
        })
    );
});