import OAuth from './spotify/oauth.js';
import SpotifyClient from './spotify/client.js';
import dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const oauth = new OAuth();
  const spotifyClient = new SpotifyClient(oauth);

  const playlists = await spotifyClient.myPlaylists();
  console.log(playlists);
};

main().catch(console.error);
