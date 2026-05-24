import { UI } from "../settingsUI.ts"

export async function nsfwSection(): Promise<HTMLElement> {
    return UI.createCheckBox(
        `${await getString("NSFW-Content")}`, 'nsfw', 'nsfwbox',
        () => { }, true, "NSFW-Content"
    )
}
