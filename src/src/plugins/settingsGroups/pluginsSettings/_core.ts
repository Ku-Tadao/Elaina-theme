import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"

export async function coreSection(): Promise<HTMLElement> {
    const br = () => document.createElement("br")

    return UI.createSection("plugins-settings-core", await getString("settings-section-plugin-core"), [
        UI.createCheckBox(
            `${await getString("old-ll-settings")}`, 'oldll', 'oldllbox',
            () => {
                restartAfterChange('oldll', "Old-League-Loader-Settings")
            }, true, "Old-League-Loader-Settings"
        ),
        br(),
        UI.createRow("loothelp", [
            UI.createCheckBox(
                `${await getString("loot-helper")}`, 'lh', 'lhbox',
                () => {
                    restartAfterChange('lh', "loot-helper")
                }, true, "loot-helper"
            )
        ]),
        UI.createCheckBox(
            `${await getString("auto_accept_button")}`, 'autoacceptbutton', 'autoacceptbuttonbox',
            () => {
                if (!ElainaData.get("auto_accept_button")) {
                    document.getElementById("autoAcceptQueueButton")?.remove()
                    document.getElementById("autoAcceptDelayInput")?.remove()
                }
            }, true, "auto_accept_button"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("Enable-Invite-Fr")}`, 'invfr', 'invfrbox',
            () => {
                restartAfterChange("invfr", "Enable-Invite-Fr")
            }, true, "Enable-Invite-Fr"
        ),
    ])
}
