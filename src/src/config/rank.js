// Open settings.js and custom-profile.js if update this file

let rank = {
    "Ranked Queue ID": [
        {
            "id" : 0, 
            "name": `${await getString("Ranked Solo 5vs5")}`, 
            "Option": "RANKED_SOLO_5x5",
        },
        {
            "id" : 1, 
            "name": `${await getString("Ranked Flex Summoner's Rift")}`, 
            "Option": "RANKED_FLEX_SR",
        },
        {
            "id" : 2, 
            "name": `${await getString("Ranked Flex TT")}`,
            "Option": "RANKED_FLEX_TT", 
        },
        {
            "id" : 3, 
            "name": `${await getString("Ranked TFT")}`, 
            "Option": "RANKED_TFT",
        },
        {
            "id" : 4, 
            "name": `${await getString("Ranked TFT TURBO")}`, 
            "Option": "RANKED_TFT_TURBO",
        },
        {
            "id" : 5, 
            "name": `${await getString("Ranked TFT DOUBLE UP")}`, 
            "Option": "RANKED_TFT_DOUBLE_UP",
        },
        {
            "id" : 6, 
            "name": `${await getString("Ranked TFT PAIRS")}`, 
            "Option": "RANKED_TFT_PAIRS",
        },
        {
            "id" : 7, 
            "name": `${await getString("Arena")}`, 
            "Option": "CHERRY"
        }
    ],

    "Ranked Tier ID": [
        {
            "id" : 0, 
            "name": `${await getString("Iron")}`,
            "Option": "IRON",
        },
        {
            "id" : 1, 
            "name": `${await getString("Bronze")}`,
            "Option": "BRONZE",
        },
        {
            "id" : 2, 
            "name": `${await getString("Silver")}`,
            "Option": "SILVER",
        },
        {
            "id" : 3, 
            "name": `${await getString("Gold")}`,
            "Option": "GOLD",
        },
        {
            "id" : 4, 
            "name": `${await getString("Platinum")}`,
            "Option": "PLATINUM",
        },
        {
            "id" : 5, 
            "name": `${await getString("Diamond")}`,
            "Option": "DIAMOND",
        },
        {
            "id" : 6,
            "name": `${await getString("Emerald")}`,
            "Option": "EMERALD",
        },
        {
            "id" : 7, 
            "name": `${await getString("Master")}`,
            "Option": "MASTER",
        },
        {
            "id" : 8, 
            "name": `${await getString("Grand-Master")}`,
            "Option": "GRANDMASTER",
        },
        {
            "id" : 9, 
            "name": `${await getString("Challenger")}`,
            "Option": "CHALLENGER"
        }
    ],

    "Ranked Division ID": [
        {
            "id" : 0, 
            "name": "I"
        },
        {
            "id" : 1, 
            "name": "II"
        },
        {
            "id" : 2, 
            "name": "III"
        },
        {
            "id" : 3, 
            "name": "IV"
        }
    ]
}

export default rank