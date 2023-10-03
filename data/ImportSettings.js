import {getPluginsName} from "./openFolder.js"
let init
if (DataStore.get("Dev-mode")) {
    try  {
		let res = await fetch(`//plugins/${getPluginsName()}/ElainaV3-Data/data/built-in_plugins/Settings.js`)
		if (res.status == 200) {
			init = (await (() => import(`//plugins/${getPluginsName()}/ElainaV3-Data/data/built-in_plugins/Settings.js`))()).init
		}
	}
	catch{console.warn(`File doesn't exist, can't load ElainaV3 settings`)}
}
else {
    try  {
		let res = await fetch(`https://unpkg.com/elainav3-data@latest/data/built-in_plugins/Settings.js`)
		if (res.status == 200) {
			init = (await (() => import(`https://unpkg.com/elainav3-data@latest/data/built-in_plugins/Settings.js`))()).init
		}
	}
	catch{console.warn(`File doesn't exist, can't load ElainaV3 settings`)}
}

export {init}