import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { COLORS } from '../assets';

// Create theme variants
const lightTheme = {
  mode: 'light',
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    tertiary: COLORS.tertiary,
    accent: COLORS.accent,
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#EEEEEE'
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      tertiary: '#999999'
    },
    border: '#E0E0E0',
    card: '#FFFFFF',
    statusBar: 'dark-content'
  }
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    tertiary: COLORS.tertiary,
    accent: COLORS.accent,
    background: {
      primary: COLORS.background.dark,
      secondary: COLORS.background.medium,
      tertiary: COLORS.background.light
    },
    text: {
      primary: COLORS.text.primary,
      secondary: COLORS.text.secondary,
      tertiary: COLORS.text.tertiary
    },
    border: '#444444',
    card: '#222222',
    statusBar: 'light-content'
  }
};

// Create context
const ThemeContext = createContext({
  theme: darkTheme,
  isDarkMode: true,
  toggleTheme: () => {},
  useSystemTheme: true,
  enableSystemTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Get system theme
  const colorScheme = useColorScheme();
  
  // State to track if we're using the system theme or a manually set theme
  // Default is true - use the system theme by default
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  // Update theme when system theme changes
  useEffect(() => {
    if (useSystemTheme) {
      setIsDarkMode(colorScheme === 'dark');
    }
  }, [colorScheme, useSystemTheme]);

  // Subscribe to appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (useSystemTheme) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, [useSystemTheme]);

  // Toggle theme function
  const toggleTheme = (value) => {
    if (typeof value === 'boolean') {
      setIsDarkMode(value);
      setUseSystemTheme(false);
    } else {
      setIsDarkMode(prevMode => !prevMode);
      setUseSystemTheme(false);
    }
  };

  // Enable system theme sync
  const enableSystemTheme = () => {
    setUseSystemTheme(true);
    setIsDarkMode(colorScheme === 'dark');
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDarkMode, 
        toggleTheme,
        useSystemTheme,
        enableSystemTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 