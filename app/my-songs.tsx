import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal,
  TextInput, Button, Alert, Platform, ToastAndroid, Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowLeft, Link, HelpCircle, Link2, Heart, Share as ShareIcon, X } from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import { useMySongs, UserSong } from './context/MySongsContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useFavorites } from './context/FavoritesContext';
import { translations } from '../src/translations'; // Updated import path
import { useLanguage } from './context/LanguageContext';

// Path mungkin perlu disemak semula jika diletak di utils
// const headerImage = require('../assets/images/banners-webp/banner_s.webp'); // Guna banner_s.webp? - SALAH
// Guna imej kategori asal
// const headerImage = require('../assets/images/categories-webp/category_s.webp');

// Guna banner_s.webp untuk header skrin Lagu Saya
const headerImage = require('../assets/images/banners-webp/banner_s.webp');

export default function MySongsScreen() {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { mySongs, addMySongWithId } = useMySongs();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isPasteModalVisible, setIsPasteModalVisible] = useState(false);
  const [pastedLink, setPastedLink] = useState('');
  const [isSavingPasted, setIsSavingPasted] = useState(false);
  const { currentLanguage, t } = useLanguage();
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Periksa jika lagu baru sahaja dipadam
  useEffect(() => {
    const checkSongDeleted = async () => {
      try {
        const songDeleted = await AsyncStorage.getItem('song_deleted');
        if (songDeleted === 'true') {
          // Reset tanda pemadaman
          await AsyncStorage.removeItem('song_deleted');
          console.log('Pemadaman lagu selesai');
        }
      } catch (error) {
        console.error('Error memeriksa status pemadaman:', error);
      }
    };

    checkSongDeleted();
  }, []);

  const handleAddSong = () => {
    console.log('Navigasi ke skrin tambah lagu');
    router.push('/add-song');
  };

  // Fungsi untuk modal tampal pautan
  const openPasteModal = () => {
    setPastedLink('');
    setIsSavingPasted(false);
    setIsPasteModalVisible(true);
  };

  const closePasteModal = () => {
    setIsPasteModalVisible(false);
  };

  const handlePasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    setPastedLink(text);
  };

  const handleSavePastedLink = async () => {
    if (!pastedLink || isSavingPasted) return;
    const urlToProcess = pastedLink.trim();
    console.log(`handleSavePastedLink: Mencuba memproses pautan: ${urlToProcess}`);
    setIsSavingPasted(true);

    try {
      if (urlToProcess.startsWith('lagu-pozoo://savesong')) {
        // Ekstrak parameter pertanyaan 'data'
        const urlParts = urlToProcess.split('?');
        let encodedData = null;
        if (urlParts.length > 1) {
          const params = new URLSearchParams(urlParts[1]);
          encodedData = params.get('data');
        }

        if (!encodedData) {
          console.error('handleSavePastedLink: Parameter "data" tidak ditemui dalam URL.');
          Alert.alert(t('linkErrorTitle'), t('linkErrorNoData'));
          setIsSavingPasted(false);
          return;
        }

        console.log(`handleSavePastedLink: Data terenkod dari parameter: ${encodedData}`);
        try {
          const songData: UserSong = JSON.parse(decodeURIComponent(encodedData));
          if (songData && songData.id && songData.title && songData.lyrics) {
            const result = await addMySongWithId(songData);
            if (result.success) {
              Alert.alert(t('saveSuccessTitle'), t('saveSuccessMessage').replace('{songTitle}', songData.title));
              closePasteModal();
            } else {
              Alert.alert(t('saveFailTitle'), result.message);
            }
          } else {
            Alert.alert(t('linkErrorTitle'), t('linkErrorInvalidData'));
          }
        } catch (error) {
          console.error('Ralat memproses data pautan:', error);
          Alert.alert(t('linkErrorTitle'), t('linkErrorParsing'));
        }
      } else {
        Alert.alert(t('linkErrorTitle'), t('linkErrorInvalid'));
      }
    } catch (error) {
      console.error('Ralat luar jangkaan semasa menyimpan pautan:', error);
      Alert.alert(t('linkErrorTitle'), t('linkErrorSaving'));
    } finally {
      setIsSavingPasted(false);
    }
  };

  // Fungsi baru untuk menyalin pautan kongsi dari senarai
  const handleCopyLinkPress = async (songToCopy: UserSong) => {
    if (!songToCopy) return;

    const songData = {
      id: songToCopy.id,
      title: songToCopy.title,
      lyrics: songToCopy.lyrics
    };
    const encodedData = encodeURIComponent(JSON.stringify(songData));
    const encodedTitle = encodeURIComponent(songToCopy.title);
    const link = `lagu-pozoo://savesong?title=${encodedTitle}&data=${encodedData}`;

    try {
      await Clipboard.setStringAsync(link);
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('copyLinkSuccess'), ToastAndroid.SHORT);
      } else {
        // Di skrin senarai, lebih baik guna Toast juga jika boleh, atau Alert ringkas.
        // Menggunakan Alert di sini untuk konsisten dengan kod asal.
        Alert.alert(t('saveSuccessTitle'), t('copyLinkSuccess'));
      }
      console.log('Share link copied from list:', link);
    } catch (error) {
      console.error('Error copying share link from list:', error);
      Alert.alert(t('linkErrorTitle'), t('copyLinkError'));
    }
  };

  // Fungsi baru untuk kongsi teks biasa dari senarai
  const handleShareSongPress = async (songToShare: UserSong) => {
    if (!songToShare) return;

    const shareText = `${songToShare.title.toUpperCase()}\n\n${songToShare.lyrics}`;
    const shareTitle = `${songToShare.title.toUpperCase()}`;

    try {
      console.log('Sharing plain text from list:', shareTitle);
      await Share.share({
        message: shareText,
        title: shareTitle,
      });
      console.log('Share.share call successful from list');
    } catch (error) {
      console.error('Error sharing song from list:', error);
      Alert.alert(t('alertError'), t('alertFailedSave')); // Guna alertFailedSave
    }
  };

  // Fungsi untuk toggle kegemaran
  const handleToggleFavorite = async (songId: string) => {
    if (isFavorite(songId)) {
      await removeFromFavorites(songId);
    } else {
      await addToFavorites(songId);
    }
    // Mungkin perlu refresh state atau UI jika perlu (bergantung pada implementasi useFavorites)
  };

  // Fungsi untuk toggle menu FAB
  const toggleFabMenu = () => {
    setIsFabMenuOpen(!isFabMenuOpen);
  };

  // Pindahkan logik handleAddSong ke fungsi berasingan jika perlu
  const navigateToAddSong = () => {
    console.log('Navigasi ke skrin tambah lagu dari menu FAB');
    router.push('/add-song');
    setIsFabMenuOpen(false); // Tutup menu selepas navigasi
  };

  const openPasteModalFromFab = () => {
    openPasteModal();
    setIsFabMenuOpen(false);
  };

  const showHelpAlertFromFab = () => {
    Alert.alert(
      t('shareHelpTitle'),
      t('shareHelpMessage'),
      [{ text: t('shareHelpConfirm') }],
      { cancelable: true }
    );
    setIsFabMenuOpen(false);
  };

  const renderSongItem = ({ item }: { item: UserSong }) => {
    const songIsFavorite = isFavorite(item.id);

    return (
      <View style={[
        styles.songCard,
        isDarkMode && styles.songCardDark,
        { backgroundColor: currentColorTheme.surface, borderColor: currentColorTheme.border }
      ]}>
        <TouchableOpacity
          onPress={() => router.push(`/song/${item.id}?isUserSong=true`)}
          style={styles.songTitleContainer}
        >
          <Text style={[
            styles.songTitle,
            isDarkMode && styles.textDark,
            { color: isDarkMode ? '#fff' : '#333' }
          ]}>{item.title}</Text>
        </TouchableOpacity>
        <View style={styles.iconButtonsContainer}>
          <TouchableOpacity
            onPress={() => handleToggleFavorite(item.id)}
            style={styles.iconButton}
          >
            <Heart
              size={20}
              color={songIsFavorite ? '#E22D2D' : (isDarkMode ? '#aaa' : '#666')}
              fill={songIsFavorite ? '#E22D2D' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShareSongPress(item)}
            style={styles.iconButton}
          >
            <ShareIcon size={20} color={isDarkMode ? '#a0c4ff' : '#3498db'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCopyLinkPress(item)}
            style={styles.iconButton}
          >
            <Link2 size={20} color={isDarkMode ? '#a0c4ff' : '#3498db'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      isDarkMode && styles.containerDark,
      { backgroundColor: currentColorTheme.background }
    ]}>
      <View style={[styles.headerContainer, isDarkMode && styles.darkHeader]}>
        <View style={styles.bannerImageContainer}>
          <Image
            source={headerImage}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, styles.headerOverlayText]}>{t('mySongsCategoryTitle')}</Text>
        </View>
      </View>
      <FlatList
        data={mySongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[
            styles.emptyText,
            isDarkMode && styles.textDarkMuted,
            { color: currentColorTheme.textSecondary }
          ]}>{t('noSongsFound')}</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.fabContainer}>
        {/* Menu FAB Tambahan (muncul bila isFabMenuOpen true) */}
        {isFabMenuOpen && (
          <>
            {/* Pindahkan butang Tambah Lagu ke dalam menu */}
            <View style={styles.fabRowContainer}>
              <Text style={[styles.externalFabLabel, isDarkMode && styles.externalFabLabelDark]}>{t('addSongButtonLabel')}</Text>
              <TouchableOpacity
                style={[styles.fab, styles.fabAdd, isDarkMode && styles.fabDark]}
                onPress={navigateToAddSong} // Guna fungsi baru
              >
                <Plus size={28} color="#27ae60" />
              </TouchableOpacity>
            </View>

            <View style={styles.fabRowContainer}>
              <Text style={[styles.externalFabLabel, isDarkMode && styles.externalFabLabelDark]}>{t('pasteLinkButtonLabel')}</Text>
              <TouchableOpacity
                style={[styles.fab, styles.fabPaste, isDarkMode && styles.fabDark]}
                onPress={openPasteModalFromFab} // Guna fungsi baru
              >
                <Link size={24} color="#3498db" />
              </TouchableOpacity>
            </View>
            <View style={styles.fabRowContainer}>
              <Text style={[styles.externalFabLabel, isDarkMode && styles.externalFabLabelDark]}>{t('shareHelpTitle')}</Text>
              <TouchableOpacity
                style={[styles.fab, styles.fabHelp, isDarkMode && styles.fabDark]}
                onPress={showHelpAlertFromFab} // Guna fungsi baru
              >
                <HelpCircle size={24} color="#8e44ad" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Butang FAB Utama (Toggle Menu) */}
        <TouchableOpacity
          style={[styles.fab, styles.mainFab, isDarkMode && styles.fabDark]} // Guna style baru untuk main FAB
          onPress={toggleFabMenu} // Guna fungsi toggle
        >
          {isFabMenuOpen ? <X size={28} color={isDarkMode ? "#fff" : "#000"} /> : <Plus size={28} color={isDarkMode ? "#fff" : "#000"} />}
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasteModalVisible}
        onRequestClose={closePasteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isDarkMode && styles.modalContainerDark]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>{t('pasteLinkTitle')}</Text>
            <Text style={[styles.modalInstructions, isDarkMode && styles.textDarkMuted]}>
              {t('pasteLinkInstructions')}
            </Text>
            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder={t('pasteLinkPlaceholder')}
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={pastedLink}
              onChangeText={setPastedLink}
              multiline={true}
              numberOfLines={3}
              editable={!isSavingPasted}
            />
            <TouchableOpacity
              style={styles.pasteButton}
              onPress={handlePasteFromClipboard}
              disabled={isSavingPasted}
            >
              <Text style={styles.pasteButtonText}>{t('pasteFromClipboard')}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closePasteModal}
                disabled={isSavingPasted}
              >
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, isSavingPasted && styles.buttonDisabled]}
                onPress={handleSavePastedLink}
                disabled={isSavingPasted}
              >
                <Text style={styles.buttonText}>{isSavingPasted ? t('savingPastedLink') : t('savePastedLink')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  headerContainer: {
    height: 140,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  bannerImageContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  header: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 145,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  headerOverlayText: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 100,
  },
  songCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  songCardDark: {
    backgroundColor: '#2a2a2a',
    borderLeftColor: '#5dade2',
    elevation: 3,
  },
  songTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  songTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  textDark: {
    color: '#e0e0e0',
  },
  textDarkMuted: {
    color: '#888',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  fabRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  externalFabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  externalFabLabelDark: {
    color: '#ddd',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#ffffff',
  },
  mainFab: {
    // Inherits from fab, can override or add specifics if needed
    // Example: different background color if needed
  },
  fabAdd: {
    // Specific styles for Add button if needed, otherwise inherits from fab
  },
  fabPaste: {
    // Specific styles for Paste button if needed
  },
  fabHelp: {
    // Specific styles for Help button if needed
  },
  fabDark: {
    backgroundColor: '#444',
    shadowColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainerDark: {
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    minHeight: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  modalInputDark: {
    borderColor: '#444',
    backgroundColor: '#3a3a3a',
    color: '#fff',
  },
  pasteButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  pasteButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#aaa',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 