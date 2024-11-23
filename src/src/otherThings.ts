import { getThemeName } from "../index.ts"
import { cdnImport } from "./theme/Cdninit.ts"
export { getThemeName }
export { cdnImport }

window.getThemeName = getThemeName
window.cdnImport = cdnImport