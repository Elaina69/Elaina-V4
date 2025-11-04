import utils from '../../utils/utils.ts'
import * as upl from 'pengu-upl';
import { getThemeName } from "../../otherThings"
import { log, error } from '../../utils/themeLog';
import { friendIconList } from '../../plugins/syncUserIcons.ts';

const icdata = (await import(`//plugins/${getThemeName()}/config/icons.js`)).default;

const datapath = `//plugins/${getThemeName()}/`
const iconFolder  = `${datapath}assets/icon/`

class CustomTickerIcon {
	tickerCss(element: any, defaults: Object) {
		Object.entries(defaults).forEach(([key, value]) => {
			element.shadowRoot.querySelector(key).style.cssText = value
		});
	}

	main = () => {
		upl.observer.subscribeToElementCreation("lol-uikit-flyout-frame",(element: any)=>{
			this.tickerCss(element,
				{
					".border": "display: none;",
					".sub-border": "display: none;",
					".caret": "display: none;",
					".lol-uikit-flyout-frame": "background-color: black; border-radius: 10px;"
				}
			)
		})
	}
}

class CustomAvatar {
	changeAvatar = (iconElement: HTMLImageElement) => {
		iconElement.style.backgroundImage = "var(--Avatar)"
		utils.freezeProperties(iconElement.style, ['backgroundImage'])
	}

	changeFriendAvatar = (element: any, iconElement: HTMLImageElement) => {
		if (friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id")) && friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.avatar != null) {
			iconElement.style.backgroundImage = `url(${friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.avatar})`
			utils.freezeProperties(iconElement.style, ['backgroundImage'])
		}
	}

	changeConversationChatAvatar = async (element: any) => {
		let chatDataID = element.getAttribute("data-id")
		let chatInfo = await (await fetch(`/lol-chat/v1/conversations/${chatDataID}`)).json()
		let summonerID = (await (await fetch(`/lol-summoner/v1/summoners/?name=${chatInfo.gameName}%23${chatInfo.gameTag}`)).json()).accountId

		if (friendIconList.find(x => x.summonerID == summonerID) && friendIconList.find(x => x.summonerID == summonerID)?.icon.avatar != null) {
			let icon = element.querySelector(".icon-image")
			icon.src = `${friendIconList.find(x => x.summonerID == summonerID)?.icon.avatar}`
			utils.freezeProperties(icon, ['src'])
		}
	}

	// changeConversationChatHeaderAvatar = async () => {
	// 	let chatHeader = document.querySelectorAll(".chat-header")

	// 	for (const element of chatHeader) {
	// 		console.log(element)
	// 		let avatar = element.querySelector(".icon-image") as HTMLImageElement
	// 		let chatGnt = element.querySelector(".chat-gnt > lol-uikit-player-name")
	// 		let playerName = chatGnt?.getAttribute("game-name")
	// 		let playerTag = chatGnt?.getAttribute("tag-line")

	// 		let summonerID = (await (await fetch(`/lol-summoner/v1/summoners/?name=${playerName}%23${playerTag}`)).json()).accountId

	// 		console.log(playerName, playerTag)
	// 		if (friendIconList.find(x => x.summonerID == summonerID) && friendIconList.find(x => x.summonerID == summonerID)?.icon.avatar != null) {
	// 			avatar.src = `${friendIconList.find(x => x.summonerID == summonerID)?.icon.avatar}`
	// 			utils.freezeProperties(avatar, ['src'])
	// 		}
	// 	}
	// }

	applyCustomAvatar = async (element: any) => {
		let iconElement = element.shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector(".lol-regalia-summoner-icon")

		if (element.getAttribute("summoner-id") == ElainaData.get("Summoner-ID")) {
			this.changeAvatar(iconElement)
			await utils.stop(1000)
			this.changeAvatar(iconElement)
		}
		else {
			this.changeFriendAvatar(element, iconElement)
			await utils.stop(1000)
			this.changeFriendAvatar(element, iconElement)
		}
	}

