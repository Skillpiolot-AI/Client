// src/components/ui/ThemePicker.js
// DaisyUI-style theme preview grid for the Settings screen.
// Shows 8 theme swatches in a 2-column grid. Tapping one applies instantly.

import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import { spacing, borderRadius, fontSize, fontWeight } from '../../theme';

const ThemeSwatch = ({ theme, isActive, onPress }) => {
    const [bg, accent, card] = theme.preview;
    return (
        <TouchableOpacity
            style={[
                styles.swatchCard,
                { backgroundColor: card, borderColor: isActive ? accent : '#33333355' },
                isActive && styles.swatchCardActive,
            ]}
            onPress={onPress}
            activeOpacity={0.75}
        >
            {/* Mini preview */}
            <View style={[styles.swatchBg, { backgroundColor: bg }]}>
                {/* Fake header bar */}
                <View style={[styles.fakeBar, { backgroundColor: accent + 'CC' }]} />
                {/* Fake card rows */}
                <View style={[styles.fakeCard, { backgroundColor: card }]} />
                <View style={[styles.fakeCard, { backgroundColor: card, width: '65%' }]} />
                {/* Accent dot */}
                <View style={[styles.fakeAccent, { backgroundColor: accent }]} />
            </View>

            {/* Label row */}
            <View style={styles.swatchLabel}>
                <Text style={styles.swatchEmoji}>{theme.emoji}</Text>
                <Text style={[styles.swatchName, { color: theme.text }]}>
                    {theme.label}
                </Text>
                {isActive && (
                    <Ionicons name="checkmark-circle" size={14} color={accent} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const ThemePicker = () => {
    const { themeName, themes, setTheme } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>App Theme</Text>
            <View style={styles.grid}>
                {themes.map((theme) => (
                    <ThemeSwatch
                        key={theme.id}
                        theme={theme}
                        isActive={themeName === theme.id}
                        onPress={() => setTheme(theme.id)}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: spacing.sm,
        paddingHorizontal: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    swatchCard: {
        width: '47.5%',
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        overflow: 'hidden',
        padding: spacing.sm,
    },
    swatchCardActive: {
        borderWidth: 2.5,
    },
    swatchBg: {
        height: 72,
        borderRadius: borderRadius.lg,
        padding: 6,
        marginBottom: spacing.xs,
        overflow: 'hidden',
        position: 'relative',
    },
    fakeBar: {
        height: 10,
        borderRadius: 5,
        marginBottom: 5,
        width: '100%',
    },
    fakeCard: {
        height: 8,
        borderRadius: 4,
        marginBottom: 4,
        width: '90%',
    },
    fakeAccent: {
        width: 18,
        height: 18,
        borderRadius: 9,
        position: 'absolute',
        bottom: 6,
        right: 6,
    },
    swatchLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    swatchEmoji: {
        fontSize: 13,
    },
    swatchName: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        flex: 1,
    },
});

export default ThemePicker;
