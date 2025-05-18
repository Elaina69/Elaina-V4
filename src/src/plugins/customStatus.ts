import { getThemeName } from "../otherThings"

const text = await (await fetch(`//plugins/${getThemeName()}/config/customStatus.txt`)).text()

export class CustomStatus {
    private i: number = 0

    sendCustomStatus = async () => {
        let statusMessage = JSON.stringify(text)
            statusMessage = statusMessage.replaceAll("\n", "\\n")
            statusMessage = statusMessage.replaceAll("\r", "\\r")
            statusMessage = statusMessage.replaceAll("\"", "")
        let MultiStatus = statusMessage.split("\\r\\n(end status)\\r\\n")

        if   (this.i == MultiStatus.length - 1) {this.i = 0}
        else {this.i++}
    
        await fetch("/lol-chat/v1/me", {
            method :"PUT",
            headers:{"content-type":"application/json"},
            body   : `{"statusMessage": "${MultiStatus[this.i]}"}`
        }) 
    }

    sendLocalStatus = async () => {
        const statusCard = document.querySelector('.hover-card-status-message')
        let MultiStatus = text.split("(end status)")

        if (statusCard) {
            if   (this.i == MultiStatus.length - 1) {this.i = 0}
            else {this.i++}

            statusCard.textContent = MultiStatus[this.i]
        }
    }

    main = () => {
        if (!ElainaData.get("Custom-Status-Local")) {
            window.setInterval(async ()=> {
                await this.sendCustomStatus()
            }, ElainaData.get("status-delay"))
        }
        else {
            window.setInterval(async ()=> {
                await this.sendLocalStatus()
            }, ElainaData.get("status-delay"))
        } 
    }
}