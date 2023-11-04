import {getPluginsName} from "../openFolder"

window.addEventListener("keydown", async (event)=>{
    let key = event.key
    if (event.ctrlKey && key=="p") {
        window.openPluginsFolder(`${getPluginsName()}`)
    }
    if (event.altKey && key=="r") {
        window.restartClient()
    }
})