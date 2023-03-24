/* By Elaina Da Catto */
/* Meow~~~ */


//Add something to client
import './resources/LoadingScreen'
import './resources/LL-Settings'
import './resources/Button+Filter'

//Change or delete something from client
import './resources/Avatar'
import './resources/ChangeClientContents'
import './resources/HideChampsArt'

//Addon plugins
import './resources/Aram-only'
import './resources/Auto-accept'
import './resources/Dodge-button'
import './resources/Offline-mode'
import './resources/Hide_friendlist'

//Configs
import data from './configs/ElainaV2_config.json'

//Load CSS file
import './resources/LoadMainCss'

//Console	
window.addEventListener('load', () => {	
	console.log('By Elaina Da Catto');
	console.log('Meow ~~~');
	console.log(data["custom_log"]);
})