import utils from "https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/_utilselaina.js"
import axios from "https://cdn.skypack.dev/axios"
import ChampsP from 'https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/configs/ChampionsPrices.js'

export class Store {
    constructor() {
        this.url = null
        this.token = null
        this.summoner = null
        this.session = axios.create()
        this.auth()
    }
    async buyChampions(champions) {
        const items = champions.map(
            champion => (
                {
                    "inventoryType": "CHAMPION",
                    "itemId": champion.itemId,
                    "ipCost": champion.ip,
                    "quantity": 1
                }
            )
        )
        const requestBody = { "accountId": this.summoner.accountId, "items": items }
        return await this.request("POST", "/storefront/v3/purchase", requestBody)
    }
    async getAvailableChampionsByCost(cost) {
        const playerChampions = await this.getAvailableChampions()
        const availableChampions = []

        for (const champion of playerChampions.catalog) {
            if (!champion.owned && champion.ip == cost) {
                availableChampions.push(champion)
            }
        }

        return availableChampions
    }
    async getAvailableChampions() {
        const endpoint = "/storefront/v3/view/champions"
        const response = await this.request("GET", endpoint)
        return response.data
    }
    async request(method, endpoint, requestBody = undefined) {
        const requestParams = {
            "method": method,
            "headers": {
                "Authorization": `Bearer ${this.token}`
            }
        }
        if (requestBody) { requestParams.data = requestBody }
        return await this.session.request(this.url + endpoint, requestParams)
    }
    async auth() {
        this.url = await this.getStoreUrl()
        this.token = await this.getSummonerToken()
        this.summoner = await this.getSummonerData()
    }
    async getStoreUrl() {
        const endpoint = "/lol-store/v1/getStoreUrl"
        const response = await fetch(endpoint)
        return await response.json()
    }
    async getSummonerToken() {
        const endpoint = "/lol-rso-auth/v1/authorization/access-token"
        const response = await fetch(endpoint)
        const responseData = await response.json()
        return responseData.token
    }
    async getSummonerData() {
        const endpoint = "/lol-summoner/v1/current-summoner"
        const response = await fetch(endpoint)
        return await response.json()
    }
}
const buttonId = "buy-450-champions-button"
const onMutation = () => {
    const frameStore = document.querySelector("#rcp-fe-lol-store-iframe > iframe")
    const storeDocument = frameStore?.contentDocument.documentElement
    const store = new Store()
    const buyChampionButton = document.createElement("lol-uikit-flat-button")

    if (!frameStore || storeDocument.querySelector(`#${buttonId}`)) { return }
    buyChampionButton.id = buttonId
    window.setInterval(()=> {
        if (DataStore.get("ChampsPrice") == "All") {
            buyChampionButton.textContent = `Buy All Champs`
        }
        else {
            buyChampionButton.textContent = `Buy ${DataStore.get("ChampsPrice")}BE Champs`
        }
    },1000)
    buyChampionButton.style.marginRight = "15px"
    buyChampionButton.onclick = async () => {
        buyChampionButton.setAttribute("disabled", "true")
        if (DataStore.get("ChampsPrice") == "All") {
            try {
                const allchamps = ChampsP["ChampsPrice"].length - 1
                for(let i = 0; i < allchamps; i++) {
                    let availableChampions = await store.getAvailableChampionsByCost(ChampsP["ChampsPrice"][i].Cost)
                    if (availableChampions.length > 0) {
                        await store.buyChampions(availableChampions)
                        console.log(`Successfully bought ${availableChampions.length} champions`)
                    }
                    else if (availableChampions.length == 0) {
                        console.log("No champions can buy")
                    }
                }
            }
            finally { buyChampionButton.removeAttribute("disabled") }
        }
        else {
            try {
                let availableChampions = await store.getAvailableChampionsByCost(DataStore.get("ChampsPrice"))
                if (availableChampions.length > 0) {
                await store.buyChampions(availableChampions)
                console.log(`Successfully bought ${availableChampions.length} champions`)
                }
                else if (availableChampions.length == 0) {
                console.log("No champions can buy")
                }
            }
            finally { buyChampionButton.removeAttribute("disabled") }
        }
    }
    const navBar = storeDocument.querySelector(".nav.nav-right")
    navBar.insertBefore(buyChampionButton, navBar.firstChild)
}

window.addEventListener("load", () => {
  utils.routineAddCallback(onMutation, ["rcp-fe-lol-store-iframe"])
})