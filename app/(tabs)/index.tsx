import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, BackHandler, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, Settings, Heart, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { router, useFocusEffect } from 'expo-router';
import { songs as allSongs } from '../data/songs';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objek terjemahan
const translations = {
  'Melayu': {
    searchPlaceholder: 'Cari lagu mengikut tajuk atau nombor',
    searchResults: 'Hasil Carian',
    noSongsFound: 'Tiada lagu dijumpai'
  },
  'English': {
    searchPlaceholder: 'Search songs by title or number',
    searchResults: 'Search Results',
    noSongsFound: 'No songs found'
  }
};

// Tambah pengisytiharan jenis untuk kategori lagu
interface SongCategory {
  id: string;
  title: string;
  songNumber: string;
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
    id: 'a',
    title: 'HOZOU KOSUANGAN',
    songNumber: 'A1-A32',
    image: require('../../assets/images/categories/category_a.png'),  
    verified: true
  },
  {
    id: 'b',
    title: 'HOZOU DI KOSIMABAAN',
    songNumber: 'B1-B23',
    image: require('../../assets/images/categories/category_b.png'),
    verified: true
  },
  {
    id: 'c',
    title: 'HOZOU DO KAPATAKAN',
    songNumber: 'C1-C24',
    image: require('../../assets/images/categories/category_c.png'),
    verified: true
  },
  {
    id: 'd',
    title: 'HOZOU DO KOSOMBUTAN / KOPONONGKOTOHUADAN',
    songNumber: 'D1-D46',
    image: require('../../assets/images/categories/category_d.png'),
    verified: true
  },
  {
    id: 'e',
    title: 'HOZOU DO KOOVIAN / KOPONONGKOTOHUADANAN',
    songNumber: 'E1-E18',
    image: require('../../assets/images/categories/category_e.png'),
    verified: true
  },
  {
    id: 'f',
    title: 'HOZOU ID KAPANTANGAN DI SANGTI MARIA',
    songNumber: 'F1-F11',
    image: require('../../assets/images/categories/category_f.png'),
    verified: true
  },
  {
    id: 'g',
    title: 'HOZOU ID KAPANTANGAN DI SPIRITU SANGTI',
    songNumber: 'G1-G9',
    image: require('../../assets/images/categories/category_g.png'),
    verified: true
  },
  {
    id: 'h',
    title: 'HOZOU ONTOK KAPAGANDADAN',
    songNumber: 'H1-H4',
    image: require('../../assets/images/categories/category_h.png'),
    verified: true
  },
  {
    id: 'i',
    title: 'HOZOU DO KRISMAS',
    songNumber: 'I1-I14',
    image: require('../../assets/images/categories/category_i.png'),
    verified: true
  },
  {
    id: 'j',
    title: 'HOZOU DO KOPONOGITAN',
    songNumber: 'J1-J17',
    image: require('../../assets/images/categories/category_j.png'),
    verified: true
  },
  {
    id: 'k',
    title: 'HOZOU DO PASKA',
    songNumber: 'K1-K8',
    image: require('../../assets/images/categories/category_k.png'),
    verified: true
  },
  {
    id: 'l',
    title: 'HOZOU DO KAAMATAN',
    songNumber: 'L1-L4',
    image: require('../../assets/images/categories/category_l.png'),
    verified: true
  },
  {
    id: 'm',
    title: 'HOZOU NGAAVI DO SUUSUVAI',
    songNumber: 'M1-M33',
    image: require('../../assets/images/categories/category_m.png'),
    verified: true
  },
  {
    id: 'n',
    title: 'HOZOU DO PISASAVAAN',
    songNumber: 'N1-N4',
    image: require('../../assets/images/categories/category_n.png'),
    verified: true
  },
  {
    id: 'o',
    title: 'YOHOU DO ASCENSIO',
    songNumber: 'O1',
    image: require('../../assets/images/categories/category_o.png'),
    verified: true
  },
  {
    id: 'p',
    title: 'DOID SANTA TRINITAS',
    songNumber: 'P1-P4',
    image: require('../../assets/images/categories/category_p.png'),
    verified: true
  },
  {
    id: 'r',
    title: 'LAGU R',
    songNumber: 'R001-R471',
    image: require('../../assets/images/categories/category_r.png'),
    verified: true
  }
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
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29', 'M30', 'M31', 'M32', 'M33',
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

