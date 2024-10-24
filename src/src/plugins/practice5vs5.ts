import utils from '../utils/utils.ts'
const addPrac5 = (): void => {
    if (document.getElementById("prac-button")) {return}
    else {
        try{
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
            let gameBar: HTMLElement | null = document.querySelector(".parties-game-navs.ember-view")
            gameBar?.insertBefore(button, gameBar.children[1])
        }catch{}
    }
}
window.addEventListener("load", () => {
    if (!window.DataStore.get("aram-only")) {utils.routineAddCallback(addPrac5, ["rcp-fe-lol-parties"])}
})