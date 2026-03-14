// OtpVerificationScreen.js — Wave redesign matching Login/Signup style
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView,
    Platform, TextInput, ActivityIndicator, Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';
import { useTheme } from '../../context/ThemeContext';

const { height } = Dimensions.get('window');
const BRAND = '#5B5FEF';

export default function OtpVerificationScreen({ navigation, route }) {
    const { email, purpose = 'password_reset', fromProfile = false } = route.params || {};
    const { theme } = useTheme();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value, index) => {
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 6) { setError('Please enter the 6-digit code'); return; }
        setLoading(true); setError('');
        try {
            const response = await authAPI.verifyOTP(email, code);
            if (response.success) {
                navigation.navigate('ResetPassword', { resetToken: response.resetToken, email, fromProfile });
            } else {
                setError(response.message || 'Invalid OTP code');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        if (!canResend) return;
        try {
            await authAPI.forgotPassword(email);
            setTimer(60); setCanResend(false); setOtp(['', '', '', '', '', '']);
        } catch (e) { setError('Failed to resend code'); }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.root, { backgroundColor: BRAND }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor={BRAND} />
            {/* Wave top */}
            <View style={styles.top}>
                {[160, 120, 80].map((r, i) => (
                    <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.07 + i * 0.04 }]} />
                ))}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.topContent}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="shield-checkmark-outline" size={30} color="#fff" />
                    </View>
                    <Text style={styles.topTitle}>Verify Code</Text>
                </View>
            </View>
            <View style={styles.waveBox}><View style={styles.waveCurve} /></View>

            <View style={[styles.bottom, { backgroundColor: theme.background }]}>
                <Text style={[styles.heading, { color: theme.text }]}>Enter OTP</Text>
                <View style={styles.headingUnderline} />
                <Text style={[styles.sub, { color: theme.textMuted }]}>
                    We sent a 6-digit code to{'\n'}<Text style={{ color: BRAND, fontWeight: '700' }}>{email}</Text>
                </Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* OTP boxes */}
                <View style={styles.otpRow}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => (inputRefs.current[index] = ref)}
                            style={[
                                styles.otpBox,
                                { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.text },
                                otp.join('').length === index && styles.otpBoxActive,
                                digit && styles.otpBoxFilled,
                            ]}
                            value={digit}
                            onChangeText={v => handleChange(v, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {/* Timer */}
                <View style={styles.timerRow}>
                    <Text style={[styles.timerText, { color: theme.textMuted }]}>
                        {timer > 0 ? `Resend in ${timer}s` : "Didn't receive the code?"}
                    </Text>
                    {canResend && (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendLink}> Resend</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.verifyBtn, loading && { opacity: 0.7 }]}
                    onPress={handleVerify}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyBtnText}>Verify OTP</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    top: { height: height * 0.28, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    ring: { position: 'absolute', borderWidth: 1, borderColor: '#fff' },
    backBtn: { position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    topContent: { alignItems: 'center', gap: 8 },
    iconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    topTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
    waveBox: { height: 40, overflow: 'hidden', backgroundColor: BRAND },
    waveCurve: { height: 70, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 },
    bottom: { flex: 1, paddingHorizontal: 28 },
    heading: { fontSize: 26, fontWeight: '800', marginTop: 8 },
    headingUnderline: { width: 50, height: 3, backgroundColor: BRAND, borderRadius: 2, marginTop: 6, marginBottom: 8 },
    sub: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { flex: 1, fontSize: 13, color: '#EF4444' },
    otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    otpBox: { width: 48, height: 58, borderRadius: 14, borderWidth: 1.5, fontSize: 22, fontWeight: '700', textAlign: 'center' },
    otpBoxActive: { borderColor: BRAND, borderWidth: 2 },
    otpBoxFilled: { borderColor: BRAND },
    timerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
    timerText: { fontSize: 13 },
    resendLink: { fontSize: 14, color: BRAND, fontWeight: '700' },
    verifyBtn: { backgroundColor: BRAND, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
    verifyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
