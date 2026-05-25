import { UI } from "../settingsUI.ts"

export async function nsfwSection(): Promise<HTMLElement> {
    return UI.createCheckBox(
        `${await getString("theme-settings.nsfw-content")}`, 'nsfw', 'nsfwbox',
        () => { }, true, "NSFW-Content"
    )
}
