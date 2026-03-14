// Badge / Status Tag Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize, fontWeight, spacing } from '../../theme';

const Badge = ({
    text,
    variant = 'default',
    size = 'md',
    style,
    textStyle,
    color,
    dot = false,
}) => {
    const getBadgeStyle = () => {
        const base = [styles.badge, styles[size]];

        if (color) {
            base.push({ backgroundColor: color + '20' });
        } else {
            switch (variant) {
                case 'success': base.push(styles.success); break;
                case 'warning': base.push(styles.warning); break;
                case 'error': base.push(styles.error); break;
                case 'info': base.push(styles.info); break;
                case 'primary': base.push(styles.primary); break;
                case 'secondary': base.push(styles.secondary); break;
                default: base.push(styles.default);
            }
        }

        return base;
    };

    const getTextStyle = () => {
        const base = [styles.text, styles[`${size}Text`]];

        if (color) {
            base.push({ color });
        } else {
            switch (variant) {
                case 'success': base.push({ color: colors.successDark }); break;
                case 'warning': base.push({ color: colors.warningDark }); break;
                case 'error': base.push({ color: colors.errorDark }); break;
                case 'info': base.push({ color: colors.infoDark }); break;
                case 'primary': base.push({ color: colors.primaryDark }); break;
                case 'secondary': base.push({ color: colors.secondaryDark }); break;
                default: base.push({ color: colors.textSecondary });
            }
        }

        return base;
    };

    return (
        <View style={[...getBadgeStyle(), style]}>
            {dot && <View style={[styles.dotIndicator, { backgroundColor: color || getVariantColor(variant) }]} />}
            <Text style={[...getTextStyle(), textStyle]}>{text}</Text>
        </View>
    );
};

const getVariantColor = (variant) => {
    switch (variant) {
        case 'success': return colors.success;
        case 'warning': return colors.warning;
        case 'error': return colors.error;
        case 'info': return colors.info;
        case 'primary': return colors.primary;
        default: return colors.textMuted;
    }
};

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    // ── Sizes ──────────────────────────────────────────────
    sm: {
        paddingVertical: 3,
        paddingHorizontal: spacing.sm,
    },
    md: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm + 4,
    },
    lg: {
        paddingVertical: spacing.xs + 2,
        paddingHorizontal: spacing.md,
    },
    // ── Variants ───────────────────────────────────────────
    default: {
        backgroundColor: colors.surface,
    },
    primary: {
        backgroundColor: colors.primaryBg,
    },
    secondary: {
        backgroundColor: colors.secondary + '15',
    },
    success: {
        backgroundColor: colors.successBg,
    },
    warning: {
        backgroundColor: colors.warningBg,
    },
    error: {
        backgroundColor: colors.errorBg,
    },
    info: {
        backgroundColor: colors.infoBg,
    },
    // ── Text ──────────────────────────────────────────────
    text: {
        fontWeight: fontWeight.semibold,
    },
    smText: { fontSize: fontSize.xs },
    mdText: { fontSize: fontSize.sm },
    lgText: { fontSize: fontSize.md },
    // ── Dot indicator ─────────────────────────────────────
    dotIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});

export default Badge;
