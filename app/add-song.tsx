import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { useMySongs } from './context/MySongsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../src/translations';
import { useLanguage } from './context/LanguageContext';

export default function AddSongScreen() {
  const { isDarkMode } = useTheme();
  const { addMySong } = useMySongs();
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { currentLanguage, t } = useLanguage();

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

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton} disabled={isSaving}>
            <ArrowLeft size={24} color={isDarkMode ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>{t('addSongTitle')}</Text>
          <TouchableOpacity onPress={handleSaveSong} style={styles.headerButton} disabled={isSaving}>
            {isSaving ?
              <ActivityIndicator color={isDarkMode ? '#FFF' : '#000'} /> :
              <Save size={24} color={isDarkMode ? '#FFF' : '#000'} />
            }
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.label, isDarkMode && styles.textDark]}>{t('songTitleLabel')}</Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder={t('songTitlePlaceholder')}
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={title}
            onChangeText={setTitle}
            editable={!isSaving}
          />

          <Text style={[styles.label, isDarkMode && styles.textDark]}>{t('songLyricsLabel')}</Text>
          <TextInput
            style={[styles.input, styles.lyricsInput, isDarkMode && styles.inputDark]}
            placeholder={t('songLyricsPlaceholder')}
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={lyrics}
            onChangeText={setLyrics}
            multiline
            editable={!isSaving}
          />
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
  },
  textDark: {
    color: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  lyricsInput: {
    height: 680
    ,
    textAlignVertical: 'top',
  },
}); 