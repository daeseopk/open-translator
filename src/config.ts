let apiKey: string | null = null;

export function setApiKey(key: string) {
  apiKey = key;
}

export function getApiKey(): string {
  if (!apiKey) {
    throw new Error("API key is not initialized. Call initialize() first.");
  }
  return apiKey;
}
