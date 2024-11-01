import utils from '../utils/utils.ts'
import * as upl from 'pengu-upl';

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
        "challengePoints"       : `${window.DataStore.get("Challenge-Points")}`,
        "challengeCrystalLevel" : `${rank["Ranked Tier ID"][window.DataStore.get("challengeCrystalLevel")]["Option"]}`
    }
}
let requestRank = {
    "lol": {
        "rankedLeagueQueue"    : rank["Ranked Queue ID"][window.DataStore.get("Ranked Queue ID")]["Option"],
        "rankedLeagueTier"     : rank["Ranked Tier ID"][window.DataStore.get("Ranked Tier ID")]["Option"],
        "rankedLeagueDivision" : rank["Ranked Division ID"][window.DataStore.get("Ranked Division ID")]["name"]
    }
}

let requestMasteryScore = {
    "lol": {
        "masteryScore":`${window.DataStore.get("Mastery-Score")}`
    }
}

async function request(method: string, endpoint: string, { headers = {}, body = {} }: { headers?: Record<string, string>; body?: Record<string, any> } = {}
): Promise<Response> {
    const requestOptions: RequestInit = {
        method: method,
        headers: {
            ...headers,
            "accept": "application/json",
            "content-type": "application/json"
        },
    }
    if (method !== "GET" && method !== "HEAD") {
        requestOptions.body = JSON.stringify(body)
    }
    return await fetch(endpoint, requestOptions)
}

interface BadgeChallenge {
    id: number;
}

interface Title {
    itemId: number;
}

interface PlayerPreferences {
    challengeIds: number[];
    title?: string;
    bannerAccent?: string;
}

async function getPlayerPreferences(): Promise<PlayerPreferences> {
    const endpoint: string = "/lol-challenges/v1/summary-player-data/local-player"
    const response = await request("GET", endpoint)
    const responseData: { topChallenges: BadgeChallenge[]; title: Title; bannerId?: string} = await response.json()
    const playerPreferences: PlayerPreferences = { challengeIds: [] }
  
    playerPreferences.challengeIds = responseData.topChallenges.map((badgeChallenge) => badgeChallenge.id)
    if (responseData.title.itemId !== -1) { 
        playerPreferences.title = `${responseData.title.itemId}`
    }
    if (responseData.bannerId) { 
        playerPreferences.bannerAccent = responseData.bannerId 
    }
    return playerPreferences
}
  
async function updatePlayerPreferences(playerPreferences: PlayerPreferences): Promise<Response> {
    const endpoint = "/lol-challenges/v1/update-player-preferences"
    return await request("POST", endpoint, { body: playerPreferences })
}
  
async function setupInvisibleBanner() {
    const bannerContainer = document.querySelector("div > lol-regalia-profile-v2-element")?.shadowRoot?.querySelector("div > lol-regalia-banner-v2-element")?.shadowRoot?.querySelector("div")
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
  
async function setupBadgesFunctions(): Promise<void> {
    const badgesContainer: HTMLElement | null = document.querySelector("div > div.challenge-banner-token-container")
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
  
async function onMutation(): Promise<void> {
    const toSetup = [
        //setupInvisibleBanner(),
        setupBadgesFunctions()
    ]
    await Promise.all(toSetup)
}

function freezeProperties(object: Object, properties: string[]): void {
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

if (window.DataStore.get("Custom-profile-hover")) {

    // Change mastery score and challenge point when hover summoner card
    upl.observer.subscribeToElementCreation("#lol-uikit-tooltip-root",async (element: any)=>{
        try{
            let checkID = element.querySelector(`lol-regalia-hovercard-v2-element`)?.getAttribute("summoner-id")
            if (checkID == window.DataStore.get("Summoner-ID")) {
                let GetMStext: any = document.querySelector("#hover-card-header > div.hover-card-header-left > span.hover-card-mastery-score")
                let MStext = GetMStext.innerText
                let checkMS = MStext.includes(`${window.DataStore.get("Mastery-Score")}`)
                if (!checkMS && window.DataStore.get("Custom-mastery-score")) {
                    await request("PUT","/lol-chat/v1/me",{body: requestMasteryScore})
                }
                let fix = window.setInterval(async ()=>{
                    let getCPtext: HTMLElement | null = element.querySelector(".hover-card-challenge-crystal")
                    let CPtext = getCPtext?.innerText
                    let checkCP = CPtext?.includes(`${window.DataStore.get("Challenge-Points")}`)
                    if (!checkCP && window.DataStore.get("Custom-challenge-crystal")) {
                        await request("PUT","/lol-chat/v1/me",{body: requestChallengeCrystal})
                    }
                },100)
                window.setTimeout(()=>{
                    window.clearInterval(fix)
                },3000)
            }
        }catch{}
    })

    if (window.DataStore.get("Custom-mastery-score")) {
        upl.observer.subscribeToElementCreation(".collection-totals",(element: any)=>{
            let a: HTMLElement | null = element.querySelector(".total-owned.total-count.ember-view")
            if (a) {
                a.innerText = `${window.DataStore.get("Mastery-Score")}`
                freezeProperties(a,["innerText"])
            }
        })
        upl.observer.subscribeToElementCreation(".style-profile-champion-mastery-score",(element: any)=>{
            element.innerText = `${window.DataStore.get("Mastery-Score")}`
            freezeProperties(element,["innerText"])
        })
    }

    window.setTimeout(async ()=>{
        if (window.DataStore.get("Custom-rank")) {
            await request("PUT","/lol-chat/v1/me",{body: requestRank})
        }
        if (window.DataStore.get("Custom-mastery-score")) {
            await request("PUT","/lol-chat/v1/me",{body: requestMasteryScore})
        }
        if (window.DataStore.get("Custom-challenge-crystal")) {
            await request("PUT","/lol-chat/v1/me",{body: requestChallengeCrystal})

            upl.observer.subscribeToElementCreation(".crystal-wrapper",(element: any)=>{
                let a: HTMLElement | null = element.querySelector(".contents > div:nth-child(1)")
                let b: HTMLElement | null = element.querySelector(".total-points")
                let level: HTMLElement | null = element.querySelector(".level")
                a?.setAttribute("class", `crystal-image ${rank["Ranked Tier ID"][window.DataStore.get("Ranked Tier ID")]["Option"]}`)
                if (b) b.innerText = `${window.DataStore.get("Challenge-Points")}`
                if (level) level.innerText = rank["Ranked Tier ID"][window.DataStore.get("Ranked Tier ID")]["Option"].toLowerCase()
            })
        }
    }, 10000)
}

window.addEventListener("load", ()=> {
    utils.routineAddCallback(onMutation, [".rcp-fe-lol-profiles-main"])
})