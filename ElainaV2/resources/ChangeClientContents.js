import utils from './_utilselaina'

//___________________________________________________________________________//
let updateLobbyRegaliaBanner = async message => {
	let phase = JSON.parse(message["data"])[2]["data"];

	if (phase == "Lobby") {
		window.setInterval(() => {
			try {
				let base = document.querySelector("lol-regalia-parties-v2-element.regalia-loaded").shadowRoot.querySelector(".regalia-parties-v2-banner-backdrop.regalia-banner-loaded")

				base.shadowRoot.querySelector(".regalia-banner-asset-static-image").style.filter = "sepia(1) brightness(3.5) opacity(0.4)"
				base.shadowRoot.querySelector(".regalia-banner-state-machine").shadowRoot.querySelector(".regalia-banner-intro.regalia-banner-video").style.filter = "grayscale(1) saturate(0) brightness(0.5)"
			}
			catch {}
		}, 200)
	}
}

window.addEventListener('load', () => {	
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner)
})
//___________________________________________________________________________//



//___________________________________________________________________________//
window.setInterval(() => { 
	try {
		document.getElementsByClassName("lol-settings-container")[0].style.backgroundColor = "transparent";
		document.querySelector(".lol-settings-container").
            shadowRoot.querySelector("div").style.background = "transparent";
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div > div.challenges-identity-customizer-contents > div.challenges-identity-customizer-left-container > div > lol-regalia-identity-customizer-element").
			shadowRoot.querySelector("div > lol-regalia-banner-v2-element").remove()
	}
	catch {}

	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.backgroundColor = "transparent";
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").
            shadowRoot.querySelector("div").style.background = "transparent";
	}
	catch {}
	try {
		document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame").
            shadowRoot.querySelector("div").style.background = "transparent"
	}
	catch {}
}, 100)
//___________________________________________________________________________//



//___________________________________________________________________________//
let ChangeContents = (node) => {
    let ranked_observer;
    let previous_page;
	let pagename;
		pagename = node.getAttribute("data-screen-name")

    if (pagename == "rcp-fe-lol-profiles-main") {
        let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')
    
        window.setInterval(() => {
            try {
                document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div > uikit-state-machine > div:nth-child(2) > img").remove()
                document.querySelector("div > div.summoner-xp-radial").remove()
            }
            catch {}
        }, 100)
        
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
                });
            });
            ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false });
        }
    }
    else if (previous_page == "rcp-fe-lol-profiles-main") {
        if (ranked_observer)
        ranked_observer.disconnect()
        ranked_observer = undefined
    }
    if (pagename == "rcp-fe-lol-parties") {
        window.setInterval(() => {
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
                    gamesearch.querySelector("div > div.parties-game-search-divider").remove()

                document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-bg-container").style.backgroundImage = "none"
                document.querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-status-card").shadowRoot.
                    querySelector("div > div.parties-status-card-body > div.parties-status-card-map.game_map_howling_abyss").style.margin = "-3px 10px 0 0"
            }
            catch {}
        },10)
    }
    else {}
    if (previous_page != pagename)
		previous_page = pagename
}

import wt from './Watermark'
window.addEventListener('load', () => {
	utils.mutationObserverAddCallback(ChangeContents, ["screen-root"])
})
//___________________________________________________________________________//