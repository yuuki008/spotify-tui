import OAuth from './spotify/oauth.js';
import SpotifyClient from './spotify/client.js';
import dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const oauth = new OAuth();
  const spotifyClient = new SpotifyClient(oauth);

  spotifyClient.getUserProfile().then(profile => {
    console.log('ユーザープロフィール:', profile);
  }).catch(error => {
    console.error('エラー:', error);
  });
};

main().catch(console.error);
