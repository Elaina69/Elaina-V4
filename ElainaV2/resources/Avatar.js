import utils from './_utilselaina'
import data from '../configs/ElainaV2_config.json'

let Avatar = data["Custom-Avatar"]
if (Avatar) {
let changeAvatar1 = async message => {
	let phase = JSON.parse(message["data"])[2]["data"];
    if (phase == "Lobby") {
		window.setInterval(() => {
			try {
				document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.querySelector("div > div > div.regalia-parties-v2-crest-wrapper > lol-regalia-crest-v2-element").
					shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
			}
			catch {}
		}, 20)
	}
}

let changeAvatar2 = (node) => {
    let pagename;
    pagename = node.getAttribute("data-screen-name")
    if (pagename == "rcp-fe-lol-profiles-main") {
		window.setInterval(() => {
			try {
				document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
			}
			catch {}
		}, 10)
    }
}

window.addEventListener('load', () => {
	utils.mutationObserverAddCallback(changeAvatar2, ["screen-root"])
})

window.setInterval(() => { 
    try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > div > div.regalia-identity-customizer-crest-wrapper > lol-regalia-crest-v2-element").
			shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
	}
	catch {}
    try {
		document.querySelector("#lol-uikit-tooltip-root > div > div > div.hover-card.right.has-regalia.regalia-loaded > div > div.hover-card-info-container > div.hover-card-identity > lol-regalia-hovercard-v2-element").
			shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
		
			document.querySelector("#hover-card-backdrop").style.backgroundImage = "var(--Hover-card-backdrop)"
	}
	catch {}
}, 10)

window.addEventListener('load', () => {
    utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Avatar.css")
    utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", changeAvatar1)
})
}