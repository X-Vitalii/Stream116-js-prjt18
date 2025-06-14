Team Guide: How to Use api.js

Shared API module is in: src/js/api.js

// again I used 2-artist section as an example //

Import It in your own JS file (e.g., 2-artist.js): import { getArtists,
getAlbumsByArtistId } from './js/api.js';

How to Use Functions

✅ Fetch all artists: const data = await getArtists();
console.log(data.artists); // array of artist objects

✅ Fetch specific artist by ID: const artist = await
getArtistById('65ada54daf9f6d155db47e29'); console.log(artist);

✅ Fetch albums for an artist: const albums = await
getAlbumsByArtistId('65ada54daf9f6d155db47e29'); console.log(albums);

✅ Fetch a single album: const album = await
getAlbumById('65adba2eaf9f6d155db4c1cf'); console.log(album);

💡Tips for Development:

All functions return Promise, so use await.

Use try/catch to handle errors.

Use browser DevTools → Console to check API responses.
