import { datapath } from "../settings.ts"
import utils from "../../utils/utils.ts";
import { log } from "../../utils/themeLog.ts";

class ui {
    /**
     * @param text Dòng text hiển thị bên dưới icon Loading
     */
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

    /**
     * Tạo một div trống
     * @param id Id của 1 div trống
     * @param childs Các phần tử con sẽ được thêm vào div này
     * @param show Điều kiện để hiển thị các phần tử con (False = không hiển thị)
     */
    Row = (id: string, childs: any, show = true) => {
        const row = document.createElement('div')
        row.classList.add('elaina-theme-settings-row')
        row.id = id
        if (Array.isArray(childs) && show) childs.forEach((el) => row.appendChild(el))
        return row
    }

    /**
     * Giống với row nhưng có thêm nút để ẩn hiện các phần tử con
     * @param id Id của 1 div có thể ẩn hiện
     * @param childs Các phần tử con sẽ được thêm vào div này
     * @param show Điều kiện để hiển thị các phần tử con (False = không hiển thị)
     */
    RowHideable = (id: string, childs: any, show = true) => {
        const row = document.createElement('div')
        const main = document.createElement('div')
        const hideButton = document.createElement('div')
        const hideIcon = this.Image(true, "plugins-icons/next_button.png", 'elaina-theme-settings-row-hide-icon')

        row.classList.add('elaina-theme-settings-row-hideable')
        row.id = id
        hideButton.id = "elaina-theme-settings-row-hide-button"
        main.setAttribute('isHiding', 'false')

        row.append(hideButton)
        hideButton.append(hideIcon)
        
        row.append(main)

        if (Array.isArray(childs) && show) childs.forEach((el) => main.appendChild(el))

        hideButton.onclick = () => {
            if (main.getAttribute('isHiding') === 'false') {
                main.setAttribute('isHiding', 'true')
                hideIcon.setAttribute("class", 'elaina-theme-settings-row-hide-icon-hidden')
            }
            else {
                main.setAttribute('isHiding', 'false')
                hideIcon.setAttribute("class", 'elaina-theme-settings-row-hide-icon')
            }
        }

        return row
    }

    /**
     * Tạo một label hoặc text 
     * @param text Nội dung của label
     * @param id Id của label
     * @param cls Class của label, mặc định là "Elaina-theme-template-class"
     * @param style Style của label, mặc định là ""
     */
    Label = (text: string, id = "", cls = "Elaina-theme-template-class", style = "") => {
        const label = document.createElement('p')

        label.classList.add('lol-settings-window-size-text')
        label.classList.add('elaina-theme-settings-text')
        label.classList.add(cls)
        label.id = id
        label.style.cssText = style
        label.innerText = text
        
        return label
    }

    /**
     * Tạo một thẻ img
     * @param image Tên của ảnh hoặc đường dẫn đến ảnh, phụ thuộc vào biến localImage
     * @param cls Class của thẻ img
     * @param id Id của thẻ img, mặc định là ""
     * @param style Style của thẻ img, mặc định là ""
     * @param localImage Sử dụng ảnh local hay online, mặc định là true 
     */
    Image = (localImage: boolean = true, image: string, cls: string, id = "", style = "") => {
        const img = document.createElement('img')

        img.setAttribute("src", localImage? `${datapath}assets/icon/${image}` : image)
        img.classList.add(cls)
        img.id = id
        img.style.cssText = style

        return img
    }

    /**
     * Tạo 1 thẻ đường dẫn a
     * @param text Text hiển thị của đường dẫn
     * @param href Đường dẫn đến trang đích
     * @param onClick Hàm sẽ gọi khi người dùng click vào đường dẫn
     * @param id Id của thẻ
     */
    Link = (text: string, href: string, onClick: any, id = "") => {
        const link = document.createElement('p')
        link.classList.add('lol-settings-code-of-conduct-link')
        link.classList.add('lol-settings-window-size-text')
    
        const a = document.createElement('a')
        a.innerText = text
        a.target = '_blank'
        a.href = href
        a.onclick = onClick || null
        a.download
        a.id = id
    
        link.append(a)
        return link
    }

    /**
     * Là sự kết hợp của Image và Link
     * @param localImage Sử dụng ảnh local hay online, mặc định là true
     * @param image Tên của ảnh hoặc đường dẫn đến ảnh, phụ thuộc vào biến localImage
     * @param cls Class của thẻ img
     * @param href Đường dẫn đến trang đích
     * @param onClick Hàm sẽ gọi khi người dùng click vào ảnh
     */
    ImageAndLink = (localImage: boolean, image: string, cls: string, href: string, onClick: any) => {
        const link = this.Link("", href, onClick)
        link.setAttribute("class", "")
        link.style.margin = "0px"

        const img = this.Image(localImage, image, cls, "", "")

        link.querySelector("a")?.append(img)

        return link
    }

