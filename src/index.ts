/**
 * @name ElainaV4
 * @author Elaina Da Catto
 * @description Elaina theme for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */
import { log } from './src/utils/themeLog.ts';

log('By %cElaina Da Catto', 'color: #e4c2b3');
log('%cMeow ~~~', 'color: #e4c2b3');

// Importing theme contents
log('Importing theme contents');

// Import server-side backup/restore data service
import './src/services/backupAndRestoreDatastore';

// Import modules
import { Cdninit } from './src/theme/Cdninit.ts';
import { CheckServerAvailability } from './src/services/checkServer.ts';
import { CheckUpdate } from "./src/updates/checkUpdate.ts"
import { createHomePageTab, HomePage } from "./src/theme/homepage.ts";
import { transparentLobby, ApplyUI } from "./src/theme/applyUi.ts";
import { Filters } from "./src/theme/filters.ts"
import { LoadCss } from "./src/theme/loadCss.ts"
import { ThemePresetSettings } from "./src/theme/themePresetSettingsTab.ts"

// Import plugins
import { CustomStatus } from "./src/plugins/customStatus.ts"
import { AutoAccept } from "./src/plugins/autoAccept.ts"
import { CustomBeRp } from "./src/plugins/customBeRp.ts"
import { CustomProfile } from "./src/plugins/customProfile.ts"
import { DodgeButton } from "./src/plugins/dodgeButton.ts"
import { LootHelper } from "./src/plugins/lootHelper.ts"
import { NameSpoofer } from "./src/plugins/nameSpoofer.ts"
import { OfflineMode } from "./src/plugins/offlineMode.ts"
import { Practice5vs5 } from "./src/plugins/practice5vs5.ts"
import { InviteAllFriends } from "./src/plugins/inviteAllFriends.ts"
import { HideFriendList } from './src/plugins/hideFriendlist.ts';

// Import other plugins
import { ForceJungLane } from "./src/plugins/forceJungleLane.ts"
import "./src/plugins/debug.ts"

class ElainaTheme {
    init(context: any) {
        log('Initializing theme');
    
        // createHomePageTab(context);
        transparentLobby(context);
        Cdninit(context);
    }

    main() {
        // Check theme server
        const checkServerAvailability = new CheckServerAvailability()
        checkServerAvailability.main()

        // Check theme's version and available update
        const checkUpdate = new CheckUpdate()
        checkUpdate.main()

        // Add homepage
        const homePage = new HomePage()
        homePage.main()

        // Apply theme UI
        const applyUI = new ApplyUI()
        applyUI.main()

        // Add filter for wallpaper
        const filters = new Filters()
        filters.main()

        // Add theme's Css
        const loadCss = new LoadCss()
        loadCss.main()

        // Add theme's pre-settings
        const themePresetSettings = new ThemePresetSettings()
        themePresetSettings.main()

        // Load plugins
        // Custom BE, RP
        const customBeRp = new CustomBeRp()
        if (window.DataStore.get("Custom_RP")) {
            window.setInterval(() => { customBeRp.RP() }
        ), 300}
        if (window.DataStore.get("Custom_BE")) {
            window.setInterval(() => { customBeRp.BE() }
        ), 300}

        // Auto Accept
        const autoAccept = new AutoAccept()
        autoAccept.main(window.DataStore.get("auto_accept_button"))

        // Custom status
        const customStatus = new CustomStatus()
        if (window.DataStore.get("Custom-Status") && window.DataStore.get("Custom-profile-hover")) customStatus.main()

        // Custom profile
        const customProfile = new CustomProfile()
        customProfile.customBagde()
        if (window.DataStore.get("Custom-profile-hover")) {
            if (window.DataStore.get("Custom-mastery-score")) customProfile.customMasteryScore()
            if (window.DataStore.get("Custom-challenge-crystal")) customProfile.customChallengeCrystal()
            if (window.DataStore.get("Custom-rank")) customProfile.customRank()
        }

        // Add dodge button
        const dodgeButton = new DodgeButton()
        dodgeButton.main()

        // Force jungle or lane
        const forceJungleLane = new ForceJungLane()
        forceJungleLane.main()

        // Add invite all friends buttons
        const inviteAllFriends = new InviteAllFriends()
        if (window.DataStore.get("Enable-Invite-Fr")) inviteAllFriends.main()

        // Add loot helper
        const lootHelper = new LootHelper()
        if (window.DataStore.get("loot-helper")) lootHelper.main()

        // Spoof name
        const nameSpoofer = new NameSpoofer()
        nameSpoofer.main()

        // Add practice 5vs5 room button
        const practice5vs5 = new Practice5vs5()
        if (!window.DataStore.get("aram-only")) practice5vs5.main()

        // Offline mode
        const offlineMode = new OfflineMode()
        offlineMode.main()

        // Add hide friendslist button
        const hideFriendslist = new HideFriendList()
        hideFriendslist.main()
    }
}

const elainaTheme = new ElainaTheme()
window.addEventListener("load", () => {
    elainaTheme.main()
})

// Export Init
export function init(context: any) {
    elainaTheme.init(context)
}