import type { Language, TranslationCache } from "./type";
export declare function loadCache(lang: Language): TranslationCache;
export declare function saveCache(lang: Language, cache: TranslationCache): void;
