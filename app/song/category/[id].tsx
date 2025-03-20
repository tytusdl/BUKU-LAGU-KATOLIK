import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { songs } from '../../data/songs';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';

const categoryTitles: Record<string, string> = {
  'a': 'HOZOU TONGOBITUA',
  'b': 'HOZOU DI KOSIMABAAN',
  'c': 'HOZOU DO KAPATAKAN',
  'd': 'HOZOU DO KOSOMBUTAN / KOPONONGKOTOHUADAN',
  'e': 'HOZOU DO KOOVIAN / KOPONONGKOTOHUADANAN',
  'f': 'HOZOU ID KAPANTANGAN DI SANGTI MARIA',
  'g': 'HOZOU ID KAPANTANGAN DI SPIRITU SANGTI',
  'h': 'HOZOU ONTOK KAPAGANDADAN',
  'i': 'HOZOU DO KRISMAS',
  'j': 'HOZOU DO KOPONOGITAN',
  'k': 'HOZOU DO PASKA',
  'l': 'HOZOU DO KAAMATAN',
  'm': 'HOZOU NGAAVI DO SUUSUVAI',
  'n': 'HOZOU DO PISASAVAAN',
  'o': 'YOHOU DO ASCENSIO',
  'p': 'DOID SANTA TRINITAS',
  'r': 'LAGU R',
};

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
  a: require('../../../assets/images/banners/banner_a.png'),
  b: require('../../../assets/images/banners/banner_b.png'),
  c: require('../../../assets/images/banners/banner_c.png'),
  d: require('../../../assets/images/banners/banner_d.png'),
  e: require('../../../assets/images/banners/banner_e.png'),
  f: require('../../../assets/images/banners/banner_f.png'),
  g: require('../../../assets/images/banners/banner_g.png'),
  h: require('../../../assets/images/banners/banner_h.png'),
  i: require('../../../assets/images/banners/banner_i.png'),
  j: require('../../../assets/images/banners/banner_j.png'),
  k: require('../../../assets/images/banners/banner_k.png'),
  l: require('../../../assets/images/banners/banner_l.png'),
  m: require('../../../assets/images/banners/banner_m.png'),
  n: require('../../../assets/images/banners/banner_n.png'),
  o: require('../../../assets/images/banners/banner_o.png'),
  p: require('../../../assets/images/banners/banner_p.png'),
  r: require('../../../assets/images/banners/banner_r.png'),
};

// Fungsi untuk pra-memuatkan aset imej - dioptimasi
async function cacheImages(images: any[]): Promise<any[]> {
  // Hanya muat 1 imej pada satu masa
  if (images.length === 0) return [];
  const image = images[0];
  
  if (typeof image === 'string') {
    return [await Image.prefetch(image)];
  } else {
    return [await Asset.fromModule(image).downloadAsync()];
  }
}

export default function SongCategory() {
  const { id } = useLocalSearchParams();
  const categoryId = typeof id === 'string' ? id.toLowerCase() : '';
  const categoryTitle = categoryTitles[categoryId] || 'Kategori Tidak Diketahui';
  const { isDarkMode } = useTheme();
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

  // Pra-muatkan imej banner
  useEffect(() => {
    async function loadBannerImage() {
      try {
        setIsLoading(true);
        
        // Tetapkan imej yang betul tanpa memuatkan semua imej
        const selectedBanner = categoryId in bannerAssets 
          ? bannerAssets[categoryId as keyof typeof bannerAssets] 
          : require('../../../assets/images/icon.png');
        setBannerImage(selectedBanner);
        
        // Pra-muatkan hanya imej yang diperlukan
        await cacheImages([selectedBanner]);
        
      } catch (error) {
        console.error('Ralat memuat imej banner:', error);
        // Fallback ke ikon jika berlaku ralat
        setBannerImage(require('../../../assets/images/icon.png'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadBannerImage();
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
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
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
                fadeDuration={300}
              />
            )
          )}
        </View>
        
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
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
            style={[styles.songItem, isDarkMode && styles.darkSongItem]}
            onPress={() => router.push(`/song/${item.id}` as any)}
          >
            <Text style={[styles.songId, isDarkMode && styles.darkText]}>{item.id}</Text>
            <Text style={[styles.songTitle, isDarkMode && styles.darkText]}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
              Tiada lagu dalam kategori ini
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
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  headerContainer: {
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
  },
  darkSongItem: {
    borderBottomColor: '#333',
  },
  songId: {
    width: 50,
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