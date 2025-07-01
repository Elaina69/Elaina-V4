import { cdnImport } from "./theme/Cdn.ts"

// Get this theme folder's name and export it
export function getThemeName(): string | null {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0];
    const match = scriptPath?.match(/\/([^/]+)\/index\.js$/);
    return match ? match[1] : null;
}

export { cdnImport }

window.getThemeName = getThemeName
window.cdnImport = cdnImport