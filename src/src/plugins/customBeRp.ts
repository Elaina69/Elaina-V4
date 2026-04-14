/**
 * Displays custom Blue Essence and Riot Points values in the client.
 * @wiki Displays custom Blue Essence (BE) and Riot Points (RP) values in the client, replacing the real currency amounts with user-defined numbers.
 * @author Elaina Da Catto
 * @usage
 * 1. Open League Client settings
 * 2. Navigate to **Elaina Theme** → **Plugin Settings**
 * 3. Set **RP Data** and **BE** values to display your desired currency amounts
 * @settings RP-data, BE
 */
export class CustomBeRp {
	RP = () => {
		const rpData = `${ElainaData.get("RP-data")}`

		let RP: Element | null = document.querySelector(".currency-rp-top-up-enabled")
		let RPMac: Element | null = document.querySelector(".currency-rp")
		
		if (RP) {
			RP.innerHTML = rpData
		}
		else if (RPMac) {
			RPMac.innerHTML = rpData
		}
	}

	BE = () => {
		let BE: Element | null = document.querySelector(".currency-be-component.ember-view")
		if (!BE) return

		BE.innerHTML = /* html */`
			<div class="currency-be-icon-container">
				<div class="currency-be-icon-static"></div>
				<lol-uikit-video type="intro" src="/fe/lol-navigation/add-blue-essence.webm" class="animation-add-blue-essence"></lol-uikit-video>
				<lol-uikit-video type="intro" src="/fe/lol-navigation/remove-blue-essence.webm" class="animation-remove-blue-essence"></lol-uikit-video>
			</div>
			${ElainaData.get("BE")}
		`
	}
}