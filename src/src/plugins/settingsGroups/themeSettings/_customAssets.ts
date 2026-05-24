import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"

export async function customAssetsSection(): Promise<HTMLElement> {
    const br = () => document.createElement("br")

    /**
     * Tạo dropdown chọn banner từ danh sách banner
     */
    function createBannerDropdown(): HTMLElement {
        const items = ElainaData.get("Banner-list").map((b: string) => ({
            label: b, value: b
        }))
        return UI.createDropdown(items, ElainaData.get("CurrentBanner"), {
            datastoreKey: "CurrentBanner",
        })
    }

    return UI.createSection("theme-settings-custom-assets", await getString("settings-section-custom-assets"), [
        UI.createCheckBox(
            await getString("sync-user-icons"), 'syncusericons', 'syncusericonsbox', () => {
                restartAfterChange('syncusericons', "sync-user-icons")
            }, true, "sync-user-icons"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("custom-icon")}`, 'cusicon', 'cusiconbox',
            () => {
                restartAfterChange('cusicon', "Custom-Icon")
            }, true, "Custom-Icon"
        ),
        UI.createRowHideable("Custom-icon-list", [
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Loading-Icon")}`, 'cusloadicon', 'cusloadiconbox',
                () => {
                    restartAfterChange('cusloadicon', "Custom-Loading-Icon")
                }, true, "Custom-Loading-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("custom-avatar")}`, 'cusav', 'cusavbox',
                () => {
                    restartAfterChange('cusav', "Custom-Avatar")
                }, true, "Custom-Avatar"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Border")}`, 'cusbor', 'cusborbox',
                () => {
                    restartAfterChange('cusbor', "Custom-Border")
                }, true, "Custom-Border"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Regalia-Banner")}`, 'cusregabnr', 'cusregabnrbox',
                () => {
                    restartAfterChange('cusregabnr', "Custom-Regalia-Banner")
                }, true, "Custom-Regalia-Banner"
            ),
            br(),
            UI.createRow("Custom-banner-row", [
                createBannerDropdown()
            ]),
            UI.createCheckBox(
                `${await getString("Custom-Hover-card-backdrop")}`, 'cushvbdrop', 'cushvbdropbox',
                () => {
                    restartAfterChange('cushvbdrop', "Custom-Hover-card-backdrop")
                }, true, "Custom-Hover-card-backdrop"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-RP-Icon")}`, 'cusrpi', 'cusrpibox',
                () => {
                    restartAfterChange('cusrpi', "Custom-RP-Icon")
                }, true, "Custom-RP-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-BE-Icon")}`, 'cusbei', 'cusbeibox',
                () => {
                    restartAfterChange('cusbei', "Custom-BE-Icon")
                }, true, "Custom-BE-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Rank-Icon")}`, 'cusranki', 'cusrankibox',
                () => {
                    restartAfterChange('cusranki', "Custom-Rank-Icon")
                }, true, "Custom-Rank-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Emblem")}`, 'cusemi', 'cusemibox',
                () => {
                    restartAfterChange('cusemi', "Custom-Emblem")
                }, true, "Custom-Emblem"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Clash-banner")}`, 'cusclassb', 'cusclassbbox',
                () => {
                    restartAfterChange('cusclassb', "Custom-Clash-banner")
                }, true, "Custom-Clash-banner"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Trophy")}`, 'custrophy', 'custrophybox',
                () => {
                    restartAfterChange('custrophy', "Custom-Trophy")
                }, true, "Custom-Trophy"
            ),
            br(),
            UI.createCheckBox(
                `${await getString('Custom-Gamemode-Icon')}`, 'cusgameicon', 'cusgameiconbox',
                () => {
                    restartAfterChange('cusgameicon', 'Custom-Gamemode-Icon')
                }, true, 'Custom-Gamemode-Icon'
            ),
            br(),
            UI.createCheckBox(
                `${await getString("Custom-Ticker")}`, 'custick', 'custickbox',
                () => {
                    restartAfterChange('custick', "Custom-Ticker")
                }, true, "Custom-Ticker"
            ),
            br()
        ]),
        UI.createCheckBox(
            `${await getString("animate-loading")}`, 'aniload', 'aniloadbox',
            () => { }, true, "animate-loading"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("custom-runes-bg")}`, 'rsbg', 'rsbgbox',
            () => {
                restartAfterChange('rsbg', "Runes-BG")
            }, true, "Runes-BG"
        ),
        br(),
        UI.createCheckBox(
            await getString("custom-champs-image"), 'cuschampimg', 'cuschampimgbox',
            () => {
                restartAfterChange('cuschampimg', "custom-champs-image")
            }, true, "custom-champs-image"
        ),
    ])
}
