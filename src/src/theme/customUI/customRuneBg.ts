import * as upl from 'pengu-upl';
import { getThemeName } from "../../otherThings"

const filters = (await import(`//plugins/${getThemeName()}/config/filters.js`)).default;

export class CustomRunesBackground {
    removeOtherImage = () => {
        let remove = (element: any) => {element.remove()}

        upl.observer.subscribeToElementCreation('.aux', remove)
        upl.observer.subscribeToElementCreation('#splash', remove)
        upl.observer.subscribeToElementCreation('#construct', remove)
        upl.observer.subscribeToElementCreation('#keystone', remove)
    }

    changeRunesBackground = () => {
        upl.observer.subscribeToElementCreation('.perks-construct-minspec', (element: any) => {
            window.setInterval(()=>{
                element.style.cssText = `
                    top: 0px; 
                    left: 0px; 
                    filter: ${filters["Runes"]}; 
                    background-image: var(--pri${element.getAttribute('primary')})
                `
            },100)
        })
    }
}