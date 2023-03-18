import utils from './_utilselaina';
import data from"../configs/ElainaV2_config.json";

let ARAM = data["Aram-only-mode"];

if(ARAM) {window.addEventListener("load",()=>{
    const e=document.createElement("link");
        e.href="//plugins/ElainaV2/assets/Css/Addon-Css/Aram-only.css",
        e.type="text/css",
        e.rel="stylesheet",document.body.append(e)});
    
    let e=e=>{
        let t;
        t=e.getAttribute("data-screen-name"),
        "rcp-fe-lol-parties"==t&&window.setInterval(()=>{
            try{
                document.querySelector("div[data-game-mode='CLASSIC']").remove(),
                document.querySelector("div[data-game-mode='TFT']").remove()
            }
            catch{}
        },100)
    };
    
    window.addEventListener("load",()=>{
        utils.mutationObserverAddCallback(e,["screen-root"])
    })
}