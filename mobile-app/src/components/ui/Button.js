// Custom Button Component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, fontSize, fontWeight, spacing, shadows } from '../../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconRight,
    style,
    textStyle,
    color,
    ...props
}) => {
    const getButtonStyle = () => {
        const baseStyle = [styles.base, styles[size]];

        if (disabled) {
            baseStyle.push(styles.disabled);
            return baseStyle;
        }

        switch (variant) {
            case 'primary':
                baseStyle.push({ backgroundColor: color || colors.primary });
                break;
            case 'secondary':
                baseStyle.push(styles.secondary);
                break;
            case 'outline':
                baseStyle.push(styles.outline);
                if (color) baseStyle.push({ borderColor: color });
                break;
            case 'ghost':
                baseStyle.push(styles.ghost);
                break;
            case 'danger':
                baseStyle.push(styles.danger);
                break;
            case 'success':
                baseStyle.push(styles.success);
                break;
            case 'surface':
                baseStyle.push(styles.surface);
                break;
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const base = [styles.text, styles[`${size}Text`]];

        if (disabled) {
            base.push(styles.disabledText);
            return base;
        }

        switch (variant) {
            case 'outline':
                base.push({ color: color || colors.primary });
                break;
            case 'ghost':
                base.push({ color: color || colors.primary });
                break;
            case 'surface':
                base.push({ color: colors.text });
                break;
            default:
                base.push({ color: colors.white });
        }

        return base;
    };

    if (variant === 'gradient') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={style}
                {...props}
            >
                <LinearGradient
                    colors={disabled ? [colors.surfaceAlt, colors.border] : (color ? [color, color] : [colors.primary, colors.primaryDark])}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.base, styles[size], styles.gradient, disabled && styles.disabled]}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} size="small" />
                    ) : (
                        <>
                            {icon && <View style={styles.iconLeft}>{icon}</View>}
                            <Text style={[styles.text, styles[`${size}Text`], { color: colors.white }, textStyle]}>{title}</Text>
                            {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.75}
            style={[...getButtonStyle(), style]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === 'outline' || variant === 'ghost' || variant === 'surface'
                            ? (color || colors.primary)
                            : colors.white
                    }
                    size="small"
                />
            ) : (
                <>
                    {icon && <View style={styles.iconLeft}>{icon}</View>}
                    <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
                    {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
    },
    gradient: {
        backgroundColor: 'transparent',
    },
    // ── Sizes ────────────────────────────────────────────
    xs: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm + 4,
        borderRadius: borderRadius.sm,
        gap: spacing.xs,
    },
    sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
    },
    md: {
        paddingVertical: spacing.sm + 4,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    lg: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    xl: {
        paddingVertical: spacing.md + 4,
        paddingHorizontal: spacing.xxl,
        borderRadius: borderRadius.xl,
        gap: spacing.sm,
    },
    // ── Variants ─────────────────────────────────────────
    secondary: {
        backgroundColor: colors.secondary,
    },
    outline: {
        backgroundColor: colors.transparent,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    ghost: {
        backgroundColor: colors.transparent,
    },
    danger: {
        backgroundColor: colors.error,
    },
    success: {
        backgroundColor: colors.success,
    },
    surface: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    disabled: {
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.border,
        opacity: 0.6,
    },
    // ── Text ─────────────────────────────────────────────
    text: {
        fontWeight: fontWeight.semibold,
        textAlign: 'center',
    },
    xsText: { fontSize: fontSize.xs },
    smText: { fontSize: fontSize.sm },
    mdText: { fontSize: fontSize.md },
    lgText: { fontSize: fontSize.lg },
    xlText: { fontSize: fontSize.xl },
    disabledText: {
        color: colors.textMuted,
    },
    // ── Icon helpers ──────────────────────────────────────
    iconLeft: {
        marginRight: 2,
    },
    iconRight: {
        marginLeft: 2,
    },
});

export default Button;
