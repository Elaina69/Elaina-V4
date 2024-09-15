import { getThemeName } from "../otherThings.js"
import utils from "../utils/utils.js"
import * as observer from "../utils/observer.js"

let datastore_list = DataStore.get("Dev-mode")
	? (await (() => import(`//plugins/${getThemeName()}/elaina-theme-data/src/config/datastoreDefault.js`))()).default
	: (await (() => import(`https://unpkg.com/elaina-theme-data@latest/src/config/datastoreDefault.js`))()).default


function setDefaultData(list, restore) {
	Object.entries(list).forEach(([key, value]) => {
	  	if (!DataStore.has(key)) {
			DataStore.set(key, value);
			console.log(`${key} data restored`)
	  	}
		else if (DataStore.has(key) && restore) {
			DataStore.set(key, value);
			console.log(`${key} data restored`)
	  	}

	});
}

if (DataStore.get("Elaina-Plugins")) {
	setDefaultData(datastore_list, false)
}
else if (!DataStore.get("Elaina-Plugins") || !DataStore.has("Elaina-Plugins")) {
	//console.log(eConsole+`%c Finding backup file from cloud...`,eCss,"")
	setDefaultData(datastore_list)
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


//backup when ready to close client
observer.subscribeToElementCreation(".riotclient-app-controls",()=>{
	document.querySelector('div[action=close]').addEventListener("click", ()=>{
		if (DataStore.get("backup-datastore")) writeBackupData()
	})
})


//backup right after game start (should run if you don't close client when ingame)
window.addEventListener("load",async ()=> {
    utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]
		if (phase == "GameStart" || phase == "InProgress") {
			if (DataStore.get("backup-datastore")) writeBackupData()
		}
	})
})