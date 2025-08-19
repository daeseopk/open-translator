import { setApiKey } from "./config";
import { MultilangObserver } from "./domObserver";
import type { TranslateOptions } from "./type";

interface InitializeOptions {
  apiKey: string;
}

interface UseTranslateMultiLanguage {
  startTranslate: (options: TranslateOptions) => void;
  stopTranslate: () => void;
  isLoading: boolean;
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

export function useTranslateMultiLanguage(): UseTranslateMultiLanguage {
  let isLoading = false;
  let currentObserver: MultilangObserver | null = null;

  const startTranslate = async (options: TranslateOptions) => {
    // 기존 observer가 있다면 정리
    if (currentObserver) {
      currentObserver.stop();
    }

    isLoading = true;
    try {
      const observer = new MultilangObserver(options);
      await observer.start();
      currentObserver = observer;
    } catch (error) {
      console.error("Translation start failed:", error);
    } finally {
      isLoading = false;
    }
  };

  const stopTranslate = () => {
    if (currentObserver) {
      currentObserver.stop();
      currentObserver = null;
    }
  };

  return {
    startTranslate,
    stopTranslate,
    get isLoading() {
      return isLoading;
    },
  };
}
