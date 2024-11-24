import * as upl from "pengu-upl"

export class HideFriendList {
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
        const friendList: any = document.querySelector(".list-content > .roster-block");
        const sideBar: any = document.querySelector(".rcp-fe-viewport-sidebar");
        const isTransparent = window.DataStore.get("sidebar-transparent");
    
        if (!friendList || !sideBar) return;
    
        friendList.style.display = hide ? "none" : "flex";
    
        if (!isTransparent) {
            const bgColor = hide 
                ? "var(--social-sidebar-bg-color-friendslist-hide)" 
                : "var(--social-sidebar-bg-color)";
            sideBar.style.cssText = `background: ${bgColor} !important`;
        }
    };

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