import * as upl from 'pengu-upl'
import list from "../config/champsBgList.js"
import { log } from "../utils/themeLog.js"
import { getThemeName } from '../otherThings.js'

let datapath = `//plugins/${getThemeName()}/`
let bgInterval: number

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
        let thumbnail = document.getElementsByClassName("champion-thumbnail")
        let champSetRow = document.querySelectorAll(".champion-set-row .champion-border")
        let champSelectList = document.querySelectorAll(".champion-grid-champion-thumbnail")
    
        if (!thumbnail) return
        else {
            for (let i = 0; i < thumbnail.length; i++) {
                let nameElements = document.getElementsByClassName("champion-name");
                if (!(nameElements[i] instanceof HTMLElement)) continue; // Ensure it's an HTMLElement
                let name = nameElements[i] as HTMLElement;
        
                for (let j = 0; j < list.length; j++) {
                    if (name.innerText === list[j]["default_name"]) {
                        let championImage = thumbnail[i].querySelector(".champion-image");
                        if (championImage instanceof HTMLImageElement) {
                            championImage.setAttribute("src", `${datapath}assets/champs/${list[j]["image_preview"]}`);
                        }
                        name.innerText = list[j]["replace_name"];
                    }
                }
            }
        }
    
        if (!champSetRow) return
        else {
            for (let i = 0; i < champSetRow.length; i++) {
                for (let j = 0; j < list.length; j++) {
                    let img = champSetRow[i].querySelector("img");
                    if (img && img.getAttribute("src")?.includes(list[j]["default_icon_id"].toString())) {
                        img.setAttribute("src", `${datapath}assets/champs/${list[j]["image_thumbnail"]}`);
                    }
                }
            }
        }
    
        if (!champSelectList) return
        else {
            for (let i = 0; i < champSelectList.length; i++) {
                for (let j = 0; j < list.length; j++) {
                    let img = champSetRow[i].querySelector("img");
                    if (img && img.getAttribute("src")?.includes(list[j]["default_icon_id"].toString())) {
                        img.setAttribute("src", `${datapath}assets/champs/${list[j]["image_thumbnail"]}`);
                    }
                }
            }
        }
    },200)
    
    upl.observer.subscribeToElementCreation(".lockup-champion-name",(element: any)=>{
        bgInterval = window.setInterval(()=>{
            for(let j = 0; j < list.length; j++) {
                if (element.textContent.replace(/\n\s*/g, '') == list[j]["default_name"] || element.textContent.replace(/\n\s*/g, '') == list[j]["replace_name"]){
                    element.textContent = list[j]["replace_name"]
                    element.parentNode.querySelector(".lockup-champion-title").textContent = list[j]["replace_sub_name"]
    
                    let a: HTMLElement|null = document.querySelector("lol-uikit-section[section-id='cdp_overview'] .cdp-backdrop-img")
                    let b: HTMLElement|null = document.querySelector("lol-uikit-section[section-id='cdp_progression'] .cdp-backdrop-img")
    
                    if (a) {
                        a?.setAttribute("src", `${datapath}assets/champs/${list[j]["image"]}`)
                        a.style.cssText = `left: ${list[j]["css-left"]}`
                    }
                    if (b) {
                        b?.setAttribute("src", `${datapath}assets/champs/${list[j]["image"]}`)
                        b.style.cssText = `left: ${list[j]["css-left"]}`
                    }
    
                    let defaultSkin = document.querySelector(".uikit-background-switcher.ember-view > img")
                    let skinName = document.querySelector(".champion-skin-name.skin-name")
                    if (document.querySelector(".cdp-skins-section.ember-view > lol-uikit-section-controller[selected-item='skin_0']")) {
                        defaultSkin?.setAttribute("src", `${datapath}assets/champs/${list[j]["image"]}`)
                        if (skinName) skinName.textContent = list[j]["replace_name"]
                    }
    
                    let bio = document.querySelector(".cdp-overview-short-bio")
                    if (bio && list[j]["lore"] != "") {
                        bio.innerHTML = list[j]["lore"]
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