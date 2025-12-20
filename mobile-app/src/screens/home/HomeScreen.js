// HomeScreen - White Theme with Orange Accent
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components/ui';
import { fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

// White Theme Colors
const whiteTheme = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceLight: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    primary: '#FF6B35',
    secondary: '#F7931E',
    accent: '#10B981',
    info: '#3B82F6',
    border: '#E5E7EB',
    white: '#FFFFFF',
};

const HomeScreen = ({ navigation }) => {
    const { user, isAuthenticated } = useAuth();

    const features = [
        { icon: 'school', title: 'Career Quiz', subtitle: 'Find your path', tab: 'Career', screen: 'CareerQuiz', color: whiteTheme.primary },
        { icon: 'people', title: 'Mentorship', subtitle: 'Get guidance', tab: 'Mentorship', screen: 'MentorList', color: whiteTheme.secondary },
        { icon: 'document-text', title: 'Assessment', subtitle: 'Test skills', tab: 'Career', screen: 'Assessment', color: whiteTheme.accent },
        { icon: 'bar-chart', title: 'Dashboard', subtitle: 'Track progress', tab: null, screen: 'Dashboard', color: whiteTheme.info },
    ];

    const quickActions = [
        { icon: 'compass', title: 'Career Paths', screen: 'CareerPaths' },
        { icon: 'book', title: 'Resources', screen: 'Resources' },
        { icon: 'calendar', title: 'Workshops', screen: 'Workshops' },
        { icon: 'chatbubbles', title: 'Community', screen: 'Community' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <LinearGradient
                colors={[whiteTheme.primary, whiteTheme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
            >
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>
                        {isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0] || 'User'}!` : 'Discover Your Career'}
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        AI-powered career guidance to help you reach your full potential
                    </Text>

                    {!isAuthenticated && (
                        <View style={styles.heroButtons}>
                            <Button
                                title="Get Started"
                                variant="primary"
                                size="lg"
                                onPress={() => navigation.navigate('Signup')}
                                style={[styles.heroButton, { backgroundColor: whiteTheme.white }]}
                                textStyle={{ color: whiteTheme.primary }}
                            />
                            <Button
                                title="Sign In"
                                variant="outline"
                                size="lg"
                                onPress={() => navigation.navigate('Login')}
                                style={[styles.heroButton, { borderColor: whiteTheme.white }]}
                                textStyle={{ color: whiteTheme.white }}
                            />
                        </View>
                    )}
                </View>

                {/* Decorative circles */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </LinearGradient>

            {/* Feature Cards */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Explore Features</Text>
                <View style={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.featureCard}
                            onPress={() => {
                                if (feature.tab) {
                                    navigation.dispatch(
                                        CommonActions.navigate({
                                            name: feature.tab,
                                            params: { screen: feature.screen },
                                        })
                                    );
                                } else {
                                    navigation.navigate(feature.screen);
                                }
                            }}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[feature.color + '20', feature.color + '10']}
                                style={styles.featureCardGradient}
                            >
                                <View style={[styles.featureIcon, { backgroundColor: feature.color + '30' }]}>
                                    <Ionicons name={feature.icon} size={24} color={feature.color} />
                                </View>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quickActionsScroll}
                >
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickAction}
                            onPress={() => navigation.navigate(action.screen)}
                        >
                            <View style={styles.quickActionIcon}>
                                <Ionicons name={action.icon} size={24} color={whiteTheme.primary} />
                            </View>
                            <Text style={styles.quickActionTitle}>{action.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Stats Section */}
            <View style={styles.section}>
                <Card gradient gradientColors={[whiteTheme.surface, whiteTheme.surfaceLight]}>
                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>10K+</Text>
                            <Text style={styles.statLabel}>Students</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>500+</Text>
                            <Text style={styles.statLabel}>Mentors</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>50+</Text>
                            <Text style={styles.statLabel}>Careers</Text>
                        </View>
                    </View>
                </Card>
            </View>

            {/* CTA Section */}
            {isAuthenticated && (
                <View style={styles.section}>
                    <Card gradient gradientColors={[whiteTheme.primary + '40', whiteTheme.secondary + '40']}>
                        <View style={styles.ctaContent}>
                            <Ionicons name="rocket" size={40} color={whiteTheme.primary} />
                            <Text style={styles.ctaTitle}>Ready to level up?</Text>
                            <Text style={styles.ctaText}>Take our career assessment and get personalized recommendations</Text>
                            <Button
                                title="Start Assessment"
                                variant="gradient"
                                size="md"
                                onPress={() => navigation.navigate('Assessment')}
                                style={styles.ctaButton}
                            />
                        </View>
                    </Card>
                </View>
            )}

            <View style={styles.bottomPadding} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteTheme.background,
    },
    hero: {
        padding: spacing.xl,
        paddingTop: spacing.xxl + 20,
        paddingBottom: spacing.xxl,
        borderBottomLeftRadius: borderRadius.xxl,
        borderBottomRightRadius: borderRadius.xxl,
        overflow: 'hidden',
        position: 'relative',
    },
    heroContent: {
        zIndex: 1,
    },
    heroTitle: {
        fontSize: fontSize.hero,
        fontWeight: fontWeight.bold,
        color: whiteTheme.white,
        marginBottom: spacing.sm,
    },
    heroSubtitle: {
        fontSize: fontSize.lg,
        color: whiteTheme.white + 'CC',
        lineHeight: 26,
        marginBottom: spacing.lg,
    },
    heroButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    heroButton: {
        flex: 1,
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        backgroundColor: whiteTheme.white + '10',
    },
    circle1: {
        width: 200,
        height: 200,
        top: -50,
        right: -50,
    },
    circle2: {
        width: 150,
        height: 150,
        bottom: -30,
        left: -30,
    },
    section: {
        padding: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: whiteTheme.text,
        marginBottom: spacing.md,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    featureCard: {
        width: (width - spacing.md * 3) / 2,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    featureCardGradient: {
        padding: spacing.md,
        alignItems: 'center',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    featureTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: whiteTheme.text,
    },
    featureSubtitle: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        marginTop: 2,
    },
    quickActionsScroll: {
        paddingRight: spacing.md,
    },
    quickAction: {
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.lg,
        backgroundColor: whiteTheme.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    quickActionTitle: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: spacing.sm,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: whiteTheme.primary,
    },
    statLabel: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: whiteTheme.border,
    },
    ctaContent: {
        alignItems: 'center',
        padding: spacing.md,
    },
    ctaTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: whiteTheme.text,
        marginTop: spacing.md,
    },
    ctaText: {
        fontSize: fontSize.md,
        color: whiteTheme.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    ctaButton: {
        width: '100%',
    },
    bottomPadding: {
        height: 100,
    },
});

export default HomeScreen;
