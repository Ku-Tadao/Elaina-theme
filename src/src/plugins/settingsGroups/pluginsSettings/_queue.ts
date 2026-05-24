import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"

export async function queueSection(): Promise<HTMLElement> {
    const queueList = ElainaData.get("queueList")
    const gamemodeItems = (queueList["Gamemode"] || []).map((o: any) => ({
        label: o.description, value: o.queueId
    }))

    return UI.createSection("plugins-settings-queue", await getString("settings-section-plugin-queue"), [
        UI.createCheckBox(
            `${await getString("auto-find-queue")}`, 'autoq', 'autoqbox',
            () => {
                restartAfterChange('autoq', "Auto-Find-Queue")
            }, true, "Auto-Find-Queue"
        ),
        UI.createRow("Q-Delay", [
            UI.createRow("Create-Delay", [
                UI.createLabel(`${await getString("Create-Delay")}`, "Create-Delay-Text"),
                UI.createSearchBox("Create-Delay"),
            ]),
            UI.createRow("Find-Delay", [
                UI.createLabel(`${await getString("Find-Delay")}`, "Find-Delay-Text"),
                UI.createSearchBox("Find-Delay")
            ])
        ]),
        UI.createDropdown(gamemodeItems, ElainaData.get("Gamemode"), {
            title: await getString("Gamemode"),
            datastoreKey: "Gamemode",
        }),
    ])
}
