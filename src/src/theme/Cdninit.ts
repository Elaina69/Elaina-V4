import { getThemeName } from "../otherThings";

const CONSOLE_STYLE = {
    prefix: '%c Elaina ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

const error = (message: string, ...args: string[]) => console.error(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);

let initLink: string

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
    } 
    catch {
        clearTimeout(timeoutId);
        error(errorMsg);
        window.Toast.error(errorMsg);
    }
};

if (window.DataStore.get("Dev-mode")) {
    initLink = `//plugins/${getThemeName()}/elaina-theme-data/cdninit.js`;
    await cdnImport(`//plugins/${getThemeName()}/elaina-theme-data/index.js`, "Failed to load local data");
} 
else {
    initLink = `https://cdn.jsdelivr.net/npm/elaina-theme-data/cdninit.js`;
    await cdnImport(`https://cdn.jsdelivr.net/npm/elaina-theme-data/index.js`, "Failed to load CDN data");
}


const { Cdninit } = await cdnImport(initLink, "Failed to load Init data")
    .then( res => { return res ? res : {} })
    .catch( err => { 
        error("Failed to destructure init property", err)
        window.restartClient()
    });

export { Cdninit }