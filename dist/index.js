import { setApiKey } from "./config";
import { MultilangObserver } from "./domObserver";
export function initialize(options) {
    const { apiKey } = options;
    if (!apiKey) {
        throw new Error("apiKey is required");
    }
    setApiKey(apiKey);
}
export function startMultilangTranslate(options) {
    const observer = new MultilangObserver(options);
    observer.start();
    return observer;
}
