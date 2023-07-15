import utils from './_utils.js'
import data from './configs/Filters.js'

let changeFilters = async (node) => {
    let pagename, previous_page
	let elaina_bg_elem = document.getElementById("elaina-bg")
	let brightness_modifiers = ["rcp-fe-lol-yourshop","rcp-fe-lol-home-main","rcp-fe-lol-champ-select", "rcp-fe-lol-store", "rcp-fe-lol-collections", "rcp-fe-lol-profiles-main",
								"rcp-fe-lol-parties", "rcp-fe-lol-loot", "rcp-fe-lol-clash-full","rcp-fe-lol-postgame","rcp-fe-lol-event-shop","rcp-fe-lol-tft"]

    pagename = node.getAttribute("data-screen-name")
	console.log(pagename)

    if (pagename == "rcp-fe-lol-home-main") {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		return
	}
	if (pagename == "rcp-fe-lol-yourshop") {
		elaina_bg_elem.style.filter = data["Yourshop"]
	}
	else if (previous_page == "rcp-fe-lol-yourshop" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-champ-select") {
		elaina_bg_elem.style.filter = data["Champ-select"]
	}
	else if (previous_page == "rcp-fe-lol-champ-select" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-clash-full") {
		elaina_bg_elem.style.filter = data["Clash"]
	}
	else if (previous_page == "rcp-fe-lol-clash-full" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-loot") {
		elaina_bg_elem.style.filter = data["Loot"]
	}
	else if (previous_page == "rcp-fe-lol-loot" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-store") {
		elaina_bg_elem.style.filter = data["Store"]
	}
	else if (previous_page == "rcp-fe-lol-store" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-collections") {
		elaina_bg_elem.style.filter = data["Collections"]
	}
	else if (previous_page == "rcp-fe-lol-collections" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-postgame") {
		elaina_bg_elem.style.filter = data["Postgame"]
	}
	else if (previous_page == "rcp-fe-lol-postgame" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-profiles-main") {		
		elaina_bg_elem.style.filter = data["Profiles"]	
	}
	else if (previous_page == "rcp-fe-lol-profiles-main" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-parties") {
		elaina_bg_elem.style.filter = data["Parties"]
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-tft") {
		elaina_bg_elem.style.filter = data["TFT"]
	}
	else if (previous_page == "rcp-fe-lol-tft" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (previous_page != pagename) {previous_page = pagename}
}
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', ()=> {
    utils.mutationObserverAddCallback(changeFilters, ["screen-root"])
    utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]
		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("elaina-bg").style.filter = data["Gamestart"]
		}
	})
})
//___________________________________________________________________________//