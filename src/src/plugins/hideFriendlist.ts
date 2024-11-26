import * as upl from "pengu-upl"
import utils from "../utils/utils"

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
                }catch {}
            }
        }
    }

    buttonShowHideFriendlist = (hide: boolean) => {
        let button = document.querySelector(".hideFriendslist > img")

        if (!hide) {
            button?.setAttribute("src", "//plugins/elainav4/assets/icon/plugins-icons/visible.png")
        }
        else button?.setAttribute("src", "//plugins/elainav4/assets/icon/plugins-icons/hide.png")
    }

    createButton = () => {
        let friendsActionbar = document.querySelector(".actions-bar > .buttons")

        let buttonDiv = document.createElement("div")
        let button = document.createElement("img")

        buttonDiv.setAttribute("class", "hideFriendslist")
        buttonDiv.style.cssText = `
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        `

        button.style.cssText = `
            width: 20px;
            height: 20px;
            filter: drop-shadow(0px 1000px 0 #c8aa6e);
            transform: translateY(-1000px);
            display: flex;
        `

        buttonDiv.addEventListener('mouseover', () => {
            button.style.filter = "drop-shadow(0px 1000px 0 #f0d6e2)"
        })
        buttonDiv.addEventListener('mouseout', () => {
            button.style.filter = "drop-shadow(0px 1000px 0 #c8aa6e)"
        })

        buttonDiv.addEventListener('click', () => {
            if (window.DataStore.get("HideFriendList")) {
                window.DataStore.set("HideFriendList", false)
            }
            else {
                window.DataStore.set("HideFriendList", true)
            }

            this.buttonShowHideFriendlist(window.DataStore.get("HideFriendList"))
            this.showHideFriendslist(window.DataStore.get("HideFriendList"))
        })

        friendsActionbar?.append(buttonDiv)
        buttonDiv.append(button)
    }

    showHideFriendslist = (hide: boolean) => {
        let friendList: any = document.querySelector(".list-content > .roster-block")
        let sideBar: any = document.querySelector(".rcp-fe-viewport-sidebar")

        if (!hide) {
            friendList.style.display = "flex"
            if (!window.DataStore.get("sidebar-transparent")) {
                try {
                    document.querySelector("#sideBarColor-hideFriendslist")?.remove()
                } catch {}
                utils.addStyleWithID("sideBarColor-hideFriendslist", `.rcp-fe-viewport-sidebar {\n\tbackground: var(--social-sidebar-bg-color) !important\n}`)
            }
        }
        else {
            friendList.style.display = "none"
            if (!window.DataStore.get("sidebar-transparent")) {
                try {
                    document.querySelector("#sideBarColor-hideFriendslist")?.remove()
                } catch {}
                utils.addStyleWithID("sideBarColor-hideFriendslist", `.rcp-fe-viewport-sidebar {\n\tbackground: var(--social-sidebar-bg-color-friendslist-hide) !important\n}`)
            }
        }
    }

    main = () => {
        upl.observer.subscribeToElementCreation(".actions-bar > .buttons", (element: any) => {
            if (document.querySelector(".hideFriendslist")) return

            // just make sure
            try {
                let button: any = document.getElementsByClassName("hideFriendslist")
                if (button.length > 1) {
                    for (let i = 0; i < button.length; i++) {
                        button[i].remove()
                    }
                }
            } catch {}

            this.createButton()
            this.buttonShowHideFriendlist(window.DataStore.get("HideFriendList"))
            this.showHideFriendslist(window.DataStore.get("HideFriendList"))
        })
    }
}