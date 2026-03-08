import { UI } from "./settingsUI.ts"
import { restartAfterChange } from "../settings.ts"
import { error } from "../../utils/themeLog.ts"
import { rankList } from "../../utils/rankList.ts"

async function pluginsSettings(panel) {
    const loading = UI.createRow("loading", [
        UI.createLoading(await getString("settings-loading")),
    ])
    panel.appendChild(loading);
    
    try {
        const rank = await rankList();

        panel.prepend(
            UI.createRow("",[
                UI.createRow("Info",[
                    UI.createRow("Info-div",[
                        UI.createLink(
                            'ElainaV4',
                            'https://github.com/Elaina69/Elaina-V4',
                            () => {},
                            "theme-link"
                        ),  
                        UI.createLabel(
                        `*${await getString("note")}: ${await getString("note-1")}`, ""
                        ),
                    ]),
                    UI.createImage(true, "logo.png", "plugins-settings-logo")
                ]),
                UI.createLabel(
                    `${await getString("plugins-settings")}`, ""
                ),
                UI.createCheckBox(
                    `${await getString("old-ll-settings")}`,'oldll','oldllbox',
                    ()=>{
                        restartAfterChange('oldll',"Old-League-Loader-Settings")
                    },true,"Old-League-Loader-Settings"
                ),
                document.createElement('br'),
                UI.createRow("loothelp",[
                    UI.createCheckBox(
                        `${await getString("loot-helper")}`,'lh','lhbox',
                        ()=>{
                            restartAfterChange('lh', "loot-helper")
                        },true, "loot-helper"
                    )
                ]),
                UI.createCheckBox(
                    `${await getString("auto_accept_button")}`,'autoacceptbutton','autoacceptbuttonbox',
                    ()=>{
                        if (!ElainaData.get("auto_accept_button")) {
                            document.getElementById("autoAcceptQueueButton")?.remove()
                        }
                    },true,"auto_accept_button"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("dodge-button")}`, "dodgebutton", "dodgebuttonbox",
                    () => {
                        restartAfterChange("dodgebutton", "dodge-button")
                    },true, "dodge-button"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("Enable-Invite-Fr")}`,'invfr','invfrbox',
                    ()=>{},true, "Enable-Invite-Fr"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("aram-only")}`, "Aram only", "Aram only checkbox",
                    () => {
                        restartAfterChange("Aram only", "aram-only")
                    },true, "aram-only"
                ),
                document.createElement('br'),
                // UI.createRow("j1_4",[
                //     UI.createCheckBox(
                //         `${await getString("1/4-joke")}`,'_1_4','_1_4box',
                //         ()=>{},ElainaData.get("Dev-button"), "April fool` joke"
                //     )
                // ]),
                // UI.createRow("pandoru",[
                //     UI.createCheckBox(
                //         `${await getString("Santa")}`,'MC','MCbox',
                //         ()=>{},true,"Merry-Christmas"
                //     )
                // ]),
                // UI.createRow("buyallchamp",[
                //     UI.createCheckBox(
                //         `${await getString("buy-all-champs")}`,'byc','bycbox',
                //         ()=>{},true, "buy-all-champs"
                //     ),
                //     document.createElement('br'),
                //     UI.Dropdown(ChampsP, "ChampsPrice", `${await getString("prices")}`, "description", "Cost"),
                //     document.createElement('br')
                // ]),
                UI.createCheckBox(
                    `${await getString("auto-find-queue")}`,'autoq','autoqbox',
                    ()=>{
                        restartAfterChange('autoq', "Auto-Find-Queue")
                    },true, "Auto-Find-Queue"
                ),
                UI.createRow("Q-Delay",[
                    UI.createRow("Create-Delay",[
                        UI.createLabel(`${await getString("Create-Delay")}`, "Create-Delay-Text"),
                        UI.createSearchBox("Create-Delay"),
                    ]),
                    UI.createRow("Find-Delay",[
                        UI.createLabel(`${await getString("Find-Delay")}`, "Find-Delay-Text"),
                        UI.createSearchBox("Find-Delay")
                    ])
                ]),
                UI.Dropdown(ElainaData.get("queueList"), "Gamemode", `${await getString("Gamemode")}`, "description", "queueId"),
                document.createElement('br'),
                document.createElement('br'),
                UI.createCheckBox(await getString("invisible_banner"),'invbanner','invbannerbox',
                    ()=>{
                        restartAfterChange('invbanner', "invisible_banner")
                    },true, "invisible_banner"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("Custom-profile-hover")}`,'cusprf','cusprfbox',
                    ()=>{
                        restartAfterChange('cusprf', "Custom-profile-hover")
                    },true, "Custom-profile-hover"
                ),
                UI.createRowHideable("customprf", [
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-mastery-score")}`,'cusmastery','cusmasterybox',
                        ()=>{
                            restartAfterChange('cusmastery', "Custom-mastery-score")
                        },true, "Custom-mastery-score"
                    ),
                    document.createElement('br'),
                    UI.createSearchBox("Mastery-Score"),
                    document.createElement('br'),
                    UI.createRow("customrank_checkbox", [
                        UI.createCheckBox(
                            `${await getString("custom-rank-hover")}`,'cusrankhover','cusrankhoverbox',
                            ()=>{
                                restartAfterChange('cusrankhover', "Custom-rank")
                            },true, "Custom-rank"
                        ),
                        document.createElement('br'),
                        UI.createButton(await getString("refresh"), "refresh_option", async () => {
                            window.customRank()
                        })
                    ]),
                    UI.createRow("customrank_detail", [
                        UI.Dropdown(rank, "Ranked Queue ID", `${await getString("Ranked Queue")}`, "name", "id"),
                        document.createElement('br'),
                        UI.Dropdown(rank, "Ranked Tier ID", `${await getString("Ranked Tier")}`, "name", "id"),
                        document.createElement('br'),
                        UI.Dropdown(rank, "Ranked Division ID", `${await getString("Ranked Division")}`, "name", "id"),
                    ]),
                    UI.createCheckBox(
                        `${await getString("Custom-challenge-crystal")}`,'cuschalcry','cuschalcrybox',
                        ()=>{
                            restartAfterChange('cuschalcry',"Custom-challenge-crystal")
                        },true,"Custom-challenge-crystal"
                    ),
                    document.createElement('br'),
                    UI.createRow("customchallengecrystal", [
                        UI.Dropdown(rank, "Ranked Tier ID", `${await getString("challenge-rank")}`, "name", "id"),
                        UI.createLabel(`${await getString("challenge-point")}`, "challenge-point-Text"),
                        UI.createSearchBox("Challenge-Points"),
                    ]),
                    UI.createCheckBox(
                        `${await getString("custom-status")}`,'cussta','cusstabox',
                        ()=>{
                            if (ElainaData.get("Custom-Status")) {
                                if (window.confirm("This may cause some issues with the client's chat, are you sure you want to enable this plugins?")) {
                                    restartAfterChange('cussta',"Custom-Status")
                                }
                                else {
                                    let box: any = document.getElementById("cusstabox")
                                    box.checked = false
                                    ElainaData.set("Custom-Status", false)
                                    
                                }
                            }
                            else {
                                restartAfterChange('cussta',"Custom-Status")
                            }
                        },true,"Custom-Status"
                    ),
                    document.createElement('br'),
                    UI.createRow("customstatus", [
                        UI.createCheckBox(
                            `${await getString("Custom-Status-Local")}`,'cussta-local','cussta-localbox',
                            ()=>{
                                restartAfterChange('cussta-local',"Custom-Status-Local")
                            },true,"Custom-Status-Local"
                        ),
                        UI.createLabel(`${await getString("status-delay")}`, ""),
                        UI.createSearchBox("status-delay"),
                    ]),
                ]),
                UI.createRow("namespoof",[
                    UI.createCheckBox(
                        `${await getString("name-spoofer")}`,'namespf','namespfbox',
                        ()=>{
                            restartAfterChange('namespf',"Name-Spoofer")
                        },true,"Name-Spoofer"
                    ),
                    document.createElement('br'),
                    UI.createSearchBox("Spoof-name"),
                ]),
                UI.createCheckBox(
                    `${await getString("Debug-mode")}`,'debug','debugbox',
                    ()=>{
                        restartAfterChange('debug',"Debug-mode")
                    },ElainaData.get("Dev-button"),"Debug-mode"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("Developer-Mode")}`,'devbutton','devbuttonbox', ()=>{
                        restartAfterChange('devbutton',"Dev-mode")
                
                        if (!ElainaData.get("Dev-mode")) {}
                        else {
                            window.alert("You just turned on developer mode \nIf you are not a developer, please turn it off right now \nOtherwise the whole theme will not work properly")
                        }
                    },ElainaData.get("Dev-button"),"Dev-mode"
                ),
                document.createElement('br'),
            ])
        )

        let hideButtons = document.querySelectorAll("#elaina-theme-settings-row-hide-button");
        hideButtons.forEach((button: any) => {
            button.click()
        });
    }
    catch (err: any) {
        error("Error loading theme settings:", err);
    } finally {
        loading.remove();
    }
}

/*
UI.createCheckBox(
    `${await getString("")}`,'','box', ()=>{
        restartAfterChange(id ,datastore) // remove if dont need
    },true, datastore
),
document.createElement('br'),
*/

export { pluginsSettings }