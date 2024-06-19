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
  fullUnicode: true,
  title: 'Spotify TUI Example',
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

  playlistsBox.on('select', async (_item, index) => {
    const selectedPlaylist = playlistsBox.getItem(index).content;
    const playlistId = playlistsBox.playlistIds[index];
    const tracks = await client.getPlaylistTracks(playlistId);

    const trackNames = tracks.items.map((trackItem) => trackItem.track.name).join('\n');
    mainBox.setContent(`Playlist: ${selectedPlaylist}\n\nTracks:\n${trackNames}`);
    screen.render();
  });

  searchBox.on('submit', (text) => {
    console.log(`Searching for: ${text}`);
    searchBox.clearValue();
    screen.render();
  });

  screen.key(['tab'], () => {
    screen.focusNext();
  });

  screen.key(['S-tab'], () => {
    screen.focusPrevious();
  });

  screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

  playlistsBox.focus();
  screen.render();
};

main();

