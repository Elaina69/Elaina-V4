import text from "../configs/Custom-Status.txt?raw"

if (DataStore.get("Custom-Status") && DataStore.get("Custom-profile-hover")) {
    let time
    let i = 0
    let statusMessage = JSON.stringify(text)
        statusMessage = statusMessage.replaceAll("\n", "\\n")
        statusMessage = statusMessage.replaceAll("\r", "\\r")
        statusMessage = statusMessage.replaceAll("\"", "")

    let MultiStatus   = statusMessage.split("\\r\\n(end status)\\r\\n")

    if   (MultiStatus.length == 1) {time = 100000}
    else {time = DataStore.get("status-delay")}
    
    window.setInterval( async ()=> {
        if   (i == MultiStatus.length - 1) {i = 0}
        else {i++}

        await fetch("/lol-chat/v1/me", {
            method :"PUT",
            headers:{"content-type":"application/json"},
            body   : `{"statusMessage": "${MultiStatus[i]}"}`
        }) 
    },time)
}