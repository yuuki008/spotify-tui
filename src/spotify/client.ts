import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import OAuth from './oauth.js';
import { SpotifyDevice, SpotifyShowsResponse, SpotifyUserProfile } from './type.js';

const endpoint = 'https://api.spotify.com/v1';

interface RequestParams {
  method: string;
  path: string;
  headers?: AxiosHeaders;
  body?: any;
  retry?: boolean;
}

export default class SpotifyClient {
  private oauth: OAuth;

  constructor(oauth: OAuth) {
    this.oauth = oauth;
  }

  // NOTE: 共通の API リクエストメソッド
  // 認証に失敗したリクエストは再度アクセストークンをリフレッシュしてリクエスト
  private async makeRequest<T>({
    method,
    path,
    headers,
    body,
    retry = true
  }: RequestParams): Promise<T> {
    const accessToken = await this.oauth.getAccessToken();
    if (!accessToken) {
      throw new Error('アクセストークンが取得できませんでした。');
    }

    const config: AxiosRequestConfig = {
      url: endpoint + path,
      method,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
      data: body,
    };

    try {
      const response = await axios(config);
      return response.data as T;
    } catch (error: any) {
      if (error.response && error.response.status === 401 && retry) {
        await this.oauth.refreshAccessToken();
        return this.makeRequest<T>({ method, path, headers, body, retry: false });
      } else {
        throw error;
      }
    }
  }

  public async devices(): Promise<SpotifyDevice[]> {
    return this.makeRequest<SpotifyDevice[]>({
      method: 'get',
      path: '/me/player/devices'
    });
  }

  public async getUserProfile(): Promise<SpotifyUserProfile> {
    return this.makeRequest<SpotifyUserProfile>({
      method: 'get',
      path: '/me'
    });
  }

  public async myPlaylists(): Promise<SpotifyShowsResponse> {
    return this.makeRequest({
      method: 'get',
      path: '/me/playlists'
    })
  }

  public async play(args: {
    deviceId?: string;
    context_uri?: string;
    uris?: string;
    offset?: number;
    position_ms?: number
  }): Promise<void> {
    await this.makeRequest<void>({
      method: 'put',
      path: '/me/player/play',
      body: args
    });
  }

  public async pasuse(device_id?: string) {
    const body = device_id ? { device_id } : {}
    await this.makeRequest({
      method: "put",
      path: '/me/player/pause',
      body
    });
  };
}

