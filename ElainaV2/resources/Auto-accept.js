import utils from './_utilselaina';
import data from"../configs/ElainaV2_config.json";
import lang from '../configs/Language.json'

let auto_accept = data["auto_accept"]

let queue_accepted = false 
let player_declined = false 

function autoAcceptQueueButton(){
	let element = document.getElementById("autoAcceptQueueButton")
	if (element.attributes.selected != undefined) {
		auto_accept = false
		element.removeAttribute("selected")
	}
	else {
		element.setAttribute("selected", "true")
		auto_accept = true
	}
}

window.autoAcceptQueueButton = autoAcceptQueueButton


let autoAcceptCallback = async message => {
	utils.phase = JSON.parse(message["data"])[2]["data"]
	if (utils.phase == "ReadyCheck" && auto_accept && !queue_accepted) {
		await acceptMatchmaking(),
		queue_accepted = true
	}
	else if (utils.phase != "ReadyCheck") {
		queue_accepted = false
	}
}

function fetch_or_create_champselect_buttons_container() {
	if (document.querySelector(".cs-buttons-container")) {
		return document.querySelector(".cs-buttons-container")
	}
	else {
		const div = document.createElement("div")

		div.className = "cs-buttons-container"
		document.querySelector(".v2-footer-notifications.ember-view").append(div)
		return div
	}
}

let autoAcceptMutationObserver = (mutations) => {
	if (document.querySelector(".v2-footer-notifications.ember-view") != null && document.getElementById("autoAcceptQueueButton") == null) {
		let newOption = document.createElement("lol-uikit-radio-input-option");
		let container = fetch_or_create_champselect_buttons_container()
	
		newOption.setAttribute("id", "autoAcceptQueueButton");
		newOption.setAttribute("onclick", "window.autoAcceptQueueButton()");

		let Option2 = document.createElement("div");
			Option2.classList.add("auto-accept-button-text");

		newOption.append(Option2)

		if (auto_accept){
			newOption.setAttribute("selected", "");
		}

		
//___________________________________________________________________________//
		let VN = document.querySelector("html").lang == "vi-VN"
		let JP = document.querySelector("html").lang == "ja-JP"
		let PL = document.querySelector("html").lang == "pl-PL"
		let RU = document.querySelector("html").lang == "ru-RU"

		if (VN) {
			Option2.innerHTML = lang.VN["auto_accept"]
		}
		else if (JP) {
			Option2.innerHTML = lang.JP["auto_accept"]
		}
		else if (PL) {
			Option2.innerHTML = lang.PL["auto_accept"]
		}
		else if (RU) {
			Option2.innerHTML = lang.RU["auto_accept"]
		}
		else {
			Option2.innerHTML = lang.EN["auto_accept"]
		}
//___________________________________________________________________________//


		container.append(newOption);
	}
}

window.addEventListener('load', () => {
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', autoAcceptCallback)
	utils.routineAddCallback(autoAcceptMutationObserver, ["v2-footer-notifications.ember-view"])
})

let acceptMatchmaking = async () => {
	if (player_declined) return;
	await fetch('/lol-matchmaking/v1/ready-check/accept', { method: 'POST' })

}

window.addEventListener('load', () => {	
	console.log('By Elaina Da Catto');
	console.log('Meow ~~~');
	console.log(data["custom_log"]);
})
