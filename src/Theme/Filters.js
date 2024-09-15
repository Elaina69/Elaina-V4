import utils from "../utils/utils.js"
import filters from "../config/filters.js"

let eConsole 	= "%c Elaina "
let eCss 		= "color: #ffffff; background-color: #f77fbe"

let nodeRemovedEvent = function (event) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let elainaBg     = document.getElementById("elaina-bg")
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		if (!elainaBg || !viewportRoot) {return}
		viewportRoot.style.filter = "none"
		elainaBg.style.filter     = filters["Homepage"]
		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent)
	}
}

let addFilter = async (node) => {
    let pagename, previous_page
	let elaina_bg_elem = document.getElementById("elaina-bg")
	let brightness_modifiers = [
		"rcp-fe-lol-yourshop",
		"rcp-fe-lol-home-main",
		"rcp-fe-lol-champ-select",
		"rcp-fe-lol-store", 
		"rcp-fe-lol-collections", 
		"rcp-fe-lol-profiles-main",
		"rcp-fe-lol-parties", 
		"rcp-fe-lol-loot", 
		"rcp-fe-lol-clash-full",
		"rcp-fe-lol-postgame",
		"rcp-fe-lol-event-shop",
		"rcp-fe-lol-tft"
	]
    pagename = node.getAttribute("data-screen-name")
	console.log(eConsole+"%c "+pagename,eCss,"color: #e4c2b3")

    try {
		if (pagename == "rcp-fe-lol-home-main") {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-yourshop") {
			elaina_bg_elem.style.filter = filters["Yourshop"]
		}
		else if (previous_page == "rcp-fe-lol-yourshop" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-champ-select") {
			elaina_bg_elem.style.filter = filters["Champ-select"]
		}
		else if (previous_page == "rcp-fe-lol-champ-select" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-clash-full") {
			elaina_bg_elem.style.filter = filters["Clash"]
		}
		else if (previous_page == "rcp-fe-lol-clash-full" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-loot") {
			elaina_bg_elem.style.filter = filters["Loot"]
		}
		else if (previous_page == "rcp-fe-lol-loot" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-store") {
			elaina_bg_elem.style.filter = filters["Store"]
		}
		else if (previous_page == "rcp-fe-lol-store" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-collections") {
			elaina_bg_elem.style.filter = filters["Collections"]
		}
		else if (previous_page == "rcp-fe-lol-collections" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-postgame") {
			elaina_bg_elem.style.filter = filters["Postgame"]
		}
		else if (previous_page == "rcp-fe-lol-postgame" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-profiles-main") {	
			elaina_bg_elem.style.filter = filters["Profiles"]
		}
		else if (previous_page == "rcp-fe-lol-profiles-main" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-parties") {
			elaina_bg_elem.style.filter = filters["Parties"]
		}
		else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (pagename == "rcp-fe-lol-tft") {
			elaina_bg_elem.style.filter = filters["TFT"]
		}
		else if (previous_page == "rcp-fe-lol-tft" && brightness_modifiers.indexOf(pagename) == -1) {
			elaina_bg_elem.style.filter = filters["Homepage"]
		}
		if (previous_page != pagename) {previous_page = pagename}
	}
	catch { console.log(eConsole+"%c Cannot set the filter",eCss,"")}
}

window.addEventListener("load",() => {
    utils.mutationObserverAddCallback(addFilter, ["screen-root"])
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]
		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("elaina-bg").style.filter = filters["Gamestart"]
		}
	})
})