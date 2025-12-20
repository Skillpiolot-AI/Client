// Welcome Screen - Orange Hero with White Background
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Orange Hero Section */}
            <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                style={styles.heroSection}
            >
                {/* Decorative Stars */}
                <Text style={styles.star}>✦</Text>
                <Text style={[styles.star, styles.star2]}>✦</Text>
                <Text style={[styles.star, styles.star3]}>+</Text>
                <Text style={[styles.star, styles.star4]}>+</Text>

                {/* Cloud decorations */}
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

            {/* White Content Section */}
            <View style={styles.contentSection}>
                <Text style={styles.title}>Unlock Your Career{'\n'}Potential</Text>
                <Text style={styles.subtitle}>
                    Get personalized mentorship, career guidance, and skill assessments to achieve your dreams.
                </Text>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Signup')}
                >
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
        backgroundColor: '#FFFFFF',
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
        color: 'rgba(255,255,255,0.8)',
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
        backgroundColor: 'rgba(255,200,150,0.5)',
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
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 20,
        letterSpacing: 1,
    },
    contentSection: {
        flex: 0.45,
        paddingHorizontal: 32,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A2E',
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#FF6B35',
        borderRadius: 16,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    signupButton: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    signupButtonText: {
        color: '#1A1A2E',
        fontSize: 18,
        fontWeight: '600',
    },
    bottomIndicator: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -40,
        width: 80,
        height: 5,
        backgroundColor: '#1A1A2E',
        borderRadius: 3,
    },
});

export default WelcomeScreen;
