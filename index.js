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

async function loadData(cdn) {
	let res = await fetch(cdn)
	if (res.status == 200) (await (() => import(cdn))()).default
	else {
		console.warn(eConsole+`%c Failed to load ElainaV3 data`,eCss,"")
		Toast.error("Failed to load ElainaV3 data")
	}
	console.log(eConsole+'%c By %cElaina Da Catto',eCss,"", "color: #e4c2b3")
	console.log(eConsole+'%c Meow ~~~',eCss, "color: #e4c2b3")
}

if (DataStore.get("Dev-mode")) {
	initLink = `//plugins/${getPluginsName()}/ElainaV3-Data/cdninit.js`
	loadData(`//plugins/${getPluginsName()}/ElainaV3-Data/index.js`)
}
else {
	if (!DataStore.has("ElainaV3-First run")) {
		initLink = `https://unpkg.com/elainav3-data@latest/cdninit.js`
		loadData("https://unpkg.com/elainav3-data@latest/index.js")
		DataStore.set("ElainaV3-First run", true)
	}
	else {
		initLink = `https://unpkg.com/elainav3-data@${DataStore.get("Theme-version")}/cdninit.js`
		loadData(`https://unpkg.com/elainav3-data@${DataStore.get("Theme-version")}/index.js`)
	}
}

let {Cdninit} = await import (initLink)
import { setHomePage, transparentLobby, themeList } from "./data/Theme.js"
import "./data/Manual-Update.js"
import "./data/built-in_plugins/Custom-Status"
import "./data/configs/Custom-Status.txt?raw"

export function getPluginsName() {
	let scriptPath = getScriptPath()
	let regex = /\/([^/]+)\/index\.js$/
	let match = scriptPath.match(regex)
	let pluginsname = match ? match[1]:null
	return pluginsname
}
export function init(context) {
	setHomePage(context)
	transparentLobby(context)
	Cdninit(context)
	themeList(context)
}
window.setInterval(async ()=> {
	let renewList = (target, list) => {
		if (DataStore.get(target).length != list.length) 
			DataStore.set(target, list)
	}
	let originLists = await Promise.all([
		PluginFS.ls("./data/assets/Backgrounds/Wallpapers"),
		PluginFS.ls("./data/assets/Backgrounds/Audio"),
		PluginFS.ls("./data/assets/Fonts/Custom"),
		PluginFS.ls("./data/assets/Icon/Regalia-Banners"),
	]);
	let [originWallpaperList, originAudioList, originFontList, originBannerList] = originLists;

	let regex = {
		Wallpaper: /\.(mp4|webm|mkv|mov|avi|wmv)$/,
		Audio: /\.(mp3|flac|ogg|wav|aac)$/,
		Font: /\.(ttf|otf)$/,
		Banner: /\.(png|jpg|jpeg|gif)$/,
	};

	let Lists = {
		Wallpaper: originWallpaperList.filter(file => regex.Wallpaper.test(file)),
		Audio: originAudioList.filter(file => regex.Audio.test(file)),
		Font: originFontList.filter(file => regex.Font.test(file)),
		Banner: originBannerList.filter(file => regex.Banner.test(file))
	};

	renewList("Wallpaper-list", Lists.Wallpaper)
	renewList("Audio-list", Lists.Audio)
	renewList("Font-list", Lists.Font)
	renewList("Banner-list", Lists.Banner)
},1000)