import client from "./client.js";
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
  const response = await client.get(`/me/playlists`);
  console.log(response.data.error);
  return response;
}

//  "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb"

export async function getArtists() {
  const response = await client.get("/artists/4Z8W4fKeB5YxbusRsdQVPb");

  console.log(response)
};
export const getUserInfo = async () => {
  try {
    const response = await client.get('/me');
    console.log('ユーザー情報:', response.data);
  } catch (error) {
    console.error('ユーザー情報の取得中にエラーが発生しました。', error);
  }
};

