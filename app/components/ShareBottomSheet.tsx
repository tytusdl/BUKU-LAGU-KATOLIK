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
import { LucideIcon } from 'lucide-react-native';

export interface ShareOption {
  id: string;
  label: string;
  /** Optional short description rendered below the label. */
  description?: string;
  icon: LucideIcon;
  /** Tinted background color for the icon circle. */
  iconBg: string;
  /** Color of the icon itself. */
  iconColor: string;
  onPress: () => void;
}

interface ShareBottomSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: ShareOption[];
  cancelText?: string;
  onCancel: () => void;
}

export default function ShareBottomSheet({
  visible,
  title,
  subtitle,
  options,
  cancelText = 'Cancel',
  onCancel,
}: ShareBottomSheetProps) {
  const { isDarkMode, currentColorTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const surfaceColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const overlayColor = isDarkMode ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)';
  const titleColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtitleColor = isDarkMode ? '#A8A8A8' : '#6F6F6F';
  const cardBg = isDarkMode ? '#252525' : '#FAFAFA';
  const cardBorder = isDarkMode ? '#2F2F2F' : '#EFEFEF';
  const cardLabelColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const cancelBg = isDarkMode ? '#2A2A2A' : '#F2F2F2';
  const cancelTextColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: overlayColor }]}
        activeOpacity={1}
        onPress={onCancel}
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
          {/* Drag handle — pure decorative, but a familiar affordance. */}
          <View
            style={[
              styles.handle,
              { backgroundColor: isDarkMode ? '#3A3A3A' : '#D8D8D8' },
            ]}
          />

          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          </View>

          {subtitle && (
            <Text style={[styles.subtitle, { color: subtitleColor }]}>
              {subtitle}
            </Text>
          )}

          <ScrollView
            style={styles.optionsScroll}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {options.map((opt) => {
              const IconComp = opt.icon;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: cardBorder,
                    },
                  ]}
                  onPress={() => {
                    onCancel();
                    // Defer the action so the modal close animation doesn't
                    // conflict with the share/copy UI.
                    setTimeout(opt.onPress, 280);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: opt.iconBg },
                    ]}
                  >
                    <IconComp size={26} color={opt.iconColor} strokeWidth={2} />
                  </View>
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: cardLabelColor },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {opt.description && (
                      <Text
                        style={[
                          styles.optionDescription,
                          { color: subtitleColor },
                        ]}
                        numberOfLines={2}
                      >
                        {opt.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: cancelBg }]}
            onPress={onCancel}
          >
            <Text style={[styles.cancelText, { color: cancelTextColor }]}>
              {cancelText}
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
    // Floating sheet shadow
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
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  optionsScroll: {
    maxHeight: 360,
  },
  optionsContent: {
    gap: 10,
    paddingBottom: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
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
