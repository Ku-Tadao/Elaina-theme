import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"

export async function queueSection(): Promise<HTMLElement> {
    const queueList = ElainaData.get("queueList")
    const gamemodeItems = (queueList["Gamemode"] || []).map((o: any) => ({
        label: o.description, value: o.queueId
    }))

    return UI.createSection("plugins-settings-queue", await getString("plugins-settings.settings-section-plugin-queue"), [
        UI.createCheckBox(
            `${await getString("plugins-settings.auto-find-queue")}`, 'autoq', 'autoqbox',
            () => {
                restartAfterChange('autoq', "Auto-Find-Queue")
            }, true, "Auto-Find-Queue"
        ),
        UI.createRow("Q-Delay", [
            UI.createRow("Create-Delay", [
                UI.createLabel(`${await getString("plugins-settings.create-delay")}`, "Create-Delay-Text"),
                UI.createSearchBox("Create-Delay"),
            ]),
            UI.createRow("Find-Delay", [
                UI.createLabel(`${await getString("plugins-settings.find-delay")}`, "Find-Delay-Text"),
                UI.createSearchBox("Find-Delay")
            ])
        ]),
        UI.createDropdown(gamemodeItems, ElainaData.get("Gamemode"), {
            title: await getString("plugins-settings.gamemode"),
            datastoreKey: "Gamemode",
        }),
    ])
}
