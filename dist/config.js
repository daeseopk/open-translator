let apiKey = null;
export function setApiKey(key) {
    apiKey = key;
}
export function getApiKey() {
    if (!apiKey) {
        throw new Error("API key is not initialized. Call initialize() first.");
    }
    return apiKey;
}
