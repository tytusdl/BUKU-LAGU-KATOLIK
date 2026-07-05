import { useFocusEffect } from 'expo-router';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Modal, Alert, Linking, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Moon, Globe, HelpCircle, Check, Palette, Heart, ChevronUp, Sparkles, Mail, HandHeart, X } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, colorThemes, darkColorThemes } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { changelogData } from '../data/changelog';
import { contributorsData } from '../data/contributors';
import packages from '../../package.json'; // trigger fast refresh
import * as WebBrowser from 'expo-web-browser';

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../src/translations';
import { useLyricsReports } from '../context/LyricsReportContext';
import LyricsReportsListModal from '../components/LyricsReportsListModal';
import ContactModal from '../components/ContactModal';
import PageHeader from '../components/PageHeader';

export default function SettingScreen() {
  const { isDarkMode, toggleTheme, currentColorTheme, colorThemeId, setColorTheme } = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showColorThemeModal, setShowColorThemeModal] = useState(false);
  const [showContributorsModal, setShowContributorsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'help' | 'privacy' | 'about'>('help');
  const [isChangelogExpanded, setIsChangelogExpanded] = useState(false);
  const [expandedOldVersions, setExpandedOldVersions] = useState<string[]>([]);
  const [appVersion] = useState(packages.version);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { reports: lyricsReports } = useLyricsReports();
  const insets = useSafeAreaInsets();

  // Auto-collapse changelog when leaving the screen
  useFocusEffect(
    useCallback(() => {
      // When the screen is focused (nothing to do here)

      return () => {
        // When the screen loses focus
        setIsChangelogExpanded(false);
        setExpandedOldVersions([]);
      };
    }, [])
  );

  const languages = ['Melayu', 'English'];

  // Debug effect to track theme changes
  useEffect(() => {
    console.log('Settings: Current color theme changed:', currentColorTheme.name, 'Primary:', currentColorTheme.primary);
    console.log('Settings: Color theme ID:', colorThemeId);
    console.log('Settings: Dark mode status:', isDarkMode);
    console.log('Settings: Current theme background:', currentColorTheme.background);
    console.log('Settings: Current theme text:', currentColorTheme.text);
  }, [currentColorTheme, colorThemeId, isDarkMode]);


  const toggleLanguageModal = () => {
    setShowLanguageModal(!showLanguageModal);
  };

  const toggleColorThemeModal = () => {
    setShowColorThemeModal(!showColorThemeModal);
  };

  const openInfoModal = (tab: 'help' | 'privacy' | 'about') => {
    setActiveInfoTab(tab);
    setShowInfoModal(true);
  };

  const toggleContributorsModal = () => {
    setShowContributorsModal(!showContributorsModal);
  };



  const selectLanguage = async (language: string) => {
    await setLanguage(language as 'Melayu' | 'English');
    setShowLanguageModal(false);
  };

  const selectColorTheme = async (themeId: string) => {
    console.log('Selecting color theme:', themeId);
    console.log('Current theme before change:', colorThemeId);
    await setColorTheme(themeId);
    console.log('Theme selection completed');
    // Modal will stay open so user can see changes and make multiple selections
  };

  const getColorThemeName = (themeId: string) => {
    console.log('Getting color theme name for:', themeId);
    const translatedName = t(themeId);
    console.log('Translated name:', translatedName);

    // Fallback for pink theme if translation fails
    if (themeId === 'pink' && (!translatedName || translatedName === themeId)) {
      console.log('Using fallback for pink theme');
      return currentLanguage === 'Melayu' ? 'Merah Jambu' : 'Pink';
    }

    return translatedName;
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.container,
        isDarkMode && styles.darkContainer,
        { backgroundColor: currentColorTheme.background }
      ]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

<PageHeader
          title={t('settings')}
          subtitle={t('settingsDescription')}
          scrollY={scrollY}
          condenseDistance={140}
        />

      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >

        {/* New Update Section */}
        <View style={[
          styles.section,
          isDarkMode && styles.darkSection,
          { backgroundColor: currentColorTheme.surface }
        ]}>
          <TouchableOpacity
            style={[styles.row, isDarkMode && styles.darkRow, { borderTopWidth: 0 }]}
            onPress={() => setIsChangelogExpanded(!isChangelogExpanded)}
            activeOpacity={0.7}
          >
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(175,82,222,0.18)' : 'rgba(175,82,222,0.12)' }]}>
                <Sparkles size={17} color={isDarkMode ? "#C68FE8" : "#AF52DE"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('newUpdate')}</Text>
            </View>
            {isChangelogExpanded ? (
              <ChevronUp size={18} color={isDarkMode ? "#666" : "#999"} />
            ) : (
              <ChevronRight size={18} color={isDarkMode ? "#666" : "#999"} />
            )}
          </TouchableOpacity>

          {isChangelogExpanded && (
            <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
              {changelogData.map((versionData, vIndex) => {
                const isLatest = vIndex === 0;
                const isExpanded = isLatest || expandedOldVersions.includes(versionData.version);

                return (
                  <View key={versionData.version} style={{ marginTop: isLatest ? 0 : 16 }}>
                    {isLatest ? (
                      <Text style={[styles.versionText, isDarkMode && styles.darkText, { fontSize: 14, marginBottom: 8, fontWeight: 'bold' }]}>
                        {t('versionLabel')} {versionData.version}
                      </Text>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setExpandedOldVersions(prev =>
                            prev.includes(versionData.version)
                              ? prev.filter(v => v !== versionData.version)
                              : [...prev, versionData.version]
                          );
                        }}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? 8 : 0, paddingVertical: 4 }}
                      >
                        <Text style={[styles.versionText, isDarkMode && styles.darkText, { fontSize: 14, fontWeight: 'bold' }]}>
                          {t('versionLabel')} {versionData.version}
                        </Text>
                        {isExpanded ? (
                          <ChevronUp size={18} color={isDarkMode ? "#999" : "#666"} />
                        ) : (
                          <ChevronRight size={18} color={isDarkMode ? "#999" : "#666"} />
                        )}
                      </TouchableOpacity>
                    )}

                    {isExpanded && versionData.changes.map((change, index) => {
                      const lang = currentLanguage as 'Melayu' | 'English';
                      const text = change.text[lang];
                      const note = change.note ? change.note[lang] : null;

                      return (
                        <View key={index} style={{ flexDirection: 'row', marginBottom: 6 }}>
                          <Text style={[isDarkMode && styles.darkText, { marginRight: 6 }]}>•</Text>
                          <Text style={[isDarkMode && styles.darkText, { flex: 1, lineHeight: 20 }]}>
                            {text}
                            {note && (
                              <Text style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.8 }}>
                                {'\n'}({note})
                              </Text>
                            )}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          )}
        </View>
        <View style={[
          styles.section,
          isDarkMode && styles.darkSection,
          { backgroundColor: currentColorTheme.surface }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('languageSection')}</Text>
          </View>

          <TouchableOpacity
            style={[styles.row, isDarkMode && styles.darkRow]}
            onPress={toggleLanguageModal}
            activeOpacity={0.7}
          >
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(72,114,244,0.18)' : 'rgba(72,114,244,0.12)' }]}>
                <Globe size={17} color={isDarkMode ? "#7BA0FF" : "#4872F4"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('language')}</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={[styles.languagePill, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.languagePillText, isDarkMode && styles.darkText]}>{currentLanguage}</Text>
              </View>
              <ChevronRight size={18} color={isDarkMode ? "#666" : "#999"} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[
          styles.section,
          isDarkMode && styles.darkSection,
          { backgroundColor: currentColorTheme.surface }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('themeSettings')}</Text>
          </View>

          <View style={[styles.row, isDarkMode && styles.darkRow]}>
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(120,120,128,0.24)' : 'rgba(120,120,128,0.14)' }]}>
                <Moon size={17} color={isDarkMode ? "#C7C7CC" : "#48484A"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('darkMode')}</Text>
            </View>
            <View style={styles.rowRight}>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#D1D1D6", true: currentColorTheme.secondary }}
                thumbColor={isDarkMode ? currentColorTheme.primary : "#f4f3f4"}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.row, isDarkMode && styles.darkRow]} onPress={toggleColorThemeModal} activeOpacity={0.7}>
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,159,10,0.18)' : 'rgba(255,159,10,0.14)' }]}>
                <Palette size={17} color={isDarkMode ? "#FFB340" : "#FF9F0A"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('colorTheme')}</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={[
                styles.colorPreview,
                { backgroundColor: currentColorTheme.primary }
              ]} />
              <Text style={[styles.selectedOption, isDarkMode && styles.darkText]}>{getColorThemeName(colorThemeId)}</Text>
              <ChevronRight size={18} color={isDarkMode ? "#666" : "#999"} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[
          styles.section,
          isDarkMode && styles.darkSection,
          { backgroundColor: currentColorTheme.surface }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('help')}</Text>
          </View>

          <TouchableOpacity style={[styles.row, isDarkMode && styles.darkRow, { borderTopWidth: 0 }]} onPress={toggleContributorsModal} activeOpacity={0.7}>
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,69,58,0.18)' : 'rgba(255,69,58,0.12)' }]}>
                <Heart size={17} color={isDarkMode ? "#FF7A6B" : "#FF453A"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('contributors')}</Text>
            </View>
            <ChevronRight size={18} color={isDarkMode ? "#666" : "#999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, isDarkMode && styles.darkRow]} onPress={() => openInfoModal('help')} activeOpacity={0.7}>
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(72,114,244,0.18)' : 'rgba(72,114,244,0.12)' }]}>
                <HelpCircle size={17} color={isDarkMode ? "#7BA0FF" : "#4872F4"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('helpCenter')}</Text>
            </View>
            <ChevronRight size={18} color={isDarkMode ? "#666" : "#999"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, isDarkMode && styles.darkRow]}
            onPress={() => setShowContactModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(52,199,89,0.18)' : 'rgba(52,199,89,0.12)' }]}>
                <Mail size={17} color={isDarkMode ? "#5DD879" : "#34C759"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('helpContact')}</Text>
            </View>
            <ChevronRight size={18} color={isDarkMode ? "#666" : "#999"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, isDarkMode && styles.darkRow]}
            onPress={() => setShowReportsModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(175,82,222,0.18)' : 'rgba(175,82,222,0.12)' }]}>
                <Sparkles size={17} color={isDarkMode ? "#C68FE8" : "#AF52DE"} strokeWidth={2.2} />
              </View>
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('reportViewAll')}</Text>
            </View>
            <View style={styles.rowRight}>
              {lyricsReports.length > 0 && (
                <View style={{
                  backgroundColor: '#E22D2D',
                  borderRadius: 10,
                  minWidth: 22,
                  height: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 6,
                  marginRight: 8,
                }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                    {lyricsReports.length > 99 ? '99+' : lyricsReports.length}
                  </Text>
                </View>
              )}
              <ChevronRight size={18} color={isDarkMode ? "#666" : "#999"} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, isDarkMode && styles.darkText]}>{t('version')}: {appVersion}</Text>
        </View>

        <View style={styles.creditContainer}>
          <Text style={[styles.creditText, isDarkMode && styles.darkText]}>{t('creditTo')}</Text>
          <Text style={[styles.creditText, isDarkMode && styles.darkText, { marginTop: 4 }]}>{t('freeApp')}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleLanguageModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.languageModalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>{t('chooseLang')}</Text>
            <Text style={[styles.modalSubtitle, isDarkMode && { color: '#999' }]}>
              {currentLanguage === 'Melayu'
                ? 'Pilih bahasa antara muka anda'
                : 'Select your interface language'}
            </Text>

            {languages.map(language => {
              const isSelected = currentLanguage === language;
              const flag = language === 'Melayu' ? '🇲🇾' : '🇬🇧';
              const nativeName = language === 'Melayu' ? 'Bahasa Melayu' : 'English';
              const englishName = language === 'Melayu' ? 'Malay' : 'English';
              return (
                <TouchableOpacity
                  key={language}
                  style={[
                    styles.languageOption,
                    isSelected && styles.languageOptionSelected,
                    isDarkMode && styles.darkLanguageOption,
                    isSelected && isDarkMode && styles.darkLanguageOptionSelected,
                  ]}
                  onPress={() => selectLanguage(language)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageFlag}>{flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.languageOptionTitle,
                      isDarkMode && { color: '#fff' },
                      isSelected && { fontWeight: '700' }
                    ]}>
                      {nativeName}
                    </Text>
                    <Text style={[
                      styles.languageOptionSubtitle,
                      isDarkMode && { color: '#888' }
                    ]}>
                      {englishName}
                    </Text>
                  </View>
                  <View style={[
                    styles.languageCheck,
                    isSelected && { backgroundColor: currentColorTheme.primary === '#ffffff' ? '#4872F4' : currentColorTheme.primary, borderColor: 'transparent' }
                  ]}>
                    {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showColorThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleColorThemeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent, { paddingVertical: 20 }]}>
            {/* ─── Close X button (top-right) ─── */}
            <TouchableOpacity
              style={styles.supporterCloseX}
              onPress={toggleColorThemeModal}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color={isDarkMode ? '#AEAEB2' : '#666'} strokeWidth={2.4} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, isDarkMode && styles.darkText, { marginTop: 8 }]}>{t('chooseColorTheme')}</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: 15, paddingBottom: 5 }}>
              {colorThemes.map((theme, index) => {
                const isSelected = colorThemeId === theme.id;
                return (
                  <TouchableOpacity
                    key={theme.id}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      marginHorizontal: 10,
                      marginBottom: 20,
                      width: 70,
                    }}
                    onPress={() => selectColorTheme(theme.id)}
                  >
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: theme.id === 'white' ? theme.background : theme.primary,
                      borderWidth: isSelected ? 3 : 1,
                      borderColor: isSelected ? (isDarkMode ? '#ffffff' : '#1a1a1a') : (isDarkMode ? '#444444' : '#e0e0e0'),
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                      shadowColor: theme.id === 'white' && !isDarkMode ? '#000000' : theme.primary,
                      shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                      shadowOpacity: isSelected ? 0.4 : 0.1,
                      shadowRadius: isSelected ? 6 : 3,
                      elevation: isSelected ? 6 : 2,
                    }}>
                      {isSelected && <Check size={26} color={theme.id === 'white' ? (isDarkMode ? '#000000' : '#1A1A1A') : '#ffffff'} />}
                    </View>
                    <Text style={[
                      styles.languageText,
                      {
                        fontSize: 12,
                        fontWeight: isSelected ? 'bold' : '600',
                        color: isDarkMode ? (isSelected ? '#ffffff' : '#999999') : (isSelected ? '#000000' : '#666666'),
                        textAlign: 'center'
                      }
                    ]}
                      numberOfLines={1}
                    >
                      {getColorThemeName(theme.id)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Combined Info Modal with tabs: Help / Privacy / About */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.infoModalContent, isDarkMode && styles.darkModalContent, { flexDirection: 'column' }]}>

            {/* ─── Close X button (top-right) ─── */}
            <TouchableOpacity
              style={styles.supporterCloseX}
              onPress={() => setShowInfoModal(false)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color={isDarkMode ? '#AEAEB2' : '#666'} strokeWidth={2.4} />
            </TouchableOpacity>

            {/* Tab Pills */}
            <View style={[styles.infoTabBar, { backgroundColor: isDarkMode ? '#3a3a3c' : '#f0f0f5', marginTop: 36 }]}>
              {(['help', 'privacy', 'about'] as const).map((tab) => {
                const isActive = activeInfoTab === tab;
                const label = tab === 'help' ? t('helpCenter') : tab === 'privacy' ? t('privacyPolicy') : t('aboutApp');
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.infoTabItem,
                      isActive && { backgroundColor: currentColorTheme.primary === '#ffffff' ? '#4872F4' : currentColorTheme.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }
                    ]}
                    onPress={() => setActiveInfoTab(tab)}
                  >
                    <Text style={[styles.infoTabText, isActive && styles.infoTabTextActive]} numberOfLines={1}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tab Content */}
            <ScrollView style={styles.infoScrollView} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
              {activeInfoTab === 'help' && (
                <View>
                  <Text style={[styles.helpHeader, isDarkMode && styles.darkText]}>{t('helpCenterIntro')}</Text>
                  <Text style={[styles.helpQuestion, isDarkMode && styles.darkText, { fontWeight: 'bold', marginTop: 0 }]}>{t('howToUse')}</Text>
                  <Text style={[styles.helpQuestion, isDarkMode && styles.darkText]}>{t('helpQuestion1')}</Text>
                  <Text style={[styles.helpAnswer, isDarkMode && styles.darkText]}>{t('helpAnswer1')}</Text>
                  <Text style={[styles.helpQuestion, isDarkMode && styles.darkText]}>{t('helpQuestion2')}</Text>
                  <Text style={[styles.helpAnswer, isDarkMode && styles.darkText]}>{t('helpAnswer2')}</Text>
                  <Text style={[styles.helpQuestion, isDarkMode && styles.darkText]}>{t('helpQuestion3')}</Text>
                  <Text style={[styles.helpAnswer, isDarkMode && styles.darkText]}>{t('helpAnswer3')}</Text>
                  <Text style={[styles.helpQuestion, isDarkMode && styles.darkText]}>{t('helpQuestion4')}</Text>
                  <Text style={[styles.helpAnswer, isDarkMode && styles.darkText]}>{t('helpAnswer4')}</Text>
                </View>
              )}
              {activeInfoTab === 'privacy' && (
                <View>
                  <Text style={[styles.privacyHeader, isDarkMode && styles.darkText]}>{t('privacyHeader')}</Text>
                  <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>{t('privacyCoreStatement')}</Text>
                </View>
              )}
              {activeInfoTab === 'about' && (
                <View>
                  <Text style={[styles.aboutText, isDarkMode && styles.darkText, { marginBottom: 15 }]}>{t('appIntroText')}</Text>
                  <Text style={[styles.aboutHeader, isDarkMode && styles.darkText]}>{t('appFeatures')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appFeature1')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appFeature2')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appFeature3')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appFeature4')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appFeature5')}</Text>
                  <Text style={[styles.aboutHeader, isDarkMode && styles.darkText]}>{t('appStructure')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appStructure1')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appStructure2')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appStructure3')}</Text>
                  <Text style={[styles.aboutBullet, isDarkMode && styles.darkText]}>{t('appStructure4')}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal
        visible={showContributorsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleContributorsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.supporterModalContent,
            isDarkMode && styles.darkModalContent,
            // Respect Android nav bar / tab bar so the modal never kisses the bottom edge
            { paddingBottom: Math.max(insets.bottom, 20) + 8 },
          ]}>
            {/* ─── Close button (X) — absolute top-right ─── */}
            <TouchableOpacity
              style={styles.supporterCloseX}
              onPress={toggleContributorsModal}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color={isDarkMode ? '#AEAEB2' : '#666'} strokeWidth={2.4} />
            </TouchableOpacity>

            {/* ─── Scrollable body — overflows gracefully on small screens ─── */}
            <ScrollView
              style={styles.supporterModalScroll}
              contentContainerStyle={{ paddingBottom: 4, paddingTop: 28 }}
              showsVerticalScrollIndicator={false}
            >
              {/* ─── Compact header: inline icon + title + count ─── */}
              <View style={styles.supporterHero}>
                <View style={styles.supporterHeroOrnament}>
                  <View style={[styles.supporterHeroLine, isDarkMode && styles.darkSupporterHeroLine]} />
                  <Heart size={11} color={isDarkMode ? '#FFB4B4' : '#FF6B6B'} fill={isDarkMode ? '#FFB4B4' : '#FF6B6B'} strokeWidth={0} />
                  <View style={[styles.supporterHeroLine, isDarkMode && styles.darkSupporterHeroLine]} />
                </View>
                <Text style={[styles.supporterHeroTitle, isDarkMode && styles.darkSupporterHeroTitle]}>
                  {t('contributorsList')}
                </Text>
              </View>

              {/* ─── Appreciation text on top (short "Terima kasih kepada pasukan...") ─── */}
              <Text style={[styles.supporterIntro, isDarkMode && styles.darkSupporterIntro]}>
                {t('appContactText')}
              </Text>

              {/* ─── Compact gold-accent glass CTA ─── */}
<TouchableOpacity
              style={[
                styles.supporterCta,
                isDarkMode && styles.darkSupporterCta,
              ]}
              onPress={async () => {
                try {
                  await WebBrowser.openBrowserAsync('https://sites.google.com/view/bukulagukatolik?usp=sharing');
                } catch (error) {
                  console.error('Failed to open web browser:', error);
                  Linking.openURL('https://sites.google.com/view/bukulagukatolik?usp=sharing');
                }
              }}
              activeOpacity={0.85}
            >
              <View style={styles.supporterCtaTextWrap}>
                <View style={styles.supporterCtaRow}>
                  <View style={[styles.supporterCtaIcon, isDarkMode && styles.darkSupporterCtaIcon]}>
                    <HandHeart size={14} color="#ffffff" strokeWidth={2.4} />
                  </View>
                  <Text style={[styles.supporterCtaText, isDarkMode && styles.darkSupporterCtaText]}>
                    {t('catholicSongbookWeb')}
                  </Text>
                </View>
                <Text style={[styles.supporterCtaSubtitle, isDarkMode && styles.darkSupporterCtaSubtitle]}>
                  {currentLanguage === 'Melayu' ? 'Bantu saya, tolong tekan' : 'Help me, please tap'}
                </Text>
              </View>
            </TouchableOpacity>

              {/* ─── Count line below CTA, above the grid ─── */}
              <Text style={[styles.supporterCountBelowCta, isDarkMode && styles.darkSupporterCountBelowCta]}>
                {t('contributorsCount')}
              </Text>

              {/* ─── 2-column grid (compact, no scroll) ─── */}
              <View style={styles.supporterGrid}>
                {contributorsData.map((contributor, index) => {
                  // Split "Louis ( Parad )" → name="Louis", nick="Parad"
                  const match = contributor.name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
                  const mainName = match ? match[1].trim() : contributor.name;
                  const nickname = match ? match[2].trim() : null;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.supporterCell,
                        isDarkMode && styles.darkSupporterCell,
                      ]}
                    >
                      <Text
                        style={[styles.supporterName, isDarkMode && styles.darkSupporterName]}
                        numberOfLines={1}
                      >
                        {mainName}
                      </Text>
                      {nickname ? (
                        <Text
                          style={[styles.supporterNickname, isDarkMode && styles.darkSupporterNickname]}
                          numberOfLines={1}
                        >
                          {nickname}
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>

              {/* ─── Contributor intro on bottom (full long "Tanpa mereka, app ini tidak akan dipublish...") ─── */}
              <Text style={[styles.supporterFooterText, isDarkMode && styles.darkSupporterFooterText]}>
                {t('contributorsIntro')}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Laporan Lirik Viewer */}
      <LyricsReportsListModal
        visible={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />

      {/* Contact Modal — pilih generic atau lapor lirik */}
      <ContactModal
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
        onRequestLyricsReport={() => {
          // Dari Tetapan, takde lagu context — guide user ke halaman lagu
          Alert.alert(
            t('contactLyricsReport'),
            currentLanguage === 'Melayu'
              ? 'Sila buka mana-mana lagu, kemudian tekan ikon ⚠️ atau buka menu untuk memilih "LAPOR LIRIK".'
              : 'Please open any song, then tap the ⚠️ icon or open the menu and select "REPORT LYRICS".',
            [{ text: t('close') }]
          );
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  darkText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 6,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: '#1C1C1E',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  darkRow: {
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#333',
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    fontSize: 13,
    color: '#999',
    marginRight: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languagePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },
  languagePillText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  // Language picker modal
  languageModalContent: {
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 22,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 18,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.025)',
  },
  darkLanguageOption: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(72,114,244,0.08)',
    borderColor: '#4872F4',
  },
  darkLanguageOptionSelected: {
    backgroundColor: 'rgba(72,114,244,0.16)',
    borderColor: '#7BA0FF',
  },
  languageFlag: {
    fontSize: 28,
    marginRight: 14,
  },
  languageOptionTitle: {
    fontSize: 16,
    color: '#222',
  },
  languageOptionSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  languageCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ─── Supporter modal (compact, scrollable, sticky close) ───
  supporterModalContent: {
    width: '88%',
    maxHeight: '88%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  supporterModalScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  // ─── Compact editorial header (centered, ornament + title + count) ───
  supporterHero: {
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 10,
  },
  supporterHeroOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  supporterHeroLine: {
    width: 22,
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.6,
    marginHorizontal: 6,
  },
  darkSupporterHeroLine: {
    backgroundColor: '#8B7355',
  },
  supporterHeroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  darkSupporterHeroTitle: {
    color: '#F2F2F7',
  },
  supporterHeroCount: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  darkSupporterHeroCount: {
    color: '#8E8E93',
  },
  // ─── Count label below CTA, above the grid ───
  supporterCountBelowCta: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  darkSupporterCountBelowCta: {
    color: '#AEAEB2',
  },
  // ─── Appreciation text on top (short "Terima kasih kepada pasukan...") ───
  supporterIntro: {
    fontSize: 13,
    color: '#444',
    lineHeight: 19,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  darkSupporterIntro: {
    color: '#D1D1D6',
  },
  // ─── Solid blue filled CTA (proper action button, compact + centered) ───
  supporterCta: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: '#4872F4',
    shadowColor: '#4872F4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    minWidth: 240,
  },
  darkSupporterCta: {
    backgroundColor: '#0A84FF',
    shadowColor: '#0A84FF',
    shadowOpacity: 0.6,
  },
  supporterCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  supporterCtaIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  darkSupporterCtaIcon: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  supporterCtaTextWrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  supporterCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 20,
    includeFontPadding: false,
  },
  darkSupporterCtaText: {
    color: '#ffffff',
  },
  supporterCtaSubtitle: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 2,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 14,
    includeFontPadding: false,
  },
  darkSupporterCtaSubtitle: {
    color: 'rgba(255,255,255,0.85)',
  },
  // ─── 2-column compact grid (no scroll) ───
  supporterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  supporterCell: {
    width: '50%',
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  darkSupporterCell: {},
  supporterName: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  darkSupporterName: {
    color: '#F2F2F7',
  },
  supporterNickname: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 1,
    fontWeight: '500',
  },
  darkSupporterNickname: {
    color: '#8E8E93',
  },
  // ─── Contributor intro on bottom (long "Tanpa mereka, app ini tidak akan dipublish...") ───
  supporterFooterText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  darkSupporterFooterText: {
    color: '#AEAEB2',
  },
  // ─── Close X button (absolute top-right of modal) ───
  supporterCloseX: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  darkModalContent: {
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  colorPreview: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorPreviewLarge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Combined Info Modal
  infoModalContent: {
    width: '90%',
    maxHeight: '82%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  infoTabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  infoTabItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  infoTabTextActive: {
    color: '#fff',
  },
  infoScrollView: {
    maxHeight: 340,
    marginBottom: 10,
    paddingRight: 4,
  },
  // Privacy styles
  privacyModalContent: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  privacyScrollView: {
    marginBottom: 10,
  },
  privacyHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  privacyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
  // About styles
  aboutModalContent: {
    width: '85%',
    maxHeight: '75%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  aboutScrollView: {
    marginBottom: 10,
  },
  aboutHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#000',
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  aboutBullet: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  // Help styles
  helpModalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  helpScrollView: {
    maxHeight: '80%',
    marginBottom: 10,
    paddingRight: 5,
  },
  helpHeader: {
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
    lineHeight: 21,
  },
  helpQuestion: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 2,
    color: '#333',
  },
  helpAnswer: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 19,
  },
  versionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 15,
    paddingBottom: 2,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  creditContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingBottom: 30,
  },
  creditText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  darkModeToggleContainer: {
    width: '100%',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  darkModeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  darkModeToggleText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
    color: '#333',
  },
  darkModeSwitch: {
    marginLeft: 'auto',
  },
  modalSeparator: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  colorOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  donationButton: {
    flex: 1,
    backgroundColor: '#9ddc9f',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationButtonText: {
    color: '#1a1a1a', // Dark text for contrast against light green
    fontWeight: 'bold',
    fontSize: 14,
  }
}); 