export function transparentLobby(context: any) {
    context.socket.observe('/lol-gameflow/v1/gameflow-phase',async (data: Object) => {
        if(data["data"] == "Matchmaking") {
            let a: any = document.getElementsByClassName("placeholder-invited-container")
            for (let i = 0; i< a.length; i++) {
                let div = document.createElement("div")
                div.classList.add("placeholder-invited-image")
                a[i].querySelector(".placeholder-invited-video").remove()
                a[i].append(div)
            }
        }
    })
}