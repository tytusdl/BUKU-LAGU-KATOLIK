import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../data/songs/songs';

// Kunci untuk menyimpan data di AsyncStorage
const FAVORITES_STORAGE_KEY = 'favorites';

// Definisi jenis context
type FavoritesContextType = {
  favorites: string[];
  addToFavorites: (songId: string) => Promise<void>;
  removeFromFavorites: (songId: string) => Promise<void>;
  isFavorite: (songId: string) => boolean;
};

// Membuat context dengan nilai default
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: () => false,
});

// Hook untuk menggunakan context
export const useFavorites = () => useContext(FavoritesContext);

// Props untuk provider
type FavoritesProviderProps = {
  children: ReactNode;
};

// Provider component
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Muat favorites dari AsyncStorage semasa komponen dimuat
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Simpan perubahan ke AsyncStorage apabila favorites berubah
  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.log('Error saving favorites:', error);
    }
  };

  // Tambah lagu ke favorites
  const addToFavorites = async (songId: string) => {
    const newFavorites = [...favorites, songId];
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  // Keluarkan lagu dari favorites
  const removeFromFavorites = async (songId: string) => {
    const newFavorites = favorites.filter(id => id !== songId);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  // Periksa sama ada lagu adalah kegemaran
  const isFavorite = (songId: string) => favorites.includes(songId);

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider; 