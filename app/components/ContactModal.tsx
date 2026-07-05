import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Mail, AlertCircle, ChevronRight } from 'lucide-react-native';
import { Linking } from 'react-native';

interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestLyricsReport?: () => void;
  developerEmail?: string;
}

export default function ContactModal({
  visible,
  onClose,
  onRequestLyricsReport,
  developerEmail = 'tytusdl@gmail.com',
}: ContactModalProps) {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();

  const handleGeneralEmail = async () => {
    const subject = t('contactEmailSubjectGeneral');
    const body = t('contactEmailBodyGeneral');
    const mailtoUrl = `mailto:${developerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(mailtoUrl);
      onClose();
    } catch (e) {
      console.warn('Could not open email app:', e);
      Alert.alert(
        t('alertError'),
        currentLanguage === 'Melayu'
          ? 'Tiada aplikasi emel dijumpai pada peranti ini.'
          : 'No email app found on this device.',
        [{ text: t('close'), onPress: onClose }]
      );
    }
  };

  const handleLyricsReport = () => {
    onClose();
    // Parent (SettingScreen) akan trigger ReportLyricsModal dengan empty fields
    setTimeout(() => {
      onRequestLyricsReport?.();
    }, 250); // beri masa modal ni close dulu
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          isDarkMode && styles.darkModalContainer,
          { backgroundColor: currentColorTheme.surface }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Mail size={22} color={currentColorTheme.primary} style={{ marginRight: 8 }} />
              <Text style={[
                styles.title,
                isDarkMode && { color: '#fff' },
                { color: currentColorTheme.text }
              ]}>
                {t('contactTitle')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#fff' : currentColorTheme.text} />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text style={[styles.subtitle, isDarkMode && { color: '#aaa' }]}>
            {t('contactSubtitle')}
          </Text>

          {/* Option 1: General Inquiry */}
          <TouchableOpacity
            style={[
              styles.option,
              {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              }
            ]}
            onPress={handleGeneralEmail}
            activeOpacity={0.7}
          >
            <View style={[
              styles.optionIcon,
              { backgroundColor: isDarkMode ? 'rgba(72,114,244,0.18)' : 'rgba(72,114,244,0.1)' }
            ]}>
              <Mail size={22} color="#4872F4" />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, isDarkMode && { color: '#fff' }, { color: currentColorTheme.text }]}>
                {t('contactGeneral')}
              </Text>
              <Text style={[styles.optionDesc, isDarkMode && { color: '#888' }]}>
                {t('contactGeneralDesc')}
              </Text>
            </View>
            <ChevronRight size={20} color={isDarkMode ? '#666' : '#999'} />
          </TouchableOpacity>

          {/* Option 2: Lyrics Report */}
          {onRequestLyricsReport && (
            <TouchableOpacity
              style={[
                styles.option,
                {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                }
              ]}
              onPress={handleLyricsReport}
              activeOpacity={0.7}
            >
              <View style={[
                styles.optionIcon,
                { backgroundColor: isDarkMode ? 'rgba(226,45,45,0.18)' : 'rgba(226,45,45,0.1)' }
              ]}>
                <AlertCircle size={22} color="#E22D2D" />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, isDarkMode && { color: '#fff' }, { color: currentColorTheme.text }]}>
                  {t('contactLyricsReport')}
                </Text>
                <Text style={[styles.optionDesc, isDarkMode && { color: '#888' }]}>
                  {t('contactLyricsReportDesc')}
                </Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#666' : '#999'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  darkModalContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 18,
    lineHeight: 19,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    paddingRight: 6,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
    color: '#000',
  },
  optionDesc: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
});