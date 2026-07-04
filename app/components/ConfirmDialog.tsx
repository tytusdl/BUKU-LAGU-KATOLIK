import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** When true, confirm button uses destructive (red) styling. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { isDarkMode, currentColorTheme } = useTheme();

  const overlayColor = isDarkMode ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)';
  const surfaceColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const titleColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const messageColor = isDarkMode ? '#B0B0B0' : '#5F6368';
  const cancelBg = isDarkMode ? '#2A2A2A' : '#F2F2F2';
  const cancelTextColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';

  // Confirm button: use theme primary (most identity-faithful) or red when destructive.
  const confirmBg = destructive
    ? '#E22D2D'
    : (isDarkMode ? currentColorTheme.primary : currentColorTheme.primary);
  const confirmTextColor = destructive
    ? '#FFFFFF'
    : (isDarkMode ? '#0A0A0A' : '#FFFFFF');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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
          style={[
            styles.dialog,
            { backgroundColor: surfaceColor },
          ]}
          // Stop the touch event from bubbling to the overlay so tapping
          // inside the dialog doesn't dismiss it.
          onPress={() => {}}
        >
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          <Text style={[styles.message, { color: messageColor }]}>
            {message}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: cancelBg }]}
              onPress={onCancel}
            >
              <Text
                style={[styles.buttonText, { color: cancelTextColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: confirmBg }]}
              onPress={onConfirm}
            >
              <Text
                style={[styles.buttonText, { color: confirmTextColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    // Soft elevation — feels like a floating card.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
