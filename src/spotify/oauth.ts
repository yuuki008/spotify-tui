import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import open from 'open';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 開発者用の認証情報
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
const port = '8888'





// 認証方法は Authorization Code Flow を採用
//   ドキュメント: https://developer.spotify.com/documentation/web-api/tutorials/code-flow
//   認証フロー:
//     1. ユーザー認証ページにリダイレクト
//     2. ユーザーが許可
//     3. 認可コードを使ってアクセストークンを取得
//     4. アクセストークンを使用して API リクエストを行う
export default class OAuth {
  private TOKEN_PATH: string;
  private accessToken: string | null;
  private server: any;

  constructor() {
    this.TOKEN_PATH = path.resolve(__dirname, 'refresh_token.txt');
    this.accessToken = null;
    this.server = null;
  }

  public login(_req: express.Request, res: express.Response): void {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
    ].join(' ');

    const authorizeURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
    })}`;

    res.redirect(authorizeURL);
  }

  public async callback(req: express.Request, res: express.Response): Promise<void> {
    const code = req.query.code || null;

    if (typeof code === 'string') {
      try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        this.accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;

        fs.writeFileSync(this.TOKEN_PATH, refreshToken);

        res.send('ログイン成功！ターミナルに戻ってください。サーバーを停止します。');
        if (this.server) {
          this.server.close(() => {
            console.log('サーバーが停止しました。');
          });
        }
      } catch (error) {
        console.error('トークン取得中にエラーが発生しました。', error);
        res.send('ログインに失敗しました。');
      }
    } else {
      res.send('認証コードが見つかりませんでした。');
    }
  }

  private getStoredRefreshToken(): string | null {
    if (fs.existsSync(this.TOKEN_PATH)) {
      return fs.readFileSync(this.TOKEN_PATH, 'utf-8').trim();
    }
    return null;
  }

  public async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getStoredRefreshToken();

    try {
      if (!refreshToken) throw new Error('No refresh token found. Please login first.');

      const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error: any) {
      console.error(error);
      this.startAuthServer();
      throw new Error(error.message);
    }
  }

  public startAuthServer(): void {
    const app = express();

    app.get('/login', this.login.bind(this));
    app.get('/callback', this.callback.bind(this));

    this.server = app.listen(port, () => {
      console.log(`サーバーが http://localhost:${port} で起動しました。`);
      open('http://localhost:8888/login');
    });
  }

  // アクセストークンを取得する関数
  public async getAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      return await this.refreshAccessToken();
    } catch (error) {
      console.error('アクセストークンの取得中にエラーが発生しました。', error);
      return null;
    }
  }
}
