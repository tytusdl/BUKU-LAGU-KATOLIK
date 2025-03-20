import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { songs } from '../data/songs';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objek terjemahan
const translations = {
  'Melayu': {
    favorites: 'Lagu Kegemaran',
    noFavorites: 'Anda belum menambah sebarang lagu ke senarai kegemaran.',
    addFavoritesInstruction: 'Tekan ikon ♥ pada halaman detail lagu untuk menambahkannya ke senarai kegemaran.'
  },
  'English': {
    favorites: 'Favorite Songs',
    noFavorites: 'You have not added any songs to your favorites list yet.',
    addFavoritesInstruction: 'Tap the ♥ icon on a song detail page to add it to your favorites.'
  }
};

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const { isDarkMode } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState('Melayu');
  
  // Dapatkan bahasa yang disimpan ketika komponen dimuat
  useEffect(() => {
    const getLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('app-language');
        if (storedLanguage) {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error retrieving language:', error);
      }
    };
    
    getLanguage();
  }, []);
  
  // Periksa bahasa semasa ketika skrin fokus
  useEffect(() => {
    const checkLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('app-language');
        if (storedLanguage && storedLanguage !== currentLanguage) {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error checking language:', error);
      }
    };
    
    const interval = setInterval(checkLanguage, 500);
    
    return () => clearInterval(interval);
  }, [currentLanguage]);
  
  // Fungsi untuk mendapatkan terjemahan
  const t = (key: keyof typeof translations['Melayu']) => {
    return translations[currentLanguage as keyof typeof translations][key];
  };
  
  // Dapatkan maklumat lagu lengkap berdasarkan ID kegemaran
  const favoriteSongs = favorites.map(id => 
    songs.find(song => song.id === id)
  ).filter(Boolean); // Filter undefined jika lagu tidak ditemui
  
  // Render item lagu
  const renderSongItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.songItem, isDarkMode && styles.darkSongItem]}
      onPress={() => router.push(`/song/${item.id}`)}
    >
      <View style={styles.songInfo}>
        <Text style={[styles.songId, isDarkMode && styles.darkText]}>{item.id}</Text>
        <Text style={[styles.songTitle, isDarkMode && styles.darkText]}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('favorites')}</Text>
      
      {favoriteSongs.length > 0 ? (
        <FlatList
          data={favoriteSongs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item?.id || String(Math.random())}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
            {t('noFavorites')}
          </Text>
          <Text style={[styles.instructionText, isDarkMode && styles.darkInstructionText]}>
            {t('addFavoritesInstruction')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  songItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkSongItem: {
    borderBottomColor: '#333',
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginRight: 12,
    minWidth: 40,
  },
  songTitle: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  darkEmptyText: {
    color: '#aaa',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
  },
  darkInstructionText: {
    color: '#777',
  },
});