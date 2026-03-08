import { UI } from "./settingsUI.ts"
import { error } from "../../utils/themeLog.ts"

export async function aboutustab(panel: Element) {
    // Hiện icon loading trong khi đang tải dữ liệu
    const loading = UI.createRow("loading", [
        UI.createLoading(await getString("settings-loading")),
    ])
    panel.appendChild(loading);

    try {
        panel.prepend(
            UI.createRow("",[
                UI.createRow("Developer",[
                    UI.createRow("dev-avatar",[
                        UI.createRow("dev-div",[
                            UI.createImageWithLink(
                                false, 
                                "https://avatars.githubusercontent.com/u/29869255", 
                                "dev_ava", 
                                "https://github.com/Ku-Tadao", 
                                () => {}
                            ),
                            UI.createLabel("Kubi", "first_line_kubi"),
                            UI.createLabel(await getString("optimizing-theme"),"")
                        ]),
                        UI.createRow("dev-div",[
                            UI.createImageWithLink(
                                true, 
                                "about-us/elainadacatto.png", 
                                "dev_ava", 
                                "https://github.com/Elaina69", 
                                () => {}
                            ),
                            UI.createLabel("Elaina Da Catto", "first_line_elaina"),
                            UI.createLabel(await getString("main-developer"),"")
                        ]),
                        UI.createRow("dev-div",[
                            UI.createImageWithLink(
                                false, 
                                "https://avatars.githubusercontent.com/u/43145883", 
                                "dev_ava", 
                                "https://github.com/Lyfhael", 
                                () => {}
                            ),
                            UI.createLabel("Lyfhael", "first_line_lyfhael"),
                            UI.createLabel(await getString("co-founder"),"")
                        ]),
                    ]),
                ]),
                UI.createLabel(await getString("contributors") + ":","contributors"),
                UI.createRow("Contributors-row",[
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/38210249",
                        "Nomi-san",
                        "Daubuoi",
                        "https://github.com/nomi-san"
                    ),
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/8694498",
                        "BakaFT", 
                        `${await getString("support")}, ${await getString("translator")}`,
                        "https://github.com/BakaFT"
                    ),
                ]),
                UI.createRow("Contributors-row",[
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/45071533",
                        "Miella | Xayah", 
                        `${await getString("support")}, ${await getString("plugins-provider")}`,
                        "https://github.com/HerXayah"
                    ),
                    UI.createContributor(
                        true, 
                        "about-us/soulmare.png",
                        "Soulmare", 
                        `${await getString("support")}, ${await getString("translator")}`,
                        "",
                    ),
                ]),
                UI.createRow("Contributors-row",[
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/71716568",
                        "Balaclava", 
                        `${await getString("plugins-provider")}`,
                        "https://github.com/controlado"
                    ),
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/62219971",
                        "DmitryFisk", 
                        `${await getString("plugins-provider")}`,
                        "https://github.com/DmitryFisk"
                    ),
                ]),
                UI.createRow("Contributors-row",[
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/50637445",
                        "Legnatbird", 
                        `${await getString("support")}, ${await getString("translator")}`,
                        "https://github.com/Legnatbird"
                    ),
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/130996009",
                        "Flirip", 
                        `${await getString("translator")}`,
                        "https://github.com/Flirip"
                    ),
                ]),
                UI.createRow("Donation-row",[
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/21153423",
                        "Unproductive", 
                        `${await getString("support")}, ${await getString("plugins-provider")}`,
                        "https://github.com/imunproductive"
                    ),
                    UI.createContributor(
                        false, 
                        "https://avatars.githubusercontent.com/u/59478113",
                        "Rumi", 
                        `${await getString("support")}`,
                        "https://github.com/rumi-chan"
                    ),
                ]),
                /*
                UI.createRow("Contributors-row",[
                    UI.createContributor(
                        true,
                        "about-us/",
                        "",
                        "",
                        ""
                    ),
                    UI.createContributor(
                        true,
                        "about-us/",
                        "",
                        "",
                        ""
                    ),
                ]),
                */
                document.createElement("br"),
                UI.createRow("User-counter",[
                    UI.createLabel(await getString("user-counter"), "first_line"),
                    UI.createImageWithLink(
                        false,
                        `https://count.getloli.com/@Elainav4?name=Elainav4&theme=${ElainaData.get("NSFW-Content")? "gelbooru-h" : "booru-lewd"}&padding=7&offset=0&align=center&scale=1&pixelated=1&darkmode=auto&num=${ElainaData.has("User-Counter")? ElainaData.get("User-Counter") : " "}`, 
                        "moe-counter", 
                        "", 
                        () => {}
                    )
                ]),
                document.createElement("br"),
                UI.createRow("Donation",[
                    UI.createLabel(await getString("donate-firstline"),"first_line"),
                    UI.createLabel(await getString("donate-secondline"),""),
                    UI.createLabel(await getString("donate-thirdline"), ""),
                    UI.createRow("Donation-row",[
                        UI.createImageWithLink(true, "ko-fi.webp","donate", "https://ko-fi.com/elainadacatto", () => {}),
                        UI.createImageWithLink(true, "paypal.png", "donate", "https://www.paypal.com/paypalme/ElainaDaCattoRiel", () => {}),
                        UI.createImageWithLink(true, "momo.svg", "donate","https://me.momo.vn/elainadacatto", () => {}),
                    ])
                ])
            ])
        )
    }
    catch (err: any) {
        error("Error loading theme settings:", err);
    } finally {
        loading.remove();
    }
}