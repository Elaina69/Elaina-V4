/**
 * @author Teisseire117
 * @Modifierss Elaina Da Catto
 * @version 1.4.0
 * @Nyan Meow~~~
 */

let 
	pvp_net_id /* automatically updated to your pvp.net id */,
	summoner_id /* automatically updated to your summonerId */,
	phase /* automatically updated to current gameflow phase */
let routines = [] // array of functions that will be called routinely
let mutationCallbacks = [] // array of functions that will be called in mutation observer
let idCreationCallbacks = []
let idDeletionCallbacks = []
let tagCreationCallbacks = []
let tagDeletionCallbacks = []
let classCreationCallbacks = []
let classDeletionCallbacks = []

/** used to add css files to document body */
function addCss (cssvar,folder,name,css) {
	let NStyle = document.createElement('style')
		NStyle.appendChild(document.createTextNode(
			'@import url("'+css+'");:root {'+cssvar+':url('+folder+'/'+name+')}'
		))
	document.body.appendChild(NStyle)
}

function addFont (folder,font,font_family) {
	let Font = document.createElement('style')
		Font.appendChild(document.createTextNode(
			'@font-face {font-family: '+font_family+'; src: url('+folder+'/'+font+')}'
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
	addCss("","","",css)
}

async function getSummonerIDByName(name) {
	let res = await fetch(`/lol-summoner/v1/summoners?name=${name}`)
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

function subscribeToElementCreation(target, callback) {
    if (target[0] === '.') {
        target = target.slice(1)
        classCreationCallbacks.push({ target, callback })
    } else if (target[0] === '#') {
        target = target.slice(1)
        idCreationCallbacks.push({ target, callback })
    } else {
        tagCreationCallbacks.push({ target, callback })
    }
}

function subscribeToElementDeletion(target, callback) {
    if (target[0] === '.') {
        target = target.slice(1)
        classDeletionCallbacks.push({ target, callback })
    } else if (target[0] === '#') {
        target = target.slice(1)
        idDeletionCallbacks.push({ target, callback })
    } else {
        tagDeletionCallbacks.push({ target, callback })
    }
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

			for (let node of mutation.addedNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					if (node.id != '') {    
						for (let obj of idCreationCallbacks) {
							if (node.id.indexOf(obj.target) != -1) {
								obj.callback(node)
							}
						}
					}
	
					let tagLowered = node.tagName.toLowerCase()
					for (let obj of tagCreationCallbacks) {
						if (tagLowered.indexOf(obj.target) != -1) {
							obj.callback(node)
						}
					}
	
					let classList = node.classList
					if (classList) {
						for (let nodeClass of classList) {
							let classLowered = nodeClass.toLowerCase()
							for (let obj of classCreationCallbacks) {
								if (classLowered.indexOf(obj.target) != -1) {
									obj.callback(node)
								}
							}
						}
					}
				}
			}
	
			for (let node of mutation.removedNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					for (let obj of idDeletionCallbacks) {
						if (node.id.indexOf(obj.target) != -1) {
							obj.callback(node)
						}
					}
	
					let tagLowered = node.tagName.toLowerCase()
					for (let obj of tagDeletionCallbacks) {
						if (tagLowered.indexOf(obj.target) != -1) {
							obj.callback(node)
						}
					}
	
					let classList = node.classList
					if (classList) {
						for (let nodeClass of classList) {
							let classLowered = nodeClass.toLowerCase()
							for (let obj of classDeletionCallbacks) {
								if (classLowered.indexOf(obj.target) != -1) {
									obj.callback(node)
								}
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
	subscribeToElementCreation:subscribeToElementCreation,
	subscribeToElementDeletion:subscribeToElementDeletion,
	addCss: addCss,
	addFont: addFont,
	CustomCursor: CustomCursor,
	getSummonerIDByName: getSummonerIDByName
}

export default utils