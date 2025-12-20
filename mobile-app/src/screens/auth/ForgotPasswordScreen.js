// Forgot Password Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';
import { ScreenWrapper } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResetRequest = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authAPI.forgotPassword(email);
            setLoading(false);
            // Navigate to OTP verification instead of showing success message
            navigation.navigate('OtpVerification', { email });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper scrollable={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>

                    <LinearGradient
                        colors={[colors.primary + '30', colors.primary + '10']}
                        style={styles.iconContainer}
                    >
                        <Ionicons name="key" size={40} color={colors.primary} />
                    </LinearGradient>

                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we'll send you instructions to reset your password.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color={colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <Input
                        label="Email Address"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(val) => {
                            setEmail(val);
                            setError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
                    />

                    <Button
                        title="Send Reset Link"
                        variant="gradient"
                        size="lg"
                        loading={loading}
                        onPress={handleResetRequest}
                        style={styles.resetButton}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Remember your password? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: spacing.xs,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.xl,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: spacing.md,
    },
    form: {
        marginBottom: spacing.xl,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.error + '20',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    errorText: {
        color: colors.error,
        fontSize: fontSize.sm,
        flex: 1,
    },
    resetButton: {
        marginTop: spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: fontSize.md,
    },
    loginLink: {
        color: colors.primary,
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
    },
    // Success State
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    successTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    successText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    successButton: {
        width: '100%',
    },
    resendButton: {
        marginTop: spacing.lg,
    },
    resendText: {
        color: colors.primary,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
    },
});

export default ForgotPasswordScreen;
