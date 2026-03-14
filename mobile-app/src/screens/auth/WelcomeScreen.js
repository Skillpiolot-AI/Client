// WelcomeScreen.js — Branded wave onboarding screen
import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, Animated, Dimensions,
    TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const BRAND = '#5B5FEF';
const BRAND_DARK = '#3D40C4';

export default function WelcomeScreen({ navigation }) {
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 700, delay: 200, useNativeDriver: true }),
            Animated.timing(slideUp, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={BRAND} />

            {/* Top — Branded wave section */}
            <View style={styles.top}>
                {/* Decorative circles for topographic effect */}
                {[180, 140, 100, 60].map((r, i) => (
                    <View key={i} style={[styles.ring, {
                        width: r * 2, height: r * 2, borderRadius: r,
                        opacity: 0.08 + i * 0.04,
                        top: height * 0.18 - r,
                        left: width * 0.5 - r,
                    }]} />
                ))}
                <View style={styles.logoSection}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="rocket" size={36} color="#fff" />
                    </View>
                    <Text style={styles.brandName}>SkillPilot</Text>
                </View>
            </View>

            {/* Wave divider */}
            <View style={styles.waveBox}>
                <View style={styles.waveCurve} />
            </View>

            {/* Bottom — Content section */}
            <Animated.View style={[styles.bottom, {
                opacity: fadeIn,
                transform: [{ translateY: slideUp }],
            }]}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.subtitle}>
                    The AI-powered platform connecting{'\n'}students with industry mentors.
                </Text>

                {/* Feature highlights */}
                {[
                    { icon: 'school-outline', text: 'AI-powered skill assessment' },
                    { icon: 'people-outline', text: 'Expert industry mentors' },
                    { icon: 'calendar-outline', text: 'Free first session' },
                ].map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                        <View style={styles.featureIcon}>
                            <Ionicons name={f.icon} size={16} color={BRAND} />
                        </View>
                        <Text style={styles.featureText}>{f.text}</Text>
                    </View>
                ))}

                {/* CTA */}
                <TouchableOpacity
                    style={styles.continueRow}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.continueText}>Continue</Text>
                    <View style={styles.continueBall}>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}
                    style={{ marginTop: 16 }}
                >
                    <Text style={styles.signupLink}>
                        New here?{' '}
                        <Text style={styles.signupLinkBold}>Create Account</Text>
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BRAND },
    top: {
        height: height * 0.42,
        backgroundColor: BRAND,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    ring: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#fff',
    },
    logoSection: { alignItems: 'center', gap: 10 },
    logoCircle: {
        width: 76, height: 76, borderRadius: 38,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    },
    brandName: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
    waveBox: { height: 50, overflow: 'hidden', backgroundColor: BRAND },
    waveCurve: {
        height: 80,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: -30,
    },
    bottom: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingTop: 8,
        paddingBottom: 40,
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        marginTop: 8,
        marginBottom: 24,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    featureIcon: {
        width: 30, height: 30, borderRadius: 8,
        backgroundColor: '#EEF2FF',
        alignItems: 'center', justifyContent: 'center',
    },
    featureText: { fontSize: 14, color: '#374151', fontWeight: '500' },
    continueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 30,
        gap: 14,
    },
    continueText: { fontSize: 17, fontWeight: '700', color: '#111827' },
    continueBall: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: BRAND,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: BRAND,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    signupLink: { textAlign: 'center', fontSize: 14, color: '#6B7280' },
    signupLinkBold: { color: BRAND, fontWeight: '700' },
});
