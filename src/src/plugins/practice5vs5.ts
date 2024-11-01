import * as upl from 'pengu-upl'

if (!window.DataStore.get("aram-only")) {
    upl.observer.subscribeToElementCreation(".parties-game-navs.ember-view", (element: any)=> {
        if (document.getElementById("prac-button")) return
        else {
            let button = document.createElement("lol-uikit-flat-button")
            button.id = "prac-button"
            button.textContent = "5v5 Practice"
            button.style.marginRight = "10px"
            button.onclick = async (): Promise<void> => {
                await fetch('/lol-lobby/v2/lobby', {
                    method: 'POST',
                    body: JSON.stringify(
                        {"customGameLobby":{"configuration":{"gameMode":"PRACTICETOOL","gameMutator":"","gameServerRegion":"","mapId":11,"mutators":{"id":1},"spectatorPolicy":"AllAllowed","teamSize":5},"lobbyName":"Elaina Practice room","lobbyPassword":null},"isCustom":true}
                    ),
                    headers: {'Content-Type': 'application/json'}
                })
            }
            element.insertBefore(button, element.children[1])
        }
    })
}