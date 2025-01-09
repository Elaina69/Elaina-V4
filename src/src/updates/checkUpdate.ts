import LocalKey from "./updateKeyLocal.ts"
import { getThemeName, cdnImport } from "../otherThings.ts"
import { log, warn } from "../utils/themeLog.ts"

let CdnKey: number = 0

log(`%cChecking theme version...`, "color: #e4c2b3")

const fileLocation = window.DataStore.get("Dev-mode")
  	? `//plugins/${getThemeName()}/elaina-theme-data/src/update/update.js`
  	: `https://cdn.jsdelivr.net/npm/elaina-theme-data/src/update/update.js`;

try {
	CdnKey = (await cdnImport(fileLocation, "Can't load cdn key")).default.key;
}
catch { CdnKey = LocalKey }

export class CheckUpdate {
	main = () => {
		if (!window.DataStore.get("prevent-manual-update")) {
			window.addEventListener("load", ()=> {
				let checkKey: boolean = (LocalKey >= CdnKey)
		
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
			})
		}
		else log(`%c Manual update disabled`, "color: #e4c2b3")
	}
}
