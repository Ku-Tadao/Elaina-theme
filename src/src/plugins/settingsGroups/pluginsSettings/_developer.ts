import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"

export async function developerSection(): Promise<HTMLElement> {
    const br = () => document.createElement("br")

    return UI.createSection("plugins-settings-developer", await getString("plugins-settings.settings-section-plugin-developer"), [
        UI.createCheckBox(
            `${await getString("plugins-settings.debug-mode")}`, 'debug', 'debugbox',
            () => {
                restartAfterChange('debug', "Debug-mode")
            }, ElainaData.get("Dev-button"), "Debug-mode"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("plugins-settings.developer-mode")}`, 'devbutton', 'devbuttonbox', () => {
                restartAfterChange('devbutton', "Dev-mode")

                if (!ElainaData.get("Dev-mode")) {}
                else {
                    window.alert("You just turned on developer mode \nIf you are not a developer, please turn it off right now \nOtherwise the whole theme will not work properly")
                }
            }, ElainaData.get("Dev-button"), "Dev-mode"
        ),
    ], ElainaData.get("Dev-button"))
}
