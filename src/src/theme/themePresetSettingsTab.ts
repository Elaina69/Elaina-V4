/**
 * @author Nomi
 * @description This's just a LL-settings from League Loader, but i change it a little bit for my theme
 */

import { getThemeName } from '../otherThings.ts'

let icdata = (await import(`//plugins/${window.getThemeName()}/config/icons.js`)).default;

let datapath = `//plugins/${window.getThemeName()}/`

function openConfigs() {window.openPluginsFolder(`${getThemeName()}/config`)}
function openAssets() {window.openPluginsFolder(`${getThemeName()}/assets`)}

async function createThemeMenu(root: any) {
	//@ts-ignore
	const { Component, jsx, render } = await import('//esm.run/nano-jsx')
	const version = window.DataStore.get("Theme-version")
	
	let l_reload_client = await getString('reload-client')
	let l_open_assets = await getString('l.open_assets')
	let l_open_configs = await getString('l.open_configs')
	let l_theme_releases = await getString('l.theme_releases')
	let l_open_settings = await getString('l.open_settings')

	class LoaderMenu extends Component {
		visible: any = false; frame: any = null; opener: any = null
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
				<div style="position: absolute; inset: 0px; z-index: 8500" hidden=${!this.visible || undefined}>
					<lol-uikit-full-page-backdrop style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px; background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8) 93%);" />
					<div class="dialog-confirm" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px">
						<lol-uikit-dialog-frame ref=${el => (this.frame = el)} class="dialog-frame" orientation="bottom" close-button="false">
							<div class="dialog-content">
								<lol-uikit-content-block class="app-controls-exit-dialog" type="dialog-medium" style="position: relative; overflow: hidden">
									<div style="position: absolute; top: 60px">
										<img src="${datapath}assets/Icon/Plugins-icons/${icdata["LL_Settings"]}" style="object-fit: cover; width: 290px; transform: scale(2.5); margin-left: 100px; filter: brightness(0.7)">
									</div>
									</div>
									<div style="position: relative">
										<div style="margin-bottom: 24px"> 
											<h4 style="padding: 6px 0">Elaina-V4</h4>
											<p>v${version}</p>
										</div>
										<hr class="heading-spacer" />
										<div style="display: flex; flex-direction: column; align-items: center; gap: 12px">
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 250px" onClick=${() => window.restartClient()}>
												${l_reload_client} (Ctrl-Shift-R)
											</lol-uikit-flat-button-secondary>
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 250px" onClick=${() => openAssets()}>
												${l_open_assets}
											</lol-uikit-flat-button-secondary>
											<lol-uikit-flat-button-secondary style="display:inline-block; width: 250px" onClick=${() => openConfigs()}>
												${l_open_configs}
											</lol-uikit-flat-button-secondary>
										</div>
										<hr class="heading-spacer" />
										<p style="padding: 20px 0" class="lol-settings-code-of-conduct-link lol-settings-window-size-text">
											<a href="https://github.com/Elaina69/Elaina-V4/releases" target="_blank">${l_theme_releases}</a>
										</p>
									</div>
								</lol-uikit-content-block>
							</div>
							<lol-uikit-flat-button-group type="dialog-frame">
								<lol-uikit-flat-button tabindex="1" class="button-accept" onClick=${() => this.showDefaultSettings()}>${l_open_settings}</lol-uikit-flat-button>
							</lol-uikit-flat-button-group>
						</lol-uikit-dialog-frame>
					</div>
				</div>
			`
		}
	}
	render(jsx`<${LoaderMenu} />`, root)
}

window.addEventListener("load",async ()=> {
	const manager: any = () => document.getElementById('lol-uikit-layer-manager-wrapper')
	const root    = document.createElement('div')
	if (window.DataStore.get("Old-League-Loader-Settings")) {
		while (!manager()) await new Promise(r => setTimeout(r, 300))
		await createThemeMenu(root)
		manager().prepend(root)
	}
})