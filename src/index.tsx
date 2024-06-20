import OAuth from './spotify/oauth';
import SpotifyClient from './spotify/client';
import React, { useState, useEffect } from 'react';
import { Box, Text, render } from 'ink';
import { Playlist } from '@spotify/web-api-ts-sdk';

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    const f = async () => {
      const oauth = new OAuth();
      const spotifyClient = new SpotifyClient(oauth);
      const res = await spotifyClient.myPlaylists();
      setPlaylists(res.items);
    }
    f();
  }, []);

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="row">
        <Box width="30%">
          <Text>Playlists</Text>
          {playlists.map((playlist) => (
            <Text key={playlist.id}>
              {playlist.name}
            </Text>
          ))}
        </Box>
        <Box width="70%">
          <Text>Tracks</Text>
          {tracks.map((track) => (
            <Text key={track.track.id}>{track.track.name}</Text>
          ))}
        </Box>
      </Box>
      <Box borderColor="green" borderStyle="round" padding={1} marginTop={1}>
        <Text>Player</Text>
      </Box>
    </Box>
  );
};

render(<App />);

