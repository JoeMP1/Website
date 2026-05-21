if("serviceWorker" in navigator){ //checks if the browser support PWA
    window.addEventListener("load", () =>{ //makes sure everything loads
        navigator.serviceWorker
        .register("/Website/sw.js") //it tells the browser to use this as a background worker
        .then((registeration) => {
            registeration.addEventListener("updatefound", () =>{
                const newSW = registeration.installing;

                newSW.addEventListener("statechange",() => {
                    if(newSW.state === "installed" && navigator.serviceWorker.controller){
                        console.log("New version available");
                    }
                });
            });
        });
    });
}
let defferedPrompt;

window.addEventListener("beforeinstallprompt", e=>{
    e.preventDefault(); //stops automatic mini-infobar

    defferedPrompt = e; //for later use

    //show install button
    const installButtn = document.getElementById("installButtn");
    if (installButtn){
        installButtn.style.display = "flex";
    }
    installButtn.addEventListener("click", async ()=>{
        if(!defferedPrompt) return;

        defferedPrompt.prompt();

        const choice = await defferedPrompt.userChoice;

        console.log("User choice: ", choice.outcome);

        defferedPrompt = null;

        installButtn.style.display = "none";
    })
})


//Note: whenever you/i change the site
// i/you must update Cache_name on sw.js and
// push it to Github