const API_URL_ENV_KEY = 'EXPO_PUBLIC_API_URL';
const API_TOKEN_ENV_KEY = 'EXPO_PUBLIC_API_TOKEN';

const DEFAULT_API_URL = 'https://k8s.mectest.ru/test-app';
const DEFAULT_API_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getApiBaseUrl(): string {
  return readEnv(API_URL_ENV_KEY) ?? DEFAULT_API_URL;
}

export function getApiToken(): string {
  return readEnv(API_TOKEN_ENV_KEY) ?? DEFAULT_API_TOKEN;
}

export const env = {
  getApiBaseUrl,
  getApiToken,
};
