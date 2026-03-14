// ForgotPasswordScreen.js — Send OTP for password reset
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
    Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';

const { height } = Dimensions.get('window');
const BRAND = '#5B5FEF';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!email.trim()) { setError('Please enter your email address'); return; }
        setLoading(true); setError('');
        try {
            await authAPI.forgotPassword(email.trim());
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar barStyle="light-content" backgroundColor={BRAND} />
            <View style={styles.top}>
                {[160, 120, 80].map((r, i) => (
                    <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.07 + i * 0.04 }]} />
                ))}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', gap: 6 }}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-open-outline" size={30} color="#fff" />
                    </View>
                    <Text style={styles.topTitle}>Forgot Password?</Text>
                </View>
            </View>
            <View style={styles.waveBox}><View style={styles.waveCurve} /></View>

            <ScrollView style={styles.bottom} keyboardShouldPersistTaps="handled">
                <Text style={styles.heading}>Reset Password</Text>
                <View style={styles.headingUnderline} />
                <Text style={styles.sub}>Enter your email address and we'll send you a code to reset your password.</Text>

                {sent ? (
                    <View style={styles.successBox}>
                        <Ionicons name="checkmark-circle-outline" size={22} color="#10B981" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.successTitle}>OTP Sent!</Text>
                            <Text style={styles.successText}>Check your email inbox for the reset code</Text>
                        </View>
                    </View>
                ) : error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputRow}>
                    <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                    <TextInput
                        style={styles.input}
                        placeholder="your@email.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.sendBtn, loading && { opacity: 0.7 }]}
                    onPress={handleSend}
                    disabled={loading || sent}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendBtnText}>{sent ? 'OTP Sent ✓' : 'Send Reset Code'}</Text>}
                </TouchableOpacity>

                {sent && (
                    <TouchableOpacity
                        style={[styles.sendBtn, { marginTop: 12, backgroundColor: '#10B981' }]}
                        onPress={() => navigation.navigate('OtpVerification', { email })}
                    >
                        <Text style={styles.sendBtnText}>Enter OTP →</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
                    <Text style={styles.backLink}>← Back to Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BRAND },
    top: { height: height * 0.26, backgroundColor: BRAND, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    ring: { position: 'absolute', borderWidth: 1, borderColor: '#fff' },
    backBtn: { position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    topTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
    waveBox: { height: 40, overflow: 'hidden', backgroundColor: BRAND },
    waveCurve: { height: 70, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 },
    bottom: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 28 },
    heading: { fontSize: 26, fontWeight: '800', color: '#111827', marginTop: 8 },
    headingUnderline: { width: 50, height: 3, backgroundColor: BRAND, borderRadius: 2, marginTop: 6, marginBottom: 8 },
    sub: { fontSize: 14, color: '#6B7280', lineHeight: 22, marginBottom: 24 },
    successBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#ECFDF5', borderRadius: 12, padding: 14, marginBottom: 20 },
    successTitle: { fontSize: 14, fontWeight: '700', color: '#065F46' },
    successText: { fontSize: 13, color: '#059669' },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { flex: 1, fontSize: 13, color: '#EF4444' },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#E5E7EB', paddingBottom: 10, marginBottom: 24, gap: 10 },
    input: { flex: 1, fontSize: 15, color: '#111827', paddingVertical: 2 },
    sendBtn: { backgroundColor: BRAND, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
    sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    backLink: { textAlign: 'center', fontSize: 14, color: BRAND, fontWeight: '600' },
});
