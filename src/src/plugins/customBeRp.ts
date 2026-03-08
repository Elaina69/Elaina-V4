export class CustomBeRp {
	private lastRP: string = ""
	private lastBE: string = ""
	private beInitialized: boolean = false

	RP = () => {
		const rpData = `${ElainaData.get("RP-data")}`
		if (rpData === this.lastRP) return

		let RP: Element | null = document.querySelector(".currency-rp-top-up-enabled")
		let RPMac: Element | null = document.querySelector(".currency-rp")
		
		if (RP) {
			RP.innerHTML = rpData
			this.lastRP = rpData
		}
		else if (RPMac) {
			RPMac.innerHTML = rpData
			this.lastRP = rpData
		}
	}

	BE = () => {
		let BE: Element | null = document.querySelector(".currency-be-component.ember-view")
		if (!BE) return

		const beData = `${ElainaData.get("BE")}`

		// Only do the full innerHTML replacement once to set up video elements
		if (!this.beInitialized) {
			BE.innerHTML = /* html */`
				<div class="currency-be-icon-container">
					<div class="currency-be-icon-static"></div>
					<lol-uikit-video type="intro" src="/fe/lol-navigation/add-blue-essence.webm" class="animation-add-blue-essence"></lol-uikit-video>
					<lol-uikit-video type="intro" src="/fe/lol-navigation/remove-blue-essence.webm" class="animation-remove-blue-essence"></lol-uikit-video>
				</div>
				<span class="custom-be-text">${beData}</span>
			`
			this.beInitialized = true
			this.lastBE = beData
		} 
		else if (beData !== this.lastBE) {
			// Only update the text node, not the entire innerHTML with video elements
			const beText = BE.querySelector(".custom-be-text")
			if (beText) {
				beText.textContent = beData
				this.lastBE = beData
			}
		}
	}
}