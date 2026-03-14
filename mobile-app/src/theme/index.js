// SkillPilot AI — Centralized Design System (Dark Theme)
// Primary Accent: #4F46E5 (Indigo) | Background: #0D0D0D | Text: #FFFFFF

// ─── Colors ──────────────────────────────────────────────────────────────────
export const colors = {
    // Primary brand color
    primary: '#4F46E5',
    primaryDark: '#3730A3',
    primaryLight: '#818CF8',
    primaryBg: '#4F46E518',   // ~10% opacity tint
    primaryBorder: '#4F46E535',   // ~21% opacity border

    // Secondary accent
    secondary: '#6366F1',
    secondaryDark: '#4338CA',
    secondaryLight: '#A5B4FC',

    // Semantic status colors
    success: '#22C55E',
    successDark: '#16A34A',
    successLight: '#86EFAC',
    successBg: '#22C55E18',

    warning: '#FACC15',
    warningDark: '#EAB308',
    warningLight: '#FDE68A',
    warningBg: '#FACC1518',

    error: '#EF4444',
    errorDark: '#DC2626',
    errorLight: '#FCA5A5',
    errorBg: '#EF444418',

    info: '#38BDF8',
    infoDark: '#0284C7',
    infoLight: '#BAE6FD',
    infoBg: '#38BDF818',

    // Background surfaces (dark hierarchy)
    background: '#0D0D0D',
    surface: '#1A1A1A',
    surfaceAlt: '#222222',
    surfaceLight: '#2A2A2A',

    // Card
    card: '#242424',
    cardBorder: '#2E2E2E',

    // Text hierarchy
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textDisabled: '#3F3F46',
    textInverse: '#0D0D0D',

    // Border / divider
    border: '#2E2E2E',
    borderLight: '#3F3F46',
    borderFocus: '#4F46E5',

    // UI utility
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.72)',
    overlayLight: 'rgba(0, 0, 0, 0.40)',
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
    pill: 50,
    full: 9999,
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const fontSize = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    hero: 36,
    display: 42,
};

export const lineHeight = {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
};

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
};

export const letterSpacing = {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
};

// ─── Shadows (adapted for dark — use primary-tinted shadows for accented elements) ──
export const shadows = {
    none: {},
    xs: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.30,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.40,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.50,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.60,
        shadowRadius: 16,
        elevation: 8,
    },
    primary: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 6,
    },
};

// ─── Common Reusable Style Objects ───────────────────────────────────────────

export const commonStyles = {
    // Screen containers
    screenContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.md,
    },

    // Cards
    card: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.sm,
    },
    cardElevated: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        ...shadows.md,
    },

    // Screen-level header
    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: 56,
        paddingBottom: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },

    // Back button
    backButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Section headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    seeAllText: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },

    // Input container
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        height: 50,
    },

    // Primary button
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.xl,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.primary,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        letterSpacing: 0.3,
    },

    // Secondary button (outlined)
    secondaryButton: {
        backgroundColor: colors.transparent,
        borderRadius: borderRadius.xl,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
    },

    // Loading
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Empty state
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        marginTop: spacing.md,
    },
    emptyText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        textAlign: 'center',
    },

    // Status badge
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
    },

    // Pill button
    pillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },

    // Input field
    inputField: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        fontSize: fontSize.md,
        color: colors.text,
        height: 50,
    },
};

export default {
    colors,
    spacing,
    borderRadius,
    fontSize,
    lineHeight,
    fontWeight,
    letterSpacing,
    shadows,
    commonStyles,
};
