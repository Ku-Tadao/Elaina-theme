import { UI } from "./settingsUI.ts"
import { restartAfterChange } from "../settings.ts"
import { error } from "../../utils/themeLog.ts"
import { rankList } from "../../utils/rankList.ts"

async function pluginsSettings(panel: Element) {
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
        if (!show) section.style.display = "none";

        return section;
    };

    try {
        const rank = await rankList();

        panel.prepend(
            UI.createRow("plugins-settings-root", [
                UI.createRow("Info", [
                    UI.createRow("Info-div", [
                        UI.createLink(
                            'ElainaV4',
                            'https://github.com/Elaina69/Elaina-V4',
                            () => {},
                            "theme-link"
                        ),
                        UI.createLabel(
                            `*${await getString("note")}: ${await getString("note-1")}`, ""
                        ),
                    ]),
                    UI.createImage(true, "logo.png", "plugins-settings-logo")
                ]),
                UI.createLabel(
                    `${await getString("plugins-settings")}`, "", "theme-settings-section-title"
                ),

                createSection("plugins-settings-core", await getString("settings-section-plugin-core"), [
                    UI.createCheckBox(
                        `${await getString("old-ll-settings")}`, 'oldll', 'oldllbox',
                        () => {
                            restartAfterChange('oldll', "Old-League-Loader-Settings")
                        }, true, "Old-League-Loader-Settings"
                    ),
                    br(),
                    UI.createRow("loothelp", [
                        UI.createCheckBox(
                            `${await getString("loot-helper")}`, 'lh', 'lhbox',
                            () => {
                                restartAfterChange('lh', "loot-helper")
                            }, true, "loot-helper"
                        )
                    ]),
                    UI.createCheckBox(
                        `${await getString("auto_accept_button")}`, 'autoacceptbutton', 'autoacceptbuttonbox',
                        () => {
                            if (!ElainaData.get("auto_accept_button")) {
                                document.getElementById("autoAcceptQueueButton")?.remove()
                                document.getElementById("autoAcceptDelayInput")?.remove()
                            }
                        }, true, "auto_accept_button"
                    ),
                    br(),
                    // UI.createCheckBox(
                    //     `${await getString("dodge-button")}`, "dodgebutton", "dodgebuttonbox",
                    //     () => {
                    //         restartAfterChange("dodgebutton", "dodge-button")
                    //     }, true, "dodge-button"
                    // ),
                    // br(),
                    UI.createCheckBox(
                        `${await getString("Enable-Invite-Fr")}`, 'invfr', 'invfrbox',
                        () => {
                            restartAfterChange("invfr", "Enable-Invite-Fr")
                        }, true, "Enable-Invite-Fr"
                    ),
                ]),

                createSection("plugins-settings-queue", await getString("settings-section-plugin-queue"), [
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
                    UI.Dropdown(ElainaData.get("queueList"), "Gamemode", `${await getString("Gamemode")}`, "description", "queueId"),
                ]),

                createSection("plugins-settings-profile", await getString("settings-section-plugin-profile"), [
                    UI.createCheckBox(await getString("invisible_banner"), 'invbanner', 'invbannerbox',
                        () => {
                            restartAfterChange('invbanner', "invisible_banner")
                        }, true, "invisible_banner"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("Custom-profile-hover")}`, 'cusprf', 'cusprfbox',
                        () => {
                            restartAfterChange('cusprf', "Custom-profile-hover")
                        }, true, "Custom-profile-hover"
                    ),
                    UI.createRowHideable("customprf", [
                        br(),
                        UI.createCheckBox(
                            `${await getString("Custom-mastery-score")}`, 'cusmastery', 'cusmasterybox',
                            () => {
                                restartAfterChange('cusmastery', "Custom-mastery-score")
                            }, true, "Custom-mastery-score"
                        ),
                        br(),
                        UI.createSearchBox("Mastery-Score"),
                        br(),
                        UI.createRow("customrank_checkbox", [
                            UI.createCheckBox(
                                `${await getString("custom-rank-hover")}`, 'cusrankhover', 'cusrankhoverbox',
                                () => {
                                    restartAfterChange('cusrankhover', "Custom-rank")
                                }, true, "Custom-rank"
                            ),
                            br(),
                            UI.createButton(await getString("refresh"), "refresh_option", async () => {
                                window.customRank()
                            })
                        ]),
                        UI.createRow("customrank_detail", [
                            UI.Dropdown(rank, "Ranked Queue ID", `${await getString("Ranked Queue")}`, "name", "id"),
                            br(),
                            UI.Dropdown(rank, "Ranked Tier ID", `${await getString("Ranked Tier")}`, "name", "id"),
                            br(),
                            UI.Dropdown(rank, "Ranked Division ID", `${await getString("Ranked Division")}`, "name", "id"),
                        ]),
                        UI.createCheckBox(
                            `${await getString("Custom-challenge-crystal")}`, 'cuschalcry', 'cuschalcrybox',
                            () => {
                                restartAfterChange('cuschalcry', "Custom-challenge-crystal")
                            }, true, "Custom-challenge-crystal"
                        ),
                        br(),
                        UI.createRow("customchallengecrystal", [
                            UI.Dropdown(rank, "Ranked Tier ID", `${await getString("challenge-rank")}`, "name", "id"),
                            UI.createLabel(`${await getString("challenge-point")}`, "challenge-point-Text"),
                            UI.createSearchBox("Challenge-Points"),
                        ]),
                        UI.createCheckBox(
                            `${await getString("custom-status")}`, 'cussta', 'cusstabox',
                            () => {
                                if (ElainaData.get("Custom-Status")) {
                                    if (window.confirm("This may cause some issues with the client's chat, are you sure you want to enable this plugins?")) {
                                        restartAfterChange('cussta', "Custom-Status")
                                    }
                                    else {
                                        let box: HTMLInputElement | null = document.getElementById("cusstabox") as HTMLInputElement | null
                                        if (box) box.checked = false
                                        ElainaData.set("Custom-Status", false)
                                    }
                                }
                                else {
                                    restartAfterChange('cussta', "Custom-Status")
                                }
                            }, true, "Custom-Status"
                        ),
                        br(),
                        UI.createRow("customstatus", [
                            UI.createCheckBox(
                                `${await getString("Custom-Status-Local")}`, 'cussta-local', 'cussta-localbox',
                                () => {
                                    restartAfterChange('cussta-local', "Custom-Status-Local")
                                }, true, "Custom-Status-Local"
                            ),
                            UI.createLabel(`${await getString("status-delay")}`, ""),
                            UI.createSearchBox("status-delay"),
                        ]),
                    ]),
                    UI.createRow("namespoof", [
                        UI.createCheckBox(
                            `${await getString("name-spoofer")}`, 'namespf', 'namespfbox',
                            () => {
                                restartAfterChange('namespf', "Name-Spoofer")
                            }, true, "Name-Spoofer"
                        ),
                        br(),
                        UI.createSearchBox("Spoof-name"),
                    ]),
                ]),

                createSection("plugins-settings-developer", await getString("settings-section-plugin-developer"), [
                    UI.createCheckBox(
                        `${await getString("Debug-mode")}`, 'debug', 'debugbox',
                        () => {
                            restartAfterChange('debug', "Debug-mode")
                        }, ElainaData.get("Dev-button"), "Debug-mode"
                    ),
                    br(),
                    UI.createCheckBox(
                        `${await getString("Developer-Mode")}`, 'devbutton', 'devbuttonbox', () => {
                            restartAfterChange('devbutton', "Dev-mode")

                            if (!ElainaData.get("Dev-mode")) {}
                            else {
                                window.alert("You just turned on developer mode \nIf you are not a developer, please turn it off right now \nOtherwise the whole theme will not work properly")
                            }
                        }, ElainaData.get("Dev-button"), "Dev-mode"
                    ),
                ], ElainaData.get("Dev-button")),
            ])
        )

        let hideButtons = document.querySelectorAll("#elaina-theme-settings-row-hide-button");
        hideButtons.forEach((button: any) => {
            button.click()
        });
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
        restartAfterChange(id ,datastore) // remove if dont need
    },true, datastore
),
document.createElement('br'),
*/

export { pluginsSettings }
