import LocalKey from "./UpdateKey-Local.js"
import { getThemeName } from "../OtherThings.js"

let CdnKey
let eConsole = "%c Elaina "
let eCss = "color: #ffffff; background-color: #f77fbe"

console.log(eConsole+`%c Checking theme version...`, eCss,"color: #e4c2b3")

if (DataStore.get("Dev-mode")) {
	let fileLocation = `//plugins/${getThemeName()}/elaina-theme-data/data/Update/UpdateKey-CDN.js`
	let res = await fetch(fileLocation)
	if (res.status == 200) CdnKey = (await (() => import(fileLocation))()).default
	else console.warn(eConsole+`%c File doesn't exist`,eCss,"")
}
else {
	let fileLocation = `https://unpkg.com/elaina-theme-data@latest/data/Update/UpdateKey-CDN.js`
	let res = await fetch(fileLocation)
	if (res.status == 200) CdnKey = (await (() => import(fileLocation))()).default
	else console.warn(eConsole+`%c File doesn't exist`,eCss,"")
}

if (!DataStore.get("prevent-manual-update")) {
	if (LocalKey == CdnKey) DataStore.set(`Force-Update`, false)
	else DataStore.set(`Force-Update`, true)

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
}
else console.log(eConsole+`%c Manual update disabled`, eCss,"color: #e4c2b3")