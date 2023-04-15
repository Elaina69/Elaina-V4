/* By Elaina Da Catto */
/* Meow~~~ */

import data        from './configs/ElainaV2_config.json'
import lang        from './configs/Language.json'
import utils       from './resources/_utilselaina'
import watermark   from './resources/Watermark'
import Update      from './resources/CheckUpdate'
import thisVersion from './configs/Version'
import newVersion  from 'https://raw.githack.com/Elaina69/Elaina-V2/main/ElainaV2/configs/Version.js'

//Addon plugins
import './resources/LoadMainCss'
import './resources/LL-Settings'
import './resources/Aram-only'
import './resources/Auto-accept'
import './resources/Dodge-button'
import './resources/Offline-mode'
import './resources/Hide_friendlist'          // Still in Beta test

//___________________________________________________________________________//
let Avatar            = data["Custom-Avatar"]
let default_wallpaper = data["default_wallpaper"]
let force_bg_pause    = data["pause_wallpaper"];
let force_audio_pause = data["pause_audio"];
let wallpapers        = data["wallpaper_list"];
let index             = wallpapers.indexOf(default_wallpaper);
//___________________________________________________________________________//



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
if (index !== -1) {
	wallpapers.splice(index, 1);
	wallpapers.unshift(default_wallpaper);
}
document.addEventListener("DOMNodeRemoved", nodeRemovedEvent);
//___________________________________________________________________________//





//___________________________________________________________________________//
function create_element(tagName, className, content) {
	const el = document.createElement(tagName);
	el.className = className;
	if (content) {
		el.innerHTML = content;
	}
	return el;
};

function go_to_default_home_page() {
	if (data["default_home_page"]) {
		document.querySelector(`lol-uikit-navigation-item[item-id='${data["default_home_page"]}']`).click()
	}
}

function add_elaina_home_page() {
	let lol_home = document.querySelector(".rcp-fe-lol-home > lol-uikit-section-controller")

	if (lol_home) {
		if (!lol_home.querySelector("[section-id='elaina-home']")) {
			let elaina_home = create_element("lol-uikit-section", "")
			let div = create_element("div", "wrapper")

			div.id = "elaina-home"
			elaina_home.setAttribute("section-id", "elaina-home")
			elaina_home.append(div)
			lol_home.prepend(elaina_home)
		}
	}
}

function add_elaina_home_navbar() {
	let navbar = document.querySelector(".rcp-fe-lol-home > lol-uikit-navigation-bar")

	if (navbar) {
		if (!navbar.querySelector("[item-id='elaina-home']")) {
			let elaina_home_navbar_item = create_element("lol-uikit-navigation-item", "")

			elaina_home_navbar_item.setAttribute("item-id", "elaina-home")
			elaina_home_navbar_item.setAttribute("priority", 1)

            //___________________________________________________________________________//
			let VN = document.querySelector("html").lang == "vi-VN"
			let JP = document.querySelector("html").lang == "ja-JP"
			let PL = document.querySelector("html").lang == "pl-PL"

			if (VN) {
				elaina_home_navbar_item.textContent = lang.VN[0]
			}
			else if (JP) {
				elaina_home_navbar_item.textContent = lang.JP[0]
			}
			else if (PL) {
				elaina_home_navbar_item.textContent = lang.PL[0]
			}
			else {
				elaina_home_navbar_item.textContent = lang.EN[0]
			}
            //___________________________________________________________________________//
			navbar.prepend(elaina_home_navbar_item)
		}
	}
}

function patch_default_home_page(){
	let loop = 0
	let intervalId = window.setInterval(() => {
		if (loop >= 5) {
			window.clearInterval(intervalId)
		}
		go_to_default_home_page()
		loop += 1
	}, 300)
}
//___________________________________________________________________________//





//___________________________________________________________________________//
function elaina_play_pause() {
	let elaina_bg_elem = document.getElementById("elaina-bg")
	if (force_bg_pause) {
		elaina_bg_elem.pause()
	}
	else {
		elaina_bg_elem.play()
	}
}

function play_pause_set_icon(elem) {
	let pause_bg_icon = elem || document.querySelector(".pause-bg-icon")

	if (!pause_bg_icon) {
		return;
	}
	if (!force_bg_pause) {
		pause_bg_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/pause_button.png")
	}
	else {
		pause_bg_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/play_button.png")
	}
}
//___________________________________________________________________________//





//___________________________________________________________________________//
function audio_play_pause() {
	let audio = document.getElementById("bg-audio")
	let wallpaperaudio = document.getElementById("elaina-bg")

	if (force_audio_pause) {
		audio.pause()
		wallpaperaudio.volume = 0.0;
		audio.volume = 0.0
	}
	else {
		audio.play()
		wallpaperaudio.volume = data["video_sound_volume"];
		audio.volume = data["audio_sound_volume"];
	}
}

function audio_volume() {
	let audio = document.getElementById("bg-audio")
	let wallpaperaudio = document.getElementById("elaina-bg")

	audio.volume = 0.02
	wallpaperaudio.volume = 0.02
}

