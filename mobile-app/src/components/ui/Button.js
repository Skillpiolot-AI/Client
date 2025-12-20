// Custom Button Component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, fontSize, fontWeight, spacing } from '../../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
    color,
    ...props
}) => {
    const getButtonStyle = () => {
        const baseStyle = [styles.base, styles[size]];

        if (color && !disabled) {
            if (variant === 'primary') {
                baseStyle.push({ backgroundColor: color });
            } else if (variant === 'outline') {
                baseStyle.push({ borderColor: color });
            }
        }

        if (disabled) {
            baseStyle.push(styles.disabled);
        }

        if (variant === 'outline') {
            baseStyle.push(styles.outline);
        } else if (variant === 'ghost') {
            baseStyle.push(styles.ghost);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondary);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseTextStyle = [styles.text, styles[`${size}Text`]];

        if (variant === 'outline' || variant === 'ghost') {
            baseTextStyle.push(styles.outlineText);
            if (color && !disabled) {
                baseTextStyle.push({ color: color });
            }
        }

        if (disabled) {
            baseTextStyle.push(styles.disabledText);
        }

        return baseTextStyle;
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
                    colors={disabled ? ['#475569', '#334155'] : (color ? [color, color] : [colors.primary, colors.secondary])}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.base, styles[size], styles.gradient]}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <>
                            {icon}
                            <Text style={[styles.text, styles[`${size}Text`], textStyle]}>{title}</Text>
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
            activeOpacity={0.7}
            style={[...getButtonStyle(), style]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? (color || colors.primary) : colors.white} />
            ) : (
                <>
                    {icon}
                    <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
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
        backgroundColor: colors.primary,
        gap: spacing.sm,
    },
    gradient: {
        backgroundColor: 'transparent',
    },
    // Sizes
    sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    md: {
        paddingVertical: spacing.md - 4,
        paddingHorizontal: spacing.lg,
    },
    lg: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
    },
    // Variants
    secondary: {
        backgroundColor: colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        backgroundColor: colors.surfaceLight,
        opacity: 0.6,
    },
    // Text
    text: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
        textAlign: 'center',
    },
    smText: {
        fontSize: fontSize.sm,
    },
    mdText: {
        fontSize: fontSize.md,
    },
    lgText: {
        fontSize: fontSize.lg,
    },
    outlineText: {
        color: colors.primary,
    },
    disabledText: {
        color: colors.textMuted,
    },
});

export default Button;
