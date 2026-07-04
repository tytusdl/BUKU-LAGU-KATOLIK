import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, FlatList, TouchableOpacity, Image, BackHandler, Platform, Alert, Modal, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, Heart, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { songs as allSongs } from '../data/songs';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { translations } from '../../src/translations'; // Updated import path
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';

import ChangelogModal from '../components/ChangelogModal'; // Import ChangelogModal
import packages from '../../package.json'; // Import package.json to get version

// Tambah pengisytiharan jenis untuk kategori lagu
interface SongCategory {
  id: string;
  titleKey: string;
  songNumber: string;
  songNumberKey?: keyof typeof translations['Melayu'];
  image: any;
  verified: boolean;
}

// Tambah pengisytiharan jenis untuk lagu
interface Song {
  id: string;
  title: string;
  lyrics?: string;
  category?: string;
}

const songCategories: SongCategory[] = [
  {
    id: 'lagusaya',
    titleKey: 'mySongsCategoryTitle',
    songNumber: '',
    songNumberKey: 'mySongsCategoryNumber',
    image: require('../../assets/images/categories-webp/category_s.webp'),
    verified: true
  },
  {
    id: 'a',
    titleKey: 'HOZOU KOSUANGAN',
    songNumber: 'A1-A32',
    image: require('../../assets/images/categories-webp/category_a.webp'),
    verified: true
  },
  {
    id: 'b',
    titleKey: 'HOZOU DI KOSIMABAAN',
    songNumber: 'B1-B23',
    image: require('../../assets/images/categories-webp/category_b.webp'),
    verified: true
  },
  {
    id: 'c',
    titleKey: 'HOZOU DO KAPATAKAN',
    songNumber: 'C1-C24',
    image: require('../../assets/images/categories-webp/category_c.webp'),
    verified: true
  },
  {
    id: 'd',
    titleKey: 'HOZOU DO KOSOMBUTAN / KOPONONGKOTOHUADAN',
    songNumber: 'D1-D46',
    image: require('../../assets/images/categories-webp/category_d.webp'),
    verified: true
  },
  {
    id: 'e',
    titleKey: 'HOZOU DO KOOVIAN / KOPONONGKOTOHUADANAN',
    songNumber: 'E1-E18',
    image: require('../../assets/images/categories-webp/category_e.webp'),
    verified: true
  },
  {
    id: 'f',
    titleKey: 'HOZOU ID KAPANTANGAN DI SANGTI MARIA',
    songNumber: 'F1-F11',
    image: require('../../assets/images/categories-webp/category_f.webp'),
    verified: true
  },
  {
    id: 'g',
    titleKey: 'HOZOU ID KAPANTANGAN DI SPIRITU SANGTI',
    songNumber: 'G1-G9',
    image: require('../../assets/images/categories-webp/category_g.webp'),
    verified: true
  },
  {
    id: 'h',
    titleKey: 'HOZOU ONTOK KAPAGANDADAN',
    songNumber: 'H1-H4',
    image: require('../../assets/images/categories-webp/category_h.webp'),
    verified: true
  },
  {
    id: 'i',
    titleKey: 'HOZOU DO KRISMAS',
    songNumber: 'I1-I14',
    image: require('../../assets/images/categories-webp/category_i.webp'),
    verified: true
  },
  {
    id: 'j',
    titleKey: 'HOZOU DO KOPONOGITAN',
    songNumber: 'J1-J17',
    image: require('../../assets/images/categories-webp/category_j.webp'),
    verified: true
  },
  {
    id: 'k',
    titleKey: 'HOZOU DO PASKA',
    songNumber: 'K1-K8',
    image: require('../../assets/images/categories-webp/category_k.webp'),
    verified: true
  },
  {
    id: 'l',
    titleKey: 'HOZOU DO KAAMATAN',
    songNumber: 'L1-L4',
    image: require('../../assets/images/categories-webp/category_l.webp'),
    verified: true
  },
  {
    id: 'm',
    titleKey: 'HOZOU NGAAVI DO SUUSUVAI',
    songNumber: 'M1-M33',
    image: require('../../assets/images/categories-webp/category_m.webp'),
    verified: true
  },
  {
    id: 'n',
    titleKey: 'HOZOU DO PISASAVAAN',
    songNumber: 'N1-N4',
    image: require('../../assets/images/categories-webp/category_n.webp'),
    verified: true
  },
  {
    id: 'o',
    titleKey: 'YOHOU DO ASCENSIO',
    songNumber: 'O1',
    image: require('../../assets/images/categories-webp/category_o.webp'),
    verified: true
  },
  {
    id: 'p',
    titleKey: 'DOID SANTA TRINITAS',
    songNumber: 'P1-P4',
    image: require('../../assets/images/categories-webp/category_p.webp'),
    verified: true
  },
  {
    id: 'r',
    titleKey: 'LAGU R',
    songNumber: 'R001-R471',
    image: require('../../assets/images/categories-webp/category_r.webp'),
    verified: true
  },
];

