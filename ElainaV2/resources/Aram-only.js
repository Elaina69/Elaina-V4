import utils from './_utilselaina';
import data from"../configs/ElainaV2_config.json";

let ARAM = data["Aram-only-mode"];

if(ARAM) {
    window.addEventListener('load', () => {
        utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Aram-only.css")
    })

    let pageChangeMutation = (node) => {
        let pagename;
        let gamemode;

        pagename=node.getAttribute("data-screen-name");

        if (pagename == "rcp-fe-lol-parties") {
            window.setInterval(()=>{
                try{
                    document.querySelector("div[data-game-mode='CLASSIC']").remove()
                    document.querySelector("div[data-game-mode='TFT']").remove()
                    document.querySelector("lol-uikit-navigation-item[data-category='VersusAi']").remove()
                    document.querySelector("lol-uikit-navigation-item[data-category='Training']").remove()
                }
                catch{}
                try {
                    gamemode = document.getElementsByClassName("parties-game-navs-list")[0].getAttribute("selectedindex");
                    if (gamemode == "0") {
                        document.querySelector('div[data-game-mode=ARAM] div[class=parties-game-type-upper-half]').click()
                    }
                }
                catch {}
            },10)
        }
    };
    
    window.addEventListener("load",()=>{
        utils.mutationObserverAddCallback(pageChangeMutation,["screen-root"])
    })
}