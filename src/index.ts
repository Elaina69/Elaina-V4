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

const log = (message: string, ...args: string[]) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
const error = (message: string, ...args: string[]) => console.error(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);

log('By %cElaina Da Catto', 'color: #e4c2b3');
log('%cMeow ~~~', 'color: #e4c2b3');

import "./src/services/backupAndRestoreDatastore.ts";

const FILE_REGEX: {Wallpaper: RegExp, Audio: RegExp, Font: RegExp, Banner: RegExp} = {
    Wallpaper: /\.(png|jpg|jpeg|gif|bmp|webp|ico|mp4|webm|mkv|mov|avi|wmv|3gp|m4v)$/,
    Audio: /\.(mp3|flac|ogg|wav|aac)$/,
    Font: /\.(ttf|otf|woff|woff2)$/,
    Banner: /\.(png|jpg|jpeg|gif|bmp|webp|ico)$/,
};

const ASSET_PATHS: {Wallpaper: string, Audio: string, Font: string, Banner: string} = {
    Wallpaper: "./src/assets/backgrounds/wallpapers",
    Audio: "./src/assets/backgrounds/audio",
    Font: "./src/assets/fonts",
    Banner: "./src/assets/icon/regalia-banners",
};

const refreshBackgroundsList = async (): Promise<void> => {
    try {
        const lists: Object = await Promise.all(
            Object.values(ASSET_PATHS).map((path: string) => window.PluginFS.ls(path))
        );
        
        const filteredLists: Object = Object.keys(ASSET_PATHS).reduce((acc: Object, key: string, index: number) => {
            acc[key] = lists[index].filter((file: any) => FILE_REGEX[key].test(file));
            return acc;
        }, {});

        Object.entries(filteredLists).forEach(([key, value]) => {
            window.DataStore.set(`${key}-list`, value);
        });

        window.DataStore.set("video-2nd-loop", false);
        log('Updated DataStore with lists');
    } catch (err: any) {
        error('Error refreshing backgrounds list:', err);
        window.DataStore.set("manual-add-background", true);
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

// Importing theme contents
log('Importing theme contents');

import { setHomePage } from "./src/theme/homepage.ts";
import { transparentLobby } from "./src/theme/applyUi.ts";

// Import CDN modules
let initLink: string
const cdnImport = async (url: string, errorMsg: any): Promise<void> => {
    try {
        const res = await fetch(url);
        if (res.status === 200) {
            await import(url);
        } else {
            throw new Error();
        }
    } catch {
        log(errorMsg);
        window.Toast.error(errorMsg);
    }
};

if (window.DataStore.get("Dev-mode")) {
    initLink = `//plugins/${getThemeName()}/elaina-theme-data/cdninit.js`;
    await cdnImport(`//plugins/${getThemeName()}/elaina-theme-data/index.js`, "Failed to load local data");
} 
else {
    let cdnVersion = window.DataStore.get("Elaina-First run")
        ? window.DataStore.get("Cdn-version")
        : "latest";

    initLink = `https://unpkg.com/elaina-theme-data@${cdnVersion}/cdninit.js`;
    await cdnImport(`https://unpkg.com/elaina-theme-data@${cdnVersion}/index.js`, "Failed to load CDN data");

    if (!window.DataStore.get("Elaina-First run")) {
        window.DataStore.set("Elaina-First run", true);
    }
}

// Import other modules
import "./src/theme/applyUi.ts"
import "./src/theme/homepage.ts"
import "./src/theme/filters.ts"
import "./src/theme/loadCss.ts"
import "./src/theme/themePresetSettingsTab.ts"
import "./src/updates/manualUpdate.ts"
import "./src/plugins/customStatus.ts"
import "./src/plugins/autoAccept.ts"
import "./src/plugins/buyAllChamps.ts"
import "./src/plugins/customBeRp.ts"
import "./src/plugins/customProfile.ts"
import "./src/plugins/dodgeButton.ts"
import "./src/plugins/hideFriendlist.js"
import "./src/plugins/lootHelper.ts"
import "./src/plugins/nameSpoofer.ts"
import "./src/plugins/offlineMode.ts"
import "./src/plugins/practice5vs5.ts"
import "./src/plugins/debug.ts"
import "./src/plugins/inviteAllFriends.ts"
import "./src/plugins/forceJungleLane.ts"


//Load text files
// const loadTextFile = async (path: string) => {
//     try {
//         const content = await window.PluginFS.read(path);
//         if (content === undefined) {
//             throw new Error(`File not found: ${path}`);
//         }
//         return content;
//     } catch (err: any) {
//         error(`Failed to load text file: ${path}`, err);
//         return null;
//     }
// };

// // Load text files
// Promise.all([
//     loadTextFile("./src/config/customStatus.txt"),
//     loadTextFile("./src/config/pandoru.txt")
// ]).then(([customStatus, pandoru]) => {
//     if (customStatus) window.DataStore.set("customStatus", customStatus);
//     if (pandoru) window.DataStore.set("pandoru", pandoru);
// }).catch(err => error('Error loading text files:', err));

const checkServerAvailability = async (): Promise<void> => {
    log('Checking server availability');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch('https://elainatheme.xyz/numberOfUsers', { signal: controller.signal });
        const { count } = await response.json();
        log('Number of users:', count);
        const { default: serverModule } = await import('https://elainatheme.xyz/index.js');
        //await serverModule();
    } catch (err: any) {
        clearTimeout(timeoutId);
        throw err;
    }
};

checkServerAvailability().catch((err: any) => error('Failed to check server availability:', err));

// Export Init
let {Cdninit} = await import(initLink)
export function init(context: any) {
    log('Initializing theme');
    setHomePage(context);
    transparentLobby(context);
    Cdninit(context);
}

// Get this theme folder's name and export it
export function getThemeName(): string | null {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0];
    const match = scriptPath?.match(/\/([^/]+)\/index\.js$/);
    return match ? match[1] : null;
}