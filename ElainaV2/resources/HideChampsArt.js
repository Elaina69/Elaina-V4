import utils from './_utilselaina'
import data from '../configs/ElainaV2_config.json'

let HideChampsArt = data["Hide-Champions-Splash-Art"]

if (HideChampsArt) {
    window.addEventListener('load', () => {
        utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Hide-Champs-Splash-Art.css")
    })
}