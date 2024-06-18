import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();
export const clientId = process.env.SPOTIFY_CLIENT_ID || "";
export const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
export const redirectUri = process.env.SPOTIFY_REDIRECT_URI
export const accountEndpoint = 'https://accounts.spotify.com';

export async function getAccessToken() {
  const url = accountEndpoint + '/api/token';

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error(error)
  }
};
