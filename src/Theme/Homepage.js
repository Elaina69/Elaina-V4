import LocalKey from "../CDN/UpdateKey-Local.js"
import utils from '../Utilities/_utils.js'
import { getThemeName } from "../OtherThings.js"

let datapath 	= new URL("..", import.meta.url).href
let iconFolder  = `${datapath}Assets/Icon/`
let bgFolder    = `${datapath}Assets/Backgrounds/`
let eConsole 	= "%c Elaina "
let eCss 		= "color: #ffffff; background-color: #f77fbe"
let thisVersion,CdnKey

DataStore.set("Font-folder", `${datapath}assets/Fonts/Custom/`)
DataStore.set("Plugin-folder-name",getThemeName())


//Set default value for backgrounds
let DefaultData = {
	"Wallpaper-list"	: ["Elaina1.webm"],
	"Audio-list"		: ["If_there_was_an_Endpoint.mp3"],
	"wallpaper-index"	: 0,
	"audio-index"		: 0,
	"wallpaper-volume"	: 0.0,
  	"audio-volume"		: 0.3,
	'mute-audio'		: false,
}

function setDefaultData(list) {
	Object.entries(list).forEach(([key, value]) => {
	  	if (!DataStore.has(key)) {
			DataStore.set(key, value);
			console.log(`${key} data restored`)
	  	}
	});
}

setDefaultData(DefaultData)


//get current summonerID
window.setTimeout(async()=> {
	DataStore.set("Summoner-ID", await utils.getSummonerID())
	console.log(eConsole+"%c Current summonerID: "+`%c${DataStore.get("Summoner-ID")}`,eCss,"color: #e4c2b3","color: #0070ff")
},7000)


