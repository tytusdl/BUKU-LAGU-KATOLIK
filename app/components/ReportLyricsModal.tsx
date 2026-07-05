import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
 Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useLyricsReports, LyricsReportType } from '../context/LyricsReportContext';
import { X, AlertCircle, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReportLyricsModalProps {
  visible: boolean;
  onClose: () => void;
  songId: string;
  songTitle: string;
  appVersion: string;
  developerEmail?: string;
}

const REPORT_TYPES: { value: LyricsReportType; key: string }[] = [
  { value: 'wrong_word', key: 'reportTypeWrongWord' },
  { value: 'missing_line', key: 'reportTypeMissingLine' },
  { value: 'extra_line', key: 'reportTypeExtraLine' },
  { value: 'chords', key: 'reportTypeChords' },
  { value: 'other', key: 'reportTypeOther' },
];

// Pick a readable text color for a given background using relative luminance.
// If the bg is light (luminance > 0.6), return black; otherwise return white.
// This keeps selected chips & primary buttons legible across all 7 light
// themes and the dark theme — including the white-theme dark-mode where
// the primary is pure white.
function readableTextOn(hex: string): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6 && cleaned.length !== 8) return '#000000';
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  // Approx sRGB luminance
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.6 ? '#000000' : '#FFFFFF';
}

