import data from '../configs/ElainaV2_config.json'
import utils from './_utilselaina'


let default_settings = data
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
		wallpaperaudio.volume = 0.0;
		audio.volume = 0.0
	}
	else {
		wallpaperaudio.volume = default_settings["video_sound_volume"];
		audio.volume = default_settings["audio_sound_volume"];
	}
}

function audio_volume() {
	let audio = document.getElementById("bg-audio")
	let wallpaperaudio = document.getElementById("elaina-bg")

	audio.volume = 0.02
	wallpaperaudio.volume = 0.02
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
	const containeraudio = document.createElement("div")
	
	const pauseBg        = document.createElement("div");
	const pauseAudio     = document.createElement("div");
	const nextBg         = document.createElement("div");
	const prevBg         = document.createElement("div");
	
	const pauseBgIcon    = document.createElement("img")
	const nextBgIcon     = document.createElement("img")
	const pauseAudioIcon = document.createElement("img")
	const prevBgIcon     = document.createElement("img")
	const audioVolume    = document.createElement("input")


	

	container.classList.add("webm-bottom-buttons-container")
	containeraudio.classList.add("audio-volume-panel")
	

	pauseBg.id = "pause-bg"
	nextBg.id = "next-bg"
	pauseAudio.id = "pause-audio"
	prevBg.id = "prev-bg"
	

	nextBgIcon.classList.add("next-bg-icon")
	prevBgIcon.classList.add("prev-bg-icon")
	pauseBgIcon.classList.add("pause-bg-icon")
	pauseAudioIcon.classList.add("pause-audio-icon")
	audioVolume.classList.add("audio-volume")

	audioVolume.setAttribute("type", "range")
	
	
	play_pause_set_icon_audio(pauseAudioIcon)
	play_pause_set_icon(pauseBgIcon)


	pauseAudio.addEventListener("click", () => {
		force_audio_pause = !force_audio_pause
		audio_play_pause()
		play_pause_set_icon_audio()
	})
	
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
		//showcontainer.appendChild(containeraudio)
		

	container.append(pauseAudio)
	container.append(pauseBg)
	//container.append(prevBg)
	container.append(nextBg)
	

	pauseAudio.append(pauseAudioIcon)
	pauseBg.append(pauseBgIcon)
	//prevBg.append(prevBgIcon)
	nextBg.append(nextBgIcon)

	//containeraudio.append(audioVolume)
}
//___________________________________________________________________________//



//___________________________________________________________________________//
let CreateHomeButton = (node) => {
	let previous_page;
	let pagename;
		pagename = node.getAttribute("data-screen-name")

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

	if (previous_page != pagename)
		previous_page = pagename
}

window.addEventListener('load', () => {
	utils.mutationObserverAddCallback(CreateHomeButton, ["screen-root"])
})
//___________________________________________________________________________//



//___________________________________________________________________________//
window.addEventListener('load', () => {	

	const video = document.createElement('video');
		video.id = 'elaina-bg';
		video.autoplay = true;
		video.loop = true;
		video.src = default_settings["default_wallpaper_src"];
		video.volume = default_settings["video_sound_volume"];

	const audio = document.createElement("audio");
    	audio.autoplay = true;
    	audio.loop = true;
    	audio.src = default_settings["audio_src"];
    	audio.id = 'bg-audio';
    	audio.load();
    	audio.addEventListener("load", function() { 
			audio.play()
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
})

