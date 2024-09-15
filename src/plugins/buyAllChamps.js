import utils from '../utils/utils.js';
import axios from "https://cdn.skypack.dev/axios";
import ChampsP from '../config/championPrices.js';

class Store {
    constructor() {
        this.url = null;
        this.token = null;
        this.summoner = null;
        this.session = axios.create();
    }

    async init() {
        try {
            this.url = await this.getStoreUrl();
            this.token = await this.getSummonerToken();
            this.summoner = await this.getSummonerData();
        } catch (error) {
            console.error("Failed to initialize Store:", error);
        }
    }

    async buyChampions(champions) {
        const items = champions.map(champion => ({
            "inventoryType": "CHAMPION",
            "itemId": champion.itemId,
            "ipCost": champion.ip,
            "quantity": 1
        }));
        const requestBody = { "accountId": this.summoner.accountId, "items": items };
        return this.request("POST", "/storefront/v3/purchase", requestBody);
    }

    async getAvailableChampionsByCost(cost) {
        const playerChampions = await this.getAvailableChampions();
        return playerChampions.catalog.filter(champion => !champion.owned && champion.ip == cost);
    }

    async getAvailableChampions() {
        const response = await this.request("GET", "/storefront/v3/view/champions");
        return response.data;
    }

    async request(method, endpoint, requestBody) {
        const requestParams = {
            method,
            headers: { "Authorization": `Bearer ${this.token}` },
            data: requestBody
        };
        return this.session.request(this.url + endpoint, requestParams);
    }

    async getStoreUrl() {
        const response = await fetch("/lol-store/v1/getStoreUrl");
        return response.json();
    }

    async getSummonerToken() {
        const response = await fetch("/lol-rso-auth/v1/authorization/access-token");
        const responseData = await response.json();
        return responseData.token;
    }

    async getSummonerData() {
        const response = await fetch("/lol-summoner/v1/current-summoner");
        return response.json();
    }
}

const eConsole = "%c Elaina ";
const eCss = "color: #ffffff; background-color: #f77fbe";

async function buyChampions(store, price) {
    try {
        let availableChampions;
        if (price === "All") {
            for (const priceObj of ChampsP.ChampsPrice) {
                availableChampions = await store.getAvailableChampionsByCost(priceObj.Cost);
                if (availableChampions.length > 0) {
                    await store.buyChampions(availableChampions);
                    console.log(eConsole + `%c Successfully bought %c${availableChampions.length} %cchampions for ${priceObj.Cost} BE`, eCss, "", "color: #0070ff", "");
                }
            }
        } else {
            availableChampions = await store.getAvailableChampionsByCost(price);
            if (availableChampions.length > 0) {
                await store.buyChampions(availableChampions);
                console.log(eConsole + `%c Successfully bought %c${availableChampions.length} %cchampions for ${price} BE`, eCss, "", "color: #0070ff", "");
            }
        }
        if (!availableChampions || availableChampions.length === 0) {
            console.log(eConsole + "%c No champions available to buy", eCss, "");
        }
    } catch (error) {
        console.error(eConsole + "%c Error buying champions:", eCss, "", error);
    }
}

function createBuyButton(store) {
    const buttonId = "buy-champions-button";
    const buyChampionButton = document.createElement("lol-uikit-flat-button");
    buyChampionButton.id = buttonId;
    buyChampionButton.style.marginRight = "15px";

    buyChampionButton.onclick = async () => {
        buyChampionButton.setAttribute("disabled", "true");
        try {
            await buyChampions(store, DataStore.get("ChampsPrice"));
        } finally {
            buyChampionButton.removeAttribute("disabled");
        }
    };

    return buyChampionButton;
}

function updateButtonText(button) {
    const price = DataStore.get("ChampsPrice");
    button.textContent = price === "All" ? "Buy All Champs" : `Buy ${price}BE Champs`;
}

function onStoreMutation() {
    const frameStore = document.querySelector("#rcp-fe-lol-store-iframe > iframe");
    const storeDocument = frameStore?.contentDocument.documentElement;
    
    if (!frameStore || storeDocument.querySelector(`#buy-champions-button`)) return;

    const store = new Store();
    store.init().then(() => {
        const buyChampionButton = createBuyButton(store);
        const navBar = storeDocument.querySelector(".nav.nav-right");
        navBar.insertBefore(buyChampionButton, navBar.firstChild);

        setInterval(() => updateButtonText(buyChampionButton), 1000);
    });
}

if (DataStore.get("buy-all-champs")) {
    window.addEventListener("load", () => {
        utils.routineAddCallback(onStoreMutation, ["rcp-fe-lol-store-iframe"]);
    });
}