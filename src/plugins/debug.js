let riotclient_auth, riotclient_port
let regex_rc_auth = /^--riotclient-auth-token=(.+)$/
let regex_rc_port = /^--riotclient-app-port=([0-9]+)$/
let debug_sub = true

async function subscribe_endpoint(endpoint, callback) {
	const uri = document.querySelector('link[rel="riot:plugins:websocket"]').href
	const ws = new WebSocket(uri, 'wamp')

	ws.onopen = () => ws.send(JSON.stringify([5, 'OnJsonApiEvent' + endpoint.replace(/\//g, '_')]))
	ws.onmessage = callback
}

async function fetch_riotclient_credentials() {
	await fetch("/riotclient/command-line-args", {
		"method": "GET",
	}).then(response => response.json()).then(data => {
		data.forEach(elem => {
			if (regex_rc_auth.exec(elem)) {
				riotclient_auth = regex_rc_auth.exec(elem)[1];
			}
			else if (regex_rc_port.exec(elem)) {
				riotclient_port = regex_rc_port.exec(elem)[1];
			}
		});
	})
}

let debugLogEndpoints = async message => { 
	if (DataStore.get("Debug-mode")) {
		if (debug_sub) console.log(JSON.parse(message["data"])[2]["uri"], 
		JSON.parse(message["data"])[2]["data"]) 
	}
}

window.addEventListener('load', () => {
	fetch_riotclient_credentials()
	if (DataStore.get("Debug-mode")) {
		subscribe_endpoint("", debugLogEndpoints)
	}
})