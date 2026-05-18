import { UI } from "./settingsUI.ts"
import { restartAfterChange } from "../settings.ts"
import utils from "../../utils/utils.ts";
import { error } from "../../utils/themeLog.ts";
import {
    del_webm_buttons,
    create_webm_buttons,
    applyHideAndShowTFTtab,
    setWallpaper,
    setImageWallpaper,
    setAudio,
    hideShowNavBar,
    changeHomePageStyle,
    wallpaperPlayPause,
    audioPlayPause,
    applyWindowEffect,
    setWindowEffectsSettingsVisibility
} from "../../theme/customUI/customHomepage.ts";

const FILE_REGEX = {
    Wallpaper: /\.(png|jpg|jpeg|gif|bmp|webp|ico|mp4|webm|mkv|mov|avi|wmv|3gp|m4v)$/,
    Audio: /\.(mp3|flac|ogg|wav|aac)$/,
    Font: /\.(ttf|otf|woff|woff2)$/,
    Banner: /\.(png|jpg|jpeg|gif|bmp|webp|ico)$/,
};

const WINDOW_EFFECT_OPTIONS = {
    "window-effect-name": [
        { name: "transparent", id: "transparent" },
        { name: "blurbehind", id: "blurbehind" },
        { name: "acrylic", id: "acrylic" },
        { name: "unified", id: "unified" },
        { name: "mica", id: "mica" },
        { name: "vibrancy", id: "vibrancy" },
    ],
};

const WINDOW_EFFECT_MATERIALS = {
    "window-effect-material": [
        { name: "none", id: "none" },
        { name: "auto", id: "auto" },
        { name: "mica", id: "mica" },
        { name: "acrylic", id: "acrylic" },
        { name: "tabbed", id: "tabbed" },
        { name: "appearance-based", id: "appearance-based" },
        { name: "light", id: "light" },
        { name: "dark", id: "dark" },
        { name: "titlebar", id: "titlebar" },
        { name: "selection", id: "selection" },
        { name: "menu", id: "menu" },
        { name: "popover", id: "popover" },
        { name: "sidebar", id: "sidebar" },
        { name: "header", id: "header" },
        { name: "sheet", id: "sheet" },
        { name: "window", id: "window" },
        { name: "hud-window", id: "hud-window" },
        { name: "fullscreen-ui", id: "fullscreen-ui" },
        { name: "tooltip", id: "tooltip" },
        { name: "content-background", id: "content-background" },
        { name: "under-window-background", id: "under-window-background" },
        { name: "under-page-background", id: "under-page-background" },
    ],
};

