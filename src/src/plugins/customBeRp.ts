export class CustomBeRp {
	change = (callback: any) => {
		window.setInterval(() => {
			callback
		},500)
	}

	RP = () => {
		this.change(() => {
			let RP: Element | null = document.querySelector(".currency-rp-top-up-enabled") || document.querySelector(".currency-rp")
			
			if (RP) {
				RP.innerHTML = `${window.DataStore.get("RP-data")}`
			}
		})
	}

	BE = () => {
		this.change(() => {
			let BE: Element | null = document.querySelector(".currency-be-component.ember-view")
			
			if (BE) {
				BE.innerHTML = /* html */`
					<div class="currency-be-icon-container">
						<div class="currency-be-icon-static"></div>
						<lol-uikit-video type="intro" src="/fe/lol-navigation/add-blue-essence.webm" class="animation-add-blue-essence"></lol-uikit-video>
						<lol-uikit-video type="intro" src="/fe/lol-navigation/remove-blue-essence.webm" class="animation-remove-blue-essence"></lol-uikit-video>
					</div>
					${window.DataStore.get("BE")}
				`
			}
		})
	}
}