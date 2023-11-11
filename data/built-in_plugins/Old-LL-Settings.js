import {openAssets, openConfigs, getPluginsName} from "../openFolder.js"
import LocalKey from "../UpdateKey-Local.js"

let lang,thisVersion,CdnKey
let datapath = new URL("..", import.meta.url).href

try {
	if (DataStore.get("Dev-mode")) {
		let res = await fetch(`//plugins/${getPluginsName()}/ElainaV3-Data/data/configs/UpdateKey-CDN.js`)
		if (res.status == 200) {
			CdnKey = (await (() => import(`//plugins/${getPluginsName()}/ElainaV3-Data/data/configs/UpdateKey-CDN.js`))()).default
		}
	}
	else {
		let res = await fetch("https://unpkg.com/elainav3-data@latest/data/configs/UpdateKey-CDN.js")
		if (res.status == 200) {
			CdnKey = (await (() => import("https://unpkg.com/elainav3-data@latest/data/configs/UpdateKey-CDN.js"))()).default
		}
	}

	if (CdnKey == LocalKey) {
		let res = await fetch("https://unpkg.com/elainav3-data@latest/data/configs/Version.js")
		if (res.status == 200) {
			thisVersion = (await (() => import("https://unpkg.com/elainav3-data@latest/data/configs/Version.js"))()).default
			DataStore.set("Theme-version", thisVersion)
		}
	}
}
catch{console.warn(`File doesn't exist`)}

try  {
	if (DataStore.get("Dev-mode")) {
		let res = await fetch(`//plugins/${getPluginsName()}/ElainaV3-Data/data/configs/Language.js`)
		if (res.status == 200) {
			lang = (await (() => import(`//plugins/${getPluginsName()}/ElainaV3-Data/data/configs/Language.js`))()).default
		}
	}
	else {
		let res = await fetch("https://unpkg.com/elainav3-data@latest/data/configs/Language.js")
		if (res.status == 200) {
			lang = (await (() => import("https://unpkg.com/elainav3-data@latest/data/configs/Language.js"))()).default
		}
	}
}
catch{console.warn(`File doesn't exist`)}

async function createLoaderMenu(root) {
	const { Component, jsx, render } = await import('//esm.run/nano-jsx')
	const langCode = document.querySelector("html").lang;
	const langMap = lang.langlist
	const version = DataStore.get("Theme-version")
	const _t = lang[langMap[langCode] || "EN"];
	
	class LoaderMenu extends Component {
		visible = false; frame = null; opener = null
		didMount() {
			this.opener = document.querySelector('div[action=settings]')
			this.opener.addEventListener('click', e => {
				if (!this.visible) {
					e.stopImmediatePropagation()
					this.show(true)
				}
			})
		}
		show(on) {
			this.visible = on
			this.update()
			if (this.visible) {
				this.frame.shadowRoot.querySelector('lol-uikit-close-button')
					?.addEventListener('click', () => this.show(false))
			}
		}
		showDefaultSettings() {
			this.opener.click()
			this.show(false)
		}
		render() {
			return jsx/*html*/`
				<div class="modal" style="position: absolute; inset: 0px; z-index: 8500" hidden=${!this.visible || undefined}>
					<lol-uikit-full-page-backdrop class="backdrop" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px" />
					<div class="dialog-confirm" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px">
						<lol-uikit-dialog-frame ref=${el => (this.frame = el)} class="dialog-frame" orientation="bottom" close-button="false">
							<div class="dialog-content">
								<lol-uikit-content-block class="app-controls-exit-dialog" type="dialog-medium" style="position: relative; overflow: hidden">
									<div style="position: absolute; top: 60px">
										<img src="${datapath}assets/Icon/Plugins-icons/LL-Settings.jpg" style="object-fit: cover; width: 290px; transform: scale(2.5); margin-left: 100px; filter: brightness(0.7)">
									</div>
									</div>
									<div style="position: relative">
										<div style="margin-bottom: 24px"> 
											<h4 style="padding: 6px 0">Elaina-V3</h4>
											<p>v${version}</p>
										</div>
										<hr class="heading-spacer" />
										<div style="display: flex; flex-direction: column; align-items: center; gap: 12px">
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 250px" onClick=${() => window.restartClient()}>
												${_t['l.reload_client']} (Ctrl-Shift-R)
											</lol-uikit-flat-button-secondary>
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 250px" onClick=${() => openAssets()}>
												${_t['l.open_assets']}
											</lol-uikit-flat-button-secondary>
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 250px" onClick=${() => openConfigs()}>
												${_t['l.open_configs']}
											</lol-uikit-flat-button-secondary>
										</div>
										<hr class="heading-spacer" />
										<p style="padding: 20px 0" class="lol-settings-code-of-conduct-link lol-settings-window-size-text">
											<a href="https://github.com/Elaina69/Elaina-V3/releases" target="_blank">${_t['l.theme_releases']}</a>
										</p>
									</div>
								</lol-uikit-content-block>
							</div>
							<lol-uikit-flat-button-group type="dialog-frame">
								<lol-uikit-flat-button tabindex="1" class="button-accept" onClick=${() => this.showDefaultSettings()}>${_t['l.open_settings']}</lol-uikit-flat-button>
							</lol-uikit-flat-button-group>
						</lol-uikit-dialog-frame>
					</div>
				</div>
			`
		}
	}
	render(jsx`<${LoaderMenu} />`, root)
}

window.addEventListener("load", async ()=> {
    const manager = () => document.getElementById('lol-uikit-layer-manager-wrapper')
	const root    = document.createElement('div')
	if (DataStore.get("Old-League-Loader-Settings")) {
		while (!manager()) await new Promise(r => setTimeout(r, 300))
		await createLoaderMenu(root)
		manager().prepend(root)
	}
})