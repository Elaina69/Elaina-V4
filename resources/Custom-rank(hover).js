import data from '../configs/ElainaV2_config.json'

if (data["Custom-Rank(Hover-card)"]) {
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
                "rankedLeagueQueue"    : queueOptions[data["rankedQueue"]],
                "rankedLeagueTier"     : tierOptions[data["rankTier"]],
                "rankedLeagueDivision" : divisionOptions[data["rankDivision"]]
            }
        }
        
        await fetch("/lol-chat/v1/me", {
            method : "PUT",
            headers: {"content-type": "application/json"},
            body   : JSON.stringify(requestBody)
        })
    })
}