import * as upl from 'pengu-upl'
import { error } from '../../utils/themeLog';

export class AramOnlyMode {
    removeNode(obj: string): void {
        try { document.querySelector(obj)?.remove() }
        catch (err: any) { error(`Can not remove ${obj}:`, err)}
    }

    removeOtherGamemode = () => {
        upl.observer.subscribeToElementCreation(".parties-game-type-select-wrapper",(element: any)=>{
            element.querySelector('div[data-game-mode=ARAM] div[class=parties-game-type-upper-half]').click()
               
           this.removeNode("div[data-game-mode='CLASSIC']")
           this.removeNode("div[data-game-mode='TFT']")
           this.removeNode("lol-uikit-navigation-item[data-category='VersusAi']")
           this.removeNode("lol-uikit-navigation-item[data-category='Training']")
           this.removeNode("div[data-game-mode='CHERRY']")
       })
       upl.observer.subscribeToElementCreation('div[data-map-id="12"] > div',(element: any)=>{
           element.click()
           this.removeNode('div[data-map-id="11"]')
       })
    }

    removeOtherCustomGamemode = () => {
        let interval: number

        upl.observer.subscribeToElementCreation(".custom-game-list-body",(element: any)=>{
            interval = window.setInterval(()=> {
                let list = element.querySelectorAll("lol-uikit-scrollable > tbody > tr")
                for (let i=0;i< list.length;i++) {
                    if (list[i].querySelector("td.custom-game-list-table-body-map").innerText == "Summoner's Rift") {
                        list[i].remove()
                    }
                }
            },100)
        })
        upl.observer.subscribeToElementDeletion(".custom-game-list-body", () => {
            window.clearInterval(interval)
        })
    }
}