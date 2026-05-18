/**
 * Subscribes to a specific endpoint and triggers a callback when that endpoint is called
 * @param {string} endpoint - The endpoint to monitor (use "" to subscribe to all)
 * @param {function} callback - The callback function
 */
export async function subscribe_endpoint(endpoint: string, callback: any) {
    const getUri: HTMLAnchorElement | null= document.querySelector('link[rel="riot:plugins:websocket"]')
    const uri: any = getUri?.href;
    const ws = new WebSocket(uri, 'wamp');

    ws.onopen = () => ws.send(JSON.stringify([5, 'OnJsonApiEvent' + endpoint.replace(/\//g, '_')]));
    ws.onmessage = callback;
}
