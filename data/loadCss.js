import utils from './_utils.js'
import data from './configs/Configs.js'

let datapath = new URL(".", import.meta.url).href

let updateLobbyRegaliaBanner = async message => {
	let phase = JSON.parse(message["data"])[2]["data"]
	if (phase == "Lobby") {
		window.setInterval(() => {
			try {
				let base = document.querySelector("lol-regalia-parties-v2-element.regalia-loaded").shadowRoot.querySelector(".regalia-parties-v2-banner-backdrop.regalia-banner-loaded")
					base.shadowRoot.querySelector(".regalia-banner-asset-static-image").style.filter = "sepia(1) brightness(3.5) opacity(0.4)"
					base.shadowRoot.querySelector(".regalia-banner-state-machine").shadowRoot.querySelector(".regalia-banner-intro.regalia-banner-video").style.filter = "grayscale(1) saturate(0) brightness(0.5)"
			}catch {}
            if (DataStore.get("Custom-Avatar")) {
                try {
					document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.querySelector("div > div > div.regalia-parties-v2-crest-wrapper > lol-regalia-crest-v2-element").
						shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
				}catch {}
            }
		},200)
	}
}
let loadCss = async (node) => {
	let pagename, previous_page, ranked_observer
	pagename = node.getAttribute("data-screen-name")

	if (pagename == "rcp-fe-lol-home-main") {
		window.setInterval(() => {
			try {
				let homecontent = document.querySelector('.rcp-fe-lol-home > lol-uikit-section-controller > lol-uikit-section > #overview > iframe[referrerpolicy = "no-referrer-when-downgrade"]')
					homecontent.contentWindow.document.querySelector("body").style.background = "#00000073"
					homecontent.contentWindow.document.querySelector("#gatsby-focus-wrapper > div > div > div > div > div > div > div > img").src = "none"

			}
			catch {}
		},100)
	}
	if (pagename == "rcp-fe-lol-store") {
		window.setInterval(() => {
			try {
				let storeIframe = document.querySelector('#rcp-fe-lol-store-iframe > iframe[referrerpolicy = "no-referrer-when-downgrade"]')
					storeIframe.contentWindow.document.querySelector("#root > div > div.item-page.container.content.clearfix > div.item-page-items-container-wrapper.purchase-history-page-content-wrapper").style.background = "transparent"
		
				let th = storeIframe.contentWindow.document.querySelectorAll("#root > div > div.item-page.container.content.clearfix > div.item-page-items-container-wrapper.purchase-history-page-content-wrapper > div > div > table > thead > tr > th")
				for (let i = 0; i < th.length; i++) {
					th[i].style.background = "transparent"
				}
			}
			catch {}
		},100)
	}
	if (pagename == "rcp-fe-lol-profiles-main") {		
        let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')
    
        window.setInterval(() => {
            try {
                document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div:nth-child(2) > img").remove()
                document.querySelector("div > div.summoner-xp-radial").remove()
            }
            catch {}
			if (DataStore.get("Custom-Rank-Name")) {
				try {
					document.querySelector(".style-profile-ranked-component.ember-view > .style-profile-emblem-wrapper  > .style-profile-emblem-header > .style-profile-emblem-header-title").innerHTML = DataStore.get("Rank-line1")
					document.querySelector(".style-profile-emblem-subheader-ranked > div").innerHTML = DataStore.get("Rank-line2")
				}
				catch{}
			}
            if (DataStore.get("Custom-Avatar")) {
                try {
					document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
				}
				catch {}
            }
        }, 10)
        
        if (!ranked_observer && rankedNode) {
            ranked_observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.target.classList.contains('visible')) {
                        let tmpInterval = window.setInterval(() => {
                            try {
                                document.querySelector("div.smoke-background-container > lol-uikit-parallax-background").shadowRoot.querySelector(".parallax-layer-container").style.backgroundImage = ''
                                window.clearInterval(tmpInterval)
                            }
                            catch {}
                        }, 500)
                    }
                })
            })
            ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false })
        }		
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
        if (ranked_observer)
        ranked_observer.disconnect()
        ranked_observer = undefined
	}
	if (previous_page != pagename) {previous_page = pagename}
	if (DataStore.get("aram-only") && node.getAttribute("data-screen-name") == "rcp-fe-lol-parties") {
		window.setInterval(()=>{
			try{
				document.querySelector("div[data-game-mode='CLASSIC']").remove()
				document.querySelector("div[data-game-mode='TFT']").remove()
				document.querySelector("lol-uikit-navigation-item[data-category='VersusAi']").remove()
				document.querySelector("lol-uikit-navigation-item[data-category='Training']").remove()
			}
			catch{}
			try {
				if (document.getElementsByClassName("parties-game-navs-list")[0].getAttribute("selectedindex") == "0") {
					document.querySelector('div[data-game-mode=ARAM] div[class=parties-game-type-upper-half]').click()
				}
			}
			catch {}
		},10)
	}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		window.setInterval(()=> {
			try {
				document.querySelector(".perks-construct-minspec").style.top = "0px"
				document.querySelector(".perks-construct-minspec").style.left = "0px"
				document.querySelector(".perks-construct-minspec").style.filter = data["Runes"]
			}
			catch{}
			try {document.querySelector("#rcp-fe-viewport-root > section.rcp-fe-viewport-overlay > div[data-screen-name=\"rcp-fe-lol-uikit-full-page-modal-controller\"] > lol-uikit-full-page-modal > span > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8000\"]").style.backgroundImage = "var(--pri8000)"}catch{}
			try {document.querySelector("#rcp-fe-viewport-root > section.rcp-fe-viewport-overlay > div[data-screen-name=\"rcp-fe-lol-uikit-full-page-modal-controller\"] > lol-uikit-full-page-modal > span > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8100\"]").style.backgroundImage = "var(--pri8100)"}catch{}
			try {document.querySelector("#rcp-fe-viewport-root > section.rcp-fe-viewport-overlay > div[data-screen-name=\"rcp-fe-lol-uikit-full-page-modal-controller\"] > lol-uikit-full-page-modal > span > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8200\"]").style.backgroundImage = "var(--pri8200)"}catch{}
			try {document.querySelector("#rcp-fe-viewport-root > section.rcp-fe-viewport-overlay > div[data-screen-name=\"rcp-fe-lol-uikit-full-page-modal-controller\"] > lol-uikit-full-page-modal > span > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8300\"]").style.backgroundImage = "var(--pri8300)"}catch{}
			try {document.querySelector("#rcp-fe-viewport-root > section.rcp-fe-viewport-overlay > div[data-screen-name=\"rcp-fe-lol-uikit-full-page-modal-controller\"] > lol-uikit-full-page-modal > span > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8400\"]").style.backgroundImage = "var(--pri8400)"}catch{}
			try {document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame > div > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8000\"]").style.backgroundImage = "var(--pri8000)"}catch{}
			try {document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame > div > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8100\"]").style.backgroundImage = "var(--pri8100)"}catch{}
			try {document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame > div > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8200\"]").style.backgroundImage = "var(--pri8200)"}catch{}
			try {document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame > div > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8300\"]").style.backgroundImage = "var(--pri8300)"}catch{}
			try {document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame > div > div > div > div > div > div > lol-perks-construct-minspec[primary=\"8400\"]").style.backgroundImage = "var(--pri8400)"}catch{}
		},100)
	}
}

