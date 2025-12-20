// App Theme Configuration
export const colors = {
    // Primary colors
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',

    // Secondary colors
    secondary: '#EC4899',
    secondaryDark: '#DB2777',
    secondaryLight: '#F472B6',

    // Accent colors
    accent: '#10B981',
    accentDark: '#059669',
    accentLight: '#34D399',

    // Neutral colors
    background: '#0F172A',
    surface: '#1E293B',
    surfaceLight: '#334155',
    card: '#1E293B',

    // Text colors
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Border colors
    border: '#334155',
    borderLight: '#475569',

    // White and black
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
};

export const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
};

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
};

export default {
    colors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    shadows,
};
