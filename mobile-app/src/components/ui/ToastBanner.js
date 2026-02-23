// components/ui/ToastBanner.js — Slide-down foreground notification banner
import React, { useEffect, useRef, useCallback } from 'react';
import {
    Animated, StyleSheet, Text, TouchableOpacity, View, Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';
import { NOTIF_META } from '../../context/NotificationContext';

const DISPLAY_DURATION = 4000; // 4 s auto-dismiss

const ToastBanner = ({ notification, onDismiss, onPress }) => {
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(-120)).current;
    const timerRef = useRef(null);

    const dismiss = useCallback(() => {
        clearTimeout(timerRef.current);
        Animated.timing(slideAnim, {
            toValue: -120,
            duration: 250,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => onDismiss?.());
    }, [slideAnim, onDismiss]);

    useEffect(() => {
        if (!notification) return;
        // Slide in
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
        }).start();
        // Auto-dismiss
        timerRef.current = setTimeout(dismiss, DISPLAY_DURATION);
        return () => clearTimeout(timerRef.current);
    }, [notification]);

    if (!notification) return null;

    const meta = NOTIF_META[notification.type] || NOTIF_META.default;

    return (
        <Animated.View
            style={[
                styles.wrapper,
                { top: insets.top + spacing.sm, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <TouchableOpacity
                style={styles.banner}
                onPress={() => { dismiss(); onPress?.(notification); }}
                activeOpacity={0.9}
            >
                <View style={[styles.iconWrap, { backgroundColor: meta.color + '18' }]}>
                    <Ionicons name={meta.icon} size={22} color={meta.color} />
                </View>
                <View style={styles.textCol}>
                    <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
                    <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
                </View>
                <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={18} color={colors.textMuted} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: spacing.md,
        right: spacing.md,
        zIndex: 9999,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.lg,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    textCol: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    message: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 18,
    },
});

export default ToastBanner;
