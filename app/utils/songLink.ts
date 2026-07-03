// Shared helpers untuk proses URL lagu-pozoo://savesong
// Digunakan oleh:
//  - app/_layout.tsx (deep link)
//  - app/my-songs.tsx (paste modal)
//  - app/components/SharedLinkPreviewModal.tsx (auto-detect clipboard)

import { UserSong } from '../context/MySongsContext';

export type ParseResult =
  | { success: true; song: UserSong }
  | { success: false; error: 'notALink' | 'noData' | 'invalidData' | 'parseError'; message: string };

/**
 * Parse URL lagu-pozoo://savesong?data=<encoded-json>
 * Returns UserSong (id, title, lyrics) atau error dengan sebab.
 *
 * Nota: `sourceAdded` dan `createdAt` tak di-set di sini — caller yang tentukan
 * (default 'shared' untuk import dari link/QR).
 */
export function parseSongShareLink(input: string): ParseResult {
  const trimmed = (input ?? '').trim();
  if (!trimmed) {
    return { success: false, error: 'notALink', message: 'Pautan kosong.' };
  }
  if (!trimmed.startsWith('lagu-pozoo://savesong')) {
    return { success: false, error: 'notALink', message: 'Bukan pautan lagu yang sah.' };
  }

  const urlParts = trimmed.split('?');
  if (urlParts.length < 2) {
    return { success: false, error: 'noData', message: 'Pautan tidak mengandungi data lagu.' };
  }

  const params = new URLSearchParams(urlParts[1]);
  const encodedData = params.get('data');
  if (!encodedData) {
    return { success: false, error: 'noData', message: 'Pautan tidak mengandungi data lagu.' };
  }

  let songData: UserSong;
  try {
    songData = JSON.parse(decodeURIComponent(encodedData));
  } catch (e) {
    return { success: false, error: 'parseError', message: 'Format data lagu tidak sah.' };
  }

  if (!songData || !songData.id || !songData.title || !songData.lyrics) {
    return { success: false, error: 'invalidData', message: 'Data lagu tidak lengkap.' };
  }

  return {
    success: true,
    song: {
      id: songData.id,
      title: songData.title,
      lyrics: songData.lyrics,
    },
  };
}

// Default export untuk elak expo-router route warning (file ni bukan route, tapi
// tinggal dalam app/ folder sebab convention codebase). Re-export main parser.
export default parseSongShareLink;
