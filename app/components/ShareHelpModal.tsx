import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Share2 } from 'lucide-react-native';

interface ShareHelpModalProps {
  visible: boolean;
  title: string;
  steps: string[];
  closeText: string;
  onClose: () => void;
  /** Optional tip text shown in an info card above the steps. */
  tipText?: string;
}

export default function ShareHelpModal({
  visible,
  title,
  steps,
  closeText,
  onClose,
  tipText,
}: ShareHelpModalProps) {
  const { isDarkMode, currentColorTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const surfaceColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const overlayColor = isDarkMode ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)';
  const titleColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtitleColor = isDarkMode ? '#B0B0B0' : '#5F6368';
  const stepBg = isDarkMode ? '#252525' : '#F8F9FA';
  const stepBorder = isDarkMode ? '#2F2F2F' : '#EFEFEF';
  const stepTextColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const cancelBg = isDarkMode ? '#2A2A2A' : '#F2F2F2';
  const cancelTextColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const accentColor = currentColorTheme.primary;

  // Pick a readable text color for the step badge based on the primary's
  // luminance — keeps the badge readable across all 7 themes + dark mode.
  const isAccentLight = (() => {
    const cleaned = accentColor.replace('#', '');
    if (cleaned.length !== 6) return false;
    const r = parseInt(cleaned.slice(0, 2), 16) / 255;
    const g = parseInt(cleaned.slice(2, 4), 16) / 255;
    const b = parseInt(cleaned.slice(4, 6), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.6;
  })();
  const accentTextColor = isAccentLight ? '#000000' : '#FFFFFF';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: overlayColor }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={[
            styles.sheet,
            {
              backgroundColor: surfaceColor,
              paddingBottom: Math.max(20, insets.bottom + 12),
            },
          ]}
        >
          <View
            style={[
              styles.handle,
              { backgroundColor: isDarkMode ? '#3A3A3A' : '#D8D8D8' },
            ]}
          />

          <View style={styles.headerRow}>
            <View
              style={[
                styles.headerIconCircle,
                { backgroundColor: `${accentColor}22` },
              ]}
            >
              <Share2 size={22} color={accentColor} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
            </View>
          </View>

          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            Ikut langkah ini untuk kongsi lagu dengan orang lain:
          </Text>

          {tipText && (
            <View
              style={[
                styles.introCard,
                {
                  backgroundColor: isDarkMode
                    ? `${accentColor}1A`
                    : `${accentColor}14`,
                  borderColor: `${accentColor}55`,
                },
              ]}
            >
              <Text
                style={[styles.introText, { color: stepTextColor }]}
                numberOfLines={4}
              >
                {tipText}
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.stepsScroll}
            contentContainerStyle={styles.stepsContent}
            showsVerticalScrollIndicator={false}
          >
            {steps.map((step, idx) => (
              <View
                key={idx}
                style={[
                  styles.stepCard,
                  { backgroundColor: stepBg, borderColor: stepBorder },
                ]}
              >
                <View
                  style={[
                    styles.stepBadge,
                    { backgroundColor: accentColor },
                  ]}
                >
                  <Text
                    style={[styles.stepBadgeText, { color: accentTextColor }]}
                  >
                    {idx + 1}
                  </Text>
                </View>
                <Text
                  style={[styles.stepText, { color: stepTextColor }]}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  {step}
                </Text>
                {idx < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      { backgroundColor: isDarkMode ? '#333' : '#E0E0E0' },
                    ]}
                  />
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: cancelBg }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: cancelTextColor }]}>
              {closeText}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    marginTop: 6,
  },
  stepsScroll: {
    maxHeight: 400,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    gap: 10,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  stepsContent: {
    gap: 10,
    paddingBottom: 4,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
  },
  stepConnector: {
    position: 'absolute',
    bottom: -8,
    left: 28,
    width: 2,
    height: 6,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});