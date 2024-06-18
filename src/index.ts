import { getUserInfo } from './spotify/index.js';
import { getAccessToken, startAuthServer } from './spotify/auth/server.js';

const main = async () => {
  console.log('認証を開始します...');

  const accessToken = await getAccessToken();
  if (accessToken) {
    await getUserInfo();
  } else {
    console.log('アクセストークンが取得できませんでした。認証サーバーを起動します...');
    startAuthServer();
  }
};

main().catch(console.error);
