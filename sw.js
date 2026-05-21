//Service Worker is important cuz it allows us to use the app OFFLINE

const Cache_name = "website-cache-v1"; //name of the cache storage, can be anything

const urlToCache = [ //they are files stored offline so that when user opens the app
    "/Website/", // the browser download these and stores them locally
    "/Website/index.html", //so that the website can work offline
    "/Website/styling.css",
];


//this works when Service Worker works for the first time
self.addEventListener("install", e =>{
    console.log("Service work is now installing");

    e.waitUntil(
        caches.open(Cache_name) // opens browser storage
        .then(cache => {
            console.log("Catching files");
            return cache.addAll(urlToCache); // download all the listing files into offline cache
        })
    );
});


//runs everytime the website request something
//it can be html,images,js etc
self.addEventListener("fetch", e =>{
    e.respondWith(
        caches.match(e.request)// checks if we have the files offline
                               
            .then(response =>{//if yes, then serve it
            return response || fetch(e.request);//else, fetch it from the internet
        })
    );
});