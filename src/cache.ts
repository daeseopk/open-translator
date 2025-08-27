import type { Language, TranslationCache } from "./type";

const CACHE_KEY_PREFIX = "multilang_cache_";

export function loadCache(lang: Language): TranslationCache {
  const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + lang);
  return raw ? JSON.parse(raw) : {};
}

export function saveCache(lang: Language, cache: TranslationCache) {
  sessionStorage.setItem(CACHE_KEY_PREFIX + lang, JSON.stringify(cache));
}
