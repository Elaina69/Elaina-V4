import { getThemeName } from "../OtherThings.js"
import utils from "../Utilities/_utils.js"
import * as observer from "../Utilities/_observer.js"

let eConsole 	= "%c Elaina "
let eCss 		= "color: #ffffff; background-color: #f77fbe"
let datastore_list

if (DataStore.get("Dev-mode")) 
    datastore_list = (await (() => import(`//plugins/${getThemeName()}/elaina-theme-data/data/Configs/Datastore-default.js`))()).default
else 
    datastore_list = (await (() => import(`https://unpkg.com/elaina-theme-data@latest/data/Configs/Datastore-default.js`))()).default


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
	console.log(eConsole+`%c Finding backup file from cloud...`,eCss,"")
	setDefaultData(datastore_list)

	window.setTimeout(() => {
		let restoreData = new Promise((resolve, reject) => {
			setTimeout(async () => {
				if (true) {
					resolve()
					try { 
						let summonerID = await utils.getSummonerID()
						let cloud = await readBackup(summonerID, "datastore.json")
						if (cloud.success) {
							console.log(eConsole+`%c Found datastore file from cloud, ready to restore it`,eCss,"")
							setDefaultData(JSON.parse(cloud.content), true)
							window.restartClient()
						}
					}
					catch { 
						console.log(eConsole+`%c Datastore file not found, use default theme's settings instead`,eCss,"")
					}
				}
				else reject()
			},5000)
		})
		
		Toast.promise(restoreData, {
			loading: 'Restoring Datastore...',
			success: 'Restore complete!',
			error: ''
		})
	},10000)
}


//backup when ready to close client
observer.subscribeToElementCreation(".riotclient-app-controls",()=>{
	document.querySelector('div[action=close]').addEventListener("click", ()=>{
		writeBackupData()
	})
})


//backup right after game start (should run if you don't close client when ingame)
window.addEventListener("load",async ()=> {
    utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]
		if (phase == "GameStart" || phase == "InProgress") {
			writeBackupData()
		}
	})
})