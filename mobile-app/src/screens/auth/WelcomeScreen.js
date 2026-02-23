// Welcome Screen — Dark Theme
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Dark Indigo Hero Section */}
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                style={styles.heroSection}
            >
                {/* Decorative Stars */}
                <Text style={styles.star}>✦</Text>
                <Text style={[styles.star, styles.star2]}>✦</Text>
                <Text style={[styles.star, styles.star3]}>+</Text>
                <Text style={[styles.star, styles.star4]}>+</Text>

                {/* Cloud / blob decorations */}
                <View style={styles.cloudContainer}>
                    <View style={styles.cloud} />
                    <View style={[styles.cloud, styles.cloud2]} />
                </View>

                {/* Hero Image */}
                <Image
                    source={require('../../../assets/images/hero.png')}
                    style={styles.heroImage}
                    resizeMode="contain"
                />

                {/* App Name */}
                <Text style={styles.appName}>SkillPilot</Text>
            </LinearGradient>

            {/* Dark Content Section */}
            <View style={styles.contentSection}>
                <Text style={styles.title}>{'Unlock Your Career\nPotential'}</Text>
                <Text style={styles.subtitle}>
                    Get personalized mentorship, career guidance, and skill assessments to achieve your dreams.
                </Text>

                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signupButtonText}>Create Account</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Indicator */}
            <View style={styles.bottomIndicator} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    heroSection: {
        flex: 0.55,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    star: {
        position: 'absolute',
        color: 'rgba(255,255,255,0.55)',
        fontSize: 16,
        top: 80,
        left: 30,
    },
    star2: {
        top: 120,
        left: width - 60,
        fontSize: 12,
    },
    star3: {
        top: 60,
        left: width / 2 + 40,
        fontSize: 20,
    },
    star4: {
        top: 200,
        left: 50,
        fontSize: 14,
    },
    cloudContainer: {
        position: 'absolute',
        top: 100,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    cloud: {
        width: 80,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
    },
    cloud2: {
        width: 100,
        height: 50,
        marginTop: 20,
    },
    heroImage: {
        width: width * 0.6,
        height: width * 0.6,
        marginTop: 40,
    },
    appName: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.bold,
        color: colors.white,
        marginTop: spacing.md,
        letterSpacing: 1,
    },
    contentSection: {
        flex: 0.45,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: spacing.md,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    loginButton: {
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.xl,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    loginButtonText: {
        color: colors.white,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
    },
    signupButton: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    signupButtonText: {
        color: colors.text,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
    },
    bottomIndicator: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -40,
        width: 80,
        height: 5,
        backgroundColor: colors.surfaceAlt,
        borderRadius: 3,
    },
});

export default WelcomeScreen;
