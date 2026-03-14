// SignupScreen.js — Wave design registration with role selection
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

export default function SignupScreen({ navigation }) {
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [role, setRole] = useState('User');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideUp, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleSignup = async () => {
        if (!name || !username || !email || !password) { setError('Please fill in all fields'); return; }
        if (password !== confirmPass) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        setError('');
        const result = await signup({ name, username, email: email.toLowerCase(), password, confirmPassword: confirmPass, role });
        setLoading(false);
        if (result.success) {
            navigation.navigate('VerifyEmail', { email: email.toLowerCase() });
        } else {
            setError(result.error || 'Signup failed');
        }
    };

    const RoleBtn = ({ label, icon, value }) => (
        <TouchableOpacity
            style={[styles.roleBtn, role === value && styles.roleBtnActive]}
            onPress={() => setRole(value)}
        >
            <Ionicons name={icon} size={18} color={role === value ? '#fff' : BRAND} />
            <Text style={[styles.roleBtnText, role === value && { color: '#fff' }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={styles.root}
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
                    <Ionicons name="rocket" size={26} color="#fff" />
                    <Text style={styles.topTitle}>Create Account</Text>
                </View>
            </View>
            <View style={styles.waveBox}><View style={styles.waveCurve} /></View>

            <ScrollView style={styles.bottom} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
                    <Text style={styles.heading}>Sign up</Text>
                    <View style={styles.headingUnderline} />

                    {/* Role selector */}
                    <Text style={styles.label}>I am a</Text>
                    <View style={styles.roleRow}>
                        <RoleBtn label="Student" icon="school-outline" value="User" />
                        <RoleBtn label="Mentor" icon="people-outline" value="Mentor" />
                    </View>

                    {error ? (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Fields */}
                    {[
                        { label: 'Full Name', icon: 'person-outline', value: name, setter: setName, placeholder: 'Your full name' },
                        { label: 'Username', icon: 'at-outline', value: username, setter: setUsername, placeholder: 'Choose a username' },
                        { label: 'Email', icon: 'mail-outline', value: email, setter: setEmail, placeholder: 'your@email.com', keyboardType: 'email-address' },
                    ].map((f, i) => (
                        <View key={i}>
                            <Text style={styles.label}>{f.label}</Text>
                            <View style={styles.inputRow}>
                                <Ionicons name={f.icon} size={18} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder={f.placeholder}
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                    keyboardType={f.keyboardType || 'default'}
                                    value={f.value}
                                    onChangeText={f.setter}
                                />
                            </View>
                        </View>
                    ))}

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputRow}>
                        <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                        <TextInput style={styles.input} placeholder="min. 6 characters" placeholderTextColor="#9CA3AF" secureTextEntry={!showPass} value={password} onChangeText={setPassword} />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputRow}>
                        <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                        <TextInput style={styles.input} placeholder="repeat password" placeholderTextColor="#9CA3AF" secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />
                    </View>

                    <TouchableOpacity
                        style={[styles.signupBtn, loading && { opacity: 0.7 }]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupBtnText}>Create Account</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16, marginBottom: 40 }}>
                        <Text style={styles.loginLink}>
                            Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BRAND },
    top: { height: height * 0.22, backgroundColor: BRAND, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    ring: { position: 'absolute', borderWidth: 1, borderColor: '#fff' },
    backBtn: { position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    topContent: { alignItems: 'center', gap: 6 },
    topTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
    waveBox: { height: 40, overflow: 'hidden', backgroundColor: BRAND },
    waveCurve: { height: 70, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 },
    bottom: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 28 },
    heading: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 4 },
    headingUnderline: { width: 50, height: 3, backgroundColor: BRAND, borderRadius: 2, marginTop: 6, marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: BRAND, backgroundColor: '#EEF2FF' },
    roleBtnActive: { backgroundColor: BRAND, borderColor: BRAND },
    roleBtnText: { fontSize: 14, fontWeight: '700', color: BRAND },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { flex: 1, fontSize: 13, color: '#EF4444' },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#E5E7EB', paddingBottom: 10, marginBottom: 18, gap: 10 },
    input: { flex: 1, fontSize: 15, color: '#111827', paddingVertical: 2 },
    signupBtn: { backgroundColor: BRAND, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
    signupBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    loginLink: { textAlign: 'center', fontSize: 14, color: '#6B7280' },
    loginLinkBold: { color: BRAND, fontWeight: '700' },
});
