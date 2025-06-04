import { setApiKey } from "./config";
import { MultilangObserver } from "./domObserver";
import type { TranslateOptions } from "./type";

interface InitializeOptions {
  apiKey: string;
}

export function initialize(options: InitializeOptions) {
  const { apiKey } = options;
  if (!apiKey) {
    throw new Error("apiKey is required");
  }
  setApiKey(apiKey);
}

export function startMultilangTranslate(options: TranslateOptions) {
  const observer = new MultilangObserver(options);
  observer.start();
  return observer;
}
