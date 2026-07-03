// Recent shares history — track link lagu yang dikongsi tapi belum disimpan.
// Disimpan dalam AsyncStorage supaya survive app restart.

import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SHARES_KEY = 'recent_song_shares';
const MAX_ENTRIES = 10;

export interface RecentShare {
  id: string;        // Song ID — same as UserSong.id
  title: string;
  lyrics: string;
  rawLink: string;   // Full URL — boleh re-process kalau perlu
  addedAt: number;   // timestamp
}

/**
 * Add a share to recent history. Kalau ID sama dah ada, kemas kini timestamp
 * supaya naik ke atas.
 */
export async function addRecentShare(share: Omit<RecentShare, 'addedAt'>): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_SHARES_KEY);
    const list: RecentShare[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(s => s.id !== share.id);
    const next: RecentShare[] = [{ ...share, addedAt: Date.now() }, ...filtered].slice(0, MAX_ENTRIES);
    await AsyncStorage.setItem(RECENT_SHARES_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/**
 * Remove single entry (cth selepas berjaya save).
 */
export async function removeRecentShare(id: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_SHARES_KEY);
    const list: RecentShare[] = raw ? JSON.parse(raw) : [];
    const next = list.filter(s => s.id !== id);
    await AsyncStorage.setItem(RECENT_SHARES_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/**
 * Remove all entries.
 */
export async function clearRecentShares(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RECENT_SHARES_KEY);
  } catch {
    // ignore
  }
}

/**
 * Load all entries (newest first).
 */
export async function loadRecentShares(): Promise<RecentShare[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_SHARES_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as RecentShare[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Default export untuk elak expo-router route warning
export default loadRecentShares;
