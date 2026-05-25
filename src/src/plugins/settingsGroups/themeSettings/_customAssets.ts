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

    return UI.createSection("theme-settings-custom-assets", await getString("theme-settings.settings-section-custom-assets"), [
        UI.createCheckBox(
            await getString("theme-settings.sync-user-icons"), 'syncusericons', 'syncusericonsbox', () => {
                restartAfterChange('syncusericons', "sync-user-icons")
            }, true, "sync-user-icons"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.custom-icon")}`, 'cusicon', 'cusiconbox',
            () => {
                restartAfterChange('cusicon', "Custom-Icon")
            }, true, "Custom-Icon"
        ),
        UI.createRowHideable("Custom-icon-list", [
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-loading-icon")}`, 'cusloadicon', 'cusloadiconbox',
                () => {
                    restartAfterChange('cusloadicon', "Custom-Loading-Icon")
                }, true, "Custom-Loading-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-avatar")}`, 'cusav', 'cusavbox',
                () => {
                    restartAfterChange('cusav', "Custom-Avatar")
                }, true, "Custom-Avatar"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-border")}`, 'cusbor', 'cusborbox',
                () => {
                    restartAfterChange('cusbor', "Custom-Border")
                }, true, "Custom-Border"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-regalia-banner")}`, 'cusregabnr', 'cusregabnrbox',
                () => {
                    restartAfterChange('cusregabnr', "Custom-Regalia-Banner")
                }, true, "Custom-Regalia-Banner"
            ),
            br(),
            UI.createRow("Custom-banner-row", [
                createBannerDropdown()
            ]),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-hover-card-backdrop")}`, 'cushvbdrop', 'cushvbdropbox',
                () => {
                    restartAfterChange('cushvbdrop', "Custom-Hover-card-backdrop")
                }, true, "Custom-Hover-card-backdrop"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-rp-icon")}`, 'cusrpi', 'cusrpibox',
                () => {
                    restartAfterChange('cusrpi', "Custom-RP-Icon")
                }, true, "Custom-RP-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-be-icon")}`, 'cusbei', 'cusbeibox',
                () => {
                    restartAfterChange('cusbei', "Custom-BE-Icon")
                }, true, "Custom-BE-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-rank-icon")}`, 'cusranki', 'cusrankibox',
                () => {
                    restartAfterChange('cusranki', "Custom-Rank-Icon")
                }, true, "Custom-Rank-Icon"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-emblem")}`, 'cusemi', 'cusemibox',
                () => {
                    restartAfterChange('cusemi', "Custom-Emblem")
                }, true, "Custom-Emblem"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-clash-banner")}`, 'cusclassb', 'cusclassbbox',
                () => {
                    restartAfterChange('cusclassb', "Custom-Clash-banner")
                }, true, "Custom-Clash-banner"
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-trophy")}`, 'custrophy', 'custrophybox',
                () => {
                    restartAfterChange('custrophy', "Custom-Trophy")
                }, true, "Custom-Trophy"
            ),
            br(),
            UI.createCheckBox(
                `${await getString('theme-settings.custom-gamemode-icon')}`, 'cusgameicon', 'cusgameiconbox',
                () => {
                    restartAfterChange('cusgameicon', 'Custom-Gamemode-Icon')
                }, true, 'Custom-Gamemode-Icon'
            ),
            br(),
            UI.createCheckBox(
                `${await getString("theme-settings.custom-ticker")}`, 'custick', 'custickbox',
                () => {
                    restartAfterChange('custick', "Custom-Ticker")
                }, true, "Custom-Ticker"
            ),
            br()
        ]),
        UI.createCheckBox(
            `${await getString("theme-settings.animate-loading")}`, 'aniload', 'aniloadbox',
            () => { }, true, "animate-loading"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.custom-runes-bg")}`, 'rsbg', 'rsbgbox',
            () => {
                restartAfterChange('rsbg', "Runes-BG")
            }, true, "Runes-BG"
        ),
        br(),
        UI.createCheckBox(
            await getString("theme-settings.custom-champs-image"), 'cuschampimg', 'cuschampimgbox',
            () => {
                restartAfterChange('cuschampimg', "custom-champs-image")
            }, true, "custom-champs-image"
        ),
    ])
}
