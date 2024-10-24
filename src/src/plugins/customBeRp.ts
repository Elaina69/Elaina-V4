window.addEventListener('load', ()=> {
	window.setInterval(()=> {
		let BE: Element | null = document.querySelector(".currency-be-component.ember-view")
		let RP: Element | null = document.querySelector(".currency-rp-top-up-enabled")
		if (window.DataStore.get("Custom_RP") && RP) {
			RP.innerHTML = `${window.DataStore.get("RP-data")}`
		}
		if (window.DataStore.get("Custom_BE") && BE) {
			BE.innerHTML = /* html */`
				<div class="currency-be-icon-container">
					<div class="currency-be-icon-static"></div>
					<lol-uikit-video type="intro" src="/fe/lol-navigation/add-blue-essence.webm" class="animation-add-blue-essence"></lol-uikit-video>
					<lol-uikit-video type="intro" src="/fe/lol-navigation/remove-blue-essence.webm" class="animation-remove-blue-essence"></lol-uikit-video>
				</div>
				${window.DataStore.get("BE")}
			`
		}
	},500)
})