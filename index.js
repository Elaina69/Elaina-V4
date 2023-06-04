/**
 * @name ElainaV2
 * @author Elaina Da Catto
 * @description Elaina theme 2nd Generation for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

import './assets/Css/ElainaV2.css'

import data        from './configs/ElainaV2_config.json'
import lang        from './configs/Language.json'
import utils       from './resources/_utilselaina'
import watermark   from './resources/Watermark'
import Update      from './resources/CheckUpdate'
import thisVersion from './configs/Version'
import QueueID     from './resources/Misc/QueueID.json'

//Addon plugins
import './resources/ThemeSettings'
import './resources/LL-Settings'
import './resources/Aram-only'
import './resources/Auto-accept'
import './resources/Dodge-button'
import './resources/Offline-mode'
import './resources/Hide_friendlist'
import './resources/FakeIP'
import './resources/Custom-Status'
import './resources/Custom-rank(hover)'
import './resources/Auto-Ban-Pick'
import './resources/LootHelper'

//___________________________________________________________________________//
let path       = new URL(".", import.meta.url).href + "assets"

let songIndex  = 0
let wallpapers = data["wallpaper_list"]
let Audios     = data["audio_list"]
let Avatar     = DataStore.get("Custom-Avatar")

const langCode = document.querySelector("html").lang
const langMap  = lang.langlist
//___________________________________________________________________________//



//___________________________________________________________________________//
//Theme DataStore
if (!DataStore.has("Receive-Update")) {
	DataStore.set("Receive-Update", true)
}
if (!DataStore.has("Continues_Audio")) {
	DataStore.set("Continues_Audio", true)
}
if (!DataStore.has("Sidebar-Transparent")) {
	DataStore.set("Sidebar-Transparent", false)
}
if (!DataStore.has("Hide-Champions-Splash-Art")) {
	DataStore.set("Hide-Champions-Splash-Art", true)
}
if (!DataStore.has("Custom-Font")) {
	DataStore.set("Custom-Font", false)
}
if (!DataStore.has("Custom_RP")) {
	DataStore.set("Custom_RP", true)
}
if (!DataStore.has("RP-data")) {
	DataStore.set("RP-data", "-69")
}
if (!DataStore.has("Custom_BE")) {
	DataStore.set("Custom_BE", true)
}
if (!DataStore.has("BE")) {
	DataStore.set("BE", "-69")
}
if (!DataStore.has("Custom-Rank-Name")) {
	DataStore.set("Custom-Rank-Name", true)
}
if (!DataStore.has("Rank-line1")) {
	DataStore.set("Rank-line1", "Apprentice")
}
if (!DataStore.has("Rank-line2")) {
	DataStore.set("Rank-line2", "Witch")
}
if (!DataStore.has("Animate-Loading")) {
	DataStore.set("Animate-Loading", false)
}
if (!DataStore.has("Custom-Avatar")) {
	DataStore.set("Custom-Avatar", true)
}
if (!DataStore.has("Custom-Icon")) {
	DataStore.set("Custom-Icon", true)
}
if (!DataStore.has("Custom-Cursor")) {
	DataStore.set("Custom-Cursor", false)
}
if (!DataStore.has("settings-dialogs-transparent")) {
	DataStore.set("settings-dialogs-transparent", false)
}
if (!DataStore.has("Hide-linking-settings")) {
	DataStore.set("Hide-linking-settings", true)
}
if (!DataStore.has("Hide-verify-acc")) {
	DataStore.set("Hide-verify-acc", true)
}


//Plugins DataStore
if (!DataStore.has("auto_accept")) {
	DataStore.set("auto_accept", false)
}
if (!DataStore.has("aram-only")) {
    DataStore.set("aram-only", false)
}
if (!DataStore.has("Old-League-Loader-Settings")) {
	DataStore.set("Old-League-Loader-Settings", true)
}
if (!DataStore.has("Auto-ban-pick")) {
	DataStore.set("Auto-ban-pick", true)
}
if (!DataStore.has("Auto-Find-Queue")) {
	DataStore.set("Auto-Find-Queue", false)
}
if (!DataStore.has("Gamemode")) {
	DataStore.set("Gamemode", 450)
}
if (!DataStore.has("Custom-Rank(Hover-card)")) {
	DataStore.set("Custom-Rank(Hover-card)", true)
}
if (!DataStore.has("Ranked Queue ID")) {
	DataStore.set("Ranked Queue ID", 0)
}
if (!DataStore.has("Ranked Tier ID")) {
	DataStore.set("Ranked Tier ID", 8)
}
if (!DataStore.has("Ranked Division ID")) {
	DataStore.set("Ranked Division ID", 0)
}
if (!DataStore.has("Custom-Status")) {
	DataStore.set("Custom-Status", true)
}
if (!DataStore.has("status-delay")) {
	DataStore.set("status-delay", 5000)
}
if (!DataStore.has("Merry-Christmas")) {
	DataStore.set("Merry-Christmas", true)
}
if (!DataStore.has("April fool` joke")) {
	DataStore.set("April fool` joke", false)
}
if (!DataStore.has("loot-helper")) {
	DataStore.set("loot-helper", true)
}
if (!DataStore.has("")) {
	DataStore.set("", true)
}


//Wallpapers DataStore
if (!DataStore.has("old-prev/next-button")) {
	DataStore.set("old-prev/next-button", false)
}
if (!DataStore.has('pause-audio')) {
	DataStore.set('pause-audio', 1)
}
if (!DataStore.has("mute-audio")) {
	DataStore.set("mute-audio", false)
}
if (!DataStore.has('pause-wallpaper')) {
	DataStore.set('pause-wallpaper', 1)
}
if (!DataStore.has('wallpaper-index')) {
	DataStore.set('wallpaper-index', 0)
}
else if (DataStore.get('wallpaper-index')+1>wallpapers.length) {
	DataStore.set('wallpaper-index', 0)
}
else []
if (!DataStore.has("NextBg_Count")) {
	DataStore.set("NextBg_Count",0)
}
if (!DataStore.has('audio-index')) {
	DataStore.set('audio-index', 0)
}
else if (DataStore.get('audio-index')+1>Audios.length) {
	DataStore.set('audio-index', 0)
}
if (!DataStore.has("wallpaper-volume")) {
	DataStore.set("wallpaper-volume", 0.0)
}
if (!DataStore.has("audio-volume")) {
	DataStore.set("audio-volume", 0.3)
}
if (!DataStore.has("audio-loop")) {
	DataStore.set("audio-loop", false)
}

//___________________________________________________________________________//



//___________________________________________________________________________//
var nodeRemovedEvent = function (event) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let elainaBg     = document.getElementById("elaina-bg")
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		if (!elainaBg || !viewportRoot) {
			return
		}
		viewportRoot.style.filter = "none"
		elainaBg.style.filter     = data["Homepage"]

		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent)
	}
}

document.addEventListener("DOMNodeRemoved", nodeRemovedEvent)
//___________________________________________________________________________//



//___________________________________________________________________________//
function newStyle (cssvar,folder,name,css) {
	let NStyle = document.createElement('style')
		NStyle.appendChild(document.createTextNode(
			'@import url("'+css+'");:root {'+cssvar+':url('+folder+'/'+name+')}'
		))
	document.body.appendChild(NStyle)
}
//___________________________________________________________________________//



//___________________________________________________________________________//
function create_element(tagName, className, content) {
	const el = document.createElement(tagName)
	el.className = className
	if (content) {
		el.innerHTML = content
	}
	return el
}

function go_to_default_home_page() {
	document.querySelector(`lol-uikit-navigation-item[item-id='elaina-home']`).click()
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
			elaina_home_navbar_item.textContent = lang[langMap[langCode] || "EN"]["home"]

			navbar.prepend(elaina_home_navbar_item)
		}
	}
}

function patch_default_home_page(){
	let loop = 0
	let intervalId = window.setInterval(() => {
		loop++
		if (loop >= 21) {window.clearInterval(intervalId)}
		go_to_default_home_page()
	}, 100)
}
//___________________________________________________________________________//



//___________________________________________________________________________//
function elaina_play_pause() {
	let elaina_bg_elem = document.getElementById("elaina-bg")
	if (DataStore.get('pause-wallpaper')%2==0) {
		elaina_bg_elem.pause()
	}
	else {
		elaina_bg_elem.play()
	}
}

function play_pause_set_icon(elem) {
	let pause_bg_icon = elem || document.querySelector(".pause-bg-icon")

	if (!pause_bg_icon) {
		return
	}
	if (DataStore.get('pause-wallpaper')%2==0) {
		pause_bg_icon.setAttribute("src", `${path}/Icon/play_button.png`)
	}
	else {
		pause_bg_icon.setAttribute("src", `${path}/Icon/pause_button.png`)
	}
}
//___________________________________________________________________________//



//___________________________________________________________________________//
function audio_play_pause() {
	let audio = document.getElementById("bg-audio")

	if (DataStore.get('pause-audio')%2==0) {
		audio.pause()
	}
	else {
		audio.play()
	}
}

function play_pause_set_icon_audio(elem) {
	let pause_audio_icon = elem || document.querySelector(".pause-audio-icon")

	if (!pause_audio_icon) {
		return
	}
	if (DataStore.get('pause-audio')%2==0) {
		pause_audio_icon.setAttribute("src", `${path}/Icon/play_button.png`)
	}
	else {
		pause_audio_icon.setAttribute("src", `${path}/Icon/pause_button.png`)
	}

}
//___________________________________________________________________________//



//___________________________________________________________________________//
function audio_mute() {
	let audio          = document.getElementById("bg-audio")
	let wallpaperaudio = document.getElementById("elaina-bg")

	if (DataStore.get("mute-audio")) {
		wallpaperaudio.volume = 0.0
		audio.volume          = 0.0
	}
	else {
		wallpaperaudio.volume = DataStore.get("wallpaper-volume")
		audio.volume          = DataStore.get("audio-volume")
	}
}

function mute_set_icon_audio(elem) {
	let mute_audio_icon = elem || document.querySelector(".mute-audio-icon")

	if (!mute_audio_icon) {
		return
	}
	if (DataStore.get("mute-audio")) {
		mute_audio_icon.setAttribute("src", `${path}/Icon/mute.png`)
	}
	else {
		mute_audio_icon.setAttribute("src", `${path}/Icon/audio.png`)
	}

}
//___________________________________________________________________________//





//___________________________________________________________________________//
function loadBG(BG) {
	let elainaBg = document.getElementById("elaina-bg")
	elainaBg.src = `${path}/Backgrounds/${BG}`
}

function loadSong(song) {
	let audio     = document.getElementById("bg-audio")
    	audio.src = `${path}/Backgrounds/Audio/${song}`
}

function next_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
		elainaBg.classList.add("webm-hidden")

	DataStore.set('wallpaper-index', DataStore.get('wallpaper-index')+1)
    if (DataStore.get('wallpaper-index') > wallpapers.length-1) {
        DataStore.set('wallpaper-index', 0)
    }
	console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file)

	setTimeout(function () {
		loadBG(wallpapers[DataStore.get('wallpaper-index')].file)
		elaina_play_pause()
		elainaBg.classList.remove("webm-hidden")
	}, 500)
}
function prev_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
		elainaBg.classList.add("webm-hidden")

	DataStore.set('wallpaper-index', DataStore.get('wallpaper-index')-1)
    if (DataStore.get('wallpaper-index') < 0) {
        DataStore.set('wallpaper-index', wallpapers.length-1)
    }
	console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file)

	setTimeout(function () {
		loadBG(wallpapers[DataStore.get('wallpaper-index')].file)
		elaina_play_pause()
		elainaBg.classList.remove("webm-hidden")
	}, 500)
}

function nextSong() {
	if (DataStore.get("Continues_Audio")) {
		DataStore.set('audio-index', DataStore.get('audio-index')+1)

		if (DataStore.get('audio-index') > Audios.length-1) {
			DataStore.set('audio-index', 0)
		}
		loadSong(Audios[DataStore.get('audio-index')])
		audio_play_pause()
		console.log("Now playing "+Audios[DataStore.get('audio-index')])
	}
	else {
		songIndex++

		if (songIndex > Audios.length-1) {
			songIndex = 0
		}
		loadSong(Audios[songIndex])
		audio_play_pause()
		console.log("Now playing "+Audios[songIndex])
	}
}
function prevSong() {
	if  (DataStore.get("Continues_Audio")) {
    	DataStore.set('audio-index', DataStore.get('audio-index')-1)

		if (DataStore.get('audio-index') < 0) {
			DataStore.set('audio-index', Audios.length-1)
		}
		loadSong(Audios[DataStore.get('audio-index')])
		audio_play_pause()
		console.log("Now playing "+Audios[DataStore.get('audio-index')])
	}
	else {
		songIndex--

		if (songIndex < 0) {
			songIndex = Audios.length-1
		}
		loadSong(Audios[songIndex])
		audio_play_pause()
		console.log("Now playing "+Audios[songIndex])
	}
}
//___________________________________________________________________________//





//___________________________________________________________________________//
function create_webm_buttons() {
	const container      = document.createElement("div")
	const container2     = document.createElement("div")
	const newbgchange    = document.createElement("div")

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

	const muteAudio      = document.createElement("div")
	const muteaudioIcon  = document.createElement("img")

	const bgdropdown     = document.createElement("lol-uikit-framed-dropdown")
	
	container.classList.add("webm-bottom-buttons-container")
	container2.classList.add("newbgchange-container")
	
	

	pauseBg.id    = "pause-bg"
	nextBg.id     = "next-bg"
	prevBg.id     = "prev-bg"

	pauseAudio.id = "pause-audio"
	nextAudio.id  = "next-audio"
	prevAudio.id  = "prev-audio"

	muteAudio.id  = "mute-audio"

	newbgchange.id= "newbgchange"
	bgdropdown.id = "bgdropdown"

	pauseBgIcon.classList.add("pause-bg-icon")
	nextBgIcon.classList.add("next-bg-icon")
	prevBgIcon.classList.add("prev-bg-icon")

	pauseAudioIcon.classList.add("pause-audio-icon")
	nextAudioIcon.classList.add("next-audio-icon")
	prevAudioIcon.classList.add("prev-audio-icon")

	muteaudioIcon.classList.add("mute-audio-icon")
	
	play_pause_set_icon_audio(pauseAudioIcon)
	play_pause_set_icon(pauseBgIcon)
	mute_set_icon_audio(muteaudioIcon)

	pauseAudio.addEventListener("click", () => {
		DataStore.set('pause-audio', DataStore.get('pause-audio') + 1)
		audio_play_pause()
		play_pause_set_icon_audio()
	})	
	pauseBg.addEventListener("click", () => {
		DataStore.set('pause-wallpaper', DataStore.get('pause-wallpaper') + 1)
		elaina_play_pause()
		play_pause_set_icon()
	})
	muteAudio.addEventListener("click", () => {
		DataStore.set("mute-audio", !DataStore.get("mute-audio"))
		audio_mute()
		mute_set_icon_audio()
	})

	nextBg.addEventListener("click", () => {
		DataStore.set("NextBg_Count", DataStore.get("NextBg_Count") + 1)
		if (DataStore.get("NextBg_Count") == 69) {
			window.open("https://media.discordapp.net/attachments/887677396315172894/1100385074299539556/100259683_p0_master1200.png", "_blank")
			DataStore.set("NextBg_Count",0)
		}
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

	nextBgIcon.setAttribute("src", `${path}/Icon/next_button.png`)
	prevBgIcon.setAttribute("src", `${path}/Icon/prev_button.png`)
	nextAudioIcon.setAttribute("src", `${path}/Icon/next-audio.png`)
	prevAudioIcon.setAttribute("src", `${path}/Icon/prev-audio.png`)
		
	let showcontainer = document.getElementsByClassName("rcp-fe-lol-home")[0]
	    showcontainer.appendChild(container)
		showcontainer.appendChild(container2)
	
	container.append(muteAudio, prevAudio, pauseAudio, nextAudio)

	muteAudio.append(muteaudioIcon)
	pauseAudio.append(pauseAudioIcon)
	prevAudio.append(prevAudioIcon)
	nextAudio.append(nextAudioIcon)
	pauseBg.append(pauseBgIcon)
	
	if (DataStore.get("old-prev/next-button")) {
		container2.append(pauseBg)
		container.append(prevBg, nextBg)
		nextBg.append(nextBgIcon)
		prevBg.append(prevBgIcon)
	}
	else {
		container2.append(newbgchange, pauseBg)
		newbgchange.append(bgdropdown)

		for (let i = 0 ;i < wallpapers.length ;i++) {
			const opt = wallpapers[i]
			const el = document.createElement("lol-uikit-dropdown-option")
			el.setAttribute("slot", "lol-uikit-dropdown-option")
			el.innerText = opt.file
			el.id = opt.id
			el.onclick = () => {
				let elainaBg = document.getElementById("elaina-bg")
					elainaBg.classList.add("webm-hidden")
					DataStore.set('wallpaper-index', opt.id)
				console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file)

				setTimeout(function () {
					loadBG(wallpapers[DataStore.get('wallpaper-index')].file)
					elaina_play_pause()
					elainaBg.classList.remove("webm-hidden")
				}, 500)
			}
			if (DataStore.get('wallpaper-index') == opt.id) {
				el.setAttribute("selected", "true")
			}
			bgdropdown.appendChild(el)
		}
	}
}

function Delbuttons() {
	document.getElementsByClassName("webm-bottom-buttons-container")[0].remove()
	document.getElementsByClassName("newbgchange-container")[0].remove()
}
//___________________________________________________________________________//



//___________________________________________________________________________//
let updateLobbyRegaliaBanner = async message => {
	let phase = JSON.parse(message["data"])[2]["data"]

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
		},200)
	}
}
//___________________________________________________________________________//





//___________________________________________________________________________//
let pageChangeMutation = async (node) => {
	let pagename, previous_page, ranked_observer
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
		elaina_bg_elem.style.filter = data["Homepage"]
		if (!document.getElementsByClassName("webm-bottom-buttons-container").length) {
			create_webm_buttons()
			watermark.ElainaTrigger()
			if (DataStore.get("Receive-Update")) {
				let newVersion = (await (() => import('https://rawcdn.githack.com/Elaina69/Elaina-V2/0ef31f4bd1e319d7f55aedaf9790e3f1e3a77b17/configs/Version.js'))()).default
				if (thisVersion < newVersion) {
					Update.UpdatePopup()
				}
			}
		}
		add_elaina_home_page()
		add_elaina_home_navbar()
		go_to_default_home_page()
		if (previous_page == "rcp-fe-lol-parties" ){
			patch_default_home_page()
		}
		
		window.setTimeout(async () => {
			if (DataStore.get("Auto-Find-Queue") && !data["Aram-only-mode"]) {
				await fetch('/lol-lobby/v2/lobby', {
					method: 'POST',
					body: JSON.stringify({ queueId: DataStore.get("Gamemode") }),
					headers: {
					'Content-Type': 'application/json'
					}
				})
				window.setTimeout(async () => {
					await fetch('/lol-lobby/v2/lobby/matchmaking/search', {
						method: 'POST'
					})
				},data["Find-Delay"]*1000)
			}
			else if (DataStore.get("Auto-Find-Queue") && data["Aram-only-mode"]) {
				await fetch('/lol-lobby/v2/lobby', {
					method: 'POST',
					body: JSON.stringify({ queueId: 450 }),
					headers: {
					'Content-Type': 'application/json'
					}
				})
				window.setTimeout(async () => {
					await fetch('/lol-lobby/v2/lobby/matchmaking/search', {
						method: 'POST'
					})
				},data["Find-Delay"]*1000)
			}
		},data["Create-Delay"]*1000)
		window.setInterval(() => {
			try {
				let homecontent = document.querySelector('.rcp-fe-lol-home > lol-uikit-section-controller > lol-uikit-section > #overview > iframe[referrerpolicy = "no-referrer-when-downgrade"]')
					homecontent.contentWindow.document.querySelector("body").style.background = "#00000073"
					homecontent.contentWindow.document.querySelector("#gatsby-focus-wrapper > div > div > div > div > div > div > div > img").src = "none"

			}
			catch {}
		},100)
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
		window.setInterval(() => {
			try {
				let storeIframe = document.querySelector('#rcp-fe-lol-store-iframe > iframe[referrerpolicy = "no-referrer-when-downgrade"]')
					storeIframe.contentWindow.document.querySelector("#root > div > div.item-page.container.content.clearfix > div.item-page-items-container-wrapper.purchase-history-page-content-wrapper").style.background = "transparent"
		
				let th = storeIframe.contentWindow.document.querySelectorAll("#root > div > div.item-page.container.content.clearfix > div.item-page-items-container-wrapper.purchase-history-page-content-wrapper > div > div > table > thead > tr > th")
				for (let i = 0; i < th.length; i++) {
					th[i].style.background = "transparent"
				}
			}
			catch {}
		},100)
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
        let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')
    
        window.setInterval(() => {
            try {
                document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div:nth-child(2) > img").remove()
                document.querySelector("div > div.summoner-xp-radial").remove()
            }
            catch {}
			if (DataStore.get("Custom-Rank-Name")) {
				try {
					document.querySelector(".style-profile-ranked-component.ember-view > .style-profile-emblem-wrapper  > .style-profile-emblem-header > .style-profile-emblem-header-title").innerHTML = DataStore.get("Rank-line1")
					document.querySelector(".style-profile-emblem-subheader-ranked > div").innerHTML = DataStore.get("Rank-line2")
				}
				catch{}
			}
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
                })
            })
            ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false })
        }		
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
		if (brightness_modifiers.indexOf(pagename) == -1)
			elaina_bg_elem.style.filter = data["Homepage"]
        if (ranked_observer)
        ranked_observer.disconnect()
        ranked_observer = undefined
	}
	if (pagename == "rcp-fe-lol-parties") {
		elaina_bg_elem.style.filter = data["Parties"]
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (previous_page != pagename) {
		previous_page = pagename
	}	
}
//___________________________________________________________________________//



//___________________________________________________________________________//
window.setInterval(() => {
	if (DataStore.get("settings-dialogs-transparent")) {
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch{}
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch {}
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").remove()}catch{}
		try {document.querySelector(".lol-settings-container").style.background = "var(--Settings-and-Dialog-frame-color)"}catch {}
		try {document.querySelector(".lol-settings-container").shadowRoot.querySelector("div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch{}
		try {document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch{}
	}

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
	try{
		if (DataStore.get("Custom_RP")) {
			document.querySelector("div.currency-rp").innerHTML = `${DataStore.get("RP-data")}`
		}
	}
	catch{}
	try{
		if (DataStore.get("Custom_BE")) {
			document.querySelector(".currency-be-component.ember-view").innerHTML = `<div class=\"currency-be-icon-container\">\n  <div class=\"currency-be-icon-static\"></div>\n  <lol-uikit-video type=\"intro\" src=\"/fe/lol-navigation/add-blue-essence.webm\" class=\"animation-add-blue-essence\"></lol-uikit-video>\n  <lol-uikit-video type=\"intro\" src=\"/fe/lol-navigation/remove-blue-essence.webm\" class=\"animation-remove-blue-essence\"></lol-uikit-video>\n</div>\n\n${DataStore.get("BE")}\n`
		}
	}
	catch{}
}, 500)

import './resources/Pandoru'
import wt from './resources/Watermark'
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', () => {
	newStyle("--Hover-card-backdrop",path+"/Icon",data['Hover-card'])

	if (DataStore.get("Sidebar-Transparent")) {utils.addCss(`${path}/Css/Addon-Css/Sidebar-Transparent.css`)}
	else {utils.addCss(`${path}/Css/Addon-Css/Sidebar-Color.css`)}

	if (DataStore.get("Animate-Loading")) {newStyle("--ElainaFly",path+"/Icon",data["Animation-logo"],`${path}/Css/Addon-Css/Animate-Loading-Screen.css`)}
	else {newStyle("--ElainaStatic",path+"/Icon",data["Static-logo"],`${path}/Css/Addon-Css/Static-Loading-Screen.css`)}

	if (DataStore.get("Hide-Champions-Splash-Art")) {utils.addCss(`${path}/Css/Addon-Css/Hide-Champs-Splash-Art.css`)}

	if (Avatar) {newStyle("--Avatar",path+"/Icon",data["Avatar"],`${path}/Css/Addon-Css/Icon/Avatar.css`)}

	if (DataStore.get("Custom-Icon")) {
		newStyle("--RP-Icon",path+"/Icon",data["RP-icon"],`${path}/Css/Addon-Css/Icon/RiotPoint.css`)
		newStyle("--BE-Icon",path+"/Icon",data["BE-icon"],`${path}/Css/Addon-Css/Icon/BlueEssence.css`)
		newStyle("--Rank-Icon",path+"/Icon",data["Rank-icon"],`${path}/Css/Addon-Css/Icon/Rank.css`)
		newStyle("--Emblem",path+"/Icon",data["Emblem"],`${path}/Css/Addon-Css/Icon/Emblem.css`)
		newStyle("--Clash-banner",path+"/Icon",data["Class-banner"],`${path}/Css/Addon-Css/Icon/ClashBanner.css`)
		newStyle("--Ticker",path+"/Icon",data["Ticker"],`${path}/Css/Addon-Css/Icon/Ticker.css`)
	}
	
	if (DataStore.get("Custom-Font")) {
		let CusFont = document.createElement('style')
		CusFont.appendChild(document.createTextNode(
			'@font-face {font-family: "Custom"  src: url('+path+"/Fonts/"+data["Font-Name"]+')}'
		))
		document.body.appendChild(CusFont)
	}

	if (DataStore.get("Custom-Cursor")) {
		let cursor = document.createElement("div")
			cursor.classList.add("cursor")
			cursor.style.background = 'url('+path+"/Icon/"+data["Mouse-cursor"]+')'

		document.addEventListener('mousemove', function(e){
			var x = e.clientX
			var y = e.clientY
			cursor.style.transform = `translate3d(calc(${e.clientX}px - 40%), calc(${e.clientY}px - 40%), 0)`
		})
		let body = document.querySelector("html")
			body.appendChild(cursor)
		utils.addCss(`${path}/Css/Addon-Css/Cursor.css`)
	}

	let addFont = document.createElement('style')
		addFont.appendChild(document.createTextNode(
			'@font-face {font-family: "Elaina"  src: url('+path + "/Fonts/BeaufortforLOL-Bold.ttf" +')}'
		))
	document.body.appendChild(addFont)
	
	const video = document.createElement('video')
	const audio = document.createElement("audio")

		video.id       = 'elaina-bg'
		video.autoplay = true
		video.loop     = true
		video.src      = `${path}/Backgrounds/${wallpapers[DataStore.get('wallpaper-index')].file}`
		video.volume   = DataStore.get("wallpaper-volume")

		audio.id       = 'bg-audio'
    	audio.autoplay = true
    	audio.loop     = DataStore.get("audio-loop")
		if (DataStore.get("Continues_Audio")) {
			audio.src  = `${path}/Backgrounds/Audio/${Audios[DataStore.get('audio-index')]}`
		}
		else {
			audio.src  = `${path}/Backgrounds/Audio/${Audios[songIndex]}`
		}
		audio.volume   = DataStore.get("audio-volume")
	
	audio.addEventListener("ended", nextSong)
	video.addEventListener("load", ()=>{ 
		video.play()
	}, true)
    audio.addEventListener("load", ()=>{ 
		audio.play()
		if (DataStore.get("Continues_Audio")) {
			audio.currentTime = DataStore.get("currentAudioPlay")
		}
	}, true)

	document.querySelector("body").prepend(video)
    document.querySelector("body").prepend(audio)
	elaina_play_pause()

	utils.mutationObserverAddCallback(pageChangeMutation, ["screen-root"])
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner)
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]
		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("elaina-bg").style.filter = data["Gamestart"]
			document.getElementById("elaina-bg").pause()
			document.getElementById("bg-audio").pause()
		}
		else {
			elaina_play_pause()
			audio_play_pause()
			audio_mute()
		}
	})

	window.setInterval(()=> {
		DataStore.set("currentAudioPlay", audio.currentTime)
	},100)

	if (DataStore.get("Continues_Audio")) {console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file+" and "+Audios[DataStore.get('audio-index')])}
	else {console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file+" and "+Audios[songIndex])}
})
//___________________________________________________________________________//