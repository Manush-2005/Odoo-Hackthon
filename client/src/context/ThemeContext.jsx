import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createLightTheme, createDarkTheme, odooVariables } from '../theme/odooTheme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Check for existing theme preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setIsDark(storedTheme === 'dark');
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  // Apply theme to document and CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply Odoo CSS variables
    Object.entries(odooVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Create the appropriate MUI theme
  const muiTheme = isDark ? createDarkTheme() : createLightTheme();

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light',
    muiTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};