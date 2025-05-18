import { datapath, utils } from "../settings.ts"
import { getThemeName } from "../../otherThings.ts";

let icdata: Object = (await import(`//plugins/${getThemeName()}/config/icons.js`)).default;

class ui {
    Loading = (text: string) => {
        const loading = document.createElement("div");
        loading.id = "settings-loading";

        const loadingImage = document.createElement('img')
        loadingImage.classList.add("settings-loading-image")
        loadingImage.style.content = "var(--Loading)"

        const loadingText = this.Label(text, "settings-loading-text");

        loading.appendChild(loadingImage);
        loading.appendChild(loadingText);

        return loading
    }

    Row = (id, childs) => {
        const row = document.createElement('div')
        row.classList.add('elaina-theme-settings-row')
        row.id = id
        if (Array.isArray(childs)) childs.forEach((el) => row.appendChild(el))
        return row
    }

    Label = (text, id) => {
        const label = document.createElement('p')
        label.classList.add('lol-settings-window-size-text')
        label.innerText = text
        label.id = id
        return label
    }

    Image = (image, cls) => {
        const img = document.createElement('img')
        img.setAttribute("src", `${datapath}assets/icon/${image}`)
        img.classList.add(cls)
        return img
    }

    Link = (text, href, onClick, ID) => {
        const link = document.createElement('p')
        link.classList.add('lol-settings-code-of-conduct-link')
        link.classList.add('lol-settings-window-size-text')
    
        const a = document.createElement('a')
        a.innerText = text
        a.target = '_blank'
        a.href = href
        a.onclick = onClick || null
        a.download
        a.id = ID || null
    
        link.append(a)
        return link
    }

    Button = (text, cls, onClk) => {
        const btn = document.createElement('lol-uikit-flat-button-secondary')
        btn.innerText = text
        btn.onclick = onClk
        btn.style.display = 'flex'
        btn.setAttribute('class', cls)
        return btn
    }

    Input = (target) => {
        const origin = document.createElement('lol-uikit-flat-input')
        const searchbox = document.createElement('input')
    
        origin.classList.add(target)
        origin.style.marginBottom = '12px'
    
        searchbox.type = 'url'
        searchbox.placeholder = ElainaData.get(target)
        searchbox.style.width = '190px'
        searchbox.name = 'name'
        searchbox.oninput = ()=>{
            let input = {
                get value() {
                    return searchbox.value
                },
            }
            ElainaData.set(target, input.value)
        }
        origin.appendChild(searchbox)
        return origin
    }

    SpeedInput = (target) => {
        const origin = document.createElement('lol-uikit-flat-input')
        const searchbox = document.createElement('input')
    
        origin.classList.add(target)
        origin.style.marginBottom = '12px'
    
        searchbox.type = 'url'
        searchbox.placeholder = ElainaData.get(target)
        searchbox.style.width = '75px'
        searchbox.style.textAlign = "end"
        searchbox.name = 'name'
        searchbox.oninput = async ()=>{
            let input: any = {
                get value() {
                    return searchbox.value
                },
            }

            let speedCheck: any = document.getElementById("speed-check")
            if (input.value >= 6.25 && input.value <= 300) {
                ElainaData.set(target, input.value)
                speedCheck.textContent = ""
                speedCheck.style.color = ""
            }
            else {
                speedCheck.textContent = await getString("speed-check-deny")
                speedCheck.style.color = "red"
            }

            let bg: any = document.getElementById('elaina-bg')
            bg.playbackRate = ElainaData.get("Playback-speed")/100
        }
        origin.appendChild(searchbox)
        return origin
    }

