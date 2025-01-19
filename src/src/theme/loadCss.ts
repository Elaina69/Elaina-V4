import utils from "../utils/utils.ts"
import { getThemeName } from "../otherThings"

let icdata: Object = (await import(`//plugins/${getThemeName()}/config/icons.js`)).default;
let filters: Object = (await import(`//plugins/${getThemeName()}/config/filters.js`)).default;

let datapath: string = `//plugins/${getThemeName()}/`
let iconFolder: string = `${datapath}assets/icon/`
let bgFolder: string = `${datapath}assets/backgrounds/`

class AddCss {
	cssVar = () => {
		utils.addStyle(/*css*/`
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
				--play-button-filter: ${filters["PlayButton"]};
				--find-match-button: ${filters["find-match-button"]};
				--PartiesStatusCard: ${filters["PartiesStatusCard"]};
			}
		`)
	}

	mainThemeCss = () => {
		utils.addStyle(
			`@import url("${datapath}assets/styles/themes/elaina.css");\n` + 
			`@font-face {\n\tfont-family: 'Elaina';\n\tsrc: url('${datapath}assets/fonts/beaufortforlol-bold.ttf')\n}`
		)
	}

	componentsCss = () => {
		let cssImports = "";
		let addonCssList = {
			"componentsCss": [
				{
					key: "hide-vertical-lines",
					css: "hide-vertical-lines.css",
					altCss: "null.css"
				},
				{
					key: "aram-only",
					css: "aram-only.css",
					altCss: "null.css"
				},
				{
					key: "hide-champions-splash-art",
					css: "hide-champs-splash-art.css",
					altCss: "null.css"
				},
				{
					key: "animate-loading",
					css: "animate-loading-screen.css",
					altCss: "static-loading-screen.css"
				},
				{
					key: "custom-navbar-css",
					css: "customNavbar.css",
					altCss: "null.css"
				},
				{
					key: "lobby-transparent-filter",
					css: "lobby-transparent-filter.css",
					altCss: "null.css"
				},
				{
					key: "sidebar-transparent",
					css: "sidebar-transparent.css",
					altCss: "sidebar-color.css"
				},
			],
	
			"iconCss": [
				{
					key: 'Custom-Avatar',
					css: 'avatar.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-RP-Icon',
					css: 'riotpoint.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-Clash-banner',
					css: 'clashbanner.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-BE-Icon',
					css: 'blueessence.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-Rank-Icon',
					css: 'rank.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-Emblem',
					css: 'emblem.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-Ticker',
					css: 'ticker.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-Trophy',
					css: 'trophy.css',
					altCss: "null.css"
				},
				{
					key: 'Custom-Gamemode-Icon',
					css: "gamemodes.css",
					altCss: "null.css"
				}
			]
		};
	
		for (const groupKey in addonCssList) {
			addonCssList[groupKey].forEach(({ key, css, altCss }) => {
				let cssPath = window.DataStore.get(key) ? css : altCss;

				if ((cssPath && groupKey == "iconCss" && window.DataStore.get("Custom-Icon"))
				||  (cssPath && groupKey == "componentsCss")) {
					cssImports += `@import url("${datapath}assets/styles/components/${cssPath}");\n`;
				}
			});
		}
	
		utils.addStyle(cssImports);
	};

	customFont = () => {
		utils.addFont(`${datapath}assets/fonts/${window.DataStore.get("CurrentFont")}`,"Custom-font","Custom")
	}

	customCursor = () => {
		utils.CustomCursor(`url("${iconFolder}${icdata["Mouse-cursor"]}")`,`@import url("${datapath}assets/styles/components/cursor.css")`)
	}

	customNicknameColor = () => {
		utils.addStyleWithID("nickname-color-css", /*css*/`
			span.player-name__force-locale-text-direction {
				color: ${window.DataStore.get("nickname-color-with-opacity")};
			}
		`)
	}
}

export class LoadCss {
	main = () => {
		const addCss = new AddCss()

		addCss.mainThemeCss()
		addCss.componentsCss()
		addCss.cssVar()

		if (window.DataStore.get("Custom-Font")) addCss.customFont()
		if (window.DataStore.get("Custom-Cursor")) addCss.customCursor()
		if (window.DataStore.get("change-nickname-color")) addCss.customNicknameColor()
	}
}