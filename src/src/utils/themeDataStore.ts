const ElainaData = {
    get (key: string, fallback = null) {
        const data: Object = window.DataStore.get("ElainaTheme", {})
        return data.hasOwnProperty(key) ? data[key] : fallback;
    },

    set (key: string, value: any) {
        const data: Object = window.DataStore.get("ElainaTheme", {})
        data[key] = value
        window.DataStore.set("ElainaTheme", data)
        if (data.hasOwnProperty(key)) {
            return true;
        }
        return false;
    },

    has (key: string) {
        const data: Object = window.DataStore.get("ElainaTheme", {});
        return data.hasOwnProperty(key);
    },

    remove (key: string) {
        const data: Object = window.DataStore.get("ElainaTheme", {});
        if (data.hasOwnProperty(key)) {
            delete data[key];
            window.DataStore.set("ElainaTheme", data);
            return true;
        }
        return false;
    },
};

window.ElainaData = ElainaData