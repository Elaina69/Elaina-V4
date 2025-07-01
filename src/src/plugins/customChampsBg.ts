import * as upl from 'pengu-upl'
import { log } from "../utils/themeLog.js"
import { getThemeName, cdnImport } from '../otherThings.js'

let datapath = `//plugins/${getThemeName()}/`
let bgInterval: number

const list = (await cdnImport(`${datapath}config/champsBgList.js`, "Can't import custom champion data")).default;

function updateDefaultSkinThumbnails(selector, img) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        const defaultSkinThumbnail = element.querySelector("div");
        if (defaultSkinThumbnail && defaultSkinThumbnail.style.backgroundImage.includes("tile_0")) {
            defaultSkinThumbnail.style.backgroundImage = img;
        }
    });
}

if (ElainaData.get("custom-champs-image")) {
    window.setInterval(()=>{
        const thumbnails = document.getElementsByClassName("champion-thumbnail");
        const nameContainers = document.getElementsByClassName("champion-name-container");

        for (let i = 0; i < thumbnails.length; i++) {
            const nameContainer = nameContainers[i];
            if (!nameContainer) continue;
            const championNameElement = nameContainer.querySelector(".champion-name") as HTMLElement;
            const championImage = thumbnails[i].querySelector(".champion-image") as HTMLImageElement;
            if (!championNameElement || !championImage) continue;

            const cleanName = championNameElement.innerText.replace(/\s+/g, '').toLowerCase();
            const champData = list.find(
                champ =>
                    cleanName === champ.default_name.replace(/\s+/g, '').toLowerCase() ||
                    cleanName === champ.replace_name.replace(/\s+/g, '').toLowerCase()
            );

            if (champData) {
                if (championImage.style.content !== `url(${datapath}assets/champs/${champData.image_preview})`) {
                    championImage.style.content = `url(${datapath}assets/champs/${champData.image_preview})`;
                }
                if (!nameContainer.querySelector("#champion-name-replace")) {
                    let newName = document.createElement("p");
                    newName.classList.add("champion-name");
                    newName.id = "champion-name-replace";
                    newName.innerText = champData.replace_name;

                    nameContainer.append(newName);
                    championNameElement.style.display = "none";
                    log(`Replaced ${champData.default_name} with ${champData.replace_name}`);
                }
            } else {
                const replacedName = nameContainer.querySelector("#champion-name-replace");
                if (replacedName) {
                    championImage.style.removeProperty("content");
                    championNameElement.style.removeProperty("display");
                    replacedName.remove();
                    log(`Restored ${championNameElement.innerText}`);
                }
            }
        }
    
        const champSetRow = document.querySelectorAll(".champion-set-row .champion-border");
        champSetRow.forEach(border => {
            const img = border.querySelector("img");
            if (!img) return;
            const champData = list.find(champ =>
                img.getAttribute("src")?.includes(champ.default_icon_id.toString())
            );
            if (champData) {
                img.setAttribute("src", `${datapath}assets/champs/${champData.image_thumbnail}`);
            }
        });

        const champSelectList = document.querySelectorAll(".champion-grid-champion-thumbnail");
        champSelectList.forEach(thumbnail => {
            const img = thumbnail.querySelector("img");
            if (!img) return;
            const champData = list.find(champ =>
                img.getAttribute("src")?.includes(champ.default_icon_id.toString())
            );
            if (champData) {
                img.setAttribute("src", `${datapath}assets/champs/${champData.image_thumbnail}`);
            }
        });
    },100)
    
    upl.observer.subscribeToElementCreation(".lockup-champion-name",(element: any)=>{
        bgInterval = window.setInterval(()=>{
            for(let j = 0; j < list.length; j++) {
                if (element.textContent.replace(/\n\s*/g, '') == list[j]["default_name"] || element.textContent.replace(/\n\s*/g, '') == list[j]["replace_name"]){
                    element.textContent = list[j]["replace_name"]
                    element.parentNode.querySelector(".lockup-champion-title").textContent = list[j]["replace_sub_name"]
    
                    // Overview tab
                    let overview: HTMLElement|null = document.querySelector("lol-uikit-section[section-id='cdp_overview'] .cdp-backdrop-img")
                    if (overview) {
                        let bio = document.querySelector(".cdp-overview-short-bio")
                        if (bio && list[j]["lore"] != "") {
                            bio.innerHTML = list[j]["lore"]
                        }

                        overview?.setAttribute("src", `${datapath}assets/champs/${list[j]["image"]}`)
                        overview.style.cssText = `left: ${list[j]["css-left"]}`
                    }

                    // Mastery tab
                    let mastery: HTMLElement|null = document.querySelector("lol-uikit-section[section-id='cdp_mastery'] .cdp-backdrop-img")
                    if (mastery) {
                        mastery?.setAttribute("src", `${datapath}assets/champs/${list[j]["image"]}`)
                        mastery.style.cssText = `left: ${list[j]["css-left"]}`
                    }
                    
                    // Progression tab
                    let progression: HTMLElement|null = document.querySelector("lol-uikit-section[section-id='cdp_progression'] .cdp-backdrop-img")
                    if (progression) {
                        progression?.setAttribute("src", `${datapath}assets/champs/${list[j]["image"]}`)
                        progression.style.cssText = `left: ${list[j]["css-left"]}`
                    }
    
                    // Skins tab
                    let defaultSkin = document.querySelector(".uikit-background-switcher.ember-view > img")
                    let skinName = document.querySelector(".champion-skin-name.skin-name")
                    if (document.querySelector(".cdp-skins-section.ember-view > lol-uikit-section-controller[selected-item='skin_0']")) {
                        defaultSkin?.setAttribute("src", `${datapath}assets/champs/${list[j]["image"]}`)
                        if (skinName) skinName.textContent = list[j]["replace_name"]
                    }
    
                    updateDefaultSkinThumbnails(".carousel-track-container .buffer-wrapper", `url(${datapath}assets/champs/${list[j]["image_thumbnail"]})`);
                    updateDefaultSkinThumbnails(".carousel-track-container .thumbnail-wrapper", `url(${datapath}assets/champs/${list[j]["image_thumbnail"]})`);
                }
            }
        }, 100)
    })
    
    upl.observer.subscribeToElementDeletion(".lockup-champion-name",(element)=>{
        window.clearInterval(bgInterval)
        log("cleared Interval!")
    })
}