export default function ReportLyricsModal({
  visible,
  onClose,
  songId,
  songTitle,
  appVersion,
  developerEmail = 'tytusdl@gmail.com',
}: ReportLyricsModalProps) {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();
  const { addReport } = useLyricsReports();
  const insets = useSafeAreaInsets();

  const [selectedType, setSelectedType] = useState<LyricsReportType>('wrong_word');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form bila modal dibuka/tutup
  useEffect(() => {
    if (visible) {
      setSelectedType('wrong_word');
      setDescription('');
      setContact('');
      setIsSubmitting(false);
    }
  }, [visible]);

  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert(
        currentLanguage === 'Melayu' ? 'Perhatian' : 'Attention',
        currentLanguage === 'Melayu'
          ? 'Sila masukkan penerangan masalah lirik.'
          : 'Please enter a description of the lyrics issue.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Simpan ke AsyncStorage dulu (sentiasa berjaya kalau app berfungsi)
      await addReport({
        songId,
        songTitle,
        type: selectedType,
        description: description.trim(),
        contact: contact.trim(),
        appVersion,
        language: currentLanguage,
      });

      // 2 Cuba buka emel app dengan prefill (best effort)
      const subject = `${t('reportEmailSubject')} ${songId} - ${songTitle}`;
      const bodyLines = [
        t('reportEmailBody'),
        '',
        `${t('reportSongInfo')}: ${songId} - ${songTitle}`,
        `${t('reportType')}: ${t(`reportType${selectedType
          .split('_')
          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
          .join('')}`)}`,
        `${t('reportDescription')}: ${description.trim()}`,
        `${t('reportContact')}: ${contact.trim() || (currentLanguage === 'Melayu' ? '(tiada)' : '(none)')}`,
        `App Version: ${appVersion}`,
        '',
        '---',
        'Dikirim dari Aplikasi Buku Lagu Katolik (Pozoo)',
      ];
      const mailtoUrl = `mailto:${developerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      let emailOpened = false;
      try {
        await Linking.openURL(mailtoUrl);
        emailOpened = true;
      } catch (e) {
        console.warn('Could not open email app:', e);
      }

      if (emailOpened) {
        showToast(t('reportSuccessMessage'));
      } else {
        Alert.alert(
          t('reportSavedLocallyTitle'),
          t('reportSavedLocallyMessage'),
          [{ text: t('close'), onPress: onClose }]
        );
        return;
      }

      onClose();
    } catch (error) {
      console.error('Failed to save lyrics report:', error);
      Alert.alert(t('alertError'), 'Gagal menyimpan laporan. Sila cuba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = description.length;
  const charLimit = 500;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[
          styles.modalContainer,
          isDarkMode && styles.darkModalContainer,
          {
            backgroundColor: currentColorTheme.surface,
            paddingBottom: Platform.OS === 'ios' ? 32 : Math.max(20, insets.bottom + 12),
          }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <AlertCircle size={22} color={currentColorTheme.primary} style={{ marginRight: 8 }} />
              <Text style={[
                styles.title,
                isDarkMode && { color: '#fff' },
                { color: currentColorTheme.text }
              ]}>
                {t('reportLyricsTitle')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={isSubmitting}>
              <X size={24} color={isDarkMode ? '#fff' : currentColorTheme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Intro */}
            <Text style={[
              styles.intro,
              isDarkMode && { color: '#bbb' }
            ]}>
              {t('reportLyricsIntro')}
            </Text>

            {/* Song info badge */}
            <View style={[
              styles.songBadge,
              {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              }
            ]}>
              <Text style={[styles.songBadgeLabel, isDarkMode && { color: '#888' }]}>
                {t('reportSongInfo')}:
              </Text>
              <Text style={[styles.songBadgeValue, isDarkMode && { color: '#fff' }]}>
                {songId} - {songTitle}
              </Text>
            </View>

            {/* Type label */}
            <Text style={[styles.fieldLabel, isDarkMode && { color: '#bbb' }]}>
              {t('reportTypeLabel')}
            </Text>

            {/* Type chips */}
            <View style={styles.typeChipsContainer}>
              {REPORT_TYPES.map((rt) => {
                const isSelected = selectedType === rt.value;
                return (
                  <TouchableOpacity
                    key={rt.value}
                    onPress={() => setSelectedType(rt.value)}
                    disabled={isSubmitting}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? currentColorTheme.primary
                          : (isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                        borderColor: isSelected
                          ? currentColorTheme.primary
                          : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                      }
                    ]}
                  >
                    {isSelected && (
                      <Check
                        size={14}
                        color={readableTextOn(currentColorTheme.primary)}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text style={[
                      styles.chipText,
                      {
                        color: isSelected
                          ? readableTextOn(currentColorTheme.primary)
                          : (isDarkMode ? '#ddd' : '#333'),
                        fontWeight: isSelected ? '700' : '500',
                      }
                    ]}>
                      {t(rt.key)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description label */}
            <Text style={[styles.fieldLabel, isDarkMode && { color: '#bbb' }]}>
              {t('reportDescriptionLabel')}
              <Text style={{ color: '#E22D2D' }}> *</Text>
            </Text>
            <TextInput
              style={[
                styles.textArea,
                isDarkMode && styles.darkTextArea,
                {
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
                  borderColor: isDarkMode ? '#444' : '#e0e0e0',
                  color: isDarkMode ? '#fff' : '#000',
                }
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder={t('reportDescriptionPlaceholder')}
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              multiline
              numberOfLines={4}
              maxLength={charLimit}
              editable={!isSubmitting}
              textAlignVertical="top"
            />
            <Text style={[
              styles.charCount,
              isDarkMode && { color: '#666' },
              charCount > charLimit - 50 && { color: '#E22D2D' }
            ]}>
              {charCount}/{charLimit} {t('reportCharacterCount')}
            </Text>

            {/* Contact (optional) */}
            <Text style={[styles.fieldLabel, isDarkMode && { color: '#bbb' }]}>
              {t('reportContactLabel')}
            </Text>
            <TextInput
              style={[
                styles.input,
                isDarkMode && styles.darkInput,
                {
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
                  borderColor: isDarkMode ? '#444' : '#e0e0e0',
                  color: isDarkMode ? '#fff' : '#000',
                }
              ]}
              value={contact}
              onChangeText={setContact}
              placeholder={t('reportContactPlaceholder')}
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              maxLength={80}
              editable={!isSubmitting}
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
                  opacity: isSubmitting ? 0.5 : 1,
                }
              ]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={[
                styles.cancelButtonText,
                { color: isDarkMode ? '#fff' : '#333' }
              ]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: currentColorTheme.primary },
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !description.trim()}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  { color: readableTextOn(currentColorTheme.primary) },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {isSubmitting ? t('reportSubmitting') : t('reportSubmit')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    maxHeight: '88%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  darkModalContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 480,
    marginBottom: 8,
  },
  intro: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 14,
  },
  songBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  songBadgeLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginRight: 6,
  },
  songBadgeValue: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    flexShrink: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 13,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 90,
    maxHeight: 160,
    backgroundColor: '#f8f8f8',
  },
  darkTextArea: {
    backgroundColor: '#2a2a2a',
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#f8f8f8',
  },
  darkInput: {
    backgroundColor: '#2a2a2a',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});