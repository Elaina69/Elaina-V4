import { getThemeName } from "../otherThings"
import { log, error } from '../utils/themeLog';
import { customAvatar } from "../theme/customUI/customIcon";

const icdata = (await import(`//plugins/${getThemeName()}/config/icons.js`)).default;

const datapath = `//plugins/${getThemeName()}/`
const iconFolder  = `${datapath}assets/icon/`

let friendIconList: { 
    summonerID: number, 
    icon: {
        avatar: string, 
        border: string, 
        banner: string, 
        emblem: string, 
        hoverCardBackdrop: string
    } 
}[] = []

let friendsList: { summonerId: number }[] = []

class SyncUserIcons {
    async getFrinedList() {
        let friends = await fetch('/lol-chat/v1/friends').then(res => res.json());
        for (let i = 0; i < friends.length; i++) {
            friendsList.push({"summonerId": friends[i]["summonerId"]})
        }
    }

    async getFriendsIcons(): Promise<void> {
        await this.getFrinedList()

        friendIconList = await window.elainathemeApi.getFriendsImage(friendsList);
    };

    async uploadIcon(icon: string, iconType: string) {
        const response = await fetch(icon);
        if (!response.ok) error(`Failed to fetch icon: ${icon}`);

        const blob = await response.blob();
        const mimeToExt = {
            "image/png": ".png",
            "image/jpeg": ".jpg",
            "image/webp": ".webp",
            "image/gif": ".gif"
        };
        log("Uploading " + icon)
        const ext = mimeToExt[blob.type] || ".png";
        const file = new File([blob], iconType + ext, { type: blob.type });

        try {
            await window.elainathemeApi.uploadImage(ElainaData.get("ElainaTheme-Token"), ElainaData.get("Summoner-ID"), iconType, file)
        }
        catch (err: any) {
            error(`Failed to upload icon of type ${iconType}: `, err);
        }
    }

    async getIcon(summonerID: number, iconType: string) {
        try {
            const icon = await window.elainathemeApi.getImage(summonerID, iconType);
            return icon;
        } catch (err: any) {
            error(`Failed to get icon of type ${iconType}`, err);
            return null;
        }
    }

    async deleteIcon(summonerID: number, iconType: string) {
        try {
            await window.elainathemeApi.deleteImage(ElainaData.get("ElainaTheme-Token"), summonerID, iconType);
        } catch (err: any) {
            error(`Failed to delete icon of type ${iconType}`, err);
        }
    }

    async main() {
        // Sync friends icons
        await window.Toast.promise(this.getFriendsIcons(), {
            loading: 'Syncing friends icons...',
            success: 'Sync complete!',
            error: 'Error while syncing friends icons, check console for more info!'
        })

        // Upload your icons
        const uploadIcons = [
            this.uploadIcon(`${iconFolder}${icdata["Avatar"]}`, "avatar"),
            this.uploadIcon(`${iconFolder}${icdata["Border"]}`, "border"),
            this.uploadIcon(`${iconFolder}Regalia-Banners/${ElainaData.get("CurrentBanner")}`, "banner"),
            this.uploadIcon(`${iconFolder}${icdata["Hover-card"]}`, "hoverCardBackdrop"),
            this.uploadIcon(`${iconFolder}${icdata["Honor"]}`, "emblem")
        ];
        await Promise.all(uploadIcons);

        // Update avatar on conversations
        let conversationChat = document.querySelectorAll(".conversation.chat");
        for (let i = 0; i < conversationChat.length; i++) {
            customAvatar.changeConversationChatAvatar(conversationChat[i])
        }
    }
}

const syncUserIcons = new SyncUserIcons();
window.syncUserIcons = syncUserIcons;

export { friendIconList }