import data from '../configs/ElainaV2_config.json'
import utils from './_utilselaina';


let default_settings = data
let patcher_go_to_default_home_page = true;



//___________________________________________________________________________//
function create_element(tagName, className, content) {
	const el = document.createElement(tagName);
	el.className = className;
	if (content) {
		el.innerHTML = content;
	}
	return el;
};

function go_to_default_home_page() {
	if (default_settings["default_home_page"]) {
		document.querySelector(`lol-uikit-navigation-item[item-id='${default_settings["default_home_page"]}']`).click()
	}
}

function add_elaina_home_page() {
	let lol_home = document.querySelector(".rcp-fe-lol-home > lol-uikit-section-controller")

	if (lol_home) {
		if (!lol_home.querySelector("[section-id='elaina-home']")) {
			let elaina_home = create_element("lol-uikit-section", "")
			let div = create_element("div", "wrapper")

			div.id = "elaina-home"
			elaina_home.setAttribute("section-id", "elaina-home")
			elaina_home.append(div)
			lol_home.prepend(elaina_home)
		}
	}
}

function add_elaina_home_navbar() {
	let navbar = document.querySelector(".rcp-fe-lol-home > lol-uikit-navigation-bar")

	if (navbar) {
		if (!navbar.querySelector("[item-id='elaina-home']")) {
			let elaina_home_navbar_item = create_element("lol-uikit-navigation-item", "")

			elaina_home_navbar_item.setAttribute("item-id", "elaina-home")
			elaina_home_navbar_item.setAttribute("priority", 1)
			elaina_home_navbar_item.textContent = "Home"
			navbar.prepend(elaina_home_navbar_item)
		}
	}
}

function patch_default_home_page(){
	let loop = 0
	let intervalId = window.setInterval(() => {
		if (loop >= 5) {
			window.clearInterval(intervalId)
		}
		go_to_default_home_page()
		loop += 1
	}, 300)
}
//___________________________________________________________________________//

let CreateHome = (node) => {
	let previous_page;
	let pagename;
		pagename = node.getAttribute("data-screen-name")

	if (pagename == "rcp-fe-lol-home-main") {
		add_elaina_home_page()
		add_elaina_home_navbar()
		go_to_default_home_page()
		if (previous_page == "rcp-fe-lol-parties" ){
			patch_default_home_page()
		}
	}

	if (pagename == "social") {
		if (patcher_go_to_default_home_page){
			go_to_default_home_page()
			patcher_go_to_default_home_page = false
		}
	}

	if (previous_page != pagename)
		previous_page = pagename
}

window.addEventListener('load', () => {
	utils.mutationObserverAddCallback(CreateHome, ["screen-root"])
})
//___________________________________________________________________________//

//___________________________________________________________________________//

