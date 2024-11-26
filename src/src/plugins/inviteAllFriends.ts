import * as upl from "pengu-upl"
import { log } from "../utils/themeLog";

export class InviteAllFriends {
    setDefaultFriendsListData = () => {
        if (!window.DataStore.has("frGroupName")) {
            window.DataStore.set("frGroupName", 0)
        }
        if (!window.DataStore.has("grouplist")) {
            window.DataStore.set("grouplist", [])
        }
        if (!window.DataStore.has("friendslist")) {
            window.DataStore.set("friendslist", [])
        }
    }

    refreshFriendsList = async () => {
        try {
            let CurrentGroup = document.querySelector("div.lol-social-lower-pane-container .roster-block")?.querySelectorAll("lol-social-roster-group").length
            let CurrentFriend = document.querySelector("div.lol-social-lower-pane-container .roster-block")?.querySelectorAll("lol-social-roster-member").length

            if (window.DataStore.get("grouplist").length != CurrentGroup || window.DataStore.get("friendslist").length != CurrentFriend) {
                let friends: any[] = []
                let groups: any[] = []
                let a: any[] = await (await fetch('/lol-chat/v1/friends')).json()
                let b: any[] = await (await fetch('/lol-chat/v1/friend-groups')).json()
                for (let i = 0; i < a.length; i++) {
                    friends.push({"summonerId": a[i]["summonerId"],"groupId": a[i]["groupId"],"availability": a[i]["availability"]})
                }
                for (let i = 0; i < b.length; i++) {
                    groups.push({"id": b[i]["id"],"name": b[i]["name"]})
                }
                window.DataStore.set("friendslist", friends)
                window.DataStore.set("grouplist", groups)
                
                // delete invite all button if exist and create new one
                document.getElementById("inviteAllDiv")?.remove()
                this.addInviteAllButton()

                log("Friends list refreshed.")
            }
        }
        catch{}
    }

    addInviteAllButton = async (): Promise<void> => {
        if (document.querySelector(".lobby-header-buttons-container") != null) {
            let groupList: { name: string[]; id: string[] } = {"name":[],"id":[]}

            for(let i = 0; i < window.DataStore.get("grouplist").length ; i++) {
                groupList["id"].push(window.DataStore.get("grouplist")[i]["id"])
                groupList["name"].push(window.DataStore.get("grouplist")[i]["name"])
            }

            const mainDiv = document.createElement("div")
            mainDiv.id = "inviteAllDiv"
            mainDiv.style.display = "flex"

            let button = document.createElement("lol-uikit-flat-button")
            button.textContent = "Invite all"
            button.onclick = async () => {
                let Invited = 0
                let fakerun = new Promise(() => {})
                window.Toast.promise(fakerun, {
                    loading: 'Inviting all...',
                    success: "",
                    error: ""
                })

                for(let i = 0; i < window.DataStore.get("friendslist").length ; i++) {
                    //let invalidAvail = ["offline","dnd","mobile"]

                    if (window.DataStore.get("frGroupName") == window.DataStore.get("friendslist")[i]["groupId"]) {
                        let invite = await fetch("/lol-lobby/v2/lobby/invitations",{
                            method: 'POST',
                            headers: {"content-type": "application/json"},
                            body: JSON.stringify([{"toSummonerId": window.DataStore.get("friendslist")[i]["summonerId"]}])
                        })
                        if (invite.status == 200 /*&& !invalidAvail.includes(DataStore.get("friendslist")[i]["availability"])*/) Invited++
                    }
                }

                window.Toast.success(`Invited ${Invited} friends`)
            }

            let div = document.createElement("div")
            div.classList.add("Dropdown-div")

            let dropdown = document.createElement("lol-uikit-framed-dropdown")
            dropdown.classList.add("lol-settings-general-dropdown")
            dropdown.style.cssText = "margin-right: 10px; width: 198px;"

            for (let i = 0; i < groupList["id"].length; i++) {
                let el = document.createElement("lol-uikit-dropdown-option")

                el.setAttribute("slot", "lol-uikit-dropdown-option")
                el.innerText = groupList["name"][i]
                el.onclick = () => {
                    window.DataStore.set("frGroupName", groupList["id"][i])
                }

                if (window.DataStore.get("frGroupName") == groupList["id"][i]) {
                    el.setAttribute("selected", "true")
                }
                dropdown.appendChild(el)
            }

            div.append(dropdown)
            mainDiv.append(div,button)

            let gameBar = document.querySelector(".lobby-header-buttons-container")
            if (!document.querySelector("#inviteAllDiv")) {
                gameBar?.insertBefore(mainDiv, gameBar.children[1])
            }
        }
    }

    main = () => {
        this.setDefaultFriendsListData()
        let refreshList: any

        upl.observer.subscribeToElementCreation(".v2-header-component.ember-view", (element: any) => {
            this.addInviteAllButton()

            refreshList = window.setInterval(()=> {
                this.refreshFriendsList()
            }, 1000)
        })

        upl.observer.subscribeToElementDeletion(".v2-header-component.ember-view", (element: any) => {
            clearInterval(refreshList)
        })
    }
}