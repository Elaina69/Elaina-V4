import utils from '../utils/utils.js'
import * as observer from "../utils/observer.js"
let rank = {
    "Ranked Queue ID": [
        {
            "id" : 0, 
            "Option": "RANKED_SOLO_5x5",
        },
        {
            "id" : 1, 
            "Option": "RANKED_FLEX_SR",
        },
        {
            "id" : 2, 
            "Option": "RANKED_FLEX_TT", 
        },
        {
            "id" : 3, 
            "Option": "RANKED_TFT",
        },
        {
            "id" : 4, 
            "Option": "RANKED_TFT_TURBO",
        },
        {
            "id" : 5,  
            "Option": "RANKED_TFT_DOUBLE_UP",
        },
        {
            "id" : 6,  
            "Option": "RANKED_TFT_PAIRS",
        },
        {
            "id" : 7, 
            "Option": "CHERRY"
        }
    ],

    "Ranked Tier ID": [
        {
            "id" : 0, 
            "Option": "IRON",
        },
        {
            "id" : 1, 
            "Option": "BRONZE",
        },
        {
            "id" : 2, 
            "Option": "SILVER",
        },
        {
            "id" : 3, 
            "Option": "GOLD",
        },
        {
            "id" : 4, 
            "Option": "PLATINUM",
        },
        {
            "id" : 5, 
            "Option": "DIAMOND",
        },
        {
            "id" : 6,
            "Option": "EMERALD",
        },
        {
            "id" : 7, 
            "Option": "MASTER",
        },
        {
            "id" : 8, 
            "Option": "GRANDMASTER",
        },
        {
            "id" : 9, 
            "Option": "CHALLENGER"
        }
    ],

    "Ranked Division ID": [
        {
            "id" : 0, 
            "name": "I"
        },
        {
            "id" : 1, 
            "name": "II"
        },
        {
            "id" : 2, 
            "name": "III"
        },
        {
            "id" : 3, 
            "name": "IV"
        }
    ]
}

let requestChallengeCrystal = {
    "lol": {
        "challengePoints"       : `${DataStore.get("Challenge-Points")}`,
        "challengeCrystalLevel" : `${rank["Ranked Tier ID"][DataStore.get("challengeCrystalLevel")]["Option"]}`
    }
}
let requestRank = {
    "lol": {
        "rankedLeagueQueue"    : rank["Ranked Queue ID"][DataStore.get("Ranked Queue ID")]["Option"],
        "rankedLeagueTier"     : rank["Ranked Tier ID"][DataStore.get("Ranked Tier ID")]["Option"],
        "rankedLeagueDivision" : rank["Ranked Division ID"][DataStore.get("Ranked Division ID")]["name"]
    }
}

let requestMasteryScore = {
    "lol": {
        "masteryScore":`${DataStore.get("Mastery-Score")}`
    }
}

async function request(method, endpoint, { headers = {}, body = {} } = {}) {
    const requestOptions = {
        method: method,
        headers: {
            ...headers,
            "accept": "application/json",
            "content-type": "application/json"
        }
    }
    if (method !== "GET" && method !== "HEAD") {
        requestOptions.body = JSON.stringify(body)
    }
    return await fetch(endpoint, requestOptions)
}


async function getPlayerPreferences() {
    const endpoint = "/lol-challenges/v1/summary-player-data/local-player"
    const response = await request("GET", endpoint)
    const responseData = await response.json()
    const playerPreferences = { challengeIds: [] }
  
    playerPreferences.challengeIds = responseData.topChallenges.map(badgeChallenge => badgeChallenge.id)
    if (responseData.title.itemId !== -1) { 
        playerPreferences.title = `${responseData.title.itemId}`
    }
    if (responseData.bannerId) { 
        playerPreferences.bannerAccent = responseData.bannerId 
    }
    return playerPreferences
}
  
async function updatePlayerPreferences(playerPreferences) {
    const endpoint = "/lol-challenges/v1/update-player-preferences"
    return await request("POST", endpoint, { body: playerPreferences })
}
  
async function setupInvisibleBanner() {
    const bannerContainer = document.querySelector("div > lol-regalia-profile-v2-element")?.shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div")
    if (!bannerContainer || bannerContainer.hasAttribute("invisible-banner-setup")) { return }
  
    bannerContainer.setAttribute("invisible-banner-setup", "true")
    bannerContainer.addEventListener("mouseenter", () => { bannerContainer.style.opacity = "0.5" })
    bannerContainer.addEventListener("mouseleave", () => { bannerContainer.style.opacity = "1" })
    bannerContainer.addEventListener("click", async () => {
        const playerPreferences = await getPlayerPreferences()
        playerPreferences.bannerAccent = playerPreferences.bannerAccent === "2" ? "1" : "2"
        await updatePlayerPreferences(playerPreferences)
    })
}
  
