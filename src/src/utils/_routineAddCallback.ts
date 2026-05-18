/**
 * Adds a routine callback
 * @param {function} callback - The callback function
 * @param {string} target - The list of class targets
 */
export function routineAddCallback(
    routines: {callback: Function, target: string[]}[],
    callback: Function,
    target: string[]
) {
    routines.push({ callback, target });
}