async function themeSettings(panel: Element) {
    const loading = UI.createRow("loading", [
        UI.createLoading(await getString("settings-loading")),
    ])
    panel.appendChild(loading);

    const br = () => document.createElement('br');

    const createSection = (id: string, title: string, children: HTMLElement[], show = true) => {
        const content = UI.createRow(`${id}-content`, children);
        content.classList.add("theme-settings-section-content");

        const section = UI.createRow(id, [
            UI.createLabel(title, "", "theme-settings-section-title"),
            content,
        ], show);
        section.classList.add("theme-settings-section");

        return section;
    };

    try {
        panel.prepend(
            UI.createRow("theme-settings-root", [
                UI.createRow("Info", [
                    UI.createRow("Info-div", [
                        UI.createLink(
                            'ElainaV4',
                            'https://github.com/Elaina69/Elaina-V4',
                            () => { },
                            "theme-link"
                        ),
                        UI.createLabel(
                            `*${await getString("note")}: ${await getString("note-1")}`, ""
                        ),
                    ]),
                    UI.createImage(true, "logo.png", "theme-settings-logo")
                ]),
                UI.createCheckBox(
                    `${await getString("AllowTrackingData")}`, 'trackData', 'trackDatabox', () => {
                        restartAfterChange('trackData', "AllowTrackingData")
                    }, true, "AllowTrackingData"
                ),

                createSection("theme-settings-asset-library", await getString("settings-section-asset-library"), [
                    UI.createLabel(await getString("update-list-manually"), ""),
                    UI.createRowHideable("add-background-manually-row", [
                        UI.createLabel("", "add-background-manual-message", "theme-settings-message"),
                        ...await UI.createFileListRow("wallpaper", "Wallpaper-list", "manual-wallpaper-name", FILE_REGEX.Wallpaper),
                        ...await UI.createFileListRow("audio", "Audio-list", "manual-audio-name", FILE_REGEX.Audio),
                        ...await UI.createFileListRow("banner", "Banner-list", "manual-banner-name", FILE_REGEX.Banner),
                        ...await UI.createFileListRow("font", "Font-list", "manual-font-name", FILE_REGEX.Font),
                    ]),
                ], !window.isContextFSExist),

                createSection("theme-settings-wallpaper", await getString("settings-section-wallpaper"), [
                    UI.createButton(await getString("open-background-folder"), "open-background-folder", () => { window.openPluginsFolder(`${ElainaData.get("Plugin-folder-name")}/assets/backgrounds`) }),
                    UI.createLabel(await getString("WallpaperAudio-timeUpdate"), ""),
                    UI.createSearchBox("WallpaperAudio-timeUpdate"),
                    br(),
                    UI.Slider(
                        await getString("wallpaper-volume"), ElainaData.get("wallpaper-volume"), "elaina-bg", "wallpaper-volume"
                    ),
                    UI.createRow("changePlaybackRow", [
                        UI.createLabel(await getString("Wallpaper-Speed"), ""),
                        UI.createSpeedInput("Playback-speed"),
                        UI.createLabel("%", "playback-percent"),
                    ]),
                    UI.createLabel("", "speed-check"),
                    br(),
                    UI.createCheckBox(
                        `${await getString("old-prev/next-button")}`, "oldpnb", "oldpnbbox",
                        () => {
                            del_webm_buttons()
                            create_webm_buttons()
                        }, true, "old-prev/next-button"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("wallpaper-slideshow")}`, 'wallpaperSlide', 'wallpaperSlidebox',
                        () => {
                            restartAfterChange("wallpaperSlide", "wallpaper-slideshow")
                        }, true, "wallpaper-slideshow"
                    ),
                    UI.createRow("slideTimeRow", [
                        UI.createLabel(await getString("change-slide-delay"), ""),
                        UI.createSearchBox("wallpaper-change-slide-time"),
                    ]),
                    UI.createCheckBox(
                        `${await getString("disable-theme-wallpaper")}`, "disablethemewallpaper", "disablethemewallpaperbox", () => {
                            let wallpaperController: HTMLElement | null = document.querySelector(".wallpaper-controls")
                            let video: HTMLVideoElement | null = document.getElementById("elaina-bg") as HTMLVideoElement | null
                            let imgWallpaper: HTMLImageElement | null = document.getElementById("elaina-static-bg") as HTMLImageElement | null

                            if (!ElainaData.get("disable-theme-wallpaper")) {
                                setWallpaper()
                                setImageWallpaper()
                                wallpaperPlayPause()
                                if (wallpaperController) wallpaperController.style.display = "flex"
                            }
                            else {
                                if (video) video.src = ''
                                if (imgWallpaper) imgWallpaper.src = ''
                                if (wallpaperController) wallpaperController.style.display = "none"
                            }
                            setWindowEffectsSettingsVisibility()
                            applyWindowEffect()
                        }, true, "disable-theme-wallpaper"
                    ),
                    UI.createRow("window-effects-settings", [
                        UI.createLabel(await getString("window-effects"), "", "theme-settings-subsection-title"),
                        UI.createRow("window-effect-main-row", [
                            UI.Dropdown(
                                WINDOW_EFFECT_OPTIONS,
                                "window-effect-name",
                                await getString("window-effect-name"),
                                "name",
                                "id",
                                "window-effect-name-dropdown",
                                () => applyWindowEffect()
                            ),
                            UI.createRow("window-effect-color-row", [
                                UI.createLabel(await getString("window-effect-color"), ""),
                                UI.colorPicker("window-effect-color-picker", "window-effect-color-base", () => {
                                    const input = document.getElementById("window-effect-color-picker") as HTMLInputElement | null;
                                    const label = document.getElementById("window-effect-color-text");
                                    if (!input) return;

                                    ElainaData.set("window-effect-color-base", input.value);
                                    ElainaData.set("window-effect-color", input.value + ElainaData.get("window-effect-alpha"));

                                    if (label) label.textContent = ElainaData.get("window-effect-color");
                                    applyWindowEffect();
                                }),
                                UI.createLabel(ElainaData.get("window-effect-color"), "window-effect-color-text"),
                            ]),
                        ]),
                        UI.opacitySlider("window-effect-opacity", await getString("opacity"), "window-effect-alpha", async () => {
                            const slider: any = document.getElementById("window-effect-opacity");
                            const title = document.getElementById("window-effect-opacity-title");
                            const label = document.getElementById("window-effect-color-text");
                            if (!slider) return;

                            ElainaData.set("window-effect-alpha", Math.round(slider.value / 100 * 255).toString(16).padStart(2, '0'));
                            ElainaData.set("window-effect-color", ElainaData.get("window-effect-color-base") + ElainaData.get("window-effect-alpha"));

                            if (title) title.textContent = `${await getString("opacity")}: ${slider.value}%`;
                            if (label) label.textContent = ElainaData.get("window-effect-color");
                            applyWindowEffect();
                        }),
                        UI.Dropdown(
                            WINDOW_EFFECT_MATERIALS,
                            "window-effect-material",
                            await getString("window-effect-material"),
                            "name",
                            "id",
                            "window-effect-material-dropdown",
                            () => applyWindowEffect()
                        ),
                    ], true),
                ]),

                createSection("theme-settings-audio", await getString("settings-section-audio"), [
                    UI.Slider(
                        await getString("music-volume"), ElainaData.get("audio-volume"), "bg-audio", "audio-volume"
                    ),
                    UI.createCheckBox(
                        `${await getString("turnoff-audio-ingame")}`, 'offaudio', 'offaudiobox',
                        () => { }, true, "turnoff-audio-ingame"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("disable-theme-audio")}`, "disablethemeaudio", "disablethemeaudiobox", () => {
                            let audioController: HTMLElement | null = document.querySelector(".webm-bottom-buttons-container")
                            let audio: HTMLAudioElement | null = document.getElementById("bg-audio") as HTMLAudioElement | null

                            if (!ElainaData.get("disable-theme-audio")) {
                                setAudio()
                                audioPlayPause()
                                if (audioController) audioController.style.display = "flex"
                            }
                            else {
                                if (audio) audio.src = ''
                                if (audioController) audioController.style.display = "none"
                            }
                        }, true, "disable-theme-audio"
                    ),
                ]),

                createSection("theme-settings-updates", await getString("settings-section-updates"), [
                    UI.createCheckBox(
                        `${await getString("prevent-manual-update")}`, 'prvtup', 'prvtupbox',
                        () => { }, true, "prevent-manual-update"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("holiday-message")}`, 'holiday', 'holidaybox', () => {
                            restartAfterChange("holiday", "holiday-message")
                        }, true, "holiday-message"
                    ),
                ]),

                createSection("theme-settings-custom-assets", await getString("settings-section-custom-assets"), [
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
                            UI.DropdownCustomBanner()
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
                ]),

                createSection("theme-settings-interface", await getString("settings-section-interface"), [
                    UI.createCheckBox(
                        `${await getString("hide-homepage-navbar")}`, 'homenav', 'homenavbox', () => {
                            hideShowNavBar()
                            changeHomePageStyle()
                        }, true, "hide-homepage-navbar"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("enable-hide-top-navbar-friendlist-button")}`, 'hidetopnavfriend', 'hidetopnavfriendbox',
                        () => {
                            restartAfterChange("hidetopnavfriend", "enable-hide-top-navbar-friendlist-button")
                        }, true, "enable-hide-top-navbar-friendlist-button"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("sidebar-transparent")}`, 'sbt', 'sbtbox',
                        () => {
                            restartAfterChange("sbt", "sidebar-transparent")
                        }, true, "sidebar-transparent"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("lobby-transparent-filter")}`, 'ltf', 'ltfbox',
                        () => {
                            restartAfterChange("ltf", "lobby-transparent-filter")
                        }, true, "lobby-transparent-filter"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("settings-dialogs-transparent")}`, 'stdiat', 'stdiatbox',
                        () => {
                            restartAfterChange("stdiat", "settings-dialogs-transparent")
                        }, true, "settings-dialogs-transparent"
                    ),
                    br(),
                    UI.createCheckBox(await getString("hide-profile-background"), "hideprfbg", "hideprfbgbox",
                        () => {
                            restartAfterChange("hideprfbg", "hide-profile-background")
                        }, true, "hide-profile-background"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-champions-splash-art")}`, 'hidechampart', 'hidechampartbox',
                        () => {
                            restartAfterChange('hidechampart', "hide-champions-splash-art")
                        }, true, "hide-champions-splash-art"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-vertical-lines")}`, "hidevl", "hidevlbox",
                        () => {
                            restartAfterChange("hidevl", "hide-vertical-lines")
                        }, true, "hide-vertical-lines"
                    ),
                ]),

                createSection("theme-settings-profile", await getString("settings-section-profile"), [
                    UI.createRow("Custom-Curency", [
                        UI.createRow("custom-rp", [
                            UI.createCheckBox(
                                `${await getString("custom-rp")}`, 'cusrp', 'cusrpbox',
                                () => {
                                    restartAfterChange('cusrp', "custom-rp")
                                }, true, "custom-rp"
                            ),
                            br(),
                            UI.createSearchBox("RP-data")
                        ]),
                        UI.createRow("custom-be", [
                            UI.createCheckBox(
                                `${await getString("custom-be")}`, 'cusbe', 'cusbebox',
                                () => {
                                    restartAfterChange('cusbe', "custom-be")
                                }, true, "custom-be"
                            ),
                            br(),
                            UI.createSearchBox("BE")
                        ])
                    ]),
                    br(),
                    UI.createCheckBox(
                        `${await getString("custom-summoner-lv")}`, 'cussumlv', 'cussumlvbox',
                        () => {
                            restartAfterChange('cussumlv', "custom-summoner-lv")
                        }, true, "custom-summoner-lv"
                    ),
                    br(),
                    UI.createSearchBox("custom-summoner-lv-number"),
                    br(),
                    UI.createCheckBox(
                        `${await getString("custom-rank-name")}`, 'cusrankname', 'cusranknamebox',
                        () => {
                            restartAfterChange('cusrankname', "custom-rank-name")
                        }, true, "custom-rank-name"
                    ),
                    br(),
                    UI.createSearchBox("Rank-line1"),
                    UI.createSearchBox("Rank-line2"),
                    br(),
                    UI.createCheckBox(
                        `${await getString("custom-font")}`, 'cusfont', 'cusfontbox',
                        () => {
                            if (!ElainaData.get("Custom-Font")) {
                                document.querySelector("#Custom-font")?.remove()
                            }
                            else {
                                utils.addFont(ElainaData.get("Font-folder") + ElainaData.get("CurrentFont"), "Custom-font", "Custom")
                            }
                        }, true, "Custom-Font"
                    ),
                    br(),
                    UI.DropdownCustomFont(),
                    br(),
                    UI.createCheckBox(
                        `${await getString("change-nickname-color")}`, 'nicknamecolor', 'nicknamecolorbox', () => {
                            if (!ElainaData.get("change-nickname-color")) {
                                document.getElementById("nickname-color-css")?.remove()
                            }
                            else {
                                utils.addStyleNodeWithID("nickname-color-css", /*css*/`
                                    span.player-name__force-locale-text-direction, #nickname-color-preview {
                                        color: ${utils.sanitizeColor(ElainaData.get("nickname-color-with-opacity"))};
                                    }
                                `)
                            }
                        }, true, "change-nickname-color"
                    ),
                    UI.createRowHideable("change-nickname-color-row", [
                        br(),
                        UI.createRow("nickname-color-with-text", [
                            UI.colorPicker("nickname-color", "nickname-color", () => {
                                let input: any = document.getElementById("nickname-color")

                                ElainaData.set("nickname-color", input.value)
                                ElainaData.set("nickname-color-with-opacity", input.value + ElainaData.get("nickname-opacity"))

                                let color: any = document.getElementById("nickname-color-text")
                                color.textContent = ElainaData.get("nickname-color-with-opacity")

                                if (ElainaData.get("change-nickname-color")) {
                                    document.getElementById("nickname-color-css")?.remove()

                                    utils.addStyleNodeWithID("nickname-color-css", /*css*/`
                                        span.player-name__force-locale-text-direction, #nickname-color-preview {
                                            color: ${utils.sanitizeColor(ElainaData.get("nickname-color-with-opacity"))};
                                        }
                                    `)
                                }
                            }),
                            UI.createLabel(ElainaData.get("nickname-color-with-opacity"), "nickname-color-text"),
                            UI.createLabel(`${await getString("preview")}: `, "nickname-color-preview-label"),
                            UI.createLabel(
                                (document.querySelector(".rcp-fe-lol-social .player-name__force-locale-text-direction")?.textContent || ""),
                                "nickname-color-preview"
                            )
                        ]),
                        UI.opacitySlider("change-nickname-opacity", await getString("opacity"), "nickname-opacity", async () => {
                            let origin: any = document.getElementById("change-nickname-opacity")
                            let title: any = document.getElementById("change-nickname-opacity-title")

                            ElainaData.set("nickname-opacity", Math.round(origin.value / 100 * 255).toString(16).padStart(2, '0'))
                            ElainaData.set("nickname-color-with-opacity", ElainaData.get("nickname-color") + ElainaData.get("nickname-opacity"))

                            title.textContent = `${await getString("opacity")}: ${origin.value}%`

                            let color: any = document.getElementById("nickname-color-text")
                            color.textContent = ElainaData.get("nickname-color-with-opacity")

                            if (ElainaData.get("change-nickname-color")) {
                                document.getElementById("nickname-color-css")?.remove()

                                utils.addStyleNodeWithID("nickname-color-css", /*css*/`
                                    span.player-name__force-locale-text-direction, #nickname-color-preview {
                                        color: ${utils.sanitizeColor(ElainaData.get("nickname-color-with-opacity"))};
                                    }
                                `)
                            }
                        }),
                    ]),
                    UI.createCheckBox(
                        `${await getString("hide-theme-usage-time")}`, 'hideusetime', 'hideusetimebox',
                        () => { }, true, "hide-theme-usage-time"
                    ),
                ]),

                createSection("theme-settings-game-tabs", await getString("settings-section-game-tabs"), [
                    UI.createCheckBox(
                        `${await getString("hide-summoner-rift-5v5")}`, 'hidesr5v5tab', 'hidesr5v5tabbox',
                        () => {
                            restartAfterChange('hidesr5v5tab', 'hide-summoner-rift-5v5')
                        }, true, "hide-summoner-rift-5v5"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-aram")}`, 'hidearamtab', 'hidearamtabbox',
                        () => {
                            restartAfterChange('hidearamtab', 'hide-aram')
                        }, true, "hide-aram"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-arena")}`, 'hidearenatab', 'hidearenatabbox',
                        () => {
                            restartAfterChange('hidearenatab', 'hide-arena')
                        }, true, "hide-arena"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-custom-game-section")}`, 'hidecustomtab', 'hidecustomtabbox',
                        () => {
                            restartAfterChange('hidecustomtab', 'hide-custom-game-section')
                        }, true, "hide-custom-game-section"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-tft")}`, 'hidetfttab', 'hidetfttabbox',
                        () => {
                            restartAfterChange('hidetfttab', 'hide-tft')
                        }, true, "hide-tft"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-tft-match-history")}`, 'hidetftmhtab', 'hidetftmhtabbox',
                        () => {
                            applyHideAndShowTFTtab()
                        }, true, "hide-tft-match-history"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-tft-news")}`, 'hidetftntab', 'hidetftntabbox',
                        () => {
                            applyHideAndShowTFTtab()
                        }, true, "hide-tft-news"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-tft-rotational-shop")}`, 'hidetftrstab', 'hidetftrstabbox',
                        () => {
                            applyHideAndShowTFTtab()
                        }, true, "hide-tft-rotational-shop"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-tft-troves")}`, 'hidetfttrovestab', 'hidetfttrovestabbox',
                        () => {
                            applyHideAndShowTFTtab()
                        }, true, "hide-tft-troves"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-tft-battle-pass")}`, 'hidetftbattletab', 'hidetftbattletabbox',
                        () => {
                            applyHideAndShowTFTtab()
                        }, true, "hide-tft-battle-pass"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("hide-tft-home")}`, 'hidetfthometab', 'hidetfthometabbox',
                        () => {
                            applyHideAndShowTFTtab()
                        }, true, "hide-tft-home"
                    ),
                ]),

                UI.createCheckBox(
                    `${await getString("NSFW-Content")}`, 'nsfw', 'nsfwbox',
                    () => { }, true, "NSFW-Content"
                ),
            ])
        )

        let hideButtons = document.querySelectorAll("#elaina-theme-settings-row-hide-button");
        hideButtons.forEach((button: any) => {
            button.click()
        });
        setWindowEffectsSettingsVisibility();
    }
    catch (err: any) {
        error("Error loading theme settings:", err);
    } finally {
        loading.remove();
    }
}

/*
UI.createCheckBox(
    `${await getString("")}`,'','box', ()=>{
        restartAfterChange(id, datastore)
    },true, datastore
),
document.createElement('br'),
*/

export { themeSettings }