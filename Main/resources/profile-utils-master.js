import utils from "https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/_utilselaina.js"

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
  if (responseData.title.itemId !== -1) { playerPreferences.title = `${responseData.title.itemId}` }
  if (responseData.bannerId) { playerPreferences.bannerAccent = responseData.bannerId }

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
      console.debug(`${plugin.name}: The player does not have a defined badge.`)
      return
    }

    const firstBadge = playerPreferences.challengeIds[0]
    playerPreferences.challengeIds = Array(3).fill(firstBadge)
    await updatePlayerPreferences(playerPreferences)
  })
  badgesContainer.addEventListener("contextmenu", async () => {
    const playerPreferences = await getPlayerPreferences()

    if (!playerPreferences.challengeIds.length) {
      console.debug(`${plugin.name}: The player badges are already empty.`)
      return
    }

    playerPreferences.challengeIds = []
    await updatePlayerPreferences(playerPreferences)
  })
}

async function onMutation() {
  const toSetup = [
    setupInvisibleBanner(),
    setupBadgesFunctions()
  ]
  await Promise.all(toSetup)
}

async function initPlugin() {
  utils.routineAddCallback(onMutation, [".rcp-fe-lol-profiles-main"])
}

window.addEventListener("load", initPlugin)