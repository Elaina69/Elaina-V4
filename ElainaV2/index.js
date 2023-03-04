/* By Elaina Da Catto */ /* "Retrorem" by teiseire117 but better (i think) */
/* Meow~~~ */


import utils from './_utilselaina'
import data from './configs/ElainaV2_config.json' 




//___________________________________________________________________________________________________________________________________________________________________________________________//
let default_settings = data
let previous_page;
let ranked_observer;
let patcher_go_to_default_home_page = true;
let force_bg_pause = default_settings["pause_wallpaper"];
let force_audio_pause = default_settings["pause_audio"];
let wallpapers = default_settings["wallpaper_list"];


//___________________________________________________________________________//
function apply_default_background() {
	let default_wallpaper = default_settings["default_wallpaper"]
	let index = wallpapers.indexOf(default_wallpaper);
	if (index !== -1) {
		wallpapers.splice(index, 1);
		wallpapers.unshift(default_wallpaper);
	}
}
apply_default_background()

function removeIframe() {
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(node => {
					if (node.tagName === 'IFRAME' && node.hasAttribute('src') && node.hasAttribute('referrerpolicy')) {
						//node.remove();
						;
					}
				});
			}
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });
}


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
		let intervalId = window.setInterval(() => {
			try {
				let base = document.querySelector("lol-regalia-parties-v2-element.regalia-loaded").shadowRoot.querySelector(".regalia-parties-v2-banner-backdrop.regalia-banner-loaded")

				base.shadowRoot.querySelector(".regalia-banner-asset-static-image").style.filter = "sepia(1) brightness(3.5) opacity(0.4)"
				base.shadowRoot.querySelector(".regalia-banner-state-machine").shadowRoot.querySelector(".regalia-banner-intro.regalia-banner-video").style.filter = "grayscale(1) saturate(0) brightness(0.5)"
			} catch {
				return;
			}
			window.clearInterval(intervalId)
		}, 200)
	}
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
		wallpaperaudio.muted = true;
	}
	else {
		audio.play()
		wallpaperaudio.muted = false;
	}
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
	const container = document.createElement("div")
	

	const pauseBg = document.createElement("div");
	const pauseAudio = document.createElement("div");
	const nextBg = document.createElement("div");
	const prevBg = document.createElement("div");
	

	const pauseBgIcon = document.createElement("img")
	const nextBgIcon = document.createElement("img")
	const pauseAudioIcon = document.createElement("img")
	const prevBgIcon = document.createElement("img")
	

	container.classList.add("webm-bottom-buttons-container")
	

	pauseBg.id = "pause-bg"
	nextBg.id = "next-bg"
	pauseAudio.id = "pause-audio"
	prevBg.id = "prev-bg"
	

	nextBgIcon.classList.add("next-bg-icon")
	prevBgIcon.classList.add("prev-bg-icon")
	pauseBgIcon.classList.add("pause-bg-icon")
	pauseAudioIcon.classList.add("pause-audio-icon")
	
	
	play_pause_set_icon_audio(pauseAudioIcon)
	pauseAudio.addEventListener("click", () => {
		force_audio_pause = !force_audio_pause
		audio_play_pause()
		play_pause_set_icon_audio()
	})

	play_pause_set_icon(pauseBgIcon)
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
		

	container.append(pauseAudio)
	container.append(pauseBg)
	//container.append(prevBg)
	container.append(nextBg)
	

	pauseAudio.append(pauseAudioIcon)
	pauseBg.append(pauseBgIcon)
	//prevBg.append(prevBgIcon)
	nextBg.append(nextBgIcon)
	


