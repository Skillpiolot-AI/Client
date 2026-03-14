// Loading Component
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../../theme';

const Loading = ({
    fullScreen = false,
    text,
    size = 'large',
    color,
    style,
}) => {
    const loaderColor = color || colors.primary;

    if (fullScreen) {
        return (
            <View style={[styles.fullScreen, style]}>
                <ActivityIndicator size={size} color={loaderColor} />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        );
    }

    return (
        <View style={[styles.inline, style]}>
            <ActivityIndicator size={size} color={loaderColor} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
    },
    inline: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.sm,
    },
    text: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
});

export default Loading;
