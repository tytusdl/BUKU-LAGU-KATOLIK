import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../../src/translations';
import { X } from 'lucide-react-native';
import { changelogData } from '../data/changelog'; // Import data
import { useLanguage } from '../context/LanguageContext';

interface ChangelogModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ChangelogModal({ visible, onClose }: ChangelogModalProps) {
    const { isDarkMode, currentColorTheme } = useTheme();
    const { currentLanguage, t } = useLanguage();

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={[
                    styles.modalContainer,
                    isDarkMode && { backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1 },
                    { backgroundColor: currentColorTheme.surface }
                ]}>
                    <View style={styles.header}>
                        <Text style={[
                            styles.title,
                            isDarkMode && { color: '#fff' },
                            { color: currentColorTheme.text }
                        ]}>
                            {t('whatsNew')}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={isDarkMode ? '#fff' : currentColorTheme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {(() => {
                            // Automatically display the latest version's changelog
                            const entry = changelogData[0];

                            if (!entry) return <Text>No details available.</Text>;

                            return (
                                <>
                                    <View style={styles.versionContainer}>
                                        <Text style={[
                                            styles.versionText,
                                            { backgroundColor: 'rgba(72, 114, 244, 0.1)' }, // Fixed background opacity
                                            { color: '#4872F4' }
                                        ]}>v{entry.version}</Text>
                                    </View>

                                    <View style={styles.changeList}>
                                        {entry.changes.map((change, index) => {
                                            const lang: 'Melayu' | 'English' = (currentLanguage === 'Melayu' || currentLanguage === 'English') ? currentLanguage : 'Melayu';
                                            const text = change.text[lang];
                                            const note = change.note ? change.note[lang] : null;

                                            return (
                                                <View key={index} style={styles.changeItem}>
                                                    <Text style={[styles.bullet, isDarkMode && { color: '#fff' }]}>•</Text>
                                                    <Text style={styles.changeText}>
                                                        <Text style={{ color: isDarkMode ? '#ddd' : '#444' }}>
                                                            {text}
                                                        </Text>
                                                        {note && (
                                                            <Text style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.8, color: isDarkMode ? '#aaa' : '#666' }}>
                                                                {'\n'}{note}
                                                            </Text>
                                                        )}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </>
                            );
                        })()}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.okButton,
                                { backgroundColor: currentColorTheme.primary }
                            ]}
                            onPress={onClose}
                        >
                            <Text style={styles.okButtonText}>
                                {t('close')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>);
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
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        marginBottom: 20,
    },
    versionContainer: {
        marginBottom: 16,
    },
    versionText: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'rgba(72, 114, 244, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        overflow: 'hidden',
    },
    changeList: {
        gap: 12,
    },
    changeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 18,
        marginRight: 8,
        color: '#333',
        marginTop: -2,
    },
    changeText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    okButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
