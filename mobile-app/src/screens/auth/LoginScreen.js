// Login Screen — Dark Theme
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth, getGoogleUserInfo } from '../../hooks';
import authAPI from '../../services/authAPI';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const { signInWithGoogle, isReady, response } = useGoogleAuth();
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading]           = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError]               = useState('');

    useEffect(() => {
        if (response?.type === 'success') handleGoogleResponse(response);
    }, [response]);

    const handleGoogleResponse = async (response) => {
        try {
            setGoogleLoading(true);
            const { authentication } = response;
            if (authentication?.accessToken) {
                await getGoogleUserInfo(authentication.accessToken);
                const result = await authAPI.googleAuth(authentication.idToken || authentication.accessToken);
                if (result.token) setError('');
            }
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleSignIn = async () => { setError(''); await signInWithGoogle(); };

    const handleLogin = async () => {
        if (!email || !password) { setError('Please fill in all fields'); return; }
        setLoading(true);
        setError('');
        const result = await login(email, password);
        if (!result.success) setError(result.error);
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Header */}
                <Text style={styles.title}>Log in</Text>
                <Text style={styles.subtitle}>
                    By logging in, you agree to our <Text style={styles.link}>Terms of Use</Text>.
                </Text>

                {/* Error Message */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={18} color={colors.error} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Email Input */}
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your email"
                        placeholderTextColor={colors.textMuted}
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
                        placeholderTextColor={colors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons
                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity style={styles.connectButton} onPress={handleLogin} disabled={loading}>
                    {loading
                        ? <ActivityIndicator color={colors.white} />
                        : <Text style={styles.connectButtonText}>Connect</Text>
                    }
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

                {/* Privacy */}
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
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingTop: 60,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: fontSize.hero,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    link: {
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.errorBg,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.error + '40',
    },
    errorText: {
        color: colors.error,
        fontSize: fontSize.sm,
        flex: 1,
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
        height: 52,
        paddingHorizontal: spacing.md,
    },
    input: {
        flex: 1,
        fontSize: fontSize.md,
        color: colors.text,
    },
    eyeIcon: {
        padding: 4,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: spacing.lg,
        marginTop: -spacing.sm,
    },
    forgotText: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    connectButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    connectButtonText: {
        color: colors.white,
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: spacing.md,
        fontSize: fontSize.sm,
        color: colors.textMuted,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        height: 52,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
        gap: 10,
    },
    socialButtonDisabled: {
        opacity: 0.5,
    },
    googleIcon: {
        fontSize: 18,
        fontWeight: fontWeight.bold,
        color: '#EA4335',
    },
    socialButtonText: {
        fontSize: fontSize.md,
        color: colors.text,
        fontWeight: fontWeight.medium,
    },
    privacyText: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    signupLink: {
        fontSize: fontSize.md,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
});

export default LoginScreen;
