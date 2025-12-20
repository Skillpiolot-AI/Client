// Badge Component
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
}) => {
    const getBadgeStyle = () => {
        const baseStyle = [styles.badge, styles[size]];

        if (color && variant === 'primary') {
            baseStyle.push({ backgroundColor: color + '20' });
        } else {
            switch (variant) {
                case 'success':
                    baseStyle.push(styles.success);
                    break;
                case 'warning':
                    baseStyle.push(styles.warning);
                    break;
                case 'error':
                    baseStyle.push(styles.error);
                    break;
                case 'info':
                    baseStyle.push(styles.info);
                    break;
                case 'primary':
                    baseStyle.push(styles.primary);
                    break;
                case 'secondary':
                    baseStyle.push(styles.secondary);
                    break;
                default:
                    baseStyle.push(styles.default);
            }
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseTextStyle = [styles.text, styles[`${size}Text`]];

        if (variant === 'warning') {
            baseTextStyle.push(styles.darkText);
        }

        if (color && variant === 'primary') {
            baseTextStyle.push({ color: color });
        }

        return baseTextStyle;
    };

    return (
        <View style={[...getBadgeStyle(), style]}>
            <Text style={[...getTextStyle(), textStyle]}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        borderRadius: borderRadius.full,
    },
    // Sizes
    sm: {
        paddingVertical: 2,
        paddingHorizontal: spacing.sm,
    },
    md: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm + 4,
    },
    lg: {
        paddingVertical: spacing.sm - 2,
        paddingHorizontal: spacing.md,
    },
    // Variants
    default: {
        backgroundColor: colors.surfaceLight,
    },
    primary: {
        backgroundColor: colors.primary + '30',
    },
    secondary: {
        backgroundColor: colors.secondary + '30',
    },
    success: {
        backgroundColor: colors.success + '30',
    },
    warning: {
        backgroundColor: colors.warning + '30',
    },
    error: {
        backgroundColor: colors.error + '30',
    },
    info: {
        backgroundColor: colors.info + '30',
    },
    // Text
    text: {
        color: colors.text,
        fontWeight: fontWeight.medium,
    },
    darkText: {
        color: colors.background,
    },
    smText: {
        fontSize: fontSize.xs,
    },
    mdText: {
        fontSize: fontSize.sm,
    },
    lgText: {
        fontSize: fontSize.md,
    },
});

export default Badge;
