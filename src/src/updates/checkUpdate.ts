import LocalKey from "./updateKeyLocal.ts"
import { getThemeName, cdnImport } from "../otherThings.ts"
import { log, warn } from "../utils/themeLog.ts"

let CdnKey: number = 0
let cdnServer = (await import(`//plugins/${getThemeName()}/config/cdnServer.js`)).default

log(`%cChecking theme version...`, "color: #e4c2b3")

try {
	const fileLocation = ElainaData.get("Dev-mode")
  		? `//plugins/${getThemeName()}/elaina-theme-data/src/update/update.js`
  		: `${cdnServer["cdn-url"]}elaina-theme-data@${cdnServer["version"]}/src/update/update.js`;

	CdnKey = (await cdnImport(fileLocation, "Can't load cdn key")).default.key;
}
catch { CdnKey = LocalKey }

export class CheckUpdate {
	main = () => {
		if (!ElainaData.get("prevent-manual-update")) {
			window.addEventListener("load", ()=> {
				let checkKey: boolean = (LocalKey >= CdnKey)
		
				if (checkKey) ElainaData.set(`Force-Update`, false)
				else ElainaData.set(`Force-Update`, true)
		
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
