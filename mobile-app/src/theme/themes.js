// themes.js — Light & Dark theme definitions for SkillPilot
// Primary: Indigo/Purple (wisdom, trust, academic)
// Accent: Amber/Orange (energy, growth, motivation)

const base = {
    // Brand — Indigo for trust/wisdom, used by top EdTech apps
    primary: '#5B5FEF',
    primaryDark: '#3D40C4',
    primaryLight: '#8B8FF8',
    // Accent — Warm amber for energy, calls-to-action
    accent: '#F59E0B',
    accentDark: '#D97706',
    accentLight: '#FCD34D',
    // Semantic
    success: '#10B981',
    successLight: '#6EE7B7',
    successDark: '#059669',
    warning: '#F59E0B',
    warningLight: '#FCD34D',
    error: '#EF4444',
    errorLight: '#FCA5A5',
    errorDark: '#DC2626',
    info: '#3B82F6',
    infoLight: '#93C5FD',
    // Always-same
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
};

export const lightTheme = {
    ...base,
    // Backgrounds
    background: '#F5F6FA',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F0F5',
    surfaceLight: '#E8E8F0',
    // Card
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    // Text
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    textDisabled: '#D1D5DB',
    textInverse: '#FFFFFF',
    // Borders
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderFocus: '#5B5FEF',
    // Utility
    overlay: 'rgba(0,0,0,0.50)',
    overlayLight: 'rgba(0,0,0,0.25)',
    // Tinted backgrounds for icons/chips
    primaryBg: '#EEF2FF',
    primaryBorder: '#C7D2FE',
    successBg: '#ECFDF5',
    warningBg: '#FFFBEB',
    errorBg: '#FEF2F2',
    infoBg: '#EFF6FF',
    accentBg: '#FFFBEB',
};

export const darkTheme = {
    ...base,
    // Backgrounds
    background: '#0F0F14',
    surface: '#1A1A24',
    surfaceAlt: '#22222E',
    surfaceLight: '#2A2A38',
    // Card
    card: '#1E1E2A',
    cardBorder: '#2E2E40',
    // Text
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    textDisabled: '#374151',
    textInverse: '#111827',
    // Borders
    border: '#2E2E40',
    borderLight: '#3A3A50',
    borderFocus: '#7C7FF5',
    // Utility
    overlay: 'rgba(0,0,0,0.75)',
    overlayLight: 'rgba(0,0,0,0.45)',
    // Tinted backgrounds for icons/chips
    primaryBg: '#5B5FEF20',
    primaryBorder: '#5B5FEF50',
    successBg: '#10B98120',
    warningBg: '#F59E0B20',
    errorBg: '#EF444420',
    infoBg: '#3B82F620',
    accentBg: '#F59E0B20',
};
