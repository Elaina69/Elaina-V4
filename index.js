/**
 * @name ElainaV3
 * @author Elaina Da Catto
 * @description Elaina theme 3rd Generation for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

let initLink
let eConsole = "%c ElainaV3 "
let eCss = "color: #ffffff; background-color: #f77fbe"

import "./data/Theme.js"

if (DataStore.get("Dev-mode")) {
	initLink = `//plugins/${getPluginsName()}/ElainaV3-Data/cdninit.js`
	let res = await fetch(`//plugins/${getPluginsName()}/ElainaV3-Data/index.js`)
	if (res.status == 200) (await (() => import(`//plugins/${getPluginsName()}/ElainaV3-Data/index.js`))()).default
	else {
		console.warn(eConsole+`%c Failed to load ElainaV3 data`,eCss,"")
		Toast.error("Failed to load ElainaV3 data")
	}
}
else {
	if (!DataStore.get("ElainaV3-First run")) {
		initLink = `https://unpkg.com/elainav3-data@latest/cdninit.js`

		let res = await fetch("https://unpkg.com/elainav3-data@latest/index.js")
		if (res.status == 200) (await (() => import("https://unpkg.com/elainav3-data@latest/index.js"))()).default
		else {
			console.warn(eConsole+`%c Failed to load ElainaV3 data`,eCss,"")
			Toast.error("Failed to load ElainaV3 data")
		}
		DataStore.set("ElainaV3-First run", true)
	}
	else {
		initLink = `https://unpkg.com/elainav3-data@${DataStore.get("Cdn-version")}/cdninit.js`

		let res = await fetch(`https://unpkg.com/elainav3-data@${DataStore.get("Cdn-version")}/index.js`)
		if (res.status == 200) (await (() => import(`https://unpkg.com/elainav3-data@${DataStore.get("Cdn-version")}/index.js`))()).default
		else {
			console.warn(eConsole+`%c Failed to load ElainaV3 data`,eCss,"")
			Toast.error("Failed to load ElainaV3 data")
		}
	}
}

console.log(eConsole+'%c By %cElaina Da Catto',eCss,"", "color: #e4c2b3")
console.log(eConsole+'%c Meow ~~~',eCss, "color: #e4c2b3")

let {Cdninit} = await import (initLink)

import { setHomePage, transparentLobby, themeList } from "./data/Theme.js"
import "./data/Manual-Update.js"
import "./data/built-in_plugins/Custom-Status"
import "./data/configs/Custom-Status.txt?raw"

export function getPluginsName() {
	const error = new Error();
	const stack = error.stack;

	let scriptPath = stack?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0]
	let match = scriptPath.match(/\/([^/]+)\/index\.js$/)

	return match ? match[1]:null
}

export function init(context) {
	setHomePage(context)
	transparentLobby(context)
	Cdninit(context)
	themeList(context)
}

let renewList = (target, list) => {
	for(let i = 0; i < list.length; i++) {
		if (!DataStore.has(target) || DataStore.get(target).length != list.length || DataStore.get(target)[i] != list[i]) {
			DataStore.set(target, list)
			console.log(eConsole+`%c ${target} refreshed.`,eCss,"")
		}
	}
}

const regex = {
	Wallpaper: /\.(mp4|webm|mkv|mov|avi|wmv)$/,
	ImgaeWallpaper: /\.(png|jpg|jpeg|gif)$/,
	Audio: /\.(mp3|flac|ogg|wav|aac)$/,
	Font: /\.(ttf|otf)$/,
	Banner: /\.(png|jpg|jpeg|gif)$/,
}

window.setInterval(async ()=>{
	let originLists = await Promise.all([
		PluginFS.ls("./data/assets/Backgrounds/Wallpapers"),
		PluginFS.ls("./data/assets/Backgrounds/Audio"),
		PluginFS.ls("./data/assets/Fonts/Custom"),
		PluginFS.ls("./data/assets/Icon/Regalia-Banners"),
	]);

	let [originWallpaperList, originAudioList, originFontList, originBannerList] = originLists;

	let Lists = {
		Wallpaper: originWallpaperList.filter(file => regex.Wallpaper.test(file)),
		Audio: originAudioList.filter(file => regex.Audio.test(file)),
		Font: originFontList.filter(file => regex.Font.test(file)),
		Banner: originBannerList.filter(file => regex.Banner.test(file))
	};

	renewList("Audio-list", Lists.Audio)
	renewList("Font-list", Lists.Font)
	renewList("Banner-list", Lists.Banner)
	for(let i = 0; i < Lists.Wallpaper.length; i++) {
		if (!DataStore.has("Wallpaper-list") || DataStore.get("Wallpaper-list").length != Lists.Wallpaper.length || DataStore.get("Wallpaper-list")[i] != Lists.Wallpaper[i]) {
			DataStore.set("Wallpaper-list", Lists.Wallpaper)
			DataStore.set("video-2nd-loop", false)
			console.log(eConsole+`%c Wallpaper-list refreshed.`,eCss,"")
		}
	}
}, 1000)