import utils from "../utils/utils.ts"
import { cdnImport } from "../otherThings.ts"

const CONSOLE_STYLE = {
    prefix: '%c Elaina ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

const log = (message: string, ...args: string[]) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);

let filtersData = (await cdnImport(`//plugins/${window.getThemeName()}/config/filters.js`, "Can't import filters data")).default;

let nodeRemovedEvent = function (event: any) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let elainaBg = document.getElementById("elaina-bg")
		let elainaStaticBg: any = document.getElementById("elaina-static-bg");
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		if (!elainaBg || !viewportRoot) {return}
		viewportRoot.style.filter = "none"
		elainaBg.style.filter = filtersData["Homepage"]
		elainaStaticBg.style.filter = filtersData["Homepage"]
		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent)
	}
}

export class Filters {
	addFilter = async (node: any) => {
		let pagename: string = ""
		let previous_page: string = ""
		let elainaBg: HTMLElement | null = document.getElementById("elaina-bg");
		let elainaStaticBg: HTMLElement | null = document.getElementById("elaina-static-bg");
	
		const filtersDataMap = {
			"rcp-fe-lol-yourshop": "Yourshop",
			"rcp-fe-lol-home-main": "Homepage",
			"rcp-fe-lol-champ-select": "Champ-select",
			"rcp-fe-lol-store": "Store",
			"rcp-fe-lol-collections": "Collections",
			"rcp-fe-lol-profiles-main": "Profiles",
			"rcp-fe-lol-parties": "Parties",
			"rcp-fe-lol-loot": "Loot",
			"rcp-fe-lol-clash-full": "Clash",
			"rcp-fe-lol-postgame": "Postgame",
			"rcp-fe-lol-event-shop": "EventShop",
			"rcp-fe-lol-tft": "TFT"
		};
	
		const brightness_modifiers = [
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
		];
	
		pagename = node.getAttribute("data-screen-name");
		log(`%c${pagename}`, "color: #e4c2b3");
	
		if (elainaBg && elainaStaticBg) {
			if (filtersDataMap[pagename]) {
				elainaBg.style.filter = filtersData[filtersDataMap[pagename]];
				elainaStaticBg.style.filter = filtersData[filtersDataMap[pagename]];
			} 
			else if (brightness_modifiers.indexOf(previous_page) !== -1) {
				elainaBg.style.filter = filtersData["Homepage"];
				elainaStaticBg.style.filter = filtersData["Homepage"];
			}
			if (previous_page !== pagename) {
				previous_page = pagename;
			}
		}
		else { log(`Cannot set the filter`) }
	}

	main = () => {
		utils.mutationObserverAddCallback(this.addFilter, ["screen-root"])
		utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
			let phase = JSON.parse(message["data"])[2]["data"]
			if (phase == "GameStart" || phase == "InProgress") {
				let elainaBg: any = document.getElementById("elaina-bg");
				elainaBg.style.filter = filtersData["Gamestart"]
			}
		})
	}
}