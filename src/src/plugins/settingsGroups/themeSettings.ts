import { UI } from "./settingsUI.ts"
import { restartAfterChange } from "../settings.ts"
import utils from "../../utils/utils.ts";
import { error } from "../../utils/themeLog.ts";
import { del_webm_buttons, create_webm_buttons, applyHideAndShowTFTtab, setAudio, hideShowNavBar, changeHomePageStyle } from "../../theme/customUI/customHomepage.ts";

const FILE_REGEX = {
    Wallpaper: /\.(png|jpg|jpeg|gif|bmp|webp|ico|mp4|webm|mkv|mov|avi|wmv|3gp|m4v)$/,
    Audio: /\.(mp3|flac|ogg|wav|aac)$/,
    Font: /\.(ttf|otf|woff|woff2)$/,
    Banner: /\.(png|jpg|jpeg|gif|bmp|webp|ico)$/,
};
    
async function themeSettings(panel: Element) {
    const loading = UI.createRow("loading", [
        UI.createLoading(await getString("settings-loading")),
    ])
    panel.appendChild(loading);

    try {
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
                    UI.createImage(true, "logo.png", "theme-settings-logo")
                ]),
                UI.createCheckBox(
                    `${await getString("AllowTrackingData")}`,'trackData','trackDatabox', ()=>{
                        restartAfterChange('trackData', "AllowTrackingData")
                    },true, "AllowTrackingData"
                ),
                document.createElement('br'),
                UI.createLabel(await getString("update-list-manually"), ""),
                UI.createRowHideable("add-background-manually-row", [
                    UI.createLabel(" ", "add-background-manual-message"),
                    ...await UI.createFileListRow("wallpaper", "Wallpaper-list", "manual-wallpaper-name", FILE_REGEX.Wallpaper),
                    ...await UI.createFileListRow("audio", "Audio-list", "manual-audio-name", FILE_REGEX.Audio),
                    ...await UI.createFileListRow("banner", "Banner-list", "manual-banner-name", FILE_REGEX.Banner),
                    ...await UI.createFileListRow("font", "Font-list", "manual-font-name", FILE_REGEX.Font),
                ]),
                UI.createLabel(await getString("wallpaper/audio-settings"), ""),
                UI.createRowHideable("background-settings",[
                    document.createElement('br'),
                    UI.createButton(await getString("open-background-folder"), "open-background-folder", () => { window.openPluginsFolder(`${ElainaData.get("Plugin-folder-name")}/assets/backgrounds`) }),
                    UI.createLabel(await getString("WallpaperAudio-timeUpdate"), ""),
                    UI.createSearchBox("WallpaperAudio-timeUpdate"),
                    document.createElement('br'),
                    UI.Slider(
                        await getString("wallpaper-volume"),ElainaData.get("wallpaper-volume"),"elaina-bg","wallpaper-volume"
                    ),
                    UI.createRow("changePlaybackRow",[
                        UI.createLabel(await getString("Wallpaper-Speed"), ""),
                        UI.createSpeedInput("Playback-speed"),
                        UI.createLabel("%","playback-percent"),
                    ]),
                    UI.createLabel("", "speed-check"),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("wallpaper-slideshow")}`,'wallpaperSlide','wallpaperSlidebox', 
                        ()=>{
                            restartAfterChange("wallpaperSlide", "wallpaper-slideshow")
                        },true, "wallpaper-slideshow"
                    ),
                    UI.createRow("slideTimeRow",[
                        UI.createLabel(await getString("change-slide-delay"),""),
                        UI.createSearchBox("wallpaper-change-slide-time"),
                    ]),
                    UI.Slider(
                        await getString("music-volume"),ElainaData.get("audio-volume"),"bg-audio","audio-volume"
                    ),
                    UI.createCheckBox(
                        `${await getString("turnoff-audio-ingame")}`,'offaudio','offaudiobox', 
                        ()=>{},true, "turnoff-audio-ingame"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Disable-Theme-Audio")}`,"disablethemeaudio","disablethemeaudiobox", ()=>{
                            let audioController: any = document.querySelector(".webm-bottom-buttons-container")
                            let audio: any = document.getElementById("bg-audio")
                    
                            if (!ElainaData.get("Disable-Theme-Audio")) {
                                setAudio()
                                audioController.style.display = "flex"
                            }
                            else {
                                audio.src = ''
                                audioController.style.display = "none"
                            }
                        },true, "Disable-Theme-Audio"
                    ),
                ]),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("prevent-manual-update")}`,'prvtup','prvtupbox',
                    ()=>{},true,"prevent-manual-update"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("holiday-message")}`,'holiday','holidaybox', ()=>{
                        restartAfterChange("holiday", "holiday-message")
                    }, true, "holiday-message"
                ),
                document.createElement('br'),
                document.createElement('br'),
                UI.createCheckBox(
                    await getString("sync-user-icons"),'syncusericons','syncusericonsbox', () => {
                        restartAfterChange('syncusericons', "sync-user-icons")
                    }, true, "sync-user-icons"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-homepage-navbar")}`,'homenav','homenavbox', ()=>{
                        hideShowNavBar()
                        changeHomePageStyle()
                    }, true, "hide-homepage-navbar"
                ),
                document.createElement('br'),
                // UI.createCheckBox(
                //     `${await getString("custom-navbar-css")}`,'cusnavcss','cusnavcssbox', ()=>{
                //         restartAfterChange("cusnavcss","custom-navbar-css")
                //     },true, "custom-navbar-css"
                // ),
                // document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("old-prev/next-button")}`,"oldpnb","oldpnbbox",
                    ()=>{
                        del_webm_buttons()
                        create_webm_buttons()
                    },true, "old-prev/next-button"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("enable-hide-top-navbar-friendlist-button")}`,'hidetopnavfriend','hidetopnavfriendbox', 
                    ()=>{
                        restartAfterChange("hidetopnavfriend", "enable-hide-top-navbar-friendlist-button")
                    },true, "enable-hide-top-navbar-friendlist-button"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("sidebar-transparent")}`,'sbt','sbtbox', 
                    ()=>{
                        restartAfterChange("sbt", "sidebar-transparent")
                    },true, "sidebar-transparent"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("lobby-transparent-filter")}`,'ltf','ltfbox', 
                    ()=>{
                        restartAfterChange("ltf", "lobby-transparent-filter")
                    },true, "lobby-transparent-filter"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("settings-dialogs-transparent")}`,'stdiat','stdiatbox',
                    ()=>{
                        restartAfterChange("stdiat","settings-dialogs-transparent")
                    },true, "settings-dialogs-transparent"
                ),
                document.createElement('br'),
                UI.createCheckBox(await getString("hide-profile-background"), "hideprfbg", "hideprfbgbox", 
                    ()=>{
                        restartAfterChange("hideprfbg", "hide-profile-background")
                    }, true, "hide-profile-background"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-champions-splash-art")}`,'hidechampart','hidechampartbox',
                    ()=>{
                        restartAfterChange('hidechampart', "hide-champions-splash-art")
                    },true, "hide-champions-splash-art"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-vertical-lines")}`,"hidevl","hidevlbox",
                    ()=>{
                        restartAfterChange("hidevl", "hide-vertical-lines")
                    },true, "hide-vertical-lines"
                ),
                document.createElement('br'),
                UI.createRow("Custom-Curency",[
                    UI.createRow("custom-rp",[
                        UI.createCheckBox(
                            `${await getString("custom-rp")}`,'cusrp','cusrpbox',
                            ()=>{
                                restartAfterChange('cusrp', "Custom_RP")
                            },true, "Custom_RP"
                        ),
                        document.createElement('br'),
                        UI.createSearchBox("RP-data")
                    ]),
                    UI.createRow("custom-be",[
                        UI.createCheckBox(
                            `${await getString("custom-be")}`,'cusbe','cusbebox',
                            ()=>{
                                restartAfterChange('cusbe', "Custom_BE")
                            },true, "Custom_BE"
                        ),
                        document.createElement('br'),
                        UI.createSearchBox("BE")
                    ])
                ]),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("custom-rank-name")}`,'cusrankname','cusranknamebox',
                    ()=>{
                        restartAfterChange('cusrankname', "Custom-Rank-Name")
                    },true, "Custom-Rank-Name"
                ),
                document.createElement('br'),
                UI.createSearchBox("Rank-line1"),
                UI.createSearchBox("Rank-line2"),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("custom-font")}`,'cusfont','cusfontbox',
                    ()=>{
                        if (!ElainaData.get("Custom-Font")) {
                            document.querySelector("#Custom-font")?.remove()
                        }
                        else {
                            utils.addFont(ElainaData.get("Font-folder")+ElainaData.get("CurrentFont"),"Custom-font","Custom")
                        }
                    },true, "Custom-Font"
                ),
                document.createElement('br'),
                UI.DropdownCustomFont(),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("change-nickname-color")}`,'nicknamecolor','nicknamecolorbox', ()=>{     
                        if (!ElainaData.get("change-nickname-color")) {
                            document.getElementById("nickname-color-css")?.remove()
                        }
                        else {
                            utils.addStyleWithID("nickname-color-css", /*css*/`
                                span.player-name__force-locale-text-direction, #nickname-color-preview {
                                    color: ${ElainaData.get("nickname-color-with-opacity")};
                                }
                            `)
                        }
                    },true, "change-nickname-color"
                ),
                UI.createRowHideable("change-nickname-color-row", [
                    document.createElement('br'),
                    UI.createRow("nickname-color-with-text", [
                        UI.colorPicker("nickname-color", "nickname-color", () => {
                            let input: any = document.getElementById("nickname-color")
            
                            ElainaData.set("nickname-color", input.value)
                            ElainaData.set("nickname-color-with-opacity", input.value + ElainaData.get("nickname-opacity"))
        
                            let color: any = document.getElementById("nickname-color-text")
                            color.innerHTML = ElainaData.get("nickname-color-with-opacity")
            
                            if (ElainaData.get("change-nickname-color")) {
                                document.getElementById("nickname-color-css")?.remove()
            
                                utils.addStyleWithID("nickname-color-css", /*css*/`
                                    span.player-name__force-locale-text-direction, #nickname-color-preview {
                                        color: ${ElainaData.get("nickname-color-with-opacity")};
                                    }
                                `)
                            }
                        }),
                        UI.createLabel(ElainaData.get("nickname-color-with-opacity"), "nickname-color-text"),
                        UI.createLabel(`${await getString("preview")}: `, "nickname-color-preview-label"),
                        UI.createLabel(
                            // @ts-ignore
                            document.querySelector(".rcp-fe-lol-social .player-name__force-locale-text-direction")?.textContent, 
                            "nickname-color-preview"
                        )
                    ]),
                    UI.opacitySlider("change-nickname-opacity", await getString("opacity"), "nickname-opacity", async ()=> {
                        let origin: any = document.getElementById("change-nickname-opacity")
                        let title: any = document.getElementById("change-nickname-opacity-title")
        
                        ElainaData.set("nickname-opacity", Math.round(origin.value / 100 * 255).toString(16).padStart(2, '0'))
                        ElainaData.set("nickname-color-with-opacity", ElainaData.get("nickname-color")+ElainaData.get("nickname-opacity"))
        
                        title.innerHTML = `${await getString("opacity")}: ${origin.value}%`
        
                        let color: any = document.getElementById("nickname-color-text")
                        color.innerHTML = ElainaData.get("nickname-color-with-opacity")
        
                        if (ElainaData.get("change-nickname-color")) {
                            document.getElementById("nickname-color-css")?.remove()
        
                            utils.addStyleWithID("nickname-color-css", /*css*/`
                                span.player-name__force-locale-text-direction, #nickname-color-preview {
                                    color: ${ElainaData.get("nickname-color-with-opacity")};
                                }
                            `)
                        }
                    }),
                ]),
                UI.createCheckBox(
                    `${await getString("animate-loading")}`,'aniload','aniloadbox',
                    ()=>{},true, "animate-loading"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("custom-icon")}`,'cusicon','cusiconbox',
                    ()=>{
                        restartAfterChange('cusicon', "Custom-Icon")
                    },true, "Custom-Icon"
                ),
                UI.createRowHideable("Custom-icon-list",[
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Loading-Icon")}`,'cusloadicon','cusloadiconbox',
                        ()=>{
                            restartAfterChange('cusloadicon', "Custom-Loading-Icon")
                        },true, "Custom-Loading-Icon"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("custom-avatar")}`,'cusav','cusavbox',
                        ()=>{
                            restartAfterChange('cusav', "Custom-Avatar")
                        },true, "Custom-Avatar"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Border")}`,'cusbor','cusborbox',
                        ()=>{
                            restartAfterChange('cusbor', "Custom-Border")
                        },true, "Custom-Border"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Regalia-Banner")}`,'cusregabnr','cusregabnrbox',
                        ()=>{
                            restartAfterChange('cusregabnr', "Custom-Regalia-Banner")
                        },true, "Custom-Regalia-Banner"
                    ),
                    document.createElement('br'),
                    UI.createRow("Custom-banner-row", [
                        UI.DropdownCustomBanner()
                    ]),
                    UI.createCheckBox(
                        `${await getString("Custom-Hover-card-backdrop")}`,'cushvbdrop','cushvbdropbox',
                        ()=>{
                            restartAfterChange('cushvbdrop', "Custom-Hover-card-backdrop")
                        },true, "Custom-Hover-card-backdrop"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-RP-Icon")}`,'cusrpi','cusrpibox',
                        ()=>{
                            restartAfterChange('cusrpi', "Custom-RP-Icon")
                        },true, "Custom-RP-Icon"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-BE-Icon")}`,'cusbei','cusbeibox',
                        ()=>{
                            restartAfterChange('cusbei', "Custom-BE-Icon")
                        },true, "Custom-BE-Icon"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Rank-Icon")}`,'cusranki','cusrankibox',
                        ()=>{
                            restartAfterChange('cusranki', "Custom-Rank-Icon")
                        },true, "Custom-Rank-Icon"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Emblem")}`,'cusemi','cusemibox',
                        ()=>{
                            restartAfterChange('cusemi',"Custom-Emblem")
                        },true, "Custom-Emblem"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Clash-banner")}`,'cusclassb','cusclassbbox',
                        ()=>{
                            restartAfterChange('cusclassb', "Custom-Clash-banner")
                        },true, "Custom-Clash-banner"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Trophy")}`,'custrophy','custrophybox',
                        ()=>{
                            restartAfterChange('custrophy', "Custom-Trophy")
                        },true, "Custom-Trophy"
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString('Custom-Gamemode-Icon')}`,'cusgameicon','cusgameiconbox',
                        ()=>{
                            restartAfterChange('cusgameicon', 'Custom-Gamemode-Icon')
                        },true, 'Custom-Gamemode-Icon'
                    ),
                    document.createElement('br'),
                    UI.createCheckBox(
                        `${await getString("Custom-Ticker")}`,'custick','custickbox',
                        ()=>{
                            restartAfterChange('custick', "Custom-Ticker")
                        },true, "Custom-Ticker"
                    ),
                    document.createElement('br')
                ]),
                UI.createCheckBox(
                    `${await getString("custom-runes-bg")}`,'rsbg','rsbgbox',
                    ()=>{
                        restartAfterChange('rsbg', "Runes-BG")
                    }, true, "Runes-BG"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    await getString("custom-champs-image"), 'cuschampimg', 'cuschampimgbox',
                    () => {
                        restartAfterChange('cuschampimg', "custom-champs-image")
                    }, true, "custom-champs-image"
                ),
                document.createElement('br'),
                // UI.createCheckBox(
                //     `${await getString("custom-cursor")}`,'cuscursor','cuscursorbox',
                //     ()=>{},true, "Custom-Cursor"
                // ),
                // UI.createLabel(
                //     `*${await getString("note")}: ${await getString("note-2")}`
                // ),
                // document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-theme-usage-time")}`,'hideusetime','hideusetimebox',
                    ()=>{},true,"hide-theme-usage-time"
                ),
                document.createElement('br'),
                // UI.createCheckBox(
                //     `${await getString("hide-overview")}`,'hideovertab','hideovertabbox',
                //     ()=>{
                //         applyHideAndShowtab(true)
                //     },true,"hide-overview"
                // ),
                // document.createElement('br'),
                // UI.createCheckBox(
                //     `${await getString("hide-merch")}`,'hidemerchtab','hidemerchtabbox',
                //     ()=>{
                //         applyHideAndShowtab(true)
                //     },true,"hide-merch"
                // ),
                // document.createElement('br'),
                // UI.createCheckBox(
                //     `${await getString("hide-patch-note")}`,'hidepn','hidepnbox',
                //     ()=>{
                //         applyHideAndShowtab(true)
                //     },true,"hide-patch-note"
                // ),
                // document.createElement('br'),
                // UI.createCheckBox(
                //     `${await getString("hide-esport")}`,'hideesptab','hideesptabbox',
                //     ()=>{
                //         applyHideAndShowtab()
                //     },true, "hide-esport"
                // ),
                // document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-tft-match-history")}`,'hidetftmhtab','hidetftmhtabbox',
                    ()=>{
                        applyHideAndShowTFTtab()
                    },true, "hide-tft-match-history"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-tft-news")}`,'hidetftntab','hidetftntabbox',
                    ()=>{
                        applyHideAndShowTFTtab()
                    },true, "hide-tft-news"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-tft-rotational-shop")}`,'hidetftrstab','hidetftrstabbox',
                    ()=>{
                        applyHideAndShowTFTtab()
                    },true, "hide-tft-rotational-shop"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-tft-troves")}`,'hidetfttrovestab','hidetfttrovestabbox',
                    ()=>{
                        applyHideAndShowTFTtab()
                    },true, "hide-tft-troves"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-tft-battle-pass")}`,'hidetftbattletab','hidetftbattletabbox',
                    ()=>{
                        applyHideAndShowTFTtab()
                    }, true, "hide-tft-battle-pass"
                ),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("hide-tft-home")}`,'hidetfthometab','hidetfthometabbox',
                    ()=>{
                        applyHideAndShowTFTtab()
                    },true, "hide-tft-home"
                ),
                document.createElement('br'),
                document.createElement('br'),
                UI.createCheckBox(
                    `${await getString("NSFW-Content")}`,'nsfw','nsfwbox',
                    ()=>{},true, "NSFW-Content"
                ),
                document.createElement('br'),
                document.createElement('br'),
                // UI.createCheckBox(
                //     `${await getString("Change-CDN-version")}`,'cdnver','cdnverbox', ()=>{
                //         restartAfterChange('cdnver', "Change-CDN-version")
                //     },DataStore.get("Dev-button"),"Change-CDN-version"
                // ),
                // document.createElement('br'),
                // UI.DropdownCDNversion(),
                // document.createElement('br'),
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
        restartAfterChange(id, datastore)
    },true, datastore
),
document.createElement('br'),
*/

export { themeSettings }