import { setApiKey, getIsLoading } from "./config";
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

let globalObserver: MultilangObserver | null = null;

export function startMultilangTranslate(options: TranslateOptions): {
  isLoading: () => boolean;
  stop: () => void;
} {
  // 기존 observer가 있으면 중지
  if (globalObserver) {
    globalObserver.stop();
  }

  globalObserver = new MultilangObserver(options);
  globalObserver.start();

  return {
    isLoading: getIsLoading,
    stop: () => {
      globalObserver?.stop();
      globalObserver = null;
    },
  };
}
