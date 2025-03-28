import { warn, log } from "./utils/themeLog.js";
import { getThemeName } from "./otherThings.js";

let knownLocale = false
let getStringTime = 0

async function importLocale(langCode: string): Promise<Object> {
    const module = await import(`//plugins/${getThemeName()}/locales/${langCode}.js`);
    return module.default;
}

async function haveLocaleFile(langCode: string) {
    try {
        await importLocale(langCode)
        return true
    } 
    catch {
        return false
    }
}

async function getString(key: string): Promise<string> {
    const lang = document.querySelector("html")?.lang as string;
    let localeModule

    if (await haveLocaleFile(lang)) {
        localeModule = await importLocale(lang)
        knownLocale = true
    }
    else {
        localeModule = await importLocale('default')
        knownLocale = false
    }
    
    if (getStringTime == 0) {
        if (knownLocale) log("Current locale:", lang)
        else log("Current locale:", 'default')
    }
    
    let result = localeModule[key];

    getStringTime += 1

    if (!result) {
        warn(`Missing translation for key: ${key}`);
        return key
    }

    return result
}

// Export getString globally
window.getString = getString;

export default getString;