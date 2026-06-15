import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, RotateCcw, RotateCw } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useMySongs } from '../context/MySongsContext'; // Import context untuk edit/baca
import { useLanguage } from '../context/LanguageContext';

export default function EditSongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Dapatkan ID lagu dari laluan
  const { isDarkMode } = useTheme();
  const { mySongs, editMySong } = useMySongs(); // Dapatkan fungsi editMySong dan data mySongs

  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const { currentLanguage, t } = useLanguage();
  const [history, setHistory] = useState<{ title: string, lyrics: string }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Muat data lagu dan inisialisasi sejarah
  useEffect(() => {
    const songToEdit = mySongs.find(song => song.id === id);
    if (songToEdit) {
      const initialState = { title: songToEdit.title, lyrics: songToEdit.lyrics };
      setTitle(initialState.title);
      setLyrics(initialState.lyrics);
      setHistory([initialState]); // Sejarah awal
      setHistoryIndex(0);         // Indeks sejarah awal
      setIsLoading(false);
    } else {
      // Lagu tidak ditemui (sepatutnya tidak berlaku jika navigasi betul)
      Alert.alert(t('error'), t('songNotFoundForEdit'));
      router.back();
    }
  }, [id, mySongs]);

  // Fungsi untuk mengemas kini sejarah apabila teks berubah
  const updateHistory = useCallback((newTitle: string, newLyrics: string) => {
    const newState = { title: newTitle, lyrics: newLyrics };
    // Jangan tambah ke sejarah jika sama dengan state semasa dalam sejarah
    if (historyIndex >= 0 &&
      newState.title === history[historyIndex].title &&
      newState.lyrics === history[historyIndex].lyrics) {
      return;
    }

    const currentHistory = history.slice(0, historyIndex + 1); // Buang sejarah redo
    const updatedHistory = [...currentHistory, newState];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  }, [history, historyIndex]);

  // Gunakan useEffect untuk memanggil updateHistory selepas state title/lyrics berubah
  // Ini cara yang lebih selamat untuk memastikan kita menggunakan state terkini
  useEffect(() => {
    // Hanya kemas kini sejarah jika bukan disebabkan oleh undo/redo/load awal
    // Semak jika state semasa berbeza dari state dalam sejarah di indeks semasa
    if (historyIndex >= 0 &&
      (title !== history[historyIndex].title || lyrics !== history[historyIndex].lyrics)) {
      // Pertimbangkan untuk debounce di sini jika perlu
      updateHistory(title, lyrics);
    }
  }, [title, lyrics, history, historyIndex, updateHistory]);

  // Fungsi Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      // Set state secara terus tanpa trigger useEffect sejarah
      setTitle(previousState.title);
      setLyrics(previousState.lyrics);
      setHistoryIndex(newIndex);
    }
  };

  // Fungsi Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      // Set state secara terus tanpa trigger useEffect sejarah
      setTitle(nextState.title);
      setLyrics(nextState.lyrics);
      setHistoryIndex(newIndex);
    }
  };

  // Fungsi untuk Reset ke Asal (dipanggil onLongPress)
  const handleResetToOriginal = () => {
    // Hanya reset jika ada sejarah dan tidak berada di state asal
    if (history.length > 0 && historyIndex > 0) {
      const initialState = history[0];
      // Set state secara terus
      setTitle(initialState.title);
      setLyrics(initialState.lyrics);
      setHistoryIndex(0); // Kembali ke indeks asal
    }
  };

  const handleSaveChanges = async () => {
    if (!title.trim() || !lyrics.trim()) {
      Alert.alert(t('attention'), t('enterTitleAndLyrics'));
      return;
    }
    if (!id) { // Semakan tambahan jika id tiada
      Alert.alert(t('error'), t('invalidSongId'));
      return;
    }

    setIsSaving(true);
    try {
      await editMySong(id, { title: title.trim(), lyrics: lyrics.trim() });
      // Kembali ke skrin lirik selepas edit
      // Mungkin perlu refresh skrin sebelumnya atau guna router.replace?
      router.back();
    } catch (error) {
      console.error("Gagal mengedit lagu:", error);
      Alert.alert(t('error'), t('failedToSave'));
    } finally {
      setIsSaving(false);
    }
  };

  // Kira jika ada perubahan (berbanding state asal dalam sejarah)
  const hasChanges = historyIndex > 0;

  // Paparkan loading indicator jika data belum dimuat
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#000'} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        {/* Header */}
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton} disabled={isSaving}>
            <ArrowLeft size={24} color={isDarkMode ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>{t('editSong')}</Text>
          <View style={styles.headerRightButtons}>
            <TouchableOpacity
              onPress={handleUndo}
              onLongPress={handleResetToOriginal}
              style={styles.headerButton}
              disabled={historyIndex <= 0 || isSaving || isLoading}
            >
              <RotateCcw
                size={24}
                color={historyIndex <= 0 || isSaving || isLoading ? '#aaa' : (isDarkMode ? '#FFF' : '#000')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRedo}
              style={styles.headerButton}
              disabled={historyIndex >= history.length - 1 || isSaving || isLoading}
            >
              <RotateCw
                size={24}
                color={historyIndex >= history.length - 1 || isSaving || isLoading ? '#aaa' : (isDarkMode ? '#FFF' : '#000')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveChanges}
              style={styles.headerButton}
              disabled={historyIndex <= 0 || isSaving || isLoading}
            >
              {isSaving ?
                <ActivityIndicator color={isDarkMode ? '#FFF' : '#000'} size="small" /> :
                <Save
                  size={24}
                  color={historyIndex <= 0 || isSaving || isLoading ? '#aaa' : (isDarkMode ? '#FFF' : '#000')}
                />
              }
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Input Tajuk */}
          <Text style={[styles.label, isDarkMode && styles.textDark]}>{t('songTitle')}</Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder={t('songTitlePlaceholder')}
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={title}
            onChangeText={setTitle}
            editable={!isSaving}
          />

          {/* Input Lirik */}
          <Text style={[styles.label, isDarkMode && styles.textDark]}>{t('songLyrics')}</Text>
          <TextInput
            style={[styles.input, styles.lyricsInput, isDarkMode && styles.inputDark]}
            placeholder={t('songLyricsPlaceholder')}
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={lyrics}
            onChangeText={setLyrics}
            multiline
            editable={!isSaving}
            scrollEnabled={true}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Salin gaya dari add-song.tsx (atau import jika mahu)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#fff', },
  headerDark: { backgroundColor: '#1f1f1f', borderBottomColor: '#333', },
  headerButton: { padding: 6, },
  headerTitle: { fontSize: 18, fontWeight: 'bold', },
  textDark: { color: '#fff', },
  scrollContainer: {
    padding: 20,
    flexGrow: 1
  },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '500', color: '#333', },
  input: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', color: '#000', },
  inputDark: { backgroundColor: '#2a2a2a', borderColor: '#444', color: '#fff', },
  lyricsInput: {
    textAlignVertical: 'top',
    flex: 1,
    minHeight: 200,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 