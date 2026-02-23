// ResetPasswordScreen.js — Wave redesign matching Login/Signup style
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView,
    Platform, TextInput, ActivityIndicator, Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';
import { useTheme } from '../../context/ThemeContext';

const { height } = Dimensions.get('window');
const BRAND = '#5B5FEF';

export default function ResetPasswordScreen({ navigation, route }) {
    const { resetToken, email, fromProfile = false } = route.params || {};
    const { theme } = useTheme();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleReset = async () => {
        if (!password || !confirm) { setError('Please fill in both fields'); return; }
        if (password !== confirm) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true); setError('');
        try {
            const response = await authAPI.resetPassword(resetToken, password, confirm);
            if (response.success) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: fromProfile ? 'ProfileMain' : 'Login' }],
                });
            } else {
                setError(response.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Token expired. Please request a new code.');
        } finally { setLoading(false); }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.root, { backgroundColor: BRAND }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor={BRAND} />
            <View style={styles.top}>
                {[160, 120, 80].map((r, i) => (
                    <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.07 + i * 0.04 }]} />
                ))}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.topContent}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-open-outline" size={30} color="#fff" />
                    </View>
                    <Text style={styles.topTitle}>New Password</Text>
                </View>
            </View>
            <View style={styles.waveBox}><View style={styles.waveCurve} /></View>

            <View style={[styles.bottom, { backgroundColor: theme.background }]}>
                <Text style={[styles.heading, { color: theme.text }]}>
                    {fromProfile ? 'Update Password' : 'Reset Password'}
                </Text>
                <View style={styles.headingUnderline} />
                <Text style={[styles.sub, { color: theme.textMuted }]}>
                    Last step! Create a strong new password for your account.
                </Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <Text style={[styles.label, { color: theme.textSecondary }]}>New Password</Text>
                <View style={[styles.inputRow, { borderBottomColor: theme.border }]}>
                    <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="min. 6 characters"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPass}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                        <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.label, { color: theme.textSecondary }]}>Confirm Password</Text>
                <View style={[styles.inputRow, { borderBottomColor: theme.border }]}>
                    <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="repeat password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={confirm}
                        onChangeText={setConfirm}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.resetBtn, loading && { opacity: 0.7 }]}
                    onPress={handleReset}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.resetBtnText}>Set New Password</Text>}
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
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, paddingBottom: 10, marginBottom: 20, gap: 10 },
    input: { flex: 1, fontSize: 15, paddingVertical: 2 },
    resetBtn: { backgroundColor: BRAND, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
    resetBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
