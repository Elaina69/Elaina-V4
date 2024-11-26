import utils from '../utils/utils.ts'
import * as upl from "pengu-upl"
import { getThemeName } from "../otherThings"
import { log } from '../utils/themeLog.ts'

let datapath = `//plugins/${getThemeName()}/`

function AddElement(parent: any, tag: any, params: any[] = [], classes:any[] = [], content: any = null) {
    let element = document.createElement(tag);

    params.forEach((param: any) => element.setAttribute(param.name, param.value));
    classes.forEach(className => element.classList.add(className));

    if (content) element.innerHTML = content;

    parent.append(element);

    return element;
}

async function GetLoot() {
    type ChampionShard = any
    type ChampionSkinShard = any
    type ShopToken = any
    type Chest = any

    interface Loot {
        championShards: ChampionShard[];
        championSkinShards: ChampionSkinShard[];
        shopTokens: ShopToken[];
        chests: Chest[];
        blueEssence: number;
    }

    let loot: Loot = {
        championShards: [],
        championSkinShards: [],
        shopTokens: [],
        chests: [],
        blueEssence: 0
    };

    await fetch("/lol-loot/v1/player-loot-map")
        .then(response => response.json())
        .then(data => {
            Object.entries(data).forEach((item: any) => {
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
            error(error);
        });

    return loot;
}

function Sum(items: any, prop: any, propMultiply: any = null) {
    return items.reduce(function (a: any, b: any) {
        let sum = 0;

        if (propMultiply != null)
            sum = a + prop.split('.').reduce((x: any, c: any) => x[c], b) * propMultiply.split('.').reduce((x: any, c: any) => x[c], b);
        else
            sum = a + prop.split('.').reduce((x: any, c: any) => x[c], b);

        return sum;
    }, 0);
}
function AddContextMenu(title: any, subTitle: any, items: any[] = []) {
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

    items.forEach((item: any) => {
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
    CreateChapmsInformation()
    CreateSkinsInformation()
}

function OnClickOpenChestsButton() {
    let contextMenu = document.querySelector('.niice-loot-helper-context-menu');
    if (contextMenu != null)
        return;

    GetLoot().then(async loot => {
        let items: any[] = [];

        loot.chests.forEach(async chest => {
            items.push({
                title: `${await getString("open")}`,
                subTitle: chest.name,
                essenceText: chest.data.count,
                clickEvent: async () => {
                    if (window.confirm(`${await getString("open-chest-prom")} ` + chest.name + '?')) {
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
            title: `${await getString("close")}`,
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
        
        AddContextMenu(`${await getString("materials")}`, `${await getString("open-chest")}`, items);
    });
}

function OnClickBlueEssenceButton() {
    let contextMenu = document.querySelector('.niice-loot-helper-context-menu')
    if (contextMenu != null)
        return;

    GetLoot().then(async loot => {
        let keyMaps = {};
        let alreadyOwned: any[] = [];
        let duplicates: any[] = [];

        loot.championShards.forEach((item: any) => {
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

        let upgradableChampions: any[] = [];
        let championShards: any[] = loot.championShards.sort((a, b) => (a.data.upgradeEssenceValue > b.data.upgradeEssenceValue) ? 1 : ((b.data.upgradeEssenceValue > a.data.upgradeEssenceValue) ? -1 : 0))
        let blueEssence = loot.blueEssence;

        championShards.forEach((item: any) => {
            if (item.data.itemStatus === "FREE" && blueEssence >= item.data.upgradeEssenceValue) {
                upgradableChampions.push(item);
                blueEssence -= item.data.upgradeEssenceValue;
            }
        });

        AddContextMenu(`${await getString("BE")}`, `${await getString("Champ-shards")}`, [
            {
                title: `${await getString("disenchant")}`,
                subTitle: `${await getString("duplicates")}`,
                actionIcon: '/fe/lol-loot/assets/context_menu/disenchant.png',
                essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                essenceText: '+' + Sum(duplicates, 'data.disenchantValue'),
                clickEvent: async () => {
                    if (window.confirm(`${await getString("dis-dup-prom")}`)) {
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
                title: `${await getString("disenchant")}`,
                subTitle: `${await getString("already-owned")}`,
                actionIcon: '/fe/lol-loot/assets/context_menu/disenchant.png',
                essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                essenceText: '+' + Sum(alreadyOwned, 'data.disenchantValue'),
                clickEvent: async () => {
                    if (window.confirm(`${await getString("dis-owned-prom")}`)) {
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
                title: `${await getString("disenchant")}`,
                subTitle: `${await getString("all")}`,
                actionIcon: '/fe/lol-loot/assets/context_menu/disenchant.png',
                essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                essenceText: '+' + Sum(loot.championShards, 'data.disenchantValue'),
                clickEvent: async () => {
                    if (window.confirm(`${await getString("dis-all-prom")}`)) {
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
                title: `${await getString("upgrade")}`,
                subTitle: `${await getString("all")}`,
                actionIcon: '/fe/lol-loot/assets/context_menu/upgrade.png',
                essenceIcon: '/fe/lol-loot/assets/context_menu/currency_champion.png',
                essenceText: '-' + Sum(upgradableChampions, 'data.upgradeEssenceValue'),
                clickEvent: async () => {
                    if (window.confirm(`${await getString("up-all-prom")}`)) {
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
                title: `${await getString("close")}`,
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

function CreateChapmsInformation() {
    let categories = document.querySelectorAll('.display-category-section');

    if (categories == null || categories.length === 0)
        return;

    if (document.querySelector('.loot-category-information') != null)
        return;

    GetLoot().then(async loot => {
        AddElement(categories[1].querySelector(".title-text"), 'span', [
            {
                name: 'style',
                value: 'margin-left: 5px;'
            }
        ], ['loot-category-information'], '(' + loot.championShards.length + " " + await getString("shards") + " | " + await getString("worth") + " " + Sum(loot.championShards, 'data.disenchantValue', 'data.count') + ' <img style="margin-bottom: -4px;" src="/fe/lol-loot/assets/context_menu/currency_champion.png"/>)');
    });
}

function CreateSkinsInformation() {
    let categories = document.querySelectorAll('.display-category-section');

    if (categories == null || categories.length === 0)
        return;

    if (document.querySelector('.loot-category-information') != null)
        return;

    GetLoot().then(async loot => {
        AddElement(categories[2].querySelector(".title-text"), 'span', [
            {
                name: 'style',
                value: 'margin-left: 5px;'
            }
        ], ['loot-category-information'], '(' + loot.championSkinShards.length + " " + await getString("shards") + " | " + await getString("worth") + " " + Sum(loot.championSkinShards, 'data.disenchantValue', 'data.count') + ' <img style="margin-bottom: -4px;" src="/fe/lol-loot/assets/context_menu/currency_cosmetic.png"/>)');
    });
}

export class LootHelper {
    main = () => {
        utils.addStyle(/*css*/`
            @import url("${datapath}assets/styles/components/loothelper.css");
            :root {
                --OC_button:url("${datapath}assets/icon/plugins-icons/button-open-chests.png");
                --BE_button:url("${datapath}assets/icon/plugins-icons/button-blue-essence.png");
                --BE_hover:url("${datapath}assets/icon/plugins-icons/button-blue-essence-hover.png");
                --BE_active:url("${datapath}assets/icon/plugins-icons/button-blue-essence-click.png");
                --rbutton:url("${datapath}assets/icon/plugins-icons/button-refresh.png");
                --rhover:url("${datapath}assets/icon/plugins-icons/button-refresh-hover.png");
                --ractive:url("${datapath}assets/icon/plugins-icons/button-refresh-click.png");
                --OC_hover:url("${datapath}assets/icon/plugins-icons/button-open-chests-hover.png");
                --OC_active:url("${datapath}assets/icon/plugins-icons/button-open-chests-click.png");
            }
        `)
    
        upl.observer.subscribeToElementCreation((".loot-inventory-grid "), (element: any) => {
            log("%cLoot helper loaded", "color: #e4c2b3")
            CreateChapmsInformation()
            CreateSkinsInformation()
        })

        upl.observer.subscribeToElementCreation((".loot-display-category-tabs-container"), (element: any) => {
            CreateRefreshButton();
            CreateOpenChestsButton();
            CreateBlueEssenceButton();
        })

        upl.observer.subscribeToElementCreation(('.loot-tray.ember-view'), (element: any) => {
            element.setAttribute('style', 'margin-top: 0px;');
        })
    }
} 