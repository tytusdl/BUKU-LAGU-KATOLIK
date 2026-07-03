import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { Music, X, Save, ChevronRight, ClipboardPaste } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';
import { useMySongs, UserSong } from '../context/MySongsContext';
import { useLanguage } from '../context/LanguageContext';
import { parseSongShareLink } from '../utils/songLink';

const CLIPPBOARD_CHECK_KEY = 'last_clipboard_check_hash';
const DISMISSED_HASHES_KEY = 'dismissed_clipboard_hashes';
const HASH_MAX_ENTRIES = 50;

type Props = {
  // Boleh dimatikan dari parent (cth masa user tengah dalam flow lain)
  enabled?: boolean;
};

/**
 * Auto-detect clipboard untuk lagu-pozoo://savesong
 * - Bila app buka / route masuk My Songs, komponen ini scan clipboard.
 * - Kalau ada link lagu yang belum pernah di-tolak & belum disimpan, tunjuk modal preview.
 * - State "ditolak" disimpan dalam AsyncStorage supaya tak muncul lagi untuk link yang sama.
 */
export default function SharedLinkPreviewModal({ enabled = true }: Props) {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { addMySongWithId, mySongs } = useMySongs();
  const { t } = useLanguage();

  const [visible, setVisible] = useState(false);
  const [previewSong, setPreviewSong] = useState<UserSong | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasCheckedThisMount, setHasCheckedThisMount] = useState(false);
  const dismissedHashesRef = useRef<Set<string>>(new Set());

  // Muat dismissed hashes sekali
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await import('@react-native-async-storage/async-storage').then(m => m.default.getItem(DISMISSED_HASHES_KEY));
        if (active && raw) {
          const arr = JSON.parse(raw) as string[];
          dismissedHashesRef.current = new Set(arr);
        }
      } catch {
        // ignore
      }
    })();
    return () => { active = false; };
  }, []);

  // Fungsi check clipboard
  const checkClipboard = async () => {
    if (!enabled) return;
    try {
      const text = await Clipboard.getStringAsync();
      if (!text) return;

      // Hash ringkas untuk track "pernah tengok link ni"
      const hash = `${text.length}:${text.substring(0, 32)}`;
      if (dismissedHashesRef.current.has(hash)) return;

      // Skip kalau hash sama dengan last check (elak muncul setiap kali focus)
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const lastHash = await AsyncStorage.getItem(CLIPPBOARD_CHECK_KEY);
      if (lastHash === hash) return;

      const parsed = parseSongShareLink(text);
      if (!parsed.success) return;

      // Skip kalau lagu ni dah ada dalam My Songs
      const exists = mySongs.some(s => s.id === parsed.song.id);
      if (exists) {
        // Tandakan sebagai seen supaya tak check lagi
        await AsyncStorage.setItem(CLIPPBOARD_CHECK_KEY, hash);
        return;
      }

      // Simpan hash supaya tak重复 tunjuk
      await AsyncStorage.setItem(CLIPPBOARD_CHECK_KEY, hash);

      setPreviewSong(parsed.song);
      setVisible(true);
    } catch {
      // fail silently — clipboard access boleh throw pada sesetengah platform
    }
  };

  // Check pertama kali bila mount, dan setiap 5 saat bila app aktif (untuk tangkap link yang baru copy)
  useEffect(() => {
    if (hasCheckedThisMount) return;
    setHasCheckedThisMount(true);
    // Delay sikit supaya splash habis dan app ready
    const timer = setTimeout(() => { checkClipboard(); }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistDismissedHashes = async (hash: string) => {
    try {
      const set = new Set(dismissedHashesRef.current);
      set.add(hash);
      // Bound supaya tak membesar无限
      const arr = Array.from(set).slice(-HASH_MAX_ENTRIES);
      dismissedHashesRef.current = new Set(arr);
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem(DISMISSED_HASHES_KEY, JSON.stringify(arr));
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    if (!previewSong || isSaving) return;
    setIsSaving(true);
    try {
      const result = await addMySongWithId({
        ...previewSong,
        sourceAdded: 'shared',
        createdAt: Date.now(),
      });
      if (result.success) {
        Alert.alert(t('saveSuccessTitle'), t('saveSuccessMessage').replace('{songTitle}', previewSong.title));
        setVisible(false);
        setPreviewSong(null);
      } else {
        Alert.alert(t('saveFailTitle'), result.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDismiss = async () => {
    if (previewSong) {
      const hash = `${previewSong.id}`;
      await persistDismissedHashes(hash);
    }
    setVisible(false);
    setPreviewSong(null);
  };

  if (!previewSong) return null;

  const lineCount = previewSong.lyrics.split('\n').filter(l => l.trim().length > 0).length;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleDismiss}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.card,
          isDarkMode ? styles.cardDark : null,
          { backgroundColor: currentColorTheme.surface, borderColor: currentColorTheme.border }
        ]}>
          {/* Header strip biru-ungu untuk indicate "shared" */}
          <View style={styles.accentStrip} />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleDismiss}
            disabled={isSaving}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <X size={20} color={currentColorTheme.textSecondary} />
          </TouchableOpacity>

          {/* Icon bulat */}
          <View style={[styles.iconCircle, { backgroundColor: '#3498db20' }]}>
            <ClipboardPaste size={28} color="#3498db" />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: currentColorTheme.text }]}>
            {t('sharedLinkDetectedTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: currentColorTheme.textSecondary }]}>
            {t('sharedLinkDetectedSubtitle')}
          </Text>

          {/* Song preview box */}
          <View style={[
            styles.previewBox,
            isDarkMode ? styles.previewBoxDark : null,
            { borderColor: currentColorTheme.border }
          ]}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewIconSmall, { backgroundColor: '#27ae6020' }]}>
                <Music size={16} color="#27ae60" />
              </View>
              <Text style={[styles.previewLabel, { color: currentColorTheme.textSecondary }]}>
                {t('sharedLinkSongPreview')}
              </Text>
            </View>
            <Text
              style={[styles.previewTitle, { color: currentColorTheme.text }]}
              numberOfLines={2}
            >
              {previewSong.title}
            </Text>
            <Text style={[styles.previewMeta, { color: currentColorTheme.textSecondary }]}>
              {t('songLinesCount', { count: String(lineCount) })}
            </Text>
            <Text
              style={[styles.previewLyrics, { color: currentColorTheme.textSecondary }]}
              numberOfLines={3}
            >
              {previewSong.lyrics}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.dismissButton,
                { borderColor: currentColorTheme.border }
              ]}
              onPress={handleDismiss}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              <Text style={[styles.dismissButtonText, { color: currentColorTheme.textSecondary }]}>
                {t('sharedLinkDismiss')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Save size={18} color="#fff" />
                  <Text style={styles.saveButtonText}>{t('sharedLinkSaveButton')}</Text>
                  <ChevronRight size={16} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 18,
    padding: 22,
    paddingTop: 28,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardDark: {
    elevation: 16,
  },
  accentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3498db',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  previewBox: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  previewBoxDark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewIconSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewMeta: {
    fontSize: 12,
    marginBottom: 8,
  },
  previewLyrics: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#27ae60',
    gap: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
