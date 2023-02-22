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
		}, 100)
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

	document.getElementsByClassName("rcp-fe-lol-home")[0].appendChild(container)
	container.append(pauseAudio)
	container.append(pauseBg)
	//container.append(prevBg)
	container.append(nextBg)

	pauseAudio.append(pauseAudioIcon)
	pauseBg.append(pauseBgIcon)
	//prevBg.append(prevBgIcon)
	nextBg.append(nextBgIcon)
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
	}, 200)
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

		document.querySelector(".style-profile-ranked-component.ember-view > .style-profile-emblem-wrapper  > .style-profile-emblem-header > .style-profile-emblem-header-title").innerHTML = "Apprentice";
		document.querySelector(".style-profile-emblem-subheader-ranked > div").innerHTML = "[Witch]";

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
						}, 50)
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


// .End  //