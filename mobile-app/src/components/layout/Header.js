// Header Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing } from '../../theme';

const Header = ({
    title,
    subtitle,
    showBack = false,
    rightIcon,
    onRightIconPress,
    transparent = false,
    style,
}) => {
    const navigation = useNavigation();

    return (
        <View style={[styles.header, transparent && styles.transparent, style]}>
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.center}>
                {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
                {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
            </View>

            <View style={styles.right}>
                {rightIcon && (
                    <TouchableOpacity style={styles.rightButton} onPress={onRightIconPress}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
    },
    transparent: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    left: {
        width: 44,
        alignItems: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    right: {
        width: 44,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: spacing.xs,
        marginLeft: -spacing.xs,
    },
    rightButton: {
        padding: spacing.xs,
        marginRight: -spacing.xs,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.text,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
});

export default Header;
