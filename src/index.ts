import blessed from 'blessed';
import SpotifyClient from './spotify/client.js';
import OAuth from './spotify/oauth.js';
import { Playlists } from './components/Playlists.js';
import { Search } from './components/Search.js';
import { Player } from './components/Player.js';
import { Main } from './components/Main.js';
// スクリーンを作成
const screen = blessed.screen({
  smartCSR: true,
  title: 'Spotify TUI Example'
});

const main = async () => {
  const oauth = new OAuth();
  const client = new SpotifyClient(oauth);

  const playlistsBox = await Playlists(client);
  const searchBox = Search();
  const playerBox = Player();
  const mainBox = Main();

  screen.append(playlistsBox);
  screen.append(playerBox);
  screen.append(mainBox);
  screen.append(searchBox);

  searchBox.on('submit', (text) => {
    console.log(`Searching for: ${text}`);
    searchBox.clearValue();
    screen.render();
  });

  screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

  searchBox.focus();

  screen.render();

};

main();


