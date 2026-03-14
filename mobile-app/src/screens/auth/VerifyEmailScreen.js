// VerifyEmailScreen.js — Wave redesign matching Login/Signup style
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
    Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';
import { useTheme } from '../../context/ThemeContext';

const { height } = Dimensions.get('window');
const BRAND = '#5B5FEF';

export default function VerifyEmailScreen({ navigation, route }) {
    const token = route.params?.token;
    const email = route.params?.email;
    const { theme } = useTheme();
    const [verifying, setVerifying] = useState(!!token);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);
    const [resentSuccess, setResentSuccess] = useState(false);

    useEffect(() => {
        if (token) verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            await authAPI.verifyEmail(token);
            setVerified(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. The link may have expired.');
        }
        setVerifying(false);
    };

    const handleResend = async () => {
        if (!email) { navigation.navigate('Login'); return; }
        setResending(true);
        try {
            await authAPI.resendVerification(email);
            setResentSuccess(true); setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend');
        }
        setResending(false);
    };

    const topIcon = verifying ? 'hourglass-outline' : verified ? 'checkmark-circle-outline' : 'mail-unread-outline';
    const topColor = verified ? '#10B981' : error ? '#EF4444' : BRAND;

    return (
        <View style={[styles.root, { backgroundColor: BRAND }]}>
            <StatusBar barStyle="light-content" backgroundColor={BRAND} />
            <View style={styles.top}>
                {[160, 120, 80].map((r, i) => (
                    <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.07 + i * 0.04 }]} />
                ))}
                <View style={styles.topContent}>
                    <View style={[styles.iconCircle, verified && { backgroundColor: 'rgba(16,185,129,0.3)' }]}>
                        <Ionicons name={topIcon} size={34} color="#fff" />
                    </View>
                    <Text style={styles.topTitle}>
                        {verifying ? 'Verifying...' : verified ? 'Email Verified!' : 'Check Your Email'}
                    </Text>
                </View>
            </View>
            <View style={styles.waveBox}><View style={styles.waveCurve} /></View>

            <View style={[styles.bottom, { backgroundColor: theme.background }]}>
                {verifying ? (
                    <View style={styles.centeredContent}>
                        <ActivityIndicator size="large" color={BRAND} />
                        <Text style={[styles.sub, { color: theme.textMuted, marginTop: 16 }]}>Verifying your email address...</Text>
                    </View>
                ) : verified ? (
                    <>
                        <Text style={[styles.heading, { color: theme.text }]}>All Done!</Text>
                        <View style={styles.headingUnderline} />
                        <Text style={[styles.sub, { color: theme.textMuted }]}>
                            Your email has been verified successfully. You can now sign in to SkillPilot.
                        </Text>
                        <View style={[styles.successCard, { backgroundColor: '#ECFDF5' }]}>
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                            <Text style={styles.successText}>Email verified successfully</Text>
                        </View>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.actionBtnText}>Sign In Now →</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={[styles.heading, { color: theme.text }]}>Verify Your Email</Text>
                        <View style={styles.headingUnderline} />
                        <Text style={[styles.sub, { color: theme.textMuted }]}>
                            We've sent a verification link to{'\n'}
                            <Text style={{ color: BRAND, fontWeight: '700' }}>{email || 'your email'}</Text>
                            {'\n\n'}Please click the link in your email to verify your account.
                        </Text>

                        {error ? (
                            <View style={styles.errorBox}>
                                <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : resentSuccess ? (
                            <View style={[styles.successCard, { backgroundColor: '#ECFDF5', marginBottom: 20 }]}>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
                                <Text style={styles.successText}>Verification email resent!</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.actionBtn, resending && { opacity: 0.7 }]}
                            onPress={handleResend}
                            disabled={resending}
                        >
                            {resending ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnText}>Resend Email</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.ghostBtnText, { color: theme.textMuted }]}>← Back to Login</Text>
                        </TouchableOpacity>

                        <View style={[styles.tipsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <Text style={[styles.tipsTitle, { color: theme.textSecondary }]}>Didn't receive it?</Text>
                            {['Check your spam or junk folder', 'Make sure your email address is correct', 'Wait a few minutes then try resend'].map((tip, i) => (
                                <Text key={i} style={[styles.tipText, { color: theme.textMuted }]}>• {tip}</Text>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    top: { height: height * 0.28, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    ring: { position: 'absolute', borderWidth: 1, borderColor: '#fff' },
    topContent: { alignItems: 'center', gap: 8 },
    iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    topTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
    waveBox: { height: 40, overflow: 'hidden', backgroundColor: BRAND },
    waveCurve: { height: 70, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 },
    bottom: { flex: 1, paddingHorizontal: 28 },
    centeredContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    heading: { fontSize: 26, fontWeight: '800', marginTop: 8 },
    headingUnderline: { width: 50, height: 3, backgroundColor: BRAND, borderRadius: 2, marginTop: 6, marginBottom: 8 },
    sub: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { flex: 1, fontSize: 13, color: '#EF4444' },
    successCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 14, marginBottom: 20 },
    successText: { fontSize: 14, fontWeight: '600', color: '#065F46' },
    actionBtn: { backgroundColor: BRAND, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8, marginBottom: 12 },
    actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    ghostBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 20 },
    ghostBtnText: { fontSize: 14, fontWeight: '600' },
    tipsCard: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 8 },
    tipsTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
    tipText: { fontSize: 12, lineHeight: 20 },
});
