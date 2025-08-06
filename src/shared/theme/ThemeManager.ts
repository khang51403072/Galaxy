import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, pinkTheme, Theme } from './ThemeProvider';

// Theme types
export type ThemeType = 'light' | 'pink';

// Theme configuration
export const THEMES = {
  light: {
    id: 'light',
    name: 'Default',
    theme: lightTheme,
    previewColor: '#1D62D8'
  },
  
  pink: {
    id: 'pink',
    name: 'Pink',
    theme: pinkTheme,
    previewColor: '#EC6986'
  }
} as const;

// Storage key
const THEME_STORAGE_KEY = '@app_theme_selection';

// Get all available themes
export const getAvailableThemes = () => {
  return Object.values(THEMES);
};

// Get theme by ID
export const getThemeById = (themeId: ThemeType): Theme => {
  return THEMES[themeId].theme;
};

// Get theme info by ID
export const getThemeInfo = (themeId: ThemeType) => {
  return THEMES[themeId];
};

// Save theme selection to AsyncStorage
export const saveThemeSelection = async (themeId: ThemeType): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (error) {
    console.error('Error saving theme selection:', error);
  }
};

// Load theme selection from AsyncStorage
export const loadThemeSelection = async (): Promise<ThemeType> => {
  try {
    const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && savedTheme in THEMES) {
      return savedTheme as ThemeType;
    }
  } catch (error) {
    console.error('Error loading theme selection:', error);
  }
  return 'light'; // Default theme
};

// Get current theme based on saved selection
export const getCurrentTheme = async (): Promise<Theme> => {
  const themeId = await loadThemeSelection();
  return getThemeById(themeId);
}; 