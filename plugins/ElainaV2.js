/* By Elaina Da Catto */ /* Based on "Retrorem" by teiseire117 */
/* Meow~~~ */


const utils = require('./_utilselaina')
let previous_page;
let ranked_observer;
let force_bg_pause = false;


//_____________________________________ Backgrounds List____________________________________//
let wallpapers = ["Elaina1.webm", "Elaina2.webm"]
//__________________________________________________________________________________________//


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
		pause_bg_icon.setAttribute("src", "//assets/ElainaV2/Icon/pause_button.png")
	}
	else {
		pause_bg_icon.setAttribute("src", "//assets/ElainaV2/Icon/play_button.png")
	}
}

function next_wallpaper() {

}

function create_webm_buttons() {
	const container = document.createElement("div")
	const pauseBg = document.createElement("div");
	const nextBg = document.createElement("div");
	const pauseBgIcon = document.createElement("img")
	const nextBgIcon = document.createElement("img")

	container.classList.add("webm-bottom-buttons-container")
	pauseBg.id = "pause-bg"
	nextBg.id = "next-bg"
	nextBgIcon.classList.add("next-bg-icon")
	pauseBgIcon.classList.add("pause-bg-icon")
	
	play_pause_set_icon(pauseBgIcon)
	pauseBg.addEventListener("click", () => {
		force_bg_pause = !force_bg_pause
		elaina_play_pause()
		play_pause_set_icon()
	})

	nextBg.addEventListener("click", () => {
		let elainaBg = document.getElementById("elaina-bg")

		elainaBg.classList.add("webm-hidden");
		wallpapers.push(wallpapers.shift())
		setTimeout(function () {
			elainaBg.src = `//assets/ElainaV2/Backgrounds/${wallpapers[0]}`
			elaina_play_pause()
			elainaBg.classList.remove("webm-hidden");
		}, 500);
	})

	nextBgIcon.setAttribute("src", "//assets/ElainaV2/Icon/next_button.png")
	document.getElementsByClassName("rcp-fe-lol-home")[0].appendChild(container)
	container.append(pauseBg)
	container.append(nextBg)
	pauseBg.append(pauseBgIcon)
	nextBg.append(nextBgIcon)
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
	}
	else if (pagename != "rcp-fe-lol-navigation-screen" && pagename != "window-controls" && pagename != "rcp-fe-lol-home" && pagename != "social") {
		if (document.getElementsByClassName("webm-bottom-buttons-container").length) {
			document.getElementsByClassName("webm-bottom-buttons-container")[0].remove()
		}
	}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		return;
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
						}, 50)
					}
				});
			});
			ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false });
		}
		elaina_bg_elem.style.filter = 'brightness(0.3)';
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
		if (brightness_modifiers.indexOf(pagename) == -1)
			elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
		if (ranked_observer)
			ranked_observer.disconnect()
		ranked_observer = undefined
	}
	if (pagename == "rcp-fe-lol-parties") {
		elaina_bg_elem.style.filter = 'brightness(0.4) blur(6px)';
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		elaina_bg_elem.style.filter = 'brightness(0.7) saturate(0.8)';
	}
	if (previous_page != pagename)
		previous_page = pagename
}

window.addEventListener('load', () => {
	utils.mutationObserverAddCallback(pageChangeMutation, ["screen-root"])
})

window.addEventListener('DOMContentLoaded', () => {
	const video = document.createElement('video');
	video.id = 'elaina-bg';
	video.setAttribute('autoplay', '');
	video.setAttribute('loop', '');
	video.setAttribute('muted', '');


//__________________________________ Video Background link _________________________________//
	video.src = '//assets/ElainaV2/Backgrounds/Elaina1.webm';
//__________________________________________________________________________________________//


	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner);


//_______________________________________ CSS link _________________________________________//
	utils.addCss("//assets/ElainaV2/ElainaV2.css");
//__________________________________________________________________________________________//


	document.querySelector("body").prepend(video);
	removeIframe()
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]

		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("elaina-bg").style.filter = 'blur(10px) brightness(0.4) saturate(1.5)';
			document.getElementById("elaina-bg").pause()
		}
		else {
			elaina_play_pause()
		}
	})
//__________________________________ Background music link__________________________________//
var source = "https://raw.githubusercontent.com/Roydevil/Elaina-V2/main/assets/ElainaV2/Backgrounds/Old-Ranked_Draft-Champion_Select.mp3"
//__________________________________________________________________________________________//


var audio = document.createElement("audio");
// Auto play audio //
audio.autoplay = true;
// Loop audio //
audio.loop = true;
// Audio volume (0.0 is mute, 1.0 is highest) //
audio.volume = 0.2;
audio.load()
audio.addEventListener("load", function() { 
   audio.play(); 
}, true);
audio.src = source;


})
