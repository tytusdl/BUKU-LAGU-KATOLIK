import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kunci untuk menyimpan data di AsyncStorage
const MY_SONGS_STORAGE_KEY = 'my_songs';

// Definisi jenis untuk lagu pengguna
export interface UserSong {
  id: string; // Mungkin UUID atau timestamp
  title: string;
  lyrics: string;
  // createdAt ditambah pada v.x.x — optional untuk backward compat dengan
  // lagu lama yang disimpan sebelum field ini wujud. Jika undefined,
  // UI akan treat lagu tersebut sebagai "lagu lama tanpa tarikh".
  createdAt?: number;
  // sourceAdded: 'manual' (user tambah sendiri), 'shared' (paste deeplink atau @MYSONG@)
  // — optional untuk backward compat, default dianggap 'manual' kalau undefined.
  sourceAdded?: 'manual' | 'shared';
}

// Definisi jenis context
type MySongsContextType = {
  mySongs: UserSong[];
  addMySong: (song: Omit<UserSong, 'id'>) => Promise<void>;
  addMySongWithId: (song: UserSong) => Promise<{success: boolean, message: string}>;
  removeMySong: (songId: string) => Promise<void>;
  editMySong: (songId: string, updatedData: Partial<Omit<UserSong, 'id'>>) => Promise<void>;
  addSharedSong: (sharedText: string) => Promise<{success: boolean, message: string}>;
};

// Membuat context dengan nilai default
const MySongsContext = createContext<MySongsContextType>({
  mySongs: [],
  addMySong: async () => {},
  addMySongWithId: async () => ({ success: false, message: 'Context not initialized' }),
  removeMySong: async () => {},
  editMySong: async () => {},
  addSharedSong: async () => ({ success: false, message: 'Context not initialized' }),
});

// Hook untuk menggunakan context
export const useMySongs = () => useContext(MySongsContext);

// Props untuk provider
type MySongsProviderProps = {
  children: ReactNode;
};

