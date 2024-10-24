async function forceJungle(): Promise<void> {
    await fetch("/lol-champ-select/v1/session/my-selection", {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"spell1Id\":11,\"spell2Id\":4}",
        "method": "PATCH",
    });
}

async function forceLane(): Promise<void> {
    await fetch("/lol-champ-select/v1/session/my-selection", {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"spell1Id\":7,\"spell2Id\":4}",
        "method": "PATCH",
    });
}

window.addEventListener("keydown", async (event): Promise<void> => {
    let key: string = event.key
    if (event.altKey && key=="j") { await forceJungle() }
    if (event.altKey && key=="l") { await forceLane() }
})