//Easter Egg
    const container2 = document.createElement("div")
	const container3 = document.createElement("div")
	const container4 = document.createElement("div")


	const watermark = document.createElement("div");
	const afteregg = document.createElement("div");
	const aftereggt = document.createElement("div");
	const headpatdiv = document.createElement("div");
	const boobsdiv = document.createElement("div");


	const aftereggIcon = document.createElement("img")


	const wtmark = document.createElement("p")
	const aftereggtext = document.createElement("p")


	container2.classList.add("EasterEgg")
	container3.classList.add("watermark-text")
	container4.classList.add("EasterEgg-text-div")


	watermark.id = "watermark"
	afteregg.id - "afteregg-image"
	aftereggtext.id = "afteregg-text"
	aftereggt.id = "aftereggt"


	wtmark.classList.add("watermark")
	aftereggIcon.classList.add("aftereggIcon")


	aftereggIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/ElainaCB.png")	
	aftereggIcon.style.visibility = "hidden"


	const container5 = document.createElement("div")
	        const container6 = document.createElement("div")
			
			const headpat = document.createElement("button")
			const boobs = document.createElement("button")
			
			container5.classList.add("Headpat-con")
			container6.classList.add("Boobs-con")
			
			headpat.classList.add("Headpat")
			boobs.classList.add("Boobs")

			const container7 = document.createElement("div")
			const container8 = document.createElement("div")
			const container9 = document.createElement("div")

			const answer1 = document.createElement("p")
			const answer2 = document.createElement("p")
			const answer3 = document.createElement("a")

			container7.classList.add("answer1-con")
			container8.classList.add("answer2-con")
			container9.classList.add("answer3-con")

			answer1.id = "answer1"
			answer2.id = "answer2"
			answer3.id = "answer3"



	let count = 0;
	let Headpatcount = 0;
	let answer2clicked = 0;

	wtmark.innerHTML = "By Elaina Da Catto";
	wtmark.addEventListener("click", () => {
		count += 1;
		if (count >= 10) {
			wtmark.style.visibility = "hidden"
			aftereggIcon.style.visibility = "visible"
			aftereggtext.innerHTML = "You should go outside<br>and touch grass"

			headpat.addEventListener("click", () => {
				boobs.style.visibility = "visible"
				Headpatcount += 1;
				if (Headpatcount < 15) {
					aftereggtext.innerHTML = "Meow ~~ !!"
					container4.style.bottom = "260px"
					container4.style.right = "280px"

					container7.remove()
					container8.remove()
					container9.remove()
				}
				if (Headpatcount >= 15) {
					aftereggtext.innerHTML = "Mo... My hair is burning !!"
					container4.style.bottom = "260px"
					container4.style.right = "225px"

					container7.remove()
					container8.remove()
					container9.remove()
				}
			}, false);

			boobs.addEventListener("click", () => {
				aftereggtext.innerHTML = "Ehh...where did you<br>just touch !?"
				container4.style.bottom = "250px"
				container4.style.right = "250px"
				answer1.innerHTML = "\"N...Nothing !!\""
				answer2.innerHTML = "\"I...I wanna see your boobs\""
				boobs.style.visibility = "hidden"


				answer1.addEventListener("click", () => {
					aftereggtext.innerHTML = "... You should be careful<br>next time"
					container4.style.bottom = "248px"
					container4.style.right = "239px"

					container7.remove()
					container8.remove()
					container9.remove()

					boobs.style.visibility = "visible"	
				}, false);

				answer2.addEventListener("click", () => {
					answer2clicked += 1;
					aftereggtext.innerHTML = "As you wish, my darling ~~"
					container4.style.bottom = "260px"
					container4.style.right = "219px"

					container7.remove()
					container8.remove()

					boobs.style.visibility = "visible"	

					if (answer2clicked > 0) {
						showcontainer.appendChild(container9)
						container9.append(answer3)
						answer3.innerHTML = "Take off her clothes"
						answer3.setAttribute("href", "https://media.discordapp.net/attachments/887677396315172894/1081501404729974804/6f5ba14e64dea4feb1349c3b658338349e0c1244.png")
						answer3.setAttribute("target", "_blank")

						answer3.addEventListener("click", () => {
							aftereggtext.innerHTML = "..."
							container4.style.bottom = "260px"
							container4.style.right = "325px"

							container9.remove()
						}, false);
					}
				}, false);

				showcontainer.appendChild(container7)
				showcontainer.appendChild(container8)

				container7.append(answer1)
				container8.append(answer2)
				container9.append(answer3)

				
			}, false);

			showcontainer.appendChild(container5)
			showcontainer.appendChild(container6)

			container5.append(headpatdiv)
			container6.append(boobsdiv)

			headpatdiv.append(headpat)
			boobsdiv.append(boobs)

			try {
				document.querySelector('.answer1-con').remove()
				document.querySelector('.answer2-con').remove()
			}
			catch(error) {}

			try {
				document.querySelector('.answer3-con').remove()
			}
			catch(error) {}
		}
	}, false);


	showcontainer.appendChild(container2)
	showcontainer.appendChild(container3)
	showcontainer.appendChild(container4)


	container3.append(watermark)
	container2.append(afteregg)
	container4.append(aftereggt)



	watermark.append(wtmark)
	afteregg.append(aftereggIcon)
	aftereggt.append(aftereggtext)

}
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
	if (default_settings["default_home_page"]) {
		document.querySelector(`lol-uikit-navigation-item[item-id='${default_settings["default_home_page"]}']`).click()
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
			elaina_home_navbar_item.textContent = "Home"
			navbar.prepend(elaina_home_navbar_item)
		}
	}
}
//___________________________________________________________________________//


