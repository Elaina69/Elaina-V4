import utils from '../utils/utils.ts'
import { log } from '../utils/themeLog.ts';

let covert_status = "chat";

export class OfflineMode {
	get_status() {
		let element = document.querySelector(".availability-icon")
		let possible_status = ["dnd", "chat", "away", "offline", "mobile"]
	
		if (element) {
			for (let elem of possible_status){
				if (element.classList.contains(elem)){
					return elem
				}
			}
		}
		return "chat"
	}
	
	switch_between_status = async () => {
		let status = this.get_status()
		let availability = (status == "chat") ? "mobile" 
			: (status == "mobile") ? "dnd" 
			: (status == "dnd") ? "away" 
			: (status == "away") ? "offline" 
			: (status == "offline") ? "chat" 
			: "chat"
	
		log(`Changed status to ${availability}`)
		await fetch("/lol-chat/v1/me", {
			"headers": {
				"content-type": "application/json",
			},
			"body": `{\"availability\":\"${availability}\"${(availability == "offline" || availability == "away") ? `,\"lol\":{\"gameStatus\":\"outOfGame\"}` : (availability == "dnd") ? `,\"lol\":{\"gameStatus\":\"inGame\"}` : `` }}`,
			"method": "PUT",
		});
	
		document.querySelector(".availability-icon")?.classList.remove(status)
		document.querySelector(".availability-icon")?.classList.add(availability)
		covert_status = availability
	}
	
	async patchStatus(){
		await fetch("/lol-chat/v1/me", {
			"headers": {
				"content-type": "application/json",
			},
			"body": `{\"availability\":\"${covert_status}\",\"lol\":{\"gameStatus\":\"outOfGame\"}}`,
			"method": "PUT",
		});
	}
	
	champSelectPatchStatus = async message => {
		let phase = JSON.parse(message["data"])[2]["data"];
		if (phase == "ChampSelect" && (covert_status == "offline" || covert_status == "away")) {
			await this.patchStatus()
		}
	}

	main = () => {
		window.switch_between_status = this.switch_between_status

		let availabilityButtonMutationObserver = async () => {
			let circle_status = document.querySelector(".availability-hitbox:not(.offline-mode-available), .availability-hitbox:not([onclick])")
			let circle_status_custom = document.querySelectorAll(".availability-hitbox.offline-mode-available")
		
			if (circle_status) {
				circle_status.classList.add("offline-mode-available");
				circle_status.outerHTML = circle_status.outerHTML
				document.querySelector(".availability-hitbox")?.setAttribute("onclick", "window.switch_between_status()")
			}
			if (covert_status == "offline") {		
				await this.patchStatus();
			}
			if (circle_status_custom.length > 1){
				circle_status_custom.forEach((elem, index) => {
					if (index){
						elem.remove()
					}
				})
			}
		}

		utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", this.champSelectPatchStatus)
		utils.routineAddCallback(availabilityButtonMutationObserver, ["availability-hitbox", "status-message"])
	}
}