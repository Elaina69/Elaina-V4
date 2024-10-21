import utils from "../utils/utils.ts"

let icdata = (await import(`//plugins/${window.getThemeName()}/config/icons.js`)).default;

let datapath = `//plugins/${window.getThemeName()}/`
let iconFolder  = `${datapath}assets/icon/`
let bgFolder    = `${datapath}assets/backgrounds/`

window.addEventListener("load",async ()=> {
	let cssImports = "";
	let addonCssList = {
		a: { key: "hide-vertical-lines", css: "hide-vertical-lines.css", altCss: "null.css" },
		b: { key: "aram-only", css: "aram-only.css", altCss: "null.css" },
		c: { key: "hide-champions-splash-art", css: "hide-champs-splash-art.css", altCss: "null.css" },
		d: { key: "sidebar-transparent", css: "sidebar-transparent.css", altCss: "sidebar-color.css" },
		e: { key: "animate-loading", css: "animate-loading-screen.css", altCss: "static-loading-screen.css" },
		f: { key: "custom-navbar-css", css: "customNavbar.css", altCss: "null.css" },
		g: { key: "lobby-transparent-filter", css: "lobby-transparent-filter.css", altCss: "null.css"}
	}

	for (let prop in addonCssList) {
		let { key, css, altCss } = addonCssList[prop];
		let cssPath = window.DataStore.get(key) ? css : altCss;
		if (cssPath) {
			cssImports += `@import url("${datapath}assets/styles/components/${cssPath}");\n`; // Cộng chuỗi CSS vào
		}
	}

	utils.addStyle(cssImports)

	utils.addStyle(/*css*/`
		@import url("${datapath}assets/styles/themes/elaina.css");
		@font-face {font-family: 'Elaina'; src: url('${datapath}assets/fonts/beaufortforlol-bold.ttf')}
		:root {
			--classic_def: url("${iconFolder}gamemodes/${icdata["classic_def"]}");
			--classic_act: url("${iconFolder}gamemodes/${icdata["classic_act"]}");
			--aram_def: url("${iconFolder}gamemodes/${icdata["aram_def"]}");
			--aram_act: url("${iconFolder}gamemodes/${icdata["aram_act"]}");
			--tft_def: url("${iconFolder}gamemodes/${icdata["tft_def"]}");
			--tft_act: url("${iconFolder}gamemodes/${icdata["tft_act"]}");
			--cherry_def: url("${iconFolder}gamemodes/${icdata["cherry_def"]}");
			--cherry_act: url("${iconFolder}gamemodes/${icdata["cherry_act"]}");
			--pri8000: url("${bgFolder}runes/${icdata['Precision']}");
			--pri8100: url("${bgFolder}runes/${icdata['Domination']}");
			--pri8200: url("${bgFolder}runes/${icdata['Sorcery']}");
			--pri8300: url("${bgFolder}runes/${icdata['Inspiration']}");
			--pri8400: url("${bgFolder}runes/${icdata['Resolve']}");
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
	if (window.DataStore.get("Custom-Icon")) {
		let cssList = {
			'Custom-Avatar': 'avatar.css',
			'Custom-RP-Icon': 'riotpoint.css',
			'Custom-BE-Icon': 'blueessence.css',
			'Custom-Rank-Icon': 'rank.css',
			'Custom-Emblem': 'emblem.css',
			'Custom-Clash-banner': 'clashbanner.css',
			'Custom-Ticker': 'ticker.css',
			'Custom-Trophy': 'trophy.css',
			'Custom-Gamemode-Icon': "gamemodes.css"
		};
		
		let cssImports = Object.entries(cssList).map(([key, value]) => {
			if (window.DataStore.get(key)) {
				return `@import url("${datapath}assets/styles/components/${value}");`;
			}
			return '';
		}).join('');
		
		utils.addStyle(cssImports);
	}
	
	if (window.DataStore.get("Custom-Font")) {
		utils.addFont(`${datapath}assets/fonts/${window.DataStore.get("CurrentFont")}`,"Custom-font","Custom")
	}
	if (window.DataStore.get("Custom-Cursor")) {
		utils.CustomCursor(`url("${iconFolder}${icdata["Mouse-cursor"]}")`,`@import url("${datapath}assets/styles/components/cursor.css")`)
	}
	if (window.DataStore.get("change-nickname-color")) {
		utils.addStyleWithID("nickname-color-css", /*css*/`
			span.player-name__force-locale-text-direction {
				color: ${window.DataStore.get("nickname-color-with-opacity")};
			}
		`)
	}
})