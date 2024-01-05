/**
 * @author Teisseire117
 * @Modifierss Elaina Da Catto
 * @version 1.4.1
 * @Nyan Meow~~~
 */

let pvp_net_id /* automatically updated to your pvp.net id */,
	summoner_id /* automatically updated to your summonerId */,
	phase /* automatically updated to current gameflow phase */
let routines = [] // array of functions that will be called routinely
let mutationCallbacks = [] // array of functions that will be called in mutation observer

/** used to add css files to document body */

function addStyle(style) {
	let NStyle = document.createElement('style')
		NStyle.appendChild(document.createTextNode(style))
	document.body.appendChild(NStyle)
}

function addFont (folder,font_id,font_family) {
	let Font = document.createElement('style')
		Font.id = font_id
		Font.appendChild(document.createTextNode(
			'@font-face {font-family: '+font_family+'; src: url('+folder+')}'
		))
	document.body.appendChild(Font)
}

function CustomCursor (folder,css) {
	let cursor = document.createElement("div")
			cursor.classList.add("cursor")
			cursor.style.background = folder

	document.addEventListener('mousemove', function(e){
		cursor.style.transform = `translate3d(calc(${e.clientX}px - 40%), calc(${e.clientY}px - 40%), 0)`
	})
	let body = document.querySelector("html")
		body.appendChild(cursor)
	addStyle(css)
}

async function getSummonerID() {
	let res = await fetch("/lol-summoner/v1/current-summoner")
    let data = await res.json()
	return JSON.parse(data["summonerId"])
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

/**
 * Add function to be called in the MutationObserver API
 * @param {function} callback The callback function
 * @param {string} target The list of class targets
 */
function routineAddCallback(callback, target) {
	routines.push({ "callback": callback, "targets": target })
}

function mutationObserverAddCallback(callback, target) {
	mutationCallbacks.push({ "callback": callback, "targets": target })
}

window.addEventListener('load', () => {
	subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updatePhaseCallback)
	subscribe_endpoint("/lol-chat/v1/me", updateUserPvpNetInfos)
	window.setInterval(() => {
		routines.forEach(routine => {
			routine.callback()
		})
	}, 1000)

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
	observer.observe(document, { attributes: true, childList: true, subtree: true });
})

let utils = {
	phase: phase,
	summoner_id: summoner_id,
	pvp_net_id: pvp_net_id,
	subscribe_endpoint: subscribe_endpoint,
	routineAddCallback: routineAddCallback,
	mutationObserverAddCallback: mutationObserverAddCallback,
	addStyle: addStyle,
	addFont: addFont,
	CustomCursor: CustomCursor,
	getSummonerID: getSummonerID
}

export default utils