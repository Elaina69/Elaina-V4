window.addEventListener('load', ()=> {
	window.setInterval(()=> {
		let BE = document.querySelector(".currency-be-component.ember-view")
		let RP = document.querySelector(".currency-rp-top-up-enabled")
		if (DataStore.get("Custom_RP") && RP) {
			RP.innerHTML = `${DataStore.get("RP-data")}`
		}
		if (DataStore.get("Custom_BE") && BE) {
			BE.innerHTML = /* html */`
				<div class="currency-be-icon-container">
					<div class="currency-be-icon-static"></div>
					<lol-uikit-video type="intro" src="/fe/lol-navigation/add-blue-essence.webm" class="animation-add-blue-essence"></lol-uikit-video>
					<lol-uikit-video type="intro" src="/fe/lol-navigation/remove-blue-essence.webm" class="animation-remove-blue-essence"></lol-uikit-video>
				</div>
				${DataStore.get("BE")}
			`
		}
	},500)
})