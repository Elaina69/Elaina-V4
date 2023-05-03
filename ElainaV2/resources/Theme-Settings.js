import data from"../configs/ElainaV2_config.json";

function ThemeSettings () {
    const SettingsDiv     = document.createElement("div")
    const SettingsIcon    = document.createElement('img')
    const closediv        = document.createElement("div")
    const close           = document.createElement("img")
    const SettingsTabMain = document.createElement("div")
    const SettingsNavbar  = document.createElement("lol-uikit-scrollable")
    const SettingsContent = document.createElement("div")

    const SettingsGeneral = document.createElement("div")
    const SettingsRow     = document.createElement("div")

    const Checkbox1       = document.createElement("lol-uikit-flat-checkbox")
    const Input1          = document.createElement("input")
    const Label1          = document.createElement("label")

    const Checkbox2       = document.createElement("lol-uikit-flat-checkbox")
    const Input2          = document.createElement("input")
    const Label2          = document.createElement("label")

    const Checkbox3       = document.createElement("lol-uikit-flat-checkbox")
    const Input3          = document.createElement("input")
    const Label3          = document.createElement("label")

    const Checkbox4       = document.createElement("lol-uikit-flat-checkbox")
    const Input4          = document.createElement("input")
    const Label4          = document.createElement("label")

    const Checkbox5       = document.createElement("lol-uikit-flat-checkbox")
    const Input5          = document.createElement("input")
    const Label5          = document.createElement("label")

    const Checkbox6       = document.createElement("lol-uikit-flat-checkbox")
    const Input6          = document.createElement("input")
    const Label6          = document.createElement("label")

    const Checkbox7       = document.createElement("lol-uikit-flat-checkbox")
    const Input7          = document.createElement("input")
    const Label7          = document.createElement("label")

    let showcontainer = document.getElementsByClassName("rcp-fe-lol-home")[0]
        showcontainer.appendChild(SettingsDiv)
            SettingsDiv.append(SettingsIcon)

    SettingsDiv.addEventListener('click', () => {
        showcontainer.appendChild(SettingsTabMain)
            SettingsTabMain.append(SettingsNavbar)
            SettingsTabMain.append(SettingsContent)
            SettingsContent.append(SettingsGeneral)
                SettingsGeneral.append(Checkbox1)
                    Checkbox1.append(Input1)
                    Checkbox1.append(Label1)
                SettingsGeneral.append(Checkbox2)
                    Checkbox2.append(Input2)
                    Checkbox2.append(Label2)
                SettingsGeneral.append(Checkbox3)
                    Checkbox3.append(Input3)
                    Checkbox3.append(Label3)
                SettingsGeneral.append(Checkbox4)
                    Checkbox4.append(Input4)
                    Checkbox4.append(Label4)
                SettingsGeneral.append(Checkbox5)
                    Checkbox5.append(Input5)
                    Checkbox5.append(Label5)
                SettingsGeneral.append(Checkbox6)
                    Checkbox6.append(Input6)
                    Checkbox6.append(Label6)
                SettingsGeneral.append(Checkbox7)
                    Checkbox7.append(Input7)
                    Checkbox7.append(Label7)
        showcontainer.appendChild(closediv)
            closediv.append(close)
    })
    
    closediv.addEventListener('click', () => {
            document.getElementsByClassName("close-settings")[0].remove()
            document.getElementsByClassName("close-setting-div")[0].remove()
            document.getElementsByClassName("settings-navbar")[0].remove()
            document.getElementsByClassName("settings-content")[0].remove()
            document.getElementsByClassName("settings-tab-main")[0].remove()
    })

    SettingsDiv.classList.add("settings")
    SettingsIcon.classList.add("settings-icon")
    closediv.classList.add("close-setting-div")
    close.classList.add("close-settings")
    SettingsTabMain.classList.add("settings-tab-main")
    SettingsNavbar.classList.add("settings-navbar")
    SettingsContent.classList.add("settings-content")

    SettingsGeneral.classList.add("theme-settings-general")
    SettingsRow.classList.add("theme-settings-row")

    if (!DataStore.has('Checkbox1') && data["Receive-Update"]) {
        DataStore.set('Checkbox1', "checked")
    }
    else if (!DataStore.has('Checkbox1') && !data["Receive-Update"]) {
        DataStore.set('Checkbox1', 'none')
    }

    Checkbox1.setAttribute("for", "Receive-Update")
    Input1.setAttribute("slot", "input")
    Input1.setAttribute("type", "checkbox")
    Label1.setAttribute("slot", "label")
    Label1.innerHTML = "Receive update"
    Checkbox1.setAttribute("class", `${DataStore.get("Checkbox1")}`)
    Input1.addEventListener('click', () => {
        if (Checkbox1.getAttribute("class") == "checked") {
            Checkbox1.removeAttribute("class")
            DataStore.set("Checkbox1", 'none')
        }
        else {
            Checkbox1.setAttribute("class", "checked")
            DataStore.set("Checkbox1", 'checked')
        }
    })

    Checkbox2.setAttribute("class", "")
    Checkbox2.setAttribute("for", "Animate-Loading")
    Input2.setAttribute("slot", "input")
    Input2.setAttribute("type", "checkbox")
    Label2.setAttribute("slot", "label")
    Label2.innerHTML = "Animate loading"

    Checkbox3.setAttribute("class", "")
    Checkbox3.setAttribute("for", "Custom-Avatar")
    Input3.setAttribute("slot", "input")
    Input3.setAttribute("type", "checkbox")
    Label3.setAttribute("slot", "label")
    Label3.innerHTML = "Custom avatar"

    Checkbox4.setAttribute("class", "")
    Checkbox4.setAttribute("for", "Custom-Icon")
    Input4.setAttribute("slot", "input")
    Input4.setAttribute("type", "checkbox")
    Label4.setAttribute("slot", "label")
    Label4.innerHTML = "Custom icon"

    Checkbox5.setAttribute("class", "")
    Checkbox5.setAttribute("for", "Receive-Update")
    Input5.setAttribute("slot", "input")
    Input5.setAttribute("type", "checkbox")
    Label5.setAttribute("slot", "label")
    Label5.innerHTML = "Receive Update"

    Checkbox6.setAttribute("class", "")
    Checkbox6.setAttribute("for", "Sidebar-Transparent")
    Input6.setAttribute("slot", "input")
    Input6.setAttribute("type", "checkbox")
    Label6.setAttribute("slot", "label")
    Label6.innerHTML = "Sidebar transparent"

    Checkbox7.setAttribute("class", "")
    Checkbox7.setAttribute("for", "Hide-Champions-Splash-Art")
    Input7.setAttribute("slot", "input")
    Input7.setAttribute("type", "checkbox")
    Label7.setAttribute("slot", "label")
    Label7.innerHTML = "Hide champions splash art"


    SettingsIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/Settings.png")
    close.setAttribute('src', '//plugins/ElainaV2/assets/Icon/close.png')
}

function DeleteSettings () {
    try {
        document.getElementsByClassName("settings-icon")[0].remove()
        document.getElementsByClassName("settings")[0].remove()
        document.getElementsByClassName("close-settings")[0].remove()
        document.getElementsByClassName("close-setting-div")[0].remove()
        document.getElementsByClassName("settings-navbar")[0].remove()
        document.getElementsByClassName("settings-content")[0].remove()
        document.getElementsByClassName("settings-tab-main")[0].remove()
    }
    catch {}
}

let Settings = {
    ThemeSettings: ThemeSettings,
    DeleteSettings: DeleteSettings
}

export default Settings