/**
 * @name Elaina-Theme
 * @author Elaina Da Catto
 * @description Elaina theme for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */
// Import theme DataStore to use it instead pengu DataStore
import { ElainaData } from "./src/utils/themeDataStore.ts";

// Importing theme contents
import "./src/languages.ts";
import { log } from './src/utils/themeLog.ts';

log('By %cElaina Da Catto', 'color: #e4c2b3');
log('%cMeow ~~~', 'color: #e4c2b3');
log('Importing theme contents');

// Import server-side backup/restore data service
import { restoreDefaultDataStore } from './src/services/backupAndRestoreDatastore';

let Settings: any;
let transparentLobby: any;
let AutoQueue: any;
let skipHonor: any;
let FileSystem: any;
let CheckUpdate: any;
let ApplyUI: any;
let Filters: any;
let LoadCss: any;
let ThemePresetSettings: any;
let CustomStatus: any;
let AutoAccept: any;
let CustomBeRp: any;
let CustomSummonerLv: any;
let LootHelper: any;
let NameSpoofer: any;
let OfflineMode: any;
let Practice5vs5: any;
let InviteAllFriends: any;
let ForceJungLane: any;
let upl: any;

async function loadRuntimeModules() {
    if (Settings) return;

    ({ Settings } = await import("./src/plugins/settings.ts"));
    ({ transparentLobby } = await import("./src/theme/customUI/transparentLobby.ts"));
    ({ AutoQueue } = await import("./src/plugins/autoQueue.ts"));
    ({ skipHonor } = await import("./src/plugins/skipHonor.js"));
    ({ FileSystem } = await import("./src/utils/fileSystem.ts"));
    ({ CheckUpdate } = await import("./src/updates/checkUpdate.ts"));
    ({ ApplyUI } = await import("./src/theme/loadCustomUi.ts"));
    ({ Filters } = await import("./src/theme/loadCustomFilters.ts"));
    ({ LoadCss } = await import("./src/theme/loadCustomCss.ts"));
    ({ ThemePresetSettings } = await import("./src/plugins/themePresetSettingsTab.ts"));
    ({ CustomStatus } = await import("./src/plugins/customStatus.ts"));
    ({ AutoAccept } = await import("./src/plugins/autoAccept.ts"));
    ({ CustomBeRp } = await import("./src/plugins/customBeRp.ts"));
    ({ CustomSummonerLv } = await import("./src/plugins/customSummonerLv.ts"));
    ({ LootHelper } = await import("./src/plugins/lootHelper.ts"));
    ({ NameSpoofer } = await import("./src/plugins/nameSpoofer.ts"));
    ({ OfflineMode } = await import("./src/plugins/offlineMode.ts"));
    ({ Practice5vs5 } = await import("./src/plugins/practice5vs5.ts"));
    ({ InviteAllFriends } = await import("./src/plugins/inviteAllFriends.ts"));
    ({ ForceJungLane } = await import("./src/plugins/forceJungleLane.ts"));
    upl = await import("pengu-upl");
    await import("./src/plugins/syncUserIcons.ts");
    await import("./src/utils/debug.ts");
}

// Export Init
export async function init(context: any) {
    log('Initializing ElainaData storage');
    await ElainaData.init(context);
    await restoreDefaultDataStore();
    ElainaData.set("start-time", Date.now());
    await loadRuntimeModules();

    log('Initializing file system for theme');
    const fileSystem = new FileSystem();
    await fileSystem.init(context);

    log('Initializing theme');
    const { initThemeDataCdn } = await import('./src/theme/Cdn.ts');
    await initThemeDataCdn();

    // createHomePageTab(context);
    Settings(context);
    transparentLobby(context);
    AutoQueue(context);
    skipHonor(context);
    // Cdninit(context);
}

class ElainaTheme {
    async main() {
        // Check theme's version and available update
        const checkUpdate = new CheckUpdate()
        checkUpdate.main()

        // Apply theme custom UI
        const applyUI = new ApplyUI()
        await applyUI.main()

        // Add filter for wallpaper
        const filters = new Filters()
        filters.main()

        // Add theme's Css
        const loadCss = new LoadCss()
        loadCss.main()

        // Load plugins
        // Add theme's pre-settings
        const themePresetSettings = new ThemePresetSettings()
        themePresetSettings.main()

        // Custom BE, RP
        const customBeRp = new CustomBeRp()

        // Custom Summoner Level
        const customSummonerLv = new CustomSummonerLv()

        // Auto Accept
        const autoAccept = new AutoAccept()
        autoAccept.main(ElainaData.get("auto_accept_button"))

        // Custom status
        const customStatus = new CustomStatus()
        if (ElainaData.get("Custom-Status") && ElainaData.get("Custom-profile-hover")) customStatus.main()

        // Add dodge button
        // const dodgeButton = new DodgeButton()
        // dodgeButton.main()

        // Force jungle or lane
        const forceJungleLane = new ForceJungLane()
        forceJungleLane.main()

        // Add invite all friends buttons
        const inviteAllFriends = new InviteAllFriends()
        if (ElainaData.get("Enable-Invite-Fr")) inviteAllFriends.main()

        // Add loot helper
        const lootHelper = new LootHelper()
        if (ElainaData.get("loot-helper")) lootHelper.main()

        // Spoof name
        const nameSpoofer = new NameSpoofer()
        nameSpoofer.main()

        // Add practice 5vs5 room button
        const practice5vs5 = new Practice5vs5()
        if (!ElainaData.get("aram-only")) practice5vs5.main()

        // Offline mode
        const offlineMode = new OfflineMode()
        offlineMode.main()

        // This code will run for each 1s
        window.setInterval(() => {
            // Custom BE/RP
            if (ElainaData.get("custom-rp")) customBeRp.RP()
            if (ElainaData.get("custom-be")) customBeRp.BE()

            // Custom Summoner Level
            if (ElainaData.get("custom-summoner-lv")) customSummonerLv.main()

            // Check list change
            window.refreshLists()
        }, 1000);
    }
}

const elainaTheme = new ElainaTheme()
export async function load() {
    await loadRuntimeModules();
    await elainaTheme.main()

    // For debug only
    if (ElainaData.get("Dev-mode")) window.upl = upl;
}
