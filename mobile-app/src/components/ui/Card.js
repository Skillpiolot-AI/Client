// Card Component
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, shadows } from '../../theme';

const Card = ({
    children,
    variant = 'default',
    onPress,
    style,
    gradient = false,
    gradientColors = [colors.surfaceAlt, colors.surface],
    bordered = false,
    ...props
}) => {
    const CardContainer = onPress ? TouchableOpacity : View;

    const getCardStyle = () => {
        const base = [styles.card];

        switch (variant) {
            case 'elevated':
                base.push(styles.elevated);
                break;
            case 'outlined':
                base.push(styles.outlined);
                break;
            case 'flat':
                base.push(styles.flat);
                break;
            case 'surface':
                base.push(styles.surfaceCard);
                break;
        }

        if (bordered && variant !== 'outlined') {
            base.push(styles.bordered);
        }

        return base;
    };

    if (gradient) {
        return (
            <CardContainer
                onPress={onPress}
                activeOpacity={0.9}
                style={[style]}
                {...props}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[...getCardStyle(), styles.gradientCard]}
                >
                    {children}
                </LinearGradient>
            </CardContainer>
        );
    }

    return (
        <CardContainer
            onPress={onPress}
            activeOpacity={0.9}
            style={[...getCardStyle(), style]}
            {...props}
        >
            {children}
        </CardContainer>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.sm,
    },
    gradientCard: {
        backgroundColor: 'transparent',
    },
    // Variants
    elevated: {
        ...shadows.md,
        borderWidth: 0,
    },
    outlined: {
        backgroundColor: colors.card,
        borderWidth: 1.5,
        borderColor: colors.border,
        ...shadows.none,
    },
    flat: {
        backgroundColor: colors.surface,
        borderWidth: 0,
        ...shadows.none,
    },
    surfaceCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...shadows.xs,
    },
    bordered: {
        borderWidth: 1,
        borderColor: colors.border,
    },
});

export default Card;
