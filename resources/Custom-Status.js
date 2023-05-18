import data from '../configs/ElainaV2_config.json'
if (data["Custom-Status"]) {
    await fetch(
        "/lol-chat/v1/me",
        {headers:{
            "content-type":"application/json"
        },
        body:`{"statusMessage":"${data["line1"]}\\n ${data["line2"]}\\n ${data["line3"]}\\n ${data["line4"]}\\n ${data["line5"]}\\n ${data["line6"]}\\n ${data["line7"]}\\n ${data["line8"]}\\n ${data["line9"]}\\n ${data["line10"]}\\n ${data["line11"]}\\n ${data["line12"]}\\n ${data["line13"]}\\n ${data["line14"]}\\n ${data["line15"]}\\n ${data["line16"]}\\n ${data["line17"]}\\n ${data["line18"]}\\n ${data["line19"]}\\n ${data["line20"]}\\n ${data["line21"]}\\n ${data["line22"]}\\n ${data["line23"]}\\n ${data["line24"]}\\n ${data["line25"]}"}`,method:"PUT"}
    )

}
