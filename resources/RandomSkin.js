if (DataStore.get("random-skin")) {
    const delay = (t) => new Promise((r) => setTimeout(r, t));

    async function getChampionSkins() {
        const res = await fetch("/lol-champ-select/v1/skin-carousel-skins");
        const data = await res.json();
        return data;
    }

    function manageSkinsArray(skinsArray) {
        skinsArray.filter((s) => s.unlocked == true);

        const availableSkinsArray = skinsArray.map((s) => s.id);
        return availableSkinsArray;
    }

    function subscribeOnEvent() {
        const uri         = document.querySelector(`link[rel="riot:plugins:websocket"]`).href;
        const socket      = new WebSocket(uri, "wamp");
        const targetAPI   = "/lol-champ-select/v1/current-champion";
        const targetEvent = targetAPI.replace(/\//g, "_");

        socket.onopen    = () => socket.send(JSON.stringify([5, "OnJsonApiEvent" + targetEvent]));
        socket.onmessage = async (message) => {
            let data = JSON.parse(message.data);
            data = data[2].data;

            if (data != 0) {
                const championSkinsArray          = await getChampionSkins();
                const championAvailableSkinsArray = await manageSkinsArray(championSkinsArray);

                if (championAvailableSkinsArray.length > 1) {
                    const randomSkinId = championAvailableSkinsArray[
                        Math.floor(
                            Math.random() * championAvailableSkinsArray.length
                        )
                    ];
                    await fetch(
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
                    return;
                }
            }
        };
    }

    window.addEventListener("load", async () => {
        await delay(500);
        subscribeOnEvent();
    });
}