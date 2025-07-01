import { UI } from "./settingsUI.ts"
import { utils, log, warn, error } from "../settings.ts"
import { setDefaultData } from "../../services/backupAndRestoreDatastore.ts"

// async function setDefaultData(list, restore) {
// 	Object.entries(list).forEach(([key, value]) => {
// 	  	if (!ElainaData.has(key)) {
// 			ElainaData.set(key, value);
// 			log(`${key} data restored`)
// 	  	}
// 		else if (ElainaData.has(key) && restore) {
// 			ElainaData.set(key, value);
// 			log(`${key} data restored`)
// 	  	}

// 	});
//     log("Data restore complete!!")
// }

const getSystemInfo = async () => {
    let systemInfo: any

    if (ElainaData.get("Dev-mode")) {
        if (ElainaData.get("AllowTrackingData")) {
            systemInfo = await ((await fetch("/performance/v1/system-info")).json())
            ElainaData.set("System-Info", systemInfo)
        }
        else {
            systemInfo = {
                "CPUName": "Hidden",
                "CoreCount": 0,
                "GPUMemory": 0,
                "GPUName": "Hidden",
                "OSVersion": "Hidden",
                "PhysicalMemory": 0
            }
    
            ElainaData.set("System-Info", systemInfo)
        }
    }
}

async function CheckBackupFile() {
    let check: any = document.getElementById("datastore-cloud-checking")
    check.textContent = `${await getString("Loading")}...`
    check.style.color = "#a09b8c"

    let a: any = document.querySelector(".restore-data-button")
    let b: any = document.querySelector(".delete-data-button")
    let c: any = document.getElementById("datastore-cloud-checking")
    let d: any = document.getElementById("backupInfo")

    let lastbackup: any = document.querySelector("#backupSystemInfo > #systemInfo-LastBackup") 
    let os: any = document.querySelector("#backupSystemInfo > #systemInfo-Os") 
    let cpu: any = document.querySelector("#backupSystemInfo > #systemInfo-Cpu") 
    let core: any = document.querySelector("#backupSystemInfo > #systemInfo-Core") 
    let mem: any = document.querySelector("#backupSystemInfo > #systemInfo-Mem") 
    let gpu: any = document.querySelector("#backupSystemInfo > #systemInfo-Gpu") 
    let vram: any = document.querySelector("#backupSystemInfo > #systemInfo-Vram") 

    await new Promise<void>(async (resolve, reject) => {
        try {
            let checkFile: any = await window.elainathemeApi.readBackup(ElainaData.get("ElainaTheme-Token"), ElainaData.get("Summoner-ID"))
            if (checkFile.data != null && Object.keys(checkFile.data).length > 0 && checkFile.success) {
                log("You have backup file on cloud, ready to restore it.")
                a.style.visibility = "visible"
                b.style.visibility = "visible"
                c.style.color = "green"
                c.textContent = `${await getString("Check-Backup.success")}`
                d.style.visibility = "visible"

                let backupData = checkFile.data
                lastbackup.textContent = `${await getString("last-backup")}: ${backupData["last-backup-time"]}`
                if (ElainaData.get("Dev-mode")) {
                    try {
                        os.textContent = `${await getString("OS")}: ${backupData["System-Info"]["OSVersion"]}`
                        cpu.textContent = `${await getString("CPU")}: ${backupData["System-Info"]["CPUName"]}`
                        core.textContent = `${await getString("Core")}: ${backupData["System-Info"]["CoreCount"]}`
                        mem.textContent = `${await getString("RAM")}: ${Math.round(backupData["System-Info"]["PhysicalMemory"] / (1024 ** 3))} GB`
                        gpu.textContent = `${await getString("GPU")}: ${backupData["System-Info"]["GPUName"]}`
                        vram.textContent = `${await getString("Vram")}: ${Math.round(backupData["System-Info"]["GPUMemory"] / (1024 ** 3))} GB`
                    }
                    catch (err: any) {
                        warn("Error while getting backup data:", err)
                    }
                }
                resolve()
            }
            else {
                log("You don't have backup file on cloud yet.")
                a.style.visibility = "hidden"
                b.style.visibility = "hidden"
                c.style.color = "red"
                c.textContent = `${await getString("Check-Backup.error")}`
                d.style.visibility = "hidden"
                resolve()
            }
        }
        catch (err: any) { 
            log("Cloud server is sleep, try backup/restore later. Detail:", err)
            a.style.visibility = "hidden"
            b.style.visibility = "hidden"
            c.style.color = "red"
            c.textContent = `${await getString("Check-Backup.serverError")}`
            d.style.visibility = "hidden"
            reject()
        }
    })
}

