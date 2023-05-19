import data from '../configs/ElainaV2_config.json'

let rankedQueue;
let rankTier;
let rankDivision;

let rqdata = data["rankedQueue"]
let rtdata = data["rankTier"]
let rddata = data["rankDivision"]

if (data["Custom-Rank(Hover-card)"]) {
    if      (rqdata == 0) {rankedQueue = "RANKED_SOLO_5x5"}
    else if (rqdata == 1) {rankedQueue = "RANKED_FLEX_SR"}
    else if (rqdata == 2) {rankedQueue = "RANKED_FLEX_TT"}
    else if (rqdata == 3) {rankedQueue = "RANKED_TFT"}
    else if (rqdata == 4) {rankedQueue = "RANKED_TFT_TURBO"}
    else if (rqdata == 5) {rankedQueue = "RANKED_TFT_DOUBLE_UP"}
    else if (rqdata == 6) {rankedQueue = ""}
    else {}

    if      (rtdata == 0) {rankTier = "IRON"}
    else if (rtdata == 1) {rankTier = "BRONZE"}
    else if (rtdata == 2) {rankTier = "SILVER"}
    else if (rtdata == 3) {rankTier = "GOLD"}
    else if (rtdata == 4) {rankTier = "PLATINUM"}
    else if (rtdata == 5) {rankTier = "DIAMOND"}
    else if (rtdata == 6) {rankTier = "MASTER"}
    else if (rtdata == 7) {rankTier = "GRANDMASTER"}
    else if (rtdata == 8) {rankTier = "CHALLENGER"}
    else {}

    if      (rddata == 0) {rankDivision = "I"}
    else if (rddata == 1) {rankDivision = "II"}
    else if (rddata == 2) {rankDivision = "III"}
    else if (rddata == 3) {rankDivision = "IV"}
    else if (rddata == 4) {rankDivision = ""}
    else {}
    
    await fetch(
        "/lol-chat/v1/me",
        {headers:{
            "content-type":"application/json"
        },
        body:`{"lol":{"rankedLeagueQueue":"${rankedQueue}","rankedLeagueTier":"${rankTier}","rankedLeagueDivision":"${rankDivision}"}}`,method:"PUT"}
    )
}
