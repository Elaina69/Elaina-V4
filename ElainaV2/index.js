/* By Elaina Da Catto */
/* Meow~~~ */

import data        from './configs/ElainaV2_config.json'
import lang        from './configs/Language.json'
import utils       from './resources/_utilselaina'
import watermark   from './resources/Watermark'
import Update      from './resources/CheckUpdate'
import Settings    from './resources/Theme-Settings'
import thisVersion from './configs/Version'
import newVersion  from 'https://raw.githack.com/Elaina69/Elaina-V2/main/ElainaV2/configs/Version.js'

//Addon plugins
import './resources/LL-Settings'
import './resources/Aram-only'
import './resources/Auto-accept'
import './resources/Dodge-button'
import './resources/Offline-mode'
import './resources/Hide_friendlist'          // Still in Beta test

//___________________________________________________________________________//
let default_wallpaper  = data["default_wallpaper"]
let wallpapers         = data["wallpaper_list"]

let default_audio      = data["default_audio"]
let Audios             = data["audio_list"]

let Avatar             = data["Custom-Avatar"]
let CustomRP           = data["Custom_RP"]
let CusRP              = data["RP"]

let SidebarTransparent = data["Sidebar-Transparent"]
let CustomIcon         = data["Custom-Icon"]
let LoadingScr         = data["Animate-Loading"]
let HideChampsArt      = data["Hide-Champions-Splash-Art"]

let index              = default_wallpaper -1;
let songIndex          = default_audio -1;
let pause_bg           = false
//___________________________________________________________________________//



//___________________________________________________________________________//
DataStore.remove('ll-welcome')
DataStore.set('ll-welcome', false)
if (DataStore.has('Custom_RP') == false && CustomRP == true){
	DataStore.set('Custom_RP', CusRP)
}
else if (CustomRP == false){
	DataStore.remove('Custom_RP')
}
else {
	if (DataStore.get('Custom_RP') == CusRP) {}
	else {
		DataStore.remove('Custom_RP')
		DataStore.set('Custom_RP', CusRP)
	}
}

if (DataStore.has('pause-audio') == false) {
	DataStore.set('pause-audio', false)
	console.log("pause audio is " + DataStore.get('pause-audio'))
}
else {
	console.log("pause audio is " + DataStore.get('pause-audio'))
}
//___________________________________________________________________________//



//___________________________________________________________________________//
var nodeRemovedEvent = function (event) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let elainaBg     = document.getElementById("elaina-bg");
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		if (!elainaBg || !viewportRoot) {
			return;
		}
		viewportRoot.style.filter = "none"
		elainaBg.style.filter     = data["Homepage"];

		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent);
	}
};

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
			let div         = create_element("div", "wrapper")

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
			let RU = document.querySelector("html").lang == "ru-RU"

			if (VN) {
				elaina_home_navbar_item.textContent = lang.VN["home"]
			}
			else if (JP) {
				elaina_home_navbar_item.textContent = lang.JP["home"]
			}
			else if (PL) {
				elaina_home_navbar_item.textContent = lang.PL["home"]
			}
			else if (RU) {
				elaina_home_navbar_item.textContent = lang.RU["home"]
			}
			else {
				elaina_home_navbar_item.textContent = lang.EN["home"]
			}
            //___________________________________________________________________________//
			navbar.prepend(elaina_home_navbar_item)
		}
	}
}

function patch_default_home_page(){
	let loop = 0
	let intervalId = window.setInterval(() => {
		if (loop >= 20) {
			window.clearInterval(intervalId)
		}
		go_to_default_home_page()
		loop += 1
	}, 100)
}
//___________________________________________________________________________//



