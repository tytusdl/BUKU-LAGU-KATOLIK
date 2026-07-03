import React, { useEffect, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import { LogBox, View, Text, StyleSheet, Image, Appearance, Alert, Linking, Platform } from 'react-native';
import { FavoritesProvider } from './context/FavoritesContext';
import ThemeProvider, { useTheme } from './context/ThemeContext';
import { MySongsProvider, useMySongs, UserSong } from './context/MySongsContext';
import { MassProvider } from './context/MassContext';
import { LyricsReportProvider } from './context/LyricsReportContext';
import { router } from 'expo-router';
import { Asset } from 'expo-asset';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import * as Clipboard from 'expo-clipboard';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplash from '../components/AnimatedSplash';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import packages from '../package.json';
import { bannerImages, cacheImages } from './utils/imageCache';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


// Aktifkan optimisasi skrin untuk prestasi yang lebih baik
enableScreens();

// Abaikan amaran tertentu yang tidak kritikal
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Komponen baru untuk membungkus Stack dan menetapkan latar belakang akar
function ThemedApp() {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    activateKeepAwakeAsync('themed-app-lock').catch(error => {
      console.warn('Unable to activate keep awake:', error);
    });
    return () => {
      deactivateKeepAwake('themed-app-lock').catch(() => {});
    };
  }, []);

  useEffect(() => {
    const color = isDarkMode ? '#1a1a1a' : '#fff';
    SystemUI.setBackgroundColorAsync(color).catch(error => {
      console.warn(`Failed to set root background color: ${error}`);
    });
  }, [isDarkMode]);

  // UpdateModal telah dibuang: semua update dikendalikan oleh store + ChangelogModal
  // (lihat app/components/ChangelogModal.tsx untuk notis "Apa Yang Baharu?")

  // Gunakan useMemo untuk screenOptions di sini
  const screenOptions = useMemo(() => ({
    headerShown: false,
    animation: 'none' as const,
    contentStyle: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', // Selaraskan backgroundColor di sini juga
    },
  }), [isDarkMode]);

  return (
    <>
      <Stack screenOptions={screenOptions}>
        {/* Letakkan semua skrin Stack di sini */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        {/* Tambah laluan eksplisit jika perlu */}
        <Stack.Screen name="song/category/[id]" />
        <Stack.Screen name="song/[id]/index" />
        <Stack.Screen name="edit-song/[id]" />
        <Stack.Screen name="my-songs" />
      </Stack>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const { addMySongWithId } = useMySongs();
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const [isProcessingLink, setIsProcessingLink] = useState(false);

  useEffect(() => {
    // Platform-specific API keys or other initializations can go here
  }, []);

  // Fungsi untuk memproses deeplink - dipindah ke sini
  const processDeepLink = async (url: string | null) => {
    if (!url || isProcessingLink) {
      if (!url) return;
      if (isProcessingLink) return;
      return false;
    }

    setIsProcessingLink(true);

    try {
      // Periksa skema URL
      if (url.startsWith('lagu-pozoo://savesong')) {


        // Ekstrak parameter pertanyaan 'data'
        const urlParts = url.split('?');
        let encodedData = null;
        if (urlParts.length > 1) {
          const params = new URLSearchParams(urlParts[1]);
          encodedData = params.get('data');
        }

        if (!encodedData) {
          console.error('processDeepLink: Parameter "data" tidak ditemui dalam URL.');
          Alert.alert('Ralat', 'Pautan tidak mengandungi data lagu yang sah.');
          return false;
        }



        try {
          const songData: UserSong = JSON.parse(decodeURIComponent(encodedData));


          if (songData && songData.id && songData.title && songData.lyrics) {

            const result = await addMySongWithId(songData);

            if (result.success) {

              Alert.alert(
                'Lagu Disimpan!',
                `"${songData.title}" telah disimpan ke dalam koleksi Lagu Saya.`,
                [
                  {
                    text: 'Lihat Koleksi Lagu Saya',
                    onPress: () => router.navigate('/my-songs')
                  },
                  { text: 'OK' }
                ]
              );
              return true;
            } else {

              Alert.alert('Gagal Menyimpan', result.message);
              return false;
            }
          } else {
            console.error('processDeepLink: Data lagu tidak lengkap atau tidak sah.', songData);
            Alert.alert('Ralat', 'Data lagu yang diterima tidak lengkap.');
          }
        } catch (error) {
          console.error('processDeepLink: Ralat semasa memproses data lagu:', error);
          Alert.alert('Ralat', 'Format data lagu tidak sah.');
        }
      } else {

      }
    } catch (error) {
      console.error('processDeepLink: Ralat luar jangkaan:', error);
    } finally {
      setIsProcessingLink(false);
    }
    return false;
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Muat sebelum hanya banner utama a sahaja untuk prestasi
        const mainBanners = [
          bannerImages.a
        ];

        // Pratambah secara asinkronus tanpa menunggu
        cacheImages(mainBanners)
          .catch(e => console.warn('Ralat pratambahan:', e));

        // Tunggu fonts dimuatkan
        if (!fontsLoaded) {
          await new Promise(resolve => {
            const check = setInterval(() => {
              if (fontsLoaded) {
                clearInterval(check);
                resolve(undefined);
              }
            }, 50);
          });
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);

  // useEffect untuk mengendalikan Linking dan Clipboard HANYA SEKALI apabila appIsReady
  useEffect(() => {
    if (appIsReady) {


      // 1. Proses Initial URL
      Linking.getInitialURL()
        .then(url => {

          if (url) {
            processDeepLink(url);
          }
        })
        .catch(err => console.error('Initial URL check: Ralat mendapatkan URL awal', err));

      // 2. Tambah Listener untuk URL seterusnya
      const handleOpenURL = (event: { url: string }) => {

        processDeepLink(event.url);
      };

      const subscription = Linking.addEventListener('url', handleOpenURL);

      // 3. Periksa dan Kosongkan Clipboard sekali - TIDAK DIPERLUKAN LAGI
      /*
      const checkClipboard = async () => {
        try {
          const clipboardText = await Clipboard.getStringAsync();
          if (clipboardText && clipboardText.includes('lagu-pozoo://savesong/')) {

            await Clipboard.setStringAsync(''); 
          }
        } catch (error) {
          console.error('Clipboard check: Ralat menyemak clipboard:', error);
        }
      };
      checkClipboard();
      */

      // Fungsi cleanup untuk mengalih keluar listener apabila komponen unmount
      return () => {

        subscription.remove();
      };
    }
  }, [appIsReady, addMySongWithId]); // Jalankan semula jika appIsReady atau addMySongWithId berubah

  // Aplikasi siap, balut ThemedApp dengan Provider
  if (!splashAnimationFinished) {
    return (
      <AnimatedSplash onAnimationFinish={() => setSplashAnimationFinished(true)} />
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <MySongsProvider>
              <MassProvider>
                <LyricsReportProvider>
                  <ThemedApp />
                </LyricsReportProvider>
              </MassProvider>
            </MySongsProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
