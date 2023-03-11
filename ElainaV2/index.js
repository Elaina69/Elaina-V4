/* By Elaina Da Catto */
/* Meow~~~ */


import utils from './addon-plugins/_utilselaina'
import data from './configs/ElainaV2_config.json'

import './addon-plugins/Hide_friendlist'
import './addon-plugins/LL-Settings' 
import './addon-plugins/Aram-only'
import './addon-plugins/Auto-accept'
import './addon-plugins/Dodge-button'
import './addon-plugins/Offline-mode'




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
		window.setInterval(() => {
			try {
				let base = document.querySelector("lol-regalia-parties-v2-element.regalia-loaded").shadowRoot.querySelector(".regalia-parties-v2-banner-backdrop.regalia-banner-loaded")

				base.shadowRoot.querySelector(".regalia-banner-asset-static-image").style.filter = "sepia(1) brightness(3.5) opacity(0.4)"
				base.shadowRoot.querySelector(".regalia-banner-state-machine").shadowRoot.querySelector(".regalia-banner-intro.regalia-banner-video").style.filter = "grayscale(1) saturate(0) brightness(0.5)"
			}
			catch {}

			try {
				document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.querySelector("div > div > div.regalia-parties-v2-crest-wrapper > lol-regalia-crest-v2-element").
					shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
			}
			catch {}
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
	const container      = document.createElement("div")
	
	const pauseBg        = document.createElement("div");
	const pauseAudio     = document.createElement("div");
	const nextBg         = document.createElement("div");
	const prevBg         = document.createElement("div");
	
	const pauseBgIcon    = document.createElement("img")
	const nextBgIcon     = document.createElement("img")
	const pauseAudioIcon = document.createElement("img")
	const prevBgIcon     = document.createElement("img")
	

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
}
//___________________________________________________________________________//



//___________________________________________________________________________//
function ElainaTrigger() {
    const container0  = document.createElement("div")
    const container2  = document.createElement("div")
	const container3  = document.createElement("div")
	const container4  = document.createElement("div")
	const container5  = document.createElement("div")
	const container6  = document.createElement("div")
	const container7  = document.createElement("div")
	const container8  = document.createElement("div")
	const container9  = document.createElement("div")
	const container10 = document.createElement("div")
	const container11 = document.createElement("div")
	const container12 = document.createElement("div")

	const Greeting     = document.createElement("p")

	const watermark    = document.createElement("div");
	const wtmark       = document.createElement("p")

	const Elaina1ImageDiv = document.createElement("div");
	const Elaina1Image    = document.createElement("img")
	const Elaina1TextDiv  = document.createElement("div");
	const Elaina1Text     = document.createElement("p")

	const headpatdiv   = document.createElement("div");
	const headpat      = document.createElement("button")

	const boobsdiv     = document.createElement("div");	
	const boobs        = document.createElement("button")

	const answer1      = document.createElement("p")
	const answer2      = document.createElement("p")
	const answer3      = document.createElement("a")

	const goOutSidediv = document.createElement("div");
	const goOutSide    = document.createElement("button");

	const answer4      = document.createElement("p")
	const answer5      = document.createElement("p")


	container0.classList.add ("watermark-text")
	container2.classList.add ("Elaina1ImageCon")
	container3.classList.add ("Elaina1TextCon")
    container4.classList.add ("Greeting-con")
	container5.classList.add ("Headpat-con")
	container6.classList.add ("Boobs-con")
	container7.classList.add ("answer1-con")
	container8.classList.add ("answer2-con")
	container9.classList.add ("answer3-con")
	container10.classList.add("goOutSide-con")
	container11.classList.add("answer4-con")
	container12.classList.add("answer5-con")
	

	wtmark.classList.add("watermark")
	wtmark.innerHTML = "By Elaina Da Catto";


	Greeting.classList.add ("Greeting")
	headpat.classList.add  ("Headpat")
	boobs.classList.add    ("Boobs")
	goOutSide.classList.add("GoOutSide")

		
	Elaina1Text.classList.add ("Elaina1Text")
	Elaina1Image.classList.add("Elaina1Image")
	Elaina1Image.setAttribute ("src", "//plugins/ElainaV2/assets/Icon/ElainaCB.png")	
	Elaina1Image.style.visibility = "hidden"
	
			
	answer1.id = "answer1"
	answer2.id = "answer2"
	answer3.id = "answer3"
	answer4.id = "answer4"
	answer5.id = "answer5"


	let count = 0;
	let Headpatcount = 0;
	let answer2clicked = 0;
	let showcontainer = document.getElementsByClassName("rcp-fe-lol-home")[0]

	
	wtmark.addEventListener("click", () => {
		count += 1;
		if (count > 0) {
			wtmark.style.visibility = "hidden"
			Elaina1Image.style.visibility = "visible"
			Elaina1Text.innerHTML =  "Huh ?";


			function generateGreeting(date) {
				const hour = date.getHours();
				Elaina1Text.innerHTML = " "
				switch (true) {
				  case hour >= 5 && hour < 12:
					return 'Good morning.You shouldn\'t play game at this time';
				  case hour >= 12 && hour < 18:
					return 'Good afternoon.It\'s nice time<br>to play game rights ?';
				case hour >= 18 && hour < 24:
					return 'Good evening.You should complete ur work before play game';
				default:
					return 'it\'s late, you should<br>go to bed now.';
				}
			}			  
			function updateCurrentTime() {
			const date = new Date();
			Greeting.innerHTML = generateGreeting(date);
				container4.style.bottom = "256px"
				container4.style.right = "225px"
				container4.style.position = "absolute"
				container4.style.display = "flex"
			}			  
			(() => {
				const interval = 1000;
				setTimeout(updateCurrentTime, interval);
			})();
			  
			
			showcontainer.appendChild(container10)
			showcontainer.appendChild(container4)
			showcontainer.appendChild(container5)
			showcontainer.appendChild(container6)

			container10.append(goOutSidediv)
			container4.append(Greeting)
			container5.append(headpatdiv)
			container6.append(boobsdiv)
			
			goOutSidediv.append(goOutSide)
			headpatdiv.append(headpat)
			boobsdiv.append(boobs)


			headpat.addEventListener("click", () => {
				Greeting.innerHTML = " "
				boobs.style.visibility = "visible"
				Headpatcount += 1;
				if (Headpatcount < 15) {
					Elaina1Text.innerHTML = "Meow ~~ !!"

					container3.style.bottom = "260px"
					container3.style.right = "280px"
				}
				if (Headpatcount >= 15) {
					Elaina1Text.innerHTML = "Mo... My hair is burning !!"

					container3.style.bottom = "260px"
					container3.style.right = "225px"
				}
			}, false);

			goOutSide.addEventListener("click", () => {
				Greeting.innerHTML = " "
				Elaina1Text.innerHTML = "You should go outside<br>and touch grass"
				container3.style.bottom = "250px"
				container3.style.right = "241px"

				boobs.style.visibility = "hidden"
				headpat.style.visibility = "hidden"
				goOutSide.style.visibility = "hidden"

				showcontainer.appendChild(container11)
				showcontainer.appendChild(container12)

				container11.append(answer4)
				container12.append(answer5)

				answer4.innerHTML = "\"I still want to play game tho\""
				answer5.innerHTML = "\"I want to go outside with you\""

				answer4.addEventListener("click", () => {
					Greeting.innerHTML = " "
					Elaina1Text.innerHTML = "Do what ever you want.<br>I don't care"
					container3.style.bottom = "249px"
					container3.style.right = "235px"

					boobs.style.visibility = "visible"	
					headpat.style.visibility = "visible"
					goOutSide.style.visibility = "visible"

					container11.remove()
					container12.remove()
				}, false);

				answer5.addEventListener("click", () => {
					Greeting.innerHTML = " "
					Elaina1Text.innerHTML = "I'm so proud of you.You <br>should turn off the client now<br> and hangout with me (≧▽≦)"
					container3.style.bottom = "238px"
					container3.style.right = "214px"

					container11.remove()
					container12.remove()
				}, false);
			}, false);

			boobs.addEventListener("click", () => {
				Greeting.innerHTML = " "
				Elaina1Text.innerHTML = "Ehh...where did you<br>just touch !?"

				container3.style.bottom = "250px"
				container3.style.right = "250px"

				answer1.innerHTML = "\"N...Nothing !!\""
				answer2.innerHTML = "\"I...I wanna see your boobs\""

				boobs.style.visibility = "hidden"
				headpat.style.visibility = "hidden"
				goOutSide.style.visibility = "hidden"


				answer1.addEventListener("click", () => {
					Greeting.innerHTML = " "
					Elaina1Text.innerHTML = "... You should be careful<br>next time"

					container3.style.bottom = "248px"
					container3.style.right = "239px"

					container7.remove()
					container8.remove()

					boobs.style.visibility = "visible"	
					headpat.style.visibility = "visible"
					goOutSide.style.visibility = "visible"
				}, false);

				answer2.addEventListener("click", () => {
					answer2clicked += 1;
					Greeting.innerHTML = " "
					Elaina1Text.innerHTML = "As you wish, my darling ~~"

					container3.style.bottom = "260px"
					container3.style.right = "219px"

					container7.remove()
					container8.remove()
	

					if (answer2clicked > 0) {
						showcontainer.appendChild(container9)
						container9.append(answer3)

						Greeting.innerHTML = " "
						answer3.innerHTML = "Take off her clothes"
						answer3.setAttribute("href", "https://media.discordapp.net/attachments/887677396315172894/1081501404729974804/6f5ba14e64dea4feb1349c3b658338349e0c1244.png")
						answer3.setAttribute("target", "_blank")
						answer3.addEventListener("click", () => {
							Elaina1Text.innerHTML = "..."

							container3.style.bottom = "260px"
							container3.style.right = "325px"

							boobs.style.visibility = "visible"
							headpat.style.visibility = "visible"
							goOutSide.style.visibility = "visible"

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
		}
	}, false);


	showcontainer.appendChild(container2)
	showcontainer.appendChild(container0)
	showcontainer.appendChild(container3)


	container0.append(watermark)
	container2.append(Elaina1ImageDiv)
	container3.append(Elaina1TextDiv)



	watermark.append(wtmark)
	Elaina1ImageDiv.append(Elaina1Image)
	Elaina1TextDiv.append(Elaina1Text)
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
			ElainaTrigger()
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
			try {
				document.getElementsByClassName("watermark-text")[0].remove()
				document.getElementsByClassName("Elaina1ImageCon")[0].remove()
				document.getElementsByClassName("Elaina1TextCon")[0].remove()
				document.getElementsByClassName("Greeting-con")[0].remove()
				document.getElementsByClassName("Headpat-con")[0].remove()
				document.getElementsByClassName("Boobs-con")[0].remove()
				document.getElementsByClassName("goOutSide-con")[0].remove()
				document.getElementsByClassName("answer1-con")[0].remove()
				document.getElementsByClassName("answer2-con")[0].remove()
				document.getElementsByClassName("answer3-con")[0].remove()
			}
			catch{}
			try {
				document.getElementsByClassName("answer3-con")[0].remove()
			}
			catch{}
			try {
				document.getElementsByClassName("answer4-con")[0].remove()
				document.getElementsByClassName("answer5-con")[0].remove()
			}
			catch{}
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

		window.setInterval(() => {
			try {
				document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div:nth-child(2) > img").remove()
				document.querySelector("div > div.summoner-xp-radial").remove()
			}
			catch {}

			try {
				document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
			}
			catch {}
		}, 100)
	
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
window.setInterval(() => { 
	try {
		document.getElementsByClassName("lol-settings-container")[0].style.backgroundColor = "transparent";
		document.querySelector(".lol-settings-container").shadowRoot.querySelector("div").style.background = "transparent";
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > lol-regalia-banner-v2-element").remove()
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.backgroundColor = "transparent";
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = "transparent";

		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > div > div.regalia-identity-customizer-crest-wrapper > lol-regalia-crest-v2-element").
			shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
	}
	catch {}

	try {
		document.querySelector("#lol-uikit-tooltip-root > div > div > div.hover-card.right.has-regalia.regalia-loaded > div > div.hover-card-info-container > div.hover-card-identity > lol-regalia-hovercard-v2-element").
			shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
	}
	catch {}
}, 100)
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