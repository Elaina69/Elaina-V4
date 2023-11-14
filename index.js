/**
 * @name ElainaV3
 * @author Elaina Da Catto
 * @description Elaina theme 3rd Generation for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

let eConsole = "%c ElainaV3 "
let eCss = "color: #ffffff; background-color: #f77fbe"

console.log(eConsole+'%c By %cElaina Da Catto',eCss,"", "color: #e4c2b3")
console.log(eConsole+'%c Meow ~~~',eCss, "color: #e4c2b3")

export function getPluginsName() {
	let scriptPath = getScriptPath()
	let regex = /\/([^/]+)\/index\.js$/
	let match = scriptPath.match(regex)
	let pluginsname = match ? match[1]:null
	return pluginsname
}
export * from "./data/ImportPlugins.js" 

import "./data/Data.js"
import "./data/built-in_plugins/Custom-Status"
import "./data/built-in_plugins/Old-LL-Settings"
import "./data/ChangeFilters.js"
import "./data/homepage.js"
import "./data/loadCss.js"
import "./data/_utils.js"
import "./data/built-in_plugins/KeyCombines.js"
import "./data/configs/Custom-Status.txt?raw"
import "./data/Manual-Update.js"
import axios from "https://cdn.skypack.dev/axios"

window.setInterval(async ()=> {
	let originWallpaperList = await PluginFS.ls("./data/assets/Backgrounds/Wallpapers")
	let originAudioList = await PluginFS.ls("./data/assets/Backgrounds/Audio")
	let originFontList = await PluginFS.ls("./data/assets/Fonts/Custom")
	  
	const Wallpaperregex = /\.(mp4|webm|mkv|mov|avi|wmv)$/
	const Audioregex = /\.(mp3|flac|ogg|wav|aac)$/
	const Fontregex = /\.(ttf|otf)$/
	
	const WallpaperList = originWallpaperList.filter((file) => Wallpaperregex.test(file))
	const AudioList = originAudioList.filter((file) => Audioregex.test(file))
	const FontList = originFontList.filter((file) => Fontregex.test(file)) 

	DataStore.set("Wallpaper-list", WallpaperList)
	DataStore.set("Audio-list", AudioList)
	DataStore.set("Font-list", FontList)
},1000)

if (DataStore.get("Dev-mode")) {
	let res = await fetch(`//plugins/${getPluginsName()}/ElainaV3-Data/index.js`)
	if (res.status == 200) {
		(await (() => import(`//plugins/${getPluginsName()}/ElainaV3-Data/index.js`))()).default
	}
	else {
		console.warn(`Failed to load ElainaV3 data`)
		Toast.error("Failed to load ElainaV3 data")
	}
}
else {
	let res = await fetch("https://unpkg.com/elainav3-data@latest/index.js")
	if (res.status == 200) {
		(await (() => import("https://unpkg.com/elainav3-data@latest/index.js"))()).default
	}
	else {
		console.warn(`Failed to load ElainaV3 data`)
		Toast.error("Failed to load ElainaV3 data")
	}
}