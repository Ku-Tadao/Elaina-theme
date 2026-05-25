import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"
import { applyHideAndShowTFTtab } from "../../../theme/customUI/customHomepage.ts"

export async function gameTabsSection(): Promise<HTMLElement> {
    const br = () => document.createElement("br")

    return UI.createSection("theme-settings-game-tabs", await getString("theme-settings.settings-section-game-tabs"), [
        UI.createCheckBox(
            `${await getString("theme-settings.hide-summoner-rift-5v5")}`, 'hidesr5v5tab', 'hidesr5v5tabbox',
            () => {
                restartAfterChange('hidesr5v5tab', 'hide-summoner-rift-5v5')
            }, true, "hide-summoner-rift-5v5"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-aram")}`, 'hidearamtab', 'hidearamtabbox',
            () => {
                restartAfterChange('hidearamtab', 'hide-aram')
            }, true, "hide-aram"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-arena")}`, 'hidearenatab', 'hidearenatabbox',
            () => {
                restartAfterChange('hidearenatab', 'hide-arena')
            }, true, "hide-arena"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-custom-game-section")}`, 'hidecustomtab', 'hidecustomtabbox',
            () => {
                restartAfterChange('hidecustomtab', 'hide-custom-game-section')
            }, true, "hide-custom-game-section"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-tft")}`, 'hidetfttab', 'hidetfttabbox',
            () => {
                restartAfterChange('hidetfttab', 'hide-tft')
            }, true, "hide-tft"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-tft-match-history")}`, 'hidetftmhtab', 'hidetftmhtabbox',
            () => {
                applyHideAndShowTFTtab()
            }, true, "hide-tft-match-history"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-tft-news")}`, 'hidetftntab', 'hidetftntabbox',
            () => {
                applyHideAndShowTFTtab()
            }, true, "hide-tft-news"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-tft-rotational-shop")}`, 'hidetftrstab', 'hidetftrstabbox',
            () => {
                applyHideAndShowTFTtab()
            }, true, "hide-tft-rotational-shop"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-tft-troves")}`, 'hidetfttrovestab', 'hidetfttrovestabbox',
            () => {
                applyHideAndShowTFTtab()
            }, true, "hide-tft-troves"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-tft-battle-pass")}`, 'hidetftbattletab', 'hidetftbattletabbox',
            () => {
                applyHideAndShowTFTtab()
            }, true, "hide-tft-battle-pass"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-tft-home")}`, 'hidetfthometab', 'hidetfthometabbox',
            () => {
                applyHideAndShowTFTtab()
            }, true, "hide-tft-home"
        ),
    ])
}
