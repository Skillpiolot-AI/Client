// Signup Screen — Dark Theme
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const SignupScreen = ({ navigation }) => {
    const { signup } = useAuth();
    const [name, setName]                       = useState('');
    const [email, setEmail]                     = useState('');
    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword]       = useState(false);
    const [loading, setLoading]                 = useState(false);
    const [error, setError]                     = useState('');
    const [success, setSuccess]                 = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields'); return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match'); return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters'); return;
        }
        setLoading(true);
        setError('');
        const result = await signup({ name, email, password, confirmPassword });
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={80} color={colors.success} />
                </View>
                <Text style={styles.successTitle}>Account Created!</Text>
                <Text style={styles.successText}>
                    We've sent a verification email to {email}. Please verify to continue.
                </Text>
                <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.connectButtonText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us to unlock your career potential.</Text>

                {/* Error Message */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={18} color={colors.error} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Name Input */}
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your full name"
                        placeholderTextColor={colors.textMuted}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

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
                        placeholder="Create a password"
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

                {/* Confirm Password Input */}
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        placeholderTextColor={colors.textMuted}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                    />
                </View>

                {/* Create Account Button */}
                <TouchableOpacity style={styles.connectButton} onPress={handleSignup} disabled={loading}>
                    {loading
                        ? <ActivityIndicator color={colors.white} />
                        : <Text style={styles.connectButtonText}>Create Account</Text>
                    }
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Signup */}
                <TouchableOpacity style={styles.socialButton}>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.socialButtonText}>Sign up with Google</Text>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Log In</Text>
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
    connectButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
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
        marginBottom: spacing.lg,
        gap: 10,
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
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    loginText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    loginLink: {
        fontSize: fontSize.md,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    // Success state
    successContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.successBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.success + '30',
    },
    successTitle: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    successText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 24,
    },
});

export default SignupScreen;