    /**
     * Ảnh của những người đóng góp
     * @param localImage Sử dụng ảnh local hay online, mặc định là true
     * @param image Tên của ảnh hoặc đường dẫn đến ảnh, phụ thuộc vào biến localImage
     * @param C_name Tên của người đóng góp
     * @param info Thông tin đóng góp của người đó
     * @param url Đường đẫn đến trang cá nhân của người đó
     */
    Contributor = (localImage: boolean, image: string, C_name: string, info: string, url: string) => {
        const origin = document.createElement("div")
        origin.id = "Contrib"

        const div: any = document.createElement("div")
        div.style.cssText = "margin-left: 10px;"


        const img = this.ImageAndLink(localImage, image, "contributor-img", url, () => {})
        const Name = this.Label(C_name, "contributor-name")
        const Info = this.Label(info, "", "contributor-info", "margin: 0px")

        origin.append(img)
        origin.append(div)
        div.append(Name)
        div.append(Info)

        return origin
    }

    /**
     * Tạo một nút
     * @param text Nội dung của nút
     * @param cls Class của nút, mặc định là "Elaina-theme-template-class"
     * @param onClick Event sẽ gọi khi người dùng click vào nút
     * @param id Id của nút, mặc định là ""
     * @param style Style của nút, mặc định là ""
     */
    Button = (text: string, cls = "Elaina-theme-template-class", onClick: any, id = "", style = "") => {
        const btn = document.createElement('lol-uikit-flat-button-secondary')

        btn.innerText = text
        btn.onclick = onClick
        btn.style.cssText = "display: flex;" + style
        btn.setAttribute('class', cls)
        btn.id = id

        return btn
    }

    /**
     * Tạo 1 text box
     * @param Datastore Tến của Datastore, kiểu string
     * @param style Style của text box, mặc định là ""
     * @param onInput Event sẽ gọi khi người dùng nhập vào text box
     */
    createInputElement = (Datastore: string, style = "", onInput: any) => {
        const origin = document.createElement('lol-uikit-flat-input')
        const searchbox = document.createElement('input')
    
        origin.classList.add(Datastore)
        origin.style.cssText = style
    
        searchbox.type = 'url'
        searchbox.name = 'name'
        searchbox.placeholder = ElainaData.get(Datastore)
        searchbox.oninput = onInput

        origin.appendChild(searchbox)
        return { origin, searchbox }
    }

    /**
     * Sử dụng createInputElement để tạo một text box với style và onInput mặc định
     * @param Datastore Tên của Datastore, kiểu string
     */
    Input = (Datastore: string) => {
        const { origin, searchbox } = this.createInputElement(
            Datastore, 
            "margin-bottom: 12px; width: 190px;", 
            () => {
                let input: any = {
                    get value() {
                        return searchbox.value
                    },
                }
                ElainaData.set(Datastore, input.value)
            }
        )
        return origin
    }

