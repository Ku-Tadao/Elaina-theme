import { UI } from "../settingsUI.ts"
import { restartAfterChange } from "../../settings.ts"
import {
    hideShowNavBar,
    changeHomePageStyle,
} from "../../../theme/customUI/customHomepage.ts"

export async function interfaceSection(): Promise<HTMLElement> {
    const br = () => document.createElement("br")

    return UI.createSection("theme-settings-interface", await getString("theme-settings.settings-section-interface"), [
        UI.createCheckBox(
            `${await getString("theme-settings.hide-homepage-navbar")}`, 'homenav', 'homenavbox', () => {
                hideShowNavBar()
                changeHomePageStyle()
            }, true, "hide-homepage-navbar"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.enable-hide-top-navbar-friendlist-button")}`, 'hidetopnavfriend', 'hidetopnavfriendbox',
            () => {
                restartAfterChange("hidetopnavfriend", "enable-hide-top-navbar-friendlist-button")
            }, true, "enable-hide-top-navbar-friendlist-button"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.sidebar-transparent")}`, 'sbt', 'sbtbox',
            () => {
                restartAfterChange("sbt", "sidebar-transparent")
            }, true, "sidebar-transparent"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.lobby-transparent-filter")}`, 'ltf', 'ltfbox',
            () => {
                restartAfterChange("ltf", "lobby-transparent-filter")
            }, true, "lobby-transparent-filter"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.settings-dialogs-transparent")}`, 'stdiat', 'stdiatbox',
            () => {
                restartAfterChange("stdiat", "settings-dialogs-transparent")
            }, true, "settings-dialogs-transparent"
        ),
        br(),
        UI.createCheckBox(await getString("theme-settings.hide-profile-background"), "hideprfbg", "hideprfbgbox",
            () => {
                restartAfterChange("hideprfbg", "hide-profile-background")
            }, true, "hide-profile-background"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-champions-splash-art")}`, 'hidechampart', 'hidechampartbox',
            () => {
                restartAfterChange('hidechampart', "hide-champions-splash-art")
            }, true, "hide-champions-splash-art"
        ),
        br(),
        UI.createCheckBox(
            `${await getString("theme-settings.hide-vertical-lines")}`, "hidevl", "hidevlbox",
            () => {
                restartAfterChange("hidevl", "hide-vertical-lines")
            }, true, "hide-vertical-lines"
        ),
    ])
}
