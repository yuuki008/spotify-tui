import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import OAuth from './oauth.js';

export default class SpotifyClient {
  private oauth: OAuth;

  constructor(oauth: OAuth) {
    this.oauth = oauth;
  }

  // NOTE: 共通の API リクエストメソッド
  // 認証に失敗したリクエストは再度アクセストークンをリフレッシュしてリクエスト
  private async makeRequest(config: AxiosRequestConfig, retry = true): Promise<AxiosResponse<any>> {
    const accessToken = await this.oauth.getAccessToken();
    if (!accessToken) {
      throw new Error('アクセストークンが取得できませんでした。');
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      return await axios(config);
    } catch (error: any) {
      if (error.response && error.response.status === 401 && retry) {
        await this.oauth.refreshAccessToken();
        return this.makeRequest(config, false);
      } else {
        throw error;
      }
    }
  }

  public async getUserProfile() {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
    };

    try {
      const response = await this.makeRequest(config);
      return response.data;
    } catch (error) {
      console.error('ユーザープロフィールの取得中にエラーが発生しました。', error);
      throw error;
    }
  }
}

