import utils from '../utils/utils.ts';
import axios from "https://cdn.skypack.dev/axios";

//@ts-ignore
let ChampsP = (await import(`//plugins/${window.getThemeName()}/config/championPrices.js`)).default;

interface Champion {
    itemId: number;
    ip: string;
    owned: boolean;
}

interface Summoner {
    accountId: string
    [key: string]: any
}

interface StoreUrlResponse {
    url: string;
}

interface TokenResponse {
    token: string;
}

interface ChampionsResponse {
    catalog: Champion[];
}

class Store {
    private url: string | null = null;
    private token: string | null = null;
    private summoner: Summoner | null = null;
    private session: any;

    constructor() {
        this.session = axios.create();
    }

    async init(): Promise<void> {
        try {
            this.url = (await this.getStoreUrl()).url;
            this.token = (await this.getSummonerToken()).token;
            this.summoner = await this.getSummonerData();
        } catch (error: any) {
            console.error("Failed to initialize Store:", error);
        }
    }

    async buyChampions(champions: Champion[]): Promise<any> {
        if (!this.summoner) throw new Error("Summoner data not initialized.");

        const items = champions.map(champion => ({
            inventoryType: "CHAMPION",
            itemId: champion.itemId,
            ipCost: champion.ip,
            quantity: 1
        }));

        const requestBody = {
            accountId: this.summoner.accountId,
            items
        };

        return this.request("POST", "/storefront/v3/purchase", requestBody);
    }

    async getAvailableChampionsByCost(cost: string): Promise<Champion[]> {
        const playerChampions = await this.getAvailableChampions();
        return playerChampions.catalog.filter(champion => !champion.owned && champion.ip === cost);
    }

    async getAvailableChampions(): Promise<ChampionsResponse> {
        const response = await this.request("GET", "/storefront/v3/view/champions");
        return response.data;
    }

    private async request(method: 'GET' | 'POST', endpoint: string, requestBody?: any): Promise<any> {
        if (!this.url || !this.token) throw new Error("URL or Token not initialized.");

        const requestParams = {
            method,
            headers: { "Authorization": `Bearer ${this.token}` },
            data: requestBody
        };

        return this.session.request({
            url: this.url + endpoint,
            ...requestParams
        });
    }

    private async getStoreUrl(): Promise<StoreUrlResponse> {
        const response = await fetch("/lol-store/v1/getStoreUrl");
        return response.json();
    }

    private async getSummonerToken(): Promise<TokenResponse> {
        const response = await fetch("/lol-rso-auth/v1/authorization/access-token");
        return response.json();
    }

    private async getSummonerData(): Promise<Summoner> {
        const response = await fetch("/lol-summoner/v1/current-summoner");
        return response.json();
    }
}

const eConsole = "%c Elaina ";
const eCss = "color: #ffffff; background-color: #f77fbe";

async function buyChampions(store: Store, price: string): Promise<void> {
    try {
        let availableChampions: any;
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
    } catch (error: any) {
        console.error(eConsole + "%c Error buying champions:", eCss, "", error);
    }
}

function createBuyButton(store: Store): HTMLElement {
    const buttonId: string = "buy-champions-button";
    const buyChampionButton = document.createElement("lol-uikit-flat-button");
    buyChampionButton.id = buttonId;
    buyChampionButton.style.marginRight = "15px";

    buyChampionButton.onclick = async (): Promise<void> => {
        buyChampionButton.setAttribute("disabled", "true");
        try {
            await buyChampions(store, window.DataStore.get("ChampsPrice"));
        } finally {
            buyChampionButton.removeAttribute("disabled");
        }
    };

    return buyChampionButton;
}

function updateButtonText(button: HTMLElement): void {
    const price = window.DataStore.get("ChampsPrice");
    button.textContent = price === "All" ? "Buy All Champs" : `Buy ${price}BE Champs`;
}

function onStoreMutation() {
    const frameStore: any = document.querySelector("#rcp-fe-lol-store-iframe > iframe");
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

if (window.DataStore.get("buy-all-champs")) {
    window.addEventListener("load", () => {
        utils.routineAddCallback(onStoreMutation, ["rcp-fe-lol-store-iframe"]);
    });
}