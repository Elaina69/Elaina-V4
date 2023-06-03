import data from '../configs/ElainaV2_config.json'

let status = data["Custom-Status"]

if (DataStore.get("Custom-Status")) {
    let time
    if (status.length == 1) {time = 50000}
    else {time = 650*status.length}
    
    window.setInterval( async ()=> {
        for (let i = 0; i < status.length; i++) {
            const statusMessage = status[i]["lines"].slice().join("\\n")
            await fetch("/lol-chat/v1/me", {
                method :"PUT",
                headers:{"content-type":"application/json"},
                body   :`{"statusMessage":"${statusMessage}"}`
            })
        }
    },time)
}