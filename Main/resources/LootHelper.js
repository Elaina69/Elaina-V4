let lang

try{let res = await fetch(`https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/configs/Language.js`)
if (res.status==200) {lang = (await (() => import(`https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/configs/Language.js`))()).default}}catch{}

if (DataStore.get("loot-helper")) {
    function AddElement(parent, tag, params = [], classes = [], content = null) {
        let element = document.createElement(tag);
    
        params.forEach(param => element.setAttribute(param.name, param.value));
        classes.forEach(className => element.classList.add(className));
    
        if (content) element.innerHTML = content;
    
        parent.append(element);
    
        return element;
    }
    
    async function GetLoot() {
        let loot = {
            championShards: [],
            championSkinShards: [],
            shopTokens: [],
            chests: [],
            blueEssence: 0
        };
    
        await fetch("/lol-loot/v1/player-loot-map")
            .then(response => response.json())
            .then(data => {
                Object.entries(data).forEach(item => {
                    let [key, value] = item;
    
                    if (value.lootId === "CURRENCY_champion")
                        loot.blueEssence = value.count;
    
                    if (value.redeemableStatus !== "CHAMPION_NOT_OWNED" || value.upgradeEssenceValue !== 0) {
                        if (value.lootId.includes("CHEST") && value.localizedName !== "") {
                            loot.chests.push({
                                name: value.localizedName,
                                id: value.lootId,
                                data: value
                            });
                        }
    
                        if (value.localizedRecipeTitle.includes("Shop")) {
                            loot.shopTokens.push({
                                name: value.localizedName,
                                id: value.lootId,
                                data: value
                            });
                        }
    
                        for (let i = 0; i < value.count; i++) {
                            switch (value.displayCategories) {
                                case "CHAMPION":
                                    loot.championShards.push({
                                        name: value.itemDesc,
                                        id: value.lootId,
                                        data: value
                                    });
                                    break;
                                case "SKIN":
                                    loot.championSkinShards.push({
                                        name: value.itemDesc,
                                        id: value.lootId,
                                        data: value
                                    });
                                    break;
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error(error);
            });
    
        return loot;
    }
    
    function Sum(items, prop, propMultiply) {
        return items.reduce(function (a, b) {
            let sum = 0;
    
            if (propMultiply != null)
                sum = a + prop.split('.').reduce((x, c) => x[c], b) * propMultiply.split('.').reduce((x, c) => x[c], b);
            else
                sum = a + prop.split('.').reduce((x, c) => x[c], b);
    
            return sum;
        }, 0);
    }
    function AddContextMenu(title, subTitle, items = []) {
        let container = AddElement(document.body, 'div', [
            {
                name: 'style',
                value: 'position: absolute; z-index: 10000; left: 63px; top: 310px;'
            }
        ], ['niice-loot-helper-context-menu']);
    
        let contextMenu = AddElement(container, 'div', [], ['context-menu', 'loot-context-menu', 'context-menu-root']);
        let header = AddElement(contextMenu, 'div', [], ['context-menu-header', 'disabled']);
        AddElement(header, 'div', [], ['title'], '<h5>' + title + '</h5>');
        AddElement(header, 'div', [], [], subTitle);
        AddElement(header, 'hr', [], ['separator']);
    
        items.forEach(item => {
            let menuItem = AddElement(contextMenu, 'div', [], ['context-menu-item']);
    
            if (item.actionIcon != null && item.actionIcon !== '')
                AddElement(menuItem, 'div', [{
                    name: 'style',
                    value: 'background-image: url("' + item.actionIcon + '");'
                }], ['action-icon']);
    
            AddElement(menuItem, 'div', [], [], '<span class="action-name">' + item.title + '</span> ' + item.subTitle);
    
            if (item.essenceIcon != null && item.essenceIcon !== '')
                AddElement(menuItem, 'div', [], ['essence-icon', 'pull-right'], '<img src="' + item.essenceIcon + '"/>');
    
            let essenceTextClasses = ['pull-right', 'essence-container', 'essence-text'];
    
            if (item.essenceText != null && item.essenceText.toString().includes('-'))
                essenceTextClasses.push('negative-text');
    
            AddElement(menuItem, 'div', [], essenceTextClasses, item.essenceText);
            AddElement(menuItem, 'div', [], ['disabled-overlay']);
    
            if (item.clickEvent != null)
                menuItem.addEventListener('click', item.clickEvent);
        });
    }
    
    function OnClickRefreshButton() {
        document.querySelectorAll('.loot-category-information').forEach(elem => {
            elem.remove();
        });
    }
    
    function OnClickOpenChestsButton() {
        let langCode = document.querySelector("html").lang;
        let langMap = lang.langlist
        let selectedLang = lang[langMap[langCode] || "EN"];
        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
        if (contextMenu != null)
            return;
    
        GetLoot().then(loot => {
            let items = [];
    
            loot.chests.forEach(chest => {
                items.push({
                    title: `${selectedLang["open"]}`,
                    subTitle: chest.name,
                    essenceText: chest.data.count,
                    clickEvent: async () => {
                        if (window.confirm(`${selectedLang["open-chest-prom"]} ` + chest.name + '?')) {
                            await fetch('/lol-loot/v1/recipes/' + chest.id + '_OPEN/craft?repeat=' + chest.data.count, {
                                method: 'POST',
                                body: JSON.stringify([chest.id]),
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(async (response) => {
                                if (response.status === 500) {
                                    await fetch('/lol-loot/v1/recipes/' + chest.id + '_OPEN/craft?repeat=' + chest.data.count, {
                                        method: 'POST',
                                        body: JSON.stringify([chest.id, "MATERIAL_key"]),
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    });
                                }
                            });
                        }
    
                        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
                        if (contextMenu != null)
                            contextMenu.remove();
                    }
                });
            });
    
            items.push({
                title: `${selectedLang["close"]}`,
                subTitle: '',
                actionIcon: '',
                essenceIcon: '',
                essenceText: '',
                clickEvent: () => {
                    let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
                    if (contextMenu != null)
                        contextMenu.remove();
                }
            });
    
            AddContextMenu(`${selectedLang["materials"]}`, `${selectedLang["open-chest"]}`, items);
        });
    }
    
    function OnClickBlueEssenceButton() {
        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
        let langCode = document.querySelector("html").lang;
        let langMap = lang.langlist
        let selectedLang = lang[langMap[langCode] || "EN"];
    
        if (contextMenu != null)
            return;
    
        GetLoot().then(loot => {
            let keyMaps = {};
            let alreadyOwned = [];
            let duplicates = [];
    
            loot.championShards.forEach(item => {
                if (item.data.itemStatus === "OWNED")
                    alreadyOwned.push(item);
    
                let {id} = item;
                keyMaps[id] = keyMaps[id] ?? [];
                keyMaps[id].push(item);
            });
    
            Object.keys(keyMaps).forEach(key => {
                if (keyMaps[key].length >= 2) {
                    for (let i = 1; i < keyMaps[key].length; i++) {
                        duplicates.push(keyMaps[key][i]);
                    }
                }
            });
    
            let upgradableChampions = [];
            let championShards = loot.championShards.sort((a, b) => (a.data.upgradeEssenceValue > b.data.upgradeEssenceValue) ? 1 : ((b.data.upgradeEssenceValue > a.data.upgradeEssenceValue) ? -1 : 0))
            let blueEssence = loot.blueEssence;
    
            championShards.forEach(item => {
                if (item.data.itemStatus === "FREE" && blueEssence >= item.data.upgradeEssenceValue) {
                    upgradableChampions.push(item);
                    blueEssence -= item.data.upgradeEssenceValue;
                }
            });
    
            AddContextMenu(`${selectedLang["BE"]}`, `${selectedLang["Champ-shards"]}`, [ //`${selectedLang[""]}`
                {
                    title: `${selectedLang["disenchant"]}`,
                    subTitle: `${selectedLang["duplicates"]}`,
                    actionIcon: '/fe/lol-loot/assets/context_menu/disenchant.png',
                    essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                    essenceText: '+' + Sum(duplicates, 'data.disenchantValue'),
                    clickEvent: () => {
                        if (window.confirm(`${selectedLang["dis-dup-prom"]}`)) {
                            duplicates.forEach(async (item) => {
                                await fetch('/lol-loot/v1/recipes/CHAMPION_RENTAL_disenchant/craft?repeat=1', {
                                    method: 'POST',
                                    body: JSON.stringify([item.id]),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
                            });
                        }
    
                        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
                        if (contextMenu != null)
                            contextMenu.remove();
                    }
                },
                {
                    title: `${selectedLang["disenchant"]}`,
                    subTitle: `${selectedLang["already-owned"]}`,
                    actionIcon: '/fe/lol-loot/assets/context_menu/disenchant.png',
                    essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                    essenceText: '+' + Sum(alreadyOwned, 'data.disenchantValue'),
                    clickEvent: () => {
                        if (window.confirm(`${selectedLang["dis-owned-prom"]}`)) {
                            alreadyOwned.forEach(async (item) => {
                                await fetch('/lol-loot/v1/recipes/CHAMPION_RENTAL_disenchant/craft?repeat=1', {
                                    method: 'POST',
                                    body: JSON.stringify([item.id]),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
                            });
                        }
    
                        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
                        if (contextMenu != null)
                            contextMenu.remove();
                    }
                },
                {
                    title: `${selectedLang["disenchant"]}`,
                    subTitle: `${selectedLang["all"]}`,
                    actionIcon: '/fe/lol-loot/assets/context_menu/disenchant.png',
                    essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                    essenceText: '+' + Sum(loot.championShards, 'data.disenchantValue'),
                    clickEvent: () => {
                        if (window.confirm(`${selectedLang["dis-all-prom"]}`)) {
                            loot.championShards.forEach(async (item) => {
                                await fetch('/lol-loot/v1/recipes/CHAMPION_RENTAL_disenchant/craft?repeat=1', {
                                    method: 'POST',
                                    body: JSON.stringify([item.id]),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
                            });
                        }
    
                        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
                        if (contextMenu != null)
                            contextMenu.remove();
                    }
                },
                {
                    title: `${selectedLang["upgrade"]}`,
                    subTitle: `${selectedLang["all"]}`,
                    actionIcon: '/fe/lol-loot/assets/context_menu/upgrade.png',
                    essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                    essenceText: '-' + Sum(upgradableChampions, 'data.upgradeEssenceValue'),
                    clickEvent: () => {
                        if (window.confirm(`${selectedLang["up-all-prom"]}`)) {
                            upgradableChampions.forEach(async (item) => {
                                await fetch('/lol-loot/v1/recipes/CHAMPION_upgrade/craft?repeat=1', {
                                    method: 'POST',
                                    body: JSON.stringify([item.id, "CURRENCY_champion"]),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
                            });
                        }
    
                        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
                        if (contextMenu != null)
                            contextMenu.remove();
                    }
                },
                {
                    title: `${selectedLang["close"]}`,
                    subTitle: '',
                    actionIcon: '',
                    essenceIcon: '',
                    essenceText: '',
                    clickEvent: () => {
                        let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    
                        if (contextMenu != null)
                            contextMenu.remove();
                    }
                }
            ]);
        });
    }
    
    function CreateBlueEssenceButton() {
        let tabs = document.querySelector('.loot-display-category-tabs-container');
    
        if (tabs == null)
            return;
    
        if (document.querySelector('.blue-essence-button-container') != null)
            return;
    
        let container = AddElement(tabs, 'div', [], ['blue-essence-button-container']);
        let button = AddElement(container, 'div', [], ['blue-essence-button']);
        button.addEventListener('click', OnClickBlueEssenceButton);
    }
    
    function CreateRefreshButton() {
        let tabs = document.querySelector('.loot-display-category-tabs-container');
    
        if (tabs == null)
            return;
    
        if (document.querySelector('.refresh-button-container') != null)
            return;
    
        let container = AddElement(tabs, 'div', [], ['refresh-button-container']);
        let button = AddElement(container, 'div', [], ['refresh-button']);
        button.addEventListener('click', OnClickRefreshButton);
    }
    
    function CreateOpenChestsButton() {
        let tabs = document.querySelector('.loot-display-category-tabs-container');
    
        if (tabs == null)
            return;
    
        if (document.querySelector('.open-chests-button-container') != null)
            return;
    
        let container = AddElement(tabs, 'div', [], ['open-chests-button-container']);
        let button = AddElement(container, 'div', [], ['open-chests-button']);
        button.addEventListener('click', OnClickOpenChestsButton);
    }
    
    function CreateCategoryInformation() {
        let langCode = document.querySelector("html").lang;
        let langMap = lang.langlist
        let selectedLang = lang[langMap[langCode] || "EN"];
    
        let categories = document.querySelectorAll('.display-category-section');
    
        if (categories == null || categories.length === 0)
            return;
    
        if (document.querySelector('.loot-category-information') != null)
            return;
    
        GetLoot().then(loot => {
            AddElement(categories[1].querySelector(".title-text"), 'span', [
                {
                    name: 'style',
                    value: 'margin-left: 5px;'
                }
            ], ['loot-category-information'], '(' + loot.championShards.length + " " + selectedLang["shards"] + " | " + selectedLang["worth"] + " " + Sum(loot.championShards, 'data.disenchantValue', 'data.count') + ' <img style="margin-bottom: -4px;" src="/fe/lol-loot/assets/context_menu/currency_champion.png"/>)');
    
            AddElement(categories[2].querySelector(".title-text"), 'span', [
                {
                    name: 'style',
                    value: 'margin-left: 5px;'
                }
            ], ['loot-category-information'], '(' + loot.championSkinShards.length + " " + selectedLang["shards"] + " | " + selectedLang["worth"] + " " + Sum(loot.championSkinShards, 'data.disenchantValue', 'data.count') + ' <img style="margin-bottom: -4px;" src="/fe/lol-loot/assets/context_menu/currency_cosmetic.png"/>)');
        });
    }
    
    
    window.addEventListener('load', () => {
        let NStyle = document.createElement('style');
		NStyle.appendChild(document.createTextNode(
			'@import url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Css/Addon-Css/LootHelper.css");:root {--OC_button:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-open-chests.png");--BE_button:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-blue-essence.png");--BE_hover:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-blue-essence-hover.png");--BE_active:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-blue-essence-click.png");--rbutton:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-refresh.png");--rhover:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-refresh-hover.png");--ractive:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-refresh-click.png");--OC_hover:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-open-chests-hover.png");--OC_active:url("https://gitloaf.com/jsdcdn/Elaina69/Elaina-V2/main/Main/assets/Icon/Plugins-icons/button-open-chests-click.png");}'
		));
	    document.body.appendChild(NStyle)
    
        window.setInterval(async () => {
            CreateRefreshButton();
            CreateOpenChestsButton();
            CreateBlueEssenceButton();
            CreateCategoryInformation();
            let lootTray = document.querySelector('.loot-tray.ember-view');
            if (lootTray != null)
                lootTray.setAttribute('style', 'margin-top: 0px;');
        }, 1000);
    });
}