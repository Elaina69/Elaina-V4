import utils from "https://cdn.statically.io/gh/Elaina69/Elaina-V2/main/Main/_utilselaina.js"
if (DataStore.get("random-skin")) {
    const delay = (t) => new Promise((r) => setTimeout(r, t));

    async function getChampionSkins() {
        const res = await fetch("/lol-champ-select/v1/skin-carousel-skins");
        const data = await res.json();

        const skinsArray = manageSkinsArray(data);

        return skinsArray;
    }

    function manageSkinsArray(skinsArray) {
        const availableSkinsArray = skinsArray
            .filter((s) => s.unlocked == true)
            .map((s) => s.id);
        return availableSkinsArray;
    }

    async function pickRandomSkin(message) {
        let data = 0;
        if (!message) {
            data = DataStore.get("rs_champion_id");
        } else {
            data = JSON.parse(message.data);
            data = data[2].data;
            DataStore.set("rs_champion_id", data);
        }

        if (data != 0) {
            const championSkinsArray = await getChampionSkins();

            if (championSkinsArray.length > 1) {
                const randomSkinId =
                    championSkinsArray[
                        Math.floor(Math.random() * championSkinsArray.length)
                    ];
                console.log(randomSkinId);
                const res = await fetch(
                    `/lol-champ-select/v1/session/my-selection`,
                    {
                        method: "PATCH",
                        body: JSON.stringify({ selectedSkinId: randomSkinId }),
                        headers: {
                            accept: "application/json",
                            "content-type": "application/json",
                        },
                    }
                );
                console.log(res.status);
                return;
            }
        }
    }

    function subscribeOnEvent() {
        const uri = document.querySelector(
            `link[rel="riot:plugins:websocket"]`
        ).href;
        const socket = new WebSocket(uri, "wamp");
        const targetAPI = "/lol-champ-select/v1/current-champion";
        const targetEvent = targetAPI.replace(/\//g, "_");

        socket.onopen = () =>
            socket.send(JSON.stringify([5, "OnJsonApiEvent" + targetEvent]));
        socket.onmessage = async (message) => {
            if (!DataStore.get("sr_enable")) return;

            await pickRandomSkin(message);
        };
    }

    async function createRerollButton() {
        const buttonDiv = document.createElement("div");
        const button = document.createElement("div");

        buttonDiv.classList = "sr-reroll-div mission-button-component ember-view";
        button.classList = "sr-reroll mission-button use-animation";
        button.style.backgroundImage = `url("https://cdn.statically.io/gh/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/reroll_button.png")`

        buttonDiv.append(button);

        button.onclick = async () => {
            await pickRandomSkin();
        };

        setInterval(() => {
            const leftPanel = document.querySelector(".bottom-right-buttons");
            const skinSelector = document.querySelector(".skin-select");

            if (
                leftPanel &&
                skinSelector.parentElement.className == "visible" &&
                DataStore.get("sr_enable")
            ) {
                if (!document.querySelector(".sr-reroll-div"))
                    leftPanel.insertBefore(buttonDiv, document.querySelector("lol-social-chat-toggle-button"));
            } else {
                if (document.querySelector(".sr-reroll-div")) document.querySelector(".sr-reroll-div").remove();
            }
        }, 100);
    }

    window.addEventListener("load", async () => {
        utils.addCss("","","",`https://cdn.statically.io/gh/Elaina69/Elaina-V2/main/Main/assets/Css/Addon-Css/reroll_button.css`)
        await delay(1000);
        if (DataStore.get("sr_enable") == undefined) DataStore.set("sr_enable", true);
        if (DataStore.get("champion_id")) DataStore.remove("champion_id")
        
        subscribeOnEvent();
        createRerollButton();
    })
}