/**
 * @author Teisseire117
 * @modifier Elaina Da Catto
 * @version 1.4.1
 * @description Utility functions for League of Legends client customization
 */

// State variables
let pvp_net_id: any, summoner_id: any, phase: any;

const routines: {callback: Function, target: string[]}[] = [];
const mutationCallbacks: {callback: Function, target: string[]}[] = [];

/**
 * Adds a CSS style to the document body
 * @param {string} style - The CSS style to add
 */
function addStyle(style: string) {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(style));
    document.body.appendChild(styleElement);
}

function addStyleWithID(Id: string, style: string) {
    const styleElement = document.createElement('style');
    styleElement.id = Id
    styleElement.appendChild(document.createTextNode(style));
    document.body.appendChild(styleElement);
}

/**
 * Adds a font to the document
 * @param {string} folder - The font file path
 * @param {string} font_id - The ID for the style element
 * @param {string} font_family - The font family name
 */
function addFont(folder: string, font_id: string, font_family: string) {
    const fontStyle = document.createElement('style');
    fontStyle.id = font_id;
    fontStyle.appendChild(document.createTextNode(
        `@font-face {font-family: ${font_family}; src: url(${folder})}`
    ));
    document.body.appendChild(fontStyle);
}

/**
 * Adds a custom cursor to the document
 * @param {string} folder - The cursor image path
 * @param {string} css - Additional CSS for the cursor
 */
function CustomCursor(folder: string, css: string) {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    cursor.style.background = folder;

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 40%), calc(${e.clientY}px - 40%), 0)`;
    });

    let htmlElement: any = document.querySelector("html")
    htmlElement.appendChild(cursor);
    addStyle(css);
}

/**
 * Fetches the current summoner's ID
 * @returns {Promise<number>} The summoner ID
 */
async function getSummonerID(): Promise<number> {
    const response = await fetch("/lol-summoner/v1/current-summoner");
    const data = await response.json();
    return JSON.parse(data.summonerId);
}

/**
 * Subscribes to a specific endpoint and triggers a callback when that endpoint is called
 * @param {string} endpoint - The endpoint to monitor (use "" to subscribe to all)
 * @param {function} callback - The callback function
 */
async function subscribe_endpoint(endpoint: string, callback: any) {
    const getUri: HTMLAnchorElement | null= document.querySelector('link[rel="riot:plugins:websocket"]')
    const uri: any = getUri?.href;
    const ws = new WebSocket(uri, 'wamp');

    ws.onopen = () => ws.send(JSON.stringify([5, 'OnJsonApiEvent' + endpoint.replace(/\//g, '_')]));
    ws.onmessage = callback;
}

/**
 * Updates user PvP.net info
 * @param {MessageEvent} message - The WebSocket message event
 */
const updateUserPvpNetInfos = async (message: MessageEvent) => {
    const data = JSON.parse(message.data)[2].data;
    if (data) {
        pvp_net_id = data.id;
        summoner_id = data.summonerId;
    }
};

/**
 * Updates the gameflow phase
 * @param {MessageEvent} message - The WebSocket message event
 */
const updatePhaseCallback = async (message: MessageEvent) => {
    phase = JSON.parse(message.data)[2].data;
};

/**
 * Adds a routine callback
 * @param {function} callback - The callback function
 * @param {string} target - The list of class targets
 */
function routineAddCallback(callback: Function, target: string[]) {
    routines.push({ callback, target });
}

/**
 * Adds a mutation observer callback
 * @param {function} callback - The callback function
 * @param {string} target - The list of class targets
 */
function mutationObserverAddCallback(callback: Function, target: string[]) {
    mutationCallbacks.push({ callback, target });
}

// Initialize event listeners and observers
window.addEventListener('load', () => {
    subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updatePhaseCallback);
    subscribe_endpoint("/lol-chat/v1/me", updateUserPvpNetInfos);
    
    setInterval(() => {
        routines.forEach((routine) => routine.callback());
    }, 1000);

    const observer = new MutationObserver((mutationsList: any) => {
        for (const mutation of mutationsList) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList) {
                    for (const addedNodeClass of addedNode.classList) {
                        for (const obj of mutationCallbacks) {
                            if (obj.target.indexOf(addedNodeClass) !== -1 || obj.target.indexOf("*") !== -1) {
                                obj.callback(addedNode);
                            }
                        }
                    }
                }
            }
        }
    });
    
    observer.observe(document, { attributes: true, childList: true, subtree: true });
});

// Export utility functions
const utils = {
    phase,
    summoner_id,
    pvp_net_id,
    subscribe_endpoint,
    routineAddCallback,
    mutationObserverAddCallback,
    addStyle,
    addFont,
    CustomCursor,
    getSummonerID,
    addStyleWithID
};

export default utils;