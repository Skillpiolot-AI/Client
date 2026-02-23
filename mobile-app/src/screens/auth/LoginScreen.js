// LoginScreen.js — Wave design with email/password auth
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, ScrollView, Animated,
    Dimensions, ActivityIndicator, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const { height } = Dimensions.get('window');
const BRAND = '#5B5FEF';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingQuick, setLoadingQuick] = useState('');

    const QUICK_LOGINS = [
        { label: 'Mentor', email: 'dr..0@mentor-seeder.com', password: 'Mentor123', color: '#10B981', icon: 'ribbon-outline' },
        { label: 'Admin', email: 'ujjwaljha744@gmail.com', password: 'Ujjwaljha_12', color: '#EF4444', icon: 'shield-outline' },
        { label: 'User', email: 'ujjwaljha018@gmail.com', password: 'Ujjwaljha_12', color: BRAND, icon: 'person-outline' },
    ];

    const handleQuickLogin = async (q) => {
        setLoadingQuick(q.label);
        setError('');
        const result = await login(q.email, q.password);
        setLoadingQuick('');
        if (!result.success) setError(result.error || 'Quick login failed');
    };

    const slideUp = useRef(new Animated.Value(30)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideUp, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            setError('Please enter your email and password');
            return;
        }
        setLoading(true);
        setError('');
        const result = await login(email.trim(), password);
        setLoading(false);
        if (!result.success) setError(result.error || 'Login failed');
    };

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor={BRAND} />

            {/* Top wave zone */}
            <View style={styles.top}>
                {[180, 140, 100, 60].map((r, i) => (
                    <View key={i} style={[styles.ring, {
                        width: r * 2, height: r * 2, borderRadius: r,
                        opacity: 0.07 + i * 0.03,
                    }]} />
                ))}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.topContent}>
                    <Ionicons name="rocket" size={28} color="#fff" style={{ marginBottom: 6 }} />
                    <Text style={styles.topTitle}>SkillPilot</Text>
                </View>
            </View>

            {/* Wave divider */}
            <View style={styles.waveBox}><View style={styles.waveCurve} /></View>

            {/* Form area */}
            <ScrollView style={styles.bottom} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
                    <Text style={styles.heading}>Sign in</Text>
                    <View style={styles.headingUnderline} />

                    {error ? (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Email */}
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputRow}>
                        <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                        <TextInput
                            style={styles.input}
                            placeholder="demo@email.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputRow}>
                        <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                        <TextInput
                            style={styles.input}
                            placeholder="enter your password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={{ marginBottom: 26, alignSelf: 'flex-end' }}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login button */}
                    <TouchableOpacity
                        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading || !!loadingQuick}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.loginBtnText}>Login</Text>
                        }
                    </TouchableOpacity>

                    {/* Quick Login — Dev Testing */}
                    <View style={styles.quickSection}>
                        <View style={styles.quickHeader}>
                            <View style={styles.quickLine} />
                            <Text style={styles.quickLabel}>Quick Login</Text>
                            <View style={styles.quickLine} />
                        </View>
                        <View style={styles.quickRow}>
                            {QUICK_LOGINS.map(q => (
                                <TouchableOpacity
                                    key={q.label}
                                    style={[styles.quickBtn, { borderColor: q.color, backgroundColor: q.color + '10' }]}
                                    onPress={() => handleQuickLogin(q)}
                                    disabled={!!loadingQuick || loading}
                                    activeOpacity={0.8}
                                >
                                    {loadingQuick === q.label
                                        ? <ActivityIndicator size="small" color={q.color} />
                                        : <>
                                            <Ionicons name={q.icon} size={15} color={q.color} />
                                            <Text style={[styles.quickBtnText, { color: q.color }]}>{q.label}</Text>
                                        </>
                                    }
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Signup link */}
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: 12, marginBottom: 40 }}>
                        <Text style={styles.signupLink}>
                            Don't have an Account?{' '}
                            <Text style={styles.signupBold}>Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BRAND },
    top: {
        height: height * 0.26,
        backgroundColor: BRAND,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#fff',
        alignSelf: 'center',
    },
    backBtn: {
        position: 'absolute',
        top: 52,
        left: 20,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
    },
    topContent: { alignItems: 'center' },
    topTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
    waveBox: { height: 40, overflow: 'hidden', backgroundColor: BRAND },
    waveCurve: {
        height: 70,
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -30,
    },
    bottom: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 28 },
    heading: { fontSize: 30, fontWeight: '800', color: '#111827', marginTop: 4 },
    headingUnderline: { width: 50, height: 3, backgroundColor: BRAND, borderRadius: 2, marginTop: 6, marginBottom: 20 },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { flex: 1, fontSize: 13, color: '#EF4444' },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
        marginBottom: 20,
        gap: 10,
    },
    input: { flex: 1, fontSize: 15, color: '#111827', paddingVertical: 2 },
    optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
    rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#9CA3AF', alignItems: 'center', justifyContent: 'center' },
    checkboxChecked: { backgroundColor: BRAND, borderColor: BRAND },
    rememberText: { fontSize: 13, color: '#374151' },
    forgotText: { fontSize: 13, color: BRAND, fontWeight: '600' },
    loginBtn: {
        backgroundColor: BRAND,
        height: 54, borderRadius: 27,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: BRAND,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
    },
    loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
    divider: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    dividerText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
    googleBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        height: 54, borderRadius: 27, borderWidth: 1.5, borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    googleBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
    signupLink: { textAlign: 'center', fontSize: 14, color: '#6B7280' },
    signupBold: { color: BRAND, fontWeight: '700' },
    // Quick login
    quickSection: { marginTop: 20, marginBottom: 4 },
    quickHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
    quickLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    quickLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.5 },
    quickRow: { flexDirection: 'row', gap: 10 },
    quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 14, borderWidth: 1.5 },
    quickBtnText: { fontSize: 13, fontWeight: '700' },
});
