import * as upl from "pengu-upl"
import utils from "../utils/utils"
import { getThemeName } from "../otherThings"
import { log, error } from "../utils/themeLog"

export class HideFriendList {
    freezeProperties(object: Object, properties: string[]): void {
        for (const type in object) {
            if ((properties && properties.length && properties.includes(type)) || (!properties || !properties.length)) {
                let value = object[type]
                try {
                    Object.defineProperty(object, type, {
                        configurable: false,
                        get: () => value,
                        set: (v) => v,
                    })
                } 
                catch {}
            }
        }
    }

    createSidebarBackground = () => {
        let sidebarBG = document.createElement("div")
        sidebarBG.setAttribute("class", "sidebar-background")
        let sideBar = document.querySelector(".rcp-fe-viewport-sidebar > .screen-root")

        sideBar?.prepend(sidebarBG)
    }

    createButton = () => {
        let friendsActionbar = document.querySelector("#rcp-fe-viewport-root")

        let buttonDiv = document.createElement("div")
        let button = document.createElement("img")

        buttonDiv.setAttribute("class", "hideFriendslist")

        buttonDiv.addEventListener('click', () => {
            if (ElainaData.get("HideFriendList")) {
                ElainaData.set("HideFriendList", false)
            }
            else {
                ElainaData.set("HideFriendList", true)
            }

            this.buttonShowHideFriendlist(ElainaData.get("HideFriendList"))
            this.showHideFriendslist(ElainaData.get("HideFriendList"))
        })

        friendsActionbar?.append(buttonDiv)
        buttonDiv.append(button)
    }

    buttonShowHideFriendlist = (hide: boolean) => {
        let buttonDiv:any = document.querySelector(".hideFriendslist")
        let button = document.querySelector(".hideFriendslist > img")

        if (!hide) {
            button?.setAttribute("src", `//plugins/${getThemeName()}/assets/icon/plugins-icons/next_button.png`)
            buttonDiv.style.cssText = `transform: translateX(0px);`
        }
        else {
            buttonDiv.style.cssText = `transform: translateX(225px);`
            button?.setAttribute("src", `//plugins/${getThemeName()}/assets/icon/plugins-icons/prev_button.png`)
        }
    }

    showHideFriendslist = (hide: boolean) => {
        let elements = [
            document.querySelector(".lol-social-lower-pane-container"),
            document.querySelector(".sidebar-background"),
            document.querySelector(".alpha-version-panel"),
            document.querySelector("lol-parties-game-info-panel"),
            document.querySelector(".clash-social-persistent.ember-view"),
            document.querySelector(".watermark")
        ];
        
        let translateValue = hide ? "225px" : "0px";
        
        elements.forEach((element: any) => {
            if (element) {
                element.style.cssText = `transform: translateX(${translateValue});`;
            }
            else { error("Get error while adding style, but it will not affect entire theme.") }
        });
        
        this.centerViewport(hide);
    }

    centerViewport = (hide: boolean) => {
        if (!hide) {
            try {
                document.querySelector("#centerViewport")?.remove();
            } 
            catch {}
            utils.addStyleWithID("centerViewport", `
                div[data-screen-name=social] > .social-plugin-home > .ember-view {
                    height: 100% !important;
                }
                .parties-game-type-select-wrapper.ember-view,
                .parties-custom-game-setup.ember-view ,
                .custom-game-list.ember-view,
                .v2-footer-component.ember-view,
                .parties-point-eligibility-custom.ember-view,
                .custom-game-teams.ember-view,
                .arrow-footer.ember-view > div,
                .parties-invite-dropzone,
                .party-members-container,
                .tft-cards-container,
                .tft-footer-container.ember-view,
                .multiteam-lobby-root__scrollable-wrapper,
                .career-postgame-progression-component, 
                .postgame-root-component .postgame-footer,
                .career-postgame-sub-navigation-component,
                .postgame-root-component .postgame-progression-lottie-outline,
                .scoreboard-root-content-container,
                .emote-wheel-wrapper-v2,
                .emote-root-component .nav-container,
                .emote-delete-slot,
                .emote-reaction-wrapper  {
                    transform: translateX(0px) !important;
                }
            `)
        } 
        else {
            try {
                document.querySelector("#centerViewport")?.remove();
            } 
            catch {}
            utils.addStyleWithID("centerViewport", `
                div[data-screen-name=social] > .social-plugin-home > .ember-view {
                    height: 0% !important;
                }
                .parties-game-type-select-wrapper.ember-view,
                .parties-custom-game-setup.ember-view ,
                .custom-game-list.ember-view,
                .v2-footer-component.ember-view,
                .parties-point-eligibility-custom.ember-view,
                .custom-game-teams.ember-view,
                .arrow-footer.ember-view > div,
                .parties-invite-dropzone,
                .party-members-container,
                .tft-cards-container,
                .tft-footer-container.ember-view,
                .multiteam-lobby-root__scrollable-wrapper,
                .career-postgame-progression-component, 
                .postgame-root-component .postgame-footer,
                .career-postgame-sub-navigation-component,
                .postgame-root-component .postgame-progression-lottie-outline,
                .scoreboard-root-content-container,
                .emote-wheel-wrapper-v2,
                .emote-root-component .nav-container,
                .emote-delete-slot,
                .emote-reaction-wrapper  {
                    transform: translateX(113px) !important;
                }
            `)
        }
    }

    showHideButton = () => {
        let pageListenner = async (node: any) => {   
            let previous_page = '';   
            const pagename = node.getAttribute("data-screen-name");
            const isOtherPage = !["rcp-fe-lol-champ-select"].includes(pagename);
        
            if (pagename === "rcp-fe-lol-champ-select") {
                // log("Hide button")
                try {
                    let button: any = document.querySelector(".hideFriendslist")
                    button.style.display = "none"
                }
                catch {}
            } 
            else if (isOtherPage && document.querySelector(".hideFriendslist")) {
                // log("Show button")
                try {
                    let button: any = document.querySelector(".hideFriendslist")
                    button.style.display = "block"
                }
                catch {}
            }
            if (previous_page !== pagename) previous_page = pagename;
        };
        
        utils.mutationObserverAddCallback(pageListenner, ["screen-root"]);
    }

    main = () => {
        this.showHideButton()
        upl.observer.subscribeToElementCreation(".actions-bar > .buttons", (element: any) => {
            if (document.querySelector(".sidebar-background")) return

            // just make sure
            try {
                let bg: any = document.getElementsByClassName("sidebar-background")
                if (bg.length > 1) {
                    for (let i = 0; i < bg.length; i++) {
                        bg[i].remove()
                    }
                }
            } 
            catch {}

            this.createSidebarBackground()
        })
        upl.observer.subscribeToElementCreation(".sidebar-background", (element: any) => {
            if (document.querySelector(".hideFriendslist")) return

            // just make sure
            try {
                let button: any = document.getElementsByClassName("hideFriendslist")
                if (button.length > 1) {
                    for (let i = 0; i < button.length; i++) {
                        button[i].remove()
                    }
                }
            } 
            catch {}

            if (ElainaData.get("enable-hide-top-navbar-friendlist-button")) {
                this.createButton()
                this.buttonShowHideFriendlist(ElainaData.get("HideFriendList"))
                this.showHideFriendslist(ElainaData.get("HideFriendList"))
            }
        })
    }
}