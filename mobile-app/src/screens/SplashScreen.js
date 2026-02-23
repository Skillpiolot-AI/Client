// SplashScreen.js — Animated branded splash for SkillPilot
import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Brand colours (not from theme — splash is always branded)
const BRAND = '#5B5FEF';
const BRAND_DARK = '#3D40C4';
const ACCENT = '#F59E0B';

export default function SplashScreen({ onFinish }) {
    const logoScale = useRef(new Animated.Value(0.4)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const waveTranslate = useRef(new Animated.Value(height * 0.5)).current;
    const containerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            // Wave slides up
            Animated.spring(waveTranslate, {
                toValue: 0,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }),
            // Logo pops in
            Animated.parallel([
                Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 7, useNativeDriver: true }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]),
            // Tagline fades in
            Animated.timing(taglineOpacity, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
            // Hold for 800ms
            Animated.delay(800),
            // Fade entire splash out
            Animated.timing(containerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => onFinish && onFinish());
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
            <StatusBar barStyle="light-content" backgroundColor={BRAND} />

            {/* Top gradient area */}
            <View style={styles.top} />

            {/* Animated wave bottom */}
            <Animated.View style={[styles.waveWrapper, { transform: [{ translateY: waveTranslate }] }]}>
                {/* SVG-like wave drawn with border-radius trick */}
                <View style={styles.wave} />
                <View style={styles.waveContent}>
                    {/* Logo */}
                    <Animated.View style={[styles.logoWrap, {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    }]}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="rocket" size={42} color={BRAND} />
                        </View>
                    </Animated.View>

                    {/* App name */}
                    <Animated.View style={{ opacity: logoOpacity }}>
                        <Text style={styles.appName}>SkillPilot</Text>
                    </Animated.View>

                    {/* Tagline */}
                    <Animated.View style={{ opacity: taglineOpacity }}>
                        <Text style={styles.tagline}>AI-Powered Mentorship Platform</Text>
                        <Text style={styles.sub}>For Students & Mentors</Text>
                    </Animated.View>

                    {/* Animated dots */}
                    <Animated.View style={[styles.dotsRow, { opacity: taglineOpacity }]}>
                        <View style={[styles.dot, { backgroundColor: BRAND }]} />
                        <View style={[styles.dot, { backgroundColor: ACCENT }]} />
                        <View style={[styles.dot, { backgroundColor: BRAND_DARK }]} />
                    </Animated.View>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999,
    },
    top: {
        flex: 1,
        backgroundColor: BRAND,
        // Subtle topographic pattern via opacity overlay could be added with SVG
    },
    waveWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.62,
    },
    wave: {
        position: 'absolute',
        top: 0,
        left: -20,
        right: -20,
        height: 80,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    },
    waveContent: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 30,
        gap: 12,
    },
    logoCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    logoWrap: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 34,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
        marginTop: 4,
    },
    tagline: {
        fontSize: 16,
        fontWeight: '600',
        color: BRAND,
        textAlign: 'center',
        marginTop: 8,
    },
    sub: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 4,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
