// HomeScreen.js — Centralized-theme refactor
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
    const isMentor = user?.role === 'mentor';

    const features = [
        {
            icon: 'school-outline',
            title: 'AI Assessment',
            description: 'Get personalized skill gap analysis',
            screen: isMentor ? null : 'Assessment',
            color: colors.primary,
            bgColor: colors.primaryBg,
        },
        {
            icon: 'people-outline',
            title: 'Find Mentors',
            description: 'Connect with industry experts',
            screen: 'MentorList',
            color: colors.info,
            bgColor: colors.infoBg,
        },
        {
            icon: 'calendar-outline',
            title: 'Sessions',
            description: 'Manage your bookings',
            screen: isMentor ? 'MentorDashboard' : 'MyBookings',
            color: colors.success,
            bgColor: colors.successBg,
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            description: 'Stay up to date',
            screen: 'Notifications',
            color: colors.warning,
            bgColor: colors.warningBg,
        },
    ];

    const tips = [
        { icon: '🎯', text: 'Complete your profile to attract better mentor matches' },
        { icon: '📊', text: 'Regular assessments help track your skill growth over time' },
        { icon: '🤝', text: 'First sessions are always free — book yours today!' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* ── Hero Header ── */}
                <LinearGradient
                    colors={[colors.primaryDark, colors.primary, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
                >
                    <View style={styles.heroTopRow}>
                        <View>
                            <Text style={styles.heroWelcome}>Welcome back,</Text>
                            <Text style={styles.heroName}>{firstName} 👋</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.avatarBtn}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarInitial}>
                                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {isMentor && (
                        <View style={styles.roleBadge}>
                            <Ionicons name="ribbon-outline" size={14} color={colors.white} />
                            <Text style={styles.roleBadgeText}>Mentor Account</Text>
                        </View>
                    )}

                    <Text style={styles.heroTagline}>
                        {isMentor
                            ? 'Help others grow while building your impact'
                            : 'Your AI-powered career growth starts here'}
                    </Text>
                </LinearGradient>

                <View style={styles.body}>
                    {/* ── Feature Cards ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What would you like to do?</Text>
                        <View style={styles.featuresGrid}>
                            {features.map((f) => (
                                <TouchableOpacity
                                    key={f.title}
                                    style={styles.featureCard}
                                    onPress={() => f.screen && navigation.navigate(f.screen)}
                                    activeOpacity={0.8}
                                    disabled={!f.screen}
                                >
                                    <View style={[styles.featureIconWrap, { backgroundColor: f.bgColor }]}>
                                        <Ionicons name={f.icon} size={26} color={f.color} />
                                    </View>
                                    <Text style={styles.featureTitle}>{f.title}</Text>
                                    <Text style={styles.featureDesc}>{f.description}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ── Pro Tips ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tips for You</Text>
                        <View style={styles.tipsCard}>
                            {tips.map((tip, index) => (
                                <View key={index} style={[styles.tipRow, index < tips.length - 1 && styles.tipDivider]}>
                                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                                    <Text style={styles.tipText}>{tip.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ── Mentor CTA (Students only) ── */}
                    {!isMentor && (
                        <View style={styles.section}>
                            <TouchableOpacity
                                style={styles.ctaCard}
                                onPress={() => navigation.navigate('MentorList')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[colors.primary, colors.primaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.ctaGradient}
                                >
                                    <View style={styles.ctaContent}>
                                        <Text style={styles.ctaTitle}>Book a Free Session</Text>
                                        <Text style={styles.ctaSub}>Connect with top industry mentors</Text>
                                    </View>
                                    <Ionicons name="arrow-forward-circle" size={36} color={colors.white + 'CC'} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const cardWidth = (width - spacing.md * 2 - spacing.sm) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    hero: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xxl,
        gap: spacing.sm,
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    heroWelcome: {
        fontSize: fontSize.md,
        color: colors.white + 'BB',
        fontWeight: fontWeight.medium,
    },
    heroName: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
    },
    avatarBtn: {
        marginTop: 4,
    },
    avatarCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: colors.white + '30',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.white + '60',
    },
    avatarInitial: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        alignSelf: 'flex-start',
        backgroundColor: colors.white + '20',
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        marginTop: spacing.xs,
    },
    roleBadgeText: {
        fontSize: fontSize.xs,
        color: colors.white,
        fontWeight: fontWeight.semibold,
    },
    heroTagline: {
        fontSize: fontSize.md,
        color: colors.white + 'DD',
        lineHeight: 22,
        marginTop: spacing.xs,
    },
    body: {
        padding: spacing.md,
        marginTop: -(spacing.xl),
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    // ── Feature Cards ─────────────────────────────────────
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    featureCard: {
        width: cardWidth,
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.sm,
        gap: spacing.xs,
    },
    featureIconWrap: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    featureTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    featureDesc: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    // ── Tips Card ─────────────────────────────────────────
    tipsCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        overflow: 'hidden',
        ...shadows.sm,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        padding: spacing.md,
    },
    tipDivider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    tipIcon: {
        fontSize: 20,
    },
    tipText: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    // ── CTA Card ──────────────────────────────────────────
    ctaCard: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.primary,
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
    },
    ctaContent: {
        flex: 1,
    },
    ctaTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
    },
    ctaSub: {
        fontSize: fontSize.sm,
        color: colors.white + 'CC',
        marginTop: 4,
    },
});

export default HomeScreen;
