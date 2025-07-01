import { UI } from "./settingsUI.ts"
import { restartAfterChange, error } from "../settings.ts"

async function pluginsSettings(panel) {
    const loading = UI.Row("loading", [
        UI.Loading(await getString("settings-loading")),
    ])
    panel.appendChild(loading);
    
    try {
        const rank = {
            "Ranked Queue ID": [
                {
                    "id" : 0, 
                    "name": `${await getString("Ranked Solo 5vs5")}`, 
                    "Option": "RANKED_SOLO_5x5",
                },
                {
                    "id" : 1, 
                    "name": `${await getString("Ranked Flex Summoner's Rift")}`, 
                    "Option": "RANKED_FLEX_SR",
                },
                {
                    "id" : 2, 
                    "name": `${await getString("Ranked Flex TT")}`,
                    "Option": "RANKED_FLEX_TT", 
                },
                {
                    "id" : 3, 
                    "name": `${await getString("Ranked TFT")}`, 
                    "Option": "RANKED_TFT",
                },
                {
                    "id" : 4, 
                    "name": `${await getString("Ranked TFT TURBO")}`, 
                    "Option": "RANKED_TFT_TURBO",
                },
                {
                    "id" : 5, 
                    "name": `${await getString("Ranked TFT DOUBLE UP")}`, 
                    "Option": "RANKED_TFT_DOUBLE_UP",
                },
                {
                    "id" : 6, 
                    "name": `${await getString("Ranked TFT PAIRS")}`, 
                    "Option": "RANKED_TFT_PAIRS",
                },
                {
                    "id" : 7, 
                    "name": `${await getString("Arena")}`, 
                    "Option": "CHERRY"
                }
            ],
        
            "Ranked Tier ID": [
                {
                    "id" : 0, 
                    "name": `${await getString("Iron")}`,
                    "Option": "IRON",
                },
                {
                    "id" : 1, 
                    "name": `${await getString("Bronze")}`,
                    "Option": "BRONZE",
                },
                {
                    "id" : 2, 
                    "name": `${await getString("Silver")}`,
                    "Option": "SILVER",
                },
                {
                    "id" : 3, 
                    "name": `${await getString("Gold")}`,
                    "Option": "GOLD",
                },
                {
                    "id" : 4, 
                    "name": `${await getString("Platinum")}`,
                    "Option": "PLATINUM",
                },
                {
                    "id" : 5, 
                    "name": `${await getString("Diamond")}`,
                    "Option": "DIAMOND",
                },
                {
                    "id" : 6,
                    "name": `${await getString("Emerald")}`,
                    "Option": "EMERALD",
                },
                {
                    "id" : 7, 
                    "name": `${await getString("Master")}`,
                    "Option": "MASTER",
                },
                {
                    "id" : 8, 
                    "name": `${await getString("Grand-Master")}`,
                    "Option": "GRANDMASTER",
                },
                {
                    "id" : 9, 
                    "name": `${await getString("Challenger")}`,
                    "Option": "CHALLENGER"
                }
            ],
        
            "Ranked Division ID": [
                {
                    "id" : 0, 
                    "name": "I"
                },
                {
                    "id" : 1, 
                    "name": "II"
                },
                {
                    "id" : 2, 
                    "name": "III"
                },
                {
                    "id" : 3, 
                    "name": "IV"
                }
            ]
        }

        panel.prepend(
            UI.Row("",[
                UI.Row("Info",[
                    UI.Row("Info-div",[
                        UI.Link(
                            'ElainaV4',
                            'https://github.com/Elaina69/Elaina-V4',
                            () => {},
                            "theme-link"
                        ),  
                        UI.Label(
                        `*${await getString("note")}: ${await getString("note-1")}`, ""
                        ),
                    ]),
                    UI.Image("logo.png", "plugins-settings-logo")
                ]),
                UI.Label(
                    `${await getString("plugins-settings")}`, ""
                ),
                UI.CheckBox(
                    `${await getString("old-ll-settings")}`,'oldll','oldllbox',
                    ()=>{
                        restartAfterChange('oldll',"Old-League-Loader-Settings")
                    },true,"Old-League-Loader-Settings"
                ),
                document.createElement('br'),
                UI.Row("loothelp",[
                    UI.CheckBox(
                        `${await getString("loot-helper")}`,'lh','lhbox',
                        ()=>{
                            restartAfterChange('lh', "loot-helper")
                        },true, "loot-helper"
                    )
                ]),
                UI.CheckBox(
                    `${await getString("auto_accept_button")}`,'autoacceptbutton','autoacceptbuttonbox',
                    ()=>{
                        if (!ElainaData.get("auto_accept_button")) {
                            document.getElementById("autoAcceptQueueButton")?.remove()
                        }
                    },true,"auto_accept_button"
                ),
                document.createElement('br'),
                UI.CheckBox(
                    `${await getString("dodge-button")}`, "dodgebutton", "dodgebuttonbox",
                    () => {
                        restartAfterChange("dodgebutton", "dodge-button")
                    },true, "dodge-button"
                ),
                document.createElement('br'),
                UI.CheckBox(
                    `${await getString("Enable-Invite-Fr")}`,'invfr','invfrbox',
                    ()=>{},true, "Enable-Invite-Fr"
                ),
                document.createElement('br'),
                UI.CheckBox(
                    `${await getString("aram-only")}`, "Aram only", "Aram only checkbox",
                    () => {
                        restartAfterChange("Aram only", "aram-only")
                    },true, "aram-only"
                ),
                document.createElement('br'),
                // UI.Row("j1_4",[
                //     UI.CheckBox(
                //         `${await getString("1/4-joke")}`,'_1_4','_1_4box',
                //         ()=>{},ElainaData.get("Dev-button"), "April fool` joke"
                //     )
                // ]),
                // UI.Row("pandoru",[
                //     UI.CheckBox(
                //         `${await getString("Santa")}`,'MC','MCbox',
                //         ()=>{},true,"Merry-Christmas"
                //     )
                // ]),
                // UI.Row("buyallchamp",[
                //     UI.CheckBox(
                //         `${await getString("buy-all-champs")}`,'byc','bycbox',
                //         ()=>{},true, "buy-all-champs"
                //     ),
                //     document.createElement('br'),
                //     UI.Dropdown(ChampsP, "ChampsPrice", `${await getString("prices")}`, "description", "Cost"),
                //     document.createElement('br')
                // ]),
                UI.CheckBox(
                    `${await getString("auto-find-queue")}`,'autoq','autoqbox',
                    ()=>{
                        restartAfterChange('autoq', "Auto-Find-Queue")
                    },true, "Auto-Find-Queue"
                ),
                UI.Row("Q-Delay",[
                    UI.Row("Create-Delay",[
                        UI.Label(`${await getString("Create-Delay")}`, "Create-Delay-Text"),
                        UI.Input("Create-Delay"),
                    ]),
                    UI.Row("Find-Delay",[
                        UI.Label(`${await getString("Find-Delay")}`, "Find-Delay-Text"),
                        UI.Input("Find-Delay")
                    ])
                ]),
                UI.Dropdown(ElainaData.get("queueList"), "Gamemode", `${await getString("Gamemode")}`, "description", "queueId"),
                document.createElement('br'),
                document.createElement('br'),
                UI.CheckBox(await getString("invisible_banner"),'invbanner','invbannerbox',
                    ()=>{
                        restartAfterChange('invbanner', "invisible_banner")
                    },true, "invisible_banner"
                ),
                document.createElement('br'),
                UI.CheckBox(
                    `${await getString("Custom-profile-hover")}`,'cusprf','cusprfbox',
                    ()=>{
                        restartAfterChange('cusprf', "Custom-profile-hover")
                    },true, "Custom-profile-hover"
                ),
                UI.RowHideable("customprf", [
                    document.createElement('br'),
                    UI.CheckBox(
                        `${await getString("Custom-mastery-score")}`,'cusmastery','cusmasterybox',
                        ()=>{
                            restartAfterChange('cusmastery', "Custom-mastery-score")
                        },true, "Custom-mastery-score"
                    ),
                    document.createElement('br'),
                    UI.Input("Mastery-Score"),
                    document.createElement('br'),
                    UI.Row("customrank_checkbox", [
                        UI.CheckBox(
                            `${await getString("custom-rank-hover")}`,'cusrankhover','cusrankhoverbox',
                            ()=>{
                                restartAfterChange('cusrankhover', "Custom-rank")
                            },true, "Custom-rank"
                        ),
                        // UI.Button(await getString("Refresh"), "refresh_option", async () => {
                        //     let requestRank = {
                        //         "lol": {
                        //             "rankedLeagueQueue"    : rank["Ranked Queue ID"][DataStore.get("Ranked Queue ID")]["Option"],
                        //             "rankedLeagueTier"     : rank["Ranked Tier ID"][DataStore.get("Ranked Tier ID")]["Option"],
                        //             "rankedLeagueDivision" : rank["Ranked Division ID"][DataStore.get("Ranked Division ID")]["name"]
                        //         }
                        //     }
                        //     await fetch("/lol-chat/v1/me", {
                        //         method: "PUT",
                        //         headers: {"content-type": "application/json"},
                        //         body: JSON.stringify(requestRank)
                        //     })
                        // })
                    ]),
                    UI.Row("customrank_detail", [
                        UI.Dropdown(rank, "Ranked Queue ID", `${await getString("Ranked Queue")}`, "name", "id"),
                        document.createElement('br'),
                        UI.Dropdown(rank, "Ranked Tier ID", `${await getString("Ranked Tier")}`, "name", "id"),
                        document.createElement('br'),
                        UI.Dropdown(rank, "Ranked Division ID", `${await getString("Ranked Division")}`, "name", "id"),
                    ]),
                    UI.CheckBox(
                        `${await getString("Custom-challenge-crystal")}`,'cuschalcry','cuschalcrybox',
                        ()=>{
                            restartAfterChange('cuschalcry',"Custom-challenge-crystal")
                        },true,"Custom-challenge-crystal"
                    ),
                    document.createElement('br'),
                    UI.Row("customchallengecrystal", [
                        UI.Dropdown(rank, "Ranked Tier ID", `${await getString("challenge-rank")}`, "name", "id"),
                        UI.Label(`${await getString("challenge-point")}`, "challenge-point-Text"),
                        UI.Input("Challenge-Points"),
                    ]),
                    UI.CheckBox(
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
                    UI.Row("customstatus", [
                        UI.CheckBox(
                            `${await getString("Custom-Status-Local")}`,'cussta-local','cussta-localbox',
                            ()=>{
                                restartAfterChange('cussta-local',"Custom-Status-Local")
                            },true,"Custom-Status-Local"
                        ),
                        UI.Label(`${await getString("status-delay")}`, ""),
                        UI.Input("status-delay"),
                    ]),
                ]),
                UI.Row("namespoof",[
                    UI.CheckBox(
                        `${await getString("name-spoofer")}`,'namespf','namespfbox',
                        ()=>{
                            restartAfterChange('namespf',"Name-Spoofer")
                        },true,"Name-Spoofer"
                    ),
                    document.createElement('br'),
                    UI.Input("Spoof-name"),
                ]),
                UI.CheckBox(
                    `${await getString("Debug-mode")}`,'debug','debugbox',
                    ()=>{
                        restartAfterChange('debug',"Debug-mode")
                    },ElainaData.get("Dev-button"),"Debug-mode"
                ),
                document.createElement('br'),
                UI.CheckBox(
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
UI.CheckBox(
    `${await getString("")}`,'','box', ()=>{
        restartAfterChange(id ,datastore) // remove if dont need
    },true, datastore
),
document.createElement('br'),
*/

export { pluginsSettings }