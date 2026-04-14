/**
 * @wiki Replaces the displayed summoner level on the sidebar and profile page with a custom number. This is a visual-only change and does not affect actual account level.
 * @author Elaina Da Catto
 * @usage
 * 1. Open League Client settings
 * 2. Navigate to **Elaina Theme** → **Plugin Settings**
 * 3. Set **Custom Summoner Level Number** to your desired display level
 * @settings custom-summoner-lv-number
 */
export class CustomSummonerLv {
    customLvOnSidebar = () => {
        const customLv = ElainaData.get("custom-summoner-lv-number")

        let summonerLevelElement = document.querySelector(".summoner-level");
        if (summonerLevelElement) {
            summonerLevelElement.textContent = customLv
        }
    }

    customLvOnProfile = () => {
        const customLv = ElainaData.get("custom-summoner-lv-number")

        let summonerXpRadialNumbers = document.querySelector(".summoner-xp-radial-numbers");
        if (summonerXpRadialNumbers) {
            summonerXpRadialNumbers.textContent = customLv
        }
    }

    main = () => {
        this.customLvOnSidebar()
        this.customLvOnProfile()
    }
}