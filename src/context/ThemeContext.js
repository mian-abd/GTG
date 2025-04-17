import React, { createContext, useState, useContext } from 'react';
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
});

export const ThemeProvider = ({ children }) => {
  // Always start with dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Toggle theme function
  const toggleTheme = (value) => {
    if (typeof value === 'boolean') {
      setIsDarkMode(value);
    } else {
      setIsDarkMode(prevMode => !prevMode);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDarkMode, 
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 