//___________________________________________________________________________//
function elaina_play_pause() {
	let elaina_bg_elem = document.getElementById("elaina-bg")
	if (pause_bg) {
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
	if (!pause_bg) {
		pause_bg_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/pause_button.png")
	}
	else {
		pause_bg_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/play_button.png")
	}
}
//___________________________________________________________________________//



//___________________________________________________________________________//
function audio_play_pause() {
	let audio          = document.getElementById("bg-audio")
	let wallpaperaudio = document.getElementById("elaina-bg")

	if (DataStore.get('pause-audio') == true) {
		audio.pause()
		wallpaperaudio.volume = 0.0;
		audio.volume          = 0.0
	}
	else {
		audio.play()
		wallpaperaudio.volume = data["video_sound_volume"];
		audio.volume          = data["audio_sound_volume"];
	}
}

function audio_volume() {
	let audio          = document.getElementById("bg-audio")
	let wallpaperaudio = document.getElementById("elaina-bg")

	audio.volume          = 0.02
	wallpaperaudio.volume = 0.02
}

function play_pause_set_icon_audio(elem) {
	let pause_audio_icon = elem || document.querySelector(".pause-audio-icon")

	if (!pause_audio_icon) {
		return;
	}
	if (DataStore.get('pause-audio') == false) {
		pause_audio_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/audio.png")
	}
	else {
		pause_audio_icon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/mute.png")
	}

}
//___________________________________________________________________________//





//___________________________________________________________________________//
function loadBG(BG) {
	let elainaBg = document.getElementById("elaina-bg")
	elainaBg.src = `//plugins/ElainaV2/assets/Backgrounds/${BG}`;
}

function loadSong(song) {
	let audio     = document.getElementById("bg-audio")
    	audio.src = `//plugins/ElainaV2/assets/Backgrounds/Audio/${song}`;
}

function next_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
		elainaBg.classList.add("webm-hidden");
	index++
    if (index > wallpapers.length - 1) {
        index = 0
    }
	setTimeout(function () {
		elaina_play_pause()
		elainaBg.classList.remove("webm-hidden");
		loadBG(wallpapers[index])
	}, 500);
}
function prev_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
		elainaBg.classList.add("webm-hidden");
	index--
    if (index < 0) {
        index = wallpapers.length - 1
    }
	setTimeout(function () {
		elaina_play_pause()
		elainaBg.classList.remove("webm-hidden");
		loadBG(wallpapers[index])
	}, 500);
}

function nextSong() {
    songIndex++

    if (songIndex > Audios.length - 1) {
        songIndex = 0
    }
    loadSong(Audios[songIndex])
    audio_play_pause()
}
function prevSong() {
    songIndex--

    if (songIndex < 0) {
        songIndex = Audios.length - 1
    }
    loadSong(Audios[songIndex])
    audio_play_pause()
}
//___________________________________________________________________________//





//___________________________________________________________________________//
function create_webm_buttons() {
	const container      = document.createElement("div")
	const containeraudio = document.createElement("div")

	const pauseBg        = document.createElement("div")
	const nextBg         = document.createElement("div")
	const prevBg         = document.createElement("div")
	const pauseBgIcon    = document.createElement("img")
	const nextBgIcon     = document.createElement("img")
	const prevBgIcon     = document.createElement("img")

	const pauseAudio     = document.createElement("div")
	const nextAudio      = document.createElement("div")
	const prevAudio      = document.createElement("div")	
	const pauseAudioIcon = document.createElement("img")
	const nextAudioIcon  = document.createElement("img")
	const prevAudioIcon  = document.createElement("img")

	const audioVolume    = document.createElement("input")
	
	
	
	container.classList.add("webm-bottom-buttons-container")
	containeraudio.classList.add("audio-volume-panel")
	
	pauseBg.id    = "pause-bg"
	nextBg.id     = "next-bg"
	prevBg.id     = "prev-bg"

	pauseAudio.id = "pause-audio"
	nextAudio.id     = "next-audio"
	prevAudio.id     = "prev-audio"

	pauseBgIcon.classList.add("pause-bg-icon")
	nextBgIcon.classList.add("next-bg-icon")
	prevBgIcon.classList.add("prev-bg-icon")

	pauseAudioIcon.classList.add("pause-audio-icon")
	nextAudioIcon.classList.add("next-audio-icon")
	prevAudioIcon.classList.add("prev-audio-icon")

	audioVolume.classList.add("audio-volume")
	audioVolume.setAttribute("type", "range")
	
	play_pause_set_icon_audio(pauseAudioIcon)
	play_pause_set_icon(pauseBgIcon)

	pauseAudio.addEventListener("click", () => {
		DataStore.set('pause-audio', !DataStore.get('pause-audio'))
		audio_play_pause()
		play_pause_set_icon_audio()
	})	
	pauseBg.addEventListener("click", () => {
		pause_bg = !pause_bg
		elaina_play_pause()
		play_pause_set_icon()
	})

	let Click = 0
	nextBg.addEventListener("click", () => {
		Click += 1
		if (Click >= 69) {
			window.open("https://media.discordapp.net/attachments/887677396315172894/1100385074299539556/100259683_p0_master1200.png", "_blank")
		}
		else {}
		next_wallpaper()
	})
	prevBg.addEventListener("click", () => {
		prev_wallpaper()
	})
	nextAudio.addEventListener("click", () => {
		nextSong()
	})
	prevAudio.addEventListener("click", () => {
		prevSong()
	})

	nextBgIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/next_button.png")
	prevBgIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/prev_button.png")
	nextAudioIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/next-audio.png")
	prevAudioIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/prev-audio.png")
		
	let showcontainer = document.getElementsByClassName("rcp-fe-lol-home")[0]
	    showcontainer.appendChild(container)
		//showcontainer.appendChild(containeraudio)
	
	
	container.append(prevAudio)
	container.append(pauseAudio)
	container.append(pauseBg)
	container.append(nextAudio)
	container.append(prevBg)
	container.append(nextBg)

	pauseAudio.append(pauseAudioIcon)
	prevAudio.append(prevAudioIcon)
	nextAudio.append(nextAudioIcon)

	pauseBg.append(pauseBgIcon)
	nextBg.append(nextBgIcon)
	prevBg.append(prevBgIcon)

	//containeraudio.append(audioVolume)
}

