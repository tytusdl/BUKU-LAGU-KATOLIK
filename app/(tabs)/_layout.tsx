import { useMemo, useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Book, Heart, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objek terjemahan untuk tab
const translations = {
  'Melayu': {
    home: 'Utama',
    favorites: 'Kegemaran',
    setting: 'Tetapan'
  },
  'English': {
    home: 'Home',
    favorites: 'Favorites',
    setting: 'Settings'
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
    lazy: true, // Gunakan lazy loading untuk tab
    tabBarItemStyle: {
      // Optimasi untuk tab rendering
      padding: 0,
    },
    // Matikan animasi peralihan tab untuk meningkatkan prestasi
    animationEnabled: false,
    unmountOnBlur: true, // Buang tab yang tidak dilihat untuk menjimatkan memori
  }), [isDarkMode]);

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites'),
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: t('setting'),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}