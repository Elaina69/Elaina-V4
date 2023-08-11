import {getPluginsName} from "../openFolder"

function KeyPress(e) {
    let key = window.event? event : e
    if (key.keyCode==80 && key.ctrlKey) {
		window.openPluginsFolder(`${getPluginsName()}`)
	}
}
document.onkeydown = KeyPress