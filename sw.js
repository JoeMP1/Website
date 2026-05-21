//Service Worker is important cuz it allows us to use the app OFFLINE

const Cache_name = "website-cache-v2"; //name of the cache storage, can be anything, we put v1,v2 so that we can know if the cache updated
//when the name changes, old cache is deleted automatically and new files are downloaded

const StaticCache = [ //they are files stored offline so that when user opens the app
    "/Website/", // the browser download these and stores them locally
    "/Website/index.html", //so that the website can work offline
    "/Website/styling.css",
    "/Website/manifest.json",
    "/Website/icons/SUBWAY-192x192.png",
    "/Website/icons/SUBWAY-512x512.png",
    "/Website/offline.html"
];


//this works when Service Worker works for the first time and work only once
self.addEventListener("install", e =>{
    e.waitUntil( //it tells the browser to dont finish installation until the caching is done
                //if the caching fails, installation fails
        caches.open(Cache_name) //opens a storage box, in this case, Cache_name
        .then((cache) => {
            return cache.addAll(StaticCache); //it download all the listed files and stores them offline
        })
    );
    self.skipWaiting();// it forces the new SW to activate instantly instead of waiting
});


self.addEventListener("activate", e =>{ //it starts when Service Worker(SW) becomes active
    e.waitUntil(
        caches.keys().then((keys) =>{ //it gather all the old cdache version
            return Promise.all(
                keys.map((key) => {
                    if(key !== Cache_name){ //this if section deletes all the old cache
                        return caches.delete(key)
                    }
                })
            );
        })
    );
    self.clients.claim();//makes the SW take control of the page instantly
})

self.addEventListener("fetch", e =>{//it runs whenever the website request something such as html,css,js and image
    const request = e.request;

    if(request.mode === "navigate"){ //it detects the page navigation
        e.respondWith(
            fetch(request).catch(() => caches.match("/Website/offline.html"))//try the internet first and if it fails, show the offline page
        );
        return;
    }

    e.respondWith(
        caches.match(request).then((cached) =>{ //checks if the file exist in cache
            return(
                cached || fetch(request).then((response) =>{ //if found, return cached and use it immediately
                                                             //if not found, then fetch(request), and download it from the internet
                    const copy = response.clone(); //we clone it as response can only be use once
                    caches.open(Cache_name).then((cache) =>{
                        cache.put(request,copy);//storing it for next time
                    });
                    return response; //user see the file
                })
            );
        })
    );
});

//allows the website to tell sw to update and activate new version now
self.addEventListener("message", e =>{
    if (e.data && e.data.type === "SKIP_WAITING"){
        self.skipWaiting();
    };
});