// Define the orderList to include all song numbers
const orderList = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19', 'A20', 'A21', 'A22', 'A23', 'A24', 'A25', 'A26', 'A27', 'A28', 'A29', 'A30', 'A31', 'A32',
  'B1', 'B2', 'B2(a)', 'B3', 'B4', 'B5', 'B6', 'B7a', 'B7b', 'B8', 'B9a', 'B9b', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20', 'B21', 'B22', 'B23',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22', 'C23', 'C24', 'C25', 'C26', 'C27', 'C28', 'C29',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20', 'D21', 'D22', 'D23', 'D24', 'D25', 'D26', 'D27', 'D28', 'D29', 'D30', 'D31', 'D32', 'D33', 'D34', 'D35', 'D36', 'D37', 'D38', 'D39', 'D40', 'D41', 'D42', 'D43', 'D44', 'D45', 'D46',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9',
  'H1', 'H2', 'H3', 'H4',
  'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10', 'I11', 'I12', 'I13', 'I14',
  'J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17',
  'K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8',
  'L1', 'L2', 'L3', 'L4',
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M22(a)', 'M22(b)', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29', 'M30', 'M31', 'M32', 'M33',
  'N1', 'N2', 'N3', 'N4',
  'O1',
  'P1', 'P2', 'P3', 'P4',
  'R001', 'R002', 'R003', 'R004', 'R005', 'R006', 'R007', 'R008', 'R009', 'R010',
  'R011', 'R012', 'R013', 'R014', 'R015', 'R016', 'R017', 'R018', 'R019', 'R020',
  'R021', 'R022', 'R023', 'R024', 'R025', 'R026', 'R027', 'R028', 'R029', 'R030',
  'R031', 'R032', 'R033', 'R034', 'R035', 'R036', 'R037', 'R038', 'R039', 'R040',
  'R041', 'R042', 'R043', 'R044', 'R045', 'R046', 'R047', 'R048', 'R049', 'R050',
  'R051', 'R052', 'R053', 'R054', 'R055', 'R056', 'R057', 'R058', 'R059', 'R060',
  'R061', 'R062', 'R063', 'R064', 'R065', 'R066', 'R067', 'R068', 'R069', 'R070',
  'R071', 'R072', 'R073', 'R074', 'R075', 'R076', 'R077', 'R078', 'R079', 'R080',
  'R081', 'R082', 'R083', 'R084', 'R085', 'R086', 'R087', 'R088', 'R089', 'R090',
  'R091', 'R092', 'R093', 'R094', 'R095', 'R096', 'R097', 'R098', 'R099', 'R100',
  'R101', 'R102', 'R103', 'R104', 'R105', 'R106', 'R107', 'R108', 'R109', 'R110',
  'R111', 'R112', 'R113', 'R114', 'R115', 'R116', 'R117', 'R118', 'R119', 'R120',
  'R121', 'R122', 'R123', 'R124', 'R125', 'R126', 'R127', 'R128', 'R129', 'R130',
  'R131', 'R132', 'R133', 'R134', 'R135', 'R136', 'R137', 'R138', 'R139', 'R140',
  'R141', 'R142', 'R143', 'R144', 'R145', 'R146', 'R147', 'R148', 'R149', 'R150',
  'R151', 'R152', 'R153', 'R154', 'R155', 'R156', 'R157', 'R158', 'R159', 'R160',
  'R161', 'R162', 'R163', 'R164', 'R165', 'R166', 'R167', 'R168', 'R169', 'R170',
  'R171', 'R172', 'R173', 'R174', 'R175', 'R176', 'R177', 'R178', 'R179', 'R180',
  'R181', 'R182', 'R183', 'R184', 'R185', 'R186', 'R187', 'R188', 'R189', 'R190',
  'R191', 'R192', 'R193', 'R194', 'R195', 'R196', 'R197', 'R198', 'R199', 'R200',
  'R201', 'R202', 'R203', 'R204', 'R205', 'R206', 'R207', 'R208', 'R209', 'R210',
  'R211', 'R212', 'R213', 'R214', 'R215', 'R216', 'R217', 'R218', 'R219', 'R220',
  'R221', 'R222', 'R223', 'R224', 'R225', 'R226', 'R227', 'R228', 'R229', 'R230',
  'R231', 'R232', 'R233', 'R234', 'R235', 'R236', 'R237', 'R238', 'R239', 'R240',
  'R241', 'R242', 'R243', 'R244', 'R245', 'R246', 'R247', 'R248', 'R249', 'R250',
  'R251', 'R252', 'R253', 'R254', 'R255', 'R256', 'R257', 'R258', 'R259', 'R260',
  'R261', 'R262', 'R263', 'R264', 'R265', 'R266', 'R267', 'R268', 'R269', 'R270',
  'R271', 'R272', 'R273', 'R274', 'R275', 'R276', 'R277', 'R278', 'R279', 'R280',
  'R281', 'R282', 'R283', 'R284', 'R285', 'R286', 'R287', 'R288', 'R289', 'R290',
  'R291', 'R292', 'R293', 'R294', 'R295', 'R296', 'R297', 'R298', 'R299', 'R300',
  'R301', 'R302', 'R303', 'R304', 'R305', 'R306', 'R307', 'R308', 'R309', 'R310',
  'R311', 'R312', 'R313', 'R314', 'R315', 'R316', 'R317', 'R318', 'R319', 'R320',
  'R321', 'R322', 'R323', 'R324', 'R325', 'R326', 'R327', 'R328', 'R329', 'R330',
  'R331', 'R332', 'R333', 'R334', 'R335', 'R336', 'R337', 'R338', 'R339', 'R340',
  'R341', 'R342', 'R343', 'R344', 'R345', 'R346', 'R347', 'R348', 'R349', 'R350',
  'R351', 'R352', 'R353', 'R354', 'R355', 'R356', 'R357', 'R358', 'R359', 'R360',
  'R361', 'R362', 'R363', 'R364', 'R365', 'R366', 'R367', 'R368', 'R369', 'R370',
  'R371', 'R372', 'R373', 'R374', 'R375', 'R376', 'R377', 'R378', 'R379', 'R380',
  'R381', 'R382', 'R383', 'R384', 'R385', 'R386', 'R387', 'R388', 'R389', 'R390',
  'R391', 'R392', 'R393', 'R394', 'R395', 'R396', 'R397', 'R398', 'R399', 'R400',
  'R401', 'R402', 'R403', 'R404', 'R405', 'R406', 'R407', 'R408', 'R409', 'R410',
  'R411', 'R412', 'R413', 'R414', 'R415', 'R416', 'R417', 'R418', 'R419', 'R420',
  'R421', 'R422', 'R423', 'R424', 'R425', 'R426', 'R427', 'R428', 'R429', 'R430',
  'R431', 'R432', 'R433', 'R434', 'R435', 'R436', 'R437', 'R438', 'R439', 'R440',
  'R441', 'R442', 'R443', 'R444', 'R445', 'R446', 'R447', 'R448', 'R449', 'R450',
  'R451', 'R452', 'R453', 'R454', 'R455', 'R456', 'R457', 'R458', 'R459', 'R460',
  'R461', 'R462', 'R463', 'R464', 'R465', 'R466', 'R467', 'R468', 'R469', 'R470',
  'R471'
];