//Add Elaina theme's homepage and set as default
function create_element(tagName, className, content) {
	const el = document.createElement(tagName)
	el.className = className
	if (content) {el.innerHTML = content}
	return el
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

async function add_elaina_home_navbar() {
	let navbar = document.querySelector(".rcp-fe-lol-home > lol-uikit-navigation-bar")

	if (navbar) {
		if (!navbar.querySelector("[item-id='elaina-home']")) {
			let elaina_home_navbar_item = create_element("lol-uikit-navigation-item", "")

			elaina_home_navbar_item.setAttribute("item-id", "elaina-home")
			elaina_home_navbar_item.setAttribute("priority", 1)
			elaina_home_navbar_item.textContent = await getString("home")

			navbar.prepend(elaina_home_navbar_item)
		}
	}
}

/**This will be replaced by under code in near future */
function go_to_default_home_page() {
	let intervalId = window.setInterval(() => {
		let home = document.querySelector(`lol-uikit-navigation-item[item-id='elaina-home']`)
		if (home) {
			home.click() 
			if (home.getAttribute("active") == "true") {
				window.setTimeout(()=>{
					window.clearInterval(intervalId)
				},1000)
			}
		}
	}, 100)
}

/**this not work yet, use above code instead */
export function setHomePage(context) { //man i dunnu how to do it
	// context.rcp.postInit("rcp-fe-lol-navigation", async (api) => {
	// 	const navigationManager = api._apiHome.navigationManager
	// 	api._apiHome.navigationManager = new Proxy(navigationManager, {
	// 		set(target, property, value) {
	// 			target[property] = (property === "firstNavItemId") ? "overview": value
	// 			return true
	// 		}
	// 	})
	// })
}


//Is theme running dev mode ?
if (DataStore.get("Dev-mode")) {
    CdnKey = (await (() => import(`//plugins/${getThemeName()}/elaina-theme-data/data/Update/UpdateKey-CDN.js`))()).default
    console.log(eConsole+"%c Running %cElaina theme - %cDev %cversion",eCss,"","color: #e4c2b3","color: red","")
}
else {
    CdnKey = (await (() => import("https://unpkg.com/elaina-theme-data@latest/data/Update/UpdateKey-CDN.js"))()).default
    console.log(eConsole+"%c Running %cElaina theme - %cStable %cversion",eCss,"","color: #e4c2b3","color: #00ff44","")
}


//Check theme version
if (CdnKey == LocalKey) {
	thisVersion = (await (() => import("https://unpkg.com/elaina-theme-data@latest/data/Update/Version.js"))()).default
	DataStore.set("Theme-version", thisVersion)
	if (!DataStore.get("Change-CDN-version")) {
		let cdnVersion = await (await fetch('https://unpkg.com/elaina-theme-data@latest/package.json')).json()
		DataStore.set("Cdn-version", cdnVersion["version"])
	}
}
console.log(eConsole+`%c Theme build: %c${DataStore.get("Theme-version")}`,eCss,"","color: #00ff44")
console.log(eConsole+`%c CDN build  : %c${DataStore.get("Cdn-version")}`,eCss,"","color: #00ff44")


//Hide and show hompeage tab
function hideTab(data,obj,name) {
	if (data) {
		try {
			document.querySelector(obj).style.display = "none"
			console.warn(eConsole+`%c ${name} tab deleted`,eCss,"")
		}
		catch {console.warn(eConsole+`%c This client don't have ${name} tab`,eCss,"")}
	}
}

function showTab(data,obj,name) {
	if (data) {
		try {
			document.querySelector(obj).style.display = "block"
		}catch {console.warn(eConsole+`%c This client don't have ${name} tab`,eCss,"")}
	}
}

function applyHidetab() {
	hideTab(DataStore.get("hide-overview"),'lol-uikit-navigation-item[item-id="overview"]',"Overview")
	hideTab(DataStore.get("hide-merch"),'lol-uikit-navigation-item[item-id="merch"]',"Merch")
	hideTab(DataStore.get("hide-patch-note"),'lol-uikit-navigation-item[item-id="latest_patch_notes"]',"Patch note")
	hideTab(DataStore.get("hide-esport"),'lol-uikit-navigation-item[item-id="news"]',"Esport")
}

function applyShowtab() {
	showTab(!DataStore.get("hide-overview"),'lol-uikit-navigation-item[item-id="overview"]',"Overview")
	showTab(!DataStore.get("hide-merch"),'lol-uikit-navigation-item[item-id="merch"]',"Merch")
	showTab(!DataStore.get("hide-patch-note"),'lol-uikit-navigation-item[item-id="latest_patch_notes"]',"Patch note")
	showTab(!DataStore.get("hide-esport"),'lol-uikit-navigation-item[item-id="news"]',"Esport")
}


//Add wallpaper/audio buttons
function elaina_play_pause() {
	let elaina_bg_elem = document.getElementById("elaina-bg")
	if (DataStore.get('pause-wallpaper')%2==0) {elaina_bg_elem.pause()}
	else {elaina_bg_elem.play()}
}

function play_pause_set_icon(elem) {
	let pause_bg_icon = elem || document.querySelector(".pause-bg-icon")

	if (!pause_bg_icon) {
		return
	}
	if (DataStore.get('pause-wallpaper')%2==0) {
		pause_bg_icon.setAttribute("src", `${iconFolder}Plugins-icons/play_button.png`)
	}
	else {
		pause_bg_icon.setAttribute("src", `${iconFolder}Plugins-icons/pause_button.png`)
	}
}

function audio_play_pause() {
	let audio = document.getElementById("bg-audio")

	if (DataStore.get('pause-audio')%2==0) {audio.pause()}
	else {audio.play()}
}

function play_pause_set_icon_audio(elem) {
	let pause_audio_icon = elem || document.querySelector(".pause-audio-icon")

	if (!pause_audio_icon) {return}
	if (DataStore.get('pause-audio')%2==0) {
		pause_audio_icon.setAttribute("src", `${iconFolder}Plugins-icons/play_button.png`)
	}
	else {
		pause_audio_icon.setAttribute("src", `${iconFolder}Plugins-icons/pause_button.png`)
	}

}

function audio_mute() {
	let audio          = document.getElementById("bg-audio")
	let wallpaperaudio = document.getElementById("elaina-bg")

	if (DataStore.get("mute-audio")) {
		wallpaperaudio.muted = true
		audio.muted          = true
		console.log(eConsole+`%c audio and wallpaper mute: %c${DataStore.get("mute-audio")}`,eCss,"","color: #00ff44")
	}
	else {
		wallpaperaudio.muted = false
		audio.muted          = false
		console.log(eConsole+`%c audio and wallpaper mute: %c${DataStore.get("mute-audio")}`,eCss,"","color: red")
	}
}

function mute_set_icon_audio(elem) {
	let mute_audio_icon = elem || document.querySelector(".mute-audio-icon")

	if (!mute_audio_icon) {return}
	if (DataStore.get("mute-audio")) {
		mute_audio_icon.setAttribute("src", `${iconFolder}Plugins-icons/mute.png`)
	}
	else {
		mute_audio_icon.setAttribute("src", `${iconFolder}Plugins-icons/audio.png`)
	}

}

function audio_loop() {
	let audio = document.getElementById("bg-audio")

	if (DataStore.get('audio-loop')) {
		audio.removeEventListener("ended", nextSong)
		console.log(eConsole+`%c Audio loop: %c${DataStore.get('audio-loop')}`,eCss,"","color: #00ff44")
		audio.addEventListener("ended", ()=> {
			audio.pause()
			audio.load()
		})
	}
	else {
		audio.addEventListener("ended", nextSong)
		console.log(eConsole+`%c Audio loop: %c${DataStore.get('audio-loop')}`,eCss,"","color: red")
	}
}

function audio_loop_icon(elem) {
	let audio_loop_icon = elem || document.querySelector(".audio-loop-icon")

	if (!audio_loop_icon) {return}
	if (DataStore.get("audio-loop")) {
		audio_loop_icon.setAttribute("src", `${iconFolder}Plugins-icons/rotating-arrow.png`)
	}
	else {
		audio_loop_icon.setAttribute("src", `${iconFolder}Plugins-icons/Unrotating-arrow.png`)
	}
}

function loadBG(BG) {
	let elainaBg = document.getElementById("elaina-bg")
	elainaBg.src = `${bgFolder}Wallpapers/${BG}`
}

function loadSong(song) {
	let audio     = document.getElementById("bg-audio")
    	audio.src = `${bgFolder}Audio/${song}`
}

function next_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
		elainaBg.classList.add("webm-hidden")

	DataStore.set('wallpaper-index', DataStore.get('wallpaper-index')+1)
    if (DataStore.get('wallpaper-index') > DataStore.get("Wallpaper-list").length-1) {
        DataStore.set('wallpaper-index', 0)
    }
	console.log(eConsole+`%c Now playing %c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}`,eCss,"","color: #0070ff")

	setTimeout(function () {
		loadBG(DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')])
		elaina_play_pause()
		elainaBg.classList.remove("webm-hidden")
	}, 500)
}

function prev_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
		elainaBg.classList.add("webm-hidden")

	DataStore.set('wallpaper-index', DataStore.get('wallpaper-index')-1)
    if (DataStore.get('wallpaper-index') < 0) {
        DataStore.set('wallpaper-index', DataStore.get("Wallpaper-list").length-1)
    }
	console.log(eConsole+`%c Now playing %c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}`,eCss,"","color: #0070ff")

	setTimeout(function () {
		loadBG(DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')])
		elaina_play_pause()
		elainaBg.classList.remove("webm-hidden")
	}, 500)
}

function nextSong() {
	if (DataStore.get("Continues_Audio")) {
		DataStore.set('audio-index', DataStore.get('audio-index')+1)

		if (DataStore.get('audio-index') > DataStore.get("Audio-list").length-1) {
			DataStore.set('audio-index', 0)
		}
		loadSong(DataStore.get("Audio-list")[DataStore.get('audio-index')])
		audio_play_pause()
		console.log(eConsole+`%c Now playing %c${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`,eCss,"", "color: #0070ff")
	}
}

function prevSong() {
	if  (DataStore.get("Continues_Audio")) {
    	DataStore.set('audio-index', DataStore.get('audio-index')-1)

		if (DataStore.get('audio-index') < 0) {
			DataStore.set('audio-index', DataStore.get("Audio-list").length-1)
		}
		loadSong(DataStore.get("Audio-list")[DataStore.get('audio-index')])
		audio_play_pause()
		console.log(eConsole+`%c Now playing %c${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`,eCss,"", "color: #0070ff")
	}
}

function create_webm_buttons() {
	const container      = document.createElement("div")
	const container2     = document.createElement("div")
	const newbgchange    = document.createElement("div")
	const pauseBg        = document.createElement("div")
	const nextBg         = document.createElement("div")
	const prevBg         = document.createElement("div")
	const pauseAudio     = document.createElement("div")
	const nextAudio      = document.createElement("div")
	const prevAudio      = document.createElement("div")
	const muteAudio      = document.createElement("div")
	const audioLoop      = document.createElement("div")
	const pauseBgIcon    = document.createElement("img")
	const nextBgIcon     = document.createElement("img")
	const prevBgIcon     = document.createElement("img")	
	const pauseAudioIcon = document.createElement("img")
	const nextAudioIcon  = document.createElement("img")
	const prevAudioIcon  = document.createElement("img")
	const muteaudioIcon  = document.createElement("img")
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
		if (DataStore.get("NextBg_Count") >= 69 && DataStore.get("NSFW-Content")) {
			window.open("https://elainatheme.xyz/Assets/100259683_p0.png", "_blank")
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

	nextBgIcon.setAttribute("src", `${iconFolder}Plugins-icons/next_button.png`)
	prevBgIcon.setAttribute("src", `${iconFolder}Plugins-icons/prev_button.png`)
	nextAudioIcon.setAttribute("src", `${iconFolder}Plugins-icons/next-audio.png`)
	prevAudioIcon.setAttribute("src", `${iconFolder}Plugins-icons/prev-audio.png`)
		
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

		for (let i = 0 ;i < DataStore.get("Wallpaper-list").length ;i++) {
			const opt = DataStore.get("Wallpaper-list")[i]
			const el = document.createElement("lol-uikit-dropdown-option")
			const id = i
			el.setAttribute("slot", "lol-uikit-dropdown-option")
			el.innerText = opt
			el.onclick = () => {
				let elainaBg = document.getElementById("elaina-bg")
				elainaBg.classList.add("webm-hidden")
				DataStore.set('wallpaper-index', id)
				console.log(eConsole+`%c Now playing %c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}`,eCss,"","color: #0070ff")

				setTimeout(function () {
					loadBG(DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')])
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


//Add content to homepage
let addHomepage = async (node) => {
    let pagename, previous_page
    let patcher_go_to_default_home_page = true
    pagename = node.getAttribute("data-screen-name")

    if (pagename == "rcp-fe-lol-home-main") {
		if (!document.getElementsByClassName("webm-bottom-buttons-container").length) {
			create_webm_buttons()
			add_elaina_home_page()
			add_elaina_home_navbar()
			go_to_default_home_page()
		}
		let delnavtab = window.setInterval(()=> {
			if (document.querySelector('lol-uikit-navigation-item[item-id="overview"]')) {
				window.clearInterval(delnavtab)
				applyHidetab()
			}
		},1000)
	}
	else if (pagename != "rcp-fe-lol-navigation-screen" && pagename != "window-controls" && pagename != "rcp-fe-lol-home" && pagename != "social" && document.getElementsByClassName("webm-bottom-buttons-container").length) {
		Delbuttons()
	}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		return
	}
	if (pagename == "social") {
		if (patcher_go_to_default_home_page){
			go_to_default_home_page()
			patcher_go_to_default_home_page = false
		}
	}
	if (pagename == "rcp-fe-lol-store") {
		let runtime = 0
		let purchaseHistory = window.setInterval(() => {
			try {
				runtime += 1
				let storeIframe = document.querySelector('#rcp-fe-lol-store-iframe > iframe[referrerpolicy = "no-referrer-when-downgrade"]').contentWindow.document.querySelector("div.item-page-items-container-wrapper.purchase-history-page-content-wrapper")
					storeIframe.style.background = "transparent"
				let th = storeIframe.querySelectorAll("div > div > table > thead > tr > th")
				for (let i = 0; i < th.length; i++) {
					th[i].style.background = "transparent"
				}
				if (storeIframe.style.background == "transparent") {
					window.clearInterval(purchaseHistory)
					console.log(eConsole+"%c Cleared Background ("+`%c${runtime/10}%c)`,eCss,"color: #e4c2b3","color: #0070ff","color: #e4c2b3")
				}
			}
			catch {}
		},100)
	}
    if (previous_page != pagename) {previous_page = pagename}
}

window.addEventListener("load",async ()=> {
	// Make sure video and element doesn't load before wallpaper/audio list
	window.setTimeout(()=>{
		const video = document.createElement('video')
		video.id       = 'elaina-bg'
		video.autoplay = true
		video.volume   = DataStore.get("wallpaper-volume")
		video.muted    = DataStore.get("mute-audio")
		try { video.src = `${bgFolder}Wallpapers/${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}` }catch {}
		video.addEventListener("error", ()=> {
			video.load()
			video.addEventListener("ended", () => video.load())
			DataStore.set("video-2nd-loop", true)
			console.log(eConsole+"%c There's problem with wallpaper.", eCss,"")
			Toast.error("There's problem with wallpaper.")
		})
		if (DataStore.get("video-2nd-loop")) 
			video.addEventListener("ended", () => video.load())
		else video.loop = true
		
		const audio = document.createElement("audio")
		audio.id       = 'bg-audio'
		audio.autoplay = true
		audio.src      = `${bgFolder}Audio/${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`
		audio.volume   = DataStore.get("audio-volume")
		audio.muted    = DataStore.get("mute-audio")
		if (DataStore.get('audio-loop')) 
			audio.addEventListener("ended", () => audio.load())
		else audio.addEventListener("ended", nextSong)
		audio.addEventListener("error", () => audio.load())

		document.querySelector("body").prepend(video)
		document.querySelector("body").prepend(audio)
		elaina_play_pause()

		utils.mutationObserverAddCallback(addHomepage, ["screen-root"])
		utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
			let phase = JSON.parse(message["data"])[2]["data"]
			if (phase == "GameStart" || phase == "InProgress") {
				if (DataStore.get("turnoff-audio-ingame")) {
					document.getElementById("elaina-bg").pause()
					document.getElementById("bg-audio").pause()
				}
			}
			else {
				elaina_play_pause()
				audio_play_pause()
			}
		})
	},2000)
})


// For debugging
let loopwallCss,muteCss,pausewall,pauseau
if (DataStore.get("mute-audio")) {muteCss = "color: #00ff44"} else {muteCss = "color: red"}
if (DataStore.get("audio-loop")) {loopwallCss = "color: #00ff44"} else {loopwallCss = "color: red"}
if (DataStore.get('pause-wallpaper')%2==0) {pausewall = "color: #00ff44"} else {pausewall = "color: red"}
if (DataStore.get('pause-audio')%2==0) {pauseau = "color: #00ff44"} else {pauseau = "color: red"}

if (DataStore.get("Continues_Audio")) {
	console.log(eConsole+`%c Now playing %c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]} %cand %c${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`,eCss,"","color: #0070ff","","color: #0070ff")
	console.log(eConsole+`%c current wallpaper status: pause: %c${DataStore.get('pause-wallpaper')%2==0}%c, play/pause-time: %c${DataStore.get('pause-wallpaper')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %ctrue%c, volume: %c${DataStore.get("wallpaper-volume")*100}%`,eCss,"",pausewall,"","color: #0070ff","",muteCss,"","color: #00ff44","","color: #0070ff")
	console.log(eConsole+`%c current audio status: pause: %c${DataStore.get('pause-audio')%2==0}%c, play/pause-time: %c${DataStore.get('pause-audio')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %c${DataStore.get("audio-loop")}%c, volume: %c${DataStore.get("audio-volume")*100}%`,eCss,"",pauseau,"","color: #0070ff","",muteCss,"",loopwallCss,"","color: #0070ff")
}

window.del_webm_buttons = Delbuttons
window.create_webm_buttons = create_webm_buttons
window.applyHidetab = applyHidetab
window.applyShowtab = applyShowtab