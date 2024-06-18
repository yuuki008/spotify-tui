import express from 'express';
import keytar from 'keytar';
import axios from 'axios';
import querystring from 'querystring';
import open from 'open';
import dotenv from 'dotenv'
dotenv.config();

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
  private accessToken: string | null;
  private server: any;

  constructor() {
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

        this.saveRefreshToken(refreshToken);

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

  public async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();

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

  private async saveRefreshToken(token: string) {
    await keytar.setPassword('spotify', 'refresh_token', token);
  }

  private async getRefreshToken() {
    return await keytar.getPassword('spotify', 'refresh_token');
  }
}
