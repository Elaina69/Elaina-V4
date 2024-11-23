const SELECTORS = `
    .banner-summoner-name,
    .chat-gnt,
    .chat-name,
    .conversation-title,
    .custom-member-name,
    .hover-card-game-name,
    .hover-card-game-tag,
    .hover-card-name,
    .lol-leagues-list-col-3.lol-leagues-list-col,
    .lol-leagues-list-item.me.current.ember-view .rank-standing-row-component,
    .match-details-team-list .player-history-mode,
    .member-name,
    .name,
    .name-text,
    .parties-player-name,
    .player-name,
    .prompted-voting-candidate-name,
    .scoreboard-row-player-name,
    .style-profile-search-trail-summoner-name,
    .style-profile-summoner-name,
    .message-name,
    .system-message,
    .invite-info-name,
    .lol_parties__invite_dialog_name-and-context,
    .chat-name,
    .chat-gnt,
    .message-box-messages-system-message,
    .reform-card-chat-log-name,
    .hover-card-name,
    .hover-card-game-name,
    .hover-card-game-tag,
    .create-panel-summoner-name,
    .create-panel-game-name
`;

export class NameSpoofer {
    updateNames(root = document) {
        const Name = window.DataStore.get("Spoof-name");
        const spoof = window.DataStore.get("Name-Spoofer");
        
        if (!spoof) return;
        
        const elements = root.querySelectorAll(SELECTORS);
        elements.forEach((element: any) => {
            if (element.textContent !== Name) {
                element.textContent = Name;
            }
        });
    
        const systemMessages = root.querySelectorAll(".system-message");
        systemMessages.forEach((sysMessage) => {
            if (sysMessage.textContent !== "🐱‍👤") {
                sysMessage.textContent = "🐱‍👤";
            }
        });
    }
    
    observeChanges(target: any) {
        new MutationObserver(() => this.updateNames(target)).observe(target, {
            childList: true,
            subtree: true,
        });
    }

    main = () => {
        const manager = document.getElementById("rcp-fe-viewport-root");
        
        if (manager) {
            this.observeChanges(manager);
        }
    
        const myMessageBox: any = document.getElementById("embedded-messages-frame");
        if (myMessageBox && myMessageBox.contentDocument) {
            this.observeChanges(myMessageBox.contentDocument);
        }
    
        // Initial update
        // Periodically check for new elements (consider removing if performance is an issue)
        setInterval(this.updateNames, 100);
    }
}