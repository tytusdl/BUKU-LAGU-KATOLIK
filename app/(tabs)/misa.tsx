import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Platform, Alert, Share, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useMass, MassSelection, MassSongSelection } from '../context/MassContext';
import { songIndex } from '../data/songs/songIndex';
import { Music, Search, X, Trash2, ChevronRight, Save, Info, Music2, Share as ShareIcon, PlayCircle, ChevronUp, ChevronDown, MessageSquare, Image as ImageIcon } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { useMySongs } from '../context/MySongsContext';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

type MassPart = keyof MassSelection;

export default function MisaScreen() {
    const { isDarkMode, currentColorTheme } = useTheme();
    const { massSelection, addSongToMassPart, removeSongFromMassPart, updateSongKeyInMassPart, clearMassSelection, reorderMassPart } = useMass();
    const { currentLanguage, t } = useLanguage();
    const { mySongs } = useMySongs();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activePart, setActivePart] = useState<MassPart | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCapturingImage, setIsCapturingImage] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const searchInputRef = useRef<TextInput>(null);
    const fullContentRef = useRef<View>(null);

    const actionColor = isDarkMode
        ? (currentColorTheme.id === 'white' ? '#ffffff' : currentColorTheme.primary)
        : currentColorTheme.primary;

    const massParts: { id: MassPart; label: string }[] = [
        { id: 'pembukaan', label: t('pembukaan') },
        { id: 'punggutan', label: t('punggutan') },
        { id: 'persembahan', label: t('persembahan') },
        { id: 'komuni', label: t('komuni') },
        { id: 'kesyukuran', label: t('kesyukuran') },
        { id: 'penutup', label: t('penutup') },
    ];

    const filteredSongs = useMemo(() => {
        const combined = [...songIndex, ...mySongs];
        if (searchQuery.trim() === '') return combined;
        return combined.filter(song =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, mySongs]);

    const handleSelectSong = (songId: string) => {
        if (activePart) {
            addSongToMassPart(activePart, songId);
            setIsModalVisible(false);
            setSearchQuery('');
        }
    };

    const handleUpdateKey = (part: MassPart, songId: string, key: string) => {
        if (massSelection[part]) {
            updateSongKeyInMassPart(part, songId, key);
        }
    };

    const getSongById = (id: string) => {
        const combined = [...songIndex, ...mySongs];
        return combined.find(s => s.id === id);
    };

    const handleClear = () => {
        Alert.alert(
            t('clearMass'),
            t('clearMassConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                { text: t('clearMass'), style: 'destructive', onPress: clearMassSelection }
            ]
        );
    };

    const moveSong = (partId: MassPart, index: number, direction: 'up' | 'down') => {
        const selections = [...(massSelection[partId] || [])];
        if (direction === 'up' && index > 0) {
            [selections[index - 1], selections[index]] = [selections[index], selections[index - 1]];
        } else if (direction === 'down' && index < selections.length - 1) {
            [selections[index + 1], selections[index]] = [selections[index], selections[index + 1]];
        } else {
            return;
        }
        reorderMassPart(partId, selections);
    };

    const handleShareText = async () => {
        try {
            // Increase delay for iPhone to ensure the modal is 100% closed
            // iOS will ignore Share.share if a modal is still in the middle of closing
            await new Promise(resolve => setTimeout(resolve, Platform.OS === 'ios' ? 800 : 400));

            const planTitle = (t('massTitle') || 'SENARAI LAGU').toUpperCase();
            let shareText = `*${planTitle}*\n\n`;

            massParts.forEach(part => {
                const selections = massSelection[part.id] || [];
                if (selections.length > 0) {
                    shareText += `*${part.label}*:\n`;
                    selections.forEach(sel => {
                        const song = getSongById(sel.songId);
                        if (song) {
                            shareText += `- [${song.id}] ${song.title}`;
                            if (sel.songKey) shareText += ` (${t('keyLabel')} ${sel.songKey})`;
                            shareText += '\n';
                        }
                    });
                    shareText += '\n';
                }
            });

            const isEmpty = massParts.every(part => (massSelection[part.id] || []).length === 0);
            if (isEmpty) {
                shareText += t('noSongsSelected');
            } else {
                shareText += `_${t('massServiceWish')}_`;
            }

            const result = await Share.share({
                message: shareText.trim(),
                title: planTitle, // Helps on iOS
            }, {
                // Android-only options:
                dialogTitle: planTitle,
                // iOS-only options:
                subject: planTitle,
            });

            if (result.action === Share.sharedAction) {
                console.log('Successfully shared');
            }
        } catch (error: any) {
            console.error('Error sharing text:', error);
            Alert.alert(
                t('error'),
                `${t('failShared')}: ${error.message || 'Unknown error'}`
            );
        }
    };

    const shareAsImage = async () => {
        try {
            setIsCapturingImage(true);
            await new Promise(resolve => setTimeout(resolve, 300)); // wait for UI update

            if (!fullContentRef.current) {
                setIsCapturingImage(false);
                return;
            }

            const uri = await captureRef(fullContentRef.current, {
                format: 'png',
                quality: 1,
                result: 'tmpfile'
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            }

            setIsCapturingImage(false);

            if (Platform.OS === 'android') {
                ToastAndroid.show(t('successShared'), ToastAndroid.LONG);
            }
        } catch (error) {
            console.error('Error sharing image:', error);
            setIsCapturingImage(false);
            Alert.alert(
                t('error'),
                t('failShared')
            );
        }
    };

    const handleShareOptions = () => {
        setShowShareModal(true);
    };

    const renderPlanList = () => {
        return massParts.map((part) => {
            const selections = massSelection[part.id] || [];
            const hasSongs = selections.length > 0;

            return (
                <View key={part.id} style={{ marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 4 }}>
                        <Text style={[styles.sectionTitleAbove, { color: isDarkMode ? '#ddd' : '#333' }]}>
                            {part.label.toUpperCase()}
                        </Text>

                        {hasSongs && !isCapturingImage && (
                            <TouchableOpacity
                                style={[styles.addMorePill, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f2f2f7' }]}
                                onPress={() => {
                                    setActivePart(part.id);
                                    setIsModalVisible(true);
                                }}
                            >
                                <Text style={[styles.addMoreText, { color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }]}>
                                    {t('addMore').toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={[
                        styles.partCard,
                        {
                            backgroundColor: currentColorTheme.surface,
                            borderColor: currentColorTheme.border,
                            marginBottom: 0,
                            padding: 0
                        }
                    ]}>

                        {hasSongs ? (
                            <View style={styles.songsList}>
                                {selections.map((selection, index) => {
                                    const song = getSongById(selection.songId);
                                    if (!song) return null;

                                    return (
                                        <View key={selection.songId} style={[
                                            styles.selectionInfo,
                                            index > 0 && styles.selectionBorder,
                                            index > 0 && { borderTopColor: currentColorTheme.border }
                                        ]}>
                                            <View style={styles.songMainRow}>
                                                {!isCapturingImage && (
                                                    <TouchableOpacity
                                                        style={styles.trashIconContainer}
                                                        onPress={() => removeSongFromMassPart(part.id, song.id)}
                                                    >
                                                        <Trash2 size={18} color="#ef4444" />
                                                    </TouchableOpacity>
                                                )}

                                                <TouchableOpacity
                                                    style={styles.songContentContainer}
                                                    onPress={() => {
                                                        const isUser = song.id.length > 6 && !isNaN(Number(song.id));
                                                        router.push({
                                                            pathname: "/song/[id]",
                                                            params: {
                                                                id: song.id,
                                                                fromMass: 'true',
                                                                isUserSong: isUser ? 'true' : 'false'
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <View style={[styles.songIdBadge, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
                                                        <Text style={[styles.songIdText, { color: isDarkMode ? '#fff' : '#555' }]}>
                                                            {song.id.length > 6 && !isNaN(Number(song.id)) ? 'LS' : song.id}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.songTitleInfo}>
                                                        <Text style={[styles.songTitle, { color: currentColorTheme.text }]}>{song.title.toUpperCase()}</Text>
                                                        {!isCapturingImage && (
                                                            <Text style={[styles.viewLyricsSmall, { color: '#888' }]}>{t('viewLyricsSmall').toUpperCase()}</Text>
                                                        )}
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={[styles.kodButtonContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f2f2f7', borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'transparent', borderWidth: 1 }]}>
                                                    <Music2 size={13} color={isDarkMode ? '#aaa' : '#888'} style={{ marginRight: 4 }} />
                                                    {!isCapturingImage ? (
                                                        <TextInput
                                                            style={[styles.kodInput, { color: currentColorTheme.text }]}
                                                            placeholder={t('keyLabel').replace(':', '')}
                                                            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
                                                            value={selection.songKey || ''}
                                                            onChangeText={(text) => handleUpdateKey(part.id, song.id, text.toUpperCase())}
                                                            maxLength={8}
                                                        />
                                                    ) : (
                                                        <Text style={[styles.kodTextStatic, { color: currentColorTheme.text }]}>{selection.songKey || '-'}</Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            !isCapturingImage && (
                                <TouchableOpacity
                                    style={styles.pilihLaguBox}
                                    onPress={() => {
                                        setActivePart(part.id);
                                        setIsModalVisible(true);
                                    }}
                                >
                                    <Music size={18} color={isDarkMode ? '#888' : '#666'} />
                                    <Text style={styles.pilihLaguText}>{t('selectSong')}</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>
            );
        });
    };

    return (
        <SafeAreaView
            edges={['top', 'left', 'right']}
            style={[styles.container, { backgroundColor: currentColorTheme.background }]}
        >
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: currentColorTheme.text }]}>{t('massTitle')}</Text>
                    <Text style={[styles.headerDescription, { color: currentColorTheme.textSecondary }]}>
                        {t('massDescription')}
                    </Text>
                </View>
                {!isCapturingImage && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8 }}>
                        <TouchableOpacity onPress={handleShareOptions} style={[styles.clearButton, { marginRight: 15 }]}>
                            <ShareIcon size={22} color={actionColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                            <Trash2 size={22} color={actionColor} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderPlanList()}
            </ScrollView>

            {isCapturingImage && (
                <View
                    ref={fullContentRef}
                    collapsable={false}
                    style={[styles.hiddenCaptureContainer, { padding: 15, paddingBottom: 15, paddingTop: 15, backgroundColor: '#ffffff' }]}
                >
                    <View style={[styles.header, { paddingHorizontal: 0, paddingTop: 0, paddingVertical: 5, marginBottom: 10, borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.headerTitle, { color: '#000', fontSize: 24, fontWeight: 'bold' }]}>{t('massTitle').toUpperCase()}</Text>
                            <Text style={[styles.headerDescription, { color: '#666', fontSize: 13, lineHeight: 18 }]}>
                                {t('shareQuote')}
                            </Text>
                        </View>
                    </View>

                    {massParts.map((part) => {
                        const selections = massSelection[part.id] || [];
                        if (selections.length === 0) return null;

                        return (
                            <View key={part.id} style={{ marginBottom: 16 }}>
                                <Text style={[styles.partLabel, { color: '#666666', fontSize: 10, marginBottom: 6, fontWeight: '900', textTransform: 'uppercase', marginLeft: 4, letterSpacing: 1 }]}>
                                    {part.label}
                                </Text>

                                <View style={[styles.partCard, { backgroundColor: '#f8f8f8', borderColor: '#eeeeee', padding: 0, borderRadius: 10, borderWidth: 1 }]}>
                                    <View style={styles.songsList}>
                                        {selections.map((selection, index) => {
                                            const song = getSongById(selection.songId);
                                            if (!song) return null;

                                            return (
                                                <View key={selection.songId} style={[
                                                    { paddingHorizontal: 12, paddingVertical: 10 },
                                                    index > 0 && { borderTopWidth: 1, borderTopColor: '#eeeeee' }
                                                ]}>
                                                    <View style={[styles.captureSongMainInfo, { paddingVertical: 0, flexDirection: 'row', alignItems: 'center' }]}>
                                                        <View style={[styles.captureSongIdBadge, { backgroundColor: '#ececec', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4, marginRight: 8 }]}>
                                                            <Text style={[styles.captureSongIdText, { color: '#555555', fontSize: 10, fontWeight: 'bold' }]}>
                                                                {song.id.length > 6 && !isNaN(Number(song.id)) ? 'LS' : song.id}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={[styles.captureSongTitle, { color: '#000000', fontSize: 13, fontWeight: '800' }]}>{song.title.toUpperCase()}</Text>
                                                        </View>
                                                        {selection.songKey && (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                                                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#777' }}>{currentLanguage === 'Melayu' ? 'KOD: ' : 'KEY: '}</Text>
                                                                <Text style={{ fontSize: 12, fontWeight: '900', color: '#000000' }}>{selection.songKey.toUpperCase()}</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            </View>
                        );
                    })}

                    <View style={[styles.creditFooter, { backgroundColor: '#f0f0f0', borderTopWidth: 0, marginTop: 8, borderRadius: 12, paddingVertical: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={[styles.creditText, { color: '#333', fontSize: 11, fontWeight: '900' }]}>
                            BUKU LAGU KATOLIK
                        </Text>
                        <Text style={{ marginHorizontal: 8, color: '#aaa', fontSize: 10 }}>|</Text>
                        <View style={[styles.playStoreContainer, { marginTop: 0 }]}>
                            <PlayCircle size={12} color="#666" style={{ marginRight: 4 }} />
                            <Text style={[styles.creditText, styles.playStoreText, { color: '#666', fontSize: 10 }]}>App Store & Google Play</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Song Selector Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
                onShow={() => {
                    if (Platform.OS === 'android') {
                        setTimeout(() => searchInputRef.current?.focus(), 100);
                    }
                }}
            >
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: currentColorTheme.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: currentColorTheme.text }]}>{t('selectSong')}</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeModalButton}>
                                <X size={24} color={currentColorTheme.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.modalSearchContainer, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
                            <Search size={20} color={currentColorTheme.textSecondary} />
                            <TextInput
                                ref={searchInputRef}
                                style={[styles.modalSearchInput, { color: currentColorTheme.text }]}
                                placeholder={t('searchPlaceholder')}
                                placeholderTextColor={currentColorTheme.textSecondary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus={Platform.OS === 'ios'}
                            />
                        </View>

                        <FlatList
                            style={{ flex: 1 }}
                            data={filteredSongs}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.songResultItem, { borderBottomColor: currentColorTheme.border }]}
                                    onPress={() => handleSelectSong(item.id)}
                                >
                                    <Text style={[styles.resultIdText, { color: isDarkMode ? currentColorTheme.primary : currentColorTheme.accent, fontWeight: 'bold', width: 50 }]}>
                                        {item.id.length > 6 && !isNaN(Number(item.id)) ? 'LS' : item.id}
                                    </Text>
                                    <Text style={[styles.resultTitle, { color: currentColorTheme.text }]} numberOfLines={1}>{item.title.toUpperCase()}</Text>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.modalListContent}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showShareModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowShareModal(false)}
            >
                <TouchableOpacity
                    style={styles.bottomSheetOverlay}
                    activeOpacity={1}
                    onPress={() => setShowShareModal(false)}
                >
                    <View style={[styles.bottomSheetContent, isDarkMode && styles.darkModalContent]}>
                        <View style={styles.bottomSheetIndicator} />

                        <View style={styles.bottomSheetHeader}>
                            <Text style={[styles.bottomSheetTitle, isDarkMode && styles.darkText]}>
                                {t('shareMassPlan')}
                            </Text>
                            <TouchableOpacity
                                style={styles.modalCloseButtonCircle}
                                onPress={() => setShowShareModal(false)}
                            >
                                <X size={20} color={isDarkMode ? "#fff" : "#333"} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.shareSubtitle, { color: isDarkMode ? '#888' : '#8c8c8c' }]}>
                            {t('chooseShareMethod')}
                        </Text>

                        <View style={styles.shareOptionsRow}>
                            <TouchableOpacity
                                style={[styles.shareOptionCard, { borderColor: isDarkMode ? '#333' : '#f0f0f0', backgroundColor: isDarkMode ? '#222' : '#fff' }]}
                                onPress={() => {
                                    setShowShareModal(false);
                                    setTimeout(handleShareText, 300);
                                }}
                            >
                                <View style={[styles.shareIconCircle, { backgroundColor: '#f0f7ff' }]}>
                                    <MessageSquare size={24} color="#4a90e2" />
                                </View>
                                <Text style={[styles.shareOptionText, isDarkMode && styles.darkText]}>{t('text')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.shareOptionCard, { borderColor: isDarkMode ? '#333' : '#f0f0f0', backgroundColor: isDarkMode ? '#222' : '#fff' }]}
                                onPress={() => {
                                    setShowShareModal(false);
                                    setTimeout(shareAsImage, 300);
                                }}
                            >
                                <View style={[styles.shareIconCircle, { backgroundColor: '#fff0f6' }]}>
                                    <ImageIcon size={24} color="#eb2f96" />
                                </View>
                                <Text style={[styles.shareOptionText, isDarkMode && styles.darkText]}>{t('image')}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.cancelShareButton, { backgroundColor: isDarkMode ? '#333' : '#f2f2f2' }]}
                            onPress={() => setShowShareModal(false)}
                        >
                            <Text style={[styles.cancelShareText, { color: isDarkMode ? '#fff' : '#000' }]}>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    headerDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    clearButton: {
        padding: 5,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 20,
    },
    creditFooter: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    creditText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
    hiddenCaptureContainer: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        width: undefined,
        backgroundColor: '#ffffff',
        padding: 20,
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        zIndex: 9999,
        borderRadius: 16,
    },
    playStoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    playStoreIcon: {
        marginRight: 6,
    },
    playStoreText: {
        fontSize: 12,
        fontWeight: 'normal',
        letterSpacing: 0,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: 'rgba(72, 114, 244, 0.1)',
    },
    infoIcon: {
        marginRight: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    sectionTitleAbove: {
        fontSize: 13,
        fontWeight: '900',
        marginLeft: 2,
        letterSpacing: 1.5,
    },
    partCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    partHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    partLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8e8e93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    addMorePill: {
        backgroundColor: '#f2f2f7',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    addMoreText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#000',
    },
    pilihLaguBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        margin: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e5e5e5',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    pilihLaguText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    songsList: {
        // No margin/padding here to allow items to handle their own space
    },
    selectionInfo: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    selectionBorder: {
        borderTopWidth: 1,
        borderTopColor: '#f8f8f8',
    },
    songMainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trashIconContainer: {
        padding: 6,
        marginRight: 4,
    },
    songContentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    songIdBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
        minWidth: 40,
        alignItems: 'center',
    },
    songIdText: {
        fontSize: 12,
        fontWeight: '700',
    },
    songTitleInfo: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    viewLyricsSmall: {
        fontSize: 12,
        fontWeight: '500',
    },
    kodButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        marginLeft: 8,
        minWidth: 70,
    },
    kodInput: {
        fontSize: 13,
        fontWeight: '700',
        padding: 0,
        textAlign: 'center',
        width: 40,
    },
    kodTextStatic: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        width: 40,
    },
    bottomSheetOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    bottomSheetContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 44 : 32,
        alignItems: 'center',
    },
    bottomSheetIndicator: {
        width: 50,
        height: 5,
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        marginBottom: 24,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#000',
    },
    modalCloseButtonCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareSubtitle: {
        fontSize: 15,
        width: '100%',
        marginBottom: 32,
        textAlign: 'center',
    },
    shareOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    shareOptionCard: {
        width: '47%',
        paddingVertical: 28,
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1,
    },
    shareIconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    shareOptionText: {
        fontSize: 16,
        fontWeight: '700',
    },
    cancelShareButton: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
    },
    cancelShareText: {
        fontSize: 16,
        fontWeight: '800',
    },
    darkModalContent: {
        backgroundColor: '#1c1c1e',
    },
    darkText: {
        color: '#fff',
    },
    // Missing styles restored
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        height: '85%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeModalButton: {
        padding: 5,
    },
    modalSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 15,
    },
    modalSearchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    modalListContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    songResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
    },
    resultIdText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    resultTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    captureSongMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    captureSongIdText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    captureSongIdBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 12,
    },
    captureSongTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 2,
    },
});
