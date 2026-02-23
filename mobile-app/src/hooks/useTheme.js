// src/hooks/useTheme.js
// Convenience hook — use anywhere to read the active theme name, colors,
// and the setTheme action.

import { useThemeStore } from '../store/themeStore';
import { colors } from '../theme';
import { THEMES, THEME_LIST } from '../theme/themes';

const useTheme = () => {
    const { themeName, setTheme } = useThemeStore();
    return {
        themeName,          // e.g. 'dark' | 'light' | 'ocean' ...
        theme: THEMES[themeName],  // full theme object (includes preview, emoji, etc.)
        themes: THEME_LIST, // all available themes for pickers
        colors,             // the live mutable colors object
        setTheme,           // (name: string) => void
    };
};

export default useTheme;
