import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Bell, Moon, Globe, Lock, HelpCircle, Info, Check } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objek terjemahan
const translations = {
  'Melayu': {
    settings: 'Tetapan',
    account: 'Akaun',
    language: 'Bahasa',
    display: 'Paparan',
    darkMode: 'Mod Gelap',
    help: 'Bantuan',
    helpCenter: 'Pusat Bantuan',
    aboutApp: 'Tentang Aplikasi',
    chooseLang: 'Pilih Bahasa',
    close: 'Tutup',
    privacyPolicy: 'Dasar Privasi',
    privacyHeader: 'Aplikasi ini menghormati privasi pengguna. Kami bertujuan untuk menjelaskan amalan privasi kami dengan jelas:',
    noDataCollection: '1. Tiada Pengumpulan Data',
    noDataCollectionDesc: 'Aplikasi tidak mengumpul, menyimpan, atau berkongsi sebarang data peribadi atau maklumat pengguna, termasuk tetapi tidak terhad kepada:',
    noDataCollectionBullet1: '• Nama, alamat e-mel, atau maklumat pengenalan lain.',
    noDataCollectionBullet2: '• Lokasi, sejarah carian, atau aktiviti peranti.',
    noDataCollectionBullet3: '• Data penggunaan atau statistik dalam Aplikasi.',
    noDataCollectionBullet4: '• Fail atau dokumen pada peranti anda.',
    noDeviceAccess: '2. Tiada Akses kepada Peranti atau Akaun',
    noDeviceAccessDesc: 'Aplikasi tidak meminta atau mengakses:',
    noDeviceAccessBullet1: '• Kamera peranti, mikrofon, galeri, atau sensor.',
    noDeviceAccessBullet2: '• Akaun media sosial, kenalan, atau data sistem.',
    noCookies: '3. Tiada Penggunaan Kuki atau Penjejakan',
    noCookiesDesc: 'Aplikasi tidak menggunakan teknologi penjejakan seperti kuki, alat analitik, atau penjejak pihak ketiga.',
    noDataSharing: '4. Tiada Perkongsian Data dengan Pihak Ketiga',
    noDataSharingDesc: 'Oleh kerana tiada data dikumpul, tiada maklumat pengguna akan dijual, dipindahkan, atau didedahkan kepada pihak ketiga.',
    security: '5. Keselamatan',
    securityDesc: 'Walaupun Aplikasi tidak mengumpul data, kami komited untuk mengekalkan integriti dan keselamatannya untuk melindungi pengguna daripada risiko teknikal.',
    changes: '6. Perubahan pada Dasar Privasi',
    changesDesc: 'Sekiranya dasar ini dikemaskini pada masa hadapan, pengguna akan dimaklumkan melalui kemaskini dalam Aplikasi atau platform rasmi.'
  },
  'English': {
    settings: 'Settings',
    account: 'Account',
    language: 'Language',
    display: 'Display',
    darkMode: 'Dark Mode',
    help: 'Help',
    helpCenter: 'Help Center',
    aboutApp: 'About App',
    chooseLang: 'Choose Language',
    close: 'Close',
    privacyPolicy: 'Privacy Policy',
    privacyHeader: 'This application respects user privacy. We aim to clearly outline our privacy practices:',
    noDataCollection: '1. No Data Collection',
    noDataCollectionDesc: 'The App does not collect, store, or share any personal data or user information, including but not limited to:',
    noDataCollectionBullet1: '• Names, email addresses, or other identifying details.',
    noDataCollectionBullet2: '• Location, search history, or device activity.',
    noDataCollectionBullet3: '• Usage data or in-App statistics.',
    noDataCollectionBullet4: '• Files or documents on your device.',
    noDeviceAccess: '2. No Access to Device or Accounts',
    noDeviceAccessDesc: 'The App does not request or access:',
    noDeviceAccessBullet1: '• Device cameras, microphones, galleries, or sensors.',
    noDeviceAccessBullet2: '• Social media accounts, contacts, or system data.',
    noCookies: '3. No Use of Cookies or Tracking',
    noCookiesDesc: 'The App does not employ tracking technologies such as cookies, analytics tools, or third-party trackers.',
    noDataSharing: '4. No Data Sharing with Third Parties',
    noDataSharingDesc: 'Since no data is collected, no user information will be sold, transferred, or disclosed to third parties.',
    security: '5. Security',
    securityDesc: 'While the App does not collect data, we are committed to maintaining its integrity and security to protect users from technical risks.',
    changes: '6. Changes to Privacy Policy',
    changesDesc: 'If this policy is updated in the future, users will be notified via in-App updates or official platforms.'
  }
};

