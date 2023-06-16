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
import thisVersion from './configs/Version'
import QueueID     from './resources/Misc/QueueID.json'

//Addon plugins
import './resources/ThemeSettings'
import './resources/Auto-accept'
import './resources/Dodge-button'
import './resources/Offline-mode'
import './resources/Hide_friendlist'
import './resources/FakeIP'
import './resources/Auto-Ban-Pick'
import './resources/LootHelper'
import './resources/RandomSkin'

//___________________________________________________________________________//
let path       = new URL(".", import.meta.url).href + "assets"
let newVersion = (await (() => import('https://gitloaf.com/cdn/Elaina69/Elaina-V2/main/configs/Version.js'))()).default

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
if (!DataStore.has("new-gamesearch-div")) {
	DataStore.set("new-gamesearch-div", true)
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
if (!DataStore.has("Create-Delay")) {
	DataStore.set("Create-Delay", 20000)
}
if (!DataStore.has("Find-Delay")) {
	DataStore.set("Find-Delay", 3000)
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
if (!DataStore.has("random-skin")) {
	DataStore.set("random-skin", false)
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
if (!DataStore.has("audio-loop")) {
	DataStore.set("audio-loop", false)
}

//___________________________________________________________________________//



//___________________________________________________________________________//
function newStyle (cssvar,folder,name,css) {
	let NStyle = document.createElement('style')
		NStyle.appendChild(document.createTextNode(
			'@import url("'+css+'");:root {'+cssvar+':url('+folder+'/'+name+')}'
		))
	document.body.appendChild(NStyle)
}
function newFont (font,font_family) {
	let Font = document.createElement('style')
		Font.appendChild(document.createTextNode(
			'@font-face {font-family: '+font_family+'; src: url('+path+"/Fonts/"+font+')}'
		))
	document.body.appendChild(Font)
}
function CustomCursor (folder,css) {
	let cursor = document.createElement("div")
			cursor.classList.add("cursor")
			cursor.style.background = folder

	document.addEventListener('mousemove', function(e){
		var x = e.clientX
		var y = e.clientY
		cursor.style.transform = `translate3d(calc(${e.clientX}px - 40%), calc(${e.clientY}px - 40%), 0)`
	})
	let body = document.querySelector("html")
		body.appendChild(cursor)
	utils.addCss(css)
}
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

	if (!pause_audio_icon) {return}
	if (DataStore.get('pause-audio')%2==0) {
		pause_audio_icon.setAttribute("src", `${path}/Icon/play_button.png`)
	}
	else {
		pause_audio_icon.setAttribute("src", `${path}/Icon/pause_button.png`)
	}

}
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

	if (!mute_audio_icon) {return}
	if (DataStore.get("mute-audio")) {
		mute_audio_icon.setAttribute("src", `${path}/Icon/mute.png`)
	}
	else {
		mute_audio_icon.setAttribute("src", `${path}/Icon/audio.png`)
	}

}
function audio_loop() {
	let audio = document.getElementById("bg-audio")

	if (DataStore.get('audio-loop')) {
		audio.loop = true
		audio.nodeRemovedEvent("ended")
	}
	else {
		audio.loop = false
		audio.addEventListener("ended", nextSong)
	}
}
function audio_loop_icon(elem) {
	let audio_loop_icon = elem || document.querySelector(".audio-loop-icon")

	if (!audio_loop_icon) {return}
	if (DataStore.get("audio-loop")) {
		audio_loop_icon.setAttribute("src", `${path}/Icon/rotating-arrow.png`)
	}
	else {
		audio_loop_icon.setAttribute("src", `${path}/Icon/Unrotating-arrow.png`)
	}

}
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
function newTicker() {
	let ticker = document.querySelector("#lol-uikit-layer-manager-wrapper > lol-uikit-full-page-backdrop > lol-uikit-flyout-frame")
	if (ticker) {
		ticker.shadowRoot.querySelector("div > div.border").style.display = "none"
		ticker.shadowRoot.querySelector("div > div.sub-border").style.display = "none"
		ticker.shadowRoot.querySelector("div > div.caret").style.display = "none"
		ticker.shadowRoot.querySelector("div > div.lol-uikit-flyout-frame").style.backgroundColor = "black"
		ticker.shadowRoot.querySelector("div > div.lol-uikit-flyout-frame").style.borderRadius = "10px"
	}
}
function newGameSearch() {
	if (DataStore.get("new-gamesearch-div") && document.querySelector("lol-social-panel > lol-parties-game-info-panel")) {
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
				gamesearch.querySelector("div > div.parties-game-search-divider").style.display = "none"

			document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-bg-container").style.backgroundImage = "none"
			document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-status-card").shadowRoot.
				querySelector("div > div.parties-status-card-body > div.parties-status-card-map.game_map_howling_abyss").style.margin = "-3px 10px 0 0"
		}catch{}
	}
}
function CustomRP() {
	let RP = document.querySelector("div.currency-rp")
	if (DataStore.get("Custom_RP") && RP) {
		RP.innerHTML = `${DataStore.get("RP-data")}`
	}
}
function CustomBE() {
	let BE = document.querySelector(".currency-be-component.ember-view")
	if (DataStore.get("Custom_BE") && BE) {
		BE.innerHTML = 
			`<div class=\"currency-be-icon-container\">\n  
				<div class=\"currency-be-icon-static\"></div>\n  
				<lol-uikit-video type=\"intro\" src=\"/fe/lol-navigation/add-blue-essence.webm\" class=\"animation-add-blue-essence\"></lol-uikit-video>\n  
				<lol-uikit-video type=\"intro\" src=\"/fe/lol-navigation/remove-blue-essence.webm\" class=\"animation-remove-blue-essence\"></lol-uikit-video>\n
			</div>\n\n
			${DataStore.get("BE")}\n`
	}
}
function CustomStatus() {
	let time
    let i = 0
    let status = data["Custom-Status"]
    if (status.length == 1) {time = 10000}
    else {time = DataStore.get("status-delay")}
    
    window.setInterval( async ()=> {
        if (i == status.length - 1) {i = 0}
        else {i++}
        const statusMessage = status[i]["lines"].slice().join("\\n")
            await fetch("/lol-chat/v1/me", {
                method :"PUT",
                headers:{"content-type":"application/json"},
                body   :`{"statusMessage":"${statusMessage}"}`
            }) 
    },time)
}
function CustomRank() {
	let queueOptions = ["RANKED_SOLO_5x5","RANKED_FLEX_SR","RANKED_FLEX_TT",
                        "RANKED_TFT","RANKED_TFT_TURBO","RANKED_TFT_DOUBLE_UP",
    ]
    let tierOptions = ["IRON","BRONZE","SILVER","GOLD","PLATINUM",
                       "DIAMOND","MASTER","GRANDMASTER","CHALLENGER"
    ]
    let divisionOptions = ["I", "II", "III", "IV"];
    let requestBody = {
        "lol": {
            "rankedLeagueQueue"    : queueOptions[DataStore.get("Ranked Queue ID")],
            "rankedLeagueTier"     : tierOptions[DataStore.get("Ranked Tier ID")],
            "rankedLeagueDivision" : divisionOptions[DataStore.get("Ranked Division ID")]
        }
    }
    window.setInterval(async()=>{
        await fetch("/lol-chat/v1/me", {
            method : "PUT",
            headers: {"content-type": "application/json"},
            body   : JSON.stringify(requestBody)
        })
    },10000)
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
	const audioLoop      = document.createElement("div")
	const audioLoopIcon  = document.createElement("img")

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
	audioLoop.id  = "audio-loop"

	newbgchange.id= "newbgchange"
	bgdropdown.id = "bgdropdown"

	pauseBgIcon.classList.add("pause-bg-icon")
	nextBgIcon.classList.add("next-bg-icon")
	prevBgIcon.classList.add("prev-bg-icon")

	pauseAudioIcon.classList.add("pause-audio-icon")
	nextAudioIcon.classList.add("next-audio-icon")
	prevAudioIcon.classList.add("prev-audio-icon")

	muteaudioIcon.classList.add("mute-audio-icon")
	audioLoopIcon.classList.add("audio-loop-icon")
	
	play_pause_set_icon_audio(pauseAudioIcon)
	play_pause_set_icon(pauseBgIcon)
	mute_set_icon_audio(muteaudioIcon)
	audio_loop_icon(audioLoopIcon)

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
	audioLoop.addEventListener("click", () => {
		DataStore.set("audio-loop", !DataStore.get("audio-loop"))
		audio_loop()
		audio_loop_icon()
	})
	nextBg.addEventListener("click", () => {
		DataStore.set("NextBg_Count", DataStore.get("NextBg_Count") + 1)
		next_wallpaper()
		if (DataStore.get("NextBg_Count") == 69) {
			window.open("https://media.discordapp.net/attachments/887677396315172894/1100385074299539556/100259683_p0_master1200.png", "_blank")
			DataStore.set("NextBg_Count",0)
		}
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
	
	container.append(muteAudio, prevAudio, pauseAudio, nextAudio, audioLoop)

	muteAudio.append(muteaudioIcon)
	pauseAudio.append(pauseAudioIcon)
	prevAudio.append(prevAudioIcon)
	nextAudio.append(nextAudioIcon)
	pauseBg.append(pauseBgIcon)
	audioLoop.append(audioLoopIcon)
	
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
			const id = i
			el.setAttribute("slot", "lol-uikit-dropdown-option")
			el.innerText = opt.file
			el.onclick = () => {
				let elainaBg = document.getElementById("elaina-bg")
					elainaBg.classList.add("webm-hidden")
					DataStore.set('wallpaper-index', id)
				console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file)

				setTimeout(function () {
					loadBG(wallpapers[DataStore.get('wallpaper-index')].file)
					elaina_play_pause()
					elainaBg.classList.remove("webm-hidden")
				}, 500)
			}
			if (DataStore.get('wallpaper-index') == id) {
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
function UpdatePopup() {
    const noticediv   = document.createElement("div")
    const messboxdiv  = document.createElement("div")
    const downloaddiv = document.createElement("div")
    const closediv    = document.createElement("div")
    const message     = document.createElement("p")
    const download    = document.createElement("a")
    const notice      = document.createElement("img")
    const close       = document.createElement("img")

    messboxdiv.classList.add("messdiv")
    downloaddiv.classList.add("downdiv")
    closediv.classList.add("closediv")
    close.classList.add("closenotice")
    message.classList.add("message")
    download.classList.add("download")
    noticediv.classList.add("noticediv")
    notice.classList.add("notice")

    notice.setAttribute('src', `${path}/Icon/download.png`)
    close.setAttribute('src', `${path}/Icon/close.png`)

    let showcontainer = document.getElementsByClassName("rcp-fe-lol-home")[0]

    showcontainer.appendChild(noticediv)
    noticediv.append(notice)

    noticediv.addEventListener('click', () => {
		const selectedLang = lang[langMap[langCode] || "EN"]

        showcontainer.appendChild(messboxdiv)
        showcontainer.appendChild(downloaddiv)
        showcontainer.appendChild(closediv)
        showcontainer.appendChild(message)
        closediv.append(close)
        downloaddiv.append(download)

        message.innerHTML = selectedLang["update_mess"]
        download.innerHTML = selectedLang["update"]

        download.setAttribute("href",'https://codeload.github.com/Elaina69/Elaina-V2/zip/refs/tags/v'+newVersion+'')
        download.setAttribute("target", '_blank')

        closediv.addEventListener('click', () => {
            try {
                document.getElementsByClassName("message")[0].remove()
                document.getElementsByClassName("download")[0].remove()
                document.getElementsByClassName("closenotice")[0].remove()
                document.getElementsByClassName("messdiv")[0].remove()
                document.getElementsByClassName("downdiv")[0].remove()
                document.getElementsByClassName("closediv")[0].remove()
            }
            catch {}
        })
    })
}
function DelPopup() {
    try {
        document.getElementsByClassName("notice")[0].remove()
        document.getElementsByClassName("noticediv")[0].remove()
        document.getElementsByClassName("message")[0].remove()
        document.getElementsByClassName("download")[0].remove()
        document.getElementsByClassName("closenotice")[0].remove()
        document.getElementsByClassName("messdiv")[0].remove()
        document.getElementsByClassName("downdiv")[0].remove()
        document.getElementsByClassName("closediv")[0].remove()
    }
    catch {}
}
async function createLoaderMenu(root) {
	const { Component, jsx, render } = await import('//esm.run/nano-jsx')
	const langCode = document.querySelector("html").lang;
	const langMap = lang.langlist
	const version = thisVersion
	const TRANSLATIONS = lang
	const _t = TRANSLATIONS[langMap[langCode] || "EN"];
	
	class LoaderMenu extends Component {
		visible = false
		frame = null
		opener = null
		didMount() {
			this.opener = document.querySelector('div[action=settings]')
			this.opener.addEventListener('click', e => {
				if (!this.visible) {
					e.stopImmediatePropagation()
					this.show(true)
				}
			})
		}
		show(on) {
			this.visible = on
			this.update()
			if (this.visible) {
				this.frame.shadowRoot.querySelector('lol-uikit-close-button')
					?.addEventListener('click', () => this.show(false))
			}
		}
		showDefaultSettings() {
			this.opener.click()
			this.show(false)
		}
		render() {
			return jsx/*html*/`
				<div class="modal" style="position: absolute; inset: 0px; z-index: 8500" hidden=${!this.visible || undefined}>
					<lol-uikit-full-page-backdrop class="backdrop" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px" />
					<div class="dialog-confirm" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px">
						<lol-uikit-dialog-frame ref=${el => (this.frame = el)} class="dialog-frame" orientation="bottom" close-button="false">
							<div class="dialog-content">
								<lol-uikit-content-block class="app-controls-exit-dialog" type="dialog-medium" style="position: relative; overflow: hidden">
									<div style="position: absolute; top: 60px">
										<video
											src="${path}/Icon/LL-Settings.webm"
											style="object-fit: cover; object-position: center center; height: 100%; width: 100%; transform-origin: center center; transform: scale(2.5)">
										</video>
									</div>
									<div style="position: relative">
										<div style="margin-bottom: 24px">
											<h4 style="padding: 6px 0">Elaina-V2</h4>
											<p>v${version}</p>
										</div>
										<hr class="heading-spacer" />
										<div style="display: flex; flex-direction: column; align-items: center; gap: 12px">
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 200px" onClick=${() => window.openDevTools()}>
												${_t['l.open_devtools']} (Ctrl-Shift-I)
											</lol-uikit-flat-button-secondary>
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 200px" onClick=${() => window.location.reload()}>
												${_t['l.reload_client']} (Ctrl-Shift-R)
											</lol-uikit-flat-button-secondary>
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 200px" onClick=${() => window.openPluginsFolder()}>
												${_t['l.open_plugins']}
											</lol-uikit-flat-button-secondary>
										</div>
										<hr class="heading-spacer" />
										<p style="padding: 20px 0" class="lol-settings-code-of-conduct-link lol-settings-window-size-text">
											<a href="https://github.com/Elaina69/Elaina-V2/releases" target="_blank">${_t['l.theme_releases']}</a>
										</p>
									</div>
								</lol-uikit-content-block>
							</div>
							<lol-uikit-flat-button-group type="dialog-frame">
								<lol-uikit-flat-button tabindex="1" class="button-accept" onClick=${() => this.showDefaultSettings()}>${_t['l.open_settings']}</lol-uikit-flat-button>
								<lol-uikit-flat-button tabindex="2" class="button-decline" onClick=${() => this.show(false)}>${_t['l.close']}</lol-uikit-flat-button>
							</lol-uikit-flat-button-group>
						</lol-uikit-dialog-frame>
					</div>
				</div>
			`
		}
	}
	render(jsx`<${LoaderMenu} />`, root)
}
//___________________________________________________________________________//



//___________________________________________________________________________//
let nodeRemovedEvent = function (event) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let elainaBg     = document.getElementById("elaina-bg")
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		if (!elainaBg || !viewportRoot) {return}
		viewportRoot.style.filter = "none"
		elainaBg.style.filter     = data["Homepage"]
		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent)
	}
}
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
				if (thisVersion < newVersion) {
					UpdatePopup()
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
			if (DataStore.get("Auto-Find-Queue") && !DataStore.get("aram-only")) {
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
				},DataStore.get("Find-Delay"))
			}
			else if (DataStore.get("Auto-Find-Queue") && DataStore.get("aram-only")) {
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
				},DataStore.get("Find-Delay"))
			}
		},DataStore.get("Create-Delay"))
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
			DelPopup()
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
	if (node.getAttribute("data-screen-name") == "rcp-fe-lol-parties") {
		window.setInterval(()=>{
			try{
				document.querySelector("div[data-game-mode='CLASSIC']").remove()
				document.querySelector("div[data-game-mode='TFT']").remove()
				document.querySelector("lol-uikit-navigation-item[data-category='VersusAi']").remove()
				document.querySelector("lol-uikit-navigation-item[data-category='Training']").remove()
			}
			catch{}
			try {
				if (document.getElementsByClassName("parties-game-navs-list")[0].getAttribute("selectedindex") == "0") {
					document.querySelector('div[data-game-mode=ARAM] div[class=parties-game-type-upper-half]').click()
				}
			}
			catch {}
		},10)
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
}, 500)
import './resources/Pandoru'
import wt from './resources/Watermark'
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', async () => {
	newStyle("--Hover-card-backdrop",path+"/Icon",data['Hover-card'])
	newFont("BeaufortforLOL-Bold.ttf","Elaina")

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
	if (DataStore.get("Custom-Font")) {newFont(data["Font-Name"],"Custom")}
	if (DataStore.get("Custom-Cursor")) {CustomCursor('url('+path+"/Icon/"+data["Mouse-cursor"]+')',`${path}/Css/Addon-Css/Cursor.css`)}
	if (DataStore.get("Custom-Status")) {CustomStatus()}
	if (DataStore.get("Custom-Rank(Hover-card)")) {CustomRank()}
	if (DataStore.get("aram-only")) {utils.addCss(`${path}/Css/Addon-Css/Aram-only.css`)}

	const manager = () => document.getElementById('lol-uikit-layer-manager-wrapper')
	const root    = document.createElement('div')
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
	
	if (!DataStore.get("audio-loop")) {audio.addEventListener("ended", nextSong)}
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

	utils.routineAddCallback(newTicker,["flyout"])
	utils.routineAddCallback(newGameSearch,["parties-game-section"])
	utils.routineAddCallback(CustomRP,["currency-rp"])
	utils.routineAddCallback(CustomBE,["currency-be"])

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
			audio_loop()
		}
	})

	window.setInterval(()=> {
		DataStore.set("currentAudioPlay", audio.currentTime)
	},100)

	if (DataStore.get("Continues_Audio")) {console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file+" and "+Audios[DataStore.get('audio-index')])}
	else {console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file+" and "+Audios[songIndex])}

	if (DataStore.get("Old-League-Loader-Settings")) {
		while (!manager()) await new Promise(r => setTimeout(r, 200))
		await createLoaderMenu(root)
		manager().prepend(root)
	}
})
//___________________________________________________________________________//