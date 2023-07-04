import utils from '../_utilselaina';

let lang
let queue_accepted = false 
let player_declined = false 

try{let res = await fetch(`https://cdn.statically.io/gh/Elaina69/Elaina-V2/main/configs/Language.js`)
if (res.status==200) {lang = (await (() => import(`https://cdn.statically.io/gh/Elaina69/Elaina-V2/main/configs/Language.js`))()).default}}catch{}

function autoAcceptQueueButton(){
	let element = document.getElementById("autoAcceptQueueButton")
	if (element.attributes.selected != undefined) {
		DataStore.set("auto_accept", false)
		element.removeAttribute("selected")
	}
	else {
		element.setAttribute("selected", "true")
		DataStore.set("auto_accept", true)
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

let autoAcceptCallback = async message => {
	utils.phase = JSON.parse(message["data"])[2]["data"]
	if (utils.phase == "ReadyCheck" && DataStore.get("auto_accept") && !queue_accepted) {
		await acceptMatchmaking(),
		queue_accepted = true
	}
	else if (utils.phase != "ReadyCheck") {
		queue_accepted = false
	}
}

let acceptMatchmaking = async () => {
	if (player_declined) return;
	await fetch('/lol-matchmaking/v1/ready-check/accept', { method: 'POST' })
}

let autoAcceptMutationObserver = (mutations) => {
	if (document.querySelector(".v2-footer-notifications.ember-view") != null && document.getElementById("autoAcceptQueueButton") == null) {
		const langCode= document.querySelector("html").lang
		const langMap = lang.langlist
		let newOption = document.createElement("lol-uikit-radio-input-option")
		let container = fetch_or_create_champselect_buttons_container()
		let Option2   = document.createElement("div")
	
		newOption.setAttribute("id", "autoAcceptQueueButton")
		newOption.setAttribute("onclick", "window.autoAcceptQueueButton()")

		Option2.classList.add("auto-accept-button-text")
		Option2.innerHTML = lang[langMap[langCode] || "EN"]["auto_accept"]
		if (DataStore.get("auto_accept")){
			newOption.setAttribute("selected", "")
		}
		
		container.append(newOption)
		newOption.append(Option2)
	}
}

window.autoAcceptQueueButton = autoAcceptQueueButton

window.addEventListener('load', () => {
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', autoAcceptCallback)
	utils.routineAddCallback(autoAcceptMutationObserver, ["v2-footer-notifications.ember-view"])
})