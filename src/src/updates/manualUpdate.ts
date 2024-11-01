import LocalKey from "./updateKeyLocal.ts"
import { getThemeName } from "../otherThings.ts"

let CdnKey: number = 0
let eConsole = "%c Elaina "
let eCss = "color: #ffffff; background-color: #f77fbe"

console.log(eConsole+`%c Checking theme version...`, eCss,"color: #e4c2b3")

const fileLocation = window.DataStore.get("Dev-mode")
  	? `//plugins/${getThemeName()}/elaina-theme-data/src/update/updateKeyCdn.js`
  	: `https://unpkg.com/elaina-theme-data@latest/src/update/updateKeyCdn.js`;

try {
  	const res = await fetch(fileLocation);
  	if (res.ok) {
    	CdnKey = (await import(fileLocation)).default;
	} 
	else console.warn(`${eConsole}%c File doesn't exist`, eCss, "");
} 
catch (err: any) {
  	console.warn(`${eConsole}%c Error loading file`, eCss, err);
}

if (!window.DataStore.get("prevent-manual-update")) {
	let checkKey: boolean = (LocalKey == CdnKey)

	if (checkKey) window.DataStore.set(`Force-Update`, false)
	else window.DataStore.set(`Force-Update`, true)

	let checkVersion = new Promise((resolve: any, reject): void => {
		setTimeout(() => {
			if (checkKey) {
				resolve()
				console.log(eConsole+`%c Latest release now`, eCss,"color: #e4c2b3")
			}
			else {
				reject()
				console.log(eConsole+`%c New theme manual update available`, eCss,"color: #e4c2b3")
			}
		},2000)
	})
	
	window.Toast.promise(checkVersion, {
		loading: 'Checking theme version...',
		success: 'Latest release now',
		error: 'New theme manual update available'
	})
}
else console.log(eConsole+`%c Manual update disabled`, eCss,"color: #e4c2b3")