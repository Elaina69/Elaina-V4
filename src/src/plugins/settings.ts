import utils from '../utils/utils.ts'
import * as upl from "pengu-upl"
import structure from "./settingsGroups/settingsStructure.ts"
import { settingsUtils } from "../utils/settingsUtils.ts"
import { themesSettings } from "./settingsGroups/themeSettings.ts"
import { pluginsSettings } from "./settingsGroups/themePluginsSettings.ts"
import { backuprestoretab } from "./settingsGroups/themeBackupRestore.ts"
import { aboutustab } from "./settingsGroups/themeAboutUs.ts"
import { log, error, warn } from "../utils/themeLog.ts";
import { getThemeName } from '../otherThings.ts'

let datastore_list = (await import(`//plugins/${getThemeName()}/config/datastoreDefault.js`)).default

let datapath = `//plugins/${getThemeName()}/`

window.DataStore.set("settingsChangenumber", 0)

async function restartAfterChange(el: string, data: string) {
    let lastdata: any = document.getElementById(el)?.getAttribute("lastdatastore")
    
    window.DataStore.set("settingsChangenumber", lastdata == JSON.stringify(!window.DataStore.get(data))? window.DataStore.get("settingsChangenumber") + 1 : window.DataStore.get("settingsChangenumber") - 1)

    if (!document.querySelector("#restartAfterChangeButton") && window.DataStore.get("settingsChangenumber") > 0) {
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
            let keys = Object.keys(datastore_list)
            let mirage = datastore_list
            keys.forEach(key => {
                mirage[key] = window.DataStore.get(key)
            })
            if (window.DataStore.get("backup-datastore")) {
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
    else if (window.DataStore.get("settingsChangenumber") == 0) {
        document.querySelector("#restartAfterChangeButton")?.remove()
    }
}

function writeBackupData() {
    let keys = Object.keys(datastore_list)
    let mirage = datastore_list
    keys.forEach(key => {
        mirage[key] = window.DataStore.get(key)
    })
    window.writeBackup(window.DataStore.get("Summoner-ID"), "datastore.json", JSON.stringify(mirage))
}
    
window.addEventListener('load', async () => {
    upl.observer.subscribeToElementCreation(".plugins-settings-logo", (element) => {
        element.addEventListener("click", ()=> {
            window.DataStore.set("Active-dev-button", window.DataStore.get("Active-dev-button") + 1)
            if (window.DataStore.get("Active-dev-button") == 20) {
                window.DataStore.set("Dev-button", true)
                log("Developer mode button has appeared !")
            }
            else if (window.DataStore.get("Active-dev-button") > 20) {
                window.DataStore.set("Dev-button", true)
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
                const aboutus = document.querySelector('lol-uikit-scrollable.aboutus_settings')
                const backupandrestore = document.querySelector('lol-uikit-scrollable.backup_restore_settings')

                if (theme && mutations.some((record) => Array.from(record.addedNodes).includes(theme))) {
                    themesSettings(theme)
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

export { datapath, utils, restartAfterChange, datastore_list, log, error, warn }
export function Settings(context) {
    settingsUtils(context, structure)
}

window.writeBackupData = writeBackupData