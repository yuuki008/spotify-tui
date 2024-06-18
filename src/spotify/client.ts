import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from './auth';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

let accessToken: string | null = null;

const client = axios.create({
  baseURL: SPOTIFY_BASE_URL,
});

async function setAccessToken() {
  accessToken = await getAccessToken();
}

client.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      await setAccessToken();
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
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await setAccessToken();
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