export default function SettingScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('Melayu');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const languages = ['Melayu', 'English'];
  
  // Dapatkan bahasa yang disimpan ketika komponen dimuat
  useEffect(() => {
    const getStoredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('app-language');
        if (storedLanguage) {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error retrieving language from storage:', error);
      }
    };
    
    getStoredLanguage();
  }, []);

  // Fungsi untuk mendapatkan terjemahan berdasarkan bahasa semasa
  const t = (key: keyof typeof translations['Melayu']) => {
    return translations[currentLanguage as keyof typeof translations][key];
  };

  const toggleLanguageModal = () => {
    setShowLanguageModal(!showLanguageModal);
  };

  const togglePrivacyModal = () => {
    setShowPrivacyModal(!showPrivacyModal);
  };

  const selectLanguage = async (language: string) => {
    setCurrentLanguage(language);
    setShowLanguageModal(false);
    
    // Simpan pilihan bahasa ke AsyncStorage
    try {
      await AsyncStorage.setItem('app-language', language);
    } catch (error) {
      console.error('Error saving language to storage:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('account')}</Text>
          
          <TouchableOpacity style={[styles.row, isDarkMode && styles.darkRow]} onPress={toggleLanguageModal}>
            <View style={styles.rowContent}>
              <Globe size={24} color={isDarkMode ? "#fff" : "#333"} />
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('language')}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.selectedOption, isDarkMode && styles.darkText]}>{currentLanguage}</Text>
              <ChevronRight size={20} color={isDarkMode ? "#999" : "#999"} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('display')}</Text>
          
          <View style={[styles.row, isDarkMode && styles.darkRow]}>
            <View style={styles.rowContent}>
              <Moon size={24} color={isDarkMode ? "#fff" : "#333"} />
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('darkMode')}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D1D6", true: "#81b0ff" }}
              thumbColor={isDarkMode ? "#4872F4" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('help')}</Text>
          
          <TouchableOpacity style={[styles.row, isDarkMode && styles.darkRow]}>
            <View style={styles.rowContent}>
              <HelpCircle size={24} color={isDarkMode ? "#fff" : "#333"} />
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('helpCenter')}</Text>
            </View>
            <ChevronRight size={20} color={isDarkMode ? "#999" : "#999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, isDarkMode && styles.darkRow]} onPress={togglePrivacyModal}>
            <View style={styles.rowContent}>
              <Lock size={24} color={isDarkMode ? "#fff" : "#333"} />
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('privacyPolicy')}</Text>
            </View>
            <ChevronRight size={20} color={isDarkMode ? "#999" : "#999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, isDarkMode && styles.darkRow]}>
            <View style={styles.rowContent}>
              <Info size={24} color={isDarkMode ? "#fff" : "#333"} />
              <Text style={[styles.rowText, isDarkMode && styles.darkText]}>{t('aboutApp')}</Text>
            </View>
            <ChevronRight size={20} color={isDarkMode ? "#999" : "#999"} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleLanguageModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>{t('chooseLang')}</Text>
            
            {languages.map(language => (
              <TouchableOpacity 
                key={language} 
                style={[styles.languageOption, isDarkMode && styles.darkLanguageOption]}
                onPress={() => selectLanguage(language)}
              >
                <Text style={[styles.languageText, isDarkMode && styles.darkText]}>{language}</Text>
                {currentLanguage === language && (
                  <Check size={20} color="#4872F4" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={toggleLanguageModal}
            >
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={togglePrivacyModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.privacyModalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>{t('privacyPolicy')}</Text>
            
            <ScrollView style={styles.privacyScrollView}>
              <Text style={[styles.privacyHeader, isDarkMode && styles.darkText]}>
                {t('privacyHeader')}
              </Text>
              
              <Text style={[styles.privacySubHeader, isDarkMode && styles.darkText]}>{t('noDataCollection')}</Text>
              <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
                {t('noDataCollectionDesc')}
              </Text>
              <Text style={[styles.privacyBullet, isDarkMode && styles.darkText]}>{t('noDataCollectionBullet1')}</Text>
              <Text style={[styles.privacyBullet, isDarkMode && styles.darkText]}>{t('noDataCollectionBullet2')}</Text>
              <Text style={[styles.privacyBullet, isDarkMode && styles.darkText]}>{t('noDataCollectionBullet3')}</Text>
              <Text style={[styles.privacyBullet, isDarkMode && styles.darkText]}>{t('noDataCollectionBullet4')}</Text>
              
              <Text style={[styles.privacySubHeader, isDarkMode && styles.darkText]}>{t('noDeviceAccess')}</Text>
              <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
                {t('noDeviceAccessDesc')}
              </Text>
              <Text style={[styles.privacyBullet, isDarkMode && styles.darkText]}>{t('noDeviceAccessBullet1')}</Text>
              <Text style={[styles.privacyBullet, isDarkMode && styles.darkText]}>{t('noDeviceAccessBullet2')}</Text>
              
              <Text style={[styles.privacySubHeader, isDarkMode && styles.darkText]}>{t('noCookies')}</Text>
              <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
                {t('noCookiesDesc')}
              </Text>
              
              <Text style={[styles.privacySubHeader, isDarkMode && styles.darkText]}>{t('noDataSharing')}</Text>
              <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
                {t('noDataSharingDesc')}
              </Text>
              
              <Text style={[styles.privacySubHeader, isDarkMode && styles.darkText]}>{t('security')}</Text>
              <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
                {t('securityDesc')}
              </Text>
              
              <Text style={[styles.privacySubHeader, isDarkMode && styles.darkText]}>{t('changes')}</Text>
              <Text style={[styles.privacyText, isDarkMode && styles.darkText]}>
                {t('changesDesc')}
              </Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={togglePrivacyModal}
            >
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 0,
    backgroundColor: '#fff',
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 0,
  },
  darkText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    padding: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  darkRow: {
    borderTopColor: '#3a3a3a',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkLanguageOption: {
    borderBottomColor: '#3a3a3a',
  },
  languageText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4872F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyModalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  privacyScrollView: {
    maxHeight: 450,
    marginBottom: 20,
  },
  privacyHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  privacySubHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  privacyBullet: {
    fontSize: 14,
    color: '#333',
    marginLeft: 15,
    marginBottom: 5,
    lineHeight: 20,
  },
}); 