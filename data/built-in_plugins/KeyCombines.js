import {getPluginsName} from "../openFolder"

function KeyPress(e) {
    let key = window.event? event : e
    if (key.keyCode==80 && key.ctrlKey) {
        window.openPluginsFolder(`${getPluginsName()}`)
    }
    if (key.altKey && key.keyCode== 82) {
        window.restartClient()
    }
}
document.onkeydown = KeyPress 