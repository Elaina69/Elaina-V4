/* By Elaina Da Catto */
/* Meow~~~ */


import utils from './resources/_utilselaina'


import LoadingScreen from './resources/LoadingScreen'
import homepage from './resources/CreateHomepage'
import homepagebutton from './resources/Homepagebuttons'
import watermark from './resources/Watermark'

import AudioExport from './resources/Audio'
import WallpaperExport from './resources/Wallpapers'

import './resources/LL-Settings'


import './addon-plugins/Hide_friendlist' 
import './addon-plugins/Aram-only'
import './addon-plugins/Auto-accept'
import './addon-plugins/Dodge-button'
import './addon-plugins/Offline-mode'


import data from './configs/ElainaV2_config.json'



//___________________________________________________________________________________________________________________________________________________________________________________________//
let default_settings = data
let previous_page;
let ranked_observer;
let patcher_go_to_default_home_page = true;
let wallpapers = default_settings["wallpaper_list"];
//___________________________________________________________________________//



//___________________________________________________________________________//
homepagebutton.apply_default_background()


var nodeRemovedEvent = function (event) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let elainaBg = document.getElementById("elaina-bg");
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		if (!elainaBg || !viewportRoot) {
			return;
		}
		viewportRoot.style.filter = "none"
		elainaBg.style.filter = "brightness(0.7) saturate(0.8)"

		document.querySelector(".app-controls-exit-dialog > div > video").setAttribute("src", default_settings["League_Loader_Settings-BG"])
		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent);
		// monitorPage()
	}
};
document.addEventListener("DOMNodeRemoved", nodeRemovedEvent);


let updateLobbyRegaliaBanner = async message => {
	let phase = JSON.parse(message["data"])[2]["data"];

	if (phase == "Lobby") {
		window.setInterval(() => {
			try {
				let base = document.querySelector("lol-regalia-parties-v2-element.regalia-loaded").shadowRoot.querySelector(".regalia-parties-v2-banner-backdrop.regalia-banner-loaded")

				base.shadowRoot.querySelector(".regalia-banner-asset-static-image").style.filter = "sepia(1) brightness(3.5) opacity(0.4)"
				base.shadowRoot.querySelector(".regalia-banner-state-machine").shadowRoot.querySelector(".regalia-banner-intro.regalia-banner-video").style.filter = "grayscale(1) saturate(0) brightness(0.5)"
			}
			catch {}

			try {
				document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.querySelector("div > div > div.regalia-parties-v2-crest-wrapper > lol-regalia-crest-v2-element").
					shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
			}
			catch {}
		}, 200)
	}
}
//___________________________________________________________________________//



