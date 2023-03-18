/* By Elaina Da Catto */
/* Meow~~~ */


//Main Utility
import utils from './resources/_utilselaina'

//Add something to client
import './resources/LoadingScreen'
import './resources/CreateHomepage'
import './resources/Homepagebuttons'
import './resources/Watermark'
import './resources/LL-Settings'

//Change or delete something from client
import './resources/Avatar'
import './resources/ChangeClientContents'
import './resources/ThemeFilter'
import './resources/HideChampsArt'
import './resources/MouseCursor'

//Addon plugins
import './resources/Hide_friendlist' 
import './resources/Aram-only'
import './resources/Auto-accept'
import './resources/Dodge-button'
import './resources/Offline-mode'

//Configs
import data from './configs/ElainaV2_config.json'
let default_settings = data

//Load CSS file
window.addEventListener('load', () => {	
	utils.addCss(default_settings["css_file"]);

//Console	
	console.log('By Elaina Da Catto');
	console.log('Meow ~~~');
	console.log(default_settings["custom_log"]);
})
