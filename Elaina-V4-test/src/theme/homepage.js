/**
 * @name ElainaV4
 * @author Elaina Da Catto
 * @description Elaina theme for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

import LocalKey from "../updates/updateKeyLocal.js";
import utils from '../utils/utils.js';
import { handleElementMutation } from '../utils/observer.js';

const setAudioLoopIcon = (elem) => {
    const iconElement = elem || document.querySelector(".audio-loop-icon");
    if (!iconElement) return;
    iconElement.setAttribute("src", `${iconFolder}plugins-icons/${DataStore.get("audio-loop") ? 'rotating-arrow' : 'unrotating-arrow'}.png`);
};

const CONSOLE_STYLE = {
    prefix: '%c Elaina ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

const log = (message, ...args) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
const error = (message, ...args) => console.error(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);

let datapath = new URL("..", import.meta.url).href;
const iconFolder = `${datapath}assets/icon/`;
const bgFolder = `${datapath}assets/backgrounds/`;
let thisVersion, CdnKey;

DataStore.set("Font-folder", `${datapath}assets/fonts/`);
DataStore.set("Plugin-folder-name", getThemeName());

const defaultData = {
    "Wallpaper-list": ["elaina1.webm"],
    "Audio-list": ["Laur - その花は世界を紡ぐ.flac"],
    "wallpaper-index": 0,
    "audio-index": 0,
    "wallpaper-volume": 0.0,
    "audio-volume": 0.3,
    'mute-audio': false,
    "Playback-speed": 100,
    "Audio-currentTime": 0,
    "Wallpaper-currentTime": 0
};

const setDefaultData = (list) => {
    for (const [key, value] of Object.entries(list)) {
        if (!DataStore.has(key)) {
            DataStore.set(key, value);
            log(`${key} data restored`);
        }
    }
};

setDefaultData(defaultData);

window.setTimeout(async () => {
    const summonerID = await utils.getSummonerID();
    DataStore.set("Summoner-ID", summonerID);
    log(`%cCurrent summonerID: %c${summonerID}`, 'color: #e4c2b3', 'color: #0070ff');
}, 7000);

export function setHomePage(context) {
    context.rcp.postInit('rcp-fe-lol-navigation', async (api) => {
        window.__RCP_NAV_API = api;

        const originalCreate = api._apiHome.navigationManager.createSubNavigationFromJSON;
        api._apiHome.navigationManager.createSubNavigationFromJSON = async function (e, t, n) {
            console.dir(n);

            n.push({
                id: 'elaina-home',
                displayName: await getString("home"),
                isPlugin: false,
                enabled: true,
                visibile: true,
                priority: 1,
                url: 'https://elainatheme.xyz/',
            });

            return originalCreate.apply(this, [e, t, n]);
        };
    });

    context.rcp.postInit("rcp-fe-lol-navigation", async (api) => {
        const navigationManager = api._apiHome.navigationManager;
        api._apiHome.navigationManager = new Proxy(navigationManager, {
            set(target, property, value) {
                target[property] = (property === "firstNavItemId") ? 'elaina-home' : value;
                return true;
            }
        });
    });
}

if (DataStore.get("Dev-mode")) {
    CdnKey = (await import(`//plugins/${getThemeName()}/elaina-theme-data/src/update/updateKeyCdn.js`)).default;
    log('%c%cRunning Elaina theme - %cDev version', '', 'color: #e4c2b3', 'color: red');
} 
else {
    CdnKey = (await import(`https://unpkg.com/elaina-theme-data@latest/src/update/updateKeyCdn.js`)).default;
    log('%c%cRunning Elaina theme - %cStable version', '', 'color: #e4c2b3', 'color: #00ff44');
}

if (CdnKey == LocalKey) {
    //thisVersion = (await import("https://unpkg.com/elaina-theme-data@latest/src/update/version.js")).default;
    DataStore.set("Theme-version", thisVersion);
    if (!DataStore.get("Change-CDN-version")) {
        const cdnVersion = await (await fetch('https://unpkg.com/elaina-theme-data@latest/package.json')).json();
        DataStore.set("Cdn-version", cdnVersion["version"]);
    }
}
log(`%cTheme build: %c${DataStore.get("Theme-version")}`, 'color: #e4c2b3', 'color: #00ff44');
log(`%cCDN build  : %c${DataStore.get("Cdn-version")}`, 'color: #e4c2b3', 'color: #00ff44');

const hideTab = (data, obj, name) => {
    if (data) {
        try {
            const element = document.querySelector(obj);
            if (element) {
                element.style.display = "none";
                element.offsetHeight;
                log(`${name} tab deleted`);
            } else {
                error(`Element not found for ${name}`);
            }
        } catch (error) {
            error(`Error hiding ${name} tab:`, error);
        }
    }
};

const showTab = (data, obj, name) => {
    if (data) {
        try {
            document.querySelector(obj).style.display = "block";
        } catch {
            error(`This client doesn't have ${name} tab`);
        }
    }
};

const applyHidetab = () => {
    hideTab(DataStore.get("hide-overview"), 'lol-uikit-navigation-item[item-id="overview"]', "Overview");
    hideTab(DataStore.get("hide-merch"), 'lol-uikit-navigation-item[item-id="merch"]', "Merch");
    hideTab(DataStore.get("hide-patch-note"), 'lol-uikit-navigation-item[item-id="latest_patch_notes"]', "Patch note");
    hideTab(DataStore.get("hide-esport"), 'lol-uikit-navigation-item[item-id="news"]', "Esport");
};

const applyShowtab = () => {
    showTab(!DataStore.get("hide-overview"), 'lol-uikit-navigation-item[item-id="overview"]', "Overview");
    showTab(!DataStore.get("hide-merch"), 'lol-uikit-navigation-item[item-id="merch"]', "Merch");
    showTab(!DataStore.get("hide-patch-note"), 'lol-uikit-navigation-item[item-id="latest_patch_notes"]', "Patch note");
    showTab(!DataStore.get("hide-esport"), 'lol-uikit-navigation-item[item-id="news"]', "Esport");
};

const deleteNavbarTab = () => {
    const intervalId = window.setInterval(() => {
        const overviewTab = document.querySelector('lol-uikit-navigation-item[item-id="overview"]');
        if (overviewTab) {
            window.clearInterval(intervalId);
            applyHidetab();
        }
    }, 1000);
};

const elainaPlayPause = () => {
    const elainaBgElem = document.getElementById("elaina-bg");
    DataStore.get('pause-wallpaper') % 2 === 0 ? elainaBgElem.pause() : elainaBgElem.play();
};

const playPauseSetIcon = (elem) => {
    const pauseBgIcon = elem || document.querySelector(".pause-bg-icon");
    if (!pauseBgIcon) return;
    pauseBgIcon.setAttribute("src", `${iconFolder}plugins-icons/${DataStore.get('pause-wallpaper') % 2 === 0 ? 'play_button' : 'pause_button'}.png`);
};

const audioPlayPause = () => {
    const audio = document.getElementById("bg-audio");
    DataStore.get('pause-audio') % 2 === 0 ? audio.pause() : audio.play();
    changeSongName()
};

const playPauseSetIconAudio = (elem) => {
    const pauseAudioIcon = elem || document.querySelector(".pause-audio-icon");
    if (!pauseAudioIcon) return;
    pauseAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/${DataStore.get('pause-audio') % 2 === 0 ? 'play_button' : 'pause_button'}.png`);
};

const audioMute = () => {
    const audio = document.getElementById("bg-audio");
    const wallpaperAudio = document.getElementById("elaina-bg");
    const isMuted = DataStore.get("mute-audio");
    wallpaperAudio.muted = isMuted;
    audio.muted = isMuted;
    log(`%caudio and wallpaper mute: %c${isMuted}`, '', isMuted ? 'color: #00ff44' : 'color: red');
};

const muteSetIconAudio = (elem) => {
    const muteAudioIcon = elem || document.querySelector(".mute-audio-icon");
    if (!muteAudioIcon) return;
    muteAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/${DataStore.get("mute-audio") ? 'mute' : 'audio'}.png`);
};

const toggleAudioLoop = () => {
    const audio = document.getElementById("bg-audio");
    if (DataStore.get('audio-loop')) {
        audio.removeEventListener("ended", nextSong);
        audio.addEventListener("ended", () => {
            audio.pause();
            audio.load();
        });
    } else {
        audio.addEventListener("ended", nextSong);
    }
};

const loadBG = (BG) => {
    const elainaBg = document.getElementById("elaina-bg");
    elainaBg.src = `${bgFolder}wallpapers/${BG}`;
    elainaBg.playbackRate = DataStore.get("Playback-speed") / 100;
};

const loadSong = (song) => {
    const audio = document.getElementById("bg-audio");
    audio.src = `${bgFolder}audio/${song}`;
};

const nextWallpaper = () => {
    const elainaBg = document.getElementById("elaina-bg");
    elainaBg.classList.add("webm-hidden");

    DataStore.set('wallpaper-index', DataStore.get('wallpaper-index') + 1);
    if (DataStore.get('wallpaper-index') > DataStore.get("Wallpaper-list").length - 1) {
        DataStore.set('wallpaper-index', 0);
    }
    log(`Now playing $c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}`, 'color: #0070ff');

    setTimeout(() => {
        loadBG(DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]);
        elainaPlayPause();
        elainaBg.classList.remove("webm-hidden");
    }, 500);
};

const prevWallpaper = () => {
    const elainaBg = document.getElementById("elaina-bg");
    elainaBg.classList.add("webm-hidden");

    DataStore.set('wallpaper-index', DataStore.get('wallpaper-index') - 1);
    if (DataStore.get('wallpaper-index') < 0) {
        DataStore.set('wallpaper-index', DataStore.get("Wallpaper-list").length - 1);
    }
    log(`Now playing %c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}`, 'color: #0070ff');

    setTimeout(() => {
        loadBG(DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]);
        elainaPlayPause();
        elainaBg.classList.remove("webm-hidden");
    }, 500);
};

const nextSong = () => {
    if (DataStore.get("Continues_Audio")) {
        DataStore.set('audio-index', DataStore.get('audio-index') + 1);

        if (DataStore.get('audio-index') > DataStore.get("Audio-list").length - 1) {
            DataStore.set('audio-index', 0);
        }
        loadSong(DataStore.get("Audio-list")[DataStore.get('audio-index')]);
        audioPlayPause();
        changeSongName();
        log(`Now playing %c${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`, 'color: #0070ff');
    }
};

const prevSong = () => {
    if (DataStore.get("Continues_Audio")) {
        DataStore.set('audio-index', DataStore.get('audio-index') - 1);

        if (DataStore.get('audio-index') < 0) {
            DataStore.set('audio-index', DataStore.get("Audio-list").length - 1);
        }
        loadSong(DataStore.get("Audio-list")[DataStore.get('audio-index')]);
        audioPlayPause();
        changeSongName();
        log(`Now playing %c${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`, 'color: #0070ff');
    }
};

const changeSongName = ()=> {
    let currentSong = DataStore.get("Audio-list")[DataStore.get('audio-index')]
    let songNameText = document.querySelector(".audio-name-bar > p")
    DataStore.get('pause-audio') % 2 === 0 
        ? songNameText.innerHTML = `Paused: <br/>${currentSong}`
        : songNameText.innerHTML = `On playing: <br/>${currentSong}`
}

const createWebmButtons = () => {
    const container = document.createElement("div");
    const musicControlsMain = document.createElement("div");
    const musicControls = document.createElement("div");
    const wallpaperControls = document.createElement("div");
    const pauseBg = document.createElement("div");
    const nextBg = document.createElement("div");
    const prevBg = document.createElement("div");
    const pauseAudio = document.createElement("div");
    const nextAudio = document.createElement("div");
    const prevAudio = document.createElement("div");
    const muteAudio = document.createElement("div");
    const audioLoop = document.createElement("div");
    const progressBar = document.createElement("div");
    const progress = document.createElement("div");
    const audioNameBar = document.createElement("div")
    const pauseBgIcon = document.createElement("img");
    const nextBgIcon = document.createElement("img");
    const prevBgIcon = document.createElement("img");
    const pauseAudioIcon = document.createElement("img");
    const nextAudioIcon = document.createElement("img");
    const prevAudioIcon = document.createElement("img");
    const muteAudioIcon = document.createElement("img");
    const audioLoopIcon = document.createElement("img");
    const bgDropdown = document.createElement("lol-uikit-framed-dropdown");
    const audio = document.getElementById('bg-audio');
    const audioName = document.createElement("p")

    container.classList.add("webm-bottom-buttons-container");
    musicControlsMain.classList.add("music-controls-main");
    musicControls.classList.add("music-controls");
    wallpaperControls.classList.add("wallpaper-controls");
    progressBar.classList.add("progress-bar");
    progress.classList.add("progress-status");
    audioNameBar.classList.add("audio-name-bar")

    progress.style.width = `${(audio.currentTime / audio.duration) * 100 + 1}%`;

    pauseBg.id = "pause-bg";
    nextBg.id = "next-bg";
    prevBg.id = "prev-bg";
    pauseAudio.id = "pause-audio";
    nextAudio.id = "next-audio";
    prevAudio.id = "prev-audio";
    muteAudio.id = "mute-audio";
    audioLoop.id = "audio-loop";
    bgDropdown.id = "bgdropdown";
    audioName.id = "audio-name"

    pauseBgIcon.classList.add("pause-bg-icon");
    nextBgIcon.classList.add("next-bg-icon");
    prevBgIcon.classList.add("prev-bg-icon");
    pauseAudioIcon.classList.add("pause-audio-icon");
    nextAudioIcon.classList.add("next-audio-icon");
    prevAudioIcon.classList.add("prev-audio-icon");
    muteAudioIcon.classList.add("mute-audio-icon");
    audioLoopIcon.classList.add("audio-loop-icon");

    playPauseSetIconAudio(pauseAudioIcon);
    playPauseSetIcon(pauseBgIcon);
    muteSetIconAudio(muteAudioIcon);
    setAudioLoopIcon(audioLoopIcon);

    nextBgIcon.setAttribute("src", `${iconFolder}plugins-icons/next_button.png`);
    prevBgIcon.setAttribute("src", `${iconFolder}plugins-icons/prev_button.png`);
    nextAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/next-audio.png`);
    prevAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/prev-audio.png`);

    DataStore.get('pause-audio') % 2 === 0 
        ? audioName.innerHTML = `Paused: <br/>${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`
        : audioName.innerHTML = `On playing: <br/>${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`

    // Music controls
    musicControlsMain.append(audioNameBar, musicControls);
    musicControls.append(muteAudio, prevAudio, pauseAudio, nextAudio, audioLoop)
    muteAudio.append(muteAudioIcon);
    pauseAudio.append(pauseAudioIcon);
    prevAudio.append(prevAudioIcon);
    nextAudio.append(nextAudioIcon);
    audioLoop.append(audioLoopIcon);
    audioNameBar.append(audioName)

    // Wallpaper controls
    if (DataStore.get("old-prev/next-button")) {
        wallpaperControls.append(prevBg, pauseBg, nextBg);
        nextBg.append(nextBgIcon);
        prevBg.append(prevBgIcon);
    } else {
        const newBgChange = document.createElement("div");
        newBgChange.id = "newbgchange";
        newBgChange.append(bgDropdown);
        wallpaperControls.append(newBgChange, pauseBg);

        DataStore.get("Wallpaper-list").forEach((opt, id) => {
            const el = document.createElement("lol-uikit-dropdown-option");
            el.setAttribute("slot", "lol-uikit-dropdown-option");
            el.innerText = opt;
            el.onclick = () => {
                const elainaBg = document.getElementById("elaina-bg");
                elainaBg.classList.add("webm-hidden");
                DataStore.set('wallpaper-index', id);
                log(`Now playing %c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}`, 'color: #0070ff');

                setTimeout(() => {
                    loadBG(DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]);
                    elainaPlayPause();
                    elainaBg.classList.remove("webm-hidden");
                }, 500);
            };
            if (DataStore.get('wallpaper-index') === id) {
                el.setAttribute("selected", "true");
            }
            bgDropdown.appendChild(el);
        });
    }
    pauseBg.append(pauseBgIcon);

    // Append controls to the container
    progressBar.append(progress);
    container.append(musicControlsMain, progressBar);

    // Append container and wallpaper controls separately to maintain original positions
    const showContainer = document.querySelector(".rcp-fe-lol-home");
    showContainer.append(container, wallpaperControls);

    audio.addEventListener('timeupdate', () => {
        progress.style.width = `${(audio.currentTime / audio.duration) * 100 + 1}%`;
    });

    // Event delegation for dynamically created elements
    container.addEventListener('click', (event) => {
        if (event.target.closest('#pause-audio')) {
            DataStore.set('pause-audio', DataStore.get('pause-audio') + 1);
            audioPlayPause();
            playPauseSetIconAudio();
        }
        if (event.target.closest('#mute-audio')) {
            DataStore.set("mute-audio", !DataStore.get("mute-audio"));
            audioMute();
            muteSetIconAudio();
        }
        if (event.target.closest('#audio-loop')) {
            DataStore.set("audio-loop", !DataStore.get("audio-loop"));
            toggleAudioLoop();
            setAudioLoopIcon();
        }
        if (event.target.closest('#next-audio')) {
            nextSong();
        }
        if (event.target.closest('#prev-audio')) {
            prevSong();
        }
    });

    wallpaperControls.addEventListener('click', (event) => {
        if (event.target.closest('#pause-bg')) {
            DataStore.set('pause-wallpaper', DataStore.get('pause-wallpaper') + 1);
            elainaPlayPause();
            playPauseSetIcon();
        }
        if (event.target.closest('#next-bg')) {
            DataStore.set("NextBg_Count", DataStore.get("NextBg_Count") + 1);
            nextWallpaper();
            if (DataStore.get("NextBg_Count") >= 69 && DataStore.get("NSFW-Content")) {
                window.open("https://elainatheme.xyz/elaina_nsfw/easteregg1", "_blank");
                DataStore.set("NextBg_Count", 0);
            }
        }
        if (event.target.closest('#prev-bg')) {
            prevWallpaper();
        }
    });
};

const deleteButtons = () => {
    document.querySelector(".webm-bottom-buttons-container").remove();
    document.querySelector(".wallpaper-controls").remove();
};

const loadWallpaperAndMusic = () => {
    const video = document.createElement('video');
    video.id = 'elaina-bg';
    video.autoplay = true;
    video.volume = DataStore.get("wallpaper-volume");
    video.muted = DataStore.get("mute-audio");
    video.currentTime = DataStore.get("Wallpaper-currentTime");
    try {
        video.src = `${bgFolder}wallpapers/${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]}`;
        video.playbackRate = DataStore.get("Playback-speed") / 100;
    } catch {}
    video.addEventListener("error", () => {
        video.load();
        video.addEventListener("ended", () => video.load());
        DataStore.set("video-2nd-loop", true);
    });
    if (DataStore.get("video-2nd-loop")) {
        video.addEventListener("ended", () => video.load());
    } else {
        video.loop = true;
    }

    const audio = document.createElement("audio");
    audio.id = 'bg-audio';
    audio.autoplay = true;
    audio.src = `${bgFolder}audio/${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`;
    audio.volume = DataStore.get("audio-volume");
    audio.muted = DataStore.get("mute-audio");
    audio.currentTime = DataStore.get("Audio-currentTime");
    if (DataStore.get('audio-loop')) {
        audio.addEventListener("ended", () => audio.load());
    } else {
        audio.addEventListener("ended", nextSong);
    }
    audio.addEventListener("error", () => audio.load());

    document.body.prepend(video, audio);
    elainaPlayPause();

    // const updateTime = () => {
    //     if (audio.currentTime !== DataStore.get("Audio-currentTime")) {
    //         DataStore.set("Audio-currentTime", audio.currentTime);
    //     }
    //     if (video.currentTime !== DataStore.get("Wallpaper-currentTime")) {
    //         DataStore.set("Wallpaper-currentTime", video.currentTime);
    //     }
    //     requestAnimationFrame(updateTime);
    // };
    // requestAnimationFrame(updateTime);    
};

let previous_page = '';
let runtime = 0;

let debounceTimer;

const addHomepage = async (node) => {
    if (!document.querySelector(".rcp-fe-lol-home")) return;
    
    const pagename = node.getAttribute("data-screen-name");
    const isHomePage = pagename === "rcp-fe-lol-home-main";
    const isOtherPage = !["rcp-fe-lol-navigation-screen", "window-controls", "rcp-fe-lol-home", "social"].includes(pagename);

    if (isHomePage) {
        if (!document.querySelector(".webm-bottom-buttons-container")) {
            createWebmButtons();
            document.querySelector(".webm-bottom-buttons-container").setAttribute("class", "webm-bottom-buttons-container-hovered")
            window.setTimeout(()=> {document.querySelector(".webm-bottom-buttons-container-hovered").setAttribute("class", "webm-bottom-buttons-container")},2000)
        }
        deleteNavbarTab();
    } else if (isOtherPage && document.querySelector(".webm-bottom-buttons-container")) {
        deleteButtons();
    }

    if (pagename === "rcp-fe-lol-uikit-full-page-modal-controller") {
        return;
    }

    if (pagename === "rcp-fe-lol-store") {
        runtime = 0;
        const mutationConfig = {
            id: new Map(),
            tag: new Map(),
            class: new Map([
                ['item-page-items-container-wrapper', [(elem) => {
                    elem.style.background = "transparent";
                }]],
                ['purchase-history-page-content-wrapper', [(elem) => {
                    elem.style.background = "transparent";
                }]]
            ])
        };

        const modifyStoreIframe = () => {
            const storeIframe = document.querySelector('#rcp-fe-lol-store-iframe > iframe[referrerpolicy="no-referrer-when-downgrade"]');
            if (storeIframe && storeIframe.contentWindow) {
                try {
                    handleElementMutation(storeIframe.contentWindow.document.body, true, mutationConfig);
                    const th = storeIframe.contentWindow.document.querySelectorAll("div > div > table > thead > tr > th");
                    th.forEach(header => {
                        header.style.background = "transparent";
                    });
                    runtime++;
                    console.log(`Store iframe modified (${runtime} times)`);
                } catch (mutationError) {
                    console.error("Error in handleElementMutation:", mutationError);
                }
            }
        };

        const debouncedModifyStoreIframe = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(modifyStoreIframe, 500); 
        };

        modifyStoreIframe();

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(mutation => 
                mutation.type === 'childList' && 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.classList.contains('item-page-items-container-wrapper') || 
                     node.classList.contains('purchase-history-page-content-wrapper'))
                )
            )) {
                debouncedModifyStoreIframe();
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);

        window.storeObserver = observer;
    } else if (previous_page === "rcp-fe-lol-store") {
        if (window.storeObserver) {
            window.storeObserver.disconnect();
            window.storeObserver = null;
        }
        clearTimeout(debounceTimer);
    }

    log("%c%cCleared Background (" + `%c${runtime}%c)`, '', "color: #e4c2b3", "color: #0070ff", "color: #e4c2b3");

    if (previous_page !== pagename) previous_page = pagename;
};


window.addEventListener("load", async () => {
    const initializeUI = () => {
        if (document.querySelector(".rcp-fe-lol-home")) {
            loadWallpaperAndMusic();
            createWebmButtons();
            utils.mutationObserverAddCallback(addHomepage, ["screen-root"]);
            utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
                const phase = JSON.parse(message["data"])[2]["data"];
                if (phase === "GameStart" || phase === "InProgress") {
                    if (DataStore.get("turnoff-audio-ingame")) {
                        document.getElementById("elaina-bg").pause();
                        document.getElementById("bg-audio").pause();
                    }
                } else {
                    elainaPlayPause();
                    audioPlayPause();
                }
            });
            deleteNavbarTab();
            clearInterval(initializationInterval);
        }
    };

    const initializationInterval = setInterval(initializeUI, 1000);
});


const logDebuggingInfo = () => {
    const loopWallCss = DataStore.get("audio-loop") ? "color: #00ff44" : "color: red";
    const muteCss = DataStore.get("mute-audio") ? "color: #00ff44" : "color: red";
    const pauseWall = DataStore.get('pause-wallpaper') % 2 === 0 ? "color: #00ff44" : "color: red";
    const pauseAudio = DataStore.get('pause-audio') % 2 === 0 ? "color: #00ff44" : "color: red";

    if (DataStore.get("Continues_Audio")) {
        log(`%cNow playing %c${DataStore.get("Wallpaper-list")[DataStore.get('wallpaper-index')]} %cand %c${DataStore.get("Audio-list")[DataStore.get('audio-index')]}`, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', 'color: #0070ff');
        log(`%ccurrent wallpaper status: pause: %c${DataStore.get('pause-wallpaper') % 2 === 0}%c, play/pause-time: %c${DataStore.get('pause-wallpaper')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %ctrue%c, volume: %c${DataStore.get("wallpaper-volume") * 100}%`, 'color: #e4c2b3', pauseWall, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', muteCss, 'color: #e4c2b3', 'color: #00ff44', 'color: #e4c2b3', 'color: #0070ff');
        log(`%ccurrent audio status: pause: %c${DataStore.get('pause-audio') % 2 === 0}%c, play/pause-time: %c${DataStore.get('pause-audio')}%c, mute: %c${DataStore.get("mute-audio")}%c, loop: %c${DataStore.get("audio-loop")}%c, volume: %c${DataStore.get("audio-volume") * 100}%`, 'color: #e4c2b3', pauseAudio, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', muteCss, 'color: #e4c2b3', loopWallCss, 'color: #e4c2b3', 'color: #0070ff');
    }
};

logDebuggingInfo();

window.del_webm_buttons = deleteButtons;
window.create_webm_buttons = createWebmButtons;
window.applyHidetab = applyHidetab;
window.applyShowtab = applyShowtab;