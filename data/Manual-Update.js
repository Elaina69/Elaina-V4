import LocalKey from "./UpdateKey-Local.js"
import {getPluginsName} from "./openFolder.js"

let CdnKey
let eConsole = "%c ElainaV3 "
let eCss = "color: #ffffff; background-color: #f77fbe"

console.log(eConsole+`%c Checking theme version...`, eCss,"color: #e4c2b3")

try {
	if (DataStore.get("Dev-mode")) {
		let res = await fetch(`//plugins/${getPluginsName()}/ElainaV3-Data/data/configs/UpdateKey-CDN.js`)
		if (res.status == 200) {
			CdnKey = (await (() => import(`//plugins/${getPluginsName()}/ElainaV3-Data/data/configs/UpdateKey-CDN.js`))()).default
		}
	}
	else {
		let res = await fetch("https://unpkg.com/elainav3-data@latest/data/configs/UpdateKey-CDN.js")
		if (res.status == 200) {
			CdnKey = (await (() => import("https://unpkg.com/elainav3-data@latest/data/configs/UpdateKey-CDN.js"))()).default
		}
	}
}
catch{console.warn(`File doesn't exist`)}

if (LocalKey == CdnKey) {DataStore.set(`Force-Update`, false)}
else {DataStore.set(`Force-Update`, true)}

let checkVersion = new Promise((resolve, reject) => {
	setTimeout(() => {
	  	if (LocalKey == CdnKey) {
			resolve()
			console.log(eConsole+`%c Latest release now`, eCss,"color: #e4c2b3")
	  	}
	  	else {
			reject()
    		console.log(eConsole+`%c New theme manual update available`, eCss,"color: #e4c2b3")
		}
	},2000)
})
  
Toast.promise(checkVersion, {
	loading: 'Checking theme version...',
	success: 'Latest release now',
	error: 'New theme manual update available'
})