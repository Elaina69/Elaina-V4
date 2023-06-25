let spoof = DataStore.get("Name-Spoofer")
let name = DataStore.get("Spoof-name")

window.addEventListener("load", () => {
    const interval = setInterval(() => {
        if (!spoof) return clearInterval(interval);
        const manager = document.getElementById("rcp-fe-viewport-root");
        if (manager) {
            clearInterval(interval);
            new MutationObserver(() => {
                const elements = document.querySelectorAll(
                    `.banner-summoner-name, 
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
                    .message-box-messages-system-message
                `
                );

                elements.forEach((element) => {
                    element.textContent = name;
                });
            }).observe(manager, {
                childList: true,
                subtree: true,
            });
        }
    }, 100);
});

const otherInterval = setInterval(() => {
    if (!spoof) return clearInterval(otherInterval);
    const myMessageBox = document.getElementById("embedded-messages-frame");
    if (myMessageBox) {
        const iframeContent = myMessageBox.contentDocument;
        const messageNames = iframeContent.querySelectorAll(".message-name");
        const systemMessages =
            iframeContent.querySelectorAll(".system-message");

        for (const sysMessage of systemMessages) {
            if (sysMessage.textContent != "🐱‍👤")
                sysMessage.textContent = `🐱‍👤`;
        }

        for (const chatName of messageNames) {
            if (chatName.textContent != name) chatName.textContent = name;
        }
    }

    const elements = document.querySelectorAll(
        `.reform-card-chat-log-name, 
        .hover-card-name, 
        .hover-card-game-name, 
        .hover-card-game-tag, 
        .create-panel-summoner-name, 
        .create-panel-game-name
    `
    );

    elements.forEach((element) => {
        if (element.textContent != name) element.textContent = name;
    });
}, 0.1);
