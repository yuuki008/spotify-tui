import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";


async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const response = await axios.post(SPOTIFY_AUTH_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, token_type, expires_in } = response.data;
    console.log(`Access Token: ${access_token}`);
    console.log(`Token Type: ${token_type}`);
    console.log(`Expires In: ${expires_in} seconds`);
    return access_token;
  } catch (error) {
    console.error(error);
    console.error('Error fetching access token');
  }
}

export { getAccessToken };

