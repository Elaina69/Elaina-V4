import * as observer from "../utils/observer.ts"

let filters = (await import(`//plugins/${window.getThemeName()}/config/filters.js`)).default;
let icdata = (await import(`//plugins/${window.getThemeName()}/config/icons.js`)).default;

let datapath = `//plugins/${window.getThemeName()}/`
let iconFolder  = `${datapath}assets/icon/`

//For observer
function freezeProperties(object: Object, properties: any[]) {
	for (const type in object) {
		if ((properties && properties.length && properties.includes(type)) || (!properties || !properties.length)) {
			let value = object[type]
			try {
				Object.defineProperty(object, type, {
					configurable: false,
					get: () => value,
					set: (v) => v,
				})
			}catch {}
		}
	}
}

export function transparentLobby(context: any) {
	context.socket.observe('/lol-gameflow/v1/gameflow-phase',async (data: Object) => {
		if(data["data"]=="Matchmaking") {
			let a: any = document.getElementsByClassName("placeholder-invited-container")
			for (let i =0; i< a.length; i++) {
				let div = document.createElement("div")
				div.classList.add("placeholder-invited-image")
				a[i].querySelector(".placeholder-invited-video").remove()
				a[i].append(div)
			}
		}
	})
}

//observer.subscribeToElementCreation(".summoner-xp-radial", (element: any)=> {element.remove()})

observer.subscribeToElementCreation("lol-uikit-parallax-background",(element: any)=> {
	element.shadowRoot.querySelector(".parallax-layer-container").style.backgroundImage = ''
})	

if (window.DataStore.get("aram-only")) {
	function removeNode(obj: string): void {
		try {document.querySelector(obj)?.remove()}catch{}
	}
 	let interval: number

 	observer.subscribeToElementCreation(".parties-game-type-select-wrapper",(element: any)=>{
 		element.querySelector('div[data-game-mode=ARAM] div[class=parties-game-type-upper-half]').click()
			
		removeNode("div[data-game-mode='CLASSIC']")
		removeNode("div[data-game-mode='TFT']")
		removeNode("lol-uikit-navigation-item[data-category='VersusAi']")
		removeNode("lol-uikit-navigation-item[data-category='Training']")
		removeNode("div[data-game-mode='CHERRY']")
	})
	observer.subscribeToElementCreation(".parties-custom-game-subcategory-select",(element: any)=>{
		removeNode('div[data-map-id="11"]')
		element.querySelector('div[data-map-id="12"] > div').click()
	})
	observer.subscribeToElementCreation(".custom-game-list-body",(element: any)=>{
		interval = window.setInterval(()=> {
			let list = element.querySelectorAll("lol-uikit-scrollable > tbody > tr")
			for (let i=0;i< list.length;i++) {
				if (list[i].querySelector("td.custom-game-list-table-body-map").innerText == "Summoner's Rift") {
					list[i].remove()
				}
			}
		},100)
	})
	observer.subscribeToElementDeletion(".custom-game-list-body",(element: any)=>{
		window.clearInterval(interval)
	})
}

if (window.DataStore.get("Custom-Rank-Name")) {
	observer.subscribeToElementCreation(".style-profile-emblems-container", (element: any)=>{
		element.querySelector(".style-profile-ranked-component.ember-view .style-profile-emblem-header-title").innerHTML = window.DataStore.get("Rank-line1")
		element.querySelector(".style-profile-emblem-subheader-ranked > div").innerHTML = window.DataStore.get("Rank-line2")
	})
}