// Tambah fungsi untuk menutup aplikasi
const exitApp = () => {
  if (Platform.OS === 'android') {
    BackHandler.exitApp();
  } else {
    // Untuk iOS, kita perlu menggunakan Updates.reloadAsync() untuk menutup aplikasi
    Updates.reloadAsync();
  }
};

export default function HomeScreen() {
  // HOOKS SECTION - Semua hooks mesti di bahagian atas
  const { isDarkMode, currentColorTheme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Responsive scaling — base design assumes 393px width (iPhone 14 Pro).
  // Phones narrower than 360px (small Android) get scaled-down sizes so the
  // header title and tab labels don't overflow.
  const sizeScale = Math.min(1, Math.max(0.78, screenWidth / 393));

  // Semua state hooks disusun berturutan
  const { currentLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const flatListRef = useRef<FlatList<SongCategory>>(null);
  const scrollPositionRef = useRef(0);
  const navigation = useNavigation();
  const navigatedWithinTabRef = useRef(false);

  const justFocusedRef = useRef(true);

  // State for Changelog Modal
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const APP_VERSION = packages.version; // Get version from package.json

  // Use focus effect untuk pengendalian tombol kembali dan pengurusan fokus
  useFocusEffect(
    React.useCallback(() => {
      // Tandakan skrin sebagai fokus dan baru difokuskan
      setIsFocused(true);
      justFocusedRef.current = true;

      // Tetapkan timeout untuk menukar justFocusedRef kepada false selepas kelewatan
      const focusTimeout = setTimeout(() => {
        justFocusedRef.current = false;
      }, 300); // Tingkatkan kelewatan kepada 300ms

      // Check for App Update (Changelog)
      const checkChangelog = async () => {
        try {
          const lastSeenVersion = await AsyncStorage.getItem('last_seen_version');
          if (lastSeenVersion !== APP_VERSION) {
            // Version changed or first time run
            // Wait a bit to ensure fonts loaded and UI ready
            setTimeout(() => {
              setShowChangelogModal(true);
            }, 1000);
          }
        } catch (error) {
          console.error('[Changelog] Error checking version:', error);
        }
      };

      // Only check changelog if just focused and not navigating back from tab
      if (justFocusedRef.current && !navigatedWithinTabRef.current) {
        checkChangelog();
      }

      // Tambah penangan back button
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        // Jangan tunjukkan modal jika skrin baru sahaja mendapat fokus
        if (justFocusedRef.current) {
          return true; // Tangani tekanan kembali tetapi jangan buat apa-apa
        }

        if (searchQuery.trim() !== '') {
          setSearchQuery('');
          return true; // Cegah keluar dari aplikasi jika ada pencarian aktif
        }

        // Tunjukkan modal konfirmasi keluar
        setShowExitModal(true);
        return true; // Cegah keluar dari aplikasi sehingga pengguna mengesahkan
      });

      // Cleanup ketika skrin tidak lagi difokuskan
      return () => {
        setIsFocused(false); // Tandakan skrin tidak fokus
        backHandler.remove();
        clearTimeout(focusTimeout); // Bersihkan timeout
      };
    }, [currentLanguage, searchQuery, setShowExitModal, APP_VERSION]) // Kebergantungan kekal sama
  );

  // useFocusEffect untuk menguruskan scroll semasa fokus
  useFocusEffect(
    useCallback(() => {


      if (navigatedWithinTabRef.current) {
        // Kembali dari skrin dalam tab yang sama (Kategori/Lagu Saya)

        const timerId = setTimeout(() => {
          if (flatListRef.current && scrollPositionRef.current > 0) {

            try {
              flatListRef.current.scrollToOffset({
                offset: scrollPositionRef.current,
                animated: false,
              });
            } catch (error) {
              console.error('[FocusEffect] Error restoring scroll:', error);
            }
          }
        }, 150);
        // Reset penanda selepas cuba pulihkan scroll
        navigatedWithinTabRef.current = false;
        return () => clearTimeout(timerId);

      } else {
        // Kembali dari tab lain atau muatan awal

        const timerId = setTimeout(() => {
          // Scroll ke atas
          if (flatListRef.current) {
            try {
              flatListRef.current.scrollToOffset({ offset: 0, animated: false });
            } catch (error) {
              console.error('[FocusEffect] Error scrolling to top:', error);
            }
          }
          // Reset juga ref posisi scroll (jika ada nilai sebelumnya)
          scrollPositionRef.current = 0;
        }, 50); // Boleh guna timeout lebih pendek untuk scroll ke atas
        return () => clearTimeout(timerId);
      }
    }, []) // Dependencies kekal kosong
  );

  // Dapatkan hasil carian
  const searchResults = useMemo(() => {
    if (searchQuery.trim() === '') return [];

    return allSongs.filter(song => {
      const query = searchQuery.toLowerCase().trim();
      return (
        song.title.toLowerCase().includes(query) ||
        song.id.toLowerCase().includes(query) ||
        (song.lyrics && song.lyrics.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // Tentukan sama ada untuk menunjukkan hasil carian
  const isSearchActive = searchQuery.trim() !== '';

  // Rendering untuk item kategori
  const renderCategoryItem = ({ item, index }: { item: SongCategory; index: number }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.songCard,
        { marginLeft: index % 2 === 0 ? 0 : '4%' },
        isDarkMode && { backgroundColor: '#2a2a2a' },
        { backgroundColor: currentColorTheme.surface },
        {
          borderWidth: 1,
          borderColor: currentColorTheme.border
        },
        Platform.OS === 'ios' && {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }
      ]}
      onPress={() => {
        // Tetapkan penanda SEBELUM navigasi
        navigatedWithinTabRef.current = true;

        if (item.id === 'lagusaya') {
          router.push('/my-songs');
        } else {
          router.push(`/song/category/${item.id}`);
        }
      }}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <>
            <Image
              source={item.image}
              style={styles.songImage}
              resizeMode="cover"
            />
            <View style={[
              styles.songNumberLabel,
              {
                backgroundColor: isDarkMode ? (currentColorTheme.id === 'white' ? '#333333' : currentColorTheme.primary) : (currentColorTheme.id === 'white' ? 'rgba(242, 242, 242, 0.9)' : currentColorTheme.primary),
                borderColor: isDarkMode ? (currentColorTheme.id === 'white' ? '#333333' : currentColorTheme.primary) : (currentColorTheme.id === 'white' ? '#e0e0e0' : currentColorTheme.primary),
                borderWidth: (!isDarkMode && currentColorTheme.id === 'white') ? 1 : 0
              }
            ]}>
              <Text style={[
                styles.songNumberText,
                { color: isDarkMode ? '#fff' : (currentColorTheme.id === 'white' ? '#333' : '#000') }
              ]}>{item.id.toUpperCase()}</Text>
            </View>
          </>
        ) : (
          <View style={[
            styles.songImage,
            styles.placeholderImage,
            {
              backgroundColor: isDarkMode ? '#3a3a3a' :
                item.id === 'a' ? '#f0f0f0' :
                  item.id === 'c' ? '#e8f4f8' :
                    item.id === 'd' ? '#f8e8e8' : '#f0f0f0'
            }
          ]}>
            <View style={[
              styles.songNumberLabel,
              {
                backgroundColor: isDarkMode ? (currentColorTheme.id === 'white' ? '#333333' : currentColorTheme.primary) : (currentColorTheme.id === 'white' ? 'rgba(242, 242, 242, 0.9)' : currentColorTheme.primary),
                borderColor: isDarkMode ? (currentColorTheme.id === 'white' ? '#333333' : currentColorTheme.primary) : (currentColorTheme.id === 'white' ? '#e0e0e0' : currentColorTheme.primary),
                borderWidth: (!isDarkMode && currentColorTheme.id === 'white') ? 1 : 0
              }
            ]}>
              <Text style={[
                styles.songNumberText,
                { color: isDarkMode ? '#fff' : (currentColorTheme.id === 'white' ? '#333' : '#000') }
              ]}>{item.id.toUpperCase()}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.songInfo}>
        <View style={styles.songTitleContainer}>
          <Text
            style={[
              styles.songTitleText,
              isDarkMode && styles.darkText,
              { fontSize: Math.max(12, Math.round(14 * sizeScale)) }
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            maxFontSizeMultiplier={1.1}
          >
            {t(item.titleKey as keyof typeof translations['Melayu'])}
          </Text>
        </View>
        {(item.songNumber || item.songNumberKey) && (
          <View style={styles.artistContainer}>
            <Text style={[
              styles.songArtist,
              { color: isDarkMode ? currentColorTheme.textSecondary : currentColorTheme.textSecondary, fontWeight: 'bold' }
            ]}>
              {item.songNumberKey ? t(item.songNumberKey) : item.songNumber}
            </Text>
            {item.verified && (
              <CheckCircle size={14} color={isDarkMode ? (currentColorTheme.id === 'white' ? '#0A84FF' : currentColorTheme.primary) : (currentColorTheme.id === 'white' ? '#3498db' : currentColorTheme.accent)} style={styles.verifiedIcon} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Rendering untuk item lagu dalam hasil carian
  const renderSongResultItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={[
        styles.songResultItem,
        isDarkMode && { backgroundColor: '#2a2a2a' },
        { backgroundColor: currentColorTheme.surface }
      ]}
      onPress={() => router.push({
        pathname: "/song/[id]",
        params: { id: item.id }
      })}
    >
      <View style={styles.songResultContent}>
        <Text style={[
          styles.songResultId,
          { color: isDarkMode ? currentColorTheme.primary : currentColorTheme.accent, fontWeight: 'bold' }
        ]}>{item.id}</Text>
        <Text style={[
          styles.songResultTitle,
          isDarkMode && { color: '#fff' },
          { color: isDarkMode ? '#fff' : '#333' }
        ]} numberOfLines={1}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // Main render
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#1a1a1a' },
        { backgroundColor: currentColorTheme.background }
      ]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View style={[
        styles.header,
        isDarkMode && { backgroundColor: '#1a1a1a' },
        { backgroundColor: currentColorTheme.background }
      ]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={[
              styles.logo,
              {
                width: Math.round(56 * sizeScale),
                height: Math.round(56 * sizeScale),
                marginRight: Math.round(10 * sizeScale),
              },
            ]}
          />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              maxFontSizeMultiplier={1}
              style={[
                styles.title,
                {
                  fontSize: Math.round(26 * sizeScale),
                },
                isDarkMode && { color: '#fff' }
              ]}
            >BUKU LAGU KATOLIK</Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              maxFontSizeMultiplier={1}
              style={[
                styles.subtitle,
                {
                  fontSize: Math.round(14 * sizeScale),
                },
                isDarkMode && { color: '#fff' }
              ]}
            >Pozoo No Kinoingan</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={[
          styles.searchBar,
          isDarkMode && { backgroundColor: '#3a3a3a' },
          !isDarkMode && {
            backgroundColor: currentColorTheme.id === 'white' ? '#f2f2f2' : currentColorTheme.surface,
            borderWidth: currentColorTheme.id === 'white' ? 1 : 0,
            borderColor: '#e8e8e8'
          }
        ]}>
          {isSearchActive ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.backButton}>
              <ArrowLeft size={20} color={currentColorTheme.textSecondary} />
            </TouchableOpacity>
          ) : (
            <Search size={22} color={currentColorTheme.textSecondary} />
          )}
          <TextInput
            style={[
              styles.searchInput,
              isDarkMode && { color: '#fff' },
              !isDarkMode && {
                color: currentColorTheme.primary === '#ffffff' ? '#333' : currentColorTheme.text
              }
            ]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={isDarkMode ? '#bbb' : (currentColorTheme.primary === '#ffffff' ? '#666' : currentColorTheme.textSecondary)}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {isSearchActive && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearButton, isDarkMode && { color: '#fff' }]}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearchActive ? (
        <View style={styles.searchResultsContainer}>
          <Text style={[
            styles.searchResultsTitle,
            isDarkMode && { color: '#fff' }
          ]}>
            {searchResults.length > 0
              ? `${t('searchResults')} (${searchResults.length})`
              : t('noSongsFound')}
          </Text>
          <FlatList
            data={searchResults}
            renderItem={renderSongResultItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.searchResultsContent}
          />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={songCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.songsContent}
          numColumns={2}
          removeClippedSubviews={false}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: 180, // Anggaran tinggi item
            offset: 180 * Math.floor(index / 2),
            index,
          })}
          onScroll={(event) => {
            const currentOffset = event.nativeEvent.contentOffset.y;
            scrollPositionRef.current = currentOffset;
          }}
          scrollEventThrottle={16}
        />
      )}

      {/* Modal Konfirmasi Keluar */}
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.exitModalContainer,
            isDarkMode && { backgroundColor: '#2a2a2a' },
            { backgroundColor: currentColorTheme.surface }
          ]}>
            <View style={styles.exitModalHeader}>
              <Text style={[
                styles.exitModalTitle,
                isDarkMode && { color: '#fff' }
              ]}>
                {t('exitAppTitle')}
              </Text>
            </View>

            <View style={styles.exitModalBody}>
              <Text style={[
                styles.exitModalMessage,
                isDarkMode && { color: '#ddd' },
                { color: currentColorTheme.textSecondary }
              ]}>
                {t('exitAppMessage')}
              </Text>
            </View>

            <View style={styles.exitModalFooter}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => setShowExitModal(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exitModalButton, styles.exitButton]}
                onPress={() => {
                  setShowExitModal(false);
                  exitApp();
                }}
              >
                <Text style={styles.exitButtonText}>
                  {t('exit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>

      {/* Changelog Modal */}
      <ChangelogModal
        visible={showChangelogModal}
        onClose={async () => {
          setShowChangelogModal(false);
          try {
            await AsyncStorage.setItem('last_seen_version', APP_VERSION);

          } catch (e) {
            console.error('[Changelog] Failed to save version', e);
          }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    marginRight: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: '#000',
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    flexShrink: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    padding: 4,
  },
  songsContainer: {
    flex: 1,
  },
  songsContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  songsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  songCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    } : {}),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  songImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  songNumberLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(238, 238, 238, 0.5)',
  },
  songNumberText: {
    color: '#333',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  placeholderImage: {
    backgroundColor: '#F5F5F5',
  },
  songInfo: {
    padding: 12,
  },
  songTitleContainer: {
    marginBottom: 4,
  },
  songTitleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songArtist: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginRight: 4,
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  // Gaya untuk hasil carian
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    color: '#333',
  },
  searchResultsContent: {
    paddingBottom: 16,
  },
  songResultItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songResultContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songResultId: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  songResultTitle: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  searchInputActive: {
    borderColor: '#666',
    borderWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  resultHeader: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    color: '#333',
  },
  resultList: {
    paddingBottom: 16,
  },
  emptyResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyResultsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  categoryImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryDetails: {
    padding: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  songCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  // Gaya untuk modal konfirmasi keluar
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exitModalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exitModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  exitModalBody: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  exitModalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  exitModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  exitModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  exitButton: {
    backgroundColor: 'red',
  },
  exitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});