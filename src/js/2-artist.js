// *Just to be sure system is works - delete before coding

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('test-button');
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Artist button clicked!');
    });
  }
});

import { getAllArtists, getAlbumsByArtistId } from './api';

async function loadArtistAlbums() {
  try {
    const result = await getAllArtists();
    console.log('✅ Artists:', result);

    const artistList = result.artists;

    if (!artistList || artistList.length === 0) {
      console.warn('No artists found.');
      return;
    }

    const firstArtistId = artistList[0]._id;

    const albums = await getAlbumsByArtistId(firstArtistId);
    console.log(`✅ Albums for artist ID ${firstArtistId}:`, albums);
  } catch (error) {
    console.error('❌ Error in loading artist albums:', error);
  }
}

loadArtistAlbums();