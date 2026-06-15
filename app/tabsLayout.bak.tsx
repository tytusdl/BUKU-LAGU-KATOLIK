import React, { useMemo, useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { Book, Heart, PlusCircle } from 'lucide-react-native';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { useTheme } from './context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objek terjemahan untuk tab
const translations = {
  'Melayu': {
    home: 'Utama',
    favorites: 'Kegemaran',
    addlyric: 'Tambah Lirik',
  },
  'English': {
    home: 'Home',
    favorites: 'Favorites',
    addlyric: 'Add Lyric',
  }
};

export default function TabLayout() {
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
    
    // Tambah event listener untuk pemeriksaan berkala
    const interval = setInterval(async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('app-language');
        if (storedLanguage && storedLanguage !== currentLanguage) {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error checking language:', error);
      }
    }, 500); // Periksa setiap 500ms
    
    return () => clearInterval(interval);
  }, [currentLanguage]);
  
  // Fungsi untuk mendapatkan terjemahan
  const t = (key: keyof typeof translations['Melayu']) => {
    return translations[currentLanguage as keyof typeof translations][key];
  };
  
  // Gunakan useMemo untuk mengelakkan pengiraan semula pada setiap rendering
  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarStyle: {
      backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#E5E5E5',
      elevation: 0, // Remove shadow on Android
      shadowOpacity: 0, // Remove shadow on iOS
      height: Platform.OS === 'ios' ? 88 : 60,
      paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    },
    tabBarActiveTintColor: isDarkMode ? '#fff' : '#000',
    tabBarInactiveTintColor: isDarkMode ? '#999' : '#666',
    // Mengurangkan animasi untuk mengelakkan lag
    tabBarHideOnKeyboard: true,
    tabBarLabelStyle: {
      fontSize: 12,
      color: isDarkMode ? '#fff' : '#000',
    },
    lazy: false, // Ubah dari true ke false untuk pra-muat semua tab
    tabBarItemStyle: {
      // Flex: 1 untuk memastikan semua tab mengambil ruang yang sama
      flex: 1,
      padding: 0,
    },
    // Matikan animasi peralihan tab untuk meningkatkan prestasi
    animationEnabled: false,
    unmountOnBlur: false, // Ubah ke false untuk mengelakkan kelipan putih semasa peralihan
    detachInactiveScreens: false, // Pastikan skrin tidak dipisahkan
    sceneContainerStyle: { 
      backgroundColor: isDarkMode ? '#1a1a1a' : 'white' // Tetapkan warna latar belakang scene
    },
    freezeOnBlur: false, // Jangan bekukan skrin yang tidak aktif
  }), [isDarkMode]);

  const tabRoutes = [
    {
      name: "index",
      options: {
        title: t('home'),
        tabBarIcon: ({ color, size }: { color: string; size: number }) => <Book size={size} color={color} />,
      }
    },
    {
      name: "favorites",
      options: {
        title: t('favorites'),
        tabBarIcon: ({ color, size }: { color: string; size: number }) => <Heart size={size} color={color} />,
      },
      listeners: {
        tabPress: () => {
          console.log('Tab Kegemaran ditekan');
        }
      }
    },
    {
      name: "addlyric",
      options: {
        title: t('addlyric'),
        tabBarIcon: ({ color, size }: { color: string; size: number }) => <PlusCircle size={size} color={color} />,
      }
    }
  ];

  return (
    <Tabs 
      screenOptions={screenOptions}
      sceneContainerStyle={{
        backgroundColor: isDarkMode ? '#1a1a1a' : 'white'
      }}
    >
      {tabRoutes.map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={route.options}
          listeners={route.listeners}
        />
      ))}
    </Tabs>
  );
}