//___________________________________________________________________________//
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

let pageChangeMutation = (node) => {
	let pagename;
	let elaina_bg_elem = document.getElementById("elaina-bg")
	let brightness_modifiers = ["rcp-fe-lol-champ-select", "rcp-fe-lol-store", "rcp-fe-lol-collections", "rcp-fe-lol-profiles-main",
		"rcp-fe-lol-parties", "rcp-fe-lol-loot", "rcp-fe-lol-clash-full"]
	pagename = node.getAttribute("data-screen-name")

	console.log(pagename)
	if (pagename == "rcp-fe-lol-home-main") {
		if (!document.getElementsByClassName("webm-bottom-buttons-container").length) {
			create_webm_buttons()
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
			document.getElementsByClassName("webm-bottom-buttons-container")[0].remove()
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
		let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')

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
window.addEventListener('load', () => {

	const video = document.createElement('video');
	video.id = 'elaina-bg';
	video.setAttribute('autoplay', '');
	video.setAttribute('loop', '');
	video.muted = default_settings["is_wallpaper_muted?"];
	video.src = default_settings["default_wallpaper_src"];
	video.volume = default_settings["video_sound_volume"];
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner)
	utils.addCss(default_settings["css_file"])

	const audio = document.createElement("audio");
	audio.autoplay = default_settings["default_sound_autoplay"];
	audio.loop = default_settings["is_audio_loop?"];
	audio.volume = default_settings["audio_sound_volume"];
	audio.src = default_settings["audio_src"];
	audio.id = 'bg-audio';
	audio.load()
    audio.addEventListener("load", function() { 
        audio.play(); 
    }, true);


	document.querySelector("body").prepend(video)
	document.querySelector("body").prepend(audio)
	elaina_play_pause()
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


//___________________________________________________________________________//


//___________________________________________________________________________//
console.clear();
console.log('By Elaina Da Catto');
console.log('Meow ~~~');
console.log(default_settings["custom_log"]);
})
//___________________________________________________________________________________________________________________________________________________________________________________________//





//___Dodge-button-plugin________________________________________________________________________________________________________________________________________________________________________________________//
async function exitClient(){
await fetch("/process-control/v1/process/quit",
	{"method":"POST"})
}


window.exitClient = exitClient

async function dodgeQueue(){
	await fetch("/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]",
		{"body":"[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]", "method":"POST"})
}


window.dodgeQueue = dodgeQueue


function generateDodgeAndExitButton(siblingDiv) {
	const div = document.createElement("div");
	const parentDiv = document.createElement("div")
	const placeHolderDiv = document.createElement("div")

	parentDiv.setAttribute("class", "dodge-button-container")
	parentDiv.setAttribute("style", "position: absolute;right: 0px;bottom: 57px;display: flex;align-items: flex-end;")
	div.setAttribute("class", "quit-button ember-view");
	div.setAttribute("onclick", "window.dodgeQueue()")
	div.setAttribute("id", "dodgeButton");

	placeHolderDiv.setAttribute("class", "quit-button ember-view");
	placeHolderDiv.setAttribute("onclick", "window.exitClient()")
	placeHolderDiv.setAttribute("id", "exitButton");

	const buttonPlaceHolder = document.createElement("lol-uikit-flat-button");
	const button = document.createElement("lol-uikit-flat-button");
	button.innerHTML = "Dodge";
	buttonPlaceHolder.innerHTML = "Exit";
	
	div.appendChild(button);
	placeHolderDiv.appendChild(buttonPlaceHolder)

	parentDiv.appendChild(div);
	parentDiv.appendChild(placeHolderDiv);
	console.log(parentDiv)
	siblingDiv.parentNode.insertBefore(parentDiv, siblingDiv)
}


let addDodgeAndExitButtonObserver = (mutations) => {
	if (utils.phase == "ChampSelect" && document.querySelector(".bottom-right-buttons") && !document.querySelector(".dodge-button-container")){
		generateDodgeAndExitButton(document.querySelector(".bottom-right-buttons"))
	}
}


window.addEventListener('load', () => {
	utils.routineAddCallback(addDodgeAndExitButtonObserver, ["bottom-right-buttons"])
})
//___________________________________________________________________________________________________________________________________________________________________________________________//





//___Auto-Accept-plugin________________________________________________________________________________________________________________________________________________________________________________________//
let auto_accept = data["is_auto_accept_enabled"]
let queue_accepted = false 


function autoAcceptQueueButton(){
	let element = document.getElementById("autoAcceptQueueButton")
	if (element.attributes.selected != undefined) {
		auto_accept = false
		element.removeAttribute("selected")
	}
	else {
		element.setAttribute("selected", "true")
		auto_accept = true
	}
}

window.autoAcceptQueueButton = autoAcceptQueueButton


let autoAcceptCallback = async message => {
	utils.phase = JSON.parse(message["data"])[2]["data"]
	if (utils.phase == "ReadyCheck" && auto_accept && !queue_accepted) {
		await acceptMatchmaking()
		queue_accepted = true
	}
	else if (utils.phase != "ReadyCheck") {
		queue_accepted = false
	}
}

function fetch_or_create_champselect_buttons_container() {
	if (document.querySelector(".cs-buttons-container")) {
		return document.querySelector(".cs-buttons-container")
	}
	else {
		const div = document.createElement("div")

		div.className = "cs-buttons-container"
		document.querySelector(".v2-footer-notifications.ember-view").append(div)
		return div
	}
}


let autoAcceptMutationObserver = (mutations) => {
	if (document.querySelector(".v2-footer-notifications.ember-view") != null && document.getElementById("autoAcceptQueueButton") == null) {
		let newOption = document.createElement("lol-uikit-radio-input-option");
		let container = fetch_or_create_champselect_buttons_container()
	
		newOption.setAttribute("id", "autoAcceptQueueButton");
		newOption.setAttribute("onclick", "window.autoAcceptQueueButton()");
		if (auto_accept){
			newOption.setAttribute("selected", "");
		}
		newOption.innerHTML = "<div class='auto-accept-button-text'>Auto Accept</div>";
		container.append(newOption);
	}
}

window.addEventListener('load', () => {
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', autoAcceptCallback)
	utils.routineAddCallback(autoAcceptMutationObserver, ["v2-footer-notifications.ember-view"])
})

let acceptMatchmaking = async () => await fetch('/lol-matchmaking/v1/ready-check/accept', { method: 'POST' })
//___________________________________________________________________________________________________________________________________________________________________________________________//





//___Offline-mode-plugin________________________________________________________________________________________________________________________________________________________________________________________//
let covert_status = "chat";


function get_status() {
	let element = document.querySelector(".availability-icon")
	let possible_status = ["dnd", "chat", "away", "offline", "mobile"]

	if (element) {
		for (let elem of possible_status){
			if (element.classList.contains(elem)){
				return elem
			}
		}
	}

	return "chat"
}

let switch_between_status = async () => {
	let status = get_status()
	let availability = (status == "chat") ? "mobile" : (status == "mobile") ? "dnd" : (status == "dnd") ? "away" : (status == "away") ? "offline" : (status == "offline") ? "chat" : "chat"

	console.log("pass 1")
	await fetch("/lol-chat/v1/me", {
		"headers": {
			"content-type": "application/json",
		},
		"body": `{\"availability\":\"${availability}\"${(availability == "offline" || availability == "away") ? `,\"lol\":{\"gameStatus\":\"outOfGame\"}` : (availability == "dnd") ? `,\"lol\":{\"gameStatus\":\"inGame\"}` : `` }}`,
		"method": "PUT",
	});

	document.querySelector(".availability-icon").classList.remove(status)
	document.querySelector(".availability-icon").classList.add(availability)
	covert_status = availability
}

window.switch_between_status = switch_between_status


async function patchStatus(){
	await fetch("/lol-chat/v1/me", {
		"headers": {
			"content-type": "application/json",
		},
		"body": `{\"availability\":\"${covert_status}\",\"lol\":{\"gameStatus\":\"outOfGame\"}}`,
		"method": "PUT",
	});
}

let champSelectPatchStatus = async message => {
	let phase = JSON.parse(message["data"])[2]["data"];
	if (phase == "ChampSelect" && (covert_status == "offline" || covert_status == "away")) {
		await patchStatus()
	}
}

let availabilityButtonMutationObserver = async (mutations) => {
	let circle_status = document.querySelector(".availability-hitbox:not(.offline-mode-available), .availability-hitbox:not([onclick])")
	let circle_status_custom = document.querySelectorAll(".availability-hitbox.offline-mode-available")
	let custom_message_status = document.querySelector(".details .status-message.game-status")


	if (circle_status) {
		console.log(mutations)
		circle_status.classList.add("offline-mode-available");
		circle_status.outerHTML = circle_status.outerHTML
		document.querySelector(".availability-hitbox").setAttribute("onclick", "window.switch_between_status()")
	}

	if (custom_message_status && covert_status == "offline") {		
		await patchStatus();
	}
	if (circle_status_custom.length > 1){
		circle_status_custom.forEach((elem, index) => {
			if (index){
				elem.remove()
			}
		})
	}
}

window.addEventListener('load', () => {
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", champSelectPatchStatus)
	utils.routineAddCallback(availabilityButtonMutationObserver, ["availability-hitbox", "status-message"])
})
//___________________________________________________________________________________________________________________________________________________________________________________________//





//___________________________________________________________________________________________________________________________________________________________________________________________//
// This is the old default plugin version of League Loader.
const TRANSLATIONS = {
    ['en']: {
        'l.open_settings': 'Open Settings',
        'l.close': 'Close',
        'l.open_devtools': 'Open DevTools',
        'l.reload_client': 'Reload Client',
        'l.open_plugins': 'Open Plugins folder',
    }
}

// Create loader UI.
async function createLoaderMenu(root) {
    // Import nano-jsx from CDN.
    const { Component, jsx, render } = await import('//esm.run/nano-jsx')

    // Get translation.
    const lang = document.body.dataset['lang']
    /** @type {TRANSLATIONS['en']} */
    const _t = TRANSLATIONS[lang] || TRANSLATIONS['en']

    // Get League Loader version.
    const version = window['__llver']

    // Main component.
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
            // Tagged template literal with JSX flavor.
            // On VSCode, just install 'Comment tagged templates' extension to get highlighting.
            return jsx/*html*/`
                <div class="modal" style="position: absolute; inset: 0px; z-index: 8500" hidden=${!this.visible || undefined}>
                    <lol-uikit-full-page-backdrop class="backdrop" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px" />
                    <div class="dialog-confirm" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px">
                        <lol-uikit-dialog-frame ref=${el => (this.frame = el)} class="dialog-frame" orientation="bottom" close-button="false">
                            <div class="dialog-content">
                                <lol-uikit-content-block class="app-controls-exit-dialog" type="dialog-medium" style="position: relative; overflow: hidden">
                                    <div style="position: absolute; top: 60px">
                                        <video
                                            src=" "
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
                                            <lol-uikit-flat-button-secondary style="display:inline-block; width: 180px" onClick=${() => window.openDevTools()}>
                                                ${_t['l.open_devtools']} (Ctrl Shift I)
                                            </lol-uikit-flat-button-secondary>
                                            <lol-uikit-flat-button-secondary style="display:inline-block; width: 180px" onClick=${() => window.location.reload()}>
                                                ${_t['l.reload_client']} (Ctrl Shift R)
                                            </lol-uikit-flat-button-secondary>
                                            <lol-uikit-flat-button-secondary style="display:inline-block; width: 180px" onClick=${() => window.openPluginsFolder()}>
                                                ${_t['l.open_plugins']}
                                            </lol-uikit-flat-button-secondary>
                                        </div>
                                        <hr class="heading-spacer" />
                                        <p style="padding: 20px 0" class="lol-settings-code-of-conduct-link lol-settings-window-size-text">
                                            <a href="https://github.com/Elaina69/Elaina-V2/releases" target="_blank">Theme releases</a>
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

    // Render component to root.
    render(jsx`<${LoaderMenu} />`, root)
}

// Setup on window loaded.
window.addEventListener('load', async () => {
    // Wait for manager layer.
    const manager = () => document.getElementById('lol-uikit-layer-manager-wrapper')
    while (!manager()) await new Promise(r => setTimeout(r, 200))
    // Create UI and append it to manager.
    const root = document.createElement('div')
    await createLoaderMenu(root)
    manager().prepend(root)
})
//___________________________________________________________________________________________________________________________________________________________________________________________//


// .End  //