import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Minus, Plus, Type, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { songs } from '../../data/songs';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const FONT_SIZE_KEY = 'appFontSize';

export default function SongDetail() {
  const { id } = useLocalSearchParams();
  const song = songs.find(s => s.id === id);
  const [fontSize, setFontSize] = useState(16);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { isDarkMode } = useTheme();
  
  // Periksa jika lagu ini adalah kegemaran
  const songIsFavorite = isFavorite(id as string);

  // Fungsi untuk mengendalikan togol kegemaran
  const toggleFavorite = async () => {
    if (songIsFavorite) {
      await removeFromFavorites(id as string);
    } else {
      await addToFavorites(id as string);
    }
  };

  // Ambil saiz fon dari AsyncStorage semasa komponen dimuat
  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const savedFontSize = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (savedFontSize !== null) {
          setFontSize(Number(savedFontSize));
        }
      } catch (error) {
        console.log('Error loading font size', error);
      }
    };

    loadFontSize();
  }, []);

  const increaseFontSize = async () => {
    if (fontSize < 28) {
      const newSize = fontSize + 2;
      setFontSize(newSize);
      try {
        await AsyncStorage.setItem(FONT_SIZE_KEY, newSize.toString());
      } catch (error) {
        console.log('Error saving font size', error);
      }
    }
  };

  const decreaseFontSize = async () => {
    if (fontSize > 12) {
      const newSize = fontSize - 2;
      setFontSize(newSize);
      try {
        await AsyncStorage.setItem(FONT_SIZE_KEY, newSize.toString());
      } catch (error) {
        console.log('Error saving font size', error);
      }
    }
  };

  // Tambah log untuk mengesan apakah nilai tema
  console.log('Song Detail Screen - Dark Mode:', isDarkMode);

  if (!song) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Lagu Tidak Ditemui</Text>
        </View>
        <View style={styles.content}>
          <Text style={isDarkMode && styles.darkText}>Lagu dengan ID {id} tidak ditemui.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Fungsi untuk memformat lirik dan mengesan korus - dioptimasi untuk prestasi
  const renderLyrics = () => {
    const lines = song.lyrics.split('\n');
    let inChorus = false;
    let inIntro = false;
    
    // Optimasi: Gunakan memo untuk mengelakkan rendering berulang
    return useMemo(() => {
      let formattedLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Kesan permulaan korus atau intro
        if (line.match(/^(\*\*)??(Chorus|Cho|Kor|Korus|Ref|Choros)\s*:(.*)$/i)) {
          inChorus = true;
          inIntro = false;
          const matchResult = line.match(/^(\*\*)??(Chorus|Cho|Kor|Korus|Ref|Choros)\s*:(.*)$/i);
          
          if (matchResult) {
            const prefix = matchResult[1] || '';
            const korusLabel = matchResult[2] || '';
            const restOfLine = matchResult[3] ? matchResult[3].trim() : '';
            
            formattedLines.push(
              <View key={`chorus-container-${i}`} style={styles.chorusContainer}>
                <Text style={[styles.lyrics, styles.chorusHeader, { 
                  fontSize: fontSize,
                  lineHeight: fontSize * 1.5,
                  fontWeight: 'bold',
                  color: isDarkMode ? '#fff' : '#000'
                }]}>
                  {prefix}{korusLabel}:
                </Text>
                
                {restOfLine && (
                  <Text style={[styles.lyrics, styles.chorusFirstLine, { 
                    fontSize: fontSize,
                    lineHeight: fontSize * 1.5,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#fff' : '#000'
                  }]}>
                    {restOfLine}
                  </Text>
                )}
              </View>
            );
          }
          continue;
        }
        
        // Kesan permulaan intro
        if (line.match(/^(\*\*)??(Intro|Int|Pengenalan)\s*:(.*)$/i)) {
          inChorus = false;
          inIntro = true;
          const matchResult = line.match(/^(\*\*)??(Intro|Int|Pengenalan)\s*:(.*)$/i);
          
          if (matchResult) {
            const prefix = matchResult[1] || '';
            const introLabel = matchResult[2] || '';
            const restOfLine = matchResult[3] ? matchResult[3].trim() : '';
            
            formattedLines.push(
              <View key={`intro-container-${i}`} style={styles.chorusContainer}>
                <Text style={[styles.lyrics, styles.chorusHeader, { 
                  fontSize: fontSize,
                  lineHeight: fontSize * 1.5,
                  fontWeight: 'bold',
                  color: isDarkMode ? '#fff' : '#000'
                }]}>
                  {prefix}{introLabel}:
                </Text>
                
                {restOfLine && (
                  <Text style={[styles.lyrics, styles.chorusFirstLine, { 
                    fontSize: fontSize,
                    lineHeight: fontSize * 1.5,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#fff' : '#000'
                  }]}>
                    {restOfLine}
                  </Text>
                )}
              </View>
            );
          }
          continue;
        }
        
        // Baris korus atau intro berikutnya
        if ((inChorus || inIntro) && line.trim() !== '') {
          formattedLines.push(
            <View key={`special-line-${i}`} style={styles.chorusLineContainer}>
              <Text style={[styles.lyrics, styles.chorusLine, {
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
                fontWeight: 'bold',
                color: isDarkMode ? '#fff' : '#000'
              }]}>
                {line.trim()}
              </Text>
            </View>
          );
          continue;
        }
        
        // Kesan akhir korus atau intro
        if ((inChorus || inIntro) && line.trim() === '') {
          inChorus = false;
          inIntro = false;
          formattedLines.push(
            <View key={`empty-line-${i}`} style={{ height: 20 }}></View>
          );
          continue;
        }
        
        // Baris lirik biasa
        if (line.trim() !== '') {
          formattedLines.push(
            <Text key={`line-${i}`} style={[styles.lyrics, {
              fontSize: fontSize,
              lineHeight: fontSize * 1.5,
              marginBottom: 5,
              color: isDarkMode ? '#fff' : '#000'
            }]}>
              {line}
            </Text>
          );
        } else {
          formattedLines.push(
            <View key={`empty-line-${i}`} style={{ height: 20 }}></View>
          );
        }
      }
      
      return formattedLines;
    }, [fontSize, isDarkMode, song.lyrics]); // Tambah dependencies yang relevan sahaja
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>{song.id} {song.title}</Text>
          {song.author && <Text style={[styles.headerAuthor, isDarkMode && styles.darkText]}>oleh: <Text style={[styles.italicText, isDarkMode && styles.darkText]}>{song.author}</Text></Text>}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Heart 
              size={24} 
              color={songIsFavorite ? "#ff4081" : isDarkMode ? "#fff" : "#000"}
              fill={songIsFavorite ? "#ff4081" : "none"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={decreaseFontSize} style={styles.fontSizeButton}>
            <Minus size={20} color={isDarkMode ? "#fff" : "#000"} style={styles.fontIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fontSizeButton}>
            <Type size={20} color={isDarkMode ? "#fff" : "#000"} style={styles.fontIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={increaseFontSize} style={styles.fontSizeButton}>
            <Plus size={20} color={isDarkMode ? "#fff" : "#000"} style={styles.fontIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        style={[styles.content, isDarkMode && styles.darkContent]} 
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews={true} // Optimasi prestasi
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={20}
      >
        <View style={styles.songInfo}>
        </View>
        {renderLyrics()}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkHeader: {
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
  headerAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  darkAuthorText: {
    color: '#aaa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  darkContent: {
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  songInfo: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  lyrics: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  chorusContainer: {
    marginBottom: 8,
  },
  chorusHeader: {
    fontWeight: 'bold',
  },
  chorusFirstLine: {
    fontWeight: 'bold',
    marginLeft: 16,
  },
  chorusLineContainer: {
    marginLeft: 16,
    marginBottom: 8,
  },
  chorusLine: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeButton: {
    padding: 5,
    marginHorizontal: 2,
  },
  fontIcon: {
    opacity: 0.8,
  },
  favoriteButton: {
    padding: 5,
    marginRight: 5,
  },
  bottomSpacing: {
    height: 50,
  },
}); 