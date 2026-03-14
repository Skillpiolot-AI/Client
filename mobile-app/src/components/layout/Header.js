// Header Layout Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const Header = ({
    title,
    subtitle,
    onBack,
    rightComponent,
    rightIcon,
    onRightPress,
    transparent = false,
    style,
    titleStyle,
    showBorder = true,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.header,
                { paddingTop: Math.max(insets.top, spacing.md) },
                transparent && styles.transparent,
                !transparent && showBorder && styles.bordered,
                style,
            ]}
        >
            {/* Left: Back button or spacer */}
            <View style={styles.sideContainer}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.75}>
                        <Ionicons name="chevron-back" size={22} color={colors.text} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
                )}
            </View>

            {/* Center: Title + Subtitle */}
            <View style={styles.titleContainer}>
                {title ? (
                    <Text style={[styles.title, titleStyle]} numberOfLines={1}>
                        {title}
                    </Text>
                ) : null}
                {subtitle ? (
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>
                ) : null}
            </View>

            {/* Right: Custom component or icon button */}
            <View style={styles.sideContainer}>
                {rightComponent ? (
                    rightComponent
                ) : rightIcon ? (
                    <TouchableOpacity onPress={onRightPress} style={styles.iconButton} activeOpacity={0.75}>
                        <Ionicons name={rightIcon} size={22} color={colors.text} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
    },
    bordered: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    transparent: {
        backgroundColor: 'transparent',
    },
    sideContainer: {
        width: 44,
        alignItems: 'center',
    },
    placeholder: {
        width: 44,
        height: 44,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    subtitle: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 1,
    },
});

export default Header;
