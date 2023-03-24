import utils from './_utilselaina'
import data from '../configs/ElainaV2_config.json'

let SidebarTransparent = data["Sidebar-Transparent"]

window.addEventListener('load', () => {
    utils.addCss(data["css_file"]);	
	if (SidebarTransparent) {
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Sidebar-Transparent.css");
	}
	else {
		utils.addCss("//plugins/ElainaV2/assets/Css/Addon-Css/Sidebar-Color.css");
	}
})