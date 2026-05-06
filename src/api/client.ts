import axios, { AxiosHeaders } from 'axios';

import { env } from '../utils/env';

export const apiClient = axios.create({
  baseURL: env.getApiBaseUrl(),
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  headers.set('Authorization', `Bearer ${env.getApiToken()}`);
  config.headers = headers;

  return config;
});
