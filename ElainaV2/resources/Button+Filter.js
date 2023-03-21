import homepage from './CreateHomepage'
import homepagebutton from './Homepagebuttons'
import watermark from './Watermark'

import utils from './_utilselaina'
import data from '../configs/ElainaV2_config.json'
let default_settings = data

//___________________________________________________________________________//
var nodeRemovedEvent = function (event) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let elainaBg = document.getElementById("elaina-bg");
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		if (!elainaBg || !viewportRoot) {
			return;
		}
		viewportRoot.style.filter = "none"
		elainaBg.style.filter = "brightness(0.7) saturate(0.8)"

		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent);
	}
};
document.addEventListener("DOMNodeRemoved", nodeRemovedEvent);
//___________________________________________________________________________//



//___________________________________________________________________________//
homepagebutton.apply_default_background()

let previous_page;
let patcher_go_to_default_home_page = true;
let wallpapers = default_settings["wallpaper_list"];

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
		elaina_bg_elem.style.filter = 'brightness(0.3)'[wallpapers[0]];		
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
		if (brightness_modifiers.indexOf(pagename) == -1)
			elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
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
window.addEventListener('load', () => {	
	const video = document.createElement('video');
		video.id = 'elaina-bg';
		video.autoplay = true;
		video.loop = true;
		video.src = default_settings["default_wallpaper_src"];
		video.volume = default_settings["video_sound_volume"];

	const audio = document.createElement("audio");
    	audio.autoplay = true;
    	audio.loop = true;
    	audio.src = default_settings["audio_src"];
    	audio.id = 'bg-audio';
    	audio.load();
    	audio.addEventListener("load", function() { 
			audio.play()
		}, true);

	document.querySelector("body").prepend(video)
    document.querySelector("body").prepend(audio)

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
})
//___________________________________________________________________________//