function Delbuttons() {
	document.getElementsByClassName("webm-bottom-buttons-container")[0].remove()
}
//___________________________________________________________________________//



//___________________________________________________________________________//



function HideRightNavbar () {
	const HideNavbardiv = document.createElement("div")
	const HideNavbarIcon = document.createElement("img")

	HideNavbardiv.classList.add("Hide-nav-div")
	HideNavbarIcon.classList.add("Hide-nav-icon")
	window.setInterval(() => {

			let Navbar = document.getElementsByClassName("right-nav-menu")[0]
			for (let i = 0; i < Navbar.length; i++) {
				Navbar[i].appendChild(HideNavbardiv)
				HideNavbardiv.append(HideNavbarIcon)
	
				HideNavbardiv.addEventListener("click", () => {
	
				})
			}
		

	},500)
}



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
		"rcp-fe-lol-event-shop"
    ]

	pagename = node.getAttribute("data-screen-name")
	console.log(pagename)

	if (pagename == "rcp-fe-lol-home-main") {
		elaina_bg_elem.style.filter = data["Homepage"];
		if (!document.getElementsByClassName("webm-bottom-buttons-container").length) {
			create_webm_buttons()
			watermark.ElainaTrigger()
			Settings.ThemeSettings()

			if (thisVersion >= newVersion) {}
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
			Settings.DeleteSettings()
		}
	}
	if (pagename == "social") {
		if (patcher_go_to_default_home_page){
			go_to_default_home_page()
			patcher_go_to_default_home_page = false
		}
	}
	else {}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		return;
	}
	else {}
	if (pagename == "rcp-fe-lol-yourshop") {
		elaina_bg_elem.style.filter = data["Yourshop"];
	}
	else if (previous_page == "rcp-fe-lol-yourshop" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"];
	}
	if (pagename == "rcp-fe-lol-champ-select") {
		elaina_bg_elem.style.filter = data["Champ-select"];
	}
	else if (previous_page == "rcp-fe-lol-champ-select" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"];
	}
	if (pagename == "rcp-fe-lol-clash-full") {
		elaina_bg_elem.style.filter = data["Clash"];
	}
	else if (previous_page == "rcp-fe-lol-clash-full" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"];
	}
	if (pagename == "rcp-fe-lol-loot") {
		elaina_bg_elem.style.filter = data["Loot"];
	}
	else if (previous_page == "rcp-fe-lol-loot" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"];
	}
	if (pagename == "rcp-fe-lol-store") {
		elaina_bg_elem.style.filter = data["Store"];
		window.setInterval(() => {
			try {
				let storeIframe = document.querySelector('#rcp-fe-lol-store-iframe > iframe[referrerpolicy = "no-referrer-when-downgrade"]')
					storeIframe.contentWindow.document.querySelector("#root > div > div.item-page.container.content.clearfix > div.item-page-items-container-wrapper.purchase-history-page-content-wrapper").style.background = "transparent"
		
				let th = storeIframe.contentWindow.document.querySelectorAll("#root > div > div.item-page.container.content.clearfix > div.item-page-items-container-wrapper.purchase-history-page-content-wrapper > div > div > table > thead > tr > th")
				for (let i = 0; i < th.length; i++) {
					th[i].style.background = "transparent";
				}
			}
			catch {}
		},100)
	}
	else if (previous_page == "rcp-fe-lol-store" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"];
	}
	if (pagename == "rcp-fe-lol-collections") {
		elaina_bg_elem.style.filter = data["Collections"];
	}
	else if (previous_page == "rcp-fe-lol-collections" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"];
	}
	if (pagename == "rcp-fe-lol-postgame") {
		elaina_bg_elem.style.filter = data["Postgame"];
	}
	else if (previous_page == "rcp-fe-lol-postgame" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"];
	}
	if (pagename == "rcp-fe-lol-profiles-main") {		
		elaina_bg_elem.style.filter = data["Profiles"];
        let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')
    
        window.setInterval(() => {
            try {
                document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div:nth-child(2) > img").remove()
                document.querySelector("div > div.summoner-xp-radial").remove()
            }
            catch {}
			try {
				document.querySelector(".style-profile-ranked-component.ember-view > .style-profile-emblem-wrapper  > .style-profile-emblem-header > .style-profile-emblem-header-title").innerHTML = "Apprentice"
				document.querySelector(".style-profile-emblem-subheader-ranked > div").innerHTML = "Witch"
			}
			catch{}

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
			elaina_bg_elem.style.filter = data["Homepage"];
        else{}
        if (ranked_observer)
        ranked_observer.disconnect()
        ranked_observer = undefined
	}
	if (pagename == "rcp-fe-lol-parties") {
		elaina_bg_elem.style.filter = data["Parties"] [wallpapers[0]];

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
		elaina_bg_elem.style.filter = data["Homepage"][wallpapers[0]];
	}
	if (previous_page != pagename) {
		previous_page = pagename
	}	
}
//___________________________________________________________________________//



//___________________________________________________________________________//
window.setInterval(() => {
	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > lol-regalia-banner-v2-element").remove()
	}
	catch {}
	try {
		document.getElementsByClassName("lol-settings-container")[0].style.backgroundColor = "transparent";
		document.querySelector(".lol-settings-container").
            shadowRoot.querySelector("div").style.background = "transparent";
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
	if (Avatar) {
		try {
			document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
				shadowRoot.querySelector("div > div > div.regalia-identity-customizer-crest-wrapper > lol-regalia-crest-v2-element").
				shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
				}
		catch {}
		try {
			document.querySelector("#hover-card-backdrop").style.backgroundImage = "var(--Hover-card-backdrop)"
			document.querySelector("#lol-uikit-tooltip-root > div > div > div.hover-card.right.has-regalia.regalia-loaded > div > div.hover-card-info-container").style.background = "#1a1c21"
			document.querySelector("#lol-uikit-tooltip-root > div > div > div.hover-card.right.has-regalia.regalia-loaded > div > div.hover-card-info-container > div.hover-card-identity > lol-regalia-hovercard-v2-element").
				shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
		}
		catch {}
	}
	try {
		let RP = document.querySelector("div.currency-rp").innerHTML
		if (CustomRP) {
			if (RP == CusRP) {}
			else {
				document.querySelector("div.currency-rp").innerHTML = DataStore.get('Custom_RP')
			}
		}
		else {}
	}
	catch {}
}, 100)

import './resources/Pandoru'
import wt from './resources/Watermark'
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', () => {
	utils.addCss("//plugins/ElainaV2/assets/Css/ElainaV2.css");	
	if (SidebarTransparent) {utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Sidebar-Transparent.css");}
	else {utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Sidebar-Color.css");}

	if (LoadingScr) {utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Animate-Loading-Screen.css")}
    else {utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Static-Loading-Screen.css")}

	if (HideChampsArt) {utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Hide-Champs-Splash-Art.css")}

    if (Avatar) {utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/Avatar.css")}
	
	if (CustomIcon) {
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/RiotPoint.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/BlueEssence.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/ClashBanner.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/Emblem.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/Rank.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/Ticker.css")
	}

	const video = document.createElement('video');
	const audio = document.createElement("audio");

		video.id       = 'elaina-bg';
		video.autoplay = true;
		video.loop     = true;
		video.src      = `//plugins/ElainaV2/assets/Backgrounds/${wallpapers[index]}`
		video.volume   = data["video_sound_volume"];
		video.load()

		audio.id       = 'bg-audio';
    	audio.autoplay = true;
    	audio.loop     = false;
		audio.src      = `//plugins/ElainaV2/assets/Backgrounds/Audio/${Audios[songIndex]}`
		audio.volume   = data["audio_sound_volume"];
		audio.load()
	
	audio.addEventListener("ended", nextSong)
	video.addEventListener("load", function() { 
		video.play()
	}, true);
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
			document.getElementById("elaina-bg").style.filter = data["Gamestart"];
			document.getElementById("elaina-bg").pause()
			document.getElementById("bg-audio").pause()
		}
		else {
			elaina_play_pause()
			audio_play_pause()
		} 
	})

	console.log("Theme on Github is v" + newVersion)
	console.log("This theme version is v" + thisVersion)
	if (thisVersion >= newVersion) {
		console.log("Your theme is up-to-date")
	}
	else {
		console.log("You should update your theme")
	}
})
//___________________________________________________________________________//