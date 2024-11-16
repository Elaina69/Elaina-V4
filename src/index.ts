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
const warn = (message: string, ...args: string[]) => console.warn(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
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

// const refreshBackgroundsList = async (): Promise<void> => {
//     try {
//         const lists: Object = await Promise.all(
//             Object.values(ASSET_PATHS).map((path: string) => window.PluginFS.ls(path))
//         );
        
//         const filteredLists: Object = Object.keys(ASSET_PATHS).reduce((acc: Object, key: string, index: number) => {
//             acc[key] = lists[index].filter((file: any) => FILE_REGEX[key].test(file));
//             return acc;
//         }, {});

//         Object.entries(filteredLists).forEach(([key, value]) => {
//             window.DataStore.set(`${key}-list`, value);
//         });

//         window.DataStore.set("video-2nd-loop", false);
//         log('Updated DataStore with lists');
//     } catch (err: any) {
//         error('Error refreshing backgrounds list:', err);
//         window.DataStore.set("manual-add-background", true);
//     }
// };

// log('Refreshing backgrounds list');

// const backgroundListInterval = setInterval(async () => {
//     await refreshBackgroundsList();
//     if (document.getElementById("elaina-bg")) {
//         clearInterval(backgroundListInterval);
//         log('Stopped reloading list');
//     }
// }, 1000);

// Importing theme contents
log('Importing theme contents');

// Import CDN modules
let initLink: string

if (window.DataStore.get("Dev-mode")) {
    initLink = `//plugins/${getThemeName()}/elaina-theme-data/cdninit.js`;
    await cdnImport(`//plugins/${getThemeName()}/elaina-theme-data/index.js`, "Failed to load local data");
} 
else {
    let cdnVersion = window.DataStore.get("Elaina-First run")
        ? window.DataStore.get("Cdn-version")
        : "latest";

    initLink = `https://cdn.jsdelivr.net/npm/elaina-theme-data@${cdnVersion}/cdninit.js`;
    await cdnImport(`https://cdn.jsdelivr.net/npm/elaina-theme-data@${cdnVersion}/index.js`, "Failed to load CDN data");

    if (!window.DataStore.get("Elaina-First run")) {
        window.DataStore.set("Elaina-First run", true);
    }
}

const { Cdninit } = await cdnImport(initLink, "Failed to load Init data")

// Import other modules
import { setHomePage } from "./src/theme/homepage.ts";
import { transparentLobby } from "./src/theme/applyUi.ts";
import "./src/theme/applyUi.ts"
import "./src/theme/homepage.ts"
import "./src/theme/filters.ts"
import "./src/theme/loadCss.ts"
import "./src/theme/themePresetSettingsTab.ts"
import "./src/updates/manualUpdate.ts"
import "./src/plugins/customStatus.ts"
import "./src/plugins/autoAccept.ts"
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

// Check server
const checkServerAvailability = async (): Promise<void> => {
    log('Checking backup server availability');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
        const response = await fetch('https://elainatheme.xyz/numberOfUsers', { signal: controller.signal });
        const { count } = await response.json();
        log('Number of users:', count);
        const { default: serverModule } = await import('https://elainatheme.xyz/index.js');
    } catch (err: any) {
        clearTimeout(timeoutId);
        throw err;
    }
};
checkServerAvailability().catch((err: any) => error('Failed to check backup server availability:', err));

// Export Init
export function init(context: any) {
    log('Initializing theme');
    setHomePage(context);
    transparentLobby(context);
    Cdninit(context);
}

export async function cdnImport(url: string, errorMsg: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.status === 200) {
            const serverModule = await import(url);
            return serverModule
        } else {
            throw new Error();
        }
    } catch {
        clearTimeout(timeoutId);
        error(errorMsg);
        window.Toast.error(errorMsg);
    }
};

// Get this theme folder's name and export it
export function getThemeName(): string | null {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0];
    const match = scriptPath?.match(/\/([^/]+)\/index\.js$/);
    return match ? match[1] : null;
}

// Export theme log globally
window.log = log
window.warn = warn
window.error = error