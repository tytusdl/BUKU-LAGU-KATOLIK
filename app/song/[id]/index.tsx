import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Share, /*ActivityIndicator,*/ TouchableHighlight, Alert, Platform, ToastAndroid, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Minus, Plus, Type, Heart, Share as ShareIcon, Menu, X, Edit, Trash2, ChevronLeft, ChevronRight, Link2, Image as ImageIcon, PlayCircle, Music, Music2, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { songs as defaultSongs, songs as allSongs, Song } from '../../data/songs';
import { useState, useEffect, useMemo, Fragment, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import { useMySongs, UserSong } from '../../context/MySongsContext';
import { useMass } from '../../context/MassContext';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { translations } from '../../../src/translations';
import { useLanguage } from '../../context/LanguageContext';
import ReportLyricsModal from '../../components/ReportLyricsModal';
import packages from '../../../package.json';

const FONT_SIZE_KEY = 'appFontSize';

export default function SongDetail() {
  const { id, isUserSong: isUserSongParam, fromFavorites: fromFavoritesParam, fromMass: fromMassParam } =
    useLocalSearchParams<{ id: string; isUserSong?: string; fromFavorites?: string; fromMass?: string }>();
  const isUserSong = isUserSongParam === 'true';
  const fromFavorites = fromFavoritesParam === 'true';
  const fromMass = fromMassParam === 'true';

  const { mySongs, removeMySong, editMySong } = useMySongs();
  const { favorites } = useFavorites();

  const [fontSize, setFontSize] = useState(18);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();
  const [showButtons, setShowButtons] = useState(false);
  const [previousSongId, setPreviousSongId] = useState<string | null>(null);
  const [nextSongId, setNextSongId] = useState<string | null>(null);
  const [isCapturingImage, setIsCapturingImage] = useState(false);
  const [showMassModal, setShowMassModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { massSelection, addSongToMassPart } = useMass();
  const [appVersion] = useState(packages.version);

  const { massPartLabel, songKey } = useMemo(() => {
    if (!id || !fromMass) return { massPartLabel: null, songKey: null };

    // Define translations for parts here for easy access
    const partLabels: Record<string, string> = {
      pembukaan: t('pembukaan'),
      punggutan: t('punggutan'),
      persembahan: t('persembahan'),
      komuni: t('komuni'),
      kesyukuran: t('kesyukuran'),
      penutup: t('penutup'),
    };

    for (const part of Object.keys(massSelection)) {
      const selection = massSelection[part as keyof typeof massSelection].find(s => s.songId === id);
      if (selection) {
        return {
          massPartLabel: partLabels[part] || part,
          songKey: selection.songKey || null
        };
      }
    }
    return { massPartLabel: null, songKey: null };
  }, [massSelection, id, currentLanguage]);

  const songIsFavorite = isFavorite(id as string);
  const captureViewRef = useRef<ScrollView>(null);
  const fullContentRef = useRef<View>(null);



  const toggleFavorite = async () => {
    if (songIsFavorite) {
      await removeFromFavorites(id as string);
    } else {
      await addToFavorites(id as string);
    }
  };

  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const savedFontSize = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (savedFontSize !== null) {
          setFontSize(Number(savedFontSize));
        }
      } catch (error) {

      }
    };

    loadFontSize();
  }, []);

  const increaseFontSize = async () => {
    if (fontSize < 28) {
      const newSize = fontSize + 2;
      setFontSize(newSize);
      try {
        await AsyncStorage.setItem(FONT_SIZE_KEY, newSize.toString());
      } catch (error) {

      }
    }
  };

  const decreaseFontSize = async () => {
    if (fontSize > 12) {
      const newSize = fontSize - 2;
      setFontSize(newSize);
      try {
        await AsyncStorage.setItem(FONT_SIZE_KEY, newSize.toString());
      } catch (error) {

      }
    }
  };



  const song = useMemo(() => {
    const defaultSearch = isUserSong
      ? mySongs.find(s => s.id === id)
      : (allSongs as (Song | UserSong)[]).find(s => s.id === id);

    if (defaultSearch) return defaultSearch;

    // Fallback: search the other list if not found in the expected one
    return isUserSong
      ? (allSongs as (Song | UserSong)[]).find(s => s.id === id)
      : mySongs.find(s => s.id === id);
  }, [id, isUserSong, mySongs]);

  useEffect(() => {
    if (!song) {
      setPreviousSongId(null);
      setNextSongId(null);
      return;
    }

    let currentList: (Song | UserSong)[] = [];

    if (fromFavorites) {
      currentList = favorites.map((favId: string) => {
        const userSong = mySongs.find(s => s.id === favId);
        if (userSong) return userSong;
        return allSongs.find(s => s.id === favId);
      }).filter((s: Song | UserSong | undefined): s is Song | UserSong => s !== undefined);

    } else if (fromMass) {
      const massSongIds = [
        ...massSelection.pembukaan,
        ...massSelection.punggutan,
        ...massSelection.persembahan,
        ...massSelection.komuni,
        ...massSelection.kesyukuran,
        ...massSelection.penutup
      ].map(s => s.songId);

      // Remove duplicates while preserving order of appearing in Misa plan
      const uniqueMassSongIds = [...new Set(massSongIds)];

      currentList = uniqueMassSongIds.map(songId => {
        const userSong = mySongs.find(s => s.id === songId);
        if (userSong) return userSong;
        return allSongs.find(s => s.id === songId);
      }).filter((s: Song | UserSong | undefined): s is Song | UserSong => s !== undefined);

    } else if (isUserSong) {
      currentList = mySongs;
    } else {
      const category = (song as Song).songNumber;
      currentList = category ? allSongs.filter(s => s.songNumber === category) : [];
    }

    const currentIndex = currentList.findIndex(s => s.id === song.id);

    if (currentIndex !== -1) {
      setPreviousSongId(currentIndex > 0 ? currentList[currentIndex - 1].id : null);
      setNextSongId(currentIndex < currentList.length - 1 ? currentList[currentIndex + 1].id : null);
    } else {
      setPreviousSongId(null);
      setNextSongId(null);
    }
  }, [song, isUserSong, mySongs, allSongs, fromFavorites, favorites, fromMass, massSelection]);

  if (!song) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>{t('songNotFound')}</Text>
        </View>
        <View style={styles.content}>
          <Text style={isDarkMode && styles.darkText}>{t('songWithId')} {id} {t('songNotFound').toLowerCase()}.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const shareSong = async () => {
    if (!song) return;

    let shareText: string;
    let shareTitle: string;

    // Sekarang, format teks bergantung pada jenis lagu
    if (isUserSong) {
      // Lagu pengguna: Kongsi sebagai teks biasa (TAJUK dan LIRIK sahaja)
      shareText = `${song.title.toUpperCase()}\n\n${song.lyrics}`;
      shareTitle = `${song.title.toUpperCase()}`; // Tajuk kongsi juga hanya tajuk lagu


    } else {
      // Lagu biasa: ID - TAJUK (Huruf Besar) dan LIRIK
      shareText = `${song.id} - ${song.title.toUpperCase()}\n\n${song.lyrics}`; // Tajuk dalam huruf besar
      shareTitle = `${song.id} - ${song.title.toUpperCase()}`; // Tajuk kongsi juga huruf besar

    }

    // Butang "Salin Pautan Kongsi" masih berfungsi seperti biasa untuk lagu pengguna.

    try {

      await Share.share({
        message: shareText,
        title: shareTitle,
      });

    } catch (error) {
      console.error('Error sharing song:', error);
      Alert.alert('Ralat', 'Gagal berkongsi lagu.');
    }
  };

  // Fungsi baru untuk salin pautan kongsi
  const copyShareLink = async () => {
    if (!song || !isUserSong) return;

    const songData = {
      id: song.id,
      title: song.title, // Tajuk asal untuk data JSON
      lyrics: song.lyrics
    };
    // Enkod keseluruhan data lagu
    const encodedData = encodeURIComponent(JSON.stringify(songData));
    // Enkod tajuk sahaja untuk dipaparkan dalam URL (jika aplikasi lain menunjukkannya)
    const encodedTitle = encodeURIComponent(song.title);

    // Pautan dengan format query parameter: ?title=...&data=...
    const link = `lagu-pozoo://savesong?title=${encodedTitle}&data=${encodedData}`;

    try {
      await Clipboard.setStringAsync(link);
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('copyLinkSuccess'), ToastAndroid.SHORT);
      } else {
        Alert.alert(t('saveSuccessTitle'), t('copyLinkSuccess'));
      }

    } catch (error) {
      console.error('Error copying share link:', error);
      Alert.alert(t('linkErrorTitle'), t('copyLinkError'));
    }
  };

  const handleAddToMass = (part: any) => {
    if (!song) return;
    addSongToMassPart(part, song.id);
    setShowMassModal(false);
    setShowButtons(false);

    if (Platform.OS === 'android') {
      ToastAndroid.show(
        t('songAddedTo').replace('{part}', t(part)),
        ToastAndroid.SHORT
      );
    } else {
      Alert.alert(t('saveSuccessTitle'), t('songAddedTo').replace('{part}', t(part)));
    }
  };

  const handleDeleteSong = () => {
    if (!song) return;

    Alert.alert(
      t('deleteConfirmTitle'),
      t('deleteConfirmMessage').replace('{songTitle}', song.title),
      [
        { text: t('cancel'), style: "cancel" },
        {
          text: t('deleteConfirmButton'),
          style: "destructive",
          onPress: () => {
            router.back();

            removeMySong(song.id)
              .catch((error) => {
                console.error("Gagal memadam lagu selepas navigasi:", error);
                Alert.alert(t('alertError'), t('failedToDelete'));
              });
          }
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditSong = () => {
    if (!song) return;
    router.push(`/edit-song/${song.id}` as any);
  };

  const shareAsImage = async () => {




    if (!song) {

      Alert.alert('Debug', 'Function called but missing song');
      return;
    }

    try {

      // Request permissions for media library
      const { status } = await MediaLibrary.requestPermissionsAsync();


      if (status !== 'granted') {
        Alert.alert(t('alertError'), t('permissionRequired'));
        return;
      }


      // Show content for capture
      setIsCapturingImage(true);

      // Wait for the UI to update and ref to be assigned

      await new Promise(resolve => setTimeout(resolve, 1000)); // Increased wait time



      if (!fullContentRef.current) {

        setIsCapturingImage(false);
        Alert.alert('Error', 'Unable to capture content. Please try again.');
        return;
      }


      // Capture the full content container
      const uri = await captureRef(fullContentRef.current, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });


      // Keep content visible for debugging - don't hide it automatically
      // setIsCapturingImage(false);


      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Buku Lagu', asset, false);


      // Share the image
      if (await Sharing.isAvailableAsync()) {

        await Sharing.shareAsync(uri);
      }

      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('shareImageSuccess'), ToastAndroid.LONG);
      } else {
        Alert.alert(t('saveSuccessTitle'), t('shareImageSuccess'));
      }

      // Auto exit image capture mode
      setIsCapturingImage(false);

    } catch (error) {
      console.error('Error sharing image:', error);
      setIsCapturingImage(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(t('alertError'), t('shareImageError') + ': ' + errorMessage);
    }
  };

  const renderLyrics = () => {

    const lines = song.lyrics.split('\n');

    let inChorus = false;
    let inIntro = false;

    // Dynamic text color based on theme for visibility
    const textColor = isDarkMode ? '#fff' : '#000';


    return useMemo(() => {
      let formattedLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.match(/^(\*\*)??(Chorus|Cho|Kor|Korus|Ref|Refrain|Choros|Ant|Dend)(\s*\(.*?\))?\s*:(.*)$/i)) {
          inChorus = true;
          inIntro = false;
          const matchResult = line.match(/^(\*\*)??(Chorus|Cho|Kor|Korus|Ref|Refrain|Choros|Ant|Dend)(\s*\(.*?\))?\s*:(.*)$/i);

          if (matchResult) {
            const [, prefix = '', korusLabel = '', suffix = '', restOfLine = ''] = matchResult.map((m: string | undefined) => m ? m.trim() : '');

            formattedLines.push(
              // @ts-ignore
              <View key={`chorus-container-${i}`} style={styles.chorusContainer}>
                <Text style={[styles.lyrics, styles.chorusHeader, {
                  fontSize: fontSize,
                  lineHeight: fontSize * 1.5,
                  fontWeight: 'bold',
                  color: textColor
                }]}>
                  {prefix}{korusLabel}{suffix ? ` ${suffix}` : ''}:
                </Text>

                {restOfLine && (
                  <Text style={[styles.lyrics, styles.chorusFirstLine, {
                    fontSize: fontSize,
                    lineHeight: fontSize * 1.5,
                    fontWeight: 'bold',
                    color: textColor
                  }]}>
                    {restOfLine}
                  </Text>
                )}
              </View>
            );
          }
          continue;
        }

        if (line.match(/^(\*\*)??(Intro|Int|Pengenalan)(\s*\(.*?\))?\s*:(.*)$/i)) {
          inChorus = false;
          inIntro = true;
          const matchResult = line.match(/^(\*\*)??(Intro|Int|Pengenalan)(\s*\(.*?\))?\s*:(.*)$/i);

          if (matchResult) {
            const [, prefix = '', introLabel = '', suffix = '', restOfLine = ''] = matchResult.map((m: string | undefined) => m ? m.trim() : '');

            formattedLines.push(
              // @ts-ignore
              <View key={`intro-container-${i}`} style={styles.chorusContainer}>
                <Text style={[styles.lyrics, styles.chorusHeader, {
                  fontSize: fontSize,
                  lineHeight: fontSize * 1.5,
                  fontWeight: 'bold',
                  color: textColor
                }]}>
                  {prefix}{introLabel}{suffix ? ` ${suffix}` : ''}:
                </Text>

                {restOfLine && (
                  <Text style={[styles.lyrics, styles.chorusFirstLine, {
                    fontSize: fontSize,
                    lineHeight: fontSize * 1.5,
                    fontWeight: 'bold',
                    color: textColor
                  }]}>
                    {restOfLine}
                  </Text>
                )}
              </View>
            );
          }
          continue;
        }

        if ((inChorus || inIntro) && line.trim() !== '') {
          formattedLines.push(
            // @ts-ignore
            <View key={`special-line-${i}`} style={styles.chorusLineContainer}>
              <Text style={[styles.lyrics, styles.chorusLine, {
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
                fontWeight: 'bold',
                color: textColor
              }]}>
                {line.trim()}
              </Text>
            </View>
          );
          continue;
        }

        // Support for bold lines using ** prefix (e.g. **Line Content**)
        if (line.trim().startsWith('**')) {
          const content = line.trim().replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
          formattedLines.push(
            // @ts-ignore
            <View key={`bold-line-${i}`} style={styles.boldLineContainer}>
              <Text style={[styles.lyrics, styles.chorusLine, {
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
                fontWeight: 'bold',
                color: textColor
              }]}>
                {content}
              </Text>
            </View>
          );
          continue;
        }

        if ((inChorus || inIntro) && line.trim() === '') {
          inChorus = false;
          inIntro = false;
          formattedLines.push(
            // @ts-ignore
            <View key={`empty-line-${i}`} style={{ height: 20 }}></View>
          );
          continue;
        }

        if (line.trim() !== '') {
          formattedLines.push(
            // @ts-ignore
            <Text key={`line-${i}`} style={[styles.lyrics, {
              fontSize: fontSize,
              lineHeight: fontSize * 1.5,
              marginBottom: 5,
              color: textColor
            }]}>
              {line}
            </Text>
          );
        } else {
          formattedLines.push(
            // @ts-ignore
            <View key={`empty-line-${i}`} style={{ height: 20 }}></View>
          );
        }
      }


      return formattedLines;
    }, [fontSize, isDarkMode, song.lyrics]);
  };

  const renderFullContent = () => {



    const lines = song.lyrics.split('\n');
    let inChorus = false;
    let inIntro = false;
    const textColor = '#000'; // Always dark text for capture



    let formattedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^(\*\*)??(Chorus|Cho|Kor|Korus|Ref|Refrain|Choros|Ant|Dend)(\s*\(.*?\))?\s*:(.*)$/i)) {
        inChorus = true;
        inIntro = false;
        const matchResult = line.match(/^(\*\*)??(Chorus|Cho|Kor|Korus|Ref|Refrain|Choros|Ant|Dend)(\s*\(.*?\))?\s*:(.*)$/i);

        if (matchResult) {
          const [, prefix = '', korusLabel = '', suffix = '', restOfLine = ''] = matchResult.map((m: string | undefined) => m ? m.trim() : '');

          formattedLines.push(
            <View key={`chorus-container-${i}`} style={styles.chorusContainer}>
              <Text style={[{
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
                fontWeight: 'bold',
                color: textColor,
                width: 80
              }]}>
                {prefix}{korusLabel}{suffix ? ` ${suffix}` : ''}:
              </Text>

              {restOfLine && (
                <Text style={[{
                  fontSize: fontSize,
                  lineHeight: fontSize * 1.5,
                  fontWeight: 'bold',
                  color: textColor,
                  flex: 1,
                  marginLeft: 0
                }]}>
                  {restOfLine}
                </Text>
              )}
            </View>
          );
        }
        continue;
      }

      if (line.match(/^(\*\*)??(Intro|Int|Pengenalan)(\s*\(.*?\))?\s*:(.*)$/i)) {
        inChorus = false;
        inIntro = true;
        const matchResult = line.match(/^(\*\*)??(Intro|Int|Pengenalan)(\s*\(.*?\))?\s*:(.*)$/i);

        if (matchResult) {
          const [, prefix = '', introLabel = '', suffix = '', restOfLine = ''] = matchResult.map((m: string | undefined) => m ? m.trim() : '');

          formattedLines.push(
            <View key={`intro-container-${i}`} style={styles.chorusContainer}>
              <Text style={[{
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
                fontWeight: 'bold',
                color: textColor,
                width: 80
              }]}>
                {prefix}{introLabel}{suffix ? ` ${suffix}` : ''}:
              </Text>

              {restOfLine && (
                <Text style={[{
                  fontSize: fontSize,
                  lineHeight: fontSize * 1.5,
                  fontWeight: 'bold',
                  color: textColor,
                  flex: 1,
                  marginLeft: 0
                }]}>
                  {restOfLine}
                </Text>
              )}
            </View>
          );
        }
        continue;
      }

      if ((inChorus || inIntro) && line.trim() !== '') {
        formattedLines.push(
          <View key={`special-line-${i}`} style={styles.chorusLineContainer}>
            <Text style={[{
              fontSize: fontSize,
              lineHeight: fontSize * 1.5,
              fontWeight: 'bold',
              color: textColor
            }]}>
              {line.trim()}
            </Text>
          </View>
        );
        continue;
      }

      // Support for bold lines using ** prefix (e.g. **Line Content**)
      if (line.trim().startsWith('**')) {
        const content = line.trim().replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
        formattedLines.push(
          <View key={`bold-line-${i}`} style={styles.boldLineContainer}>
            <Text style={[{
              fontSize: fontSize,
              lineHeight: fontSize * 1.5,
              fontWeight: 'bold',
              color: textColor
            }]}>
              {content}
            </Text>
          </View>
        );
        continue;
      }

      if ((inChorus || inIntro) && line.trim() === '') {
        inChorus = false;
        inIntro = false;
        formattedLines.push(
          <View key={`empty-line-${i}`} style={{ height: 20 }}></View>
        );
        continue;
      }

      if (line.trim() !== '') {
        formattedLines.push(
          <Text key={`line-${i}`} style={[{
            fontSize: fontSize,
            lineHeight: fontSize * 1.5,
            marginBottom: 5,
            color: textColor
          }]}>
            {line}
          </Text>
        );
      } else {
        formattedLines.push(
          <View key={`empty-line-${i}`} style={{ height: 20 }}></View>
        );
      }
    }


    return formattedLines;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode && styles.darkContainer,
        { backgroundColor: currentColorTheme.background }
      ]}
      edges={Platform.OS === 'ios' ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[
        styles.header,
        isDarkMode && styles.darkHeader,
        {
          backgroundColor: isDarkMode ? '#1a1a1a' : (
            currentColorTheme.id === 'white' ? '#ffffff' :
              currentColorTheme.primary === '#9AC2F0' ? '#e8f2ff' :
                currentColorTheme.primary === '#96D99A' ? '#e8f8ea' :
                  currentColorTheme.primary === '#C788D1' ? '#f2e8f5' :
                    currentColorTheme.primary === '#F2A2C7' ? '#f8e8f2' :
                      currentColorTheme.primary === '#FFC975' ? '#fff2e0' :
                        currentColorTheme.primary === '#F59393' ? '#fae8e8' :
                          currentColorTheme.primary
          ),
          borderBottomColor: currentColorTheme.border
        }
      ]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#333"} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          {isUserSong ? (
            <Text style={[styles.headerTitle, { color: currentColorTheme.text }]}>{song.title.toUpperCase()}</Text>
          ) : (
            <>
              <Text style={[styles.headerAuthor, { color: currentColorTheme.primary }]}>{song.id}</Text>
              <Text style={[styles.headerTitle, { color: currentColorTheme.text }]}>{song.title.toUpperCase()}</Text>
              {(song as any).author && <Text style={[styles.authorText, { color: currentColorTheme.textSecondary }]}>{(song as any).author.toUpperCase()}</Text>}
            </>
          )}
          {massPartLabel || songKey ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, flexWrap: 'wrap' }}>
              {massPartLabel && (
                <Text style={{ fontSize: 12, fontWeight: '600', color: isDarkMode ? '#aaa' : '#666', marginRight: 8, textTransform: 'uppercase' }}>
                  {massPartLabel}
                </Text>
              )}
              {songKey && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Music2 size={12} color={isDarkMode ? currentColorTheme.primary : (currentColorTheme.id === 'white' ? '#555' : currentColorTheme.primary)} style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDarkMode ? currentColorTheme.primary : (currentColorTheme.id === 'white' ? '#555' : currentColorTheme.primary) }}>
                    {t('keyLabel').toUpperCase()} {songKey.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Heart
              size={24}
              color={songIsFavorite ? '#E22D2D' : (isDarkMode ? '#fff' : '#666')}
              fill={songIsFavorite ? '#E22D2D' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowReportModal(true)}
            style={styles.favoriteButton}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <AlertCircle
              size={22}
              color={isDarkMode ? '#fff' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        ref={captureViewRef}
        style={[
          styles.content,
          isDarkMode && styles.darkContent,
          { backgroundColor: currentColorTheme.background }
        ]}
        contentContainerStyle={[
          styles.contentContainer,
          isCapturingImage && styles.captureBackground
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.songInfo}>
          {/* Song info for image capture */}
          {isCapturingImage && (
            <View style={styles.captureHeader}>
              {!isUserSong && (
                <Text style={styles.captureId}>{song.id}</Text>
              )}
              <Text style={styles.captureTitle}>{song.title}</Text>
              {(song as any).author && (
                <Text style={styles.captureAuthor}>{(song as any).author}</Text>
              )}
            </View>
          )}
        </View>
        {renderLyrics()}
        <View style={styles.bottomSpacing} />

        {/* Credit footer - only visible during image capture */}
        {isCapturingImage && (
          <View style={styles.creditFooter}>
            <Text style={styles.creditText}>
              Buku Lagu Katolik ( Pozoo )
            </Text>
            <View style={styles.playStoreContainer}>
              <PlayCircle size={16} color="#666" style={styles.playStoreIcon} />
              <Text style={[styles.creditText, styles.playStoreText]}>Google Play Store</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Butang Navigasi Sebelumnya/Seterusnya */}
      <View style={[
        styles.navigationContainer,
        isDarkMode && styles.navigationContainerDark,
        {
          backgroundColor: isDarkMode ? '#1a1a1a' : (
            currentColorTheme.id === 'white' ? '#f8f8f8' :
              currentColorTheme.primary === '#9AC2F0' ? '#e8f2ff' :
                currentColorTheme.primary === '#96D99A' ? '#e8f8ea' :
                  currentColorTheme.primary === '#C788D1' ? '#f2e8f5' :
                    currentColorTheme.primary === '#F2A2C7' ? '#f8e8f2' :
                      currentColorTheme.primary === '#FFC975' ? '#fff2e0' :
                        currentColorTheme.primary === '#F59393' ? '#fae8e8' :
                          currentColorTheme.surface
          ),
          borderTopColor: currentColorTheme.border
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            isDarkMode && styles.navButtonDark,
            !previousSongId && (isDarkMode ? styles.navButtonDisabledDark : styles.navButtonDisabled),
            {
              backgroundColor: previousSongId ? (isDarkMode ? '#444444' : (
                currentColorTheme.id === 'white' ? '#f2f2f2' :
                  currentColorTheme.primary === '#9AC2F0' ? '#d8ecff' :
                    currentColorTheme.primary === '#96D99A' ? '#d8f2dc' :
                      currentColorTheme.primary === '#C788D1' ? '#ead8f0' :
                        currentColorTheme.primary === '#F2A2C7' ? '#f0d8ea' :
                          currentColorTheme.primary === '#FFC975' ? '#ffe8d0' :
                            currentColorTheme.primary === '#F59393' ? '#f2d8d8' :
                              currentColorTheme.primary
              )) : (isDarkMode ? '#252525' : currentColorTheme.surface)
            }
          ]}
          onPress={() => {
            if (previousSongId) {
              const prevIsUserSong = mySongs.some(s => s.id === previousSongId);
              router.setParams({
                id: previousSongId,
                isUserSong: prevIsUserSong ? 'true' : 'false',
                fromFavorites: fromFavorites ? 'true' : undefined,
                fromMass: fromMass ? 'true' : undefined
              });
            }
          }}
          disabled={!previousSongId}
        >
          <ChevronLeft size={24} color={previousSongId ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#666' : '#999')} />
          <Text style={[
            styles.navButtonText,
            isDarkMode && styles.navButtonTextDark,
            !previousSongId && (isDarkMode ? styles.navButtonTextDisabledDark : styles.navButtonTextDisabled),
            { color: previousSongId ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#666' : '#999') }
          ]}>
            {t('previous')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            isDarkMode && styles.navButtonDark,
            !nextSongId && (isDarkMode ? styles.navButtonDisabledDark : styles.navButtonDisabled),
            {
              backgroundColor: nextSongId ? (isDarkMode ? '#444444' : (
                currentColorTheme.id === 'white' ? '#f2f2f2' :
                  currentColorTheme.primary === '#9AC2F0' ? '#d8ecff' :
                    currentColorTheme.primary === '#96D99A' ? '#d8f2dc' :
                      currentColorTheme.primary === '#C788D1' ? '#ead8f0' :
                        currentColorTheme.primary === '#F2A2C7' ? '#f0d8ea' :
                          currentColorTheme.primary === '#FFC975' ? '#ffe8d0' :
                            currentColorTheme.primary === '#F59393' ? '#f2d8d8' :
                              currentColorTheme.primary
              )) : (isDarkMode ? '#252525' : currentColorTheme.surface)
            }
          ]}
          onPress={() => {
            if (nextSongId) {
              const nextIsUserSong = mySongs.some(s => s.id === nextSongId);
              router.setParams({
                id: nextSongId,
                isUserSong: nextIsUserSong ? 'true' : 'false',
                fromFavorites: fromFavorites ? 'true' : undefined,
                fromMass: fromMass ? 'true' : undefined
              });
            }
          }}
          disabled={!nextSongId}
        >
          <Text style={[
            styles.navButtonText,
            isDarkMode && styles.navButtonTextDark,
            !nextSongId && (isDarkMode ? styles.navButtonTextDisabledDark : styles.navButtonTextDisabled),
            { color: nextSongId ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#666' : '#999') }
          ]}>
            {t('next')}
          </Text>
          <ChevronRight size={24} color={nextSongId ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#666' : '#999')} />
        </TouchableOpacity>
      </View>

      {showButtons && (
        <View style={[
          styles.fabMenuContainer,
          isDarkMode && styles.fabMenuContainerDark,
          {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
          }
        ]}>
          <View style={styles.fabHeader}>
            <TouchableOpacity
              style={styles.fabCloseButtonInside}
              onPress={() => setShowButtons(false)}
            >
              <X size={24} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          <View style={[
            styles.fontSizeControlContainer,
            {
              backgroundColor: isDarkMode ? '#333333' : '#f0f0f0',
            }
          ]}>
            <TouchableOpacity
              onPress={decreaseFontSize}
              style={styles.fontSizeButton}
            >
              <Minus size={22} color={isDarkMode ? '#fff' : '#333'} />
            </TouchableOpacity>
            <View style={styles.fontLabelContainer}>
              <Type size={18} color={isDarkMode ? '#fff' : '#000'} />
            </View>
            <TouchableOpacity
              onPress={increaseFontSize}
              style={styles.fontSizeButton}
            >
              <Plus size={22} color={isDarkMode ? '#fff' : '#333'} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItemsContainer}>
            <TouchableOpacity
              style={[
                styles.fabMenuItemWide,
                { borderTopWidth: 0 }
              ]}
              onPress={shareSong}
            >
              <ShareIcon size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.fabMenuIcon} />
              <Text style={[styles.fabMenuText, { color: isDarkMode ? '#fff' : '#000' }]}>{t('share').toUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fabMenuItemWide}
              onPress={shareAsImage}
            >
              <ImageIcon size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.fabMenuIcon} />
              <Text style={[styles.fabMenuText, { color: isDarkMode ? '#fff' : '#000' }]}>{t('shareAsImage').toUpperCase()}</Text>
            </TouchableOpacity>

            {isUserSong && (
              <TouchableOpacity
                style={styles.fabMenuItemWide}
                onPress={copyShareLink}
              >
                <Link2 size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.fabMenuIcon} />
                <Text style={[styles.fabMenuText, { color: isDarkMode ? '#fff' : '#000' }]}>{t('copyLink').toUpperCase()}</Text>
              </TouchableOpacity>
            )}

            {isUserSong && (
              <TouchableOpacity
                style={styles.fabMenuItemWide}
                onPress={handleEditSong}
              >
                <Edit size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.fabMenuIcon} />
                <Text style={[styles.fabMenuText, { color: isDarkMode ? '#fff' : '#000' }]}>{t('editSong').toUpperCase()}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.fabMenuItemWide}
              onPress={() => setShowMassModal(true)}
            >
              <Music size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.fabMenuIcon} />
              <Text style={[styles.fabMenuText, { color: isDarkMode ? '#fff' : '#000' }]}>{t('massTitle').toUpperCase()}</Text>
            </TouchableOpacity>

            {!isUserSong && (
              <TouchableOpacity
                style={styles.fabMenuItemWide}
                onPress={() => {
                  setShowButtons(false);
                  setShowReportModal(true);
                }}
              >
                <AlertCircle size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.fabMenuIcon} />
                <Text style={[styles.fabMenuText, { color: isDarkMode ? '#fff' : '#000' }]}>{t('reportLyrics').toUpperCase()}</Text>
              </TouchableOpacity>
            )}

            {isUserSong && (
              <TouchableOpacity
                style={styles.fabMenuItemWide}
                onPress={handleDeleteSong}
              >
                <Trash2 size={20} color="#ef4444" style={styles.fabMenuIcon} />
                <Text style={[styles.fabMenuText, { color: "#ef4444" }]}>{t('deleteConfirmButton').toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.mainButton,
          isDarkMode && styles.darkShareButton,
          {
            backgroundColor: isDarkMode ? '#444444' : (
              currentColorTheme.id === 'white' ? '#ffffff' :
                currentColorTheme.primary === '#9AC2F0' ? '#d8ecff' :
                  currentColorTheme.primary === '#96D99A' ? '#d8f2dc' :
                    currentColorTheme.primary === '#C788D1' ? '#ead8f0' :
                      currentColorTheme.primary === '#F2A2C7' ? '#f0d8ea' :
                        currentColorTheme.primary === '#FFC975' ? '#ffe8d0' :
                          currentColorTheme.primary === '#F59393' ? '#f2d8d8' :
                            currentColorTheme.primary
            )
          }
        ]}
        onPress={() => setShowButtons(!showButtons)}
        activeOpacity={0.8}
      >
        <Menu size={28} color={isDarkMode ? '#fff' : (currentColorTheme.id === 'white' ? '#000' : '#333')} />
      </TouchableOpacity>

      {/* Hidden container for full content capture */}
      {isCapturingImage && (
        <View
          ref={fullContentRef}
          style={styles.hiddenCaptureContainer}
        >

          {/* Song header */}
          <View style={styles.captureHeader}>
            {!isUserSong && (
              <Text style={[styles.captureId, { color: '#000' }]}>{song.id}</Text>
            )}
            <Text style={[styles.captureTitle, { color: '#000' }]}>{song.title.toUpperCase()}</Text>
            {(massPartLabel || songKey) && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                {massPartLabel && (
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#888', marginRight: 10, textTransform: 'uppercase' }}>
                    {massPartLabel.toUpperCase()}
                  </Text>
                )}
                {songKey && (
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#555' }}>
                    {t('keyLabel').toUpperCase()} {songKey.toUpperCase()}
                  </Text>
                )}
              </View>
            )}
            {(song as any).author && (
              <Text style={[styles.captureAuthor, { color: '#000' }]}>{(song as any).author.toUpperCase()}</Text>
            )}
          </View>

          {/* Full lyrics content */}
          <View style={{ minHeight: 200 }}>
            {renderFullContent()}
          </View>

          {/* Credit footer */}
          <View style={[styles.creditFooter, { backgroundColor: '#f8f8f8' }]}>
            <Text style={[styles.creditText, { color: '#000' }]}>
              BUKU LAGU KATOLIK (POZOO)
            </Text>
            <View style={styles.playStoreContainer}>
              <PlayCircle size={16} color="#666" style={styles.playStoreIcon} />
              <Text style={[styles.creditText, styles.playStoreText, { color: '#666' }]}>App Store & Google Play</Text>
            </View>
          </View>
        </View>
      )}

      {/* Modal Pemilihan Bahagian Misa */}
      <Modal
        visible={showMassModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMassModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMassModal(false)}
        >
          <View style={[
            styles.massSelectionModal,
            { backgroundColor: currentColorTheme.surface, borderColor: currentColorTheme.border }
          ]}>
            <Text style={[styles.modalTitle, { color: currentColorTheme.text, marginBottom: 10 }]}>{t('massTitle').toUpperCase()}</Text>
            <Text style={{ textAlign: 'center', color: currentColorTheme.textSecondary, marginBottom: 15, fontSize: 14 }}>{t('chooseMassPart').toUpperCase()}</Text>

            {(['pembukaan', 'punggutan', 'persembahan', 'komuni', 'kesyukuran', 'penutup'] as const).map((part) => (
              <TouchableOpacity
                key={part}
                style={[styles.massPartOption, { borderBottomColor: currentColorTheme.border }]}
                onPress={() => handleAddToMass(part)}
              >
                <Text style={[styles.massPartOptionText, { color: currentColorTheme.text }]}>{t(part).toUpperCase()}</Text>
                <ChevronRight size={20} color={currentColorTheme.textSecondary} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalCloseButton, { marginTop: 10 }]}
              onPress={() => setShowMassModal(false)}
            >
              <Text style={{ color: '#ff4444', fontWeight: '600' }}>{t('cancel').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Lapor Lirik */}
      <ReportLyricsModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        songId={isUserSong ? t('lagusaya') : song.id}
        songTitle={song.title}
        appVersion={appVersion}
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
  creditFooter: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditFooterDark: {
    backgroundColor: '#2a2a2a',
    borderTopColor: '#333',
  },
  creditText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  playStoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  playStoreIcon: {
    marginRight: 6,
  },
  playStoreText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
    letterSpacing: 0,
    marginTop: 0,
  },
  creditTextDark: {
    color: '#aaa',
  },
  captureHeader: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  captureId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  captureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  captureAuthor: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  captureBackground: {
    backgroundColor: '#ffffff',
    padding: 20,
    minHeight: '100%',
  },
  hiddenCaptureContainer: {
    position: 'absolute',
    left: 20, // Make it visible on screen
    top: 100, // Position it below header
    right: 20,
    width: undefined, // Let it take full width minus margins
    minHeight: 500,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingBottom: 40,
    borderWidth: 2,
    borderColor: '#000000',
    zIndex: 9999, // Put it on top
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
    marginTop: Platform.OS === 'ios' ? 2 : 0,
  },
  titleContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 2 : 0,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
  headerAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  darkAuthorText: {
    color: '#aaa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  darkContent: {
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 1,
  },
  songInfo: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  lyrics: {
    fontSize: 16,
    lineHeight: 24,
  },
  chorusContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  chorusHeader: {
    fontWeight: 'bold',
    width: 80,
  },
  chorusFirstLine: {
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 0,
  },
  boldLineContainer: {
    marginLeft: 0,
    marginBottom: 4,
  },
  chorusLineContainer: {
    marginLeft: 80,
    marginBottom: 4,
  },
  chorusLine: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 2 : 0,
  },
  favoriteButton: {
    padding: 5,
    marginRight: 5,
  },
  bottomSpacing: {
    height: 120,
  },
  mainButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1001,
  },
  darkShareButton: {
    backgroundColor: '#333',
  },
  fabMenuContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 176 : 146,
    right: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    padding: 20,
    width: '90%',
    maxWidth: 380,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    zIndex: 1000,
  },
  fabMenuContainerDark: {
    backgroundColor: '#2a2a2a',
  },
  fabHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  fabCloseButtonInside: {
    padding: 4,
  },
  fontSizeControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    width: '100%',
    padding: 4,
    justifyContent: 'space-between',
  },
  fontSizeButton: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontLabelContainer: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemsContainer: {
    width: '100%',
  },
  fabMenuItemWide: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  fabMenuIcon: {
    marginRight: 16,
  },
  fabMenuText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navigationContainerDark: {
    borderTopColor: '#2a2a2a',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonDark: {
    backgroundColor: '#333',
  },
  navButtonDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  navButtonDisabledDark: {
    backgroundColor: '#252525',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 6,
    color: '#333',
  },
  navButtonTextDark: {
    color: '#eee',
  },
  navButtonTextDisabled: {
    color: '#aaa',
  },
  navButtonTextDisabledDark: {
    color: '#666',
  },
  massSelectionModal: {
    width: '80%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  massPartOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  massPartOptionText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    alignItems: 'center',
    padding: 10,
  },
});
