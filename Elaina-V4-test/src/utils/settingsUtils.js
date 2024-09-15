export function settingsUtils(context, data) {
    context.rcp.postInit('rcp-fe-lol-settings', async (api) => {
        window.__RCP_SETTINGS_API = api

        let ember_api = window.__RCP_EMBER_API
        let ember = await ember_api.getEmber()

        for (let i = 0; i < data.length; i++) {
            let newGroup = {
                name: data[i]["groupName"],
                titleKey: data[i]["titleKey"],
                capitalTitleKey: data[i]["capitalTitleKey"],
                categories:[]
            }
    
            let newGroupPush = (Name, Title) => {
                newGroup.categories.push({
                    name: Name,
                    titleKey: Title,
                    routeName: Name,
                    group: newGroup,
                    loginStatus: true,
                    requireLogin: false,
                    forceDisabled: false,
                    computeds: ember.Object.create({
                        disabled: false
                    }),
                    isEnabled: () => true,
                })
            }

            for (let j = 0; j < data[i]["element"].length; j++) {
                newGroupPush(data[i]["element"][j]["name"],data[i]["element"][j]["title"])
            }
    
            api._modalManager._registeredCategoryGroups.splice(1, 0, newGroup)
            api._modalManager._refreshCategoryGroups()
        }
    })

    context.rcp.postInit('rcp-fe-ember-libs', async (api) => {
        window.__RCP_EMBER_API = api

        let ember = await api.getEmber()

        let originalExtend = ember.Router.extend
        ember.Router.extend = function() {
            let result = originalExtend.apply(this, arguments)

            result.map(function() {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i]["element"].length; j++) {
                        this.route(data[i]["element"][j]["name"])
                    }
                }
            })

            return result
        }
    },

    context.rcp.postInit('rcp-fe-lol-l10n', async (api) => {
        let tra = api.tra()

        let originalGet = tra.__proto__.get
        tra.__proto__.get = function(key) {
            if (key.startsWith('el_')) {
                for (let i = 0; i < data.length; i++) {
                    if (key == data[i]["titleKey"]) {
                        return data[i]["titleName"]
                    }
                    else if (key == data[i]["capitalTitleKey"]) {
                        return data[i]["capitalTitleName"]
                    }
                    for (let j = 0; j < data[i]["element"].length; j++) {
                        if (key == data[i]["element"][j]["title"]) {
                            return data[i]["element"][j]["titleName"]
                        }
                    }
                }
            }

            return originalGet.apply(this, [key]);
        }
    }),

    context.rcp.postInit('rcp-fe-ember-libs', async (api) => {
        window.__RCP_EMBER_API = api

        let ember = await api.getEmber()

        let originalExtend = ember.Router.extend
        ember.Router.extend = function() {
            let result = originalExtend.apply(this, arguments)
            result.map(function() {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i]["element"].length; j++) {
                        this.route(data[i]["element"][j]["name"])
                    }
                }
            })

            return result
        }

        let factory = await api.getEmberApplicationFactory()

        let originalBuilder = factory.factoryDefinitionBuilder
        factory.factoryDefinitionBuilder = function() {
            let builder = originalBuilder.apply(this, arguments)
            let originalBuild = builder.build
            builder.build = function() {
                let name = this.getName()
                if (name == 'rcp-fe-lol-settings') {
                    window.__SETTINGS_OBJECT = this

                    let addTab = (Name,Id,Tab) => {
                        this.addTemplate(Name, ember.HTMLBars.template({
                            id: Id,
                            block: JSON.stringify(Tab),
                            meta: {}
                        }))
                    }

                    function newSettingsTab(className) {
                        let tab = {
                            "statements":[
                                ["open-element","lol-uikit-scrollable",[]],
                                ["static-attr","class",className],
                                ["flush-element"],
                                    ["close-element"]
                            ],
                            "locals":[],
                            "named":[],
                            "yields":[],
                            "blocks":[],
                            "hasPartials":false
                        }
                        return tab
                    }

                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < data[i]["element"].length; j++) {
                            addTab(data[i]["element"][j]["name"],data[i]["element"][j]["id"],newSettingsTab(data[i]["element"][j]["class"]))
                        }
                    }
                }
                
                return originalBuild.apply(this, arguments)
            }
            return builder
        }
    }))
}