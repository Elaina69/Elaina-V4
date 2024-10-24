async function exitClient(): Promise<void>{
    await fetch("/process-control/v1/process/quit",
        {method:"POST"}
    )
}

async function dodgeQueue(): Promise<void>{
    await fetch('/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=["","teambuilder-draft","quitV2",""]',
        {body:'["","teambuilder-draft","quitV2",""]',method:"POST"}
    )
}

async function generateDodgeAndExitButton(t: HTMLElement | null): Promise<void>{
    const e=document.createElement("div"),
          o=document.createElement("div")
    
        o.setAttribute("class","dodge-button-container"),
        o.setAttribute("style","position: absolute;right: 0px;bottom: 57px;display: flex;align-items: flex-end;"),

        e.setAttribute("class","quit-button ember-view"),
        e.setAttribute("onclick","window.dodgeQueue()"),
        e.setAttribute("id","dodgeButton")

    const d=document.createElement("lol-uikit-flat-button")
        d.innerHTML = await getString("dodge")

        e.appendChild(d),
        o.appendChild(e),

    t?.parentNode?.insertBefore(o,t)
}

import utils from '../utils/utils.ts';

window.exitClient = exitClient,
window.dodgeQueue = dodgeQueue;

let addDodgeAndExitButtonObserver = (): void => {
    "ChampSelect" == utils.phase &&
    document.querySelector(".bottom-right-buttons") &&
    !document.querySelector(".dodge-button-container") &&
    generateDodgeAndExitButton(document.querySelector(".bottom-right-buttons"))
};

window.addEventListener("load", () => {
    utils.routineAddCallback(addDodgeAndExitButtonObserver,["bottom-right-buttons"])
});