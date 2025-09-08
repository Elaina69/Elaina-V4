import * as upl from 'pengu-upl'
import { error } from '../../utils/themeLog';

export class AramOnlyMode {
    /**
     * Removes a DOM node if it exists.
     * @param obj The selector for the DOM node to remove.
     */
    removeNode(obj: string): void {
        try { 
            // If the element exists, remove it
            document.querySelector(obj)?.remove() 
        }
        catch (err: any) { error(`Can not remove ${obj}:`, err)}
    }

    /**
     * Removes other gamemodes from the UI.
     */
    removeOtherGamemode = () => {
        upl.observer.subscribeToElementCreation(".parties-game-type-select-wrapper",(element: any)=>{
            // Click on Aram mode right after click on Play button
            element.querySelector('div[data-game-mode=ARAM] div[class=parties-game-type-upper-half]').click()

            // Remove other gamemode s' elements
           this.removeNode("div[data-game-mode='CLASSIC']")
           this.removeNode("div[data-game-mode='TFT']")
           this.removeNode("lol-uikit-navigation-item[data-category='VersusAi']")
           this.removeNode("lol-uikit-navigation-item[data-category='Training']")
           this.removeNode("div[data-game-mode='CHERRY']")
        })

        upl.observer.subscribeToElementCreation('div[data-map-id="12"] > div',(element: any)=>{
            // Click on Aram mode right after click on custom game
            element.click()

            // Remove SR map
            this.removeNode('div[data-map-id="11"]')
        })
    }

    /**
     * Removes other custom gamemodes created by other players from the UI.
     */
    removeOtherCustomGamemode = () => {
        let interval: number

        upl.observer.subscribeToElementCreation(".custom-game-list-body",(element: any)=>{
            interval = window.setInterval(()=> {
                // Get all custom game elements
                let list = element.querySelectorAll("lol-uikit-scrollable > tbody > tr")
                for (let i = 0; i < list.length; i++) {
                    if (list[i].querySelector("td.custom-game-list-table-body-map").innerText == "Summoner's Rift") {
                        // Remove all custom SR map
                        list[i].remove()
                    }
                }
            },100)
        })

        upl.observer.subscribeToElementDeletion(".custom-game-list-body", () => {
            // Clear interval if not in custom game list
            window.clearInterval(interval)
        })
    }
}