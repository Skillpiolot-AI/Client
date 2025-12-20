// Loading Component
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../../theme';

const Loading = ({
    size = 'large',
    color = colors.primary,
    text,
    fullScreen = false,
    style,
}) => {
    if (fullScreen) {
        return (
            <View style={[styles.fullScreen, style]}>
                <ActivityIndicator size={size} color={color} />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        marginTop: spacing.md,
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
});

export default Loading;
