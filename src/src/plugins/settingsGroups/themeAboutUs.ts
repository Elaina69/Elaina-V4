import { UI } from "./settingsUI.ts"
import { error } from "../settings.ts"

export async function aboutustab(panel) {
    const loading = UI.Row("loading", [
        UI.Loading(await getString("settings-loading")),
    ])
    panel.appendChild(loading);

    try {
        panel.prepend(
            UI.Row("",[
                UI.Row("Developer",[
                    UI.Row("dev-avatar",[
                        UI.Row("dev-div",[
                            UI.ImageAndLink(false, "https://avatars.githubusercontent.com/u/29869255", "dev_ava", "https://github.com/Ku-Tadao", () => {}),
                            UI.Label("Kubi", "first_line_kubi"),
                            UI.Label(await getString("optimizing-theme"),"")
                        ]),
                        UI.Row("dev-div",[
                            UI.ImageAndLink(true, "about-us/elainadacatto.png", "dev_ava", "https://github.com/Elaina69", () => {}),
                            UI.Label("Elaina Da Catto", "first_line_elaina"),
                            UI.Label(await getString("main-developer"),"")
                        ]),
                        UI.Row("dev-div",[
                            UI.ImageAndLink(false, "https://avatars.githubusercontent.com/u/43145883", "dev_ava", "https://github.com/Lyfhael", () => {}),
                            UI.Label("Lyfhael", "first_line_lyfhael"),
                            UI.Label(await getString("co-founder"),"")
                        ]),
                    ]),
                ]),
                UI.Label(await getString("contributors") + ":","contributors"),
                UI.Row("Contributors-row",[
                    UI.Contributor(false, "https://avatars.githubusercontent.com/u/38210249","Nomi-san","Daubuoi"),
                    UI.Contributor(false, "https://avatars.githubusercontent.com/u/8694498","BakaFT", `${await getString("support")}, ${await getString("translator")}`),
                ]),
                UI.Row("Contributors-row",[
                    UI.Contributor(false, "https://avatars.githubusercontent.com/u/45071533","Sarah Engel", `${await getString("support")}, ${await getString("plugins-provider")}`),
                    UI.Contributor(true, "about-us/soulmare.png","Soulmare", `${await getString("support")}, ${await getString("translator")}`),
                ]),
                UI.Row("Contributors-row",[
                    UI.Contributor(true, "about-us/balaclava.png","Balaclava", `${await getString("plugins-provider")}`),
                    UI.Contributor(true, "about-us/dmitryfisk.png","DmitryFisk", `${await getString("plugins-provider")}`),
                ]),
                UI.Row("Contributors-row",[
                    UI.Contributor(true, "about-us/legnatbird.png","Legnatbird", `${await getString("support")}, ${await getString("translator")}`),
                    UI.Contributor(true, "about-us/flirip.png","Flirip", `${await getString("translator")}`),
                ]),
                UI.Row("Donation-row",[
                    UI.Contributor(true, "about-us/unproductive.webp","unproductive", `${await getString("support")}, ${await getString("plugins-provider")}`),
                    UI.Contributor(false, "https://avatars.githubusercontent.com/u/59478113","Rumi", `${await getString("support")}`),
                ]),
                /*
                UI.Row("Contributors-row",[
                    UI.Contributor("about-us/","",""),
                    UI.Contributor("about-us/","",""),
                ]),
                */
                document.createElement("br"),
                UI.Row("User-counter",[
                    UI.Label(await getString("user-counter"), "first_line"),
                    UI.ImageAndLink(false,`https://count.getloli.com/@Elainav4?name=Elainav4&theme=${ElainaData.get("NSFW-Content")? "gelbooru-h" : "booru-lewd"}&padding=7&offset=0&align=center&scale=1&pixelated=1&darkmode=auto&num=${ElainaData.has("User-Counter")? ElainaData.get("User-Counter") : " "}`, "moe-counter", "", () => {})
                ]),
                document.createElement("br"),
                UI.Row("Donation",[
                    UI.Label(await getString("donate-firstline"),"first_line"),
                    UI.Label(await getString("donate-secondline"),""),
                    UI.Label(await getString("donate-thirdline"), ""),
                    UI.Row("Donation-row",[
                        UI.ImageAndLink(true, "ko-fi.webp","donate", "https://ko-fi.com/elainadacatto", () => {}),
                        UI.ImageAndLink(true, "paypal.png", "donate", "https://www.paypal.com/paypalme/ElainaDaCattoRiel", () => {}),
                        UI.ImageAndLink(true, "momo.svg", "donate","https://me.momo.vn/elainadacatto", () => {}),
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