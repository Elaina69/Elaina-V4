let riotclient_auth: any, riotclient_port: any
let regex_rc_auth = /^--riotclient-auth-token=(.+)$/
let regex_rc_port = /^--riotclient-app-port=([0-9]+)$/
let debug_sub = true

async function subscribe_endpoint(endpoint: any, callback: any) {
	const getUri: any = document.querySelector('link[rel="riot:plugins:websocket"]')
	const uri = getUri.href
	const ws = new WebSocket(uri, 'wamp')

	ws.onopen = () => ws.send(JSON.stringify([5, 'OnJsonApiEvent' + endpoint.replace(/\//g, '_')]))
	ws.onmessage = callback
}

async function fetch_riotclient_credentials() {
	await fetch("/riotclient/command-line-args", {
		"method": "GET",
	}).then(response => response.json()).then((data) => {
		data.forEach((elem: any) => {
			if (regex_rc_auth.exec(elem)) {
				//@ts-ignore
				riotclient_auth = regex_rc_auth.exec(elem)[1];
			}
			else if (regex_rc_port.exec(elem)) {
				//@ts-ignore
				riotclient_port = regex_rc_port.exec(elem)[1];
			}
		});
	})
}

let debugLogEndpoints = async (message: any) => { 
	if (window.DataStore.get("Debug-mode")) {
		if (debug_sub) console.log(JSON.parse(message["data"])[2]["uri"], 
		JSON.parse(message["data"])[2]["data"]) 
	}
}

window.addEventListener('load', () => {
	fetch_riotclient_credentials()
	if (window.DataStore.get("Debug-mode")) {
		subscribe_endpoint("", debugLogEndpoints)
	}
})