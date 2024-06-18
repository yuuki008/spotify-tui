import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import open from 'open';
import { getAccessToken as fetchAccessToken } from './auth';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

let accessToken: string | null = null;

const client = axios.create({
  baseURL: SPOTIFY_BASE_URL,
});

client.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      accessToken = await fetchAccessToken();
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig<any> & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        accessToken = await fetchAccessToken();
        if (!accessToken) {
          // 認証ページにリダイレクト
          open('http://localhost:8888/login');
          return Promise.reject('認証が必要です。ブラウザを確認してください。');
        }
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (tokenError) {
        return Promise.reject(tokenError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;

