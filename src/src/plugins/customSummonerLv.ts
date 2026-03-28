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