export async function backuprestoretab(panel) {
    const loading = UI.Row("loading", [
        UI.Loading(await getString("settings-loading")),
    ])
    panel.appendChild(loading);

    let summonerID = await utils.getSummonerID()
    await getSystemInfo()
    
    try {
        panel.prepend(
            UI.Row("",[
                UI.Label(await getString("Manual-Backup-Restore"), ""),
                document.createElement('br'),
                UI.Row("manualRestoreBackupSystemInfo", [
                    UI.Row("manualRestoreBackup", [
                        UI.Button(await getString("Backup-Data"), "ManualBackup", async () => {
                            let datastore_list = (await import(`//plugins/${window.getThemeName()}/config/datastoreDefault.js`)).default

                            ElainaData.set("last-backup-time", new Date())

                            let sumID = await utils.getSummonerID()
                            let keys = Object.keys(datastore_list)
                            let mirage = datastore_list

                            keys.forEach(key => {
                                mirage[key] = ElainaData.get(key)
                            })
        
                            let blob = new Blob([JSON.stringify(mirage)], { type: 'application/json' })
                            let a: any = document.getElementById("downloadBackup")
                            
                            a.href = URL.createObjectURL(blob)
                            a.download = `ElainaTheme-${sumID}.json`
                            a.click()
                            a.href = ""
                        }),
                        document.createElement('br'),
                        UI.Row("RestoreRow", [
                            UI.Button(await getString("Restore-Data"),"ManualRestore", () => {
                                document.getElementById("manualRestoreInput")?.click()
                            }),
                            UI.Label("", "restoreFileInfo")
                        ]),
                        UI.fileInput("manualRestoreInput", ".json", async (event)=> {
                            const file = event.target.files[0]
                            let text: any = document.getElementById("restoreFileInfo")
                            
                            if (file && file.type === "application/json") {
                                const reader = new FileReader();
                            
                                reader.onload = async (e: any) => {
                                    text.textContent = await getString("Manual-restore-inProgress")
                                    text.style.color = "#e4c2b3"
                                    
                                    try {
                                        const json = JSON.parse(e.target.result);
                                        let restoreData = new Promise<void>((resolve, reject) => {
                                            setTimeout(async () => {
                                                try { 
                                                    await setDefaultData(json, true)
                                                    resolve()
                                                    window.setTimeout(()=>window.restartClient(),2000)
                                                }
                                                catch {
                                                    reject()
                                                    log(`Datastore file not found, avoid restoring`)
                                                }
                                            },5000)
                                        })
                                        
                                        window.Toast.promise(restoreData, {
                                            loading: 'Restoring Datastore...',
                                            success: 'Restore complete!',
                                            error: 'Error while restoring data, check console for more info!'
                                        })
                                    } 
                                    catch {
                                        text.textContent = await getString("Invalid-JSON")
                                        text.style.color = "red"
                                    }
                                };
                            
                                reader.readAsText(file);
                            } 
                            else {
                                text.textContent = await getString("JSON-file-only")
                                text.style.color = "red"
                            }
                        }),
                        UI.Link("", ``, ()=> {}, "downloadBackup")
                    ]),
                    UI.Row("currentSystemInfo", [
                        UI.Label(ElainaData.get("Dev-mode") 
                            ?`${await getString("OS")}: ${ElainaData.get("System-Info")["OSVersion"]}`
                            : "", "systemInfo-Os"),
                        UI.Label(ElainaData.get("Dev-mode")
                            ? `${await getString("CPU")}: ${ElainaData.get("System-Info")["CPUName"]}`
                            : "", "systemInfo-Cpu"),
                        UI.Label(ElainaData.get("Dev-mode")
                            ? `${await getString("Core")}: ${ElainaData.get("System-Info")["CoreCount"]}`
                            : "", "systemInfo-Core"),
                        UI.Label(ElainaData.get("Dev-mode")
                            ? `${await getString("RAM")}: ${Math.round(ElainaData.get("System-Info")["PhysicalMemory"] / (1024 ** 3))} GB` 
                            : "", "systemInfo-Mem"),
                        UI.Label(ElainaData.get("Dev-mode")
                            ? `${await getString("GPU")}: ${ElainaData.get("System-Info")["GPUName"]}`
                            : "", "systemInfo-Gpu"),
                        UI.Label(ElainaData.get("Dev-mode")
                            ? `${await getString("Vram")}: ${Math.round(ElainaData.get("System-Info")["GPUMemory"] / (1024 ** 3))} GB`
                            : "", "systemInfo-Vram"),
                    ]),
                ]),
                UI.CheckBox(
                    `${await getString("backup-datastore")}`,'bakdata', 'bakdatabox', async ()=>{
                        if (ElainaData.get("backup-datastore") && ElainaData.get("Dev-mode")) {
                            await CheckBackupFile()
                            //writeBackupData()
                        }
                    }, ElainaData.get("Dev-mode"), "backup-datastore"
                ),
                UI.Label(ElainaData.get("Dev-mode")? `${await getString("Loading")}...`: "", "datastore-cloud-checking"),
                document.createElement('br'),
                UI.Row("restoreAndDeleteData", [
                    UI.Button(`${await getString("Restore-Data")}`, "restore-data-button", () => {
                        let restoreData = new Promise<void>(async (resolve, reject) => {
                            try { 
                                let cloud: any = await window.elainathemeApi.readBackup(ElainaData.get("ElainaTheme-Token"), summonerID)
                                if (cloud.success) {
                                    await setDefaultData(cloud.data, true)
                                    resolve()
                                    window.setTimeout(()=>window.restartClient(),2000)
                                }
                            }
                            catch {
                                reject()
                                log(`Datastore file not found, avoid restoring`)
                            }
                        })
                        
                        window.Toast.promise(restoreData, {
                            loading: 'Restoring Datastore...',
                            success: 'Restore complete!',
                            error: 'Error while restoring data, check console for more info!'
                        })
                    }),
                    UI.Button(`${await getString("Delete-Data")}`, "delete-data-button",async () => {
                        if (ElainaData.get("Dev-mode")) {
                            await window.elainathemeApi.deleteBackup(ElainaData.get("ElainaTheme-Token"), summonerID)
                            await CheckBackupFile()
                        }
                    }),
                ], ElainaData.get("Dev-mode")),
                UI.Row("backupInfo", [
                    UI.Label(await getString("backupInfo"), ""),
                    UI.Row("backupSystemInfo", [
                        UI.Label("", "systemInfo-LastBackup"),
                        UI.Label("", "systemInfo-Os"),
                        UI.Label("", "systemInfo-Cpu"),
                        UI.Label("", "systemInfo-Core"),
                        UI.Label("", "systemInfo-Mem"),
                        UI.Label("", "systemInfo-Gpu"),
                        UI.Label("", "systemInfo-Vram"),
                    ])
                ])
            ])
        )
        if (ElainaData.get("Dev-mode")) {
            await CheckBackupFile()
        }
    }
    catch (err: any) {
        error("Error loading theme settings:", err);
    } finally {
        loading.remove();
    }
}