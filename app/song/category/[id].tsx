import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { songIndex } from '../../data/songs/songIndex';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { bannerImages } from '../../utils/imageCache';

export default function SongCategory() {
  const { id } = useLocalSearchParams();
  const categoryId = typeof id === 'string' ? id.toLowerCase() : '';
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();

  const categoryTitle = t(categoryId) || t('songNotFound');

  const categorySongs = useMemo(() => {
    return songIndex.filter(song =>
      song.id.startsWith(categoryId.toUpperCase()) ||
      song.songNumber === categoryId.toUpperCase()
    );
  }, [categoryId]);

  const bannerImage = categoryId in bannerImages
    ? bannerImages[categoryId as keyof typeof bannerImages]
    : require('../../../assets/images/icon.png');

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
          <Image
            source={bannerImage}
            style={[styles.bannerImage, { height: 140 }]}
            resizeMode="cover"
            fadeDuration={0}
          />
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
        removeClippedSubviews={true}
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
});