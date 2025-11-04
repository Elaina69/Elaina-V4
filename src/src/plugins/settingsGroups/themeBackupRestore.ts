import { UI } from "./settingsUI.ts"
import utils from "../../utils/utils.ts"
import { log, warn, error } from "../../utils/themeLog.ts"
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
        systemInfo = await ((await fetch("/performance/v1/system-info")).json())
        ElainaData.set("System-Info", systemInfo)
        // if (ElainaData.get("AllowTrackingData")) {
        //     systemInfo = await ((await fetch("/performance/v1/system-info")).json())
        //     ElainaData.set("System-Info", systemInfo)
        // }
        // else {
        //     systemInfo = {
        //         "CPUName": "Hidden",
        //         "CoreCount": 0,
        //         "GPUMemory": 0,
        //         "GPUName": "Hidden",
        //         "OSVersion": "Hidden",
        //         "PhysicalMemory": 0
        //     }
    
        //     ElainaData.set("System-Info", systemInfo)
        // }
    }
}

async function CheckBackupFile() {
    const restoreButton = document.querySelector(".restore-data-button") as HTMLElement
    const deleteButton = document.querySelector(".delete-data-button") as HTMLElement
    const checkText = document.getElementById("datastore-cloud-checking") as HTMLElement
    const backupInfo = document.getElementById("backupInfo") as HTMLElement

    const lastbackup = document.querySelector("#backupSystemInfo > #systemInfo-LastBackup") as HTMLElement
    const os = document.querySelector("#backupSystemInfo > #systemInfo-Os") as HTMLElement
    const cpu = document.querySelector("#backupSystemInfo > #systemInfo-Cpu") as HTMLElement
    const core = document.querySelector("#backupSystemInfo > #systemInfo-Core") as HTMLElement
    const mem = document.querySelector("#backupSystemInfo > #systemInfo-Mem") as HTMLElement
    const gpu = document.querySelector("#backupSystemInfo > #systemInfo-Gpu") as HTMLElement
    const vram = document.querySelector("#backupSystemInfo > #systemInfo-Vram") as HTMLElement

    try {
        checkText.textContent = `${await getString("Loading")}...`
        checkText.style.color = "#a09b8c"

        let checkFile: any = await window.elainathemeApi.readBackup(ElainaData.get("ElainaTheme-Token"), ElainaData.get("Summoner-ID"))
        if (checkFile.data != null && Object.keys(checkFile.data).length > 0 && checkFile.success) {
            log("You have backup file on cloud, ready to restore it.")
            restoreButton.style.visibility = "visible"
            deleteButton.style.visibility = "visible"
            checkText.style.color = "green"
            checkText.textContent = `${await getString("Check-Backup.success")}`
            backupInfo.style.visibility = "visible"

            let backupData = JSON.parse(checkFile.data)
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
                    warn("Error while getting system data:", err)
                }
            }
        }
        else {
            log("You don't have backup file on cloud yet.")
            restoreButton.style.visibility = "hidden"
            deleteButton.style.visibility = "hidden"
            checkText.style.color = "yellow"
            checkText.textContent = `${await getString("Check-Backup.error")}`
            backupInfo.style.visibility = "hidden"
        }
    }
    catch (err: any) { 
        log("Cloud server is sleep, try backup/restore later. Detail:", err)
        restoreButton.style.visibility = "hidden"
        deleteButton.style.visibility = "hidden"
        checkText.style.color = "red"
        checkText.textContent = `${await getString("Check-Backup.serverError")}`
        backupInfo.style.visibility = "hidden"
    }
}

export async function backuprestoretab(panel: Element) {
    // Hiện icon loading trong khi đang tải dữ liệu
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
                        if (ElainaData.get("backup-datastore")) {
                            await CheckBackupFile()
                            //writeBackupData()
                        }
                    }, true, "backup-datastore"
                ),
                UI.Label(`${await getString("Loading")}...`, "datastore-cloud-checking"),
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
                        try {
                            await window.elainathemeApi.deleteBackup(ElainaData.get("ElainaTheme-Token"), summonerID)
                            log("Datastore file deleted from cloud")
                            await new Promise((r) => setTimeout(r, 1000));
                        }
                        catch (err: any) {
                            error("Error deleting datastore file from cloud:", err)
                        }
                        finally { await CheckBackupFile() }
                    }),
                ], true),
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
        await CheckBackupFile()
    }
    catch (err: any) {
        error("Error loading theme settings:", err);
    } finally {
        loading.remove();
    }
}