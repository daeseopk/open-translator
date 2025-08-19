import { useState, useCallback, useRef, useEffect } from "react";
import { setApiKey } from "./config";
import { MultilangObserver } from "./domObserver";
import type { TranslateOptions } from "./type";

interface InitializeOptions {
  apiKey: string;
}

interface UseTranslateMultiLanguage {
  startTranslate: (options: TranslateOptions) => Promise<void>;
  stopTranslate: () => void;
  isLoading: boolean;
  error: string | null;
  isTranslating: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const currentObserverRef = useRef<MultilangObserver | null>(null);

  const startTranslate = useCallback(async (options: TranslateOptions) => {
    // 기존 observer가 있다면 정리
    if (currentObserverRef.current) {
      currentObserverRef.current.stop();
      currentObserverRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const observer = new MultilangObserver(options);
      await observer.start();
      currentObserverRef.current = observer;
      setIsTranslating(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Translation start failed";
      setError(errorMessage);
      console.error("Translation start failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopTranslate = useCallback(() => {
    if (currentObserverRef.current) {
      currentObserverRef.current.stop();
      currentObserverRef.current = null;
      setIsTranslating(false);
      setError(null);
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (currentObserverRef.current) {
        currentObserverRef.current.stop();
      }
    };
  }, []);

  return {
    startTranslate,
    stopTranslate,
    isLoading,
    error,
    isTranslating,
  };
}
