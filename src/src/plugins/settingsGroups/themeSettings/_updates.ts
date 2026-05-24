import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"

export async function updatesSection(): Promise<HTMLElement> {
    const br = () => document.createElement("br")

    return UI.createSection("theme-settings-updates", await getString("settings-section-updates"), [
        UI.createCheckBox(
            `${await getString("prevent-manual-update")}`, 'prvtup', 'prvtupbox',
            () => { }, true, "prevent-manual-update"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("holiday-message")}`, 'holiday', 'holidaybox', () => {
                restartAfterChange("holiday", "holiday-message")
            }, true, "holiday-message"
        ),
    ])
}
