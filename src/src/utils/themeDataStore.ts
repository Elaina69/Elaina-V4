const ElainaData = {
    /**
     * Gets a value from the datastore.
     * @param key The key to retrieve.
     * @param fallback The fallback value if the key doesn't exist.
     * @returns The value associated with the key or the fallback.
     */
    get (key: string, fallback = null) {
        const data: Object = window.DataStore.get("ElainaTheme", {})
        return data.hasOwnProperty(key) ? data[key] : fallback;
    },

    /**
     * Sets a value in the datastore.
     * @param key The key to set.
     * @param value The value to associate with the key.
     * @returns True if the key was set successfully, false otherwise.
     */
    set (key: string, value: any) {
        const data: Object = window.DataStore.get("ElainaTheme", {})
        data[key] = value
        window.DataStore.set("ElainaTheme", data)
        if (data.hasOwnProperty(key)) {
            return true;
        }
        return false;
    },

    /**
     * Checks if a key exists in the datastore.
     * @param key The key to check for existence.
     * @returns True if the key exists, false otherwise.
     */
    has (key: string) {
        const data: Object = window.DataStore.get("ElainaTheme", {});
        return data.hasOwnProperty(key);
    },

    /**
     * Removes a key from the datastore.
     * @param key The key to remove.
     * @returns True if the key was removed, false otherwise.
     */
    remove (key: string) {
        const data: Object = window.DataStore.get("ElainaTheme", {});
        if (data.hasOwnProperty(key)) {
            delete data[key];
            window.DataStore.set("ElainaTheme", data);
            return true;
        }
        return false;
    },

    /**
     * Restores the default values of the theme in the datastore.
     */
    restoreDefaults () {
        window.DataStore.set("ElainaTheme", {});
        window.reloadClient()
    }
};

window.ElainaData = ElainaData