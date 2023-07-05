/**
 * @name ElainaV2
 * @author Elaina Da Catto
 * @description Elaina theme 2nd Generation for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */
import 'https://raw.githack.com/Elaina69/Elaina-V2/main/Main/main.js'
import utils from './Main/_utilselaina.js'
import data  from './Main/configs/ElainaV2_config.js'

//___________________________________________________________________________//
let lang, thisVersion
let songIndex  = 0
let wallpapers = data["wallpaper_list"]
let Audios     = data["audio_list"]
let assetspath = new URL(".", import.meta.url).href + "Main/assets"

try{let res = await fetch("https://raw.githack.com/Elaina69/Elaina-V2/main/Main/configs/Language.js")
if (res.status==200) {lang = (await (() => import("https://raw.githack.com/Elaina69/Elaina-V2/main/Main/configs/Language.js"))()).default}}catch{}
try{let res = await fetch(`https://raw.githack.com/Elaina69/Elaina-V2/main/Main/configs/Version.js`)
if (res.status==200) {thisVersion = (await (() => import(`https://raw.githack.com/Elaina69/Elaina-V2/main/Main/configs/Version.js`))()).default}}catch{}

const langCode = document.querySelector("html").lang;
const langMap = lang.langlist
//___________________________________________________________________________//



//___________________________________________________________________________//
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
		pause_bg_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/play_button.png`)
	}
	else {
		pause_bg_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/pause_button.png`)
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
		pause_audio_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/play_button.png`)
	}
	else {
		pause_audio_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/pause_button.png`)
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
	console.log(`audio and wallpaper mute ${DataStore.get("mute-audio")}`)
}
function mute_set_icon_audio(elem) {
	let mute_audio_icon = elem || document.querySelector(".mute-audio-icon")

	if (!mute_audio_icon) {return}
	if (DataStore.get("mute-audio")) {
		mute_audio_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/mute.png`)
	}
	else {
		mute_audio_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/audio.png`)
	}

}
function audio_loop() {
	let audio = document.getElementById("bg-audio")

	if (DataStore.get('audio-loop')) {
		audio.loop = true
		audio.removeEventListener("ended", nextSong)
	}
	else {
		audio.loop = false
		audio.addEventListener("ended", nextSong)
	}
	console.log(`Audio loop ${DataStore.get('audio-loop')}`)
}
function audio_loop_icon(elem) {
	let audio_loop_icon = elem || document.querySelector(".audio-loop-icon")

	if (!audio_loop_icon) {return}
	if (DataStore.get("audio-loop")) {
		audio_loop_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/rotating-arrow.png`)
	}
	else {
		audio_loop_icon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/Unrotating-arrow.png`)
	}
}
function loadBG(BG) {
	let elainaBg = document.getElementById("elaina-bg")
	elainaBg.src = `${assetspath}/Backgrounds/${BG}`
}