	async main() {
		// Hover card avatar
		upl.observer.subscribeToElementCreation(".hover-card-info-container",(element: any)=>{
			element.style.background = "#1a1c21"
		})

		upl.observer.subscribeToElementCreation(`lol-regalia-hovercard-v2-element`, async (element: any)=>{
			await this.applyCustomAvatar(element)
		})

		// Identity customizer avatar
		upl.observer.subscribeToElementCreation("lol-regalia-identity-customizer-element", async (element: any)=>{
			await this.applyCustomAvatar(element)
		})

		// Parties avatar
		upl.observer.subscribeToElementCreation("lol-regalia-parties-v2-element", async (element: any)=>{
			await this.applyCustomAvatar(element)
		})

		// Profile avatar
		upl.observer.subscribeToElementCreation('lol-regalia-profile-v2-element', async (element: any) => {
			await this.applyCustomAvatar(element)
		})

		// Conversation chat avatar
		upl.observer.subscribeToElementCreation('.conversation.chat', async (element: any) => {
			await this.changeConversationChatAvatar(element)
		})

		// Conversation chat header avatar
		// utils.routineAddCallback(this.changeConversationChatHeaderAvatar, ['chat-header'])
	}
}
export const customAvatar = new CustomAvatar()

class CustomBorder {
	changeBorder = (element: any) => {
		let regaliaCrest = element.shadowRoot.querySelector("lol-regalia-crest-v2-element")
		let leverBorder = regaliaCrest.shadowRoot.querySelector("lol-uikit-themed-level-ring-v2").shadowRoot.querySelector("div")
		let rankBorder = regaliaCrest.shadowRoot.querySelector(".lol-regalia-ranked-border-container")
		let rankNumber = regaliaCrest.shadowRoot.querySelector(".lol-regalia-rank-division-wrapper")
		let rankBorderAnimate = regaliaCrest.shadowRoot.querySelector("uikit-video")
		let rankBorderWingAnimate = regaliaCrest.shadowRoot.querySelector("lol-uikit-lottie[class='regalia-crest-wing']")

		leverBorder.style.cssText = `
			background-image: var(--Border);
			display: block;
		`
		utils.freezeProperties(leverBorder.style, ['backgroundImage', 'display'])

		rankBorder.style.display = "none"
		rankNumber.style.display = "none"
		rankBorderAnimate.style.display = "none"
		rankBorderWingAnimate.style.display = "none"
	}

	changeFriendBorder = (element: any) => {
		if (friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id")) && friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.border != null) {
			let regaliaCrest = element.shadowRoot.querySelector("lol-regalia-crest-v2-element")
			let leverBorder = regaliaCrest.shadowRoot.querySelector("lol-uikit-themed-level-ring-v2").shadowRoot.querySelector("div")
			let rankBorder = regaliaCrest.shadowRoot.querySelector(".lol-regalia-ranked-border-container")
			let rankNumber = regaliaCrest.shadowRoot.querySelector(".lol-regalia-rank-division-wrapper")
			let rankBorderAnimate = regaliaCrest.shadowRoot.querySelector("uikit-video")
			let rankBorderWingAnimate = regaliaCrest.shadowRoot.querySelector("lol-uikit-lottie[class='regalia-crest-wing']")

			leverBorder.style.cssText = `
				background-image: url(${friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.border});
				display: block;
			`
			utils.freezeProperties(leverBorder.style, ['backgroundImage', 'display'])
			rankBorder.style.display = "none"
			rankNumber.style.display = "none"
			rankBorderAnimate.style.display = "none"
			rankBorderWingAnimate.style.display = "none"
		}
	}

	applyCustomBorder = async (element: any) => {
		if (element.getAttribute("summoner-id") == ElainaData.get("Summoner-ID")) {
			this.changeBorder(element)
			await utils.stop(1000)
			this.changeBorder(element)
		}
		else {
			this.changeFriendBorder(element)
			await utils.stop(1000)
			this.changeFriendBorder(element)
		}
	}

	async main() {
		// Hover card border
		upl.observer.subscribeToElementCreation(`lol-regalia-hovercard-v2-element`, async (element: any)=>{
			await this.applyCustomBorder(element)
		})

		// Parties border
		upl.observer.subscribeToElementCreation("lol-regalia-parties-v2-element", async (element: any)=>{
			await this.applyCustomBorder(element)
		})

		// Profile border
		upl.observer.subscribeToElementCreation('lol-regalia-profile-v2-element', async (element: any) => {
			await this.applyCustomBorder(element)
		})

		// Identity customizer border
		upl.observer.subscribeToElementCreation("lol-regalia-identity-customizer-element", async (element: any)=>{
			await this.applyCustomBorder(element)
		})
	}
}

