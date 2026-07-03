import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal,
  TextInput, Alert, Platform, ToastAndroid, Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus, ArrowLeft, Link, HelpCircle, Link2, Heart, Share as ShareIcon,
  X, Search, ArrowUpDown, Music, Edit3, ChevronRight, Clipboard as ClipboardIcon,
  History, Trash2
} from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import { useMySongs, UserSong } from './context/MySongsContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useFavorites } from './context/FavoritesContext';
import { translations } from '../src/translations';
import { useLanguage } from './context/LanguageContext';
import { parseSongShareLink } from './utils/songLink';
import {
  addRecentShare, removeRecentShare, clearRecentShares, loadRecentShares,
  RecentShare
} from './utils/recentShares';

// Guna banner_s.webp untuk header skrin Lagu Saya
const headerImage = require('../assets/images/banners-webp/banner_s.webp');

// Sort mode untuk senarai Lagu Saya
type SortMode = 'newest' | 'oldest' | 'az' | 'za';

// Kira bilangan baris lirik (skip baris kosong)
const countLyricsLines = (lyrics: string): number => {
  if (!lyrics) return 0;
  return lyrics.split('\n').filter(line => line.trim().length > 0).length;
};

// Format tarikh relatif — "Hari ini" / "Semalam" / "X hari lalu" / "X minggu lalu" / "X bulan lalu"
const formatRelativeDate = (timestamp: number | undefined, t: (key: string, params?: Record<string, string>) => string): string => {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 1) return t('songAddedToday');
  if (days === 1) return t('songAddedYesterday');
  if (days < 7) return t('songAddedDaysAgo', { count: String(days) });
  if (days < 30) return t('songAddedWeeksAgo', { count: String(Math.floor(days / 7)) });
  return t('songAddedMonthsAgo', { count: String(Math.floor(days / 30)) });
};

