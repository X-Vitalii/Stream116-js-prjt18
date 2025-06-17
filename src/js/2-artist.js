import { fetchArtists } from './api.js';
import { openModal } from './5-artist-modal.js';

const ARTISTS_PER_PAGE = 8;
let currentPage = 1;

let artistListElement;
let loadMoreButton;

const showSpinner = () => {
  const spinner = document.getElementById('loader');
  spinner?.classList.remove('hidden');
};

const hideSpinner = () => {
  const spinner = document.getElementById('loader');
  spinner?.classList.add('hidden');
};

const extractGenres = artist => {
  if (!artist || typeof artist !== 'object') return [];
  return Array.isArray(artist.genres) ? artist.genres.filter(Boolean) : [];
};

const buildArtistCard = artist => {
  const listItem = document.createElement('li');
  listItem.className = 'artist-card';

  const image = document.createElement('img');
  image.src =
    artist.strArtistThumb ||
    'https://placehold.co/150x150/cccccc/333333?text=No+Image';
  image.alt = artist.strArtist || 'No Image';
  image.onerror = function () {
    this.src = 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
    this.alt = 'No Image Available';
  };
  listItem.appendChild(image);

  const genresContainer = document.createElement('p');
  const genreItems = extractGenres(artist);
  if (genreItems.length > 0) {
    const genreList = document.createElement('ul');
    genreList.classList.add('artist-genres-list');
    genreItems.forEach(tag => {
      const tagItem = document.createElement('li');
      tagItem.classList.add('genres-list-item');
      tagItem.textContent = tag;
      genreList.appendChild(tagItem);
    });
    genresContainer.appendChild(genreList);
  } else {
    genresContainer.textContent = 'N/A';
  }
  listItem.appendChild(genresContainer);

  const nameElement = document.createElement('h3');
  nameElement.textContent = artist.strArtist || 'Unknown Artist';
  listItem.appendChild(nameElement);

  const bioElement = document.createElement('p');
  bioElement.className = 'artist-description';
  const biography = artist.strBiographyEN || 'No short info available.';
  bioElement.textContent =
    biography.length > 200 ? biography.slice(0, 200) + '...' : biography;
  listItem.appendChild(bioElement);

  const actionButton = document.createElement('button');
  actionButton.className = 'learn-more-btn';
  actionButton.textContent = 'Learn More';
  actionButton.dataset.artistId = artist._id;

  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('class', 'learn-more-icon');
  svgIcon.setAttribute('width', '24');
  svgIcon.setAttribute('height', '24');

  const useTag = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useTag.setAttribute('href', '#icon-caret-right');

  svgIcon.appendChild(useTag);
  actionButton.appendChild(svgIcon);

  listItem.appendChild(actionButton);

  return listItem;
};

const loadMoreArtists = async () => {
  showSpinner();
  try {
    const response = await fetchArtists({
      page: currentPage,
      limit: ARTISTS_PER_PAGE,
    });
    const artists = Array.isArray(response?.artists) ? response.artists : [];

    if (!artists.length) {
      loadMoreButton.classList.add('hidden');
      loadMoreButton.disabled = true;
      return;
    }

    for (const artist of artists) {
      const card = await buildArtistCard(artist);
      artistListElement.appendChild(card);
    }

    currentPage++;

    if (artists.length < ARTISTS_PER_PAGE) {
      loadMoreButton.classList.add('hidden');
      loadMoreButton.disabled = true;
    }
  } catch (err) {
    alert('Failed to load artists. Please try again later.');
    loadMoreButton.classList.add('hidden');
    loadMoreButton.disabled = true;
  } finally {
    hideSpinner();
  }
};

const initializeArtistModule = () => {
  artistListElement = document.getElementById('artists');
  loadMoreButton = document.getElementById('loadMoreBtn');

  if (!artistListElement || !loadMoreButton) return;

  loadMoreButton.addEventListener('click', loadMoreArtists);
  artistListElement.addEventListener('click', e => {
    const targetBtn = e.target.closest('.learn-more-btn');
    if (targetBtn) {
      const artistId = targetBtn.dataset.artistId;
      // console.log(`Artist clicked: ${artistId}`);
      openModal(artistId);
    }
  });

  loadMoreArtists();
};

document.addEventListener('DOMContentLoaded', initializeArtistModule);

export { initializeArtistModule as initArtistSection };
