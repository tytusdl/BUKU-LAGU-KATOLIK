import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useLyricsReports, LyricsReport, LyricsReportType } from '../context/LyricsReportContext';
import { X, Trash2, Copy, FileText, Music2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LyricsReportsListModalProps {
  visible: boolean;
  onClose: () => void;
}

const TYPE_KEY_BY_VALUE: Record<LyricsReportType, string> = {
  wrong_word: 'reportTypeWrongWord',
  missing_line: 'reportTypeMissingLine',
  extra_line: 'reportTypeExtraLine',
  chords: 'reportTypeChords',
  other: 'reportTypeOther',
};

export default function LyricsReportsListModal({
  visible,
  onClose,
}: LyricsReportsListModalProps) {
  const { isDarkMode, currentColorTheme } = useTheme();
  const { currentLanguage, t } = useLanguage();
  const { reports, removeReport, clearAllReports, exportReportsAsText } = useLyricsReports();
  const insets = useSafeAreaInsets();

  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  const handleExport = async () => {
    if (reports.length === 0) {
      Alert.alert(t('reportAllTitle'), t('reportAllEmpty'));
      return;
    }
    const text = await exportReportsAsText();
    await Clipboard.setStringAsync(text);
    showToast(t('reportExportSuccess'));
  };

  const handleDelete = (report: LyricsReport) => {
    Alert.alert(
      t('deleteConfirmTitle'),
      `${report.songId} - ${report.songTitle}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('reportDeleteOne'),
          style: 'destructive',
          onPress: () => removeReport(report.id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (reports.length === 0) return;
    Alert.alert(
      t('reportAllTitle'),
      t('reportClearAllConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('reportClearAll'),
          style: 'destructive',
          onPress: () => clearAllReports(),
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          isDarkMode && styles.darkModalContainer,
          {
            backgroundColor: currentColorTheme.surface,
            paddingBottom: Math.max(insets.bottom, 20) + 8,
          }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <FileText size={22} color={currentColorTheme.primary} style={{ marginRight: 8 }} />
              <Text style={[
                styles.title,
                isDarkMode && { color: '#fff' },
                { color: currentColorTheme.text }
              ]}>
                {t('reportAllTitle')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#fff' : currentColorTheme.text} />
            </TouchableOpacity>
          </View>

          {/* Subheader (count) */}
          {reports.length > 0 && (
            <View style={styles.subheader}>
              <Text style={[styles.countText, isDarkMode && { color: '#888' }]}>
                {reports.length} {t('reportAllCount')}
              </Text>
              <View style={styles.subheaderActions}>
                <TouchableOpacity onPress={handleExport} style={styles.iconButton}>
                  <Copy size={18} color={currentColorTheme.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearAll} style={styles.iconButton}>
                  <Trash2 size={18} color="#E22D2D" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {reports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FileText size={48} color={isDarkMode ? '#444' : '#ccc'} />
                <Text style={[styles.emptyText, isDarkMode && { color: '#888' }]}>
                  {t('reportAllEmpty')}
                </Text>
              </View>
            ) : (
              reports.map((report) => {
                const date = new Date(report.createdAt);
                const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                const typeKey = TYPE_KEY_BY_VALUE[report.type];

                return (
                  <View
                    key={report.id}
                    style={[
                      styles.reportCard,
                      {
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      }
                    ]}
                  >
                    {/* Song header */}
                    <View style={styles.cardHeader}>
                      <Music2 size={14} color={currentColorTheme.primary} style={{ marginRight: 6 }} />
                      <Text
                        style={[styles.songText, isDarkMode && { color: '#fff' }, { color: currentColorTheme.text }]}
                        numberOfLines={1}
                      >
                        {report.songId} - {report.songTitle}
                      </Text>
                    </View>

                    {/* Type badge */}
                    <View style={[
                      styles.typeBadge,
                      {
                        backgroundColor: currentColorTheme.primary === '#ffffff'
                          ? 'rgba(72,114,244,0.12)'
                          : `${currentColorTheme.primary}25`,
                      }
                    ]}>
                      <Text style={[styles.typeBadgeText, { color: currentColorTheme.primary === '#ffffff' ? '#4872F4' : currentColorTheme.primary }]}>
                        {t(typeKey)}
                      </Text>
                    </View>

                    {/* Description */}
                    <Text style={[styles.description, isDarkMode && { color: '#ddd' }]}>
                      {report.description}
                    </Text>

                    {/* Footer row: contact + date + delete */}
                    <View style={styles.cardFooter}>
                      <View style={styles.cardFooterLeft}>
                        {report.contact ? (
                          <Text style={[styles.contactText, isDarkMode && { color: '#888' }]} numberOfLines={1}>
                            {report.contact}
                          </Text>
                        ) : null}
                        <Text style={[styles.dateText, isDarkMode && { color: '#666' }]}>
                          {dateStr} · v{report.appVersion}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDelete(report)}
                        style={styles.deleteButton}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={16} color="#E22D2D" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity
            style={[
              styles.footerButton,
              { backgroundColor: currentColorTheme.primary === '#ffffff' ? '#4872F4' : currentColorTheme.primary }
            ]}
            onPress={onClose}
          >
            <Text style={styles.footerButtonText}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
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
  subheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  countText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  subheaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    maxHeight: 520,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 12,
  },
  reportCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  songText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 19,
    color: '#333',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  cardFooterLeft: {
    flex: 1,
  },
  contactText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  footerButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});