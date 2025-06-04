const CACHE_KEY_PREFIX = "multilang_cache_";
export function loadCache(lang) {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + lang);
    return raw ? JSON.parse(raw) : {};
}
export function saveCache(lang, cache) {
    localStorage.setItem(CACHE_KEY_PREFIX + lang, JSON.stringify(cache));
}
