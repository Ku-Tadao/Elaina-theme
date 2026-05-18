/**
 * Fetches the current summoner's PUUID
 * @returns {Promise<string>} The summoner PUUID
 */
export async function getPUUID(): Promise<string> {
    const response = await fetch("/lol-summoner/v1/current-summoner");
    const data = await response.json();
    return data.puuid;
}