// Provider component
export const MySongsProvider = ({ children }: MySongsProviderProps) => {
  const [mySongs, setMySongs] = useState<UserSong[]>([]);

  // Muat lagu pengguna dari AsyncStorage semasa komponen dimuat
  useEffect(() => {
    const loadMySongs = async () => {
      try {
        const storedSongs = await AsyncStorage.getItem(MY_SONGS_STORAGE_KEY);
        if (storedSongs) {
          setMySongs(JSON.parse(storedSongs));
        }
      } catch (error) {
        console.log('Error loading my songs:', error);
      }
    };

    loadMySongs();
  }, []);

  // Simpan perubahan ke AsyncStorage apabila mySongs berubah
  const saveMySongs = async (newSongs: UserSong[]) => {
    try {
      await AsyncStorage.setItem(MY_SONGS_STORAGE_KEY, JSON.stringify(newSongs));
    } catch (error) {
      console.log('Error saving my songs:', error);
    }
  };

  // Tambah lagu baru ke senarai (pengguna tambah sendiri)
  const addMySong = async (songData: Omit<UserSong, 'id'>) => {
    const newSong: UserSong = {
      ...songData,
      id: Date.now().toString(), // Gunakan timestamp sebagai ID baru
      createdAt: Date.now(),
      sourceAdded: songData.sourceAdded ?? 'manual',
    };
    const newSongs = [...mySongs, newSong];
    setMySongs(newSongs);
    await saveMySongs(newSongs);
  };

  // Tambah lagu dengan ID sedia ada (dari deeplink/perkongsian)
  const addMySongWithId = async (songData: UserSong): Promise<{success: boolean, message: string}> => {
    // Periksa jika lagu dengan ID yang sama sudah ada
    const existingSong = mySongs.find(song => song.id === songData.id);
    if (existingSong) {
        return { success: false, message: 'Lagu ini sudah ada dalam koleksi anda' };
    }

    // Tambah lagu baru ke senarai — pastikan createdAt dan sourceAdded diisi
    // walaupun caller (deeplink/share) mungkin tak hantar.
    const enrichedSong: UserSong = {
      ...songData,
      createdAt: songData.createdAt ?? Date.now(),
      sourceAdded: songData.sourceAdded ?? 'shared',
    };
    const newSongs = [...mySongs, enrichedSong];
    setMySongs(newSongs);
    await saveMySongs(newSongs);
    return { success: true, message: 'Lagu berjaya disimpan' };
  };

  // Keluarkan lagu dari senarai
  const removeMySong = async (songId: string) => {
    const newSongs = mySongs.filter(song => song.id !== songId);
    setMySongs(newSongs);
    await saveMySongs(newSongs);
  };

  // Fungsi untuk mengedit lagu sedia ada
  const editMySong = async (songId: string, updatedData: Partial<Omit<UserSong, 'id'>>) => {
    const updatedSongs = mySongs.map(song => {
      if (song.id === songId) {
        return { ...song, ...updatedData };
      }
      return song;
    });
    setMySongs(updatedSongs);
    await saveMySongs(updatedSongs);
  };

  // Fungsi untuk menambah lagu yang dikongsi
  const addSharedSong = async (sharedText: string): Promise<{success: boolean, message: string}> => {
    try {
      // Periksa jika teks dimulai dengan @MYSONG@ (format lagu yang dikongsi)
      if (!sharedText.startsWith('@MYSONG@')) {
        return { success: false, message: 'Bukan format lagu yang sah' };
      }

      // Periksa format - boleh jadi format lama atau format baru yang lebih ringkas
      let sharedId: string;
      let sharedTitle: string;
      let lyrics: string;

      // Format baru: @MYSONG@\nTITLE\n\nLYRICS\n\n@CODE@ID
      if (sharedText.includes('@CODE@')) {
        const contentParts = sharedText.split('@CODE@');
        if (contentParts.length !== 2) {
          return { success: false, message: 'Format kod tidak sah' };
        }

        // Bahagian 1: @MYSONG@\nTITLE\n\nLYRICS\n\n
        const mainContent = contentParts[0].trim();
        // Bahagian 2: ID
        sharedId = contentParts[1].trim();

        // Ekstrak tajuk dan lirik
        const lines = mainContent.split('\n');
        // Baris pertama selepas @MYSONG@ adalah tajuk
        sharedTitle = lines[1].trim();
        
        // Lirik bermula dari baris ketiga
        lyrics = lines.slice(2).join('\n').trim();
      } 
      // Format lama: @MYSONG@\n*TITLE*\n\nLYRICS\n\n@SHARE-CODE@:ID:TITLE
      else if (sharedText.includes('@SHARE-CODE@')) {
        const shareCodeMatch = sharedText.match(/@SHARE-CODE@:([^:]+):(.+)$/);
        if (!shareCodeMatch) {
          return { success: false, message: 'Kod perkongsian tidak ditemui' };
        }

        sharedId = shareCodeMatch[1];
        sharedTitle = shareCodeMatch[2].replace(/&#58;/g, ':');

        // Ekstrak lirik dari teks yang dikongsi
        const contentParts = sharedText.split('@SHARE-CODE@')[0].trim();
        const lyricsStartIndex = contentParts.indexOf('\n\n');
        if (lyricsStartIndex === -1) {
          return { success: false, message: 'Format lirik tidak sah' };
        }
        
        lyrics = contentParts.substring(lyricsStartIndex).trim();
      }
      else {
        return { success: false, message: 'Format lagu tidak dikenali' };
      }

      // Periksa jika lagu dengan ID yang sama sudah ada
      const existingSong = mySongs.find(song => song.id === sharedId);
      if (existingSong) {
        return { success: false, message: 'Lagu ini sudah ada dalam koleksi anda' };
      }

      // Buat objek lagu baru
      const newSharedSong: UserSong = {
        id: sharedId,
        title: sharedTitle,
        lyrics: lyrics,
        createdAt: Date.now(),
        sourceAdded: 'shared',
      };

      // Tambah ke senarai lagu pengguna
      const newSongs = [...mySongs, newSharedSong];
      setMySongs(newSongs);
      await saveMySongs(newSongs);

      return { success: true, message: 'Lagu berjaya disimpan' };
    } catch (error) {
      console.error('Error adding shared song:', error);
      return { success: false, message: 'Ralat semasa menyimpan lagu' };
    }
  };

  const value = {
    mySongs,
    addMySong,
    addMySongWithId,
    removeMySong,
    editMySong,
    addSharedSong,
  };

  return (
    <MySongsContext.Provider value={value}>
      {children}
    </MySongsContext.Provider>
  );
};

export default MySongsProvider; 