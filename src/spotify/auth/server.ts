import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import open from 'open';
import { clientId, clientSecret, redirectUri } from './index';

const app = express();
const port = 8888;

let accessToken: string | null = null;

app.get('/login', (_req, res) => {
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
});

app.get('/callback', async (req, res) => {
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

      accessToken = tokenResponse.data.access_token;

      res.send('ログイン成功！ターミナルに戻ってください。');
    } catch (error) {
      console.error('トークン取得中にエラーが発生しました。', error);
      res.send('ログインに失敗しました。');
    }
  } else {
    res.send('認証コードが見つかりませんでした。');
  }
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
  open('http://localhost:8888/login');
});

export const getAccessToken = async (): Promise<string | null> => {
  if (accessToken) {
    return accessToken;
  }

  // トークンの再取得ロジック
  // 必要に応じてリダイレクトの処理を追加します

  return null;
};

