import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useMySongs, UserSong } from '../context/MySongsContext';
import { songs, Song } from '../data/songs';

type FavoriteSongItem = (Song | UserSong) & { isUserSong: boolean };
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { useLanguage } from '../context/LanguageContext';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const { isDarkMode, currentColorTheme } = useTheme();
  const { mySongs } = useMySongs();
  const { currentLanguage, t } = useLanguage();
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const favoriteSongs = useMemo(() => {
    const allFavoriteSongs = favorites.map((id: string) => {
      const userSong = mySongs.find((song: UserSong) => song.id === id);
      if (userSong) {
        return { ...userSong, isUserSong: true };
      }
      const defaultSong = songs.find((song: Song) => song.id === id);
      if (defaultSong) {
        return { ...defaultSong, isUserSong: false };
      }
      return null;
    }).filter(Boolean) as FavoriteSongItem[];

    return allFavoriteSongs;
  }, [favorites, mySongs, songs]);

  const renderSongItem = ({ item }: { item: FavoriteSongItem }) => (
    <TouchableOpacity
      style={[
        styles.songItem,
        isDarkMode && styles.darkSongItem,
        { borderBottomColor: currentColorTheme.border }
      ]}
      onPress={() => {
        router.push(`/song/${item.id}?isUserSong=${item.isUserSong}&fromFavorites=true`);
      }}
    >
      <View style={styles.songInfo}>
        <Text
          style={[
            styles.songId,
            isDarkMode && styles.darkText,
            item.isUserSong && styles.userSongIdentifier,
            { color: item.isUserSong ? currentColorTheme.textSecondary : (isDarkMode ? currentColorTheme.primary : currentColorTheme.accent), fontWeight: 'bold' }
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.isUserSong ? "LS" : item.id}
        </Text>
        <Text style={[
          styles.songTitle,
          isDarkMode && styles.darkText,
          { color: isDarkMode ? '#fff' : '#333' }
        ]}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.container,
        isDarkMode && styles.darkContainer,
        { backgroundColor: currentColorTheme.background }
      ]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Text style={[
        styles.title,
        isDarkMode && styles.darkText
      ]}>{t('favorites')}</Text>

      {favoriteSongs.length > 0 ? (
        <FlatList
          data={favoriteSongs}
          renderItem={renderSongItem}
          keyExtractor={(item: FavoriteSongItem) => item?.id || String(Math.random())}
          contentContainerStyle={styles.listContainer}
          removeClippedSubviews={false}
          maxToRenderPerBatch={25}
          initialNumToRender={20}
          windowSize={10}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[
            styles.emptyText,
            isDarkMode && styles.darkEmptyText,
            { color: currentColorTheme.textSecondary }
          ]}>
            {t('noFavorites')}
          </Text>
          <Text style={[
            styles.instructionText,
            isDarkMode && styles.darkInstructionText,
            { color: currentColorTheme.textSecondary }
          ]}>
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
    fontFamily: 'Inter-Bold',
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
    flexShrink: 1,
  },
  userSongIdentifier: {
    fontWeight: 'normal',
    fontStyle: 'italic',
    color: '#666',
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