/**
 * Pauses execution for a specified time
 * @param {number} time - The time to pause in milliseconds
 * @returns {Promise<void>} A promise that resolves after the specified time
 */
export async function stop(time: number): Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, time));
}
