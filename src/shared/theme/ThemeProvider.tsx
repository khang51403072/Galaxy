import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { lightColors, darkColors, ColorScheme } from './colors/colors';
import { spacing, Spacing } from './spacing';
import { borderRadius, BorderRadius } from './borderRadius';
import { typography, Typography } from './typography';
import { shadows, Shadows } from './shadows';
import { pinkColors } from './colors/pinkColors';
import { ThemeType, getCurrentTheme, saveThemeSelection, getThemeById } from './ThemeManager';

// Theme interface
export interface Theme {
  colors: ColorScheme;
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: Typography;
  shadows: Shadows;
  isDark: boolean;
}

// Create light and dark themes
export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  isDark: true,
};

export const pinkTheme: Theme = {
  colors: pinkColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  isDark: true,
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  currentThemeId: ThemeType;
  changeTheme: (themeId: ThemeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeType>('light');
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getCurrentTheme();
      setCurrentTheme(savedTheme);
      // Determine theme ID from saved theme
     if (savedTheme === pinkTheme) {
        setCurrentThemeId('pink');
      } else {
        setCurrentThemeId('light');
      }
    };
    loadTheme();
  }, []);

  // Change theme function
  const changeTheme = async (themeId: ThemeType) => {
    const newTheme = getThemeById(themeId);
    setCurrentTheme(newTheme);
    setCurrentThemeId(themeId);
    await saveThemeSelection(themeId);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, currentThemeId, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
}

// Custom hook to use theme context (includes changeTheme function)
export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook for color scheme
export function useAppColorScheme(): 'light' | 'dark' {
  const theme = useTheme();
  return theme.isDark ? 'dark' : 'light';
} 