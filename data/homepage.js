import wadata from './configs/Wallpaper&Audio.js'
import filters from './configs/Filters.js'
import utils from './_utils.js'

let songIndex  = 0
let wallpapers = wadata["wallpaper_list"]
let Audios     = wadata["audio_list"]
let datapath = new URL(".", import.meta.url).href
let path = new URL("..", import.meta.url).href
let lang
let eConsole = "%c ElainaV3 "
let eCss = "color: #ffffff; background-color: #f77fbe"
let loopwallCss,muteCss
if (DataStore.get("mute-audio")) {muteCss = "color: #00ff44"} else {muteCss = "color: red"}
if (DataStore.get("audio-loop")) {loopwallCss = "color: #00ff44"} else {loopwallCss = "color: red"}

if (DataStore.get("Dev-mode")) {
	try  {
		let res = await fetch(`${path}ElainaV3-Data/data/configs/Language.js`)
		if (res.status == 200) {
			lang = (await (() => import(`${path}ElainaV3-Data/data/configs/Language.js`))()).default
		}
	}
	catch{console.warn(`File doesn't exist`)}
}
else {
	try  {
		let res = await fetch("https://unpkg.com/elainav3-data@latest/data/configs/Language.js")
		if (res.status == 200) {
			lang = (await (() => import("https://unpkg.com/elainav3-data@latest/data/configs/Language.js"))()).default
		}
	}
	catch{console.warn(`File doesn't exist`)}
}

if(!DataStore.has('audio-index')){
    DataStore.set('audio-index',0)
}
else if(DataStore.get('audio-index')+1>Audios.length){
    DataStore.set('audio-index',0)
}
if(!DataStore.has('wallpaper-index')){
    DataStore.set('wallpaper-index',0)
}
else if(DataStore.get('wallpaper-index')+1>wallpapers.length){
    DataStore.set('wallpaper-index',0)
}

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

function create_element(tagName, className, content) {
	const el = document.createElement(tagName)
	el.className = className
	if (content) {el.innerHTML = content}
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
			let langCode = document.querySelector("html").lang;
			let langMap = lang.langlist

			elaina_home_navbar_item.setAttribute("item-id", "elaina-home")
			elaina_home_navbar_item.setAttribute("priority", 1)
			elaina_home_navbar_item.textContent = lang[langMap[langCode] || "EN"]["home"]

			navbar.prepend(elaina_home_navbar_item)
		}
	}
}

function patch_default_home_page(){
	let intervalId = window.setInterval(() => {
		go_to_default_home_page()
		if (document.querySelector("#rcp-fe-viewport-root lol-uikit-navigation-item:nth-child(1)").getAttribute("active") == "true") {window.clearInterval(intervalId)}
	}, 100)
}

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
		pause_bg_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/play_button.png`)
	}
	else {
		pause_bg_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/pause_button.png`)
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
		pause_audio_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/play_button.png`)
	}
	else {
		pause_audio_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/pause_button.png`)
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
		mute_audio_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/mute.png`)
	}
	else {
		mute_audio_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/audio.png`)
	}

}

function audio_loop() {
	let audio = document.getElementById("bg-audio")

	if (DataStore.get('audio-loop')) {
		audio.loop = true
		audio.removeEventListener("ended", nextSong)
		console.log(eConsole+`%c Audio loop: %c${DataStore.get('audio-loop')}`,eCss,"","color: #00ff44")
	}
	else {
		audio.loop = false
		audio.addEventListener("ended", nextSong)
		console.log(eConsole+`%c Audio loop: %c${DataStore.get('audio-loop')}`,eCss,"","color: red")
	}
}

function audio_loop_icon(elem) {
	let audio_loop_icon = elem || document.querySelector(".audio-loop-icon")

	if (!audio_loop_icon) {return}
	if (DataStore.get("audio-loop")) {
		audio_loop_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/rotating-arrow.png`)
	}
	else {
		audio_loop_icon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/Unrotating-arrow.png`)
	}
}

function loadBG(BG) {
	let elainaBg = document.getElementById("elaina-bg")
	elainaBg.src = `${datapath}assets/Backgrounds/${BG}`
}

function loadSong(song) {
	let audio     = document.getElementById("bg-audio")
    	audio.src = `${datapath}assets/Backgrounds/Audio/${song}`
}

