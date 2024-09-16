/**
 * @name ElainaV4
 * @author Elaina Da Catto
 * @description Elaina theme for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

const CONSOLE_STYLE = {
    prefix: '%c Elaina ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

const log = (message, ...args) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
const error = (message, ...args) => console.error(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);

log('By %cElaina Da Catto', 'color: #e4c2b3');
log('%cMeow ~~~', 'color: #e4c2b3');

import "./src/services/backupAndRestoreDatastore.js";

// // Set new or restore Datastore file
// try {
//     log('Attempting to set or restore Datastore file');
// } catch (err) {
//     error('Error while setting or restoring Datastore file:', err);
// }

// Refresh backgrounds list
const FILE_REGEX = {
    Wallpaper: /\.(mp4|webm|mkv|mov|avi|wmv)$/,
    ImageWallpaper: /\.(png|jpg|jpeg|gif)$/,
    Audio: /\.(mp3|flac|ogg|wav|aac)$/,
    Font: /\.(ttf|otf)$/,
    Banner: /\.(png|jpg|jpeg|gif)$/,
};

const ASSET_PATHS = {
    Wallpaper: "./src/assets/backgrounds/wallpapers",
    Audio: "./src/assets/backgrounds/audio",
    Font: "./src/assets/fonts",
    Banner: "./src/assets/icon/regalia-banners",
};

const refreshBackgroundsList = async () => {
    try {
        const lists = await Promise.all(
            Object.values(ASSET_PATHS).map(path => PluginFS.ls(path))
        );
        
        const filteredLists = Object.keys(ASSET_PATHS).reduce((acc, key, index) => {
            acc[key] = lists[index].filter(file => FILE_REGEX[key].test(file));
            return acc;
        }, {});

        Object.entries(filteredLists).forEach(([key, value]) => {
            DataStore.set(`${key}-list`, value);
        });

        DataStore.set("video-2nd-loop", false);
        log('Updated DataStore with lists');
    } catch (err) {
        error('Error refreshing backgrounds list:', err);
        DataStore.set("manual-add-background", true);
    }
};

log('Refreshing backgrounds list');
const backgroundListInterval = setInterval(async () => {
    await refreshBackgroundsList();
    if (document.getElementById("elaina-bg")) {
        clearInterval(backgroundListInterval);
        log('Stopped reloading list');
    }
}, 1000);

// import wallpaperFolder from "./src/assets/backgrounds/wallpapers?dir";

// const wallpaperList = await wallpaperFolder.files()
// for (let file of wallpaperList) {
//     console.log('wallpaper: %s', file)
// }
   

// Importing theme contents
log('Importing theme contents');

import { setHomePage } from "./src/theme/homepage.js";
import { transparentLobby } from "./src/theme/applyUi.js";

// Import CDN modules
let initLink
const cdnImport = async (url, errorMsg) => {
    try {
        const res = await fetch(url);
        if (res.status === 200) {
            await import(url);
        } else {
            throw new Error();
        }
    } catch {
        console.warn(`${eConsole}%c ${errorMsg}`, eCss, "");
        Toast.error(errorMsg);
    }
};

if (DataStore.get("Dev-mode")) {
    initLink = `//plugins/${getThemeName()}/elaina-theme-data/cdninit.js`;
    await cdnImport(`//plugins/${getThemeName()}/elaina-theme-data/index.js`, "Failed to load local data");
} 
else {
    let cdnVersion = DataStore.get("Elaina-First run")
        ? DataStore.get("Cdn-version")
        : "latest";

    initLink = `https://unpkg.com/elaina-theme-data@${cdnVersion}/cdninit.js`;
    await cdnImport(`https://unpkg.com/elaina-theme-data@${cdnVersion}/index.js`, "Failed to load CDN data");

    if (!DataStore.get("Elaina-First run")) {
        DataStore.set("Elaina-First run", true);
    }
}

// Import other modules
const modulesToImport = [
    "./src/theme/applyUi.js",
    "./src/theme/homepage.js",
    "./src/theme/filters.js",
    "./src/theme/loadCss.js",
    "./src/theme/themePresetSettingsTab.js",
    "./src/updates/manualUpdate.js",
    "./src/plugins/customStatus.js",
    "./src/plugins/autoAccept.js",
    "./src/plugins/buyAllChamps.js",
    "./src/plugins/customBeRp.js",
    "./src/plugins/customProfile.js",
    "./src/plugins/dodgeButton.js",
    "./src/plugins/hideFriendlist.js",
    "./src/plugins/lootHelper.js",
    "./src/plugins/nameSpoofer.js",
    "./src/plugins/offlineMode.js",
    "./src/plugins/practice5vs5.js",
    "./src/plugins/debug.js",
    "./src/plugins/inviteAllFriends.js",
    "./src/plugins/forceJungleLane.js"
];

modulesToImport.forEach(module => import(module));

//Load text files
const loadTextFile = async (path) => {
    try {
        const content = await PluginFS.read(path);
        if (content === undefined) {
            throw new Error(`File not found: ${path}`);
        }
        return content;
    } catch (err) {
        error(`Failed to load text file: ${path}`, err);
        return null;
    }
};

// Load text files
Promise.all([
    loadTextFile("./src/config/customStatus.txt"),
    loadTextFile("./src/config/pandoru.txt")
]).then(([customStatus, pandoru]) => {
    if (customStatus) DataStore.set("customStatus", customStatus);
    if (pandoru) DataStore.set("pandoru", pandoru);
}).catch(err => error('Error loading text files:', err));

const checkServerAvailability = async () => {
    log('Checking server availability');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch('https://elainatheme.xyz/numberOfUsers', { signal: controller.signal });
        const { count } = await response.json();
        log('Number of users:', count);
        const { default: serverModule } = await import('https://elainatheme.xyz/index.js');
        //await serverModule();
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
};

checkServerAvailability().catch(err => error('Failed to check server availability:', err));

// Export Init
let {Cdninit} = await import (initLink)
export function init(context) {
    log('Initializing theme');
    setHomePage(context);
    transparentLobby(context);
    Cdninit(context);
}

// Get this theme folder's name and export it
export function getThemeName() {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0];
    const match = scriptPath?.match(/\/([^/]+)\/index\.js$/);
    return match ? match[1] : null;
}