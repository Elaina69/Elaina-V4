/**
 * @name ElainaV4
 * @author Elaina Da Catto
 * @description Elaina theme for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

import { cdnImport } from "../otherThings.ts"
import { getThemeName } from "../otherThings"
import { log, warn, error } from "../utils/themeLog.ts";
import * as upl from 'pengu-upl';
import utils from '../utils/utils.ts';
import LocalKey from "../updates/updateKeyLocal.ts";

const datapath: string = `//plugins/${getThemeName()}/`
const iconFolder: string = `${datapath}assets/icon/`;
const bgFolder: string = `${datapath}assets/backgrounds/`;

window.DataStore.set("Font-folder", `${datapath}assets/fonts/`);
window.DataStore.set("Plugin-folder-name", getThemeName());

let addedBackgrounds = false
let navbarContentList: any[] = [];
let haveNewContent = 0

// Set default data
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

// Check version
let CdnKey: number;
let cdnUrl = "https://cdn.jsdelivr.net/npm/elaina-theme-data"
let localUrl = `//plugins/${getThemeName()}/elaina-theme-data`

try {
    if (window.DataStore.get("Dev-mode")) {
        CdnKey = (await cdnImport(`${localUrl}/src/update/update.js`, "Can't load cdn key")).default.key;
        log('%cRunning Elaina theme - %cDev version', 'color: #e4c2b3', 'color: red');
    } 
    else {
        CdnKey = (await cdnImport(`${cdnUrl}/src/update/update.js`, "Can't load cdn key")).default.key;
        log('%cRunning Elaina theme - %cStable version', 'color: #e4c2b3', 'color: #00ff44');
    }
}
catch {
    CdnKey = LocalKey
    log('%cRunning Elaina theme - %cChecking version error', 'color: #e4c2b3', 'color: #00ff44');
}

if (CdnKey === LocalKey) {
    try {
        const themeVersion = (await cdnImport(`${cdnUrl}/src/update/update.js`, "Can't get theme version")).default.version;
        window.DataStore.set("Theme-version", themeVersion);
    }
    catch (err: any) { error("Can't get theme version", err) }

    if (!window.DataStore.get(`Change-CDN-version`)) {
        const response = await fetch(`${cdnUrl}/package.json`);
        const { version: cdnVersion } = await response.json();
        window.DataStore.set("Cdn-version", cdnVersion);
    }
}
log(`%cTheme build: %c${window.DataStore.get("Theme-version")}`, 'color: #e4c2b3', 'color: #00ff44');
log(`%cCDN build  : %c${window.DataStore.get("Cdn-version")}`, 'color: #e4c2b3', 'color: #00ff44');

// Create and set new page as Homepage
export function createHomePageTab(context: any) {
    // context.rcp.postInit('rcp-fe-lol-navigation', async (api: any) => {
    //     //@ts-ignore
    //     window.__RCP_NAV_API = api;

    //     try {
    //         const originalCreate = api._apiHome.navigationManager.createSubNavigationFromJSON;
    //         api._apiHome.navigationManager.createSubNavigationFromJSON = async function (e, t, n) {
    //             console.dir(n);

    //             n.push({
    //                 id: 'elaina-home',
    //                 displayName: await getString("home"),
    //                 isPlugin: false,
    //                 enabled: true,
    //                 visibile: true,
    //                 priority: 1,
    //                 url: 'https://elainatheme.xyz/blankpage',
    //             });

    //             return originalCreate.apply(this, [e, t, n]);
    //         };
    //     }
    //     catch {
    //         error("Failed to create homepage, maybe you're in pbe version")
    //     }
    // });

    // context.rcp.postInit("rcp-fe-lol-navigation", async (api) => {
    //     try {
    //         const navigationManager = api._apiHome.navigationManager;
    //         api._apiHome.navigationManager = new Proxy(navigationManager, {
    //             set(target, property, value) {
    //                 target[property] = (property === "firstNavItemId") ? 'elaina-home' : value;
    //                 return true;
    //             }
    //         });
    //     }
    //     catch {
    //         error("Failed to create homepage, maybe you're in pbe version")
    //     }
    // });
}

function freezeProperties(object: Object, properties: any[]) {
	for (const type in object) {
		if ((properties && properties.length && properties.includes(type)) || (!properties || !properties.length)) {
			let value = object[type]
			try {
				Object.defineProperty(object, type, {
					configurable: false,
					get: () => value,
					set: (v) => v,
				})
			}
            catch {}
		}
	}
}

class ChangeHomePageTabs {
    // Hide or show tab from homepage
    hideShowTab = (data: any, obj: any, name: any) => {
        if (data) {
            try {
                const element = document.querySelector(obj);
                if (element) {
                    element.style.display = "none";
                    element.offsetHeight;
                    log(`${name} tab deleted`);
                } else {
                    warn(`Element not found for ${name}`);
                }
            } 
            catch (error: any) {
                error(`Error hiding ${name} tab:`, error);
            }
        }
        else {
            try {
                document.querySelector(obj).style.display = "block";
            } 
            catch (err: any) {
                error(`This client doesn't have ${name} tab`, err);
            }
        }
    };

    applyHideAndShowtab = () => {
        this.hideShowTab(window.DataStore.get("hide-overview"), 'lol-uikit-navigation-item[item-id="overview"]', "Overview");
        this.hideShowTab(window.DataStore.get("hide-merch"), 'lol-uikit-navigation-item[item-id="merch"]', "Merch");
        this.hideShowTab(window.DataStore.get("hide-patch-note"), 'lol-uikit-navigation-item[item-id="latest_patch_notes"]', "Patch note");
        this.hideShowTab(window.DataStore.get("hide-esport"), 'lol-uikit-navigation-item[item-id="news"]', "Esport");
    };

    applyHideAndShowTFTtab = () => {
        this.hideShowTab(window.DataStore.get("hide-tft-match-history"), 'lol-uikit-navigation-bar a[href="/match-history"]', "TFT match history");
        this.hideShowTab(window.DataStore.get("hide-tft-news"), 'lol-uikit-navigation-bar a[href="/news"]', "TFT news");
        this.hideShowTab(window.DataStore.get("hide-tft-rotational-shop"), 'lol-uikit-navigation-bar a[href="/rotational-shop"]', "TFT rotational shop");
        this.hideShowTab(window.DataStore.get("hide-tft-troves"), 'lol-uikit-navigation-bar a[href="/troves"]', "TFT troves");
        this.hideShowTab(window.DataStore.get("hide-tft-battle-pass"), 'lol-uikit-navigation-bar a[href="/battle-pass"]', "TFT battle pass");
        this.hideShowTab(window.DataStore.get("hide-tft-home"), 'lol-uikit-navigation-bar a[href="/home"]', "TFT home");
    }
    deleteNavbarTab = () => {
        const intervalId = window.setInterval(() => {
            const overviewTab = document.querySelector('lol-uikit-navigation-item[item-id="overview"]');
            const TFThome = document.querySelector('lol-uikit-navigation-bar a[href="/home"]');
            if (overviewTab || TFThome) {
                window.clearInterval(intervalId);
                this.applyHideAndShowtab()
                this.applyHideAndShowTFTtab()
            }
        }, 1000);
    };
}

const changeHomePageTabs = new ChangeHomePageTabs()

// Create wallpaper/audio controller button
// For wallpaper
class WallpaperController {
    elainaPlayPause = () => {
        const elainaBgElem: any = document.getElementById("elaina-bg");
        window.DataStore.get('pause-wallpaper') % 2 === 0 ? elainaBgElem.pause() : elainaBgElem.play();
    };
    
    playPauseSetIcon = (elem: any = document.querySelector(".pause-bg-icon")) => {
        const pauseBgIcon = elem;
        if (!pauseBgIcon) return;
        pauseBgIcon.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get('pause-wallpaper') % 2 === 0 ? 'play_button' : 'pause_button'}.png`);
    };
    
    loadBG = (BG: string) => {
        const elainaBg: any = document.getElementById("elaina-bg");
        const elainaStaticBg: any = document.getElementById("elaina-static-bg");
        elainaBg.src = `${bgFolder}wallpapers/${BG}`;
        elainaStaticBg.src = `${bgFolder}wallpapers/${BG}`;
        elainaBg.playbackRate = window.DataStore.get("Playback-speed") / 100;
    };

    changeBG = async (BG: string) => {
        const elainaBg: any = document.getElementById("elaina-bg");
        const elainaStaticBg: any = document.getElementById("elaina-static-bg");

        log(`Now playing %c${BG}`, 'color: #0070ff');
        
        setTimeout(() => {
            this.loadBG(BG);
            this.elainaPlayPause();
            elainaBg.classList.remove("webm-hidden");
            elainaStaticBg.classList.remove("webm-hidden");
        }, 500);

        this.wallpaperSlider(BG)

        // @ts-ignore
        await refreshList()
    }
    
    nextWallpaper = async() => {
        const elainaBg: any = document.getElementById("elaina-bg");
        elainaBg.classList.add("webm-hidden");
        const elainaStaticBg: any = document.getElementById("elaina-static-bg");
        elainaStaticBg.classList.add("webm-hidden");
    
        window.DataStore.set('wallpaper-index', window.DataStore.get('wallpaper-index') + 1);
        if (window.DataStore.get('wallpaper-index') > window.DataStore.get("Wallpaper-list").length - 1) {
            window.DataStore.set('wallpaper-index', 0);
        }
    
        await this.changeBG(window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]);
    };
    
    prevWallpaper = async() => {
        const elainaBg: any = document.getElementById("elaina-bg");
        elainaBg.classList.add("webm-hidden");
        const elainaStaticBg: any = document.getElementById("elaina-static-bg");
        elainaStaticBg.classList.add("webm-hidden");
    
        window.DataStore.set('wallpaper-index', window.DataStore.get('wallpaper-index') - 1);
        if (window.DataStore.get('wallpaper-index') < 0) {
            window.DataStore.set('wallpaper-index', window.DataStore.get("Wallpaper-list").length - 1);
        }
    
        await this.changeBG(window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]);
    };

    checkBGType = (wallpaper: string) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|ico)$/i;
        const videoRegex = /\.(mp4|webm|mkv|mov|avi|wmv|3gp|m4v)$/i;

        if (imageRegex.test(wallpaper)) {
            return 0
        } 
        else if (videoRegex.test(wallpaper)) {
            return 1
        }
    }

    wallpaperSlider = (wallpaper: string) => {
        if (window.DataStore.get("wallpaper-slideshow") && this.checkBGType(wallpaper) == 0) {
            window.setTimeout(()=> {
                this.nextWallpaper()
            }, window.DataStore.get("wallpaper-change-slide-time"))
        }
    }
}

const wallpaperController = new WallpaperController()

// For audio
class AudioController {
    audioPlayPause = () => {
        const audio: any = document.getElementById("bg-audio");
        window.DataStore.get('pause-audio') % 2 === 0 ? audio.pause() : audio.play();
        this.changeSongName()
    };
    
    playPauseSetIconAudio = (elem: any = document.querySelector(".pause-audio-icon")) => {
        const pauseAudioIcon = elem;
        if (!pauseAudioIcon) return;
        pauseAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get('pause-audio') % 2 === 0 ? 'play_button' : 'pause_button'}.png`);
    };
    
    audioMute = () => {
        const audio: any = document.getElementById("bg-audio");
        const wallpaperAudio: any = document.getElementById("elaina-bg");
        const isMuted = window.DataStore.get("mute-audio");
        wallpaperAudio.muted = isMuted;
        audio.muted = isMuted;
        log(`%caudio and wallpaper mute: %c${isMuted}`, '', isMuted ? 'color: #00ff44' : 'color: red');
    };
    
    muteSetIconAudio = (elem: any = document.querySelector(".mute-audio-icon")) => {
        const muteAudioIcon = elem;
        if (!muteAudioIcon) return;
        muteAudioIcon.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get("mute-audio") ? 'mute' : 'audio'}.png`);
    };
    
    setAudioLoopIcon = (elem: any = document.querySelector(".audio-loop-icon")) => {
        const iconElement = elem;
        if (!iconElement) return;
        iconElement.setAttribute("src", `${iconFolder}plugins-icons/${window.DataStore.get("audio-loop") ? 'rotating-arrow' : 'unrotating-arrow'}.png`);
    };
    
    toggleAudioLoop = () => {
        const audio: any = document.getElementById("bg-audio");
        if (window.DataStore.get('audio-loop')) {
            audio.removeEventListener("ended", this.nextSong);
            audio.addEventListener("ended", () => {
                audio.pause();
                audio.load();
            });
        } else {
            audio.addEventListener("ended", this.nextSong);
        }
    };
    
    loadSong = (song) => {
        const audio: any = document.getElementById("bg-audio");
        audio.src = `${bgFolder}audio/${song}`;
    };

    updateAudio = async (song) => {
        this.loadSong(song);
        this.audioPlayPause();
        this.changeSongName();
        log(`Now playing %c${song}`, 'color: #0070ff');

        // @ts-ignore
        await refreshList()
    }
    
    nextSong = async () => {
        if (window.DataStore.get("Continues_Audio")) {
            window.DataStore.set('audio-index', window.DataStore.get('audio-index') + 1);
    
            if (window.DataStore.get('audio-index') > window.DataStore.get("Audio-list").length - 1) {
                window.DataStore.set('audio-index', 0);
            }
            await this.updateAudio(window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]);
        }
    };
    
    prevSong = async () => {
        if (window.DataStore.get("Continues_Audio")) {
            window.DataStore.set('audio-index', window.DataStore.get('audio-index') - 1);
    
            if (window.DataStore.get('audio-index') < 0) {
                window.DataStore.set('audio-index', window.DataStore.get("Audio-list").length - 1);
            }
            await this.updateAudio(window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]);
        }
    };
    
    changeSongName = ()=> {
        let currentSong = window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]
        let songNameText: Element | null = document.querySelector(".audio-name-bar > p")
        if (songNameText) {
            if (window.DataStore.get('pause-audio') % 2 === 0) {
                songNameText.innerHTML = `Paused: <br/>${currentSong}`
            }
            else songNameText.innerHTML = `Now playing: <br/>${currentSong}`
        }
    }
}

const audioController = new AudioController()

// Create controllers
class MainController {
    createElementWithClass = (tag, className) => {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        return element;
    };
    
    createElementWithId = (tag, id) => {
        const element = document.createElement(tag);
        if (id) element.id = id;
        return element;
    };
    
    createIcon = (className, src) => {
        const icon = this.createElementWithClass("img", className);
        if (src) icon.setAttribute("src", src);
        return icon;
    };

    // Delete controllers
    deleteController = () => {
        document.querySelector(".webm-bottom-buttons-container-hovered")?.remove();
        document.querySelector(".webm-bottom-buttons-container")?.remove();
        document.querySelector(".wallpaper-controls")?.remove();
    };
    
    createMainController = () => {
        const container = this.createElementWithClass("div", "webm-bottom-buttons-container");

        if (window.DataStore.get("Disable-Theme-Audio")) container.style.display = "none"
    
        // Create music controller
        const musicControlsMain = this.createElementWithClass("div", "music-controls-main");
        const musicControls = this.createElementWithClass("div", "music-controls");
    
        const pauseAudio = this.createElementWithId("div", "pause-audio");
        const nextAudio = this.createElementWithId("div", "next-audio");
        const prevAudio = this.createElementWithId("div", "prev-audio");
        const muteAudio = this.createElementWithId("div", "mute-audio");
        const audioLoop = this.createElementWithId("div", "audio-loop");
    
        const pauseAudioIcon = this.createIcon("pause-audio-icon", `${iconFolder}plugins-icons/pause-audio.png`);
        const nextAudioIcon = this.createIcon("next-audio-icon", `${iconFolder}plugins-icons/next-audio.png`);
        const prevAudioIcon = this.createIcon("prev-audio-icon", `${iconFolder}plugins-icons/prev-audio.png`);
        const muteAudioIcon = this.createIcon("mute-audio-icon", `${iconFolder}plugins-icons/mute-audio.png`);
        const audioLoopIcon = this.createIcon("audio-loop-icon", `${iconFolder}plugins-icons/audio-loop.png`);
    
        // Create wallpaper controller
        const wallpaperControls = this.createElementWithClass("div", "wallpaper-controls");
    
        const pauseBg = this.createElementWithId("div", "pause-bg");
        const nextBg = this.createElementWithId("div", "next-bg");
        const prevBg = this.createElementWithId("div", "prev-bg");
    
        const pauseBgIcon = this.createIcon("pause-bg-icon", `${iconFolder}plugins-icons/pause-bg.png`);
        const nextBgIcon = this.createIcon("next-bg-icon", `${iconFolder}plugins-icons/next_button.png`);
        const prevBgIcon = this.createIcon("prev-bg-icon", `${iconFolder}plugins-icons/prev_button.png`);
        
        const bgDropdown = this.createElementWithId("lol-uikit-framed-dropdown", "bgdropdown");
        
        
        // Create audio progress bar
        const progressBar = this.createElementWithClass("div", "progress-bar");
        const progress = this.createElementWithClass("div", "progress-status");
        const audioNameBar = this.createElementWithClass("div", "audio-name-bar");
        const audioName = this.createElementWithId("p", "audio-name");
    
        // Create volume slider container
        const volumeSliderContainer = this.createElementWithClass("div", "volume-slider-container");
        const volumeSlider = this.createElementWithClass("input", "volume-slider");
    
        volumeSlider.type = "range";
        volumeSlider.min = "0";
        volumeSlider.max = "100";
        volumeSlider.value = window.DataStore.get("audio-volume") * 100;
        volumeSlider.classList.add("volume-slider");
    
        const muteUnmuteButton = this.createElementWithClass("div", "mute-unmute-button");
        const muteUnmuteIcon = this.createIcon("mute-unmute-icon", `${iconFolder}plugins-icons/${window.DataStore.get("mute-audio") ? 'mute' : 'audio'}.png`);
    
        // Set icon wallpaper/audio controller button
        audioController.playPauseSetIconAudio(pauseAudioIcon);
        audioController.muteSetIconAudio(muteAudioIcon);
        audioController.setAudioLoopIcon(audioLoopIcon);
    
        wallpaperController.playPauseSetIcon(pauseBgIcon);
    
        // Set current audio name to progress bar
        window.DataStore.get('pause-audio') % 2 === 0 
            ? audioName.innerHTML = `Paused: <br/>${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`
            : audioName.innerHTML = `Now playing: <br/>${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`
    
        // Append volume slider container
        muteUnmuteButton.appendChild(muteUnmuteIcon);
        volumeSliderContainer.appendChild(volumeSlider);
        volumeSliderContainer.appendChild(muteUnmuteButton);
        musicControlsMain.appendChild(volumeSliderContainer);
    
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
        } 
        else {
            const newBgChange = document.createElement("div");
            newBgChange.id = "newbgchange";
            newBgChange.append(bgDropdown);
            wallpaperControls.append(newBgChange, pauseBg);
    
            window.DataStore.get("Wallpaper-list").forEach((opt, id) => {
                const el = document.createElement("lol-uikit-dropdown-option");
                el.setAttribute("slot", "lol-uikit-dropdown-option");
                el.innerText = opt;
                el.onclick = async () => {
                    const elainaBg: any = document.getElementById("elaina-bg");
                    elainaBg.classList.add("webm-hidden");
                    const elainaStaticBg: any = document.getElementById("elaina-static-bg");
                    elainaStaticBg.classList.add("webm-hidden");
    
                    window.DataStore.set('wallpaper-index', id);
                    
                    await wallpaperController.changeBG(window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')])
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
        const showContainerNew = document.querySelector("#activity-center");
        if (showContainer) {
            showContainer.append(container, wallpaperControls);
        } 
        else if (showContainerNew) {
            showContainerNew.append(container, wallpaperControls);
        } 
        else {
            error("Could not find the container '.rcp-fe-lol-home' to append controls.");
        }
    
        // Handle volume slider input
        volumeSlider.addEventListener('input', () => {
            const volumeValue = volumeSlider.value / 100;
            window.DataStore.set("audio-volume", volumeValue);
            const audio: any = document.getElementById("bg-audio");
            audio.volume = volumeValue;
    
            if (volumeValue === 0) {
                window.DataStore.set("mute-audio", true);
                audio.muted = true;
                audioController.muteSetIconAudio();
                muteUnmuteIcon.setAttribute("src", `${iconFolder}plugins-icons/mute.png`);
            } else {
                window.DataStore.set("mute-audio", false);
                audio.muted = false;
                audioController.muteSetIconAudio();
                muteUnmuteIcon.setAttribute("src", `${iconFolder}plugins-icons/audio.png`);
            }
        });
    
        // Mute/unmute button within the volume slider
        muteUnmuteButton.addEventListener('click', () => {
            const isMuted = !window.DataStore.get("mute-audio");
            window.DataStore.set("mute-audio", isMuted);
            audioController.audioMute();
            audioController.muteSetIconAudio();
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
        const audio: any = document.getElementById('bg-audio');
    
        if (audio) {
            progress.style.width = audio && audio.duration ? `${(audio.currentTime / audio.duration) * 100 + 1}%` : '0%';
            audio.addEventListener('timeupdate', () => {
                progress.style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100 + 1}%` : '0%';
            });
        }
    
        // Event delegation for dynamically created elements
        container.addEventListener('click',async (event: any) => {
            if (event.target.closest('#pause-audio')) {
                window.DataStore.set('pause-audio', window.DataStore.get('pause-audio') + 1);
                audioController.audioPlayPause();
                audioController.playPauseSetIconAudio();
                audioController.changeSongName();
            }
            if (event.target.closest('#next-audio')) {
                await audioController.nextSong();
                audioController.changeSongName();
            }
            if (event.target.closest('#prev-audio')) {
                await audioController.prevSong();
                audioController.changeSongName();
            }
            if (event.target.closest('#audio-loop')) {
                window.DataStore.set("audio-loop", !window.DataStore.get("audio-loop"));
                audioController.toggleAudioLoop();
                audioController.setAudioLoopIcon();
            }
        });
    
        wallpaperControls.addEventListener('click', (event: any) => {
            if (event.target.closest('#pause-bg')) {
                window.DataStore.set('pause-wallpaper', window.DataStore.get('pause-wallpaper') + 1);
                wallpaperController.elainaPlayPause();
                wallpaperController.playPauseSetIcon();
            }
            if (event.target.closest('#next-bg')) {
                window.DataStore.set("NextBg_Count", window.DataStore.get("NextBg_Count") + 1);
                wallpaperController.nextWallpaper();
                if (window.DataStore.get("NextBg_Count") >= 69 && window.DataStore.get("NSFW-Content")) {
                    window.open(`${window.DataStore.get("Elaina-domain-server")}elaina_nsfw/easteregg1`, "_blank");
                    window.DataStore.set("NextBg_Count", 0);
                }
            }
            if (event.target.closest('#prev-bg')) {
                wallpaperController.prevWallpaper();
            }
        });

        // change wallpaper/audio controller if hide homepage navbar
        if (window.DataStore.get("hide-homepage-navbar")) {
            container.style.left = "20px"
            wallpaperControls.style.left = "20px"
        }
        else {
            container.style.left = "230px"
            wallpaperControls.style.left = "230px"
        }
    };
}
const mainController = new MainController()

// Create hide navbar button
class HideNavbarButton {
    checkNewContent = () => {
        if (!window.DataStore.has("navbar-content")) window.DataStore.set("navbar-content", [])
        let navbarContent = document.querySelectorAll<HTMLElement>(".activity-center__tab_content");

        navbarContent.forEach((element) => {
            const labelElement = element.querySelector<HTMLElement>(".activity-center__tab_label_display");
            if (labelElement && labelElement.innerText) {
                navbarContentList.push(labelElement.innerText);
            }
        });

        let set = new Set(window.DataStore.get("navbar-content")); 
        let set2 = new Set(navbarContentList); 

        for (const element of navbarContentList) {
            if (!set.has(element)) {
                haveNewContent++;
            }
        }
        for (const element of window.DataStore.get("navbar-content")) {
            if (!set2.has(element)) {
                haveNewContent++;
            }
        }
    }

    createHideButton = () => {
        const hideButton = document.createElement("div")
        const hideButtonIcon = document.createElement("img")
        const navbar = document.querySelector(".activity-center__tabs_container")
        const newContent = document.createElement("div")

        hideButton.setAttribute("class", "hide-navbar-button")
        hideButtonIcon.setAttribute("class", "hide-navbar-button-icon")
        newContent.setAttribute("class", "navbar-have-new-content")

        if(navbar) {
            navbar.appendChild(hideButton)
            hideButton.append(hideButtonIcon)
            hideButton.append(newContent)
        }

        if (haveNewContent > 0) {
            newContent.style.display = "block"
        }
        
        hideButton.addEventListener("click", () => {
            if (window.DataStore.get("hide-homepage-navbar")) {
                window.DataStore.set("hide-homepage-navbar", false)
            }
            else {
                window.DataStore.set("hide-homepage-navbar", true)
            }
            this.hideShowNavBar()
            this.changeHomePageStyle()
            window.DataStore.set("navbar-content", navbarContentList)
            newContent.style.display = "none"
        })
    }

    hideShowNavBar = () => {
        const nav: any = document.querySelector(".activity-center__tabs_scrollable")
        const navFooter: any = document.querySelector(".activity-center__tabs_footer")
        const navDivider: any = document.querySelector(".activity-center__tabs_section-divider")
        const hideButton: any = document.querySelector(".hide-navbar-button")
        const hideButtonIcon: any = document.querySelector(".hide-navbar-button-icon")

        try {
            if (window.DataStore.get("hide-homepage-navbar")) {
                nav.style.cssText = `transform: translateX(-212px); pointer-events: none;`
                navFooter.style.cssText = `transform: translateX(-212px); pointer-events: none;`
                navDivider.style.cssText = `transform: translateX(-212px); pointer-events: none;`
                hideButton.style.cssText = `transform: translateX(0px);`
                hideButtonIcon.setAttribute("src", `${iconFolder}plugins-icons/next_button.png`);
            }
            else {
                nav.style.cssText = `transform: translateX(0px); pointer-events: auto;`
                navFooter.style.cssText = `transform: translateX(0px); pointer-events: auto;`
                navDivider.style.cssText = `transform: translateX(0px); pointer-events: auto;`
                hideButton.style.cssText = `transform: translateX(212px);`
                hideButtonIcon.setAttribute("src", `${iconFolder}plugins-icons/prev_button.png`);
            }
        }
        catch (err: any) { error("Get error while changing style for navbar:", err)}
    }

    changeHomePageStyle = () => {
        const wallpaperController: any = document.querySelector(".wallpaper-controls")
        const audioController: any = document.querySelector(".webm-bottom-buttons-container")
        const activityCenter: any = document.querySelector(".activity-center-ready > main")
        const activityCenterChinese: any = document.querySelector(".managed-iframe-wrapper > iframe")
        
        if (window.DataStore.get("hide-homepage-navbar")) {
            if (activityCenter) activityCenter.style.cssText = `opacity: 0; pointer-events: none;`
            if (activityCenterChinese) activityCenterChinese.style.cssText = `opacity: 0; pointer-events: none;`
            if (wallpaperController) wallpaperController.style.cssText = `transform: translateX(0px);`
            if (audioController) audioController.style.cssText = `transform: translateX(0px);`
        }
        else {
            if (activityCenter) activityCenter.style.cssText = `opacity: 1; pointer-events: auto;`
            if (activityCenterChinese) activityCenterChinese.style.cssText = `opacity: 1; pointer-events: auto;`
            if (wallpaperController) wallpaperController.style.cssText = `transform: translateX(212px);`
            if (audioController) audioController.style.cssText = `transform: translateX(212px);`
        }
    }

    addHideButton = () => {
        upl.observer.subscribeToElementCreation(".activity-center__tabs_container", (element: any) => {
            if (document.querySelector(".hide-navbar-button")) return

            // just make sure
            try {
                let button: any = document.getElementsByClassName("hide-navbar-button")
                if (button.length > 1) {
                    for (let i = 0; i < button.length; i++) {
                        button[i].remove()
                    }
                }
            } 
            catch {}

            this.checkNewContent()
            this.createHideButton()
            this.hideShowNavBar()
            this.changeHomePageStyle()
        })

        upl.observer.subscribeToElementCreation(".activity-center-default-activity", (element: any) => {
            this.changeHomePageStyle()
        })
    }
}
const hideNavbarButton = new HideNavbarButton()

// Create hide navbar button
class HideTopNavbarButton {
    createHideButton = () => {
        const hideButton = document.createElement("div")
        const hideButtonIcon = document.createElement("img")
        const topNavbar = document.querySelector(".right-nav-menu")

        hideButton.setAttribute("class", "hide-top-navbar")
        hideButtonIcon.setAttribute("class", "hide-top-navbar-icon")

        if(topNavbar) {
            topNavbar.prepend(hideButton)
            hideButton.append(hideButtonIcon)
        }

        this.changeButtonIcon(window.DataStore.get("hide-top-navbar"))

        hideButton.addEventListener("click", () => {
            if (window.DataStore.get("hide-top-navbar")) {
                window.DataStore.set("hide-top-navbar", false)
            }
            else {
                window.DataStore.set("hide-top-navbar", true)
            }
            this.hideShowTopNavBar()
        })
    }

    changeButtonIcon = (isHidden: boolean) => {
        const hideButtonIcon: any = document.querySelector(".hide-top-navbar-icon")
        if (isHidden) {
            hideButtonIcon.setAttribute("src", `${iconFolder}plugins-icons/prev_button.png`);
        }
        else {
            hideButtonIcon.setAttribute("src", `${iconFolder}plugins-icons/next_button.png`);
        }
    }

    hideShowTopNavBar = () => {
        const navItem: any = document.querySelectorAll(".right-nav-menu > .main-navigation-menu-item")
        const verticalRule: any = document.querySelectorAll(".right-nav-vertical-rule")
        const walletBadge: any = document.querySelector(".wallet-and-badges")
        const hideButton: any = document.querySelector(".hide-top-navbar")

        try {
            let isHidden = window.DataStore.get("hide-top-navbar")
            if (isHidden) {
                let nav: any = document.querySelector(".right-nav-menu")
                let navWidth = nav.offsetWidth

                hideButton.style.cssText = `transform: translateX(${navWidth-40}px);`
                for (let i = 0; i < navItem.length; i++) {
                    navItem[i].style.cssText = `
                        transform: translateX(${navWidth-40}px);
                        opacity: 0;
                        pointer-events: none;
                    `
                    freezeProperties(navItem[i].style, ["transform"])
                }
                for (let i = 0; i < verticalRule.length; i++) {
                    verticalRule[i].style.cssText = `
                        transform: translateX(${navWidth-40}px);
                        opacity: 0;
                        pointer-events: none;
                    `
                    freezeProperties(verticalRule[i].style, ["transform"])
                }
                walletBadge.style.cssText = `
                    transform: translateX(${navWidth-40}px);
                    opacity: 0;
                    pointer-events: none;
                `
            }
            else {
                hideButton.style.cssText = `transform: translateX(0px);`
                for (let i = 0; i < navItem.length; i++) {
                    navItem[i].style.cssText = `
                        transform: translateX(0px);
                        opacity: 1;
                        pointer-events: auto;
                    `
                }
                for (let i = 0; i < verticalRule.length; i++) {
                    verticalRule[i].style.cssText = `
                        transform: translateX(0px);
                        opacity: 1;
                        pointer-events: auto;
                    `
                }
                walletBadge.style.cssText = `
                    transform: translateX(0px);
                    opacity: 1;
                    pointer-events: auto;
                `
            }
            this.changeButtonIcon(isHidden)
        }
        catch (err: any) { error("Can't find top navigation bar", err)}
    }

    addHideButton = () => {
        upl.observer.subscribeToElementCreation(".right-nav-menu > .main-navigation-menu-item", (element: any) => {
            if (document.querySelector(".hide-top-navbar")) return

            // just make sure
            try {
                let button: any = document.getElementsByClassName("hide-top-navbar")
                if (button.length > 1) {
                    for (let i = 0; i < button.length; i++) {
                        button[i].remove()
                    }
                }
            } 
            catch {}

            this.createHideButton()
            window.setTimeout(()=> {
                this.hideShowTopNavBar()
            }, 2000)
        })
    }
}
const hideTopNavbarButton = new HideTopNavbarButton()

//Add and load wallpaper/audio
class WallpaperAndAudio {
    // Add Wallpaper and Audio to client
    addWallpaperElement = () => {
        // create wallpaper
        const video = document.createElement('video');
        video.id = 'elaina-bg';

        document.body.prepend(video);
    }

    addImageWallpaperElement = () => {
        // create image wallpaper
        const imgWallpaper = document.createElement('img');
        imgWallpaper.id = 'elaina-static-bg';

        document.body.prepend(imgWallpaper);
    }

    addAudioElement = () => {
        // create audio
        const audio = document.createElement("audio");
        audio.id = 'bg-audio';

        document.body.prepend(audio);
    }

    setWallpaperElement = () => {
        if (window.DataStore.get('wallpaper-index') > window.DataStore.get("Wallpaper-list").length - 1) {
            window.DataStore.set('wallpaper-index', 0);
        }

        const video: any = document.getElementById("elaina-bg")
        video.autoplay = true;
        video.volume = window.DataStore.get("wallpaper-volume");
        video.muted = window.DataStore.get("mute-audio");
        video.currentTime = window.DataStore.get("Wallpaper-currentTime");
        video.src = `${bgFolder}wallpapers/${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]}`;
        video.playbackRate = window.DataStore.get("Playback-speed") / 100;
        

        video.addEventListener('timeupdate', () => {
            window.DataStore.set("Wallpaper-currentTime", video.currentTime)
        });
        
        if (window.DataStore.get("wallpaper-slideshow")) {
            video.loop = false
            video.addEventListener("ended", () => {
                wallpaperController.nextWallpaper();
            });
        }
        else video.loop = true;
    }

    setImageWallpaperElement = () => {
        const imgWallpaper: any = document.getElementById("elaina-static-bg")
        imgWallpaper.src = `${bgFolder}wallpapers/${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]}`;

        wallpaperController.wallpaperSlider(window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')])
    }

    setAudioElement = () => {
        if (!window.DataStore.get("Disable-Theme-Audio")) {
            if (window.DataStore.get('audio-index') > window.DataStore.get("Audio-list").length - 1) {
                window.DataStore.set('audio-index', 0);
            }

            const audio: any = document.getElementById("bg-audio")
            audio.autoplay = true;
            audio.src = `${bgFolder}audio/${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`;
            audio.volume = window.DataStore.get("audio-volume");
            audio.muted = window.DataStore.get("mute-audio");
            audio.currentTime = window.DataStore.get("Audio-currentTime");

            audio.addEventListener('timeupdate', () => {
                window.DataStore.set("Audio-currentTime", audio.currentTime)
            });

            if (window.DataStore.get('audio-loop')) {
                audio.addEventListener("ended", () => audio.load());
            } 
            else audio.addEventListener("ended", () => {
                audioController.nextSong()
                audioController.changeSongName()
            });
            
            audio.addEventListener("error", () => audio.load());
        }
    }

    loadWallpaperAndMusic() {
        const initializeUI = () => {
            if (document.querySelector(".rcp-fe-lol-home") || document.querySelector(".rcp-fe-lol-activity-center")) {
                log("Load wallpaper and audio")

                this.setWallpaperElement()
                this.setImageWallpaperElement()
                this.setAudioElement()

                utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message: any) => {
                    const phase = JSON.parse(message["data"])[2]["data"];
                    log(phase)
                    if (phase === "GameStart" || phase === "InProgress") {
                        if (window.DataStore.get("turnoff-audio-ingame")) {
                            const video: any = document.getElementById("elaina-bg")
                            const audio: any = document.getElementById("bg-audio")
                            video.pause();
                            audio.pause();
                        }
                    } else {
                        wallpaperController.elainaPlayPause();
                        audioController.audioPlayPause();
                    }
                });
                changeHomePageTabs.deleteNavbarTab();
                clearInterval(initializationInterval);
            }
        };

        const initializationInterval = setInterval(initializeUI, 2000);
    }

    logDebuggingInfo = () => {
        const loopWallCss = window.DataStore.get("audio-loop") ? "color: #00ff44" : "color: red";
        const muteCss = window.DataStore.get("mute-audio") ? "color: #00ff44" : "color: red";
        const pauseWall = window.DataStore.get('pause-wallpaper') % 2 === 0 ? "color: #00ff44" : "color: red";
        const pauseAudio = window.DataStore.get('pause-audio') % 2 === 0 ? "color: #00ff44" : "color: red";
        const elainaBg: any = document.getElementById("elaina-bg");
    
        if (window.DataStore.get("Continues_Audio")) {
            log(`%cNow playing %c${window.DataStore.get("Wallpaper-list")[window.DataStore.get('wallpaper-index')]} %cand %c${window.DataStore.get("Audio-list")[window.DataStore.get('audio-index')]}`, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', 'color: #0070ff');
            log(`%ccurrent wallpaper status: pause: %c${window.DataStore.get('pause-wallpaper') % 2 === 0}%c, play/pause-time: %c${window.DataStore.get('pause-wallpaper')}%c, mute: %c${window.DataStore.get("mute-audio")}%c, loop: %c${elainaBg.loop}%c, volume: %c${window.DataStore.get("wallpaper-volume") * 100}%`, 'color: #e4c2b3', pauseWall, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', muteCss, 'color: #e4c2b3', 'color: #00ff44', 'color: #e4c2b3', 'color: #0070ff');
            log(`%ccurrent audio status: pause: %c${window.DataStore.get('pause-audio') % 2 === 0}%c, play/pause-time: %c${window.DataStore.get('pause-audio')}%c, mute: %c${window.DataStore.get("mute-audio")}%c, loop: %c${window.DataStore.get("audio-loop")}%c, volume: %c${window.DataStore.get("audio-volume") * 100}%`, 'color: #e4c2b3', pauseAudio, 'color: #e4c2b3', 'color: #0070ff', 'color: #e4c2b3', muteCss, 'color: #e4c2b3', loopWallCss, 'color: #e4c2b3', 'color: #0070ff');
        }
    };
}

const wallpaperAndAudio = new WallpaperAndAudio()

class AddHomePage {
    pageListenner = async (node: any) => {      
        const pagename = node.getAttribute("data-screen-name");
        const isOtherPage = !["rcp-fe-lol-navigation-screen", "window-controls", "social", "rcp-fe-lol-activity-center-main"].includes(pagename);
    
        if (pagename === "rcp-fe-lol-home-main" || pagename === "window-controls" || pagename === "rcp-fe-lol-activity-center-main") {
            if (!addedBackgrounds) {
                addedBackgrounds = true
                wallpaperAndAudio.loadWallpaperAndMusic()
                wallpaperAndAudio.logDebuggingInfo()

                upl.observer.subscribeToElementCreation(".tft-sub-nav-container span", (element: any) => {
                    changeHomePageTabs.deleteNavbarTab();
                })
            }

            if (!document.querySelector(".webm-bottom-buttons-container") && !document.querySelector(".webm-bottom-buttons-container-hovered")) {
                mainController.deleteController();
                mainController.createMainController();
                document.querySelector(".webm-bottom-buttons-container")?.setAttribute("class", "webm-bottom-buttons-container-hovered")
                window.setTimeout(()=> {document.querySelector(".webm-bottom-buttons-container-hovered")?.setAttribute("class", "webm-bottom-buttons-container")},2000)

                hideNavbarButton.hideShowNavBar();
                hideNavbarButton.changeHomePageStyle()
            }

            changeHomePageTabs.deleteNavbarTab();
        }
        else if (isOtherPage && document.querySelector(".webm-bottom-buttons-container") && pagename != "rcp-fe-lol-info-hub") {
            mainController.deleteController();
        }
    };
}

const addHomePage = new AddHomePage()

export class HomePage {
    main = () => {
        log("Add wallpaper and audio")
        wallpaperAndAudio.addWallpaperElement()
        wallpaperAndAudio.addImageWallpaperElement()
        wallpaperAndAudio.addAudioElement()

        utils.mutationObserverAddCallback(addHomePage.pageListenner, ["screen-root"]);
        hideNavbarButton.addHideButton()
        if (window.DataStore.get("enable-hide-top-navbar-friendlist-button")) {
            hideTopNavbarButton.addHideButton()
        }
    }
}

window.del_webm_buttons = mainController.deleteController
window.create_webm_buttons = mainController.createMainController
window.applyHideAndShowtab = changeHomePageTabs.applyHideAndShowtab
window.applyHideAndShowTFTtab = changeHomePageTabs.applyHideAndShowTFTtab
window.setAudio = wallpaperAndAudio.setAudioElement
window.hideShowNavBar = hideNavbarButton.hideShowNavBar
window.changeHomePageStyle = hideNavbarButton.changeHomePageStyle