function next_wallpaper() {
	let elainaBg = document.getElementById("elaina-bg")
		elainaBg.classList.add("webm-hidden")

	DataStore.set('wallpaper-index', DataStore.get('wallpaper-index')+1)
    if (DataStore.get('wallpaper-index') > wallpapers.length-1) {
        DataStore.set('wallpaper-index', 0)
    }
	console.log(eConsole+`%c Now playing %c${wallpapers[DataStore.get('wallpaper-index')].file}`,eCss,"","color: #0070ff")

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
	console.log(eConsole+`%c Now playing %c${wallpapers[DataStore.get('wallpaper-index')].file}`,eCss,"","color: #0070ff")

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
		console.log(eConsole+`%c Now playing %c${Audios[DataStore.get('audio-index')]}`,eCss,"", "color: #0070ff")
	}
	else {
		songIndex++

		if (songIndex > Audios.length-1) {
			songIndex = 0
		}
		loadSong(Audios[songIndex])
		audio_play_pause()
		console.log(eConsole+`%c Now playing %c${Audios[songIndex]}`,eCss,"", "color: #0070ff")
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
		console.log(eConsole+`%c Now playing %c${Audios[DataStore.get('audio-index')]}`,eCss,"", "color: #0070ff")
	}
	else {
		songIndex--

		if (songIndex < 0) {
			songIndex = Audios.length-1
		}
		loadSong(Audios[songIndex])
		audio_play_pause()
		console.log(eConsole+`%c Now playing %c${Audios[songIndex]}`,eCss,"", "color: #0070ff")
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

	nextBgIcon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/next_button.png`)
	prevBgIcon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/prev_button.png`)
	nextAudioIcon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/next-audio.png`)
	prevAudioIcon.setAttribute("src", `${datapath}assets/Icon/Plugins-icons/prev-audio.png`)
		
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
					console.log(eConsole+`%c Now playing %c${wallpapers[DataStore.get('wallpaper-index')].file}`,eCss,"","color: #0070ff")

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
			if (previous_page == "rcp-fe-lol-parties" ){
				patch_default_home_page()
			}
		}
	}
	else if (pagename != "rcp-fe-lol-navigation-screen" && pagename != "window-controls" && pagename != "rcp-fe-lol-home" && pagename != "social" && document.getElementsByClassName("webm-bottom-buttons-container").length) {
		Delbuttons()
	}
	if (pagename == "social") {
		if (patcher_go_to_default_home_page){
			go_to_default_home_page()
			patcher_go_to_default_home_page = false
		}
	}
    if (previous_page != pagename) {previous_page = pagename}
}
if (DataStore.get("Dev-mode")) {
	console.log(eConsole+"%c Running %cElaina theme - %cDev %cversion",eCss,"","color: #e4c2b3","color: red","")
}
else {console.log(eConsole+"%c Running %cElaina theme - %cStable %cversion",eCss,"","color: #e4c2b3","color: #00ff44","")}
if (DataStore.get("Continues_Audio")) {
	console.log(eConsole+`%c Now playing %c${wallpapers[DataStore.get('wallpaper-index')].file} %cand %c${Audios[DataStore.get('audio-index')]}`,eCss,"","color: #0070ff","","color: #0070ff")
	console.log(eConsole+`%c current wallpaper status: play/pause-time: %c${DataStore.get('pause-wallpaper')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %ctrue%c, volume: %c${DataStore.get("wallpaper-volume")*100}%`,eCss,"","color: #0070ff","",muteCss,"","color: #00ff44","","color: #0070ff")
	console.log(eConsole+`%c current audio status: play/pause-time: %c${DataStore.get('pause-audio')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %c${DataStore.get("audio-loop")}%c, volume: %c${DataStore.get("audio-volume")*100}%`,eCss,"","color: #0070ff","",muteCss,"",loopwallCss,"","color: #0070ff")
}
else {
	console.log(eConsole+`%c Now playing %c${wallpapers[DataStore.get('wallpaper-index')].file} %cand %c${Audios[songIndex]}`,eCss,"","color: #0070ff","","color: #0070ff")
	console.log(eConsole+`%c current wallpaper status: play/pause-time: %c${DataStore.get('pause-wallpaper')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %ctrue%c, volume: %c${DataStore.get("wallpaper-volume")*100}%`,eCss,"","color: #0070ff","",muteCss,"","color: #00ff44","","color: #0070ff")
	console.log(eConsole+`%c current audio status: play/pause-time: %c${DataStore.get('pause-audio')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %c${DataStore.get("audio-loop")}%c, volume: %c${DataStore.get("audio-volume")*100}%`,eCss,"","color: #0070ff","",muteCss,"",loopwallCss,"","color: #0070ff")
}

window.addEventListener("load", ()=> {
    const video = document.createElement('video')
	const audio = document.createElement("audio")
		video.id       = 'elaina-bg'
		video.autoplay = true
		video.loop     = true
		video.src      = `${datapath}assets/Backgrounds/${wallpapers[DataStore.get('wallpaper-index')].file}`
		video.volume   = DataStore.get("wallpaper-volume")
		video.muted    = DataStore.get("mute-audio")

		audio.id       = 'bg-audio'
    	audio.autoplay = true
    	audio.loop     = DataStore.get("audio-loop")
		audio.volume   = DataStore.get("audio-volume")
		audio.muted    = DataStore.get("mute-audio")
		if (DataStore.get("Continues_Audio")) {audio.src = `${datapath}assets/Backgrounds/Audio/${Audios[DataStore.get('audio-index')]}`}
		else {audio.src = `${datapath}assets/Backgrounds/Audio/${Audios[songIndex]}`}
	
	if (!DataStore.get("audio-loop")) {audio.addEventListener("ended", nextSong)}
	document.querySelector("body").prepend(video)
    document.querySelector("body").prepend(audio)
	elaina_play_pause()

    utils.mutationObserverAddCallback(addHomepage, ["screen-root"])
    utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]
		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("elaina-bg").pause()
			document.getElementById("bg-audio").pause()
		}
		else {
			elaina_play_pause()
			audio_play_pause()
		}
	})
})