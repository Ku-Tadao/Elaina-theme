import { UI } from "../settingsUI.ts"
import { fileRegex } from "../../../utils/fileRegex.ts"

const assetLocaleKeys: Record<string, string> = {
    wallpaper: "theme-settings.wallpaper",
    audio: "theme-settings.audio",
    banner: "theme-settings.banner",
    font: "theme-settings.font",
}

const assetMessageLocaleKeys: Record<string, Record<string, string>> = {
    wallpaper: {
        invalid: "theme-settings.invalid-wallpaper-format",
        added: "theme-settings.wallpaper-added",
        alreadyAdded: "theme-settings.wallpaper-already-added",
        deleted: "theme-settings.wallpaper-deleted",
        notExist: "theme-settings.wallpaper-not-exist",
    },
    audio: {
        invalid: "theme-settings.invalid-audio-format",
        added: "theme-settings.audio-added",
        alreadyAdded: "theme-settings.audio-already-added",
        deleted: "theme-settings.audio-deleted",
        notExist: "theme-settings.audio-not-exist",
    },
    banner: {
        invalid: "theme-settings.invalid-banner-format",
        added: "theme-settings.banner-added",
        alreadyAdded: "theme-settings.banner-already-added",
        deleted: "theme-settings.banner-deleted",
        notExist: "theme-settings.banner-not-exist",
    },
    font: {
        invalid: "theme-settings.invalid-font-format",
        added: "theme-settings.font-added",
        alreadyAdded: "theme-settings.font-already-added",
        deleted: "theme-settings.font-deleted",
        notExist: "theme-settings.font-not-exist",
    },
}

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
    const typeKey = assetLocaleKeys[type];
    const messageKeys = assetMessageLocaleKeys[type];

    const updateLabel = async () => {
        const label = document.querySelector(`#${labelId}`) as HTMLElement | null;
        if (label) {
            label.innerText = `${await getString(typeKey)}: \n[${ElainaData.get(dataKey).join(', ')}]`;
        }
    };

    const showMessage = async (msgKey: keyof typeof messageKeys, color: string) => {
        const text = messageEl();
        if (text) {
            text.textContent = await getString(messageKeys[msgKey]);
            text.style.color = color;
        }
    };

    return [
        UI.createLabel(await getString(typeKey) + `: \n[${ElainaData.get(dataKey).join(', ')}]`, labelId),
        UI.createRow(`manual-${type}`, [
            UI.createSearchBox(inputKey),
            UI.createButton(await getString("theme-settings.add"), `add-${type}`, async () => {
                const currentList: string[] = ElainaData.get(dataKey);
                const newItem: string = ElainaData.get(inputKey);

                if (forbiddenFileNameChars.test(newItem)) {
                    await showMessage("invalid", "red");
                } else if (!regex.test(newItem)) {
                    await showMessage("invalid", "red");
                } else if (currentList.includes(newItem)) {
                    await showMessage("alreadyAdded", "red");
                } else {
                    currentList.push(newItem);
                    ElainaData.set(dataKey, currentList);
                    await showMessage("added", "green");
                }
                await updateLabel();
            }),
            UI.createButton(await getString("theme-settings.delete"), `delete-${type}`, async () => {
                const currentList: string[] = ElainaData.get(dataKey);
                const deleteItem: string = ElainaData.get(inputKey);
                const index = currentList.indexOf(deleteItem);

                if (index !== -1) {
                    currentList.splice(index, 1);
                    ElainaData.set(dataKey, currentList);
                    await showMessage("deleted", "green");
                } else {
                    await showMessage("notExist", "red");
                }
                await updateLabel();
            }),
        ]),
    ];
}

export async function assetLibrarySection(): Promise<HTMLElement> {
    return UI.createSection("theme-settings-asset-library", await getString("theme-settings.settings-section-asset-library"), [
        UI.createLabel(await getString("theme-settings.update-list-manually"), ""),
        UI.createRowHideable("add-background-manually-row", [
            UI.createLabel("", "add-background-manual-message", "theme-settings-message"),
            ...await createFileListRow("wallpaper", "Wallpaper-list", "manual-wallpaper-name", fileRegex.Wallpaper),
            ...await createFileListRow("audio", "Audio-list", "manual-audio-name", fileRegex.Audio),
            ...await createFileListRow("banner", "Banner-list", "manual-banner-name", fileRegex.Banner),
            ...await createFileListRow("font", "Font-list", "manual-font-name", fileRegex.Font),
        ]),
    ], !window.isContextFSExist)
}