if (window.DataStore.get("Runes-BG")) {
	let style = (element: any) => {element.remove()}
	observer.subscribeToElementCreation('.aux', style)
	observer.subscribeToElementCreation('#splash', style)
	observer.subscribeToElementCreation('#construct', style)
	observer.subscribeToElementCreation('#keystone', style)
	observer.subscribeToElementCreation('.perks-construct-minspec', (element: any) => {
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

if (window.DataStore.get("new-gamesearch-queue")) {
	function DisplayNone(element: HTMLElement) {
		element.style.display = 'none'
	}

	observer.subscribeToElementCreation('lol-parties-game-search', (element: any) => {
		element.shadowRoot.querySelector("div").style.cssText = `
			border: 1px solid #8c8263; 
			border-radius: 10px; 
			margin-top: 1px
		`
	})
	observer.subscribeToElementCreation('.parties-status-card-body', (element: any) => {
		element.style.cssText = `
			margin-top: -23px; 
			padding: 10px 5px 10px 10px; 
			border: 1px solid #8c8263; 
			border-radius: 10px
		`
	})
	observer.subscribeToElementCreation('.parties-status-card-header', (element: any) => {
		element.style.cssText = `
			visibility: hidden;
			height: 14px;
		`
	})
	observer.subscribeToElementCreation('.parties-status-card-map', (element: any) => {
		element.style.margin = '-3px 10px 0 0'
	})
	observer.subscribeToElementCreation('.parties-status-card', (element: any) => {
		element.style.background = 'transparent'
	})
	observer.subscribeToElementCreation('.parties-game-invite-heading-text', (element: any) => {
		element.hidden = true
	})
	observer.subscribeToElementCreation('.parties-game-search-header', (element: any) => {
		element.style.cssText = `height: 28px;`
	})
	observer.subscribeToElementCreation('.parties-game-search-divider', DisplayNone)
	observer.subscribeToElementCreation('.parties-game-info-panel-bg-container', DisplayNone)
	observer.subscribeToElementCreation('.parties-status-card-bg-container', DisplayNone)
	observer.subscribeToElementCreation('lol-parties-game-info-panel', (element: any) => {
		// element.shadowRoot.querySelector("lol-parties-game-invites").shadowRoot.querySelector(".parties-game-info-panel-invites").style.cssText = `
		// 	border: 1px solid #8c8263; 
		// 	border-radius: 10px; 
		// 	margin-top: 1px
		// `
		element.shadowRoot.querySelector('.parties-game-info-panel-bg-container').hidden = true
	})
}

if (window.DataStore.get("settings-dialogs-transparent")) {
	let style = "var(--Settings-and-Dialog-frame-color)"
	observer.subscribeToElementCreation("lol-uikit-full-page-backdrop",(element: any)=>{
		try{
			let a = element.querySelector("lol-uikit-dialog-frame").shadowRoot.querySelector("div")
			a.style.background = style
			freezeProperties(a.style,["background"])
		}catch{}
		try{
			let b = element.querySelector("lol-uikit-dialog-frame > div")
			b.style.background = style
			freezeProperties(b.style,["background"])
		}catch{}
		try{
			let c = element.querySelector("lol-regalia-identity-customizer-element").shadowRoot.querySelector("lol-regalia-banner-v2-element")
			c.remove()
		}catch{}
		try{
			let obj: any = document.querySelector('.lol-settings-container')
			let a = obj.shadowRoot.querySelector("div")
			obj.style.background = style
			a.style.background = style
			freezeProperties(obj.style,["background"])
			freezeProperties(a.style,["background"])
		}catch{}
		try{
			let a: any = document.getElementsByClassName("dialog-frame")
			for(let i = 0; i< a.length; i++) {
				let b = a[i].shadowRoot.querySelector("div")
				b.style.background = style
			}
		}catch{}
	})
}

if (window.DataStore.get("Custom-Icon")) {
	observer.subscribeToElementCreation("lol-uikit-flyout-frame",(element: any)=>{
		function tickerCss(defaults: any) {
			Object.entries(defaults).forEach(([key, value]) => {
				element.shadowRoot.querySelector(key).style.cssText = value
			});
		}
		tickerCss(
			{
				".border": "display: none;",
				".sub-border": "display: none;",
				".caret": "display: none;",
				".lol-uikit-flyout-frame": "background-color: black; border-radius: 10px;"
			}
		)
	})
	if (window.DataStore.get("Custom-Avatar")) {
		observer.subscribeToElementCreation(".hover-card-info-container",(element: any)=>{
			element.style.background = "#1a1c21"
		})
		observer.subscribeToElementCreation("#lol-uikit-tooltip-root",(element: any)=>{
			try{
				let a = element.querySelector(`lol-regalia-hovercard-v2-element[summoner-id="${window.DataStore.get("Summoner-ID")}"]`).shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector(".lol-regalia-summoner-icon")
				a.style.backgroundImage = "var(--Avatar)"
				freezeProperties(a.style, ['backgroundImage'])
			}catch{}
		})
		observer.subscribeToElementCreation("lol-regalia-identity-customizer-element",(element: any)=>{
			let a = element.shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector(".lol-regalia-summoner-icon")
			a.style.backgroundImage = "var(--Avatar)"
			freezeProperties(a.style, ['backgroundImage'])
		})
		observer.subscribeToElementCreation("lol-regalia-parties-v2-element",(element: any)=>{
			if (element.getAttribute("summoner-id") == window.DataStore.get("Summoner-ID")) {
				let a = element.shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector(".lol-regalia-summoner-icon")
				a.style.backgroundImage = "var(--Avatar)"
				freezeProperties(a.style, ['backgroundImage'])
			}
		})
		observer.subscribeToElementCreation('lol-regalia-profile-v2-element', (element: any) => {
			let a = element.shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector(".lol-regalia-summoner-icon")
			a.style.backgroundImage = 'var(--Avatar)'
			freezeProperties(a.style, ['backgroundImage'])
		})
	}
	if (window.DataStore.get("Custom-Border")) {
		observer.subscribeToElementCreation("#lol-uikit-tooltip-root",(element: any)=>{
			try{
				let a = element.querySelector(`lol-regalia-hovercard-v2-element[summoner-id="${window.DataStore.get("Summoner-ID")}"]`).shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("lol-uikit-themed-level-ring-v2").shadowRoot.
				querySelector("div")
				a.style.backgroundImage = "var(--Border)"
				freezeProperties(a.style, ['backgroundImage'])
			}catch{}
		})
		observer.subscribeToElementCreation("lol-regalia-parties-v2-element",(element: any)=>{
			if (element.getAttribute("summoner-id") == window.DataStore.get("Summoner-ID")) {
				let a = element.shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("lol-uikit-themed-level-ring-v2").shadowRoot.querySelector("div")
				a.style.backgroundImage = "var(--Border)"
				freezeProperties(a.style, ['backgroundImage'])
			}
		})
		observer.subscribeToElementCreation("lol-regalia-identity-customizer-element",(element: any)=>{
			let a = element.shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("lol-uikit-themed-level-ring-v2").shadowRoot.querySelector("div")
			a.style.backgroundImage = "var(--Border)"
			freezeProperties(a.style, ['backgroundImage'])
		})
		observer.subscribeToElementCreation('lol-regalia-profile-v2-element', (element: any) => {
			let a = element.shadowRoot.querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("lol-uikit-themed-level-ring-v2").shadowRoot.querySelector("div")
			a.style.backgroundImage = "var(--Border)"
			freezeProperties(a.style, ['backgroundImage'])
		})
	}
	if (window.DataStore.get("Custom-Regalia-Banner")) {
		let banner = `${iconFolder}Regalia-Banners/`
		let bannerInterval: any
		observer.subscribeToElementCreation("lol-regalia-parties-v2-element",(element: any)=>{
			let a: any = document.querySelector(".lobby-banner.local > lol-regalia-parties-v2-element")?.shadowRoot?.querySelector("lol-regalia-banner-v2-element")?.shadowRoot?.querySelector("uikit-state-machine > div:nth-child(2) > img")
			bannerInterval = window.setInterval(()=>{
				if (a.src != banner+window.DataStore.get("CurrentBanner")){
					a.src = banner+window.DataStore.get("CurrentBanner")
				}
			},1000)
		})
		observer.subscribeToElementDeletion("lol-regalia-parties-v2-element",(element: any)=>{
			window.clearInterval(bannerInterval)
		})
		observer.subscribeToElementCreation("lol-regalia-identity-customizer-element",(element: any)=>{
			let a = element.shadowRoot.querySelector("lol-regalia-banner-v2-element").shadowRoot.querySelector("uikit-state-machine > div:nth-child(2) > img")
			a.src = banner+window.DataStore.get("CurrentBanner")
			freezeProperties(a,["src"])
		})
		observer.subscribeToElementCreation("lol-regalia-profile-v2-element",(element: any)=>{
			let a = element.shadowRoot.querySelector("lol-regalia-banner-v2-element").shadowRoot.querySelector("uikit-state-machine > div:nth-child(2) > img")
			bannerInterval = window.setInterval(()=>{
				if (a.src != banner+window.DataStore.get("CurrentBanner")){
					a.src = banner+window.DataStore.get("CurrentBanner")
				}
			},1000)
		})
		observer.subscribeToElementDeletion("lol-regalia-profile-v2-element",(element: any)=>{
			window.clearInterval(bannerInterval)
		})
	}
	if (window.DataStore.get("Custom-Hover-card-backdrop")) {
		observer.subscribeToElementCreation("#lol-uikit-tooltip-root",(element: any)=>{
			try {
				if (element.querySelector("lol-regalia-hovercard-v2-element").getAttribute("summoner-id") == window.DataStore.get("Summoner-ID")) {
					let hoverCard: any = document.querySelector("#hover-card-backdrop")
					hoverCard.style.backgroundImage = "var(--Hover-card-backdrop)"
				}
			}catch{}
		})
	}
	if (window.DataStore.get('Custom-Gamemode-Icon')) {
		observer.subscribeToElementCreation("lol-uikit-video-group",(element: any)=>{
			function gameModeIcon_active(obj: any, name: any) {
				try {
					let a: any = document.querySelector(`${obj} lol-uikit-video-state[state='active'] lol-uikit-video`)
					a.setAttribute("src", `${iconFolder}gamemodes/${name}`)
					a.querySelector("video").setAttribute("src", `${iconFolder}gamemodes/${name}`)
				}catch{}
			}
			gameModeIcon_active("div[data-game-mode='CLASSIC']",icdata["classic_video"])
			gameModeIcon_active("div[data-game-mode='TFT']", icdata["tft_video"])
			gameModeIcon_active("div[data-game-mode='ARAM']", icdata["aram_video"])
			gameModeIcon_active("div[data-game-mode='CHERRY']",icdata["cherry_video"])
			gameModeIcon_active('div[data-map-id="11"]',icdata["classic_video"])
			gameModeIcon_active('div[data-map-id="12"]',icdata["aram_video"])
		})
	}
}
//observer.subscribeToElementCreation("",(element: any)=>{})