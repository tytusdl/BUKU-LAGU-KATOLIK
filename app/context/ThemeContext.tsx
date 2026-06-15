import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kunci untuk menyimpan tema di AsyncStorage
const THEME_STORAGE_KEY = 'theme_mode';
const COLOR_THEME_STORAGE_KEY = 'color_theme';

// Definisi skema warna
export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

// Predefined color themes
export const colorThemes: ColorScheme[] = [
  {
    id: 'white',
    name: 'White',
    primary: '#1A1A1A',
    secondary: '#D1D1D6',
    accent: '#333333',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#f2f2f2'
  },
  {
    id: 'blue',
    name: 'Blue',
    primary: '#9AC2F0',
    secondary: '#81b0ff',
    accent: '#3b5998',
    background: '#f0f4ff',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#424242',
    border: '#e0e0e0'
  },
  {
    id: 'green',
    name: 'Green',
    primary: '#96D99A',
    secondary: '#81C784',
    accent: '#388E3C',
    background: '#e8f5e8',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#424242',
    border: '#C8E6C9'
  },
  {
    id: 'purple',
    name: 'Purple',
    primary: '#C788D1',
    secondary: '#BA68C8',
    accent: '#7B1FA2',
    background: '#f3e5f5',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#4a4a4a',
    border: '#E1BEE7'
  },
  {
    id: 'pink',
    name: 'Pink',
    primary: '#F2A2C7',
    secondary: '#F48FB1',
    accent: '#E91E63',
    background: '#fce4ec',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#4a4a4a',
    border: '#F8BBD9'
  },
  {
    id: 'orange',
    name: 'Orange',
    primary: '#FFC975',
    secondary: '#FFB74D',
    accent: '#F57C00',
    background: '#fff3e0',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#4e342e',
    border: '#FFCC02'
  },
  {
    id: 'red',
    name: 'Red',
    primary: '#F59393',
    secondary: '#EF5350',
    accent: '#D32F2F',
    background: '#ffebee',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#424242',
    border: '#FFCDD2'
  }
];

// Dark mode - single unified dark theme with distinctive preview colors
export const darkColorThemes: ColorScheme[] = [
  {
    id: 'white',
    name: 'Dark',
    primary: '#ffffff',
    secondary: '#b0b0b0',
    accent: '#cccccc',
    background: '#000000',
    surface: '#111111',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#222222'
  },
  {
    id: 'blue',
    name: 'Dark',
    primary: '#5A9AF5',
    secondary: '#b0b0b0',
    accent: '#cccccc',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  },
  {
    id: 'green',
    name: 'Dark',
    primary: '#5BC55B',
    secondary: '#b0b0b0',
    accent: '#cccccc',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  },
  {
    id: 'purple',
    name: 'Dark',
    primary: '#B55BC5',
    secondary: '#b0b0b0',
    accent: '#cccccc',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  },
  {
    id: 'pink',
    name: 'Dark',
    primary: '#F584B3',
    secondary: '#b0b0b0',
    accent: '#cccccc',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  },
  {
    id: 'orange',
    name: 'Dark',
    primary: '#FF9A5B',
    secondary: '#b0b0b0',
    accent: '#cccccc',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  },
  {
    id: 'red',
    name: 'Dark',
    primary: '#FF6B6B',
    secondary: '#b0b0b0',
    accent: '#cccccc',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  }
];

// Definisi jenis context
type ThemeContextType = {
  isDarkMode: boolean;
  currentColorTheme: ColorScheme;
  colorThemeId: string;
  toggleTheme: () => Promise<void>;
  setColorTheme: (themeId: string) => Promise<void>;
  getCurrentColors: () => ColorScheme;
};

// Membuat context dengan nilai default
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  currentColorTheme: colorThemes[0],
  colorThemeId: 'white',
  toggleTheme: async () => { },
  setColorTheme: async () => { },
  getCurrentColors: () => colorThemes[0],
});

// Hook untuk menggunakan context
export const useTheme = () => useContext(ThemeContext);

// Props untuk provider
type ThemeProviderProps = {
  children: ReactNode;
};

// Provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorThemeId, setColorThemeId] = useState('white');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Muat tema dari AsyncStorage semasa komponen dimuat
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const savedColorTheme = await AsyncStorage.getItem(COLOR_THEME_STORAGE_KEY);

        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
        if (savedColorTheme !== null) {
          setColorThemeId(savedColorTheme);
        }
        // Tandakan tema telah dimuat untuk mengelakkan kelipan
        setIsThemeLoaded(true);
      } catch (error) {
        console.log('Error loading theme:', error);
        setIsThemeLoaded(true); // Tetapkan ke true walaupun ada ralat
      }
    };

    loadTheme();
  }, []);

  // Debug effect to track colorThemeId changes
  useEffect(() => {
    console.log('ThemeContext: colorThemeId changed to:', colorThemeId);
  }, [colorThemeId]);

  // Debug effect to track isDarkMode changes
  useEffect(() => {
    console.log('ThemeContext: isDarkMode changed to:', isDarkMode);
  }, [isDarkMode]);

  // Togol tema
  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  // Set color theme
  const setColorTheme = async (themeId: string) => {
    console.log('ThemeContext: Setting color theme to:', themeId);
    console.log('ThemeContext: Current theme before change:', colorThemeId);
    setColorThemeId(themeId);
    try {
      await AsyncStorage.setItem(COLOR_THEME_STORAGE_KEY, themeId);
      console.log('ThemeContext: Color theme saved to AsyncStorage');
    } catch (error) {
      console.log('Error saving color theme:', error);
    }
  };

  // Get current color scheme
  const getCurrentColors = (): ColorScheme => {
    const themes = isDarkMode ? darkColorThemes : colorThemes;
    const selectedTheme = themes.find(theme => theme.id === colorThemeId) || themes[0];
    console.log('ThemeContext: getCurrentColors - isDarkMode:', isDarkMode, 'colorThemeId:', colorThemeId);
    console.log('ThemeContext: Selected theme:', selectedTheme.name, 'Primary color:', selectedTheme.primary);
    return selectedTheme;
  };

  const currentColorTheme = useMemo(() => {
    const themes = isDarkMode ? darkColorThemes : colorThemes;
    const selectedTheme = themes.find(theme => theme.id === colorThemeId) || themes[0];
    console.log('ThemeContext: useMemo currentColorTheme - isDarkMode:', isDarkMode, 'colorThemeId:', colorThemeId);
    console.log('ThemeContext: Selected theme:', selectedTheme.name, 'Primary color:', selectedTheme.primary);
    return selectedTheme;
  }, [isDarkMode, colorThemeId]);

  // Gunakan useMemo untuk mengelakkan pengiraan semula value pada setiap rendering
  const value = useMemo(() => ({
    isDarkMode,
    currentColorTheme,
    colorThemeId,
    toggleTheme,
    setColorTheme,
    getCurrentColors,
  }), [isDarkMode, currentColorTheme, colorThemeId]);

  // Tunggu hingga tema dimuat untuk mengelakkan kelipan
  if (!isThemeLoaded) {
    // Pulangkan null, atau pembungkus null yang serupa dengan UI akhir anda
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Eksport kedua-dua komponen ThemeProvider dan ThemeContext
export { ThemeContext };
export default ThemeProvider;