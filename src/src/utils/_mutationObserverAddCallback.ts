/**
 * Adds a mutation observer callback
 * @param {function} callback - The callback function
 * @param {string} target - The list of class targets
 */
export function mutationObserverAddCallback(
    mutationCallbacks: {callback: Function, target: string[]}[],
    callback: Function,
    target: string[]
) {
    mutationCallbacks.push({ callback, target });
}
