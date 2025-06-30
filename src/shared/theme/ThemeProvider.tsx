import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { lightColors, darkColors, ColorScheme } from './colors';
import { spacing, Spacing } from './spacing';
import { borderRadius, BorderRadius } from './borderRadius';
import { typography, Typography } from './typography';
import { shadows, Shadows } from './shadows';

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

// Theme context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

// Theme provider component
export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const colorScheme = useSystemColorScheme();
  const defaultTheme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const currentTheme = theme || defaultTheme;

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}

// Helper hook for color scheme
export function useAppColorScheme(): 'light' | 'dark' {
  const theme = useTheme();
  return theme.isDark ? 'dark' : 'light';
} 