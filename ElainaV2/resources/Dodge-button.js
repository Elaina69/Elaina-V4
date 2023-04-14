async function exitClient(){
    await fetch("/process-control/v1/process/quit",
        {method:"POST"}
    )
}

async function dodgeQueue(){
    await fetch('/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=["","teambuilder-draft","quitV2",""]',
        {body:'["","teambuilder-draft","quitV2",""]',method:"POST"}
    )
}

function generateDodgeAndExitButton(t){
    const e=document.createElement("div"),
          o=document.createElement("div"),
          i=document.createElement("div");
    
        o.setAttribute("class","dodge-button-container"),
        o.setAttribute("style","position: absolute;right: 0px;bottom: 57px;display: flex;align-items: flex-end;"),

        e.setAttribute("class","quit-button ember-view"),
        e.setAttribute("onclick","window.dodgeQueue()"),
        e.setAttribute("id","dodgeButton"),

        i.setAttribute("class","quit-button ember-view"),
        i.setAttribute("onclick","window.exitClient()"),
        i.setAttribute("id","exitButton");

    const n=document.createElement("lol-uikit-flat-button"),
        d=document.createElement("lol-uikit-flat-button");


//___________________________________________________________________________//
        if (document.querySelector("html").lang == "vi-VN") {
            d.innerHTML="Hủy"; n.innerHTML="Thoát"
        }
        else if (document.querySelector("html").lang == "ja-JP") {
            d.innerHTML="やめる"; n.innerHTML="出口"
        }
        else {
            d.innerHTML="Dodge"; n.innerHTML="Exit"
        }  
//___________________________________________________________________________//
        
        
        e.appendChild(d),
        i.appendChild(n),
        o.appendChild(e),
        o.appendChild(i),
    
    console.log(o),

    t.parentNode.insertBefore(o,t)
}

import utils from './_utilselaina';

window.exitClient=exitClient,
window.dodgeQueue=dodgeQueue;

let addDodgeAndExitButtonObserver=t=>{
    "ChampSelect"==utils.phase&&document.querySelector(".bottom-right-buttons")&&!document.querySelector(".dodge-button-container")&&generateDodgeAndExitButton(
        document.querySelector(".bottom-right-buttons")
    )
};

window.addEventListener("load",()=>{
    utils.routineAddCallback(addDodgeAndExitButtonObserver,["bottom-right-buttons"])
});