function play_pause_set_icon_audio(elem) {
	let pause_audio_icon = elem || document.querySelector(".pause-audio-icon")

	if (!pause_audio_icon) {
		return;
	}
	if (!force_audio_pause) {
		pause_audio_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/audio.png")
	}
	else {
		pause_audio_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/mute.png")
	}

}
//___________________________________________________________________________//





//___________________________________________________________________________//
function next_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
	document.querySelector(":root").classList.remove(wallpapers[0].replace(/\.[a-zA-Z]+$/, '-vars'))
	elainaBg.classList.add("webm-hidden");
	wallpapers.push(wallpapers.shift())
	document.querySelector(":root").classList.add(wallpapers[0].replace(/\.[a-zA-Z]+$/, '-vars'))
	setTimeout(function () {
		elainaBg.src = `//plugins/ElainaV2/assets/Backgrounds/${wallpapers[0]}`
		elaina_play_pause()
		elainaBg.classList.remove("webm-hidden");
	}, 500);
}
//___________________________________________________________________________//





//___________________________________________________________________________//
function create_webm_buttons() {
	const container      = document.createElement("div")
	const containeraudio = document.createElement("div")	
	const pauseBg        = document.createElement("div");
	const pauseAudio     = document.createElement("div");
	const nextBg         = document.createElement("div");
	const prevBg         = document.createElement("div");	
	const pauseBgIcon    = document.createElement("img")
	const nextBgIcon     = document.createElement("img")
	const pauseAudioIcon = document.createElement("img")
	const prevBgIcon     = document.createElement("img")
	const audioVolume    = document.createElement("input")
	
	container.classList.add("webm-bottom-buttons-container")
	containeraudio.classList.add("audio-volume-panel")
	
	pauseBg.id = "pause-bg"
	nextBg.id = "next-bg"
	pauseAudio.id = "pause-audio"
	prevBg.id = "prev-bg"

	nextBgIcon.classList.add("next-bg-icon")
	prevBgIcon.classList.add("prev-bg-icon")
	pauseBgIcon.classList.add("pause-bg-icon")
	pauseAudioIcon.classList.add("pause-audio-icon")
	audioVolume.classList.add("audio-volume")

	audioVolume.setAttribute("type", "range")
	
	play_pause_set_icon_audio(pauseAudioIcon)
	play_pause_set_icon(pauseBgIcon)

	pauseAudio.addEventListener("click", () => {
		force_audio_pause = !force_audio_pause
		audio_play_pause()
		play_pause_set_icon_audio()
	})	
	pauseBg.addEventListener("click", () => {
		force_bg_pause = !force_bg_pause
		elaina_play_pause()
		play_pause_set_icon()
	})
	nextBg.addEventListener("click", () => {
		next_wallpaper()
	})
	prevBg.addEventListener("click", () => {
	    prev_wallpaper()
	})

	nextBgIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/next_button.png")
	prevBgIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/prev_button.png")
		
	let showcontainer = document.getElementsByClassName("rcp-fe-lol-home")[0]
	    showcontainer.appendChild(container)
		//showcontainer.appendChild(containeraudio)
		
	container.append(pauseAudio)
	container.append(pauseBg)
	//container.append(prevBg)
	container.append(nextBg)
	pauseAudio.append(pauseAudioIcon)
	pauseBg.append(pauseBgIcon)
	//prevBg.append(prevBgIcon)
	nextBg.append(nextBgIcon)
	//containeraudio.append(audioVolume)
}

function Delbuttons() {
	document.getElementsByClassName("webm-bottom-buttons-container")[0].remove()
}
//___________________________________________________________________________//



//___________________________________________________________________________//
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

            if (Avatar) {
                try {
					document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.querySelector("div > div > div.regalia-parties-v2-crest-wrapper > lol-regalia-crest-v2-element").
						shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
				}
				catch {}
            }
		}, 20)
	}
}
//___________________________________________________________________________//





