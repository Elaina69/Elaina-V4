const version = "1.2.0"
let riotclient_auth, riotclient_port;
let regex_rc_auth = /^--riotclient-auth-token=(.+)$/
let regex_rc_port = /^--riotclient-app-port=([0-9]+)$/
let phase; // automatically updated to current gameflow phase
let debug_sub = true // to display debug messages
let routines = [] // array of functions that will be called routinely
let mutationCallbacks = [] // array of functions that will be called in mutation observer
let pvp_net_id; // automatically updated to your pvp.net id
let summoner_id; // automatically updated to your summonerId
let summoner_region; // player current region

/** used to add css files to document body */
function addCss(filename) {
	const style = document.createElement('link')
	style.href = filename
	style.type = 'text/css'
	style.rel = 'stylesheet'
	document.body.append(style)
}

/**
 * Subscribe to a specific endpoint, and trigger callback function when that endpoint is called
 * @param {string} endpoint Endpoint you wish to monitor. ex: /lol-gameflow/v1/gameflow-phase , send "" to subscribe to all
 * @param {function} callback The callback function
 */
async function subscribe_endpoint(endpoint, callback) {
	const uri = document.querySelector('link[rel="riot:plugins:websocket"]').href
	const ws = new WebSocket(uri, 'wamp')

	ws.onopen = () => ws.send(JSON.stringify([5, 'OnJsonApiEvent' + endpoint.replace(/\//g, '_')]))
	ws.onmessage = callback
}

/** fetch the Riot client API port/auth and save it to variables that can be exported */
async function fetch_riotclient_credentials() {
	await fetch("/riotclient/command-line-args", {
		"method": "GET",
	}).then(response => response.json()).then(data => {
		data.forEach(elem => {
			if (regex_rc_auth.exec(elem))
				utils.riotclient_auth = regex_rc_auth.exec(elem)[1];
			else if (regex_rc_port.exec(elem))
				utils.riotclient_port = regex_rc_port.exec(elem)[1];
		});
	})
	if (debug_sub)
		console.log(utils.riotclient_auth, utils.riotclient_port)
}

/** Callback function to be sent in subscribe_endpoint() to update the variable holding user pvp.net infos */
let updateUserPvpNetInfos = async message => {
	let data = JSON.parse(message["data"])[2]["data"];
	if (data != undefined) {
		utils.pvp_net_id = data["id"];
		utils.summoner_id = data["summonerId"]
	}
}

/** Callback function to be sent in subscribe_endpoint() to update the variable monitoring the gameflow phase */
let updatePhaseCallback = async message => { phase = JSON.parse(message["data"])[2]["data"]; }

/** Callback function to be sent in subscribe_endpoint() to log uri & data object */
let debugLogEndpoints = async message => { if (debug_sub) console.log(JSON.parse(message["data"])[2]["uri"], JSON.parse(message["data"])[2]["data"]) }

/**
 * Add function to be called in the MutationObserver API
 * @param {function} callback The callback function
 * @param {[string]} targets The list of class targets
 */
function routineAddCallback(callback, target) {
	routines.push({ "callback": callback, "targets": target })
}

function mutationObserverAddCallback(callback, target) {
	mutationCallbacks.push({ "callback": callback, "targets": target })
}

let utils = {
	riotclient_auth: riotclient_auth,
	riotclient_port: riotclient_port,
	phase: phase,
	summoner_id: summoner_id,
	pvp_net_id: pvp_net_id,
	subscribe_endpoint: subscribe_endpoint,
	routineAddCallback: routineAddCallback,
	mutationObserverAddCallback: mutationObserverAddCallback,
	addCss: addCss
}

export default utils

window.addEventListener('load', () => {
	fetch_riotclient_credentials()
	subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updatePhaseCallback)
	subscribe_endpoint("/lol-chat/v1/me", updateUserPvpNetInfos)
	subscribe_endpoint("", debugLogEndpoints)
	window.setInterval(() => {
		routines.forEach(routine => {
			routine.callback()
		})
	}, 1300)

	const observer = new MutationObserver((mutationsList) => {
		for (let mutation of mutationsList) {
			for (let addedNode of mutation.addedNodes) {
				if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList) {
					for (let addedNodeClass of addedNode.classList) {
						for (let obj of mutationCallbacks) {
							if (obj.targets.indexOf(addedNodeClass) != -1 || obj.targets.indexOf("*") != -1) {
								obj.callback(addedNode)
							}
						}
					}
				}
			}
		}
	});
	observer.observe(document, { attributes: false, childList: true, subtree: true });
})