import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft, Save, Clipboard as ClipboardIcon, AlertCircle,
  Music, FileText, Type, Sparkles, Check
} from 'lucide-react-native';
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

// Detect section labels at the start of a line. Matches Malay & English
// variants of chorus/intro/verse/bridge/pre-chorus markers followed by
// an optional parenthetical (e.g. "Chorus (x2):"). Anything after the
// colon on the same line is treated as the first lyric line of that section.
const SECTION_REGEX = /^(\s*)([A-Za-z\u00C0-\u017F][A-Za-z0-9\u00C0-\u017F \-'/&.]*?)\s*(\([^)]*\))?\s*:\s*(.*)$/;

interface SectionInfo {
  type: 'chorus' | 'intro' | 'verse' | 'bridge' | 'pre-chorus' | 'other';
  label: string;
  content: string;
}

// Lightweight heuristic — if a line looks like a section label (short,
// ends with ":", no chord markers), classify it. We classify by matching
// the label text against a small dictionary; anything else falls back to "verse".
function classifySectionLabel(rawLabel: string): SectionInfo['type'] {
  const label = rawLabel.toLowerCase().trim();
  if (/(chorus|korus|refren|refrain|ref|cho|refr|chorus\s*\d)/.test(label)) return 'chorus';
  if (/(intro|pengenalan|introduction)/.test(label)) return 'intro';
  if (/(bridge| jambatan)/.test(label)) return 'bridge';
  if (/(pre[\s-]?chorus|pre[\s-]?korus)/.test(label)) return 'pre-chorus';
  if (/(verse|bait|ayat|strofe|stanza)/.test(label)) return 'verse';
  return 'other';
}

interface PreviewLine {
  text: string;
  isSectionLabel: boolean;
  sectionType?: SectionInfo['type'];
  isEmpty: boolean;
}

function parseLyricsForPreview(lyrics: string): PreviewLine[] {
  if (!lyrics) return [];
  const lines = lyrics.split('\n');
  return lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      return { text: '', isSectionLabel: false, isEmpty: true };
    }
    const match = line.match(SECTION_REGEX);
    if (match) {
      const [, leadingWs = '', rawLabel = '', , rest = ''] = match.map((m: string | undefined) => m ?? '');
      // Section labels are short. Anything longer than ~30 chars after the
      // colon is more likely a regular lyric line that happened to contain
      // a colon, so we only treat very short ones as labels.
      const labelClean = (rawLabel + (match[3] ?? '')).trim();
      if (labelClean.length > 0 && labelClean.length <= 40) {
        const sectionType = classifySectionLabel(rawLabel);
        return {
          text: (leadingWs + labelClean + ': ' + rest).trim(),
          isSectionLabel: true,
          sectionType,
          isEmpty: false,
        };
      }
    }
    return { text: line, isSectionLabel: false, isEmpty: false };
  });
}

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

  // Parse lirik jadi preview — detect Chorus/Intro/Verse markers
  const previewLines = useMemo(() => parseLyricsForPreview(lyrics), [lyrics]);

  // Kira section stats (berapa chorus, intro, etc.)
  const sectionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ln of previewLines) {
      if (ln.isSectionLabel && ln.sectionType) {
        counts[ln.sectionType] = (counts[ln.sectionType] || 0) + 1;
      }
    }
    return counts;
  }, [previewLines]);

  // Bila skrin dibuka, semak clipboard untuk cadangan lirik (auto-detect)
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await Clipboard.getStringAsync();
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

  // Theme-aware colors for the floating label / focused state
  const labelColor = currentColorTheme.text;
  const inputBg = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const inputBorder = isDarkMode ? '#2A2A2A' : '#E5E5E5';
  const inputBorderFocused = currentColorTheme.primary;
  const inputTextColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDarkMode ? '#A8A8A8' : '#666666';

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={[styles.container, isDarkMode && styles.containerDark, { backgroundColor: currentColorTheme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header — modern sticky bar that blends seamlessly with body color */}
        <View style={[
          styles.header,
          isDarkMode && styles.headerDark,
          { backgroundColor: currentColorTheme.background }
        ]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton} disabled={isSaving}>
            <ArrowLeft size={24} color={isDarkMode ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[styles.headerTitle, { color: currentColorTheme.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t('addSongTitle')}
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: secondaryTextColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title.trim() || (currentLanguage === 'Melayu' ? 'Tajuk belum diisi' : 'No title yet')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSaveSong}
            style={[
              styles.saveButton,
              { backgroundColor: isSaveDisabled ? (isDarkMode ? '#333' : '#E0E0E0') : '#27ae60' }
            ]}
            disabled={isSaving || isSaveDisabled}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Save size={18} color={isSaveDisabled ? '#888' : '#fff'} />
            )}
            <Text style={[
              styles.saveButtonText,
              isSaveDisabled && { color: isDarkMode ? '#666' : '#888' }
            ]} numberOfLines={1}>{t('saveButton')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Paste suggestion banner */}
          {pasteSuggestion && (
            <TouchableOpacity
              style={[
                styles.pasteSuggestionBanner,
                { backgroundColor: `${currentColorTheme.primary}14`, borderColor: `${currentColorTheme.primary}55` },
              ]}
              onPress={handlePasteSuggestion}
              activeOpacity={0.8}
            >
              <ClipboardIcon size={18} color={currentColorTheme.primary} />
              <View style={styles.pasteSuggestionTextContainer}>
                <Text style={[styles.pasteSuggestionTitle, { color: currentColorTheme.primary }]}>
                  {t('pasteDetected')}
                </Text>
                <Text
                  style={[styles.pasteSuggestionPreview, { color: secondaryTextColor }]}
                  numberOfLines={2}
                >
                  {pasteSuggestion.substring(0, 100)}{pasteSuggestion.length > 100 ? '...' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={handleDismissPasteSuggestion} style={styles.pasteSuggestionClose}>
                <AlertCircle size={18} color={secondaryTextColor} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}

          {/* Title field — modern card with icon */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <View style={styles.labelLeft}>
                <Music size={14} color={currentColorTheme.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.label, { color: labelColor }]}>
                  {t('songTitleLabel')}
                </Text>
              </View>
              <Text style={[styles.charCount, { color: secondaryTextColor }]}>
                {titleStats.length}
              </Text>
            </View>
            <View style={[
              styles.inputCard,
              {
                backgroundColor: inputBg,
                borderColor: title.length > 0 ? inputBorderFocused : inputBorder,
                borderWidth: title.length > 0 ? 1.5 : 1,
              },
            ]}>
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder={t('songTitlePlaceholder')}
                placeholderTextColor={secondaryTextColor}
                value={title}
                onChangeText={setTitle}
                editable={!isSaving}
                maxLength={200}
              />
            </View>
          </View>

          {/* Lyrics field — modern card with stats */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <View style={styles.labelLeft}>
                <FileText size={14} color={currentColorTheme.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.label, { color: labelColor }]}>
                  {t('songLyricsLabel')}
                </Text>
              </View>
              <View style={styles.metaRow}>
                {lyricsStats.lineCount > 0 && (
                  <Text style={[styles.metaCount, { color: secondaryTextColor }]}>
                    {t('songLinesCount', { count: String(lyricsStats.lineCount) })}
                  </Text>
                )}
                {lyricsStats.charCount > 0 && lyricsStats.lineCount > 0 && (
                  <Text style={[styles.metaSeparator, { color: secondaryTextColor }]}>·</Text>
                )}
                {lyricsStats.charCount > 0 && (
                  <Text style={[styles.metaCount, { color: secondaryTextColor }]}>
                    {t('songCharacterCount', { count: String(lyricsStats.charCount) })}
                  </Text>
                )}
              </View>
            </View>

            {/* Section stats badges (Chorus, Intro, etc.) */}
            {Object.keys(sectionStats).length > 0 && (
              <View style={styles.sectionBadgesRow}>
                {sectionStats.chorus !== undefined && (
                  <View style={[styles.sectionBadge, { backgroundColor: `${currentColorTheme.primary}1F`, borderColor: `${currentColorTheme.primary}55` }]}>
                    <Text style={[styles.sectionBadgeText, { color: currentColorTheme.primary }]}>
                      Chorus × {sectionStats.chorus}
                    </Text>
                  </View>
                )}
                {sectionStats.verse !== undefined && (
                  <View style={[styles.sectionBadge, styles.sectionBadgeMuted]}>
                    <Text style={[styles.sectionBadgeText, { color: secondaryTextColor }]}>
                      Verse × {sectionStats.verse}
                    </Text>
                  </View>
                )}
                {sectionStats.intro !== undefined && (
                  <View style={[styles.sectionBadge, styles.sectionBadgeMuted]}>
                    <Text style={[styles.sectionBadgeText, { color: secondaryTextColor }]}>
                      Intro × {sectionStats.intro}
                    </Text>
                  </View>
                )}
                {sectionStats.bridge !== undefined && (
                  <View style={[styles.sectionBadge, styles.sectionBadgeMuted]}>
                    <Text style={[styles.sectionBadgeText, { color: secondaryTextColor }]}>
                      Bridge × {sectionStats.bridge}
                    </Text>
                  </View>
                )}
                {sectionStats['pre-chorus'] !== undefined && (
                  <View style={[styles.sectionBadge, styles.sectionBadgeMuted]}>
                    <Text style={[styles.sectionBadgeText, { color: secondaryTextColor }]}>
                      Pre-Chorus × {sectionStats['pre-chorus']}
                    </Text>
                  </View>
                )}
                {sectionStats.other !== undefined && (
                  <View style={[styles.sectionBadge, styles.sectionBadgeMuted]}>
                    <Text style={[styles.sectionBadgeText, { color: secondaryTextColor }]}>
                      Section × {sectionStats.other}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={[
              styles.inputCard,
              {
                backgroundColor: inputBg,
                borderColor: lyrics.length > 0 ? inputBorderFocused : inputBorder,
                borderWidth: lyrics.length > 0 ? 1.5 : 1,
              },
            ]}>
              <TextInput
                style={[styles.input, styles.lyricsInput, { color: inputTextColor }]}
                placeholder={t('songLyricsPlaceholder')}
                placeholderTextColor={secondaryTextColor}
                value={lyrics}
                onChangeText={setLyrics}
                multiline
                editable={!isSaving}
                textAlignVertical="top"
              />
            </View>

            {/* Live preview — shows detected section labels (Chorus, etc.)
                in bold + tinted colors so the user can see how the song
                will render. Non-section lines stay normal text. */}
            {previewLines.length > 0 && (
              <View style={[
                styles.previewCard,
                {
                  backgroundColor: isDarkMode ? '#0F0F0F' : '#FAFAFA',
                  borderColor: inputBorder,
                },
              ]}>
                <View style={styles.previewHeader}>
                  <Sparkles size={12} color={currentColorTheme.primary} />
                  <Text style={[styles.previewHeaderText, { color: secondaryTextColor }]}>
                    {currentLanguage === 'Melayu' ? 'Begini Rupanya' : 'How it looks'}
                  </Text>
                </View>
                {previewLines.map((ln, idx) => {
                  if (ln.isEmpty) {
                    return <View key={idx} style={styles.previewEmptyLine} />;
                  }
                  if (ln.isSectionLabel && ln.sectionType === 'chorus') {
                    return (
                      <Text
                        key={idx}
                        style={[styles.previewText, styles.previewChorus, { color: currentColorTheme.primary }]}
                      >
                        {ln.text}
                      </Text>
                    );
                  }
                  if (ln.isSectionLabel && (ln.sectionType === 'verse' || ln.sectionType === 'intro' || ln.sectionType === 'bridge' || ln.sectionType === 'pre-chorus')) {
                    return (
                      <Text
                        key={idx}
                        style={[styles.previewText, styles.previewSection, { color: inputTextColor }]}
                      >
                        {ln.text}
                      </Text>
                    );
                  }
                  if (ln.isSectionLabel) {
                    return (
                      <Text
                        key={idx}
                        style={[styles.previewText, styles.previewSection, { color: secondaryTextColor }]}
                      >
                        {ln.text}
                      </Text>
                    );
                  }
                  return (
                    <Text
                      key={idx}
                      style={[styles.previewText, { color: inputTextColor }]}
                    >
                      {ln.text}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>

          {/* Tips card */}
          <View style={[
            styles.tipCard,
            {
              backgroundColor: isDarkMode ? '#1A1A1A' : '#FFF8E1',
              borderColor: isDarkMode ? '#3A3A2A' : '#FFE082',
            },
          ]}>
            <View style={styles.tipHeader}>
              <Sparkles size={14} color="#FFA000" />
              <Text style={[styles.tipHeaderText, { color: isDarkMode ? '#FFCA28' : '#E65100' }]}>
                {currentLanguage === 'Melayu' ? 'Tip Format Lirik' : 'Lyrics Format Tips'}
              </Text>
            </View>
            <Text style={[styles.tipText, { color: isDarkMode ? '#E0E0E0' : '#5D4037' }]}>
              {currentLanguage === 'Melayu'
                ? '• Taip "Chorus:" atau "Korus:" untuk tandakan bahagian korus — ia akan dipaparkan tebal.'
                : '• Type "Chorus:" or "Refrain:" to mark the chorus — it will be displayed in bold.'}
            </Text>
          </View>

          {/* Validation hint at the bottom */}
          {(!title.trim() || !lyrics.trim()) && (
            <View style={styles.validationHint}>
              <AlertCircle size={14} color={secondaryTextColor} />
              <Text style={[styles.validationHintText, { color: secondaryTextColor }]}>
                {currentLanguage === 'Melayu'
                  ? 'Isi kedua-dua tajuk & lirik untuk simpan'
                  : 'Fill in both title & lyrics to save'}
              </Text>
            </View>
          )}
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
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerDark: {
    backgroundColor: '#0a0a0a',
  },
  headerButton: {
    padding: 6,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 6,
    marginRight: 10,
    minWidth: 0, // important: allow text inside to shrink/truncate
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
    // Soft shadow
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 22,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
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
    fontWeight: '500',
  },
  metaSeparator: {
    fontSize: 12,
  },
  // Modern card-style input
  inputCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
  },
  lyricsInput: {
    minHeight: 220,
    paddingTop: 14,
    lineHeight: 22,
  },
  // Section badges (live count of chorus/verse/intro)
  sectionBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
  },
  sectionBadgeMuted: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(120,120,120,0.25)',
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Live preview card
  previewCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  previewHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  previewText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  previewChorus: {
    fontWeight: '800',
    fontSize: 16,
    marginTop: 4,
  },
  previewSection: {
    fontWeight: '700',
    fontSize: 15,
    marginTop: 4,
  },
  previewEmptyLine: {
    height: 8,
  },
  // Paste suggestion banner
  pasteSuggestionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  pasteSuggestionTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  pasteSuggestionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  pasteSuggestionPreview: {
    fontSize: 12,
    lineHeight: 16,
  },
  pasteSuggestionClose: {
    padding: 4,
  },
  // Tips card
  tipCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
  },
  // Validation hint
  validationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
  },
  validationHintText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});