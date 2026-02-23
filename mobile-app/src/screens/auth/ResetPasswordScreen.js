import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authAPI from '../../services/authAPI';
import { ScreenWrapper } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const ResetPasswordScreen = ({ navigation, route }) => {
    const { resetToken, email, fromProfile = false } = route.params || {};
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleReset = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.resetPassword(resetToken, password, confirmPassword);
            if (response.success) {
                Alert.alert('Success', 'Your password has been reset successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (fromProfile) {
                                navigation.navigate('ProfileMain');
                            } else {
                                navigation.navigate('Login');
                            }
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', response.message || 'Failed to reset password');
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to reset password. Token might be expired.');
        } finally {
            setLoading(false);
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

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {fromProfile ? 'Update Password' : 'Reset Password'}
                    </Text>
                    <Text style={styles.subtitle}>
                        Last step! Create a new strong password for your account linked to {email}.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="New Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        focusedColor={colors.primary}
                        icon={
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        }
                    />

                    <Input
                        label="Confirm New Password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        focusedColor={colors.primary}
                        icon={
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={colors.textSecondary}
                            />
                        }
                    />

                    <Button
                        title="RESET PASSWORD"
                        onPress={handleReset}
                        loading={loading}
                        color={colors.primary}
                        style={styles.resetButton}
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
        marginBottom: 20,
    },
    backCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    form: {
        flex: 1,
    },
    resetButton: {
        marginTop: 24,
        height: 56,
        borderRadius: 30,
    },
});

export default ResetPasswordScreen;
