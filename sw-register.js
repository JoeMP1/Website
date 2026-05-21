if("serviceWorker" in navigator){ //checks if the browser support PWA
    window.addEventListener("load", () =>{ //makes sure everything loads
        navigator.serviceWorker
        .register("/Website/sw.js") //it tells the browser to use this as a background worker
        .then((registeration) => {
            console.log("Service Worker is now registered", registeration.scope);
        })
        .catch((error) =>{
            console.log("Service worker is not working", error);
        });
    });
};