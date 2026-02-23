// src/store/themeStore.js
// Zustand store for the active theme — persists to AsyncStorage.
// Key trick: we mutate the `colors` object from ../../theme/index.js
// in-place, then bump `themeKey` to force a full app re-render so every
// StyleSheet.create() picks up the new values automatically.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';
import { THEMES, DEFAULT_THEME } from '../theme/themes';

const STORAGE_KEY = 'sp_theme_name';

const applyThemeColors = (themeName) => {
    const theme = THEMES[themeName] || THEMES[DEFAULT_THEME];
    // Mutate in-place so existing module-level `colors` references update
    Object.keys(theme).forEach((key) => {
        if (key !== 'id' && key !== 'label' && key !== 'emoji' && key !== 'preview') {
            colors[key] = theme[key];
        }
    });
};

export const useThemeStore = create((set, get) => ({
    themeName: DEFAULT_THEME,
    themeKey: 0,          // changing this key forces NavigationContainer to re-mount

    // Called once on app start to load the saved theme
    initTheme: async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            const name = saved && THEMES[saved] ? saved : DEFAULT_THEME;
            applyThemeColors(name);
            // themeKey stays 0 — initial paint is correct
            set({ themeName: name });
        } catch {
            applyThemeColors(DEFAULT_THEME);
        }
    },

    // Switch to a new theme and persist
    setTheme: async (name) => {
        if (!THEMES[name] || name === get().themeName) return;
        applyThemeColors(name);
        set({ themeName: name, themeKey: get().themeKey + 1 });
        try {
            await AsyncStorage.setItem(STORAGE_KEY, name);
        } catch { /* ignore */ }
    },
}));

export default useThemeStore;
