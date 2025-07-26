import * as upl from "pengu-upl"
import structure from "./settingsGroups/settingsStructure.ts"
import { settingsUtils } from "../utils/settingsUtils.ts"
import { themeSettings } from "./settingsGroups/themeSettings.ts"
import { pluginsSettings } from "./settingsGroups/themePluginsSettings.ts"
import { backuprestoretab } from "./settingsGroups/themeBackupRestore.ts"
import { aboutustab } from "./settingsGroups/themeAboutUs.ts"
import { log, error } from "../utils/themeLog.ts";
import { getThemeName } from '../otherThings.ts'

let datapath = `//plugins/${getThemeName()}/`

ElainaData.set("settingsChangenumber", 0)

async function restartAfterChange(el: string, data: string) {
    let lastdata: any = document.getElementById(el)?.getAttribute("lastdatastore")
    
    ElainaData.set("settingsChangenumber", lastdata == JSON.stringify(!ElainaData.get(data))? ElainaData.get("settingsChangenumber") + 1 : ElainaData.get("settingsChangenumber") - 1)

    if (!document.querySelector("#restartAfterChangeButton") && ElainaData.get("settingsChangenumber") > 0) {
        let target = document.querySelector(".lol-settings-footer.ember-view")
        let a = document.createElement("lol-uikit-flat-button-group")
        let b = document.createElement("lol-uikit-flat-button")

        a.setAttribute("type","window-popup")
        a.classList.add("lol-settings-close-container")
        a.style.cssText = "margin-left: 10px"
        a.id = "restartAfterChangeButton"

        b.classList.add("lol-settings-close-button")
        b.style.cssText = "width: 150px;"
        b.textContent = await getString("restart-client")
        b.id = "restartAfterChange"

        b.addEventListener("click",() => {
            if (ElainaData.get("backup-datastore")) {
                try { writeBackupData() }
                catch (err: any) { error("Server is down rightnow", err)}
                window.setTimeout(()=>{
                    window.restartClient()
                }, 3000)
            }
            else window.restartClient()
        })

        target?.append(a)
        a.append(b)
    }
    else if (ElainaData.get("settingsChangenumber") == 0) {
        document.querySelector("#restartAfterChangeButton")?.remove()
    }
}

async function writeBackupData() {
    let datastore_list = (await import(`${datapath}config/datastoreDefault.js`)).default

    ElainaData.set("last-backup-time", new Date())

    let keys = Object.keys(datastore_list)
    let mirage = datastore_list
    keys.forEach(key => {
        mirage[key] = ElainaData.get(key)
    })
    await window.elainathemeApi.writeBackup(ElainaData.get("ElainaTheme-Token"), ElainaData.get("Summoner-ID"), mirage)
}
    
window.addEventListener('load', async () => {
    // Add a listener to the close button to write backup data if Dev mode is enabled
    upl.observer.subscribeToElementCreation(".app-controls-button.app-controls-close", (element) => {
        element.addEventListener("click", async () => {
            if (ElainaData.get("backup-datastore")) {
                await writeBackupData()
            }
        })
    })

    // Add a listener to the logo in plugins settings to enable developer mode
    upl.observer.subscribeToElementCreation(".plugins-settings-logo", (element) => {
        element.addEventListener("click", ()=> {
            ElainaData.set("Active-dev-button", ElainaData.get("Active-dev-button") + 1)
            if (ElainaData.get("Active-dev-button") == 20) {
                ElainaData.set("Dev-button", true)
                log("Developer mode button has appeared !")
            }
            else if (ElainaData.get("Active-dev-button") > 20) {
                ElainaData.set("Dev-button", true)
                log("You already become developer !")
            }
        })
    })

    const interval = setInterval(() => {
        const manager = document.getElementById('lol-uikit-layer-manager-wrapper')
        if (manager) {
            clearInterval(interval)
            new MutationObserver((mutations) => {
                const plugin = document.querySelector('lol-uikit-scrollable.plugins_settings')
                const theme = document.querySelector('lol-uikit-scrollable.theme_settings')
                const backupandrestore = document.querySelector('lol-uikit-scrollable.backup_restore_settings')
                const aboutus = document.querySelector('lol-uikit-scrollable.aboutus_settings')

                if (theme && mutations.some((record) => Array.from(record.addedNodes).includes(theme))) {
                    themeSettings(theme)
                }
                else if (plugin && mutations.some((record) => Array.from(record.addedNodes).includes(plugin))) {
                    pluginsSettings(plugin)
                }
                else if (backupandrestore && mutations.some((record) => Array.from(record.addedNodes).includes(backupandrestore))) {
                    backuprestoretab(backupandrestore)
                }
                else if (aboutus && mutations.some((record) => Array.from(record.addedNodes).includes(aboutus))) {
                    aboutustab(aboutus)
                }
            }).observe(manager, {
                childList: true,
                subtree: true
            })
        }
    },500)
})

export { datapath, restartAfterChange }
export function Settings(context: any) {
    settingsUtils(context, structure)
}

window.writeBackupData = writeBackupData