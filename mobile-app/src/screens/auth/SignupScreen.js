// Signup Screen - Clean White Theme with Orange Accent
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const SignupScreen = ({ navigation }) => {
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
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
                    <Ionicons name="checkmark-circle" size={80} color="#FF6B35" />
                </View>
                <Text style={styles.successTitle}>Account Created!</Text>
                <Text style={styles.successText}>
                    We've sent a verification email to {email}. Please verify to continue.
                </Text>
                <TouchableOpacity
                    style={styles.connectButton}
                    onPress={() => navigation.navigate('Login')}
                >
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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                    Join us to unlock your career potential.
                </Text>

                {/* Error Message */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={18} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Name Input */}
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your full name"
                        placeholderTextColor="#9CA3AF"
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
                        placeholder="Create a password"
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

                {/* Confirm Password Input */}
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        placeholderTextColor="#9CA3AF"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                    />
                </View>

                {/* Create Account Button */}
                <TouchableOpacity
                    style={styles.connectButton}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text style={styles.connectButtonText}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </Text>
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
    connectButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        marginTop: 8,
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
        marginBottom: 24,
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
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
    },
    loginText: {
        fontSize: 15,
        color: '#6B7280',
    },
    loginLink: {
        fontSize: 15,
        color: '#FF6B35',
        fontWeight: '600',
    },
    // Success styles
    successContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF3EE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 12,
    },
    successText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
});

export default SignupScreen;
