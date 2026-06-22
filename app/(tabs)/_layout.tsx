import { useMemo, useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Book, Heart, Settings, Music } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLanguage } from '../context/LanguageContext';

export default function TabLayout() {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();
  const insets = useSafeAreaInsets();


  // Gunakan useMemo untuk mengelakkan pengiraan semula pada setiap rendering
  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarStyle: {
      backgroundColor: currentColorTheme.surface,
      borderTopWidth: 1,
      borderTopColor: currentColorTheme.border,
      elevation: 0, // Remove shadow on Android
      shadowOpacity: 0, // Remove shadow on iOS
      height: Platform.OS === 'android' 
        ? 60 + insets.bottom 
        : (insets.bottom > 0 ? 88 : 60),
      paddingBottom: Platform.OS === 'android' 
        ? 10 + insets.bottom 
        : (insets.bottom > 0 ? 30 : 10),
    },
    tabBarActiveTintColor: currentColorTheme.primary === '#ffffff' ? '#666' : currentColorTheme.primary,
    tabBarInactiveTintColor: currentColorTheme.primary === '#ffffff' ? '#999' : currentColorTheme.textSecondary,
    // Mengurangkan animasi untuk mengelakkan lag
    tabBarHideOnKeyboard: true,
    tabBarLabelStyle: {
      fontSize: 12,
      color: currentColorTheme.text,
    },
    lazy: false, // Ubah dari true ke false untuk pra-muat semua tab
    tabBarItemStyle: {
      // Optimasi untuk tab rendering
      padding: 0,
    },
    // Matikan animasi peralihan tab untuk meningkatkan prestasi
    animationEnabled: false,
    unmountOnBlur: false, // Ubah ke false untuk mengelakkan kelipan putih semasa peralihan
    detachInactiveScreens: false, // Pastikan skrin tidak dipisahkan
    freezeOnBlur: true, // Bekukan skrin yang tidak aktif untuk kurangkan memori
  }), [isDarkMode, currentLanguage, currentColorTheme, insets]);

  return (
    <Tabs
      screenOptions={screenOptions}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites_tab'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="misa"
        options={{
          title: t('misa_tab'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Music size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: t('setting'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}