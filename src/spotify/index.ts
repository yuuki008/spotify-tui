import client from "./client";
export async function getTrack(id: string) {
  try {
    const response = await client.get(`/tracks/${id}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching track:', error);
  }
};

export async function getMyPlaylist() {
  try {
    const response = await client.get(`/me/playlists`);
    console.log(response.data.error);
    return response;
  } catch (error) {
    console.log(error);
    console.error("Error fetching my playlists:");
  }
}
