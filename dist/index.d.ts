import { MultilangObserver } from "./domObserver";
import type { TranslateOptions } from "./type";
interface InitializeOptions {
    apiKey: string;
}
export declare function initialize(options: InitializeOptions): void;
export declare function startMultilangTranslate(options: TranslateOptions): MultilangObserver;
export {};
