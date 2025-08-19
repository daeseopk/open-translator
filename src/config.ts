let apiKey: string | null = null;
let isLoading = false;

export function setApiKey(key: string) {
  apiKey = key;
}

export function getApiKey(): string {
  if (!apiKey) {
    throw new Error("API key is not initialized. Call initialize() first.");
  }
  return apiKey;
}

export function setIsLoading(value: boolean) {
  isLoading = value;
}

export function getIsLoading(): boolean {
  return isLoading;
}
