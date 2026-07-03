import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Clipboard as ClipboardIcon, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from './context/ThemeContext';
import { useMySongs } from './context/MySongsContext';
import { translations } from '../src/translations';
import { useLanguage } from './context/LanguageContext';

// Kira bilangan baris lirik yang bukan kosong
const countLyricsLines = (lyrics: string): number => {
  if (!lyrics) return 0;
  return lyrics.split('\n').filter(line => line.trim().length > 0).length;
};

export default function AddSongScreen() {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { addMySong } = useMySongs();
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pasteSuggestion, setPasteSuggestion] = useState<string | null>(null);
  const { currentLanguage, t } = useLanguage();

  // Kira metadata secara live (debounce tak perlu — cheap computation)
  const lyricsStats = useMemo(() => {
    const trimmed = lyrics.trim();
    const lineCount = countLyricsLines(lyrics);
    const charCount = trimmed.length;
    return { lineCount, charCount };
  }, [lyrics]);

  const titleStats = useMemo(() => ({
    length: title.trim().length,
  }), [title]);

  // Bila skrin dibuka, semak clipboard untuk cadangan lirik (auto-detect)
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await Clipboard.getStringAsync();
        // Auto-suggest cuma kalau:
        // 1. Ada teks dalam clipboard
        // 2. Lebih dari 50 aksara (minimum lirik)
        // 3. Bukan URL lagu-pozoo:// (itu untuk paste modal, bukan di sini)
        // 4. Bukan format @MYSONG@ share (ada format sendiri)
        if (
          text &&
          text.trim().length > 50 &&
          !text.startsWith('lagu-pozoo://') &&
          !text.startsWith('@MYSONG@')
        ) {
          setPasteSuggestion(text);
        }
      } catch {
        // Clipboard read might fail on some platforms — fail silently
      }
    };
    checkClipboard();
  }, []);

  const handlePasteSuggestion = () => {
    if (pasteSuggestion) {
      setLyrics(pasteSuggestion);
      setPasteSuggestion(null);
    }
  };

  const handleDismissPasteSuggestion = () => {
    setPasteSuggestion(null);
  };

  const handleSaveSong = async () => {
    if (!title.trim() || !lyrics.trim()) {
      Alert.alert(t('alertAttention'), t('alertEmptyInput'));
      return;
    }
    setIsSaving(true);
    try {
      await addMySong({ title: title.trim(), lyrics: lyrics.trim() });
      router.back();
    } catch (error) {
      console.error("Gagal menyimpan lagu:", error);
      Alert.alert(t('alertError'), t('alertFailedSave'));
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled = !title.trim() || !lyrics.trim();

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark, { backgroundColor: currentColorTheme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={[styles.header, isDarkMode && styles.headerDark, { backgroundColor: currentColorTheme.surface, borderBottomColor: currentColorTheme.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton} disabled={isSaving}>
            <ArrowLeft size={24} color={isDarkMode ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColorTheme.text }]}>{t('addSongTitle')}</Text>
          <TouchableOpacity
            onPress={handleSaveSong}
            style={[
              styles.saveButton,
              { backgroundColor: isSaveDisabled ? (isDarkMode ? '#333' : '#ccc') : '#27ae60' }
            ]}
            disabled={isSaving || isSaveDisabled}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Save size={18} color="#fff" />
            )}
            <Text style={styles.saveButtonText}>{t('saveButton')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Paste suggestion banner — muncul bila clipboard ada teks panjang yang mungkin lirik */}
          {pasteSuggestion && (
            <TouchableOpacity
              style={[
                styles.pasteSuggestionBanner,
                isDarkMode && styles.pasteSuggestionBannerDark
              ]}
              onPress={handlePasteSuggestion}
              activeOpacity={0.8}
            >
              <ClipboardIcon size={18} color={isDarkMode ? '#a0c4ff' : '#3498db'} />
              <View style={styles.pasteSuggestionTextContainer}>
                <Text style={[styles.pasteSuggestionTitle, { color: currentColorTheme.text }]}>
                  {t('pasteDetected')}
                </Text>
                <Text
                  style={[styles.pasteSuggestionPreview, { color: currentColorTheme.textSecondary }]}
                  numberOfLines={2}
                >
                  {pasteSuggestion.substring(0, 100)}{pasteSuggestion.length > 100 ? '...' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={handleDismissPasteSuggestion} style={styles.pasteSuggestionClose}>
                <AlertCircle size={18} color={currentColorTheme.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}

          {/* Title field */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: currentColorTheme.text }]}>
                {t('songTitleLabel')}
              </Text>
              <Text style={[styles.charCount, { color: currentColorTheme.textSecondary }]}>
                {titleStats.length}
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                isDarkMode && styles.inputDark,
                { backgroundColor: currentColorTheme.surface, borderColor: currentColorTheme.border, color: currentColorTheme.text }
              ]}
              placeholder={t('songTitlePlaceholder')}
              placeholderTextColor={currentColorTheme.textSecondary}
              value={title}
              onChangeText={setTitle}
              editable={!isSaving}
              maxLength={200}
            />
          </View>

          {/* Lyrics field */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: currentColorTheme.text }]}>
                {t('songLyricsLabel')}
              </Text>
              <View style={styles.metaRow}>
                <Text style={[styles.metaCount, { color: currentColorTheme.textSecondary }]}>
                  {lyricsStats.lineCount > 0
                    ? t('songLinesCount', { count: String(lyricsStats.lineCount) })
                    : ''}
                </Text>
                {lyricsStats.charCount > 0 && lyricsStats.lineCount > 0 && (
                  <Text style={[styles.metaSeparator, { color: currentColorTheme.textSecondary }]}>·</Text>
                )}
                <Text style={[styles.metaCount, { color: currentColorTheme.textSecondary }]}>
                  {lyricsStats.charCount > 0
                    ? t('songCharacterCount', { count: String(lyricsStats.charCount) })
                    : ''}
                </Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.lyricsInput,
                isDarkMode && styles.inputDark,
                { backgroundColor: currentColorTheme.surface, borderColor: currentColorTheme.border, color: currentColorTheme.text }
              ]}
              placeholder={t('songLyricsPlaceholder')}
              placeholderTextColor={currentColorTheme.textSecondary}
              value={lyrics}
              onChangeText={setLyrics}
              multiline
              editable={!isSaving}
              textAlignVertical="top"
            />
          </View>

          {/* Tip kecil di bawah — beri hint pada user pasal format lirik yang baik */}
          <View style={styles.tipContainer}>
            <Text style={[styles.tipText, { color: currentColorTheme.textSecondary }]}>
              ✏️ {currentLanguage === 'Melayu'
                ? 'Tip: Gunakan baris kosong antara bait untuk pemformatan yang lebih jelas.'
                : 'Tip: Use blank lines between verses for clearer formatting.'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerDark: {
    backgroundColor: '#1f1f1f',
    borderBottomColor: '#333',
  },
  headerButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaCount: {
    fontSize: 12,
  },
  metaSeparator: {
    fontSize: 12,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  inputDark: {
    borderColor: '#444',
    color: '#fff',
  },
  lyricsInput: {
    minHeight: 320,
    paddingTop: 14,
  },
  // Paste suggestion banner
  pasteSuggestionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b8d8f0',
  },
  pasteSuggestionBannerDark: {
    backgroundColor: '#1a2a3a',
    borderColor: '#2a4a6a',
  },
  pasteSuggestionTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  pasteSuggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  pasteSuggestionPreview: {
    fontSize: 12,
    lineHeight: 16,
  },
  pasteSuggestionClose: {
    padding: 4,
  },
  tipContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});