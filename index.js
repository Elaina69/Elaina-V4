/**
 * @name ElainaV4
 * @author Elaina Da Catto
 * @description Elaina theme for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */


let initLink
let eConsole = "%c Elaina "
let eCss = "color: #ffffff; background-color: #f77fbe"

console.log(eConsole+'%c By %cElaina Da Catto',eCss,"", "color: #e4c2b3")
console.log(eConsole+'%c Meow ~~~',eCss, "color: #e4c2b3")


//Set new or restore Datastore file
import "./src/CDN/BackupAndRestoreDatastore.js"


// Refresh backgrounds list
const regex = {
	Wallpaper: /\.(mp4|webm|mkv|mov|avi|wmv)$/,
	ImgaeWallpaper: /\.(png|jpg|jpeg|gif)$/,
	Audio: /\.(mp3|flac|ogg|wav|aac)$/,
	Font: /\.(ttf|otf)$/,
	Banner: /\.(png|jpg|jpeg|gif)$/,
}

const getThemeList = window.setInterval(async ()=>{
	let originLists = await Promise.all([
		PluginFS.ls("./src/Assets/Backgrounds/Wallpapers"),
		PluginFS.ls("./src/Assets/Backgrounds/Audio"),
		PluginFS.ls("./src/Assets/Fonts/Custom"),
		PluginFS.ls("./src/Assets/Icon/Regalia-Banners"),
	])
	const [originWallpaperList, originAudioList, originFontList, originBannerList] = originLists;

	const Lists = {
		Wallpaper: originWallpaperList.filter(file => regex.Wallpaper.test(file)),
		Audio: originAudioList.filter(file => regex.Audio.test(file)),
		Font: originFontList.filter(file => regex.Font.test(file)),
		Banner: originBannerList.filter(file => regex.Banner.test(file))
	}

	DataStore.set("Audio-list", Lists.Audio)
	DataStore.set("Font-list", Lists.Font)
	DataStore.set("Banner-list", Lists.Banner)
	DataStore.set("Wallpaper-list", Lists.Wallpaper)
	DataStore.set("video-2nd-loop", false)
	if (document.getElementById("elaina-bg")) {
		window.setTimeout(() => { 
			window.clearInterval(getThemeList) 
			console.log(eConsole+`%c Stopped reloading list`,eCss,"")
		}, 3000)
	}
}, 1000)


// Checking if this's the first run of this theme or not
if (DataStore.get("Dev-mode")) {
	initLink = `//plugins/${getThemeName()}/elaina-theme-data/cdninit.js`
	let res = await fetch(`//plugins/${getThemeName()}/elaina-theme-data/index.js`)
	if (res.status == 200) (await (() => import(`//plugins/${getThemeName()}/elaina-theme-data/index.js`))()).default
	else {
		console.warn(eConsole+`%c Failed to load data`,eCss,"")
		Toast.error("Failed to load data")
	}
}
else {
	if (!DataStore.get("ElainaTheme-First run")) {
		initLink = `https://unpkg.com/elaina-theme-data@latest/cdninit.js`

		let res = await fetch("https://unpkg.com/elaina-theme-data@latest/index.js")
		if (res.status == 200) (await (() => import("https://unpkg.com/elaina-theme-data@latest/index.js"))()).default
		else {
			console.warn(eConsole+`%c Failed to load data`,eCss,"")
			Toast.error("Failed to load data")
		}
		DataStore.set("ElainaTheme-First run", true)
	}
	else {
		initLink = `https://unpkg.com/elaina-theme-data@${DataStore.get("Cdn-version")}/cdninit.js`

		let res = await fetch(`https://unpkg.com/elaina-theme-data@${DataStore.get("Cdn-version")}/index.js`)
		if (res.status == 200) (await (() => import(`https://unpkg.com/elaina-theme-data@${DataStore.get("Cdn-version")}/index.js`))()).default
		else {
			console.warn(eConsole+`%c Failed to load data`,eCss,"")
			Toast.error("Failed to load data")
		}
	}
}


// Import theme's contents
import { setHomePage } from "./src/Theme/Homepage.js"
import { transparentLobby } from "./src/Theme/ApplyUI.js"

import "./src/Theme/ApplyUI.js"
import "./src/Theme/Homepage.js"
import "./src/Theme/Filters.js"
import "./src/Theme/LoadCss.js"
import "./src/Theme/ThemePreSettingsTab.js"
import "./src/CDN/Manual-Update.js"
import "./src/Plugins/Custom-Status.js"
import "./src/Configs/Custom-Status.txt?raw"
try { (await (() => import(`https://elainatheme.xyz/index.js`))()).default }
catch { console.warn(eConsole+`%c Failed to load backup datastore feature`,eCss,"") }


// Export Init
let {Cdninit} = await import (initLink)
export function init(context) {
	setHomePage(context)
	transparentLobby(context)
	Cdninit(context)
	//themeList(context)
}

// Get this theme folder's name and export it
export function getThemeName() {
	const error = new Error();
	const stack = error.stack;

	let scriptPath = stack?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0]
	let match = scriptPath.match(/\/([^/]+)\/index\.js$/)

	return match ? match[1]:null
}