import { UI } from "../settingsUI.ts"
import { fileRegex } from "../../../utils/fileRegex.ts"

/**
 * Tạo một hàng UI cho phép người dùng thêm hoặc xóa các file tùy chỉnh
 * @param type Loại file: "wallpaper", "audio", "banner" hoặc "font"
 * @param dataKey Datastore key chứa danh sách các file
 * @param inputKey Datastore key chứa tên file nhập vào
 * @param regex Biểu thức chính quy kiểm tra định dạng file
 */
async function createFileListRow(
    type: string,
    dataKey: string,
    inputKey: string,
    regex: RegExp,
): Promise<HTMLElement[]> {
    const messageEl = () => document.querySelector("#add-background-manual-message") as HTMLElement | null;
    const labelId = `theme-settings-${type}-list`;
    const forbiddenFileNameChars = /[\\/:*?"<>|]/

    const updateLabel = async () => {
        const label = document.querySelector(`#${labelId}`) as HTMLElement | null;
        if (label) {
            label.innerText = `${await getString(type)}: \n[${ElainaData.get(dataKey).join(', ')}]`;
        }
    };

    const showMessage = async (msgKey: string, color: string) => {
        const text = messageEl();
        if (text) {
            text.textContent = await getString(msgKey);
            text.style.color = color;
        }
    };

    return [
        UI.createLabel(await getString(type) + `: \n[${ElainaData.get(dataKey).join(', ')}]`, labelId),
        UI.createRow(`manual-${type}`, [
            UI.createSearchBox(inputKey),
            UI.createButton(await getString("add"), `add-${type}`, async () => {
                const currentList: string[] = ElainaData.get(dataKey);
                const newItem: string = ElainaData.get(inputKey);

                if (forbiddenFileNameChars.test(newItem)) {
                    await showMessage(`invalid-${type}-format`, "red");
                } else if (!regex.test(newItem)) {
                    await showMessage(`invalid-${type}-format`, "red");
                } else if (currentList.includes(newItem)) {
                    await showMessage(`${type}-already-added`, "red");
                } else {
                    currentList.push(newItem);
                    ElainaData.set(dataKey, currentList);
                    await showMessage(`${type}-added`, "green");
                }
                await updateLabel();
            }),
            UI.createButton(await getString("delete"), `delete-${type}`, async () => {
                const currentList: string[] = ElainaData.get(dataKey);
                const deleteItem: string = ElainaData.get(inputKey);
                const index = currentList.indexOf(deleteItem);

                if (index !== -1) {
                    currentList.splice(index, 1);
                    ElainaData.set(dataKey, currentList);
                    await showMessage(`${type}-deleted`, "green");
                } else {
                    await showMessage(`${type}-not-exist`, "red");
                }
                await updateLabel();
            }),
        ]),
    ];
}

export async function assetLibrarySection(): Promise<HTMLElement> {
    return UI.createSection("theme-settings-asset-library", await getString("settings-section-asset-library"), [
        UI.createLabel(await getString("update-list-manually"), ""),
        UI.createRowHideable("add-background-manually-row", [
            UI.createLabel("", "add-background-manual-message", "theme-settings-message"),
            ...await createFileListRow("wallpaper", "Wallpaper-list", "manual-wallpaper-name", fileRegex.Wallpaper),
            ...await createFileListRow("audio", "Audio-list", "manual-audio-name", fileRegex.Audio),
            ...await createFileListRow("banner", "Banner-list", "manual-banner-name", fileRegex.Banner),
            ...await createFileListRow("font", "Font-list", "manual-font-name", fileRegex.Font),
        ]),
    ], !window.isContextFSExist)
}