//___________________________________________________________________________//
let pageChangeMutation = (node) => {
	let pagename;
	let elaina_bg_elem = document.getElementById("elaina-bg")
	let brightness_modifiers = ["rcp-fe-lol-champ-select", "rcp-fe-lol-store", "rcp-fe-lol-collections", "rcp-fe-lol-profiles-main",
		"rcp-fe-lol-parties", "rcp-fe-lol-loot", "rcp-fe-lol-clash-full"]
	pagename = node.getAttribute("data-screen-name")
	console.log(pagename)


	if (pagename == "rcp-fe-lol-home-main") {
		if (!document.getElementsByClassName("webm-bottom-buttons-container").length) {
			homepagebutton.create_webm_buttons()
			watermark.ElainaTrigger()
		}
		homepage.add_elaina_home_page()
		homepage.add_elaina_home_navbar()
		homepage.go_to_default_home_page()
		if (previous_page == "rcp-fe-lol-parties" ){
			homepage.patch_default_home_page()
		}
	}
	else if (pagename != "rcp-fe-lol-navigation-screen" && pagename != "window-controls" && pagename != "rcp-fe-lol-home" && pagename != "social") {
		if (document.getElementsByClassName("webm-bottom-buttons-container").length) {
			homepagebutton.Delbuttons()
			watermark.DelElainaTrigger()
		}
	}
	if (pagename == "social") {
		if (patcher_go_to_default_home_page){
			homepage.go_to_default_home_page()
			patcher_go_to_default_home_page = false
		}
	}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		return;
	}
	else if (pagename == "rcp-fe-lol-yourshop") {
		elaina_bg_elem.style.filter = 'blur(3px) brightness(0.4) saturate(1.5)';
	}
	if (pagename == "rcp-fe-lol-champ-select") {
		elaina_bg_elem.style.filter = 'blur(3px) brightness(0.4) saturate(1.5)';
	}
	else if (previous_page == "rcp-fe-lol-champ-select" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
	}
	if (pagename == "rcp-fe-lol-clash-full") {
		elaina_bg_elem.style.filter = 'blur(10px) brightness(0.2)';
	}
	else if (previous_page == "rcp-fe-lol-clash-full" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
	}
	if (pagename == "rcp-fe-lol-loot") {
		elaina_bg_elem.style.filter = 'brightness(0.3)';
	}
	else if (previous_page == "rcp-fe-lol-loot" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
	}
	if (pagename == "rcp-fe-lol-store") {
		elaina_bg_elem.style.filter = 'brightness(0.2)';
	}
	else if (previous_page == "rcp-fe-lol-store" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
	}
	if (pagename == "rcp-fe-lol-collections") {
		elaina_bg_elem.style.filter = 'brightness(0.2)';
	}
	else if (previous_page == "rcp-fe-lol-collections" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
	}
	if (pagename == "rcp-fe-lol-profiles-main") {
		let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')

		window.setInterval(() => {
			try {
				document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div:nth-child(2) > img").remove()
				document.querySelector("div > div.summoner-xp-radial").remove()
			}
			catch {}

			try {
				document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
			}
			catch {}
		}, 100)
	
		if (!ranked_observer && rankedNode) {
			ranked_observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.target.classList.contains('visible')) {
						let tmpInterval = window.setInterval(() => {
							try {
								document.querySelector("div.smoke-background-container > lol-uikit-parallax-background").shadowRoot.querySelector(".parallax-layer-container").style.backgroundImage = ''
								window.clearInterval(tmpInterval)
							}
							catch {
								;
							}
						}, 500)
					}
				});
			});
			ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false });
		}
		elaina_bg_elem.style.filter = 'brightness(0.3)'[wallpapers[0]];		
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
		if (brightness_modifiers.indexOf(pagename) == -1)
			elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
		if (ranked_observer)
			ranked_observer.disconnect()
		ranked_observer = undefined
	}
	if (pagename == "rcp-fe-lol-parties") {
		elaina_bg_elem.style.filter = 'brightness(0.4) blur(6px)'[wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)'[wallpapers[0]];
	}
	if (previous_page != pagename)
		previous_page = pagename
}

window.addEventListener('load', () => {
	utils.mutationObserverAddCallback(pageChangeMutation, ["screen-root"])
})
//___________________________________________________________________________//



//___________________________________________________________________________//
window.setInterval(() => { 
	try {
		document.getElementsByClassName("lol-settings-container")[0].style.backgroundColor = "transparent";
		document.querySelector(".lol-settings-container").shadowRoot.querySelector("div").style.background = "transparent";
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > lol-regalia-banner-v2-element").remove()
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.backgroundColor = "transparent";
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = "transparent";

		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > div > div.regalia-identity-customizer-crest-wrapper > lol-regalia-crest-v2-element").
			shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
	}
	catch {}

	try {
		document.querySelector("#lol-uikit-tooltip-root > div > div > div.hover-card.right.has-regalia.regalia-loaded > div > div.hover-card-info-container > div.hover-card-identity > lol-regalia-hovercard-v2-element").
			shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
		
			document.querySelector("#hover-card-backdrop").style.backgroundImage = "var(--Hover-card-backdrop)"
	}
	catch {}

	try {
		document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = "transparent"
	}
	catch {}
}, 100)
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', () => {	
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner)
	utils.addCss(default_settings["css_file"])
	LoadingScreen.Applyloadingscreen()


	WallpaperExport.Wallpapers()
	AudioExport.Audio()
	homepagebutton.elaina_play_pause()

	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]

		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("elaina-bg").style.filter = 'blur(10px) brightness(0.4) saturate(1.5)';
			document.getElementById("elaina-bg").pause()
			document.getElementById("bg-audio").pause()
		}
		else {
			homepagebutton.elaina_play_pause()
			homepagebutton.audio_play_pause()
		} 
	})
//___________________________________________________________________________//


//___________________________________________________________________________//
console.clear();
console.log('By Elaina Da Catto');
console.log('Meow ~~~');
console.log(default_settings["custom_log"]);
})