    CheckBox = (text, ID, boxID, check, show, datastore_name) => {
        const container = document.createElement("div")
        const origin = document.createElement("lol-uikit-flat-checkbox")
        const checkbox = document.createElement("input")
        const label = document.createElement("label")
        const none = document.createElement("div")

        container.style.width = "fit-content"
        origin.id = ID
        origin.setAttribute("lastDatastore", ElainaData.get(datastore_name))
    
        checkbox.type = "checkbox"
        checkbox.id = boxID
        if (ElainaData.get(datastore_name)){
            checkbox.checked = true
            origin.setAttribute("class", "checked")
        }
        else {
            checkbox.checked = false
            origin.setAttribute("class",'')
        }

        checkbox.onclick = () => {
            if (ElainaData.get(datastore_name)) {
                origin.removeAttribute("class")
                checkbox.checked = false
                ElainaData.set(datastore_name, false)
                check()
            }
            else {
                origin.setAttribute("class", "checked")
                checkbox.checked = true
                ElainaData.set(datastore_name, true)
                check()
            }
        }
        checkbox.setAttribute("slot", "input")
    
        label.innerHTML = text
        label.setAttribute("slot", "label")
    
        if (show) {
            container.appendChild(origin)
            origin.appendChild(checkbox)
            origin.appendChild(label)
    
            return container
        }
        else {
            container.appendChild(none)
            return container
        }
    }

