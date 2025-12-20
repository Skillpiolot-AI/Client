// Login Screen - Clean White Theme with Orange Accent
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth, getGoogleUserInfo } from '../../hooks';
import authAPI from '../../services/authAPI';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const { signInWithGoogle, isReady, response } = useGoogleAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle Google Sign-In response
    useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleResponse(response);
        }
    }, [response]);

    const handleGoogleResponse = async (response) => {
        try {
            setGoogleLoading(true);
            const { authentication } = response;
            if (authentication?.accessToken) {
                // Get user info from Google
                const userInfo = await getGoogleUserInfo(authentication.accessToken);
                // Send to backend for authentication
                const result = await authAPI.googleAuth(authentication.idToken || authentication.accessToken);
                if (result.token) {
                    // Success - user is now logged in
                    setError('');
                }
            }
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        await signInWithGoogle();
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color="#1A1A2E" />
                </TouchableOpacity>

                {/* Header */}
                <Text style={styles.title}>Log in</Text>
                <Text style={styles.subtitle}>
                    By logging in, you agree to our <Text style={styles.link}>Terms of Use</Text>.
                </Text>

                {/* Error Message */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={18} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Email Input */}
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                {/* Password Input */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                    style={styles.forgotBtn}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Connect Button */}
                <TouchableOpacity
                    style={styles.connectButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.connectButtonText}>
                        {loading ? 'Connecting...' : 'Connect'}
                    </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login */}
                <TouchableOpacity
                    style={[styles.socialButton, !isReady && styles.socialButtonDisabled]}
                    onPress={handleGoogleSignIn}
                    disabled={!isReady || googleLoading}
                >
                    {googleLoading ? (
                        <ActivityIndicator size="small" color="#EA4335" />
                    ) : (
                        <>
                            <Text style={styles.googleIcon}>G</Text>
                            <Text style={styles.socialButtonText}>Sign in with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                    <Text style={styles.socialButtonText}>Sign in with Facebook</Text>
                </TouchableOpacity>

                {/* Privacy Policy */}
                <Text style={styles.privacyText}>
                    For more information, please see our <Text style={styles.link}>Privacy policy</Text>.
                </Text>

                {/* Sign Up Link */}
                <View style={styles.signupRow}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F5F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 32,
    },
    link: {
        color: '#FF6B35',
        fontWeight: '600',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        gap: 8,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 20,
        height: 52,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A2E',
    },
    eyeIcon: {
        padding: 4,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 24,
        marginTop: -8,
    },
    forgotText: {
        fontSize: 14,
        color: '#FF6B35',
        fontWeight: '600',
    },
    connectButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    connectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#9CA3AF',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
        gap: 10,
    },
    googleIcon: {
        fontSize: 18,
        fontWeight: '700',
        color: '#EA4335',
    },
    socialButtonText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    privacyText: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        fontSize: 15,
        color: '#6B7280',
    },
    signupLink: {
        fontSize: 15,
        color: '#FF6B35',
        fontWeight: '600',
    },
});

export default LoginScreen;
