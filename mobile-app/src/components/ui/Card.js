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
    gradientColors = [colors.surface, colors.surfaceLight],
    ...props
}) => {
    const CardContainer = onPress ? TouchableOpacity : View;

    const getCardStyle = () => {
        const baseStyle = [styles.card, shadows.md];

        if (variant === 'elevated') {
            baseStyle.push(styles.elevated);
        } else if (variant === 'outlined') {
            baseStyle.push(styles.outlined);
        }

        return baseStyle;
    };

    if (gradient) {
        return (
            <CardContainer onPress={onPress} activeOpacity={0.9} style={style} {...props}>
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
    },
    gradientCard: {
        backgroundColor: 'transparent',
    },
    elevated: {
        backgroundColor: colors.surfaceLight,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
});

export default Card;
