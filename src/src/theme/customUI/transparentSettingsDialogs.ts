import utils from '../../utils/utils.ts'
import * as upl from 'pengu-upl';

export class TransparentSettingsDialogs {
	applyStyle = () => {
		const style = "var(--Settings-and-Dialog-frame-color)"
		upl.observer.subscribeToElementCreation("lol-uikit-full-page-backdrop",(element: any)=>{
			// Dialogs
			try{
				let a = element.querySelector("lol-uikit-dialog-frame").shadowRoot.querySelector("div")
				a.style.background = style
				utils.freezeProperties(a.style,["background"])
			}
			catch{}
			try{
				let b = element.querySelector("lol-uikit-dialog-frame > div")
				b.style.background = style
				utils.freezeProperties(b.style,["background"])
			}
			catch{}
			try{
				let a: any = document.getElementsByClassName("dialog-frame")
				for(let i = 0; i< a.length; i++) {
					let b = a[i].shadowRoot.querySelector("div")
					b.style.background = style
				}
			}
			catch{}
			try{
				let c = element.querySelector("lol-regalia-identity-customizer-element").shadowRoot.querySelector("lol-regalia-banner-v2-element")
				c.remove()
			}
			catch{}

			// Settings
			try{
				let obj: any = document.querySelector('.lol-settings-container')
				let a = obj.shadowRoot.querySelector("div")
				obj.style.background = style
				a.style.background = style
				utils.freezeProperties(obj.style,["background"])
				utils.freezeProperties(a.style,["background"])
			}
			catch{}
			
		})
	}
}