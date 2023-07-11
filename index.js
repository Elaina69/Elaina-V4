/**
 * @name ElainaV3
 * @author Elaina Da Catto
 * @description Elaina theme 3rd Generation for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

console.log('By Elaina Da Catto');
console.log('Meow ~~~');

async function ImportPlugins(link, name) {
	try  {let res = await fetch(link);if (res.status == 200) {(await (() => import(link))()).default}}
	catch{console.log(`File doesn't exist, can't load ${name}`)}
}

import "./data/Data.js"
import "./data/built-in_plugins/Custom-Status"
import "./data/built-in_plugins/Old-LL-Settings"
import "./data/ChangeFilters.js"
import "./data/homepage.js"
import "./data/loadCss.js"
ImportPlugins('https://cdn.skypack.dev/balance-buff-viewer-plugin@latest?min', "balance-buff-viewer-plugin")
ImportPlugins('https://fastly.jsdelivr.net/npm/elainav3-data@latest/index.js', "ElainaV3 data")