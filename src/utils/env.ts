const API_URL_ENV_KEY = 'EXPO_PUBLIC_API_URL';
const API_TOKEN_ENV_KEY = 'EXPO_PUBLIC_API_TOKEN';

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function requireEnv(name: string): string {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getApiBaseUrl(): string {
  return requireEnv(API_URL_ENV_KEY);
}

export function getApiToken(): string {
  return requireEnv(API_TOKEN_ENV_KEY);
}

export function getCommentsWebSocketUrl(postId: string): string {
  const baseUrl = new URL(getApiBaseUrl());
  baseUrl.protocol = baseUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  baseUrl.pathname = `${baseUrl.pathname.replace(/\/$/, '')}/posts/${postId}/comments/ws`;
  baseUrl.search = '';
  baseUrl.hash = '';

  return baseUrl.toString();
}

export const env = {
  getApiBaseUrl,
  getApiToken,
  getCommentsWebSocketUrl,
};