    /**
     * Sử dụng createInputElement để tạo một text box có thể chỉnh được tốc độ của wallpaper
     * @param Datastore Tên của Datastore, kiểu string
     */
    SpeedInput = (Datastore: string) => {
        const { origin, searchbox } = this.createInputElement(
            Datastore, 
            "margin-bottom: 12px; width: 190px;", 
            async () => {
                let input: any = {
                    get value() {
                        return searchbox.value
                    },
                }

                let speedCheck: any = document.getElementById("speed-check")
                if (input.value >= 6.25 && input.value <= 300) {
                    ElainaData.set(Datastore, input.value)
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
        )
        return origin
    }

    /**
     * Tạo 1 checkbox
     * @param text Nội dung của checkbox
     * @param id Id của parent chứa checkbox
     * @param boxID Id của checkbox
     * @param check Kiểm tra sự thay đổi của checkbox, sẽ gọi hàm này khi người dùng click vào checkbox
     * @param show Có hiển thị checkbox hay không
     * @param Datastore Tên của Datastore, kiểu string
     */
    CheckBox = (text: string, id: string, boxID: string, check: any, show: boolean, Datastore: string) => {
        const container = document.createElement("div")
        container.style.width = "fit-content"

        const origin = document.createElement("lol-uikit-flat-checkbox")
        origin.id = id
        origin.setAttribute("lastDatastore", ElainaData.get(Datastore))

        const label = document.createElement("label")
        label.innerHTML = text
        label.setAttribute("slot", "label")

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = boxID
        checkbox.setAttribute("slot", "input")
        if (ElainaData.get(Datastore)){
            checkbox.checked = true
            origin.setAttribute("class", "checked")
        }
        else {
            checkbox.checked = false
            origin.setAttribute("class",'')
        }
        checkbox.onclick = () => {
            if (ElainaData.get(Datastore)) {
                origin.removeAttribute("class")
                checkbox.checked = false
                ElainaData.set(Datastore, false)
                check()
            }
            else {
                origin.setAttribute("class", "checked")
                checkbox.checked = true
                ElainaData.set(Datastore, true)
                check()
            }
        }
        
    
        if (show) {
            container.appendChild(origin)
            origin.appendChild(checkbox)
            origin.appendChild(label)
    
            return container
        }
        else {
            const blankDiv = document.createElement("div")
            container.appendChild(blankDiv)
            return container
        }
    }

    /**
     * Tạo 1 thanh kéo thay đổi âm lượng của theme
     * @param text Nội dung của slider
     * @param value Giá trị của slider
     * @param target Id của thẻ audio sẽ thay đổi volume
     * @param setValue Tên của Datastore sẽ lưu giá trị của slider
     */
    Slider = (text: string, value: number, target, setValue) => {
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

    /**
     * Tạo một dropdown
     * @param DataList Danh sách dữ liệu để tạo dropdown, sẽ có dạng {Object: [{object: string, object: string,...},...]}
     * @param Datastore tên cua Datastore, kiểu string
     * @param text Nội dung của dropdown
     * @param name Tên của thuộc tính trong mỗi object sẽ hiển thị trong dropdown, lấy trong DataList
     * @param id Id của mỗi option trong dropdown, lấy trong DataList
     * @param dropdownId Id của dropdown
     * @returns 
     */
    Dropdown = (DataList: Object, Datastore: string, text: string, name: string, id: string, dropdownId?: string) => {
        const origin = document.createElement("div")
        origin.classList.add("Dropdown-div")
        origin.id = dropdownId || ""

        const title = this.Label(text, "")

        const dropdown = document.createElement("lol-uikit-framed-dropdown")
        dropdown.classList.add("lol-settings-general-dropdown")

        origin.append(title,dropdown)

        for (let i = 0; i < DataList[Datastore].length; i++) {
            const opt = DataList[Datastore][i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt[name]
            el.id = opt[id]
            el.onclick = () => {
                ElainaData.set(Datastore, opt[id])
            }
            if (ElainaData.get(Datastore) == opt[id]) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    }

    /**
     * Tạo một dropdown cho các font chữ tùy chỉnh
     */
    DropdownCustomFont = () => {
        const origin = document.createElement("div")
        origin.classList.add("Dropdown-div")

        const dropdown = document.createElement("lol-uikit-framed-dropdown")
        dropdown.classList.add("lol-settings-general-dropdown")

        origin.append(dropdown)
        
        for (let i = 0; i < ElainaData.get("Font-list").length; i++) {
            const opt = ElainaData.get("Font-list")[i]

            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt
            el.onclick = () => {
                ElainaData.set("CurrentFont", opt)

                if (ElainaData.get("Custom-Font")) {
                    document.querySelector("#Custom-font")?.remove()
                    utils.addFont(ElainaData.get("Font-folder") + ElainaData.get("CurrentFont"), "Custom-font", "Custom")

                    log("Font changed to: " + ElainaData.get("CurrentFont"))
                }
            }

            if (ElainaData.get("CurrentFont") == opt) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    }

    /**
     * Tạo một dropdown cho các banner tùy chỉnh
     */
    DropdownCustomBanner = () => {
        const origin = document.createElement("div")
        origin.classList.add("Dropdown-div")

        const dropdown = document.createElement("lol-uikit-framed-dropdown")
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

    /**
     * Tạo một input để người dùng có thể tải lên file
     * @param id Id của input
     * @param acceptFile Loại file được chấp nhận, kiểu string
     * @param onChange Hàm sẽ gọi khi người dùng thay đổi file
     */
    fileInput = (id: string, acceptFile: string, onChange: any) => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = acceptFile
        input.id = id
        input.onchange = onChange
        input.style.display = "none"

        return input
    }

    /**
     * Tạo một input để người dùng có thể chọn màu sắc
     * @param id Id của input
     * @param targetDataStore Tên của Datastore, kiểu string
     * @param onChange Hàm sẽ gọi khi người dùng thay đổi màu sắc
     */
    colorPicker = (id: string, targetDataStore: string, onChange: any) => {
        const input = document.createElement("input")
        input.type = "color"
        input.id = id
        input.value = ElainaData.get(targetDataStore)
        input.onchange = onChange

        return input
    }

    /**
     * Tạo một thanh trượt để điều chỉnh độ mờ của một phần tử
     * @param id Id của thanh trượt
     * @param text Nội dung của thanh trượt
     * @param opacityHexData động mờ của phần tử dưới dạng HEX, kiểu string
     * @param onChange Hàm sẽ gọi khi người dùng thay đổi giá trị của thanh trượt
     */
    opacitySlider = (id: string, text: string, opacityHexData: string, onChange: any) => {
        const div        = document.createElement("div")
        const title      = document.createElement("div")
        const row        = document.createElement('div')
        const origin     = document.createElement("lol-uikit-slider")
        const slider     = document.createElement("div")
        const sliderbase = document.createElement("div")
    
        row.setAttribute("class", "lol-settings-sound-row-slider")
        title.setAttribute("class", "lol-settings-sound-title")
        title.id = id+"-title"
    
        origin.id = id
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

    /**
     * Tạo một dropdown cho các kiểu gradient
     * @param target Id của thẻ sẽ thay đổi kiểu gradient
     */
    gradientsCss = (target) => {
        const origin = document.createElement("div")
        origin.classList.add("Dropdown-div")

        const dropdown = document.createElement("lol-uikit-framed-dropdown")
        dropdown.classList.add("lol-settings-general-dropdown")

        const gradients = ["Liner gradients", "Radial gradients", "Conic gradients"]

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