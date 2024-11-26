import { getThemeName } from "../otherThings.ts"
import utils from "../utils/utils.ts"
import * as upl from 'pengu-upl';
import { log, error } from '../utils/themeLog';

export class BackupRestoreData {
	async importData(url: string): Promise<any> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2000);
	
		try {
			const res = await fetch(url, { signal: controller.signal });
			if (res.status === 200) {
				let Data = await import(url)
				return Data.default
			} 
			else throw new Error();
		} catch {
			let errorMsg = "Can't load default datastore from local"
			clearTimeout(timeoutId);
			error(errorMsg);
			window.Toast.error(errorMsg);
		}
	};

	setDefaultData(list: Object, restore: Boolean = false) {
		Object.entries(list).forEach(([key, value]) => {
			  if (!window.DataStore.has(key)) {
				window.DataStore.set(key, value);
				log(`${key} data restored`)
			  }
			else if (window.DataStore.has(key) && restore) {
				window.DataStore.set(key, value);
				log(`${key} data restored`)
			  }
		});
	}

	backup = () => {
		//backup when ready to close client
		upl.observer.subscribeToElementCreation(".riotclient-app-controls",()=>{
			document.querySelector('div[action=close]')?.addEventListener("click", ()=>{
				if (window.DataStore.get("backup-datastore")) writeBackupData()
			})
		})


		//backup right after game start (should run if you don't close client when ingame)
		window.addEventListener("load",async ()=> {
			utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message: any) => {
				let phase = JSON.parse(message["data"])[2]["data"]
				if (phase == "GameStart" || phase == "InProgress") {
					if (window.DataStore.get("backup-datastore")) writeBackupData()
				}
			})
		})
	}

	restore = async () => {
		let datastore_list: Object = window.DataStore.get("Dev-mode")
			? (await this.importData(`//plugins/${getThemeName()}/elaina-theme-data/src/config/datastoreDefault.js`))
			//@ts-ignore
			: (await this.importData(`https://cdn.jsdelivr.net/npm/elaina-theme-data/src/config/datastoreDefault.js`))

		if (window.DataStore.get("Elaina-Plugins")) {
			this.setDefaultData(datastore_list)
		}
		else if (!window.DataStore.get("Elaina-Plugins") || !window.DataStore.has("Elaina-Plugins")) {
			//console.log(eConsole+`%c Finding backup file from cloud...`,eCss,"")
			this.setDefaultData(datastore_list)
			window.setTimeout(()=> {window.restartClient()}, 5000)
		
		
			// window.setTimeout(() => {
			// 	let restoreData = new Promise((resolve, reject) => {
			// 		setTimeout(async () => {
			// 			resolve()
			// 			try { 
			// 				let summonerID = await utils.getSummonerID()
			// 				let cloud = await readBackup(summonerID, "datastore.json")
			// 				if (cloud.success) {
			// 					console.log(eConsole+`%c Found datastore file from cloud, ready to restore it`,eCss,"")
			// 					setDefaultData(JSON.parse(cloud.content), true)
			// 					window.setTimeout(()=>window.restartClient())
			// 				}
			// 			}
			// 			catch { 
			// 				console.log(eConsole+`%c Datastore file not found, use default theme's settings instead`,eCss,"")
			// 			}
			// 		},5000)
			// 	})
				
			// 	Toast.promise(restoreData, {
			// 		loading: 'Restoring Datastore...',
			// 		success: 'Restore complete!',
			// 		error: ''
			// 	})
			// },15000)
		}
	}
}

const backupRestoreData = new BackupRestoreData()

try {
	// Restore Datastore file if no theme's data
	await backupRestoreData.restore()

	// Backup datastore
	backupRestoreData.backup()
}
catch { error("Can not restore datastore") }