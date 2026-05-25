import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"

export async function updatesSection(): Promise<HTMLElement> {
    const br = () => document.createElement("br")

    return UI.createSection("theme-settings-updates", await getString("theme-settings.settings-section-updates"), [
        UI.createCheckBox(
            `${await getString("theme-settings.prevent-manual-update")}`, 'prvtup', 'prvtupbox',
            () => { }, true, "prevent-manual-update"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.holiday-message")}`, 'holiday', 'holidaybox', () => {
                restartAfterChange("holiday", "holiday-message")
            }, true, "holiday-message"
        ),
    ])
}
