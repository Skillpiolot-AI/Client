// Verify Email Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';
import { ScreenWrapper } from '../../components/layout';
import { Button, Loading } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const VerifyEmailScreen = ({ navigation, route }) => {
    const token = route.params?.token;
    const email = route.params?.email;

    const [verifying, setVerifying] = useState(!!token);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            await authAPI.verifyEmail(token);
            setVerified(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
        setVerifying(false);
    };

    const handleResend = async () => {
        if (!email) {
            navigation.navigate('Login');
            return;
        }

        setResending(true);
        try {
            await authAPI.resendVerification(email);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification');
        }
        setResending(false);
    };

    if (verifying) {
        return (
            <ScreenWrapper scrollable={false}>
                <View style={styles.container}>
                    <Loading size="large" text="Verifying your email..." />
                </View>
            </ScreenWrapper>
        );
    }

    if (verified) {
        return (
            <ScreenWrapper scrollable={false}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={[colors.success + '30', colors.success + '10']}
                        style={styles.iconContainer}
                    >
                        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
                    </LinearGradient>
                    <Text style={styles.title}>Email Verified!</Text>
                    <Text style={styles.subtitle}>
                        Your email has been verified successfully. You can now sign in to your account.
                    </Text>
                    <Button
                        title="Sign In"
                        variant="gradient"
                        size="lg"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.button}
                    />
                </View>
            </ScreenWrapper>
        );
    }

    // Waiting for verification state
    return (
        <ScreenWrapper scrollable={false}>
            <View style={styles.container}>
                <LinearGradient
                    colors={[colors.warning + '30', colors.warning + '10']}
                    style={styles.iconContainer}
                >
                    <Ionicons name="mail-unread" size={60} color={colors.warning} />
                </LinearGradient>
                <Text style={styles.title}>Verify Your Email</Text>
                <Text style={styles.subtitle}>
                    {email
                        ? `We've sent a verification link to ${email}. Please check your inbox and click the link to verify your account.`
                        : 'Please check your email for a verification link.'
                    }
                </Text>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color={colors.error} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <Button
                    title="Resend Verification Email"
                    variant="outline"
                    size="lg"
                    loading={resending}
                    onPress={handleResend}
                    style={styles.button}
                />

                <Button
                    title="Go to Login"
                    variant="ghost"
                    size="lg"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.secondaryButton}
                />

                <View style={styles.tips}>
                    <Text style={styles.tipsTitle}>Didn't receive the email?</Text>
                    <Text style={styles.tipsText}>• Check your spam or junk folder</Text>
                    <Text style={styles.tipsText}>• Make sure the email address is correct</Text>
                    <Text style={styles.tipsText}>• Wait a few minutes and try again</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
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
        width: '100%',
    },
    errorText: {
        color: colors.error,
        fontSize: fontSize.sm,
        flex: 1,
    },
    button: {
        width: '100%',
    },
    secondaryButton: {
        width: '100%',
        marginTop: spacing.sm,
    },
    tips: {
        marginTop: spacing.xl,
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        width: '100%',
    },
    tipsTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    tipsText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 22,
    },
});

export default VerifyEmailScreen;