//___________________________________________________________________________//
let pageChangeMutation = (node) => {
	let pagename
	let previous_page
	let ranked_observer
	let elaina_bg_elem = document.getElementById("elaina-bg")
	let patcher_go_to_default_home_page = true
	let brightness_modifiers = [
        "rcp-fe-lol-champ-select", 
        "rcp-fe-lol-store", 
        "rcp-fe-lol-collections", 
        "rcp-fe-lol-profiles-main",
        "rcp-fe-lol-parties", 
        "rcp-fe-lol-loot", 
        "rcp-fe-lol-clash-full"
    ]

	pagename = node.getAttribute("data-screen-name")
	console.log(pagename)

	if (pagename == "rcp-fe-lol-home-main") {
		if (!document.getElementsByClassName("webm-bottom-buttons-container").length) {
			create_webm_buttons()
			watermark.ElainaTrigger()

			if (thisVersion == newVersion) {}
			else {
				Update.UpdatePopup()
			}
		}
		add_elaina_home_page()
		add_elaina_home_navbar()
		go_to_default_home_page()
		if (previous_page == "rcp-fe-lol-parties" ){
			patch_default_home_page()
		}
	}
	else if (pagename != "rcp-fe-lol-navigation-screen" && pagename != "window-controls" && pagename != "rcp-fe-lol-home" && pagename != "social") {
		if (document.getElementsByClassName("webm-bottom-buttons-container").length) {
			Delbuttons()
			watermark.DelElainaTrigger()
			Update.DelPopup()
		}
	}
	if (pagename == "social") {
		if (patcher_go_to_default_home_page){
			go_to_default_home_page()
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
        let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')
    
        window.setInterval(() => {
            try {
                document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div:nth-child(2) > img").remove()
                document.querySelector("div > div.summoner-xp-radial").remove()
            }
            catch {}

            if (Avatar) {
                try {
					document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
				}
				catch {}
            }
        }, 10)
        
        if (!ranked_observer && rankedNode) {
            ranked_observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.target.classList.contains('visible')) {
                        let tmpInterval = window.setInterval(() => {
                            try {
                                document.querySelector("div.smoke-background-container > lol-uikit-parallax-background").shadowRoot.querySelector(".parallax-layer-container").style.backgroundImage = ''
                                window.clearInterval(tmpInterval)
                            }
                            catch {}
                        }, 500)
                    }
                });
            });
            ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false });
        }		
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
		if (brightness_modifiers.indexOf(pagename) == -1)
			elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
        else{}
        if (ranked_observer)
        ranked_observer.disconnect()
        ranked_observer = undefined
	}
	if (pagename == "rcp-fe-lol-parties") {
		elaina_bg_elem.style.filter = 'brightness(0.4) blur(6px)'[wallpapers[0]];

        window.setInterval(() => {
            try {

                let gameinfo = document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-status-card").shadowRoot
                    gameinfo.querySelector("div").style.background = "#143c1400"
                    gameinfo.querySelector("div > div.parties-status-card-bg-container").style.color = "#36d98700"
                    gameinfo.querySelector("div > div.parties-status-card-bg-container > video").setAttribute('src', '')
                    gameinfo.querySelector("div > div.parties-status-card-header").style.visibility = "hidden"

                let cardbody = gameinfo.querySelector("div > div.parties-status-card-body").style
                    cardbody.marginTop = "-23px"
                    cardbody.padding = "10px 5px 10px 10px"
                    cardbody.border = "1px solid #8c8263"
                    cardbody.borderRadius = "10px"

                let gamesearch = document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-game-search").shadowRoot
                    gamesearch.querySelector("div").style.border = "1px solid #8c8263"
                    gamesearch.querySelector("div").style.borderRadius = "10px"
                    gamesearch.querySelector("div").style.marginTop = "9px"
                    gamesearch.querySelector("div > div.parties-game-search-divider").remove()

                document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-bg-container").style.backgroundImage = "none"
                document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-status-card").shadowRoot.
                    querySelector("div > div.parties-status-card-body > div.parties-status-card-map.game_map_howling_abyss").style.margin = "-3px 10px 0 0"
            }
            catch {}
        },10)
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)'[wallpapers[0]];
	}
	if (previous_page != pagename)
		previous_page = pagename
}
//___________________________________________________________________________//



//___________________________________________________________________________//
window.setInterval(() => { 
	try {
		document.getElementsByClassName("lol-settings-container")[0].style.backgroundColor = "transparent";
		document.querySelector(".lol-settings-container").
            shadowRoot.querySelector("div").style.background = "transparent";
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > lol-regalia-banner-v2-element").remove()
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.backgroundColor = "transparent";
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").
            shadowRoot.querySelector("div").style.background = "transparent";
	}
	catch {}
	try {
		document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame").
            shadowRoot.querySelector("div").style.background = "transparent"
	}
	catch {}
}, 100)

import './resources/Pandoru'
if (Avatar) {
    window.setInterval(() => { 
		try {
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
	}, 10)
}
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', () => {
	const video = document.createElement('video');
		video.id = 'elaina-bg';
		video.autoplay = true;
		video.loop = true;
		video.src = data["default_wallpaper_src"];
		video.volume = data["video_sound_volume"];
	const audio = document.createElement("audio");
    	audio.autoplay = true;
    	audio.loop = true;
    	audio.src = data["audio_src"];
		audio.volume = data["audio_sound_volume"];
    	audio.id = 'bg-audio';
    	audio.load();
    	audio.addEventListener("load", function() { 
			audio.play()
		}, true);

	document.querySelector("body").prepend(video)
    document.querySelector("body").prepend(audio)

	elaina_play_pause()

	utils.mutationObserverAddCallback(pageChangeMutation, ["screen-root"])
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner)
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]
		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("elaina-bg").style.filter = 'blur(10px) brightness(0.4) saturate(1.5)';
			document.getElementById("elaina-bg").pause()
			document.getElementById("bg-audio").pause()
		}
		else {
			elaina_play_pause()
			audio_play_pause()
		} 
	})
})
//___________________________________________________________________________//