window.setInterval(() => {
	let ticker = document.querySelector("#lol-uikit-layer-manager-wrapper > lol-uikit-full-page-backdrop > lol-uikit-flyout-frame")
	
	if (DataStore.get("settings-dialogs-transparent")) {
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch{}
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch {}
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").remove()}catch{}
		try {document.querySelector(".lol-settings-container").style.background = "var(--Settings-and-Dialog-frame-color)"}catch {}
		try {document.querySelector(".lol-settings-container").shadowRoot.querySelector("div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch{}
		try {document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = "var(--Settings-and-Dialog-frame-color)"}catch{}
	}

	if (DataStore.get("Custom-Avatar")) {
		try {
			document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
				shadowRoot.querySelector("div > div > div.regalia-identity-customizer-crest-wrapper > lol-regalia-crest-v2-element").
				shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
				}
		catch {}
		try {
			document.querySelector("#hover-card-backdrop").style.backgroundImage = "var(--Hover-card-backdrop)"
			document.querySelector("#lol-uikit-tooltip-root > div > div > div.hover-card.right.has-regalia.regalia-loaded > div > div.hover-card-info-container").style.background = "#1a1c21"
			document.querySelector("#lol-uikit-tooltip-root > div > div > div.hover-card.right.has-regalia.regalia-loaded > div > div.hover-card-info-container > div.hover-card-identity > lol-regalia-hovercard-v2-element").
				shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
		}
		catch {}
	}

	if (ticker) {
		ticker.shadowRoot.querySelector("div > div.border").style.display = "none"
		ticker.shadowRoot.querySelector("div > div.sub-border").style.display = "none"
		ticker.shadowRoot.querySelector("div > div.caret").style.display = "none"
		ticker.shadowRoot.querySelector("div > div.lol-uikit-flyout-frame").style.backgroundColor = "black"
		ticker.shadowRoot.querySelector("div > div.lol-uikit-flyout-frame").style.borderRadius = "10px"
	}

	if (DataStore.get("new-gamesearch-queue") && document.querySelector("lol-social-panel > lol-parties-game-info-panel")) {
		try {
			let gameinfo = document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-status-card").shadowRoot
				gameinfo.querySelector("div").style.background = "#143c1400"
				gameinfo.querySelector("div > div.parties-status-card-bg-container").style.color = "#36d98700"
				gameinfo.querySelector("div > div.parties-status-card-bg-container > video").setAttribute('src', '')
				gameinfo.querySelector("div > div.parties-status-card-header").style.visibility = "hidden"

			let cardbody = gameinfo.querySelector("div > div.parties-status-card-body").style
				cardbody.marginTop = "-23px"
				cardbody.padding = "10px 5px 10px 10px"
				cardbody.border = "1px solid #8c8263"
				cardbody.borderRadius = "10px"

			let gamesearch = document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-game-search").shadowRoot
				gamesearch.querySelector("div").style.border = "1px solid #8c8263"
				gamesearch.querySelector("div").style.borderRadius = "10px"
				gamesearch.querySelector("div").style.marginTop = "9px"
				gamesearch.querySelector("div > div.parties-game-search-divider").style.display = "none"

			document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-bg-container").style.backgroundImage = "none"
			document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-status-card").shadowRoot.
				querySelector("div > div.parties-status-card-body > div.parties-status-card-map.game_map_howling_abyss").style.margin = "-3px 10px 0 0"
		}catch{}
	}
}, 500)

window.addEventListener("load", ()=> {
    utils.addCss("--Hover-card-backdrop",`${datapath}assets/Icon`,data['Hover-card'])
	utils.addFont(`${datapath}assets/Fonts`,"BeaufortforLOL-Bold.ttf","Elaina")
	utils.addCss("--pri8000",`${datapath}assets/Backgrounds/Runes`,data['Precision'])
	utils.addCss("--pri8100",`${datapath}assets/Backgrounds/Runes`,data['Domination'])
	utils.addCss("--pri8200",`${datapath}assets/Backgrounds/Runes`,data['Sorcery'])
	utils.addCss("--pri8300",`${datapath}assets/Backgrounds/Runes`,data['Inspiration'])
	utils.addCss("--pri8400",`${datapath}assets/Backgrounds/Runes`,data['Resolve'])

	if (DataStore.get("Animate-Loading")) {utils.addCss("--ElainaFly",`${datapath}assets/Icon`,data["Animation-logo"],`${datapath}assets/Css/Addon-Css/Animate-Loading-Screen.css`)}
	else {utils.addCss("--ElainaStatic",`${datapath}assets/Icon`,data["Static-logo"],`${datapath}assets/Css/Addon-Css/Static-Loading-Screen.css`)}
	if (DataStore.get("Custom-Avatar")) {utils.addCss("--Avatar",`${datapath}assets/Icon`,data["Avatar"],`${datapath}assets/Css/Addon-Css/Icon/Avatar.css`)}
	if (DataStore.get("Custom-Icon")) {
		utils.addCss("--RP-Icon",`${datapath}assets/Icon`,data["RP-icon"],`${datapath}assets/Css/Addon-Css/Icon/RiotPoint.css`)
		utils.addCss("--BE-Icon",`${datapath}assets/Icon`,data["BE-icon"],`${datapath}assets/Css/Addon-Css/Icon/BlueEssence.css`)
		utils.addCss("--Rank-Icon",`${datapath}assets/Icon`,data["Rank-icon"],`${datapath}assets/Css/Addon-Css/Icon/Rank.css`)
		utils.addCss("--Emblem",`${datapath}assets/Icon`,data["Emblem"],`${datapath}assets/Css/Addon-Css/Icon/Emblem.css`)
		utils.addCss("--Clash-banner",`${datapath}assets/Icon`,data["Class-banner"],`${datapath}assets/Css/Addon-Css/Icon/ClashBanner.css`)
		utils.addCss("--Ticker",`${datapath}assets/Icon`,data["Ticker"],`${datapath}assets/Css/Addon-Css/Icon/Ticker.css`)
	}
	if (DataStore.get("Custom-Font")) {utils.addFont(`${datapath}assets/Fonts`,data["Font-Name"],"Custom")}
	if (DataStore.get("Custom-Cursor")) {utils.CustomCursor(`url("${datapath}assets/Icon/${data["Mouse-cursor"]}")`,`${datapath}assets/Css/Addon-Css/Cursor.css`)}

    if (DataStore.get("hide-vertical-lines")) {utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Hide-vertical-lines.css`)}
	if (DataStore.get("aram-only")) {utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Aram-only.css`)}
	if (DataStore.get("Hide-Champions-Splash-Art")) {utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Hide-Champs-Splash-Art.css`)}
	if (DataStore.get("Sidebar-Transparent")) {utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Sidebar-Transparent.css`)}
	else {utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Sidebar-Color.css`)}
    utils.addCss("","","",`${datapath}assets/Css/ElainaV2.css`)
	utils.mutationObserverAddCallback(loadCss, ["screen-root"])
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner)
})