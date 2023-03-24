import utils from './_utilselaina'
import data from '../configs/ElainaV2_config.json'

let LoadingScr = data["Animate-Loading"]

function Applyloadingscreen() {
    if (LoadingScr) {
        utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Animate-Loading-Screen.css")
    }

    else {
        utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Static-Loading-Screen.css")
    }
}

window.addEventListener('load', () => {
    Applyloadingscreen()
})