export default function MySongsScreen() {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { mySongs, addMySongWithId } = useMySongs();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isPasteModalVisible, setIsPasteModalVisible] = useState(false);
  const [pastedLink, setPastedLink] = useState('');
  const [isSavingPasted, setIsSavingPasted] = useState(false);
  const { currentLanguage, t } = useLanguage();
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Search + sort state — ditambah v.x.x untuk koleksi lagu yang besar
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Recent shares history — Pilihan D (v.x.x)
  const [recentShares, setRecentShares] = useState<RecentShare[]>([]);
  const [savingShareId, setSavingShareId] = useState<string | null>(null);

  const refreshRecentShares = useCallback(async () => {
    const list = await loadRecentShares();
    setRecentShares(list);
  }, []);

  // Load recent shares on mount, dan refresh setiap kali My Songs dibuka
  useEffect(() => {
    refreshRecentShares();
  }, [refreshRecentShares]);

  // Refresh juga bila paste modal ditutup (ada kemungkinan baru save)
  useEffect(() => {
    if (!isPasteModalVisible) {
      refreshRecentShares();
    }
  }, [isPasteModalVisible, refreshRecentShares]);

  // Periksa jika lagu baru sahaja dipadam
  useEffect(() => {
    const checkSongDeleted = async () => {
      try {
        const songDeleted = await AsyncStorage.getItem('song_deleted');
        if (songDeleted === 'true') {
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
      const parsed = parseSongShareLink(urlToProcess);
      if (!parsed.success) {
        if (parsed.error === 'notALink') {
          Alert.alert(t('linkErrorTitle'), t('linkErrorInvalid'));
        } else if (parsed.error === 'noData') {
          Alert.alert(t('linkErrorTitle'), t('linkErrorNoData'));
        } else if (parsed.error === 'invalidData') {
          Alert.alert(t('linkErrorTitle'), t('linkErrorInvalidData'));
        } else {
          Alert.alert(t('linkErrorTitle'), t('linkErrorParsing'));
        }
        return;
      }

      // Track dalam recent shares supaya boleh re-save kalau accidentally dismissed
      await addRecentShare({
        id: parsed.song.id,
        title: parsed.song.title,
        lyrics: parsed.song.lyrics,
        rawLink: urlToProcess,
      });

      const result = await addMySongWithId({
        ...parsed.song,
        sourceAdded: 'shared',
        createdAt: Date.now(),
      });

      if (result.success) {
        Alert.alert(t('saveSuccessTitle'), t('saveSuccessMessage').replace('{songTitle}', parsed.song.title));
        // Buang dari recent shares sebab dah saved
        await removeRecentShare(parsed.song.id);
        await refreshRecentShares();
        closePasteModal();
      } else {
        Alert.alert(t('saveFailTitle'), result.message);
      }
    } catch (error) {
      console.error('Ralat luar jangkaan semasa menyimpan pautan:', error);
      Alert.alert(t('linkErrorTitle'), t('linkErrorSaving'));
    } finally {
      setIsSavingPasted(false);
    }
  };

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
        Alert.alert(t('saveSuccessTitle'), t('copyLinkSuccess'));
      }
      console.log('Share link copied from list:', link);
    } catch (error) {
      console.error('Error copying share link from list:', error);
      Alert.alert(t('linkErrorTitle'), t('copyLinkError'));
    }
  };

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
      Alert.alert(t('alertError'), t('alertFailedSave'));
    }
  };

  const handleToggleFavorite = async (songId: string) => {
    if (isFavorite(songId)) {
      await removeFromFavorites(songId);
    } else {
      await addToFavorites(songId);
    }
  };

  const toggleFabMenu = () => {
    setIsFabMenuOpen(!isFabMenuOpen);
  };

  const navigateToAddSong = () => {
    console.log('Navigasi ke skrin tambah lagu dari menu FAB');
    router.push('/add-song');
    setIsFabMenuOpen(false);
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

  // Save satu entry dari recent shares (one-tap re-save)
  const handleSaveRecentShare = async (share: RecentShare) => {
    if (savingShareId) return;
    setSavingShareId(share.id);
    try {
      const result = await addMySongWithId({
        id: share.id,
        title: share.title,
        lyrics: share.lyrics,
        sourceAdded: 'shared',
        createdAt: Date.now(),
      });
      if (result.success) {
        await removeRecentShare(share.id);
        await refreshRecentShares();
        if (Platform.OS === 'android') {
          ToastAndroid.show(t('saveSuccessMessage').replace('{songTitle}', share.title), ToastAndroid.SHORT);
        } else {
          Alert.alert(t('saveSuccessTitle'), t('saveSuccessMessage').replace('{songTitle}', share.title));
        }
      } else {
        Alert.alert(t('saveFailTitle'), result.message);
      }
    } finally {
      setSavingShareId(null);
    }
  };

  // Buang satu entry dari recent shares
  const handleRemoveRecentShare = async (share: RecentShare) => {
    await removeRecentShare(share.id);
    await refreshRecentShares();
  };

  // Kosongkan semua
  const handleClearRecentShares = () => {
    Alert.alert(
      t('recentSharesClearAll'),
      t('recentSharesClearConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('recentSharesClearAll'),
          style: 'destructive',
          onPress: async () => {
            await clearRecentShares();
            await refreshRecentShares();
          },
        },
      ]
    );
  };

  // Format relative time untuk recent shares
  const formatRecentTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('recentShareJustNow');
    if (mins < 60) return t('recentShareMinutesAgo', { count: String(mins) });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('recentShareHoursAgo', { count: String(hours) });
    return formatRelativeDate(timestamp, t);
  };

  // Filter dan susun lagu ikut carian + sort mode
  const filteredAndSortedSongs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let list = mySongs;

    if (query !== '') {
      list = list.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.lyrics.toLowerCase().includes(query)
      );
    }

    const sorted = [...list];
    switch (sortMode) {
      case 'newest':
        sorted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        break;
      case 'oldest':
        sorted.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
        break;
      case 'az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return sorted;
  }, [mySongs, searchQuery, sortMode]);

  const sortModeLabel = (mode: SortMode): string => {
    switch (mode) {
      case 'newest': return t('sortNewest');
      case 'oldest': return t('sortOldest');
      case 'az': return t('sortAZ');
      case 'za': return t('sortZA');
    }
  };

  // Render satu lagu dalam senarai
  const renderSongItem = ({ item }: { item: UserSong }) => {
    const songIsFavorite = isFavorite(item.id);
    const lineCount = countLyricsLines(item.lyrics);
    const relativeDate = formatRelativeDate(item.createdAt, t);
    const isShared = item.sourceAdded === 'shared';

    // Warna border kiri mengikut status:
    // - Ungu = lagu kegemaran
    // - Oren = lagu dikongsi dari orang lain
    // - Biru = lagu biasa / manual
    let borderColor = currentColorTheme.accent;
    if (songIsFavorite) {
      borderColor = '#8e44ad'; // ungu — kegemaran
    } else if (isShared) {
      borderColor = '#e67e22'; // oren — dikongsi
    }

    return (
      <View style={[
        styles.songCard,
        isDarkMode && styles.songCardDark,
        { backgroundColor: currentColorTheme.surface, borderColor: currentColorTheme.border, borderLeftColor: borderColor }
      ]}>
        <TouchableOpacity
          onPress={() => router.push(`/song/${item.id}?isUserSong=true`)}
          style={styles.songTitleContainer}
        >
          <Text style={[
            styles.songTitle,
            isDarkMode && styles.textDark,
            { color: isDarkMode ? '#fff' : '#333' }
          ]} numberOfLines={2}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Text style={[
              styles.metaText,
              { color: currentColorTheme.textSecondary }
            ]}>
              {t('songLinesCount', { count: String(lineCount) })}
            </Text>
            {relativeDate !== '' && (
              <>
                <Text style={[styles.metaSeparator, { color: currentColorTheme.textSecondary }]}>·</Text>
                <Text style={[
                  styles.metaText,
                  { color: currentColorTheme.textSecondary }
                ]}>
                  {relativeDate}
                </Text>
              </>
            )}
            {isShared && (
              <View style={[styles.sharedBadge, { backgroundColor: isDarkMode ? 'rgba(230, 126, 34, 0.2)' : 'rgba(230, 126, 34, 0.15)' }]}>
                <Text style={styles.sharedBadgeText}>{t('sharedBadge')}</Text>
              </View>
            )}
          </View>
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

  // Empty state — bezakan antara tiada lagu langsung vs tiada match carian
  const renderEmptyState = () => {
    if (mySongs.length === 0) {
      // Tiada lagu langsung dalam koleksi
      return (
        <View style={styles.emptyStateContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: isDarkMode ? '#2a2a2a' : '#eef4ff' }]}>
            <Music size={48} color={isDarkMode ? '#5A9AF5' : '#3498db'} />
          </View>
          <Text style={[
            styles.emptyStateTitle,
            { color: currentColorTheme.text }
          ]}>{t('emptyMySongsTitle')}</Text>
          <Text style={[
            styles.emptyStateSubtitle,
            { color: currentColorTheme.textSecondary }
          ]}>{t('emptyMySongsSubtitle')}</Text>
        </View>
      );
    }
    // Ada lagu tapi takde match carian
    return (
      <Text style={[
        styles.emptyText,
        isDarkMode && styles.textDarkMuted,
        { color: currentColorTheme.textSecondary }
      ]}>{t('searchNoMatches')}</Text>
    );
  };

  // Recent shares section — muncul di atas list kalau ada entry
  const renderRecentSharesSection = () => {
    if (recentShares.length === 0) return null;

    return (
      <View style={styles.recentSection}>
        <View style={styles.recentSectionHeader}>
          <View style={styles.recentSectionTitleRow}>
            <History size={16} color={currentColorTheme.textSecondary} />
            <Text style={[styles.recentSectionTitle, { color: currentColorTheme.textSecondary }]}>
              {t('recentSharesTitle')}
            </Text>
          </View>
          <TouchableOpacity onPress={handleClearRecentShares} hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}>
            <Trash2 size={16} color={currentColorTheme.textSecondary} />
          </TouchableOpacity>
        </View>

        {recentShares.map((share) => {
          const isAlreadySaved = mySongs.some(s => s.id === share.id);
          const isSaving = savingShareId === share.id;
          const lineCount = share.lyrics.split('\n').filter(l => l.trim().length > 0).length;

          return (
            <View
              key={share.id}
              style={[
                styles.recentShareCard,
                isDarkMode && styles.recentShareCardDark,
                {
                  backgroundColor: isDarkMode ? 'rgba(230, 126, 34, 0.08)' : 'rgba(230, 126, 34, 0.06)',
                  borderColor: isDarkMode ? 'rgba(230, 126, 34, 0.3)' : 'rgba(230, 126, 34, 0.25)',
                }
              ]}
            >
              <View style={styles.recentShareInfo}>
                <Text
                  style={[styles.recentShareTitle, { color: currentColorTheme.text }]}
                  numberOfLines={1}
                >
                  {share.title}
                </Text>
                <Text style={[styles.recentShareMeta, { color: currentColorTheme.textSecondary }]}>
                  {t('songLinesCount', { count: String(lineCount) })} · {formatRecentTime(share.addedAt)}
                </Text>
              </View>
              <View style={styles.recentShareActions}>
                {isAlreadySaved ? (
                  <View style={[styles.recentShareSavedBadge, { backgroundColor: isDarkMode ? 'rgba(39, 174, 96, 0.2)' : 'rgba(39, 174, 96, 0.15)' }]}>
                    <Text style={styles.recentShareSavedBadgeText}>✓</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.recentShareSaveButton, isSaving && styles.recentShareSaveButtonDisabled]}
                    onPress={() => handleSaveRecentShare(share)}
                    disabled={isSaving || savingShareId !== null}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.recentShareSaveButtonText}>
                      {isSaving ? '...' : t('recentShareSave')}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleRemoveRecentShare(share)}
                  style={styles.recentShareRemoveButton}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <X size={16} color={currentColorTheme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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

      {/* Search + sort bar — ditambah supaya koleksi lagu yang besar senang diurus */}
      <View style={[styles.searchSortBar, { backgroundColor: currentColorTheme.background }]}>
        <View style={[
          styles.searchBar,
          isDarkMode
            ? { backgroundColor: '#2a2a2a', borderColor: '#333' }
            : { backgroundColor: '#f2f2f2', borderColor: '#e0e0e0' }
        ]}>
          <Search size={18} color={currentColorTheme.textSecondary} />
          <TextInput
            style={[
              styles.searchInput,
              { color: currentColorTheme.text }
            ]}
            placeholder={t('mySongsSearchPlaceholder')}
            placeholderTextColor={currentColorTheme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={currentColorTheme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.sortButton,
            isDarkMode
              ? { backgroundColor: '#2a2a2a', borderColor: '#333' }
              : { backgroundColor: '#f2f2f2', borderColor: '#e0e0e0' }
          ]}
          onPress={() => setIsSortMenuOpen(true)}
        >
          <ArrowUpDown size={18} color={currentColorTheme.text} />
          <Text style={[styles.sortButtonText, { color: currentColorTheme.text }]} numberOfLines={1}>
            {sortModeLabel(sortMode)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Primary CTA + secondary actions (v.x.x) — gantikan FAB bulat lama.
          Prominent button di atas sebab first-time user nampak terus, jelas,
          dan label penuh (bukan ikon sahaja macam FAB). */}
      <View style={[styles.primaryActionBar, { backgroundColor: currentColorTheme.background }]}>
        <TouchableOpacity
          style={styles.primaryCTA}
          onPress={toggleFabMenu}
          activeOpacity={0.8}
        >
          <View style={styles.primaryCTAIconCircle}>
            <Plus size={22} color="#fff" />
          </View>
          <View style={styles.primaryCTAText}>
            <Text style={styles.primaryCTATitle}>{t('addSongPrimaryCTA')}</Text>
            <Text style={styles.primaryCTADesc}>{t('addSongPrimaryCTADesc')}</Text>
          </View>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.secondaryActionButton,
            isDarkMode
              ? { backgroundColor: '#1f3a5f', borderColor: '#2a4a7f' }
              : { backgroundColor: '#e8f4ff', borderColor: '#b8d8f0' }
          ]}
          onPress={openPasteModal}
          activeOpacity={0.7}
        >
          <ClipboardIcon size={18} color={isDarkMode ? '#a0c4ff' : '#3498db'} />
          <Text style={[
            styles.secondaryActionText,
            { color: isDarkMode ? '#a0c4ff' : '#3498db' }
          ]} numberOfLines={1}>
            {t('pasteLinkButtonLabel')}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAndSortedSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={renderRecentSharesSection}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
      />
      {/* FAB lama dibuang dalam v.x.x — prominent CTA di header mengambil alih fungsinya.
          Bottom sheet di bawah tetap dipaparkan bila user tekan CTA / paste button. */}

      {/* Bottom sheet — cara tambah lagu (v.x.x). Lebih kemas dari FAB menu lama. */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFabMenuOpen}
        onRequestClose={() => setIsFabMenuOpen(false)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          style={styles.bottomSheetOverlay}
          activeOpacity={1}
          onPress={() => setIsFabMenuOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.bottomSheetContainer,
              { backgroundColor: currentColorTheme.surface }
            ]}
            onPress={() => { /* swallow supaya tak tutup bila tekan dalam sheet */ }}
          >
            <View style={[styles.bottomSheetHandle, { backgroundColor: isDarkMode ? '#444' : '#ddd' }]} />
            <Text style={[styles.bottomSheetTitle, { color: currentColorTheme.text }]}>
              {t('addSongSheetTitle')}
            </Text>
            <Text style={[styles.bottomSheetSubtitle, { color: currentColorTheme.textSecondary }]}>
              {t('addSongSheetSubtitle')}
            </Text>

            <TouchableOpacity
              style={[
                styles.bottomSheetOption,
                { backgroundColor: isDarkMode ? '#222' : '#f8f9fa', borderColor: currentColorTheme.border }
              ]}
              onPress={navigateToAddSong}
              activeOpacity={0.7}
            >
              <View style={[styles.bottomSheetIconCircle, { backgroundColor: '#27ae6020' }]}>
                <Edit3 size={22} color="#27ae60" />
              </View>
              <View style={styles.bottomSheetOptionText}>
                <Text style={[styles.bottomSheetOptionTitle, { color: currentColorTheme.text }]}>
                  {t('addSongOptionManual')}
                </Text>
                <Text style={[styles.bottomSheetOptionDesc, { color: currentColorTheme.textSecondary }]}>
                  {t('addSongOptionManualDesc')}
                </Text>
              </View>
              <ChevronRight size={20} color={currentColorTheme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bottomSheetOption,
                { backgroundColor: isDarkMode ? '#222' : '#f8f9fa', borderColor: currentColorTheme.border }
              ]}
              onPress={openPasteModalFromFab}
              activeOpacity={0.7}
            >
              <View style={[styles.bottomSheetIconCircle, { backgroundColor: '#3498db20' }]}>
                <Link size={22} color="#3498db" />
              </View>
              <View style={styles.bottomSheetOptionText}>
                <Text style={[styles.bottomSheetOptionTitle, { color: currentColorTheme.text }]}>
                  {t('addSongOptionPaste')}
                </Text>
                <Text style={[styles.bottomSheetOptionDesc, { color: currentColorTheme.textSecondary }]}>
                  {t('addSongOptionPasteDesc')}
                </Text>
              </View>
              <ChevronRight size={20} color={currentColorTheme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bottomSheetOption,
                { backgroundColor: isDarkMode ? '#222' : '#f8f9fa', borderColor: currentColorTheme.border }
              ]}
              onPress={showHelpAlertFromFab}
              activeOpacity={0.7}
            >
              <View style={[styles.bottomSheetIconCircle, { backgroundColor: '#8e44ad20' }]}>
                <HelpCircle size={22} color="#8e44ad" />
              </View>
              <View style={styles.bottomSheetOptionText}>
                <Text style={[styles.bottomSheetOptionTitle, { color: currentColorTheme.text }]}>
                  {t('addSongOptionHelp')}
                </Text>
                <Text style={[styles.bottomSheetOptionDesc, { color: currentColorTheme.textSecondary }]}>
                  {t('addSongOptionHelpDesc')}
                </Text>
              </View>
              <ChevronRight size={20} color={currentColorTheme.textSecondary} />
            </TouchableOpacity>

            {/* Safe area bawah supaya tak ditutupi gesture bar iPhone */}
            <View style={{ height: 20 }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Sort menu modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSortMenuOpen}
        onRequestClose={() => setIsSortMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.sortMenuOverlay}
          activeOpacity={1}
          onPress={() => setIsSortMenuOpen(false)}
        >
          <View style={[
            styles.sortMenuContainer,
            isDarkMode && styles.sortMenuContainerDark,
            { backgroundColor: currentColorTheme.surface, borderColor: currentColorTheme.border }
          ]}>
            <Text style={[styles.sortMenuTitle, { color: currentColorTheme.text }]}>{t('sortBy')}</Text>
            {(['newest', 'oldest', 'az', 'za'] as SortMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.sortMenuItem,
                  sortMode === mode && { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }
                ]}
                onPress={() => {
                  setSortMode(mode);
                  setIsSortMenuOpen(false);
                }}
              >
                <Text style={[styles.sortMenuItemText, { color: currentColorTheme.text }]}>
                  {sortModeLabel(mode)}
                </Text>
                {sortMode === mode && (
                  <Text style={[styles.sortMenuCheck, { color: currentColorTheme.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
  // Search + sort bar
  searchSortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    gap: 6,
    maxWidth: 130,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  // Sort menu modal
  sortMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sortMenuContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  sortMenuContainerDark: {
    backgroundColor: '#2a2a2a',
  },
  sortMenuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sortMenuItemText: {
    fontSize: 16,
  },
  sortMenuCheck: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // List
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 100,
    flexGrow: 1,
  },
  // Song card
  songCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  metaSeparator: {
    fontSize: 12,
    marginHorizontal: 2,
  },
  sharedBadge: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sharedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e67e22',
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  // Empty state
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Primary CTA bar (v.x.x) — gantikan FAB bulat lama
  primaryActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 10,
    gap: 10,
  },
  primaryCTA: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#27ae60',
    elevation: 3,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryCTAIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  primaryCTAText: {
    flex: 1,
  },
  primaryCTATitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  primaryCTADesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    maxWidth: 130,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  // Bottom sheet (v.x.x) — popup pilihan lengkap bila tekan primary CTA
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 18,
  },
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  bottomSheetIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bottomSheetOptionText: {
    flex: 1,
  },
  bottomSheetOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  bottomSheetOptionDesc: {
    fontSize: 13,
    lineHeight: 17,
  },
  // Paste link modal
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
  // Recent shares section (Pilihan D v.x.x)
  recentSection: {
    marginBottom: 16,
    marginTop: 4,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  recentSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentShareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#e67e22',
  },
  recentShareCardDark: {
    // Background colour set inline supaya ada tone oren yang konsisten
  },
  recentShareInfo: {
    flex: 1,
    marginRight: 10,
  },
  recentShareTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentShareMeta: {
    fontSize: 11,
  },
  recentShareActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentShareSaveButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recentShareSaveButtonDisabled: {
    backgroundColor: '#999',
  },
  recentShareSaveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recentShareRemoveButton: {
    padding: 4,
  },
  recentShareSavedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentShareSavedBadgeText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
  },
});