import lang from '../configs/Language.json'

var module = { exports: {} }
const UI = {
   Row: (childs) => {
      const row = document.createElement('div')
      row.classList.add('lol-settings-general-row')
      if (Array.isArray(childs)) childs.forEach((el) => row.appendChild(el))
      return row
   },
   Label: (text) => {
      const label = document.createElement('p')
      label.classList.add('lol-settings-window-size-text')
      label.innerText = text
      return label
   },
   Link: (text, href, onClick) => {
      const link = document.createElement('p')
      link.classList.add('lol-settings-code-of-conduct-link')
      link.classList.add('lol-settings-window-size-text')

      const a = document.createElement('a')
      a.innerText = text
      a.target = '_blank'
      a.href = href
      a.onclick = onClick || null

      link.append(a)
      return link
   },
   Button: (text, cls, onClk) => {
      const btn = document.createElement('lol-uikit-flat-button-secondary')
      btn.innerText = text
      btn.onclick = onClk
      btn.style.display = 'flex'
      btn.setAttribute('class', cls)
      return btn
   },
   Input: (placeholder, onChange) => {
      const origIn = document.createElement('lol-uikit-flat-input')
      const searchbox = document.createElement('input')

      origIn.style.marginBottom = '12px'

      searchbox.type = 'url'
      searchbox.placeholder = placeholder
      searchbox.style.width = '200px'
      searchbox.name = 'name'
      searchbox.oninput = onChange

      let input = {
         get value() {
            return searchbox.value
         },
      }
      module.exports.search = () => input
      origIn.appendChild(searchbox)
      return origIn
   },
   CheckBox: (text, ID, boxID, check) => {
      const origin = document.createElement("lol-uikit-flat-checkbox")
      const checkbox = document.createElement("input")
      const label = document.createElement("label")

      origin.setAttribute("class",'')
      origin.id = ID

      checkbox.type = "checkbox"
      checkbox.id = boxID
      checkbox.onclick = check
      checkbox.setAttribute("slot", "input")

      label.innerHTML = text
      label.setAttribute("slot", "label")

      origin.appendChild(checkbox)
      origin.appendChild(label)

      return origin
   },
   Slider: (text, value, target, setValue) => {
      const div        = document.createElement("div")
      const title      = document.createElement("div")
      const row        = document.createElement('div')
      const origin     = document.createElement("lol-uikit-slider")
      const slider     = document.createElement("div")
      const sliderbase = document.createElement("div")

      let audio = document.getElementById(`${target}`)

      row.setAttribute("class", "lol-settings-sound-row-slider")
      title.setAttribute("class", "lol-settings-sound-title")

      origin.setAttribute("class", "lol-settings-slider")
      origin.setAttribute("value", `${value}`* 100)
      origin.setAttribute("percentage", "")
      origin.addEventListener("change", ()=>{
         audio.volume = origin.value / 100;
         DataStore.set(`${setValue}`, origin.value / 100)
         title.innerHTML = `${text}: ${origin.value}`
      })

      title.innerHTML = `${text}: ${value * 100}`

      slider.setAttribute("class", "lol-uikit-slider-wrapper horizontal")
      sliderbase.setAttribute("class", "lol-uikit-slider-base")

      div.appendChild(title)
      div.appendChild(row)
      row.appendChild(origin)
      origin.appendChild(slider)
      slider.appendChild(sliderbase)

      return div
   }
}

