import { warn, log } from "./utils/themeLog.js";
import { getThemeName } from "./otherThings.js";

async function importLocale(langCode: string): Promise<Object> {
    const module = await import(`//plugins/${getThemeName()}/locales/${langCode}.js`);
    return module.default;
}

function getClientLocale(): string  {
    const lang = document.querySelector("html")?.lang as string;
    return lang
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

/**
 * To check if a translation key exists in the specified language file or not.
 * @param lang The language code to check for the translation file, string
 * @param key The key to look up in the translation file, string
 * @returns 
 */
async function checkTranslationKey(lang: string, key: string): Promise<string> {
    let localeModule: Object

    if (await haveLocaleFile(lang)) {
        localeModule = await importLocale(lang) 
        if (!localeModule[key]) {
            warn(`Missing translation for key: ${key} in locale: ${lang}`);
            localeModule = await importLocale('default')

            if (!localeModule[key]) {
                warn(`Missing translation for key: ${key} in default locale.`);
                return key;
            }
        }
    }
    else localeModule = await importLocale('default')
        
    return localeModule[key]
}

/**
 * To get a translated string based on the current client locale.
 * @param key The key to look up in the translation file, string
 */
async function getString(key: string): Promise<string> {
    let result = await checkTranslationKey(getClientLocale(), key);
    return result
}

// Export getString globally
window.getString = getString;

export default getString;