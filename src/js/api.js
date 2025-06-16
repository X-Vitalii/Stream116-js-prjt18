import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sound-wave.b.goit.study/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const BASE_URL = 'https://sound-wave.b.goit.study/api';

export async function fetchArtists({ page = 1, limit = 8 } = {}) {
  try {
    const response = await api.get('/artists', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getArtistById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch artist with ID ${id}:`, error);
    throw error;
  }
}

export async function getAlbumsByArtistId(artistId) {
  try {
    const response = await axios.get(`${BASE_URL}/artists/${artistId}/albums`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch albums for artist ${artistId}:`, error);
    throw error;
  }
}

export async function getAlbumById(albumId) {
  try {
    const response = await axios.get(`${BASE_URL}/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch album with ID ${albumId}:`, error);
    throw error;
  }
}
