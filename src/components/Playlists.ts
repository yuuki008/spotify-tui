import blessed from 'blessed';
import SpotifyClient from '../spotify/client';

export async function Playlists(client: SpotifyClient): Promise<blessed.Widgets.ListElement & { playlistIds: string[] }> {
  const { items } = await client.myPlaylists();

  const playlistLabels = items.map((item) => item.name);
  const playlistIds = items.map((item) => item.id);

  const list = blessed.list({
    top: 3,
    left: 0,
    width: '25%',
    height: '100%-6',
    label: 'Playlists',
    items: playlistLabels,
    border: {
      type: 'line'
    },
    keys: true,
    vi: true,
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
      },
      focus: {
        border: {
          fg: 'yellow'
        }
      }
    }
  }) as blessed.Widgets.ListElement & { playlistIds: string[] };

  list.playlistIds = playlistIds;
  return list;
}

