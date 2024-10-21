async function forceJungle() {
    await fetch("/lol-champ-select/v1/session/my-selection", {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"spell1Id\":11,\"spell2Id\":4}",
        "method": "PATCH",
    });
}

async function forceLane() {
    await fetch("/lol-champ-select/v1/session/my-selection", {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"spell1Id\":7,\"spell2Id\":4}",
        "method": "PATCH",
    });
}

window.addEventListener("keydown", async (event)=>{
    let key = event.key
    if (event.altKey && key=="j") {forceJungle()}
    if (event.altKey && key=="l") {forceLane()}
})