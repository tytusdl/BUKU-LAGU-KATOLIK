import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export interface UpdateMetadata {
  version: string;
  releaseNotes?: {
    Melayu: string[];
    English: string[];
  };
  forceUpdate?: boolean;
  url?: string;
  iosUrl?: string;
  isOtaUpdate?: boolean;
}

interface UpdateModalProps {
  visible: boolean;
  metadata: UpdateMetadata | null;
  currentVersion: string;
  isDownloading: boolean;
  onIgnore: () => void;
  onUpdateNow: () => void;
}

export default function UpdateModal({
  visible,
  metadata,
  currentVersion,
  isDownloading,
  onIgnore,
  onUpdateNow,
}: UpdateModalProps) {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();

  if (!visible || !metadata) return null;

  const isForceUpdate = metadata.forceUpdate === true;
  const lang = (currentLanguage === 'Melayu' || currentLanguage === 'English') ? currentLanguage : 'Melayu';
  
  // Extract release notes list
  const notes = metadata.releaseNotes ? metadata.releaseNotes[lang] : [];

  // Helper to format update message with version strings
  const getUpdateMessage = () => {
    const rawMessage = t('updateAppMessage');
    return rawMessage
      .replace('{newVersion}', metadata.version)
      .replace('{currentVersion}', currentVersion);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={isForceUpdate ? undefined : onIgnore}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          isDarkMode && { backgroundColor: '#1c1c1e', borderColor: '#333', borderWidth: 1 },
          { backgroundColor: currentColorTheme.surface }
        ]}>
          <Text style={[
            styles.title,
            isDarkMode && { color: '#fff' },
            { color: currentColorTheme.text }
          ]}>
            {t('updateAppTitle')}
          </Text>

          <Text style={[
            styles.messageText,
            isDarkMode && { color: '#ccc' },
            { color: currentColorTheme.textSecondary || '#555' }
          ]}>
            {getUpdateMessage()}
          </Text>

          {notes && notes.length > 0 && (
            <View style={styles.releaseNotesContainer}>
              <Text style={[
                styles.releaseNotesTitle,
                isDarkMode && { color: '#aaa' },
                { color: currentColorTheme.textSecondary || '#666' }
              ]}>
                {t('releaseNotesLabel')}
              </Text>
              <ScrollView 
                style={styles.notesScrollView} 
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {notes.map((note, index) => (
                  <View key={index} style={styles.noteItem}>
                    <Text style={[styles.bullet, isDarkMode && { color: '#fff' }]}>•</Text>
                    <Text style={[
                      styles.noteText,
                      isDarkMode && { color: '#bbb' },
                      { color: currentColorTheme.textSecondary || '#444' }
                    ]}>
                      {note}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {isDownloading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={currentColorTheme.primary} />
              <Text style={[
                styles.loadingText,
                { color: currentColorTheme.primary }
              ]}>
                {t('downloadingUpdate')}
              </Text>
            </View>
          ) : (
            <View style={styles.actionsContainer}>
              {!isForceUpdate && (
                <TouchableOpacity 
                  onPress={onIgnore} 
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.buttonText, 
                    styles.ignoreButtonText,
                    isDarkMode && { color: '#aaa' }
                  ]}>
                    {t('ignoreUpdate')}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={onUpdateNow} 
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.buttonText, 
                  { color: currentColorTheme.primary === '#ffffff' ? '#4872F4' : currentColorTheme.primary }
                ]}>
                  {t('updateNow')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '92%',
    maxHeight: '75%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 16,
  },
  releaseNotesContainer: {
    maxHeight: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  releaseNotesTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesScrollView: {
    flexGrow: 0,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#333',
    marginTop: -1,
  },
  noteText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ignoreButtonText: {
    color: '#666',
  },
});
