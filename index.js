/**
 * @name ElainaV3
 * @author Elaina Da Catto
 * @description Elaina theme 3rd Generation for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

console.log('By Elaina Da Catto');
console.log('Meow ~~~');

import "./data/Data.js"
import "./data/built-in_plugins/Custom-Status"
import "./data/built-in_plugins/Old-LL-Settings"
import "./data/ChangeFilters.js"
import "./data/homepage.js"
import "./data/loadCss.js"
import "./data/_utils.js"
import "./testUpdate.js"
//*
try  {
	let res = await fetch("https://unpkg.com/elainav3-data@latest/index.js")
	if (res.status == 200) {
		(await (() => import("https://unpkg.com/elainav3-data@latest/index.js"))()).default
	}
}
catch{console.log(`File doesn't exist, can't load ElainaV3 data`)}
/**/
//import "./data/built-in_plugins/ThemeSettings.js"