class CustomBanner {
	changeBanner = (banner: HTMLImageElement) => {
		banner.src = `${iconFolder}Regalia-Banners/${ElainaData.get("CurrentBanner")}`
		utils.freezeProperties(banner,["src"])
	}

	changeFriendBanner = (element: any, banner: HTMLImageElement) => {
		if (friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id")) && friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.banner != null) {
			banner.src = `${friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.banner}`
			utils.freezeProperties(banner,["src"])
		}
	}
	applyCustomBanner = async (element: any) => {
		let banner = element.shadowRoot.querySelector("lol-regalia-banner-v2-element").shadowRoot.querySelector(".regalia-banner-asset-static-image")
		if (element.getAttribute("summoner-id") == ElainaData.get("Summoner-ID")) {
			this.changeBanner(banner)
			await utils.stop(1000)
			this.changeBanner(banner)
		}
		else {
			this.changeFriendBanner(element, banner)
			await utils.stop(1000)
			this.changeFriendBanner(element, banner)
		}
	}

	async main() {
		// Parties banner
		upl.observer.subscribeToElementCreation("lol-regalia-parties-v2-element", async (element: any)=>{
			await this.applyCustomBanner(element)
		})

		// Identity customizer banner
		upl.observer.subscribeToElementCreation("lol-regalia-identity-customizer-element", async (element: any)=>{
			await this.applyCustomBanner(element)
		})

		// Profile banner
		upl.observer.subscribeToElementCreation("lol-regalia-profile-v2-element", async (element: any)=>{
			await this.applyCustomBanner(element)
		})
	}
}

class CustomHoverCardBackdrop {
	changeHoverCardBackdrop = () => {
		let hoverCardBackdrop = document.querySelector("#hover-card-backdrop") as HTMLElement;
		if (hoverCardBackdrop) {
			hoverCardBackdrop.style.backgroundImage = "var(--Hover-card-backdrop)";

			utils.stop(100)
			if (hoverCardBackdrop.style.backgroundImage != "var(--Hover-card-backdrop)") this.changeHoverCardBackdrop()
		}
	}

	changeFriendHoverCardBackdrop = (hovercard: any) => {
		if (friendIconList.find(x => x.summonerID == hovercard.getAttribute("summoner-id")) && friendIconList.find(x => x.summonerID == hovercard.getAttribute("summoner-id"))?.icon.hoverCardBackdrop != null) {
			let hoverCardBackdrop = document.querySelector("#hover-card-backdrop") as HTMLElement;
			if (hoverCardBackdrop) {
				hoverCardBackdrop.style.backgroundImage = `url(${friendIconList.find(x => x.summonerID == hovercard.getAttribute("summoner-id"))?.icon.hoverCardBackdrop})`;
			}
		}
	}

	changeFriendProfileBackground = (element: any) => {
		log(element.getAttribute("summoner-id"))
		if (friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id")) && friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.hoverCardBackdrop != null) {
			let profileBackground = document.querySelector(".style-profile-masked-image img") as HTMLImageElement
			profileBackground.src = `${friendIconList.find(x => x.summonerID == element.getAttribute("summoner-id"))?.icon.hoverCardBackdrop}`
			profileBackground.style.height = "100%";
		}
	}

	applyCustomHoverCardBackdrop = async (element: any) => {
		await utils.stop(300)
		let hovercard = element.querySelector("lol-regalia-hovercard-v2-element");
		
		if (hovercard.getAttribute("summoner-id") == ElainaData.get("Summoner-ID")) {
			this.changeHoverCardBackdrop()
		}
		else {
			this.changeFriendHoverCardBackdrop(hovercard)
			await utils.stop(1000)
			this.changeFriendHoverCardBackdrop(hovercard)
		}
	}

	applyCustomBackgroundFriendProfile = async (element: any) => {
		if (element.getAttribute("summoner-id") != ElainaData.get("Summoner-ID")) {
			this.changeFriendProfileBackground(element)
			await utils.stop(1000)
			this.changeFriendProfileBackground(element)
		}
	}

	async main() {
		// Hover card
		upl.observer.subscribeToElementCreation("#lol-uikit-tooltip-root", async (element: any)=>{
			await this.applyCustomHoverCardBackdrop(element)
		})

		// Profile background
		upl.observer.subscribeToElementCreation("lol-regalia-profile-v2-element", async (element: any)=>{
			await this.applyCustomBackgroundFriendProfile(element)
		})
	}
}

