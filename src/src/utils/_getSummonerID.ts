/**
 * Fetches the current summoner's ID
 * @returns {Promise<number>} The summoner ID
 */
export async function getSummonerID(): Promise<number> {
    const response = await fetch("/lol-summoner/v1/current-summoner");
    const data = await response.json();
    return JSON.parse(data.summonerId);
}
