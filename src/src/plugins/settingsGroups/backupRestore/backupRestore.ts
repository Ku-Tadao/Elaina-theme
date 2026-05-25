import { UI } from "../settingsUI.ts"
import { error } from "../../../utils/themeLog.ts"
import { manualBackupSection } from "./_manualBackup.ts"
import { cloudBackupSection } from "./_cloudBackup.ts"

export async function backuprestoretab(panel: Element) {
    const loading = UI.createRow("loading", [
        UI.createLoading(await getString("common.settings-loading")),
    ])
    panel.appendChild(loading);

    try {
        const cloud = await cloudBackupSection()

        panel.prepend(
            UI.createRow("",[
                ...await manualBackupSection(),
                ...cloud.elements,
            ])
        )

        await cloud.postSetup()
    }
    catch (err: any) {
        error("Error loading theme settings:", err);
    } finally {
        loading.remove();
    }
}