export default function HomeScreen() {
  const { isDarkMode } = useTheme();
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });
  
  // Tambah state untuk carian
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('Melayu');
  
  // Fungsi untuk mendapatkan terjemahan berdasarkan bahasa semasa
  const t = (key: keyof typeof translations['Melayu']) => {
    return translations[currentLanguage as keyof typeof translations][key];
  };
  
  // Ambil bahasa dari AsyncStorage ketika komponen dimuat pertama kali
  useEffect(() => {
    const getLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('app-language');
        if (storedLanguage) {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error getting language:', error);
      }
    };
    
    getLanguage();
  }, []);
  
  // Periksa bahasa semasa ketika skrin fokus dan kendalikan tombol back
  useFocusEffect(
    React.useCallback(() => {
      // Periksa bahasa semasa
      const checkLanguage = async () => {
        try {
          const storedLanguage = await AsyncStorage.getItem('app-language');
          if (storedLanguage && storedLanguage !== currentLanguage) {
            setCurrentLanguage(storedLanguage);
          }
        } catch (error) {
          console.error('Error checking language:', error);
        }
      };
      
      checkLanguage();
      
      // Tambah penangan back button hanya ketika skrin ini fokus (halaman utama)
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (searchQuery.trim() !== '') {
          setSearchQuery('');
          return true; // Cegah keluar dari aplikasi jika ada pencarian aktif
        }
        
        // Tetapkan dialog konfirmasi keluar hanya pada halaman utama
        Alert.alert(
          currentLanguage === 'Melayu' ? 'Keluar Aplikasi' : 'Exit Application',
          currentLanguage === 'Melayu' ? 'Adakah anda pasti mahu keluar dari aplikasi?' : 'Are you sure you want to exit the application?',
          [
            {
              text: currentLanguage === 'Melayu' ? 'Batal' : 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: currentLanguage === 'Melayu' ? 'Keluar' : 'Exit',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true; // Cegah keluar dari aplikasi sehingga pengguna mengesahkan
      });

      // Cleanup ketika skrin tidak lagi difokuskan
      return () => {
        backHandler.remove();
      };
    }, [currentLanguage, searchQuery])
  );
  
  // Fungsi untuk mencari lagu berdasarkan kata kunci
  const searchResults = searchQuery.trim() !== '' 
    ? allSongs.filter(song => {
        const query = searchQuery.toLowerCase().trim();
        return (
          song.title.toLowerCase().includes(query) || 
          song.id.toLowerCase().includes(query) || 
          (song.lyrics && song.lyrics.toLowerCase().includes(query))
        );
      })
    : [];
  
  // Tentukan sama ada untuk menunjukkan hasil carian atau kategori
  const isSearchActive = searchQuery.trim() !== '';

  if (!fontsLoaded) {
    return null;
  }

  // Rendering untuk item kategori
  const renderCategoryItem = ({ item, index }: { item: SongCategory; index: number }) => (
    <TouchableOpacity 
      key={item.id} 
      style={[
        styles.songCard,
        { marginLeft: index % 2 === 0 ? 0 : '4%' },
        isDarkMode && { backgroundColor: '#2a2a2a' },
        Platform.OS === 'ios' && { 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }
      ]}
      onPress={() => router.push(`/song/category/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image 
            source={item.image} 
            style={styles.songImage} 
            resizeMode="cover"
          />
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
          </View>
        )}
      </View>
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, isDarkMode && { color: '#fff' }]} numberOfLines={2}>{item.title}</Text>
        {item.songNumber && (
          <View style={styles.artistContainer}>
            <Text style={[styles.songArtist, isDarkMode && { color: '#aaa' }]}>{item.songNumber}</Text>
            {item.verified && (
              <CheckCircle size={14} color="#1DA1F2" style={styles.verifiedIcon} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Rendering untuk item lagu dalam hasil carian
  const renderSongResultItem = ({ item }: { item: Song }) => (
    <TouchableOpacity 
      style={[styles.songResultItem, isDarkMode && { backgroundColor: '#2a2a2a' }]}
      onPress={() => router.push({
        pathname: "/song/[id]",
        params: { id: item.id }
      })}
    >
      <View style={styles.songResultContent}>
        <Text style={[styles.songResultId, isDarkMode && { color: '#4872F4' }]}>{item.id}</Text>
        <Text style={[styles.songResultTitle, isDarkMode && { color: '#fff' }]} numberOfLines={1}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#1a1a1a' }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <View style={[styles.header, isDarkMode && { backgroundColor: '#1a1a1a' }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
          />
          <View>
            <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>BUKU LAGU KATOLIK</Text>
            <Text style={[styles.subtitle, isDarkMode && { color: '#fff' }]}>Pozoo No Kinoingan</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDarkMode && { backgroundColor: '#2a2a2a' }]}>
          {isSearchActive ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.backButton}>
              <ArrowLeft size={20} color={isDarkMode ? "#999" : "#666"} />
            </TouchableOpacity>
          ) : (
            <Search size={22} color={isDarkMode ? "#999" : "#666"} />
          )}
          <TextInput
            style={[styles.searchInput, isDarkMode && { color: '#fff' }]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={isDarkMode ? "#999" : "#666"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {isSearchActive && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearButton, isDarkMode && { color: '#fff' }]}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/setting')}>
          <Settings size={24} color={isDarkMode ? "#fff" : "#333"} />
        </TouchableOpacity>
      </View>
      
      {isSearchActive ? (
        <View style={styles.searchResultsContainer}>
          <Text style={[styles.searchResultsTitle, isDarkMode && { color: '#fff' }]}>
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
          data={songCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.songsContent}
          numColumns={2}
          removeClippedSubviews={true}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: 180, // Anggaran tinggi item
            offset: 180 * Math.floor(index / 2),
            index,
          })}
        />
      )}
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
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
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
    marginRight: 12,
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
  placeholderImage: {
    backgroundColor: '#F5F5F5',
  },
  songInfo: {
    padding: 12,
  },
  songTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 4,
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
    color: '#1DA1F2',
    width: 60,
  },
  songResultTitle: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  searchInputActive: {
    borderColor: '#1DA1F2',
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
});