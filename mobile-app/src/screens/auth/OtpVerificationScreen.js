import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';
import { ScreenWrapper } from '../../components/layout';
import { Button } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const OtpVerificationScreen = ({ navigation, route }) => {
    const { email, purpose = 'password_reset', fromProfile = false } = route.params || {};
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Move to previous input on backspace if current is empty
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length < 6) {
            Alert.alert('Error', 'Please enter a 6-digit OTP code');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.verifyOTP(email, otpCode);
            if (response.success) {
                // Navigate to Reset Password screen with resetToken
                navigation.navigate('ResetPassword', {
                    resetToken: response.resetToken,
                    email,
                    fromProfile
                });
            } else {
                Alert.alert('Error', response.message || 'Invalid OTP code');
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        try {
            await authAPI.forgotPassword(email);
            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            Alert.alert('Success', 'New verification code sent to your email.');
        } catch (err) {
            Alert.alert('Error', 'Failed to resend code');
        }
    };

    return (
        <ScreenWrapper scrollable={false} style={{ backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <View style={styles.backCircle}>
                        <Ionicons name="arrow-back" size={24} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {fromProfile ? 'Change Password' : 'Verify Account'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {fromProfile
                            ? `To secure your password update, we've sent a 6-digit code to ${email}.`
                            : `Check your Email. We've sent a one-time verification code to ${email}. Enter the code below to verify your account.`
                        }
                    </Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    digit ? styles.otpInputFilled : null,
                                    // Highlight currently focused or next to fill 
                                    otp.join('').length === index && styles.otpInputActive
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Resend Timer */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>
                            {timer > 0
                                ? `You can resend the code in ${timer} seconds`
                                : "Didn't receive the code?"}
                        </Text>
                        {canResend && (
                            <TouchableOpacity onPress={handleResend}>
                                <Text style={styles.resendLink}>Resend code</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Verify Button */}
                    <Button
                        title="VERIFY OTP"
                        onPress={handleVerify}
                        loading={loading}
                        color={colors.primary}
                        style={styles.verifyButton}
                    />
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    backButton: {
        marginTop: Platform.OS === 'ios' ? 20 : 40,
    },
    backCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: 28, // Using circular inputs as per UI image
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    otpInputFilled: {
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    otpInputActive: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    resendText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        marginLeft: 6,
        textDecorationLine: 'underline',
    },
    verifyButton: {
        width: '100%',
        height: 56,
        borderRadius: 30,
    },
});

export default OtpVerificationScreen;
