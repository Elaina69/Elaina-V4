function get_status(){
    let t=document.querySelector(".availability-icon"),
        a=["dnd","chat","away","offline","mobile"];

    if(t)for(let e of a)
    if(t.classList.contains(e))
    return e;
    return"chat"
}

async function patchStatus(){
    await fetch(
        "/lol-chat/v1/me",
        {headers:{
            "content-type":"application/json"
        },
        body:`{"availability":"${covert_status}","lol":{"gameStatus":"outOfGame"}}`,method:"PUT"}
    )
}

import utils from './_utilselaina';

let covert_status="chat",

switch_between_status=async()=>{
    let t=get_status(),
        a="chat"==t?"mobile":"mobile"==t?"dnd":"dnd"==t?"away":"away"==t?"offline":"chat";
        
    console.log("pass 1"),
    await fetch(
        "/lol-chat/v1/me",
        {headers:{
            "content-type":"application/json"
        },
        body:`{"availability":"${a}"${"offline"==a||"away"==a?',"lol":{"gameStatus":"outOfGame"}':"dnd"==a?',"lol":{"gameStatus":"inGame"}':""}}`,method:"PUT"}
    ),

    document.querySelector(".availability-icon").classList.remove(t),
    document.querySelector(".availability-icon").classList.add(a),
    covert_status=a
};

window.switch_between_status=switch_between_status;

let champSelectPatchStatus=async t=>{
    let a=JSON.parse(t.data)[2].data;
    "ChampSelect"!=a||"offline"!=covert_status&&"away"!=covert_status||await patchStatus()
},

availabilityButtonMutationObserver=async t=>{
    let a=document.querySelector(".availability-hitbox:not(.offline-mode-available), .availability-hitbox:not([onclick])"),
        e=document.querySelectorAll(".availability-hitbox.offline-mode-available"),
        i=document.querySelector(".details .status-message.game-status");

    a&&(console.log(t),a.classList.add("offline-mode-available"),
    a.outerHTML=a.outerHTML,

    document.querySelector(".availability-hitbox").setAttribute("onclick","window.switch_between_status()")),
    i&&"offline"==covert_status&&await patchStatus(),
    e.length>1&&e.forEach((t,a)=>{
        a&&t.remove()
    })
};

window.addEventListener("load",()=>{
    utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase",champSelectPatchStatus),
    utils.routineAddCallback(availabilityButtonMutationObserver,["availability-hitbox","status-message"])
});