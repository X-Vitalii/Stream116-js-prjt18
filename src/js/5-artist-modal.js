import { getArtistById } from './api.js';
import spritePath from '../img/icons.svg?url';

const modalSection = document.querySelector('.artist-modal-backdrop');
const modalOverlay = modalSection.querySelector('.artist-modal-window');
const modalContent = modalSection.querySelector('.artist-modal-content');
const closeModalBtn = modalSection.querySelector('.artist-modal-close-btn');
const loader = document.getElementById('artistModalLoader');

function handleEscKey(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

function handleOverlayClick(event) {
  if (event.target === modalSection) {
    closeModal();
  }
}

function createInfoBlock(title, content) {
  if (!content) return null;

  const box = document.createElement('div');
  box.className = 'folder-box';

  const titleEl = document.createElement('h3');
  titleEl.className = 'years-title';
  titleEl.textContent = title;

  const contentEl = document.createElement('p');
  contentEl.className = 'years-item';
  contentEl.textContent = content;

  box.appendChild(titleEl);
  box.appendChild(contentEl);
  return box;
}

function createGenreTags(genres) {
  if (!genres || !Array.isArray(genres) || genres.length === 0) return null;

  const container = document.createElement('div');
  container.className = 'janr';

  genres.forEach(genre => {
    const tag = document.createElement('p');
    tag.className = 'janr-item';
    tag.textContent = genre;
    container.appendChild(tag);
  });

  return container;
}

function formatDuration(duration) {
  if (!duration || isNaN(duration)) return '--:--';

  // Convert duration from milliseconds to seconds
  const seconds = duration > 1000 ? Math.round(duration / 1000) : duration;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function transformTracksToAlbums(tracksList) {
  if (!Array.isArray(tracksList) || tracksList.length === 0) {
    return [];
  }

  const albumsMap = new Map();

  tracksList.forEach(track => {
    if (!track.strAlbum) return;

    if (!albumsMap.has(track.strAlbum)) {
      albumsMap.set(track.strAlbum, {
        strAlbum: track.strAlbum,
        tracks: [],
      });
    }

    // Transform track data and handle YouTube URL
    const youtubeUrl =
      track.movie ||
      (track.strTrackThumb && track.strTrackThumb.replace('/preview', '')) ||
      null;

    albumsMap.get(track.strAlbum).tracks.push({
      strTrack: track.strTrack,
      intDuration: track.intDuration,
      strMusicVid: youtubeUrl,
    });
  });

  return Array.from(albumsMap.values());
}

function createTrackList(tracks) {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return null;
  }

  const container = document.createElement('div');
  container.className = 'tracks-container';

  // Create header
  const header = document.createElement('ul');
  header.className = 'track-name';
  header.innerHTML = `
    <li class="name-column-item item-col-1">Track</li>
    <li class="name-column-item item-col-2">Time</li>
    <li class="name-column-item item-col-3">Link</li>
  `;
  container.appendChild(header);

  // Create tracks
  tracks.forEach((track, index) => {
    const trackRow = document.createElement('ul');
    trackRow.className = 'track-name';

    const nameCol = document.createElement('li');
    nameCol.className = 'track-name-item item-col-1';
    nameCol.textContent = track.strTrack || 'Untitled';

    const timeCol = document.createElement('li');
    timeCol.className = 'track-name-item item-col-2';
    timeCol.textContent = formatDuration(track.intDuration);

    const linkCol = document.createElement('li');
    linkCol.className = 'track-name-item item-col-3';

    if (track.strMusicVid) {
      const link = document.createElement('a');
      link.href = track.strMusicVid;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = `Watch ${track.strTrack} on YouTube`;
      link.innerHTML = `
        <svg class="icon-youtube" width="24" height="24">
          <use href="${spritePath}#icon-Youtube"></use>
        </svg>
      `;

      link.className = 'youtube-link';

      linkCol.appendChild(link);
    }

    trackRow.appendChild(nameCol);
    trackRow.appendChild(timeCol);
    trackRow.appendChild(linkCol);
    container.appendChild(trackRow);
  });

  return container;
}

function createAlbumSection(albums) {
  if (!Array.isArray(albums) || albums.length === 0) {
    return null;
  }

  const container = document.createElement('div');
  container.className = 'album-box';

  const title = document.createElement('h2');
  title.className = 'album-title';
  title.textContent = 'Albums';
  container.appendChild(title);

  const albumsContainer = document.createElement('div');
  albumsContainer.className = 'albums-grid';

  albums.forEach(album => {
    const albumBox = document.createElement('div');
    albumBox.className = 'album-title-box';

    const albumTitle = document.createElement('h3');
    albumTitle.className = 'name-album';
    albumTitle.textContent = album.strAlbum || 'Untitled Album';
    albumBox.appendChild(albumTitle);

    if (album.tracks && Array.isArray(album.tracks)) {
      const trackList = createTrackList(album.tracks);
      if (trackList) {
        albumBox.appendChild(trackList);
      }
    }

    container.appendChild(albumBox);
  });

  return container;
}

function renderModalContent(data) {
  modalContent.innerHTML = '';

  // Transform tracksList into albums structure
  const albumsData = transformTracksToAlbums(data.tracksList);

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close-btn';
  closeBtn.type = 'button';
  closeBtn.innerHTML = `
    <svg class="icon" width="24" height="24">
      <use href="${spritePath}#icon-close"></use>
    </svg>
  `;
  /*----------------------------------*/

  closeBtn.addEventListener('click', e => {
    closeModal();
  });
  /*----------------------------------*/
  modalContent.appendChild(closeBtn);

  // Add artist name
  const titleName = document.createElement('h2');
  titleName.className = 'title-name';
  titleName.textContent = data.strArtist;
  modalContent.appendChild(titleName);

  // Create artist info container
  const artistInfoContainer = document.createElement('div');
  artistInfoContainer.className = 'artist-info-container';

  // Add artist photo
  if (data.strArtistThumb) {
    const photo = document.createElement('img');
    photo.className = 'artist-photo';
    photo.src = data.strArtistThumb;
    photo.alt = data.strArtist;
    artistInfoContainer.appendChild(photo);
  }

  // Create folder for artist info
  const folder = document.createElement('div');
  folder.className = 'folder';

  // Create container for key info (first 4 items)
  const keyInfoContainer = document.createElement('div');
  keyInfoContainer.className = 'key-info-container';

  // Add key information blocks
  const keyInfoBlocks = [
    {
      title: 'Years active',
      content: data.intFormedYear ? `${data.intFormedYear}–present` : undefined,
    },
    {
      title: 'Sex',
      content: data.strGender,
    },
    {
      title: 'Members',
      content: data.intMembers || '1',
    },
    {
      title: 'Country',
      content: data.strCountry,
    },
  ];

  keyInfoBlocks.forEach(block => {
    const infoBlock = createInfoBlock(block.title, block.content);
    if (infoBlock) {
      keyInfoContainer.appendChild(infoBlock);
    }
  });

  folder.appendChild(keyInfoContainer);

  // Add biography separately
  const biographyBlock = createInfoBlock('Biography', data.strBiographyEN);
  if (biographyBlock) {
    biographyBlock.className = 'folder-box biography';
    folder.appendChild(biographyBlock);
  }

  // Add genres
  if (data.genres && Array.isArray(data.genres)) {
    const genresTags = createGenreTags(data.genres);
    if (genresTags) {
      folder.appendChild(genresTags);
    }
  }

  // Add folder to artist info container
  artistInfoContainer.appendChild(folder);
  modalContent.appendChild(artistInfoContainer);

  // Add albums section
  if (albumsData.length > 0) {
    const albumsSection = createAlbumSection(albumsData);
    if (albumsSection) {
      modalContent.appendChild(albumsSection);
    }
  } else {
    console.log('No albums data found or invalid format');
  }
}

async function openModal(id) {
  try {
    modalSection.classList.remove('visually-hidden');
    // Show loader
    document.body.style.overflow = 'hidden';
    if (loader) {
      loader.style.display = 'block';
    }
    // Fetch data
    const data = await getArtistById(id);
    // Hide loader
    if (loader) {
      loader.style.display = 'none';
    }
    // Render content
    renderModalContent(data);
    document.addEventListener('keydown', handleEscKey);
    modalSection.addEventListener('click', handleOverlayClick);
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
  } catch (error) {
    console.error('Error opening modal:', error);
    closeModal();
  }
}

function closeModal() {
  document.body.style.overflow = '';
  modalSection.classList.add('visually-hidden');
  document.removeEventListener('keydown', handleEscKey);
  modalSection.removeEventListener('click', handleOverlayClick);
  if (closeModalBtn) {
    closeModalBtn.removeEventListener('click', closeModal);
  }
  modalContent.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  window.modalSection = modalSection;
  window.modalOverlay = modalOverlay;
  window.modalContent = modalContent;
  window.closeModalBtn = closeModalBtn;
  window.loader = loader;
});

export { openModal };
