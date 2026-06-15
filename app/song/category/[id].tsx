import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { songs } from '../../data/songs';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';

import { bannerImages, preCachedBanners, cacheImages as cacheBannerImages, isImageCached, setCachedImage } from '../../utils/imageCache';


// Konfigurasi posisi gambar untuk setiap kategori
const categoryImageConfig: Record<string, {
  top?: number,
  left?: number,
  scale?: number,
  height?: number,
  opacity?: number
}> = {
  'a': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'b': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'c': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'd': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'e': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'f': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'g': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'h': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'i': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'j': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'k': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'l': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'm': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'n': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'o': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'p': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
  'r': { height: 140, top: 0, scale: 1.0, opacity: 1.0 },
};

// Prakonfigurasi objek banner untuk pra-pemuat
const bannerAssets = {
  a: require('../../../assets/images/banners-webp/banner_a.webp'),
  b: require('../../../assets/images/banners-webp/banner_b.webp'),
  c: require('../../../assets/images/banners-webp/banner_c.webp'),
  d: require('../../../assets/images/banners-webp/banner_d.webp'),
  e: require('../../../assets/images/banners-webp/banner_e.webp'),
  f: require('../../../assets/images/banners-webp/banner_f.webp'),
  g: require('../../../assets/images/banners-webp/banner_g.webp'),
  h: require('../../../assets/images/banners-webp/banner_h.webp'),
  i: require('../../../assets/images/banners-webp/banner_i.webp'),
  j: require('../../../assets/images/banners-webp/banner_j.webp'),
  k: require('../../../assets/images/banners-webp/banner_k.webp'),
  l: require('../../../assets/images/banners-webp/banner_l.webp'),
  m: require('../../../assets/images/banners-webp/banner_m.webp'),
  n: require('../../../assets/images/banners-webp/banner_n.webp'),
  o: require('../../../assets/images/banners-webp/banner_o.webp'),
  p: require('../../../assets/images/banners-webp/banner_p.webp'),
  r: require('../../../assets/images/banners-webp/banner_r.webp'),
  s: require('../../../assets/images/banners-webp/banner_s.webp'),
};

// Cache untuk imej yang sudah dimuat - kini gunakan modul
const cachedBanners: Record<string, any> = {};

// Fungsi untuk pra-memuatkan aset imej - kini gunakan fungsi dari modul cache
async function cacheImages(images: any[]): Promise<any[]> {
  return cacheBannerImages(images);
}

export default function SongCategory() {
  const { id } = useLocalSearchParams();
  const categoryId = typeof id === 'string' ? id.toLowerCase() : '';
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();

  const categoryTitle = t(categoryId) || t('songNotFound');

  const [bannerImage, setBannerImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imageConfig = categoryImageConfig[categoryId] || { height: 140, scale: 1.0 };

  // Filter songs by category - gunakan useMemo untuk mengecegah pengiraan semula
  const categorySongs = useMemo(() => {
    return songs.filter(song =>
      song.id.startsWith(categoryId.toUpperCase()) ||
      song.songNumber === categoryId.toUpperCase()
    );
  }, [categoryId]);

  // Pra-muatkan imej banner - lebih cepat dengan pendekatan cache
  useEffect(() => {
    let isMounted = true;

    async function loadBannerImage() {
      try {
        if (isMounted) setIsLoading(true);

        // Tetapkan imej yang betul tanpa memuatkan semua imej
        const selectedBanner = categoryId in bannerAssets
          ? bannerAssets[categoryId as keyof typeof bannerAssets]
          : require('../../../assets/images/icon.png');

        if (isMounted) {
          // Set banner imej dengan segera
          setBannerImage(selectedBanner);

          // Periksa jika imej sudah dalam cache global atau lokal
          if (cachedBanners[categoryId] || isImageCached(categoryId)) {
            // Imej sudah dalam cache - tidak perlu muat semula
            if (isMounted) setIsLoading(false);
            return;
          }

          // Pra-muatkan hanya imej yang diperlukan dengan timeout pendek
          const loadingPromise = cacheImages([selectedBanner]);
          const timeoutPromise = new Promise(resolve => setTimeout(resolve, 500));

          await Promise.race([loadingPromise, timeoutPromise]);

          // Simpan dalam cache untuk kali berikutnya
          cachedBanners[categoryId] = true;
          setCachedImage(categoryId);
        }
      } catch (error) {
        console.error('Ralat memuat imej banner:', error);
        // Fallback ke ikon jika berlaku ralat
        if (isMounted) {
          setBannerImage(require('../../../assets/images/icon.png'));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBannerImage();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode && styles.darkContainer,
        { backgroundColor: currentColorTheme.background }
      ]}
      edges={Platform.OS === 'ios' ? ['bottom', 'left', 'right'] : undefined}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.headerContainer, isDarkMode && styles.darkHeader]}>
        <View style={styles.bannerOverlayContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
            </View>
          ) : (
            bannerImage && (
              <Image
                source={bannerImage}
                style={[
                  styles.bannerImage,
                  {
                    height: imageConfig.height,
                    transform: [
                      { scale: imageConfig.scale || 1 },
                      { translateY: imageConfig.top || 0 },
                      { translateX: imageConfig.left || 0 }
                    ],
                    opacity: imageConfig.opacity || 1.0,
                  }
                ]}
                resizeMode="cover"
                fadeDuration={100}
                progressiveRenderingEnabled={true}
              />
            )
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/')}
          style={[styles.backButton, Platform.OS === 'ios' && styles.iosBackButton]}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.headerTitle, styles.headerOverlayText]}>{categoryTitle}</Text>
        </View>
      </View>

      <FlatList
        data={categorySongs}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true} // Optimasi prestasi
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={15}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.songItem,
              isDarkMode && styles.darkSongItem,
              { borderBottomColor: currentColorTheme.border }
            ]}
            onPress={() => router.push(`/song/${item.id}` as any)}
          >
            <Text style={[
              styles.songId,
              isDarkMode && styles.darkText,
              { color: isDarkMode ? currentColorTheme.primary : currentColorTheme.accent, fontWeight: 'bold' }
            ]}>{item.id}</Text>
            <Text style={[
              styles.songTitle,
              isDarkMode && styles.darkText,
              { color: isDarkMode ? '#fff' : '#333' }
            ]}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[
              styles.emptyText,
              isDarkMode && styles.darkEmptyText,
              { color: currentColorTheme.textSecondary }
            ]}>
              {t('noSongsFound')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  headerContainer: {
    position: 'relative',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 140,
  },
  bannerOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 140,
    justifyContent: 'center',
    zIndex: 10,
  },
  darkHeader: {
    borderBottomColor: '#333',
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  iosBackButton: {
    top: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    color: '#000',
  },
  headerOverlayText: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bannerContainer: {
    width: '100%',
    height: 170,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
  },
  darkText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  songItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  darkSongItem: {
    borderBottomColor: '#333',
  },
  songId: {
    width: 80,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  songTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  darkEmptyText: {
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
}); 