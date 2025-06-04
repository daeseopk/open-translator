import type { TranslateOptions } from "./type";
export declare const DATA_AUTO_TRANSLATE_ATTRIBUTE = "data-auto-translate";
export declare class MultilangObserver {
    private options;
    private observer;
    private cache;
    private targetLang;
    constructor(options: TranslateOptions);
    start(): Promise<void>;
    private translate;
    stop(): void;
}
