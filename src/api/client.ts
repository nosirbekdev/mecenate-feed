import axios, { AxiosHeaders } from 'axios';

import { env } from '../utils/env';

let bearerToken: string | undefined = env.getApiToken();

export function setBearerToken(token?: string | null): void {
  bearerToken = token ?? undefined;
}

export const apiClient = axios.create({
  baseURL: env.getApiBaseUrl(),
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  if (bearerToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${bearerToken}`);
    config.headers = headers;
  }

  return config;
});
