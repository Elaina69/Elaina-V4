import LocalKey from "./updateKeyLocal.ts"
import { getThemeName } from "../otherThings.ts"

const CONSOLE_STYLE = {
    prefix: '%c Elaina ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

const log = (message: string, ...args: string[]) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
const warn = (message: string, ...args: string[]) => console.warn(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);

let CdnKey: number = 0

log(`%cChecking theme version...`, "color: #e4c2b3")

const fileLocation = window.DataStore.get("Dev-mode")
  	? `//plugins/${getThemeName()}/elaina-theme-data/src/update/update.js`
  	: `https://unpkg.com/elaina-theme-data@latest/src/update/update.js`;

try {
  	const res = await fetch(fileLocation);
  	if (res.ok) {
    	CdnKey = (await import(fileLocation)).default.key;
	} 
	else warn(`File doesn't exist`);
} 
catch (err: any) {
  	warn(`Error loading file`, err);
}

if (!window.DataStore.get("prevent-manual-update")) {
	let checkKey: boolean = (LocalKey == CdnKey)

	if (checkKey) window.DataStore.set(`Force-Update`, false)
	else window.DataStore.set(`Force-Update`, true)

	let checkVersion = new Promise((resolve: any, reject): void => {
		setTimeout(() => {
			if (checkKey) {
				resolve()
				log(`%cLatest release now`, "color: #e4c2b3")
			}
			else {
				reject()
				log(`%cNew theme manual update available`, "color: #e4c2b3")
			}
		},2000)
	})
	
	window.Toast.promise(checkVersion, {
		loading: 'Checking theme version...',
		success: 'Latest release now',
		error: 'New theme manual update available'
	})
}
else log(`%c Manual update disabled`, "color: #e4c2b3")