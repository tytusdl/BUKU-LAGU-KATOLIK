import React, { useEffect, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { enableScreens } from 'react-native-screens';
import { LogBox, View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnimatedSplashScreen } from '../components/AnimatedSplashScreen';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { Asset } from 'expo-asset';

// Aktifkan optimisasi skrin untuk prestasi yang lebih baik
enableScreens();

// Abaikan amaran tertentu yang tidak kritikal
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Memastikan splash screen natif tetap tampil sehingga kita siap
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('Gagal menetapkan preventAutoHideAsync');
});

// Objek banner untuk preload
const bannerImages = {
  a: require('../assets/images/banners/banner_a.png'),
  b: require('../assets/images/banners/banner_b.png'),
  c: require('../assets/images/banners/banner_c.png'),
  d: require('../assets/images/banners/banner_d.png'),
  e: require('../assets/images/banners/banner_e.png'),
  f: require('../assets/images/banners/banner_f.png'),
  g: require('../assets/images/banners/banner_g.png'),
  h: require('../assets/images/banners/banner_h.png'),
  i: require('../assets/images/banners/banner_i.png'),
  j: require('../assets/images/banners/banner_j.png'),
  k: require('../assets/images/banners/banner_k.png'),
  l: require('../assets/images/banners/banner_l.png'),
  m: require('../assets/images/banners/banner_m.png'),
  n: require('../assets/images/banners/banner_n.png'),
  o: require('../assets/images/banners/banner_o.png'),
  p: require('../assets/images/banners/banner_p.png'),
  r: require('../assets/images/banners/banner_r.png'),
};

// Fungsi untuk pra-memuatkan aset imej - kurangkan jumlah pratambahan
async function cacheImages(images: Array<string | number>): Promise<any[]> {
  return Promise.all(images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  }));
}

// Komponen untuk navigasi utama dengan akses kepada tema
function RootLayoutNav() {
  const { isDarkMode } = useTheme();
  
  // Gunakan useMemo untuk mengelakkan pengiraan semula pada setiap rendering
  const screenOptions = useMemo<NativeStackNavigationOptions>(() => ({
    headerShown: false,
    animation: 'none', // Gunakan 'none' untuk matikan animasi
    contentStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : 'white' },
    gestureEnabled: true, // Aktifkan gesture untuk back button
    gestureDirection: 'horizontal',
    fullScreenGestureEnabled: true, // Membolehkan swipe back dari mana-mana tempat pada skrin
  }), [isDarkMode]);

  return (
    <>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        // Tidak perlu pratambahkan semua banner - aset akan dimuat bila diperlukan
        console.log('Menyediakan aplikasi...');
        
        // Tunda lebih singkat
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Aplikasi telah siap dimuatkan
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onAnimationComplete = () => {
    console.log('Animasi splash selesai');
    setSplashAnimationComplete(true);
    // Pastikan splash screen natif disembunyikan
    SplashScreen.hideAsync().catch(e => console.log('Gagal menyembunyikan splash screen:', e));
  };

  // Jika aplikasi belum siap, pertahankan layar splash natif
  if (!appIsReady) {
    return null;
  }

  // Jika aplikasi siap tetapi animasi splash belum selesai, tampilkan custom splash
  if (!splashAnimationComplete) {
    return <AnimatedSplashScreen onAnimationComplete={onAnimationComplete} />;
  }

  // Aplikasi siap dan animasi splash telah selesai
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <RootLayoutNav />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
