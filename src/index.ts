import { getUserInfo } from './spotify/index';

const main = async () => {
  console.log('認証を開始します...');
  await new Promise(resolve => setTimeout(resolve, 5000)); // 認証を待つための一時停止（調整が必要です）

  await getUserInfo();
};

main().catch(console.error);

