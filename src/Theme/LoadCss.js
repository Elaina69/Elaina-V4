import utils from "../Utilities/_utils.js"
import icdata from "../Configs/Icons.js"

let datapath = new URL("..", import.meta.url).href
let iconFolder  = `${datapath}Assets/Icon/`
let bgFolder    = `${datapath}Assets/Backgrounds/`

window.addEventListener("load",async ()=> {
	let addonCssList = {
		a: { key: "hide-vertical-lines", css: "Hide-vertical-lines.css", altCss: "null.css" },
		b: { key: "aram-only", css: "Aram-only.css", altCss: "null.css" },
		c: { key: "Hide-Champions-Splash-Art", css: "Hide-Champs-Splash-Art.css", altCss: "null.css" },
		d: { key: "Sidebar-Transparent", css: "Sidebar-Transparent.css", altCss: "Sidebar-Color.css" },
		e: { key: "Animate-Loading", css: "Animate-Loading-Screen.css", altCss: "Static-Loading-Screen.css" },
		f: { key: "Custom-Navbar-Css", css: "Custom-Navbar-Css.css", altCss: "null.css" },
	}
	for (let prop in addonCssList) {
		let { key, css, altCss } = addonCssList[prop]
		let cssPath = DataStore.get(key) ? css : altCss
		if (cssPath) {
			addonCssList[prop] = `@import url("${datapath}assets/Css/Addon-Css/${cssPath}");`
		}
	}
	let {a,b,c,d,e,f} = addonCssList
	utils.addStyle(a+b+c+d+e+f)

	utils.addStyle(/*css*/`
		@import url("${datapath}assets/Css/Elaina.css");
		@font-face {font-family: 'Elaina'; src: url('${datapath}assets/Fonts/BeaufortforLOL-Bold.ttf')}
		:root {
			--classic_def: url("${iconFolder}Gamemodes/${icdata["classic_def"]}");
			--classic_act: url("${iconFolder}Gamemodes/${icdata["classic_act"]}");
			--aram_def: url("${iconFolder}Gamemodes/${icdata["aram_def"]}");
			--aram_act: url("${iconFolder}Gamemodes/${icdata["aram_act"]}");
			--tft_def: url("${iconFolder}Gamemodes/${icdata["tft_def"]}");
			--tft_act: url("${iconFolder}Gamemodes/${icdata["tft_act"]}");
			--cherry_def: url("${iconFolder}Gamemodes/${icdata["cherry_def"]}");
			--cherry_act: url("${iconFolder}Gamemodes/${icdata["cherry_act"]}");
			--pri8000: url("${bgFolder}Runes/${icdata['Precision']}");
			--pri8100: url("${bgFolder}Runes/${icdata['Domination']}");
			--pri8200: url("${bgFolder}Runes/${icdata['Sorcery']}");
			--pri8300: url("${bgFolder}Runes/${icdata['Inspiration']}");
			--pri8400: url("${bgFolder}Runes/${icdata['Resolve']}");
			--Avatar: url("${iconFolder}${icdata["Avatar"]}");
			--RP-Icon: url("${iconFolder}${icdata["RP-icon"]}");
			--BE-Icon: url("${iconFolder}${icdata["BE-icon"]}");
			--Rank-Icon: url("${iconFolder}${icdata["Rank-icon"]}");
			--Emblem: url("${iconFolder}${icdata["Honor"]}");
			--Clash-banner: url("${iconFolder}${icdata["Class-banner"]}");
			--Ticker: url("${iconFolder}${icdata["Ticker"]}");
			--Trophy: url("${iconFolder}${icdata["Trophy"]}");
			--Border: url("${iconFolder}${icdata["Border"]}");
			--ElainaFly: url("${iconFolder}${icdata["Animation-logo"]}");
			--ElainaStatic: url("${iconFolder}${icdata["Static-logo"]}");
			--Hover-card-backdrop: url("${iconFolder}${icdata['Hover-card']}");
		}
	`)
	if (DataStore.get("Custom-Icon")) {
		let cssList = {
			'Custom-Avatar': 'Avatar.css',
			'Custom-RP-Icon': 'RiotPoint.css',
			'Custom-BE-Icon': 'BlueEssence.css',
			'Custom-Rank-Icon': 'Rank.css',
			'Custom-Emblem': 'Emblem.css',
			'Custom-Clash-banner': 'ClashBanner.css',
			'Custom-Ticker': 'Ticker.css',
			'Custom-Trophy': 'Trophy.css',
			'Custom-Gamemode-Icon': "Gamemodes.css"
		}
		let [a, b, c, d, e, f, g, h, i] = Object.entries(cssList).map(([key, value]) => {
			if (DataStore.get(key)) {
			  	return `@import url("${datapath}assets/Css/Addon-Css/Icon/${value}");`
			}
			return ''
		})
		utils.addStyle(a+b+c+d+e+f+g+h+i)
	}
	
	if (DataStore.get("Custom-Font")) {
		utils.addFont(`${datapath}assets/Fonts/Custom/${DataStore.get("CurrentFont")}`,"Custom-font","Custom")
	}
	if (DataStore.get("Custom-Cursor")) {
		utils.CustomCursor(`url("${iconFolder}${icdata["Mouse-cursor"]}")`,`@import url("${datapath}assets/Css/Addon-Css/Cursor.css")`)
	}
})