async function setupBadgesFunctions() {
    const badgesContainer = document.querySelector("div > div.challenge-banner-token-container")
    if (!badgesContainer || badgesContainer.hasAttribute("copy-badges-setup")) { return }
  
    badgesContainer.setAttribute("copy-badges-setup", "true")
    badgesContainer.addEventListener("mouseenter", () => { badgesContainer.style.opacity = "0.5" })
    badgesContainer.addEventListener("mouseleave", () => { badgesContainer.style.opacity = "1" })
    badgesContainer.addEventListener("click", async () => {
        const playerPreferences = await getPlayerPreferences()
  
        if (!playerPreferences.challengeIds.length) {
            console.debug(`The player does not have a defined badge.`)
            return
        }
  
        const firstBadge = playerPreferences.challengeIds[0]
        playerPreferences.challengeIds = Array(3).fill(firstBadge)
        await updatePlayerPreferences(playerPreferences)
    })
    badgesContainer.addEventListener("contextmenu", async () => {
        const playerPreferences = await getPlayerPreferences()
  
        if (!playerPreferences.challengeIds.length) {
            console.debug(`The player badges are already empty.`)
            return
        }
  
        playerPreferences.challengeIds = []
        await updatePlayerPreferences(playerPreferences)
    })
}
  
async function onMutation() {
    const toSetup = [
        //setupInvisibleBanner(),
        setupBadgesFunctions()
    ]
    await Promise.all(toSetup)
}

function freezeProperties(object, properties) {
	for (const type in object) {
		if ((properties && properties.length && properties.includes(type)) || (!properties || !properties.length)) {
			let value = object[type]
			try {
				Object.defineProperty(object, type, {
					configurable: false,
					get: () => value,
					set: (v) => v,
				})
			}catch {}
		}
	}
}

if (DataStore.get("Custom-profile-hover")) {

    // Change mastery score and challenge point when hover summoner card
    observer.subscribeToElementCreation("#lol-uikit-tooltip-root",async (element)=>{
        try{
            let checkID = element.querySelector(`lol-regalia-hovercard-v2-element`).getAttribute("summoner-id")
            if (checkID == DataStore.get("Summoner-ID")) {
                let MStext = document.querySelector("#hover-card-header > div.hover-card-header-left > span.hover-card-mastery-score").innerText
                let checkMS = MStext.includes(`${DataStore.get("Mastery-Score")}`)
                if (!checkMS && DataStore.get("Custom-mastery-score")) {
                    await request("PUT","/lol-chat/v1/me",{body: requestMasteryScore})
                }
                let fix = window.setInterval(async ()=>{
                    let CPtext = element.querySelector(".hover-card-challenge-crystal").innerText
                    let checkCP = CPtext.includes(`${DataStore.get("Challenge-Points")}`)
                    if (!checkCP && DataStore.get("Custom-challenge-crystal")) {
                        await request("PUT","/lol-chat/v1/me",{body: requestChallengeCrystal})
                    }
                },100)
                window.setTimeout(()=>{
                    window.clearInterval(fix)
                },3000)
            }
        }catch{}
    })

    if (DataStore.get("Custom-mastery-score")) {
        observer.subscribeToElementCreation(".collection-totals",(element)=>{
            let a = element.querySelector(".total-owned.total-count.ember-view")
            a.innerText = `${DataStore.get("Mastery-Score")}`
            freezeProperties(a,["innerText"])
        })
        observer.subscribeToElementCreation(".style-profile-champion-mastery-score",(element)=>{
            element.innerText = `${DataStore.get("Mastery-Score")}`
            freezeProperties(element,["innerText"])
        })
    }

    window.setTimeout(async ()=>{
        if (DataStore.get("Custom-rank")) {
            await request("PUT","/lol-chat/v1/me",{body: requestRank})
        }
        if (DataStore.get("Custom-mastery-score")) {
            await request("PUT","/lol-chat/v1/me",{body: requestMasteryScore})
        }
        if (DataStore.get("Custom-challenge-crystal")) {
            await request("PUT","/lol-chat/v1/me",{body: requestChallengeCrystal})

            observer.subscribeToElementCreation(".crystal-wrapper",(element)=>{
                let a = element.querySelector(".contents > div:nth-child(1)")
                let b = element.querySelector(".total-points")

                a.setAttribute("class", `crystal-image ${rank["Ranked Tier ID"][DataStore.get("Ranked Tier ID")]["Option"]}`)
                b.innerText = `${DataStore.get("Challenge-Points")}`
                element.querySelector(".level").innerText = rank["Ranked Tier ID"][DataStore.get("Ranked Tier ID")]["Option"].toLowerCase()
            })
        }
    }, 10000)
}

window.addEventListener("load", ()=> {
    utils.routineAddCallback(onMutation, [".rcp-fe-lol-profiles-main"])
})