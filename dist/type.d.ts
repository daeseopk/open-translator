export type Language = "en" | "ko" | "jp" | string;
export interface TranslationCache {
    [nodeId: string]: string;
}
export interface TranslateOptions {
    targetLang: Language;
    tone?: "formal" | "casual" | "marketing";
}
