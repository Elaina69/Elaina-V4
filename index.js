/**
 * @name ElainaV4
 * @author Elaina
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

// File regexes for matching asset types
const FILE_REGEX = {
    Wallpaper: /\.(mp4|webm|mkv|mov|avi|wmv)$/i,
    ImageWallpaper: /\.(png|jpg|jpeg|gif)$/i,
    Audio: /\.(mp3|flac|ogg|wav|aac)$/i,
    Font: /\.(ttf|otf)$/i,
    Banner: /\.(png|jpg|jpeg|gif)$/i
};

// Get the theme's name dynamically
export function getThemeName() {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0];
    const match = scriptPath?.match(/\/([^/]+)\/index\.js$/);
    return match ? match[1] : null;
}

// Base URL to assets
const ASSETS_BASE_URL = `//plugins/${getThemeName()}/src/assets/`;

// Fetch and parse the assets list from the assets-list.txt file
const fetchAssetList = async () => {
    try {
        const response = await fetch(`${ASSETS_BASE_URL}assets-list.txt`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    } catch (err) {
        error('Failed to load assets list:', err);
        return [];
    }
};

// Refresh backgrounds and store lists in DataStore
const refreshBackgroundsList = async () => {
    try {
        const assets = await fetchAssetList();

        // For debugging
        console.log('Assets:', assets);

        const filteredLists = Object.keys(FILE_REGEX).reduce((acc, key) => {
            acc[key] = assets
                .filter(file => {
                    if (!FILE_REGEX[key].test(file)) return false;
                    if (key === 'Wallpaper' && !file.startsWith('backgrounds/wallpapers/')) return false;
                    if (key === 'Audio' && !file.startsWith('backgrounds/audio/')) return false;
                    // Add similar conditions for other asset types if needed
                    return true;
                })
                .map(file => `${ASSETS_BASE_URL}${file}`); // Construct the full URL
            return acc;
        }, {});

        // For debugging
        console.log('Filtered Lists:', filteredLists);

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


// Refreshing the backgrounds list
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
import { setHomePage } from "./src/theme/homepage.js";
import { transparentLobby } from "./src/theme/applyUi.js";

// CDN Import Helper
const cdnImport = async (url, errorMsg) => {
    try {
        const res = await fetch(url);
        if (res.status === 200) {
            await import(url);
        } else {
            throw new Error();
        }
    } catch {
        console.warn(`${CONSOLE_STYLE.prefix}%c ${errorMsg}`, CONSOLE_STYLE.css, "");
        Toast.error(errorMsg);
    }
};

// Determine CDN link based on dev mode or first run
let initLink;
if (DataStore.get("Dev-mode")) {
    initLink = `//plugins/${getThemeName()}/elaina-theme-data/cdninit.js`;
    await cdnImport(`//plugins/${getThemeName()}/elaina-theme-data/index.js`, "Failed to load local data");
} else {
    const cdnVersion = DataStore.get("Elaina-First run")
        ? DataStore.get("Cdn-version")
        : "latest";

    initLink = `https://unpkg.com/elaina-theme-data@${cdnVersion}/cdninit.js`;
    await cdnImport(`https://unpkg.com/elaina-theme-data@${cdnVersion}/index.js`, "Failed to load CDN data");

    if (!DataStore.get("Elaina-First run")) {
        DataStore.set("Elaina-First run", true);
    }
}

// Import additional theme modules
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

// Load text files asynchronously
const loadTextFile = async (path) => {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        return content || null;
    } catch (err) {
        error(`Failed to load text file: ${path}`, err);
        return null;
    }
};

// Load custom text files
Promise.all([
    loadTextFile(`${ASSETS_BASE_URL}../config/customStatus.txt`),
    loadTextFile(`${ASSETS_BASE_URL}../config/pandoru.txt`)
]).then(([customStatus, pandoru]) => {
    if (customStatus) DataStore.set("customStatus", customStatus);
    if (pandoru) DataStore.set("pandoru", pandoru);
}).catch(err => error('Error loading text files:', err));

// Check server availability
const checkServerAvailability = async () => {
    log('Checking server availability');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch('https://elainatheme.xyz/numberOfUsers', { signal: controller.signal });
        const { count } = await response.json();
        log('Number of users:', count);
        //If you need to import and execute a module from the server
        const { default: serverModule } = await import('https://elainatheme.xyz/index.js');
        //await serverModule();
    } catch (err) {
        clearTimeout(timeoutId);
        error('Failed to check server availability:', err);
    }
};

checkServerAvailability().catch(err => error('Failed to check server availability:', err));

// Export Init
let { Cdninit } = await import(initLink);
export function init(context) {
    log('Initializing theme');
    setHomePage(context);
    transparentLobby(context);
    Cdninit(context);
}
