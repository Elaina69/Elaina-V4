import axios from "https://cdn.skypack.dev/axios"
import utils from "https://gitloaf.com/cdn/Elaina69/Elaina-V2/main/Main/_utilselaina.js"

let lang

try{let res = await fetch(`https://gitloaf.com/cdn/Elaina69/Elaina-V2/main/configs/Language.js`)
if (res.status==200) {lang = (await (() => import(`https://gitloaf.com/cdn/Elaina69/Elaina-V2/main/configs/Language.js`))()).default}}catch{}

if (DataStore.get("Auto-ban-pick")) {
  const request = async (method, url, userBody = null) => {
    const requestParams = {
        "method": method,
        "headers": {
            "accept": "application/json",
            "content-type": "application/json",
        }
    }
    if (userBody) { requestParams.body = JSON.stringify(userBody) }
    return await fetch(url, requestParams)
  }
  
  async function selectChampion(actionId, championId, completed = true) {
    const url = `/lol-champ-select/v1/session/actions/${actionId}`
    const body = {
        "completed": completed,
        "championId": championId,
    }
    const response = await request("PATCH", url, body)
    if (!response.ok) { return false }
    return true
  }
  
  async function getChampionSelectData() {
    const url = "/lol-champ-select/v1/session"
    const response = await request("GET", url)
    return await response.json()
  }
  
  async function getGamePhase() {
    const url = "/lol-gameflow/v1/gameflow-phase"
    const response = await request("GET", url)
    return await response.json()
  }
  
  async function getAllChampions(region = "default") {
    const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/${region}/v1/champion-summary.json`
    const response = await axios.get(url)
    response.data.sort((a, b) => a.name.localeCompare(b.name))
    return response.data
  }
  
  function getDropdown(dropdownId) {
    const dropdown = document.createElement("lol-uikit-framed-dropdown")
    dropdown.setAttribute("id", dropdownId)
    dropdown.style.setProperty("margin-bottom", "1.2px")
    return dropdown
  }
  
  function getOption(text) {
    const option = document.createElement("lol-uikit-dropdown-option")
    option.setAttribute("slot", "lol-uikit-dropdown-option")
    option.innerHTML = text
    return option
  }
  
  function getCheckBox(text, enabled) {
    const pickCheckbox = document.createElement("lol-uikit-radio-input-option")
    if (enabled) { pickCheckbox.setAttribute("selected", enabled) }
    pickCheckbox.style.setProperty("margin-left", "12px")
    pickCheckbox.style.fontFamily = "var(--font-family, var(--font-display))"
    pickCheckbox.innerHTML = text
    return pickCheckbox
  }
  
let allChampions = null
const defaultPickSettings = { "enabled": false, "champions": [429, 136] }
const defaultBanSettings = { "enabled": false, "force": false, "champions": [350, 221] }

const gamePhaseHandler = async message => {
  const jsonObject = JSON.parse(message.data)
  const messageData = jsonObject[2]["data"]
  if (messageData !== "ChampSelect") { return }

  while (await getGamePhase() === "ChampSelect") {
    const championSelectData = await getChampionSelectData()
    await onChampionSelect(championSelectData)

    if (championSelectData.timer.phase === "FINALIZATION") { return }

    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

const onChampionSelect = async championSelectData => {
  const { localPlayerCellId, actions, bans, myTeam, theirTeam } = championSelectData
  const allBans = [...bans.myTeamBans, ...bans.theirTeamBans]
  const allPicks = [...myTeam, ...theirTeam]

  const pickChampion = DataStore.get("pickChampion")
  const banChampion = DataStore.get("banChampion")

  for (const subAction of actions) {
    for (const action of subAction) {
      if (action.completed || action.actorCellId != localPlayerCellId) { continue }

      if (action.type === "pick" && pickChampion.enabled) {
        for (const championId of pickChampion.champions) {
          if (allBans.some(bannedChampionId => bannedChampionId == championId)) { continue }
          if (allPicks.some(player => player.championId == championId)) { continue }
          if (await selectChampion(action.id, championId)) { return }
        }
      }

      if (action.type === "ban" && banChampion.enabled) {
        for (const championId of banChampion.champions) {
          if (allBans.some(bannedChampionId => bannedChampionId == championId)) { continue }
          if (!banChampion.force && myTeam.some(ally => ally.championPickIntent == championId)) { continue }
          if (await selectChampion(action.id, championId)) { return } else { break }
        }
      }
    }
  }
}

class DropdownChampions {
  constructor(index, id, champions, tooltip, brightness = false) {
    this.index = index
    this.id = id
    this.champions = champions

    this.selectedChampion = null
    this.config = DataStore.get(this.id)
    this.element = getDropdown(this.id)

    for (const champion of this.champions) {
      const option = this.getOption(champion)
      this.element.append(option)
    }

    if (brightness) { this.element.style.filter = "brightness(0.7)" }
    this.hoverText = this.element.shadowRoot.querySelector("div > dt > div")
    this.element.onmouseenter = () => { this.hoverText.textContent = tooltip }
    this.element.onmouseleave = () => { this.hoverText.textContent = this.selectedChampion }
  }

  getOption(champion) {
    const option = getOption(champion.name)

    option.onclick = () => {
      this.config.champions[this.index] = champion.id
      this.selectedChampion = champion.name
      DataStore.set(this.id, this.config)
    }
    if (this.config.champions[this.index] == champion.id) {
      this.selectedChampion = champion.name; option.setAttribute("selected", "true")
    }

    return option
  }
}

class DropdownChampionsContainer {
  constructor(id) {
    this.element = document.createElement("div")
    this.element.id = id
  }
}

class CheckboxContainer {
  constructor(id) {
    this.element = document.createElement("div")
    this.element.className = "alpha-version-panel"
    this.element.id = id
  }
}

class AutoCheckbox {
  constructor(text, configKey) {
    this.configKey = configKey
    this.config = DataStore.get(this.configKey)
    this.element = getCheckBox(text, this.config.enabled)

    this.element.onclick = () => {
      this.config.enabled = !this.config.enabled
      DataStore.set(this.configKey, this.config)

      if (this.config.enabled) { this.element.setAttribute("selected", "true") }
      else { this.element.removeAttribute("selected") }
    }
  }
}

const onMutation = () => {
  const socialContainer = document.querySelector(".lol-social-lower-pane-container")

  if (
    !socialContainer ||
    document.getElementById("checkbox-container") ||
    document.getElementById("pick-dropdown-container") ||
    document.getElementById("ban-dropdown-container")
  ) {
    return
  }

  const langCode = document.querySelector("html").lang;
	const langMap = lang.langlist

  const checkBoxContainer = new CheckboxContainer("checkbox-container")

  const pickDropdownContainer = new DropdownChampionsContainer("pick-dropdown-container")
  const banDropdownContainer = new DropdownChampionsContainer("ban-dropdown-container")

  const pickCheckbox = new AutoCheckbox(lang[langMap[langCode] || "EN"]["auto_pick"], "pickChampion")
  const banCheckbox = new AutoCheckbox(lang[langMap[langCode] || "EN"]["auto_ban"], "banChampion")

  const firstPickDropdown = new DropdownChampions(0, "pickChampion", allChampions, lang[langMap[langCode] || "EN"]["first_pick"])
  const secondPickDropdown = new DropdownChampions(1, "pickChampion", allChampions, lang[langMap[langCode] || "EN"]["second_pick"])

  const firstBanDropdown = new DropdownChampions(0, "banChampion", allChampions, lang[langMap[langCode] || "EN"]["first_ban"], true)
  const secondBanDropdown = new DropdownChampions(1, "banChampion", allChampions, lang[langMap[langCode] || "EN"]["second_ban"], true)

  checkBoxContainer.element.append(pickCheckbox.element, banCheckbox.element)
  pickDropdownContainer.element.append(firstPickDropdown.element, secondPickDropdown.element)
  banDropdownContainer.element.append(firstBanDropdown.element, secondBanDropdown.element)

  socialContainer.append(checkBoxContainer.element, pickDropdownContainer.element, banDropdownContainer.element)
}

window.addEventListener("load", async () => {
  allChampions = await getAllChampions()

  if (!DataStore.has("pickChampion")) { DataStore.set("pickChampion", defaultPickSettings) }
  if (!DataStore.has("banChampion")) { DataStore.set("banChampion", defaultBanSettings) }

  utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", gamePhaseHandler)
  utils.routineAddCallback(onMutation, ["lol-social-lower-pane-container"])
})
}