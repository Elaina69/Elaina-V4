import data from '../configs/ElainaV2_config.json'
if (data["Custom-Status"]) {
    const statusMessage = data["lines"].slice().join("\\n")

    await fetch("/lol-chat/v1/me", {
        method :"PUT",
        headers:{"content-type":"application/json"},
        body   :`{"statusMessage":"${statusMessage}"}`
    })
}