const injectSettings = (panel) => {
   const langCode = document.querySelector("html").lang;
   const langMap = lang.langlist
   const selectedLang = lang[langMap[langCode] || "EN"];
   panel.prepend(
      UI.Row([
         UI.Link(
            'ElainaV2',
            'https://github.com/Elaina69/Elaina-V2'
         ),
         UI.Label(
            `*${selectedLang["note"]}: ${selectedLang["note-1"]}`
         ),
         UI.Button (`${selectedLang["reload-client"]}`,'reload', ()=>{window.reloadClient()}),
         document.createElement('br'),
         UI.Label(
            `${selectedLang["theme-settings"]}:`
         ),
         document.createElement('br'),
         UI.Slider(
            selectedLang["wallpaper-volume"],DataStore.get("wallpaper-volume"),"elaina-bg","wallpaper-volume"
         ),
         UI.Slider(
            selectedLang["music-volume"],DataStore.get("audio-volume"),"bg-audio","audio-volume"
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["receive-update"]}`,"update","update checkbox",
            () => {
               let updateel = document.getElementById("update")
               let updatebox = document.getElementById("update checkbox")

               if (DataStore.get("Receive-Update")) {
                  updatebox.checked = false
                  DataStore.set("Receive-Update", false)
                  updateel.removeAttribute("class")
               }
               else {
                  updatebox.checked = true
                  DataStore.set("Receive-Update", true)
                  updateel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["old-prev/next-button"]}`,"oldpnb","oldpnbbox",
            ()=>{
               let oldpnbel = document.getElementById("oldpnb")
               let oldpnbbox = document.getElementById("oldpnbbox")

               if (DataStore.get("old-prev/next-button")) {
                  oldpnbbox.checked = false
                  DataStore.set("old-prev/next-button", false)
                  oldpnbel.removeAttribute("class")
               }
               else {
                  oldpnbbox.checked = true
                  DataStore.set("old-prev/next-button", true)
                  oldpnbel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["continues-song"]}`,"conAudio","conAudiobox",
            ()=>{
               let conAudioel = document.getElementById("conAudio")
               let conAudiobox = document.getElementById("conAudiobox")

               if (DataStore.get("Continues_Audio")) {
                  conAudiobox.checked = false
                  DataStore.set("Continues_Audio", false)
                  conAudioel.removeAttribute("class")
               }
               else {
                  conAudiobox.checked = true
                  DataStore.set("Continues_Audio", true)
                  conAudioel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["sidebar-transparent"]}`,'sbt','sbtbox',
            ()=>{
               let sbtel = document.getElementById("sbt")
               let sbtbox = document.getElementById("sbtbox")

               if (DataStore.get("Sidebar-Transparent")) {
                  sbtbox.checked = false
                  DataStore.set("Sidebar-Transparent", false)
                  sbtel.removeAttribute("class")
               }
               else {
                  sbtbox.checked = true
                  DataStore.set("Sidebar-Transparent", true)
                  sbtel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["settings-dialogs-transparent"]}`,'stdiat','stdiatbox',
            ()=>{
               let stdiatel = document.getElementById("stdiat")
               let stdiatbox = document.getElementById("stdiatbox")

               if (DataStore.get("settings-dialogs-transparent")) {
                  stdiatbox.checked = false
                  DataStore.set("settings-dialogs-transparent", false)
                  stdiatel.removeAttribute("class")
               }
               else {
                  stdiatbox.checked = true
                  DataStore.set("settings-dialogs-transparent", true)
                  stdiatel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["hide-champions-splash-art"]}`,'hidechampart','hidechampartbox',
            ()=>{
               let hidechampartel = document.getElementById("hidechampart")
               let hidechampartbox = document.getElementById("hidechampartbox")

               if (DataStore.get("Hide-Champions-Splash-Art")) {
                  hidechampartbox.checked = false
                  DataStore.set("Hide-Champions-Splash-Art", false)
                  hidechampartel.removeAttribute("class")
               }
               else {
                  hidechampartbox.checked = true
                  DataStore.set("Hide-Champions-Splash-Art", true)
                  hidechampartel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-font"]}`,'cusfont','cusfontbox',
            ()=>{
               let cusfontel = document.getElementById("cusfont")
               let cusfontbox = document.getElementById("cusfontbox")

               if (DataStore.get("Custom-Font")) {
                  cusfontbox.checked = false
                  DataStore.set("Custom-Font", false)
                  cusfontel.removeAttribute("class")
               }
               else {
                  cusfontbox.checked = true
                  DataStore.set("Custom-Font", true)
                  cusfontel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-rp"]}`,'cusrp','cusrpbox',
            ()=>{
               let cusrpel = document.getElementById("cusrp")
               let cusrpbox = document.getElementById("cusrpbox")

               if (DataStore.get("Custom_RP")) {
                  cusrpbox.checked = false
                  DataStore.set("Custom_RP", false)
                  cusrpel.removeAttribute("class")
               }
               else {
                  cusrpbox.checked = true
                  DataStore.set("Custom_RP", true)
                  cusrpel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-be"]}`,'cusbe','cusbebox',
            ()=>{
               let cusbeel = document.getElementById("cusbe")
               let cusbebox = document.getElementById("cusbebox")

               if (DataStore.get("Custom_BE")) {
                  cusbebox.checked = false
                  DataStore.set("Custom_BE", false)
                  cusbeel.removeAttribute("class")
               }
               else {
                  cusbebox.checked = true
                  DataStore.set("Custom_BE", true)
                  cusbeel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-rank-name"]}`,'cusrankname','cusranknamebox',
            ()=>{
               let cusranknameel = document.getElementById("cusrankname")
               let cusranknamebox = document.getElementById("cusranknamebox")

               if (DataStore.get("Custom-Rank-Name")) {
                  cusranknamebox.checked = false
                  DataStore.set("Custom-Rank-Name", false)
                  cusranknameel.removeAttribute("class")
               }
               else {
                  cusranknamebox.checked = true
                  DataStore.set("Custom-Rank-Name", true)
                  cusranknameel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["animate-loading"]}`,'aniload','aniloadbox',
            ()=>{
               let aniloadel = document.getElementById("aniload")
               let aniloadbox = document.getElementById("aniloadbox")

               if (DataStore.get("Animate-Loading")) {
                  aniloadbox.checked = false
                  DataStore.set("Animate-Loading", false)
                  aniloadel.removeAttribute("class")
               }
               else {
                  aniloadbox.checked = true
                  DataStore.set("Animate-Loading", true)
                  aniloadel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-avatar"]}`,'cusav','cusavbox',
            ()=>{
               let cusavel = document.getElementById("cusav")
               let cusavbox = document.getElementById("cusavbox")

               if (DataStore.get("Custom-Avatar")) {
                  cusavbox.checked = false
                  DataStore.set("Custom-Avatar", false)
                  cusavel.removeAttribute("class")
               }
               else {
                  cusavbox.checked = true
                  DataStore.set("Custom-Avatar", true)
                  cusavel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-icon"]}`,'cusicon','cusiconbox',
            ()=>{
               let cusiconel = document.getElementById("cusicon")
               let cusiconbox = document.getElementById("cusiconbox")

               if (DataStore.get("Custom-Icon")) {
                  cusiconbox.checked = false
                  DataStore.set("Custom-Icon", false)
                  cusiconel.removeAttribute("class")
               }
               else {
                  cusiconbox.checked = true
                  DataStore.set("Custom-Icon", true)
                  cusiconel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-cursor"]}`,'cuscursor','cuscursorbox',
            ()=>{
               let cuscursorel = document.getElementById("cuscursor")
               let cuscursorbox = document.getElementById("cuscursorbox")

               if (DataStore.get("Custom-Cursor")) {
                  cuscursorbox.checked = false
                  DataStore.set("Custom-Cursor", false)
                  cuscursorel.removeAttribute("class")
               }
               else {
                  cuscursorbox.checked = true
                  DataStore.set("Custom-Cursor", true)
                  cuscursorel.setAttribute("class", "checked")
               }
            }
         ),
         UI.Label(
            `*${selectedLang["note"]}: ${selectedLang["note-2"]}`
         ),
         document.createElement('br'),
         document.createElement('br'),
         UI.Label(
            `${selectedLang["plugins-settings"]}`
         ),
         UI.CheckBox(
            `${selectedLang["old-ll-settings"]}`,'oldll','oldllbox',
            ()=>{
               let oldllel = document.getElementById("oldll")
               let oldllbox = document.getElementById("oldllbox")

               if (DataStore.get("Old-League-Loader-Settings")) {
                  oldllbox.checked = false
                  DataStore.set("Old-League-Loader-Settings", false)
                  oldllel.removeAttribute("class")
               }
               else {
                  oldllbox.checked = true
                  DataStore.set("Old-League-Loader-Settings", true)
                  oldllel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["aram-only"]}`, "Aram only", "Aram only checkbox",
            () => {
               let Aramel = document.getElementById("Aram only")
               let Arambox = document.getElementById("Aram only checkbox")

               if (DataStore.get("aram-only")) {
                  Arambox.checked = false
                  DataStore.set("aram-only", false)
                  Aramel.removeAttribute("class")
               }
               else {
                  Arambox.checked = true
                  DataStore.set("aram-only", true)
                  Aramel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["auto-ban-pick"]}`,'autobp','autobpbox',
            ()=>{
               let autobpel = document.getElementById("autobp")
               let autobpbox = document.getElementById("autobpbox")

               if (DataStore.get("Auto-ban-pick")) {
                  autobpbox.checked = false
                  DataStore.set("Auto-ban-pick", false)
                  autobpel.removeAttribute("class")
               }
               else {
                  autobpbox.checked = true
                  DataStore.set("Auto-ban-pick", true)
                  autobpel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["auto-find-queue"]}`,'autoq','autoqbox',
            ()=>{
               let autoqel = document.getElementById("autoq")
               let autoqbox = document.getElementById("autoqbox")

               if (DataStore.get("Auto-Find-Queue")) {
                  autoqbox.checked = false
                  DataStore.set("Auto-Find-Queue", false)
                  autoqel.removeAttribute("class")
               }
               else {
                  autoqbox.checked = true
                  DataStore.set("Auto-Find-Queue", true)
                  autoqel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["loot-helper"]}`,'lh','lhbox',
            ()=>{
               let lhel = document.getElementById("lh")
               let lhbox = document.getElementById("lhbox")

               if (DataStore.get("loot-helper")) {
                  lhbox.checked = false
                  DataStore.set("loot-helper", false)
                  lhel.removeAttribute("class")
               }
               else {
                  lhbox.checked = true
                  DataStore.set("loot-helper", true)
                  lhel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-rank-hover"]}`,'cusrankhover','cusrankhoverbox',
            ()=>{
               let cusrankhoverel = document.getElementById("cusrankhover")
               let cusrankhoverbox = document.getElementById("cusrankhoverbox")

               if (DataStore.get("Custom-Rank(Hover-card)")) {
                  cusrankhoverbox.checked = false
                  DataStore.set("Custom-Rank(Hover-card)", false)
                  cusrankhoverel.removeAttribute("class")
               }
               else {
                  cusrankhoverbox.checked = true
                  DataStore.set("Custom-Rank(Hover-card)", true)
                  cusrankhoverel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["custom-status"]}`,'cussta','cusstabox',
            ()=>{
               let cusstael = document.getElementById("cussta")
               let cusstabox = document.getElementById("cusstabox")

               if (DataStore.get("Custom-Status")) {
                  cusstabox.checked = false
                  DataStore.set("Custom-Status", false)
                  cusstael.removeAttribute("class")
               }
               else {
                  cusstabox.checked = true
                  DataStore.set("Custom-Status", true)
                  cusstael.setAttribute("class", "checked")
               }
            }
         ),
         UI.Link(
            `${selectedLang["note-3"]} ?`,
            'https://github.com/KebsCS/KBotExt'
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["1/4-joke"]}`,'_1_4','_1_4box',
            ()=>{
               let _1_4el = document.getElementById("_1_4")
               let _1_4box = document.getElementById("_1_4box")

               if (DataStore.get("April fool` joke")) {
                  _1_4box.checked = false
                  DataStore.set("April fool` joke", false)
                  _1_4el.removeAttribute("class")
               }
               else {
                  _1_4box.checked = true
                  DataStore.set("April fool` joke", true)
                  _1_4el.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
         UI.CheckBox(
            `${selectedLang["Santa"]}`,'MC','MCbox',
            ()=>{
               let MCel = document.getElementById("MC")
               let MCbox = document.getElementById("MCbox")

               if (DataStore.get("Merry-Christmas")) {
                  MCbox.checked = false
                  DataStore.set("Merry-Christmas", false)
                  MCel.removeAttribute("class")
               }
               else {
                  MCbox.checked = true
                  DataStore.set("Merry-Christmas", true)
                  MCel.setAttribute("class", "checked")
               }
            }
         ),
         document.createElement('br'),
      ])
   )
}

window.addEventListener('load', async () => {
const interval = setInterval(() => {
      const manager = document.getElementById(
         'lol-uikit-layer-manager-wrapper'
      )
      if (manager) {
         clearInterval(interval)
         new MutationObserver((mutations) => {
            const panel = document.querySelector('div.lol-settings-options > lol-uikit-scrollable')
            if (panel && mutations.some((record) => Array.from(record.addedNodes).includes(panel))) {
               injectSettings(panel)
               const check = setInterval (()=>{
                  if (document.getElementById("Aram only")) {
                     clearInterval(check)
                     let updateel       = document.getElementById("update")
                     let conAudioel     = document.getElementById("conAudio")
                     let sbtel          = document.getElementById("sbt")
                     let hidechampartel = document.getElementById("hidechampart")
                     let cusfontel      = document.getElementById("cusfont")
                     let cusrpel        = document.getElementById("cusrp")
                     let cusbeel        = document.getElementById("cusbe")
                     let cusranknameel  = document.getElementById("cusrankname")
                     let aniloadel      = document.getElementById("aniload")
                     let cusavel        = document.getElementById("cusav")
                     let cusiconel      = document.getElementById("cusicon")
                     let cuscursorel    = document.getElementById("cuscursor")
                     let oldllel        = document.getElementById("oldll")
                     let Aramel         = document.getElementById("Aram only")
                     let autobpel       = document.getElementById("autobp")
                     let autoqel        = document.getElementById("autoq")
                     let cusrankhoverel = document.getElementById("cusrankhover")
                     let cusstael       = document.getElementById("cussta")
                     let _1_4el         = document.getElementById("_1_4")
                     let MCel           = document.getElementById("MC")
                     let lhel           = document.getElementById("lh")
                     let stdiatel       = document.getElementById("stdiat")
                     let oldpnbel = document.getElementById("oldpnb")
               
                     if (DataStore.get("aram-only") && Aramel.getAttribute("class") == "") {
                        let Arambox = document.getElementById("Aram only checkbox")
                        Arambox.checked = true
                     }
                     if (DataStore.get("Receive-Update") && updateel.getAttribute("class") == "") {
                        let updatebox = document.getElementById("update checkbox")
                        updatebox.checked = true
                     }
                     if (DataStore.get("Continues_Audio") && conAudioel.getAttribute("class") == "") {
                        let conAudiobox = document.getElementById("conAudiobox")
                        conAudiobox.checked = true
                     }
                     if (DataStore.get("Sidebar-Transparent") && sbtel.getAttribute("class") == "") {
                        let sbtbox = document.getElementById("sbtbox")
                        sbtbox.checked = true
                     }
                     if (DataStore.get("Hide-Champions-Splash-Art") && hidechampartel.getAttribute("class") == "") {
                        let hidechampartbox = document.getElementById("hidechampartbox")
                        hidechampartbox.checked = true
                     }
                     if (DataStore.get("Custom-Font") && cusfontel.getAttribute("class") == "") {
                        let cusfontbox = document.getElementById("cusfontbox")
                        cusfontbox.checked = true
                     }
                     if (DataStore.get("Custom_RP") && cusrpel.getAttribute("class") == "") {
                        let cusrpbox = document.getElementById("cusrpbox")
                        cusrpbox.checked = true
                     }
                     if (DataStore.get("Custom_BE") && cusbeel.getAttribute("class") == "") {
                        let cusbebox = document.getElementById("cusbebox")
                        cusbebox.checked = true
                     }
                     if (DataStore.get("Custom-Rank-Name") && cusranknameel.getAttribute("class") == "") {
                        let cusranknamebox = document.getElementById("cusranknamebox")
                        cusranknamebox.checked = true
                     }
                     if (DataStore.get("Animate-Loading") && aniloadel.getAttribute("class") == "") {
                        let aniloadbox = document.getElementById("aniloadbox")
                        aniloadbox.checked = true
                     }
                     if (DataStore.get("Custom-Avatar") && cusavel.getAttribute("class") == "") {
                        let cusavbox = document.getElementById("cusavbox")
                        cusavbox.checked = true
                     }
                     if (DataStore.get("Custom-Icon") && cusiconel.getAttribute("class") == "") {
                        let cusiconbox = document.getElementById("cusiconbox")
                        cusiconbox.checked = true
                     }
                     if (DataStore.get("Custom-Cursor") && cuscursorel.getAttribute("class") == "") {
                        let cuscursorbox = document.getElementById("cuscursorbox")
                        cuscursorbox.checked = true
                     }
                     if (DataStore.get("Old-League-Loader-Settings") && oldllel.getAttribute("class") == "") {
                        let oldllbox = document.getElementById("oldllbox")
                        oldllbox.checked = true
                     }
                     if (DataStore.get("Auto-ban-pick") && autobpel.getAttribute("class") == "") {
                        let autobpbox = document.getElementById("autobpbox")
                        autobpbox.checked = true
                     }
                     if (DataStore.get("Auto-Find-Queue") && autoqel.getAttribute("class") == "") {
                        let autoqbox = document.getElementById("autoqbox")
                        autoqbox.checked = true
                     }
                     if (DataStore.get("Custom-Rank(Hover-card)") && cusrankhoverel.getAttribute("class") == "") {
                        let cusrankhoverbox = document.getElementById("cusrankhoverbox")
                        cusrankhoverbox.checked = true
                     }
                     if (DataStore.get("Custom-Status") && cusstael.getAttribute("class") == "") {
                        let cusstabox = document.getElementById("cusstabox")
                        cusstabox.checked = true
                     }
                     if (DataStore.get("April fool` joke") && _1_4el.getAttribute("class") == "") {
                        let _1_4box = document.getElementById("_1_4box")
                        _1_4box.checked = true
                     }
                     if (DataStore.get("Merry-Christmas") && MCel.getAttribute("class") == "") {
                        let MCbox = document.getElementById("MCbox")
                        MCbox.checked = true
                     }
                     if (DataStore.get("loot-helper") && lhel.getAttribute("class") == "") {
                        let lhbox = document.getElementById("lhbox")
                        lhbox.checked = true
                     }
                     if (DataStore.get("settings-dialogs-transparent") && stdiatel.getAttribute("class") == "") {
                        let stdiatbox = document.getElementById("stdiatbox")
                        stdiatbox.checked = true
                     }
                     if (DataStore.get("old-prev/next-button") && oldpnbel.getAttribute("class") == "") {
                        let oldpnbbox = document.getElementById("oldpnbbox")
                        oldpnbbox.checked = true
                     }
                     /*if (DataStore.get("") && el.getAttribute("class") == "") {
                        
                        box.checked = true
                     }*/
                  }
               },100)
            }
         }).observe(manager, {
            childList: true,
            subtree: true
         })
      }
   },500)
})
const _UI = UI
export { _UI as UI }