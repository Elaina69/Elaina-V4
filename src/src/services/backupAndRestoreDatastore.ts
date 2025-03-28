import { getThemeName } from "../otherThings.ts"
import { log, error } from '../utils/themeLog';

let datastore_list = (await import(`//plugins/${getThemeName()}/config/datastoreDefault.js`)).default

export class BackupRestoreData {
	async importData(url: string): Promise<any> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 7000);
	
		try {
			const res = await fetch(url, { signal: controller.signal });
			if (res.status === 200) {
				let Data = await import(url)
				return Data.default
			} 
			else throw new Error();
		} 
		catch (err: any) {
			let errorMsg = "Can't load default datastore from local: "
			clearTimeout(timeoutId);
			error(errorMsg, err);
			window.Toast.error(errorMsg);
		}
	};

	setDefaultData(list: Object, restore: Boolean = false) {
		Object.entries(list).forEach(([key, value]) => {
			if (!ElainaData.has(key)) {
				ElainaData.set(key, value);
				log(`${key} data restored`)
			}
			else if (ElainaData.has(key) && restore) {
				ElainaData.set(key, value);
				log(`${key} data restored`)
			}
		});
	}

	restore = async (force: boolean = false) => {
		if (ElainaData.get("Elaina-Plugins")) {
			this.setDefaultData(datastore_list)
		}
		else if (!ElainaData.get("Elaina-Plugins") || !ElainaData.has("Elaina-Plugins") || force) {
			let restoreData = new Promise((resolve: any, reject) => {
				this.setDefaultData(datastore_list)
				setTimeout(async () => {
					resolve()
					window.restartClient()
				},5000)
			})
			
			window.Toast.promise(restoreData, {
				loading: 'Restoring Datastore...',
				success: 'Restore complete!',
				error: ''
			})
		}
	}
}

const backupRestoreData = new BackupRestoreData()
const restoreDefaultDataStore = backupRestoreData.restore

try {
	// Restore Datastore file if no theme's data
	await restoreDefaultDataStore()
}
catch(err:any) { error("Can not restore datastore", err) }

window.restoreDefaultDataStore = restoreDefaultDataStore