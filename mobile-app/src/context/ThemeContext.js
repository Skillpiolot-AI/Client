// context/ThemeContext.js — Global theme state with persistence
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme/themes';

const THEME_KEY = 'skillpilot_theme';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(THEME_KEY)
            .then(val => { if (val === 'dark') setIsDark(true); })
            .finally(() => setLoaded(true));
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const next = !prev;
            AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light').catch(() => { });
            return next;
        });
    }, []);

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, loaded }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
