import utils from '../utils/utils.ts'
import * as upl from "pengu-upl"

async function exitClient(): Promise<void>{
    await fetch("/process-control/v1/process/quit",
        {method:"POST"}
    )
}

async function dodgeQueue(): Promise<void>{
    await fetch('/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=["","teambuilder-draft","quitV2",""]',
        {body:'["","teambuilder-draft","quitV2",""]',method:"POST"}
    )
    await fetch('/lol-lobby/v1/lobby/custom/cancel-champ-select',{method:"POST"})
}

async function generateDodgeAndExitButton(siblingDiv: HTMLElement | null): Promise<void>{
    const div = document.createElement("div");
	const parentDiv = document.createElement("div")

	parentDiv.setAttribute("class", "dodge-button-container")
	parentDiv.setAttribute("style", "position: absolute; right: 10px; bottom: 57px; display: flex; align-items: flex-end;")

	div.setAttribute("class", "quit-button ember-view");
	div.setAttribute("onclick", "window.dodgeQueue()")
	div.setAttribute("id", "dodgeButton");

	const button = document.createElement("lol-uikit-flat-button");
	button.innerHTML = await getString("dodge")
	
	div.appendChild(button);
	parentDiv.appendChild(div);

	siblingDiv?.parentNode?.insertBefore(parentDiv, siblingDiv)
}

upl.observer.subscribeToElementCreation(".bottom-right-buttons", (element: any) => {
    if (utils.phase == "ChampSelect" && element && !document.querySelector(".dodge-button-container")) {
        generateDodgeAndExitButton(element);
    }
})

window.exitClient = exitClient
window.dodgeQueue = dodgeQueue