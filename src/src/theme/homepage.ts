/**
 * @name ElainaV4
 * @author Elaina Da Catto
 * @description Elaina theme for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

import LocalKey from "../updates/updateKeyLocal.ts";
import utils from '../utils/utils.ts';
import { handleElementMutation } from '../utils/observer.ts';

const CONSOLE_STYLE = {
    prefix: '%c Elaina ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

const log = (message: string, ...args: string[]) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
const error = (message: string, ...args: string[]) => console.error(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);

let datapath: string = `//plugins/${window.getThemeName()}/`
const iconFolder: string = `${datapath}assets/icon/`;
const bgFolder: string = `${datapath}assets/backgrounds/`;
let CdnKey: number;

window.DataStore.set("Font-folder", `${datapath}assets/fonts/`);
window.DataStore.set("Plugin-folder-name", window.getThemeName());

const defaultData = {
    "Wallpaper-list": ["elaina1.webm", "elaina2.jpg"],
    "Audio-list": ["Laur - その花は世界を紡ぐ.flac", "Laur - その花は世界を紡ぐ.flac"],
    "wallpaper-index": 0,
    "audio-index": 0,
    "wallpaper-volume": 0.0,
    "audio-volume": 0.15,
    'mute-audio': false,
    "Playback-speed": 100,
    "Audio-currentTime": 0,
    "Wallpaper-currentTime": 0
};

const setDefaultData = (list: Object) => {
    for (const [key, value] of Object.entries(list)) {
        if (!window.DataStore.has(key)) {
            window.DataStore.set(key, value);
            log(`${key} data restored`);
        }
    }
};

setDefaultData(defaultData);

// Get Summoner ID
window.setTimeout(async () => {
    const summonerID: number = await utils.getSummonerID();
    window.DataStore.set("Summoner-ID", summonerID);
    log(`%cCurrent summonerID: %c${summonerID}`, 'color: #e4c2b3', 'color: #0070ff');
}, 7000);

export function setHomePage(context: any) {
    context.rcp.postInit('rcp-fe-lol-navigation', async (api: any) => {
        //@ts-ignore
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

const setAudioLoopIcon = (elem: any = document.querySelector(".audio-loop-icon")) => {
    const iconElement = elem;
    if (!iconElement) return;
    iconElement.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get("audio-loop") ? 'rotating-arrow' : 'unrotating-arrow'}.png`);
};

if (window.DataStore.get("Dev-mode")) {
    CdnKey = (await import(`//plugins/${window.getThemeName()}/elaina-theme-data/src/update/updateKeyCdn.js`)).default;
    log('%c%cRunning Elaina theme - %cDev version', '', 'color: #e4c2b3', 'color: red');
} 
else {
    //@ts-ignore
    CdnKey = (await import(`https://unpkg.com/elaina-theme-data@latest/src/update/updateKeyCdn.js`)).default;
    log('%c%cRunning Elaina theme - %cStable version', '', 'color: #e4c2b3', 'color: #00ff44');
}

if (CdnKey == LocalKey) {
    //@ts-ignore
    window.DataStore.set("Theme-version", (await import("https://unpkg.com/elaina-theme-data@latest/src/update/version.js")).default);
    if (!window.DataStore.get("Change-CDN-version")) {
        const cdnVersion = await (await fetch('https://unpkg.com/elaina-theme-data@latest/package.json')).json();
        window.DataStore.set("Cdn-version", cdnVersion["version"]);
    }
}
log(`%cTheme build: %c${window.DataStore.get("Theme-version")}`, 'color: #e4c2b3', 'color: #00ff44');
log(`%cCDN build  : %c${window.DataStore.get("Cdn-version")}`, 'color: #e4c2b3', 'color: #00ff44');

const hideTab = (data: any, obj: any, name: any) => {
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
        } catch (error: any) {
            error(`Error hiding ${name} tab:`, error);
        }
    }
};

const showTab = (data: any, obj: any, name: any) => {
    if (data) {
        try {
            document.querySelector(obj).style.display = "block";
        } catch {
            error(`This client doesn't have ${name} tab`);
        }
    }
};

const applyHidetab = () => {
    hideTab(window.DataStore.get("hide-overview"), 'lol-uikit-navigation-item[item-id="overview"]', "Overview");
    hideTab(window.DataStore.get("hide-merch"), 'lol-uikit-navigation-item[item-id="merch"]', "Merch");
    hideTab(window.DataStore.get("hide-patch-note"), 'lol-uikit-navigation-item[item-id="latest_patch_notes"]', "Patch note");
    hideTab(window.DataStore.get("hide-esport"), 'lol-uikit-navigation-item[item-id="news"]', "Esport");
};

const applyShowtab = () => {
    showTab(!window.DataStore.get("hide-overview"), 'lol-uikit-navigation-item[item-id="overview"]', "Overview");
    showTab(!window.DataStore.get("hide-merch"), 'lol-uikit-navigation-item[item-id="merch"]', "Merch");
    showTab(!window.DataStore.get("hide-patch-note"), 'lol-uikit-navigation-item[item-id="latest_patch_notes"]', "Patch note");
    showTab(!window.DataStore.get("hide-esport"), 'lol-uikit-navigation-item[item-id="news"]', "Esport");
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
    const elainaBgElem: any = document.getElementById("elaina-bg");
    window.DataStore.get('pause-wallpaper') % 2 === 0 ? elainaBgElem.pause() : elainaBgElem.play();
};

const playPauseSetIcon = (elem: any = document.querySelector(".pause-bg-icon")) => {
    const pauseBgIcon = elem;
    if (!pauseBgIcon) return;
    pauseBgIcon.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get('pause-wallpaper') % 2 === 0 ? 'play_button' : 'pause_button'}.png`);
};

const audioPlayPause = () => {
    const audio: any = document.getElementById("bg-audio");
    window.DataStore.get('pause-audio') % 2 === 0 ? audio.pause() : audio.play();
    changeSongName()
};

const playPauseSetIconAudio = (elem: any = document.querySelector(".pause-audio-icon")) => {
    const pauseAudioIcon = elem;
    if (!pauseAudioIcon) return;
    pauseAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get('pause-audio') % 2 === 0 ? 'play_button' : 'pause_button'}.png`);
};

const audioMute = () => {
    const audio: any = document.getElementById("bg-audio");
    const wallpaperAudio: any = document.getElementById("elaina-bg");
    const isMuted = window.DataStore.get("mute-audio");
    wallpaperAudio.muted = isMuted;
    audio.muted = isMuted;
    log(`%caudio and wallpaper mute: %c${isMuted}`, '', isMuted ? 'color: #00ff44' : 'color: red');
};

const muteSetIconAudio = (elem: any = document.querySelector(".mute-audio-icon")) => {
    const muteAudioIcon = elem;
    if (!muteAudioIcon) return;
    muteAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get("mute-audio") ? 'mute' : 'audio'}.png`);
};

const toggleAudioLoop = () => {
    const audio: any = document.getElementById("bg-audio");
    if (window.DataStore.get('audio-loop')) {
        audio.removeEventListener("ended", nextSong);
        audio.addEventListener("ended", () => {
            audio.pause();
            audio.load();
        });
    } else {
        audio.addEventListener("ended", nextSong);
    }
};

const loadBG = (BG: string) => {
    const elainaBg: any = document.getElementById("elaina-bg");
    const elainaStaticBg: any = document.getElementById("elaina-static-bg");
    elainaBg.src = `${bgFolder}wallpapers/${BG}`;
    elainaStaticBg.src = `${bgFolder}wallpapers/${BG}`;
    elainaBg.playbackRate = window.DataStore.get("Playback-speed") / 100;
};

const loadSong = (song) => {
    const audio: any = document.getElementById("bg-audio");
    audio.src = `${bgFolder}audio/${song}`;
};

const nextWallpaper = () => {
    const elainaBg: any = document.getElementById("elaina-bg");
    elainaBg.classList.add("webm-hidden");
    const elainaStaticBg: any = document.getElementById("elaina-static-bg");
    elainaStaticBg.classList.add("webm-hidden");

    window.DataStore.set('wallpaper-index', window.DataStore.get('wallpaper-index') + 1);
    if (window.DataStore.get('wallpaper-index') > window.DataStore.get("Wallpaper-list").length - 1) {
        window.DataStore.set('wallpaper-index', 0);
    }
    log(`Now playing $c${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]}`, 'color: #0070ff');

    setTimeout(() => {
        loadBG(window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]);
        elainaPlayPause();
        elainaBg.classList.remove("webm-hidden");
        elainaStaticBg.classList.remove("webm-hidden");
    }, 500);
};

const prevWallpaper = () => {
    const elainaBg: any = document.getElementById("elaina-bg");
    elainaBg.classList.add("webm-hidden");
    const elainaStaticBg: any = document.getElementById("elaina-static-bg");
    elainaStaticBg.classList.add("webm-hidden");

    window.DataStore.set('wallpaper-index', window.DataStore.get('wallpaper-index') - 1);
    if (window.DataStore.get('wallpaper-index') < 0) {
        window.DataStore.set('wallpaper-index', window.DataStore.get("Wallpaper-list").length - 1);
    }
    log(`Now playing %c${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]}`, 'color: #0070ff');

    setTimeout(() => {
        loadBG(window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]);
        elainaPlayPause();
        elainaBg.classList.remove("webm-hidden");
        elainaStaticBg.classList.remove("webm-hidden");
    }, 500);
};

const nextSong = () => {
    if (window.DataStore.get("Continues_Audio")) {
        window.DataStore.set('audio-index', window.DataStore.get('audio-index') + 1);

        if (window.DataStore.get('audio-index') > window.DataStore.get("Audio-list").length - 1) {
            window.DataStore.set('audio-index', 0);
        }
        loadSong(window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]);
        audioPlayPause();
        changeSongName();
        log(`Now playing %c${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`, 'color: #0070ff');
    }
};

const prevSong = () => {
    if (window.DataStore.get("Continues_Audio")) {
        window.DataStore.set('audio-index', window.DataStore.get('audio-index') - 1);

        if (window.DataStore.get('audio-index') < 0) {
            window.DataStore.set('audio-index', window.DataStore.get("Audio-list").length - 1);
        }
        loadSong(window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]);
        audioPlayPause();
        changeSongName();
        log(`Now playing %c${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`, 'color: #0070ff');
    }
};

const changeSongName = ()=> {
    let currentSong = window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]
    let songNameText: any = document.querySelector(".audio-name-bar > p")
    window.DataStore.get('pause-audio') % 2 === 0 
        ? songNameText.innerHTML = `Paused: <br/>${currentSong}`
        : songNameText.innerHTML = `Now playing: <br/>${currentSong}`
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
    const audioNameBar = document.createElement("div");
    const pauseBgIcon = document.createElement("img");
    const nextBgIcon = document.createElement("img");
    const prevBgIcon = document.createElement("img");
    const pauseAudioIcon = document.createElement("img");
    const nextAudioIcon = document.createElement("img");
    const prevAudioIcon = document.createElement("img");
    const muteAudioIcon = document.createElement("img");
    const audioLoopIcon = document.createElement("img");
    const bgDropdown: any = document.createElement("lol-uikit-framed-dropdown");
    const audio: any = document.getElementById('bg-audio');
    const audioName = document.createElement("p");

    container.classList.add("webm-bottom-buttons-container");
    musicControlsMain.classList.add("music-controls-main");
    musicControls.classList.add("music-controls");
    wallpaperControls.classList.add("wallpaper-controls");
    progressBar.classList.add("progress-bar");
    progress.classList.add("progress-status");
    audioNameBar.classList.add("audio-name-bar");

    progress.style.width = audio && audio.duration ? `${(audio.currentTime / audio.duration) * 100 + 1}%` : '0%';

    pauseBg.id = "pause-bg";
    nextBg.id = "next-bg";
    prevBg.id = "prev-bg";
    pauseAudio.id = "pause-audio";
    nextAudio.id = "next-audio";
    prevAudio.id = "prev-audio";
    muteAudio.id = "mute-audio";
    audioLoop.id = "audio-loop";
    bgDropdown.id = "bgdropdown";
    audioName.id = "audio-name";

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

    window.DataStore.get('pause-audio') % 2 === 0 
        ? audioName.innerHTML = `Paused: <br/>${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`
        : audioName.innerHTML = `Now playing: <br/>${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`

    // Music controls
    musicControlsMain.append(audioNameBar, musicControls);
    musicControls.append(muteAudio, prevAudio, pauseAudio, nextAudio, audioLoop);
    muteAudio.append(muteAudioIcon);
    pauseAudio.append(pauseAudioIcon);
    prevAudio.append(prevAudioIcon);
    nextAudio.append(nextAudioIcon);
    audioLoop.append(audioLoopIcon);
    audioNameBar.append(audioName);

    // Wallpaper controls
    if (window.DataStore.get("old-prev/next-button")) {
        wallpaperControls.append(prevBg, pauseBg, nextBg);
        nextBg.append(nextBgIcon);
        prevBg.append(prevBgIcon);
    } else {
        const newBgChange = document.createElement("div");
        newBgChange.id = "newbgchange";
        newBgChange.append(bgDropdown);
        wallpaperControls.append(newBgChange, pauseBg);

        window.DataStore.get("Wallpaper-list").forEach((opt, id) => {
            const el = document.createElement("lol-uikit-dropdown-option");
            el.setAttribute("slot", "lol-uikit-dropdown-option");
            el.innerText = opt;
            el.onclick = () => {
                const elainaBg: any = document.getElementById("elaina-bg");
                elainaBg.classList.add("webm-hidden");
                const elainaStaticBg: any = document.getElementById("elaina-static-bg");
                elainaStaticBg.classList.add("webm-hidden");

                window.DataStore.set('wallpaper-index', id);
                log(`Now playing %c${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]}`, 'color: #0070ff');

                setTimeout(() => {
                    loadBG(window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]);
                    elainaPlayPause();
                    elainaBg.classList.remove("webm-hidden");
                    elainaStaticBg.classList.remove("webm-hidden");
                }, 500);
            };
            if (window.DataStore.get('wallpaper-index') === id) {
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
    if (showContainer) {
        showContainer.append(container, wallpaperControls);
    } else {
        console.error("Could not find the container '.rcp-fe-lol-home' to append controls.");
    }

    // Create volume slider container
    const volumeSliderContainer = document.createElement("div");
    const volumeSlider: any = document.createElement("input");
    const muteUnmuteButton = document.createElement("div");
    const muteUnmuteIcon = document.createElement("img");

    volumeSliderContainer.classList.add("volume-slider-container");
    volumeSlider.type = "range";
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.value = window.DataStore.get("audio-volume") * 100;
    volumeSlider.classList.add("volume-slider");

    muteUnmuteButton.classList.add("mute-unmute-button");
    muteUnmuteIcon.classList.add("mute-unmute-icon");
    muteUnmuteIcon.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get("mute-audio") ? 'mute' : 'audio'}.png`);

    muteUnmuteButton.appendChild(muteUnmuteIcon);
    volumeSliderContainer.appendChild(volumeSlider);
    volumeSliderContainer.appendChild(muteUnmuteButton);

    // Append volume slider container
    musicControlsMain.appendChild(volumeSliderContainer);

    // Handle volume slider input
    volumeSlider.addEventListener('input', () => {
        const volumeValue = volumeSlider.value / 100;
        window.DataStore.set("audio-volume", volumeValue);
        const audio: any = document.getElementById("bg-audio");
        audio.volume = volumeValue;

        if (volumeValue === 0) {
            window.DataStore.set("mute-audio", true);
            audio.muted = true;
            muteSetIconAudio();
            muteUnmuteIcon.setAttribute("src", `${iconFolder}plugins-icons/mute.png`);
        } else {
            window.DataStore.set("mute-audio", false);
            audio.muted = false;
            muteSetIconAudio();
            muteUnmuteIcon.setAttribute("src", `${iconFolder}plugins-icons/audio.png`);
        }
    });

    // Mute/unmute button within the volume slider
    muteUnmuteButton.addEventListener('click', () => {
        const isMuted = !window.DataStore.get("mute-audio");
        window.DataStore.set("mute-audio", isMuted);
        audioMute();
        muteSetIconAudio();
        muteUnmuteIcon.setAttribute("src", `${iconFolder}plugins-icons/${isMuted ? 'mute' : 'audio'}.png`);
        const audio: any = document.getElementById("bg-audio");
        if (isMuted) {
            volumeSlider.value = 0;
            audio.volume = 0;
        } else {
            volumeSlider.value = window.DataStore.get("audio-volume") * 100;
            audio.volume = window.DataStore.get("audio-volume");
        }
    });

    // Show/hide volume slider when clicking mute audio icon
    muteAudio.addEventListener('click', () => {
        if (volumeSliderContainer.style.display === 'flex') {
            volumeSliderContainer.style.display = 'none';
        } else {
            volumeSliderContainer.style.display = 'flex';
        }
    });

    // Optionally hide the slider when clicking elsewhere
    document.addEventListener('click', (event: any) => {
        if (!muteAudio.contains(event.target) && !volumeSliderContainer.contains(event.target)) {
            volumeSliderContainer.style.display = 'none';
        }
    });

    // Update progress bar
    if (audio) {
        audio.addEventListener('timeupdate', () => {
            progress.style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100 + 1}%` : '0%';
        });
    }

    // Event delegation for dynamically created elements
    container.addEventListener('click', (event: any) => {
        if (event.target.closest('#pause-audio')) {
            window.DataStore.set('pause-audio', window.DataStore.get('pause-audio') + 1);
            audioPlayPause();
            playPauseSetIconAudio();
            changeSongName();
        }
        if (event.target.closest('#next-audio')) {
            nextSong();
            changeSongName();
        }
        if (event.target.closest('#prev-audio')) {
            prevSong();
            changeSongName();
        }
        if (event.target.closest('#audio-loop')) {
            window.DataStore.set("audio-loop", !window.DataStore.get("audio-loop"));
            toggleAudioLoop();
            setAudioLoopIcon();
        }
    });

    wallpaperControls.addEventListener('click', (event: any) => {
        if (event.target.closest('#pause-bg')) {
            window.DataStore.set('pause-wallpaper', window.DataStore.get('pause-wallpaper') + 1);
            elainaPlayPause();
            playPauseSetIcon();
        }
        if (event.target.closest('#next-bg')) {
            window.DataStore.set("NextBg_Count", window.DataStore.get("NextBg_Count") + 1);
            nextWallpaper();
            if (window.DataStore.get("NextBg_Count") >= 69 && window.DataStore.get("NSFW-Content")) {
                window.open("https://elainatheme.xyz/elaina_nsfw/easteregg1", "_blank");
                window.DataStore.set("NextBg_Count", 0);
            }
        }
        if (event.target.closest('#prev-bg')) {
            prevWallpaper();
        }
    });
};


const deleteButtons = () => {
    document.querySelector(".webm-bottom-buttons-container-hovered")?.remove();
    document.querySelector(".webm-bottom-buttons-container")?.remove();
    document.querySelector(".wallpaper-controls")?.remove();
};

const loadWallpaperAndMusic = () => {
    const video = document.createElement('video');
    video.id = 'elaina-bg';
    video.autoplay = true;
    video.volume = window.DataStore.get("wallpaper-volume");
    video.muted = window.DataStore.get("mute-audio");
    video.currentTime = window.DataStore.get("Wallpaper-currentTime");
    try {
        video.src = `${bgFolder}wallpapers/${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]}`;
        video.playbackRate = window.DataStore.get("Playback-speed") / 100;
    } catch {}
    video.addEventListener("error", () => {
        video.load();
        video.addEventListener("ended", () => video.load());
        window.DataStore.set("video-2nd-loop", true);
    });
    if (window.DataStore.get("video-2nd-loop")) {
        video.addEventListener("ended", () => video.load());
    } else {
        video.loop = true;
    }

    const imgWallpaper = document.createElement('img');
    imgWallpaper.id = 'elaina-static-bg';
    imgWallpaper.src = `${bgFolder}wallpapers/${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]}`;

    const audio = document.createElement("audio");
    audio.id = 'bg-audio';
    audio.autoplay = true;
    audio.src = `${bgFolder}audio/${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`;
    audio.volume = window.DataStore.get("audio-volume");
    audio.muted = window.DataStore.get("mute-audio");
    audio.currentTime = window.DataStore.get("Audio-currentTime");
    if (window.DataStore.get('audio-loop')) {
        audio.addEventListener("ended", () => audio.load());
    } else {
        audio.addEventListener("ended", nextSong);
    }
    audio.addEventListener("error", () => audio.load());

    document.body.prepend(imgWallpaper, video, audio);
    elainaPlayPause();
};

let previous_page = '';
let runtime = 0;

let debounceTimer;

const addHomepage = async (node: any) => {
    if (!document.querySelector(".rcp-fe-lol-home")) return;
    
    const pagename = node.getAttribute("data-screen-name");
    const isOtherPage = !["rcp-fe-lol-navigation-screen", "window-controls", "rcp-fe-lol-home", "social"].includes(pagename);

    if (pagename === "rcp-fe-lol-home-main") {
        if (!document.querySelector(".webm-bottom-buttons-container") && !document.querySelector(".webm-bottom-buttons-container-hovered")) {
            createWebmButtons();
            document.querySelector(".webm-bottom-buttons-container")?.setAttribute("class", "webm-bottom-buttons-container-hovered")
            window.setTimeout(()=> {document.querySelector(".webm-bottom-buttons-container-hovered")?.setAttribute("class", "webm-bottom-buttons-container")},2000)
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
            const storeIframe: any = document.querySelector('#rcp-fe-lol-store-iframe > iframe[referrerpolicy="no-referrer-when-downgrade"]');
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
                Array.from(mutation.addedNodes).some((node: any) => 
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
                    if (window.DataStore.get("turnoff-audio-ingame")) {
                        let elainaBg: any = document.getElementById("elaina-bg")
                        elainaBg.pause();
                        let Audio: any = document.getElementById("bg-audio")
                        Audio.pause();
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
    const loopWallCss = window.DataStore.get("audio-loop") ? "color: #00ff44" : "color: red";
    const muteCss = window.DataStore.get("mute-audio") ? "color: #00ff44" : "color: red";
    const pauseWall = window.DataStore.get('pause-wallpaper') % 2 === 0 ? "color: #00ff44" : "color: red";
    const pauseAudio = window.DataStore.get('pause-audio') % 2 === 0 ? "color: #00ff44" : "color: red";

    if (window.DataStore.get("Continues_Audio")) {
        log(`%cNow playing %c${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]} %cand %c${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', 'color: #0070ff');
        log(`%ccurrent wallpaper status: pause: %c${window.DataStore.get('pause-wallpaper') % 2 === 0}%c, play/pause-time: %c${window.DataStore.get('pause-wallpaper')}%c, mute: %c${window.DataStore.get("mute-audio")}%c, loop: %ctrue%c, volume: %c${window.DataStore.get("wallpaper-volume") * 100}%`, 'color: #e4c2b3', pauseWall, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', muteCss, 'color: #e4c2b3', 'color: #00ff44', 'color: #e4c2b3', 'color: #0070ff');
        log(`%ccurrent audio status: pause: %c${window.DataStore.get('pause-audio') % 2 === 0}%c, play/pause-time: %c${window.DataStore.get('pause-audio')}%c, mute: %c${window.DataStore.get("mute-audio")}%c, loop: %c${window.DataStore.get("audio-loop")}%c, volume: %c${window.DataStore.get("audio-volume") * 100}%`, 'color: #e4c2b3', pauseAudio, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', muteCss, 'color: #e4c2b3', loopWallCss, 'color: #e4c2b3', 'color: #0070ff');
    }
};

logDebuggingInfo();

window.del_webm_buttons = deleteButtons;
window.create_webm_buttons = createWebmButtons;
window.applyHidetab = applyHidetab;
window.applyShowtab = applyShowtab;