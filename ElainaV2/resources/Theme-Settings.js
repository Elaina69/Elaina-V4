function ThemeSettings () {
    const SettingsDiv     = document.createElement("div")
    const SettingsIcon    = document.createElement('img')
    const closediv        = document.createElement("div")
    const close           = document.createElement("img")
    const SettingsTabMain = document.createElement("div")
    const SettingsNavbar    = document.createElement("lol-uikit-scrollable")
    const SettingsContent    = document.createElement("lol-uikit-scrollable")

    SettingsDiv.classList.add("settings")
    SettingsIcon.classList.add("settings-icon")
    closediv.classList.add("close-setting-div")
    close.classList.add("close-settings")
    SettingsTabMain.classList.add("settings-tab-main")
    SettingsNavbar.classList.add("settings-navbar")
    SettingsContent.classList.add("settings-content")

    SettingsIcon.setAttribute("src", "//plugins/ElainaV2/assets/Icon/Settings.png")
    close.setAttribute('src', '//plugins/ElainaV2/assets/Icon/close.png')

    let showcontainer = document.getElementsByClassName("rcp-fe-lol-home")[0]
        showcontainer.appendChild(SettingsDiv)
            SettingsDiv.append(SettingsIcon)

    SettingsDiv.addEventListener('click', () => {
        showcontainer.appendChild(SettingsTabMain)
            SettingsTabMain.append(SettingsNavbar)
            SettingsTabMain.append(SettingsContent)
        showcontainer.appendChild(closediv)
            closediv.append(close)


        closediv.addEventListener('click', () => {
            document.getElementsByClassName("close-settings")[0].remove()
            document.getElementsByClassName("close-setting-div")[0].remove()
            document.getElementsByClassName("settings-navbar")[0].remove()
            document.getElementsByClassName("settings-content")[0].remove()
            document.getElementsByClassName("settings-tab-main")[0].remove()
        })
    })
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