function loadSong(song) {
	let audio     = document.getElementById("bg-audio")
    	audio.src = `${assetspath}/Backgrounds/Audio/${song}`
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

	nextBgIcon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/next_button.png`)
	prevBgIcon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/prev_button.png`)
	nextAudioIcon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/next-audio.png`)
	prevAudioIcon.setAttribute("src", `${assetspath}/Icon/Plugins-icons/prev-audio.png`)
		
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
											src="${assetspath}/Icon/Plugins-icons/LL-Settings.webm"
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
let loadBgandAudio = async (node) => {
    let pagename, previous_page
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
		"rcp-fe-lol-event-shop",
		"rcp-fe-lol-tft"
    ]

    pagename = node.getAttribute("data-screen-name")
	console.log(pagename)

    if (pagename == "rcp-fe-lol-home-main") {
		elaina_bg_elem.style.filter = data["Homepage"]
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
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		return
	}
	if (pagename == "social") {
		if (patcher_go_to_default_home_page){
			go_to_default_home_page()
			patcher_go_to_default_home_page = false
		}
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
	}
	else if (previous_page == "rcp-fe-lol-profiles-main" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-parties") {
		elaina_bg_elem.style.filter = data["Parties"]
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (pagename == "rcp-fe-lol-tft") {
		elaina_bg_elem.style.filter = data["TFT"]
	}
	else if (previous_page == "rcp-fe-lol-tfts" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = data["Homepage"]
	}
	if (previous_page != pagename) {previous_page = pagename}
}
//___________________________________________________________________________//



//___________________________________________________________________________//
if (DataStore.get("Continues_Audio")) {
	console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file+" and "+Audios[DataStore.get('audio-index')])
	console.log(`current wallpaper status: play/pause-time: ${DataStore.get('pause-wallpaper')}, mute: ${DataStore.get("mute-audio")}, loop: true, volume: ${DataStore.get("wallpaper-volume")}`)
	console.log(`current audio status: play/pause-time: ${DataStore.get('pause-audio')}, mute: ${DataStore.get("mute-audio")}, loop: ${DataStore.get("audio-loop")}, volume: ${DataStore.get("audio-volume")}`)
}
else {
	console.log("Now playing "+wallpapers[DataStore.get('wallpaper-index')].file+" and "+Audios[songIndex])
	console.log(`current wallpaper status: play/pause-time: ${DataStore.get('pause-wallpaper')}, mute: ${DataStore.get("mute-audio")}, loop: true, volume: ${DataStore.get("wallpaper-volume")}`)
	console.log(`current audio status: play/pause-time: ${DataStore.get('pause-audio')}, mute: ${DataStore.get("mute-audio")}, loop: ${DataStore.get("audio-loop")}, volume: ${DataStore.get("audio-volume")}`)
}
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', async ()=> {
    utils.addCss("--Hover-card-backdrop",assetspath+"/Icon",data['Hover-card'])
	utils.addFont(assetspath+"/Fonts/","BeaufortforLOL-Bold.ttf","Elaina")

	if (DataStore.get("Sidebar-Transparent")) {utils.addCss("","","",`${assetspath}/Css/Addon-Css/Sidebar-Transparent.css`)}
	else {utils.addCss("","","",`${assetspath}/Css/Addon-Css/Sidebar-Color.css`)}
	if (DataStore.get("Animate-Loading")) {utils.addCss("--ElainaFly",assetspath+"/Icon",data["Animation-logo"],`${assetspath}/Css/Addon-Css/Animate-Loading-Screen.css`)}
	else {utils.addCss("--ElainaStatic",assetspath+"/Icon",data["Static-logo"],`${assetspath}/Css/Addon-Css/Static-Loading-Screen.css`)}
	if (DataStore.get("Hide-Champions-Splash-Art")) {utils.addCss("","","",`${assetspath}/Css/Addon-Css/Hide-Champs-Splash-Art.css`)}
	if (DataStore.get("Custom-Avatar")) {utils.addCss("--Avatar",assetspath+"/Icon",data["Avatar"],`${assetspath}/Css/Addon-Css/Icon/Avatar.css`)}
	if (DataStore.get("Custom-Icon")) {
		utils.addCss("--RP-Icon",assetspath+"/Icon",data["RP-icon"],`${assetspath}/Css/Addon-Css/Icon/RiotPoint.css`)
		utils.addCss("--BE-Icon",assetspath+"/Icon",data["BE-icon"],`${assetspath}/Css/Addon-Css/Icon/BlueEssence.css`)
		utils.addCss("--Rank-Icon",assetspath+"/Icon",data["Rank-icon"],`${assetspath}/Css/Addon-Css/Icon/Rank.css`)
		utils.addCss("--Emblem",assetspath+"/Icon",data["Emblem"],`${assetspath}/Css/Addon-Css/Icon/Emblem.css`)
		utils.addCss("--Clash-banner",assetspath+"/Icon",data["Class-banner"],`${assetspath}/Css/Addon-Css/Icon/ClashBanner.css`)
		utils.addCss("--Ticker",assetspath+"/Icon",data["Ticker"],`${assetspath}/Css/Addon-Css/Icon/Ticker.css`)
	}
	if (DataStore.get("Custom-Font")) {utils.addFont(data["Font-Name"],"Custom")}
	if (DataStore.get("Custom-Cursor")) {utils.CustomCursor('url('+assetspath+"/Icon/"+data["Mouse-cursor"]+')',`${assetspath}/Css/Addon-Css/Cursor.css`)}
	if (DataStore.get("Custom-Status")) {CustomStatus()}

	const video = document.createElement('video')
	const audio = document.createElement("audio")
		video.id       = 'elaina-bg'
		video.autoplay = true
		video.loop     = true
		video.src      = `${assetspath}/Backgrounds/${wallpapers[DataStore.get('wallpaper-index')].file}`
		video.volume   = DataStore.get("wallpaper-volume")

		audio.id       = 'bg-audio'
    	audio.autoplay = true
    	audio.loop     = DataStore.get("audio-loop")
		audio.volume   = DataStore.get("audio-volume")
		if (DataStore.get("Continues_Audio")) {audio.src = `${assetspath}/Backgrounds/Audio/${Audios[DataStore.get('audio-index')]}`}
		else {audio.src = `${assetspath}/Backgrounds/Audio/${Audios[songIndex]}`}
	
	if (!DataStore.get("audio-loop")) {audio.addEventListener("ended", nextSong)}
	video.addEventListener("load", ()=>{video.play()})
    audio.addEventListener("load", ()=>{audio.play()})
	document.querySelector("body").prepend(video)
    document.querySelector("body").prepend(audio)
	elaina_play_pause()

    utils.mutationObserverAddCallback(loadBgandAudio, ["screen-root"])
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
		}
	})

	const manager = () => document.getElementById('lol-uikit-layer-manager-wrapper')
	const root    = document.createElement('div')
	if (DataStore.get("Old-League-Loader-Settings")) {
		while (!manager()) await new Promise(r => setTimeout(r, 200))
		await createLoaderMenu(root)
		manager().prepend(root)
	}
})
//___________________________________________________________________________//