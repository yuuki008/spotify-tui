import blessed from 'blessed';
import SpotifyClient from '../spotify/client';

export async function Playlists(client: SpotifyClient): Promise<blessed.Widgets.ListElement> {
  const { items } = await client.myPlaylists();

  const playlistLabels = items.map((item) => item.name);

  return blessed.list({
    top: 3,
    left: 0,
    width: '25%',
    height: '100%-6',
    label: 'Playlists',
    items: playlistLabels,
    border: {
      type: 'line'
    },
    style: {
      selected: {
        bg: 'blue'
      },
      item: {
        fg: 'white',
        bg: 'black'
      },
      border: {
        fg: '#f0f0f0'
      }
    }
  });
}