class CustomGamemodeIcon {
	gameModeIcon_active(obj: any, name: any) {
		try {
			let a: any = document.querySelector(`${obj} lol-uikit-video-state[state='active'] lol-uikit-video`)
			a.setAttribute("src", `${iconFolder}gamemodes/${name}`)
			a.querySelector("video").setAttribute("src", `${iconFolder}gamemodes/${name}`)
		}
		catch { 
			//warn("Can't find the target") 
		}
	}

	main = () => {
		upl.observer.subscribeToElementCreation("lol-uikit-video-group", (element: any)=>{
			this.gameModeIcon_active("div[data-game-mode='CLASSIC']",icdata["classic_video"])
			this.gameModeIcon_active("div[data-game-mode='TFT']", icdata["tft_video"])
			this.gameModeIcon_active("div[data-game-mode='ARAM']", icdata["aram_video"])
			this.gameModeIcon_active("div[data-game-mode='CHERRY']",icdata["cherry_video"])
			this.gameModeIcon_active("div[data-game-mode='BRAWL']",icdata["brawl_video"])
			this.gameModeIcon_active('div[data-map-id="11"]',icdata["classic_video"])
			this.gameModeIcon_active('div[data-map-id="12"]',icdata["aram_video"])
			this.gameModeIcon_active("div[data-game-mode='PRACTICETOOL']",icdata["classic_video"])
		})
	}
}

class CustomEmblemIcon {
	changeEmblemIcon = (element: any) => {
		element.setAttribute("src", `${iconFolder}${icdata["Honor"]}`)
		element.style.visibility = "visible"
		utils.freezeProperties(element, ["src"])
	}

	main = () => {
		upl.observer.subscribeToElementCreation(".style-profile-honor-icon-v3", (element: any) => {
			this.changeEmblemIcon(element)
		})
	}
}

class CustomLoadingIcon {
	storeLoadingIcon = () => {
		let storeInterval: number
		upl.observer.subscribeToElementCreation("#rcp-fe-lol-store-iframe", (element: any) => {
			log("Store page.")
			storeInterval = window.setInterval(() => {
				let storeIframe: any = element.querySelector("iframe")
				if (storeIframe) {
					let storeDoc: any = storeIframe.contentDocument || storeIframe.contentWindow.document
					let loadingIcon: any = storeDoc.querySelector(".store-app-wrapper > .loading-spinner")
					if (loadingIcon) {
						loadingIcon.style.cssText = `
							width: 190px;
							height: 190px;
							background-image: unset;
							background-size: unset;
							content: url("${iconFolder}${icdata["Loading"]}");
							-webkit-animation-iteration-count: unset;
							-webkit-animation-duration: unset;
							-webkit-animation-timing-function: unset;
							animation-iteration-count: unset;
							animation-duration: unset;
							animation-timing-function: unset;
						`
						// log("Store loading icon changed.")
					}
				}
			}, 300)
		})

		upl.observer.subscribeToElementDeletion("#rcp-fe-lol-store-iframe", () => {
			log("Store page deleted.")
			window.clearInterval(storeInterval)
		})
	}

	main() {
		this.storeLoadingIcon()
	}
}

export class CustomIcon {
	main() {
		const customTickerIcon = new CustomTickerIcon()
		customTickerIcon.main()

		if (ElainaData.get("Custom-Avatar")) {
			customAvatar.main()
		}

		if (ElainaData.get("Custom-Border")) {
			const customBorder = new CustomBorder()
			customBorder.main()
		}

		if (ElainaData.get("Custom-Regalia-Banner")) {
			const customBanner = new CustomBanner()
			customBanner.main()
		}

		if (ElainaData.get("Custom-Hover-card-backdrop")) {
			const customHoverCardBackdrop = new CustomHoverCardBackdrop()
			customHoverCardBackdrop.main()
		}

		if (ElainaData.get('Custom-Gamemode-Icon')) {
			const customGamemodeIcon = new CustomGamemodeIcon()
			customGamemodeIcon.main()
		}

		if (ElainaData.get("Custom-Loading-Icon")) {
			const customLoadingIcon = new CustomLoadingIcon()
			customLoadingIcon.main()
		}
		if (ElainaData.get("Custom-Emblem")) {
			const customEmblemIcon = new CustomEmblemIcon()
			customEmblemIcon.main()
		}
	}
}