    Slider = (text, value, target, setValue) => {
        const div         = document.createElement("div")
        const title       = document.createElement("div")
        const row         = document.createElement('div')
        const origin: any = document.createElement("lol-uikit-slider")
        const slider      = document.createElement("div")
        const sliderbase  = document.createElement("div")
    
        let audio: any = document.getElementById(`${target}`)
    
        row.setAttribute("class", "lol-settings-sound-row-slider")
        title.setAttribute("class", "lol-settings-sound-title")
    
        origin.setAttribute("class", "lol-settings-slider")
        origin.setAttribute("value", `${value * 100}`)
        origin.addEventListener("change", ()=>{
            audio.volume = origin.value / 100;
            ElainaData.set(`${setValue}`, origin.value / 100)
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

    Dropdown = (list,target,text,name,id) => {
        const origin = document.createElement("div")
        const title  = document.createElement("div")
        const dropdown = document.createElement("lol-uikit-framed-dropdown")
    
        origin.classList.add("Dropdown-div")
        title.classList.add("lol-settings-window-size-text")
        title.innerHTML = text
        dropdown.classList.add("lol-settings-general-dropdown")
        origin.append(title,dropdown)
        for (let i = 0; i < list[target].length; i++) {
            const opt = list[target][i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt[name]
            el.id = opt[id]
            el.onclick = () => {
                ElainaData.set(target, opt[id])
            }
            if (ElainaData.get(target) == opt[id]) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    }

    DropdownCustomFont = () => {
        const origin = document.createElement("div")
        const dropdown = document.createElement("lol-uikit-framed-dropdown")
    
        origin.classList.add("Dropdown-div")
        dropdown.classList.add("lol-settings-general-dropdown")
        origin.append(dropdown)
        for (let i = 0; i < ElainaData.get("Font-list").length; i++) {
            const opt = ElainaData.get("Font-list")[i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt
            el.onclick = () => {
                ElainaData.set("CurrentFont", opt)
                try {
                    document.querySelector("#Custom-font")?.remove()
                    utils.addFont(ElainaData.get("Font-folder")+ElainaData.get("CurrentFont"),"Custom-font","Custom")
                }
                catch{}
            }
            if (ElainaData.get("CurrentFont") == opt) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    }

    DropdownCustomBanner = () => {
        const origin = document.createElement("div")
        const dropdown = document.createElement("lol-uikit-framed-dropdown")
        
        origin.classList.add("Dropdown-div")
        dropdown.classList.add("lol-settings-general-dropdown")
        origin.append(dropdown)
        for (let i = 0; i < ElainaData.get("Banner-list").length; i++) {
            const opt = ElainaData.get("Banner-list")[i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt
            el.onclick = () => {
                ElainaData.set("CurrentBanner", opt)
            }
            if (ElainaData.get("CurrentBanner") == opt) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    }

    // DropdownCDNversion: () => {
    //     const origin = document.createElement("div")
    //     const dropdown = document.createElement("lol-uikit-framed-dropdown")
    
    //     origin.classList.add("Dropdown-div")
    //     dropdown.classList.add("lol-settings-general-dropdown")
    //     origin.append(dropdown)
    //     for (let i = 0; i < cdnVersion.length; i++) {
    //         const opt = cdnVersion[i]
    //         const el = document.createElement("lol-uikit-dropdown-option")
    //         el.setAttribute("slot", "lol-uikit-dropdown-option")
    //         el.innerText = opt
    //         el.onclick = () => {
    //             DataStore.set("Cdn-version", opt)
    //         }
    //         if (DataStore.get("Cdn-version") == opt) {
    //             el.setAttribute("selected", "true")
    //         }
    //         dropdown.appendChild(el)
    //     }
    //     return origin
    // },

    Contributor = (localImage, image,C_name,info) => {
        const origin = document.createElement("div")
        const div: any = document.createElement("div")
        const img = document.createElement('img')
        const Name = document.createElement("p")
        const Info: any = document.createElement("p")

        origin.append(img)
        origin.append(div)
        div.append(Name)
        div.append(Info)

        origin.id = "Contrib"

        div.style = "margin-left: 10px;"

        img.setAttribute("src", localImage? `${datapath}assets/icon/${image}` : image)
        img.classList.add("contributor-img")

        Name.innerText = C_name
        Name.classList.add('lol-settings-window-size-text')
        Name.id = "contributor-name"

        Info.classList.add('lol-settings-window-size-text')
        Info.innerText = info
        Info.style = "margin: 0px"

        return origin
    }

    ImageAndLink = (localImage, image, cls, href, onClick) => {
        const link = document.createElement('a')
        const img = document.createElement('img')

        img.setAttribute("src", localImage? `${datapath}assets/icon/${image}` : image)
        img.classList.add(cls)

        link.target = '_blank'
        link.href = href
        link.onclick = onClick || null

        link.append(img)

        return link
    }

    fileInput = (Id, acceptFile, onChange) => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = acceptFile
        input.id = Id
        input.onchange = onChange
        input.style.display = "none"

        return input
    }

    colorPicker = (Id, targetDataStore, onChange) => {
        const input = document.createElement("input")
        input.type = "color"
        input.id = Id
        input.value = ElainaData.get(targetDataStore)
        input.onchange = onChange

        return input
    }

    opacitySlider = (Id, text, opacityHexData, onChange) => {
        const div        = document.createElement("div")
        const title      = document.createElement("div")
        const row        = document.createElement('div')
        const origin     = document.createElement("lol-uikit-slider")
        const slider     = document.createElement("div")
        const sliderbase = document.createElement("div")
    
        row.setAttribute("class", "lol-settings-sound-row-slider")
        title.setAttribute("class", "lol-settings-sound-title")
        title.id = Id+"-title"
    
        origin.id = Id
        origin.setAttribute("class", "lol-settings-slider")
        origin.setAttribute("value", `${parseInt(ElainaData.get(opacityHexData).slice(0, 2), 16) / 255 * 100}`)
        origin.addEventListener("change", onChange)
    
        title.innerHTML = `${text}: ${parseInt(ElainaData.get(opacityHexData).slice(0, 2), 16) / 255 * 100}%`
    
        slider.setAttribute("class", "lol-uikit-slider-wrapper horizontal")
        sliderbase.setAttribute("class", "lol-uikit-slider-base")
    
        div.appendChild(title)
        div.appendChild(row)
        row.appendChild(origin)
        origin.appendChild(slider)
        slider.appendChild(sliderbase)
    
        return div
    }

    gradientsCss = (target) => {
        const origin = document.createElement("div")
        const dropdown = document.createElement("lol-uikit-framed-dropdown")
        const gradients = ["Liner gradients", "Radial gradients", "Conic gradients"]
    
        origin.classList.add("Dropdown-div")
        dropdown.classList.add("lol-settings-general-dropdown")
        origin.append(dropdown)
        for (let i = 0; i < gradients.length; i++) {
            const opt = gradients[i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt
            el.onclick = () => {
                ElainaData.set(target, opt)
                try {
                    document.querySelector(target).remove()
                    utils.addStyleWithID(target, "")
                }
                catch{}
            }
            if (ElainaData.get("CurrentFont") == opt) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    }
}

const UI = new ui()

export { UI }