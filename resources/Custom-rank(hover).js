if (DataStore.get("Custom-Rank(Hover-card)")) {
    window.setTimeout(async()=>{
        let queueOptions = ["RANKED_SOLO_5x5","RANKED_FLEX_SR","RANKED_FLEX_TT",
                            "RANKED_TFT","RANKED_TFT_TURBO","RANKED_TFT_DOUBLE_UP",
        ]
        let tierOptions = ["IRON","BRONZE","SILVER","GOLD","PLATINUM",
                           "DIAMOND","MASTER","GRANDMASTER","CHALLENGER"
        ]
        let divisionOptions = ["I", "II", "III", "IV"];
        let requestBody = {
            "lol": {
                "rankedLeagueQueue"    : queueOptions[DataStore.get("Ranked Queue ID")],
                "rankedLeagueTier"     : tierOptions[DataStore.get("Ranked Tier ID")],
                "rankedLeagueDivision" : divisionOptions[DataStore.get("Ranked Division ID")]
            }
        }
        
        await fetch("/lol-chat/v1/me", {
            method : "PUT",
            headers: {"content-type": "application/json"},
            body   : JSON.stringify(requestBody)
        })
    })
}