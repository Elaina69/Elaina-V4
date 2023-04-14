import utils from './_utilselaina'
import data from '../configs/ElainaV2_config.json'
import wt from './Watermark'

let SidebarTransparent = data["Sidebar-Transparent"]
let CustomIcon = data["Custom-Icon"]

window.addEventListener('load', () => {
    utils.addCss("//plugins/ElainaV2/assets/Css/ElainaV2.css");	
	if (SidebarTransparent) {
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Sidebar-Transparent.css");
	}
	else {
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Sidebar-Color.css");
	}

	if (CustomIcon) {
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/RiotPoint.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/BlueEssence.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/ClashBanner.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/Emblem.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/Rank.css")
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Icon/Ticker.css")
	}
})