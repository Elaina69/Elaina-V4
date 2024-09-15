if (DataStore.get("Enable-Invite-Fr")) {
    let routines = []

    if (!DataStore.has("frGroupName")) {
        DataStore.set("frGroupName", 0)
    }
    if (!DataStore.has("grouplist")) {
        DataStore.set("grouplist", [])
    }
    if (!DataStore.has("friendslist")) {
        DataStore.set("friendslist", [])
    }



    function routineAddCallback(callback, target) {
        routines.push({ "callback": callback, "targets": target })
    }

    window.setInterval(async ()=> {
        try {
            let CurrentGroup = document.querySelector("div.lol-social-lower-pane-container .roster-block").querySelectorAll("lol-social-roster-group").length
            let CurrentFriend = document.querySelector("div.lol-social-lower-pane-container .roster-block").querySelectorAll("lol-social-roster-member").length
            if (DataStore.get("grouplist").length != CurrentGroup || DataStore.get("friendslist").length != CurrentFriend) {
                let friends = []
                let groups = []
                let a = await (await fetch('/lol-chat/v1/friends')).json()
                let b = await (await fetch('/lol-chat/v1/friend-groups')).json()
                for (let i = 0; i < a.length; i++) {
                    friends.push({"summonerId": a[i]["summonerId"],"groupId": a[i]["groupId"],"availability": a[i]["availability"]})
                }
                for (let i = 0; i < b.length; i++) {
                    groups.push({"id": b[i]["id"],"name": b[i]["name"]})
                }
                DataStore.set("friendslist", friends)
                DataStore.set("grouplist", groups)
            
                document.getElementById("inviteAllDiv").remove()
                addInviteAllButton()
            }
        }catch{}
    },1000)

    let addInviteAllButton = async () => {
        if (document.querySelector(".lobby-header-buttons-container") != null) {
            let groupList = {"name":[],"id":[]}

            for(let i = 0; i < DataStore.get("grouplist").length ; i++) {
                groupList["id"].push(DataStore.get("grouplist")[i]["id"])
                groupList["name"].push(DataStore.get("grouplist")[i]["name"])
            }

            const mainDiv = document.createElement("div")
            mainDiv.id = "inviteAllDiv"
            mainDiv.style.display = "flex"

            let button = document.createElement("lol-uikit-flat-button")
            button.textContent = "Invite all"
            button.onclick = async () => {
                let Invited = 0
                let fakerun = new Promise(async () => { //uhh....
                    setTimeout(() => {if (true) {}})
                })
                Toast.promise(fakerun, {
                    loading: 'Inviting all...',
                    success: "",
                    error: ""
                })

                for(let i = 0; i < DataStore.get("friendslist").length ; i++) {
                    //let invalidAvail = ["offline","dnd","mobile"]

                    if (DataStore.get("frGroupName") == DataStore.get("friendslist")[i]["groupId"]) {
                        let invite = await fetch("/lol-lobby/v2/lobby/invitations",{
                            method: 'POST',
                            headers: {"content-type": "application/json"},
                            body: JSON.stringify([{"toSummonerId": DataStore.get("friendslist")[i]["summonerId"]}])
                        })
                        if (invite.status == 200 /*&& !invalidAvail.includes(DataStore.get("friendslist")[i]["availability"])*/) Invited++
                    }
                }

                Toast.success(`Invited ${Invited} friends`)
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
                    DataStore.set("frGroupName", groupList["id"][i])
                }

                if (DataStore.get("frGroupName") == groupList["id"][i]) {
                    el.setAttribute("selected", "true")
                }
                dropdown.appendChild(el)
            }

            div.append(dropdown)
            mainDiv.append(div,button)

            let gameBar = document.querySelector(".lobby-header-buttons-container")
            if (!document.querySelector("#inviteAllDiv")) {
                gameBar.insertBefore(mainDiv, gameBar.children[1])
            }
        }
    }

    window.addEventListener('load', () => {
        window.setInterval(() => {
            routines.forEach(routine => {
                routine.callback()
            })
        }, 1000)
        routineAddCallback(addInviteAllButton, ["v2-header-component.ember-view"])
    })
}