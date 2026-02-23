// DashboardScreen.js — Centralized-theme refactor
import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import assessmentAPI from '../../services/assessmentAPI';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [assessmentData, setAssessmentData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            const data = await assessmentAPI.getUserResults();
            setAssessmentData(data);
        } catch (err) {
            console.log('Dashboard fetch error:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    }, [fetchDashboardData]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
    const hasAssessment = assessmentData && assessmentData.length > 0;
    const latestResult = hasAssessment ? assessmentData[0] : null;

    const quickActions = [
        { icon: 'school-outline', label: 'Take Assessment', screen: 'Assessment', color: colors.primary },
        { icon: 'people-outline', label: 'Find Mentors', screen: 'MentorList', color: colors.info },
        { icon: 'calendar-outline', label: 'My Bookings', screen: 'MyBookings', color: colors.success },
        { icon: 'person-outline', label: 'My Profile', screen: 'Profile', color: colors.warning },
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
                {/* ── Header Gradient ── */}
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + spacing.md }]}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.greetingRow}>
                            <View style={styles.greetingText}>
                                <Text style={styles.greeting}>{getGreeting()} 👋</Text>
                                <Text style={styles.userName} numberOfLines={1}>{firstName}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.notifBtn}
                                onPress={() => navigation.navigate('Notifications')}
                            >
                                <Ionicons name="notifications-outline" size={22} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        {/* Stats Banner */}
                        <View style={styles.statsBanner}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{hasAssessment ? assessmentData.length : 0}</Text>
                                <Text style={styles.statLabel}>Assessments</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{latestResult?.overallScore?.toFixed(0) ?? '--'}</Text>
                                <Text style={styles.statLabel}>Best Score</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>0</Text>
                                <Text style={styles.statLabel}>Sessions</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.body}>
                    {/* ── Quick Actions ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickActionsGrid}>
                            {quickActions.map((action) => (
                                <TouchableOpacity
                                    key={action.label}
                                    style={styles.quickAction}
                                    onPress={() => navigation.navigate(action.screen)}
                                    activeOpacity={0.75}
                                >
                                    <View style={[styles.quickActionIcon, { backgroundColor: action.color + '18' }]}>
                                        <Ionicons name={action.icon} size={24} color={action.color} />
                                    </View>
                                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ── Assessment Progress ── */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Assessment Progress</Text>
                            {hasAssessment && (
                                <TouchableOpacity onPress={() => navigation.navigate('Assessment')}>
                                    <Text style={styles.seeAll}>View All</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {hasAssessment ? (
                            <View style={styles.progressCard}>
                                <View style={styles.progressCardHeader}>
                                    <View style={styles.progressCardIconWrap}>
                                        <Ionicons name="trophy-outline" size={22} color={colors.primary} />
                                    </View>
                                    <View style={styles.progressCardInfo}>
                                        <Text style={styles.progressCardTitle}>
                                            {latestResult?.title || 'Latest Assessment'}
                                        </Text>
                                        <Text style={styles.progressCardSub}>
                                            Most recent result
                                        </Text>
                                    </View>
                                    <Text style={styles.progressScore}>
                                        {latestResult?.overallScore?.toFixed(0) ?? '--'}%
                                    </Text>
                                </View>

                                {/* Score bar */}
                                <View style={styles.scoreBarBg}>
                                    <View
                                        style={[
                                            styles.scoreBarFill,
                                            { width: `${Math.min(latestResult?.overallScore ?? 0, 100)}%` },
                                        ]}
                                    />
                                </View>

                                <View style={styles.domainChips}>
                                    {(latestResult?.domains || []).slice(0, 3).map((d, i) => (
                                        <View key={i} style={styles.domainChip}>
                                            <Text style={styles.domainChipText}>{d.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.emptyCard}
                                onPress={() => navigation.navigate('Assessment')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[colors.primary + '12', colors.primaryDark + '06']}
                                    style={styles.emptyCardGradient}
                                >
                                    <Ionicons name="clipboard-outline" size={42} color={colors.primary} />
                                    <Text style={styles.emptyCardTitle}>Start Your First Assessment</Text>
                                    <Text style={styles.emptyCardSub}>
                                        Discover your skill gaps and get personalized recommendations
                                    </Text>
                                    <View style={styles.emptyCardBtn}>
                                        <Text style={styles.emptyCardBtnText}>Take Assessment →</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* ── Find Mentors CTA ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Get Expert Guidance</Text>
                        <TouchableOpacity
                            style={styles.mentorCTA}
                            onPress={() => navigation.navigate('MentorList')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[colors.info + '15', colors.info + '06']}
                                style={styles.mentorCTAInner}
                            >
                                <View style={styles.mentorCTAContent}>
                                    <View style={styles.mentorCTAIcon}>
                                        <Ionicons name="people" size={28} color={colors.info} />
                                    </View>
                                    <View>
                                        <Text style={styles.mentorCTATitle}>Browse Mentors</Text>
                                        <Text style={styles.mentorCTASub}>Free sessions available</Text>
                                    </View>
                                </View>
                                <Ionicons name="arrow-forward" size={20} color={colors.info} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    headerContent: {
        gap: spacing.lg,
    },
    greetingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greetingText: {
        flex: 1,
    },
    greeting: {
        fontSize: fontSize.md,
        color: colors.white + 'CC',
        fontWeight: fontWeight.medium,
    },
    userName: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
        marginTop: 2,
    },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.white + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    statsBanner: {
        flexDirection: 'row',
        backgroundColor: colors.white + '18',
        borderRadius: borderRadius.xl,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: colors.white + 'BB',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.white + '40',
        marginVertical: 4,
    },
    body: {
        padding: spacing.md,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    seeAll: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    // ── Quick Actions ──────────────────────────────────────
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    quickAction: {
        width: (width - spacing.md * 2 - spacing.sm * 3) / 4,
        alignItems: 'center',
        gap: spacing.xs,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActionLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
        fontWeight: fontWeight.medium,
    },
    // ── Progress Card ──────────────────────────────────────
    progressCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.sm,
    },
    progressCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    progressCardIconWrap: {
        width: 42,
        height: 42,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressCardInfo: {
        flex: 1,
    },
    progressCardTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
    },
    progressCardSub: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    progressScore: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.primary,
    },
    scoreBarBg: {
        height: 6,
        backgroundColor: colors.surfaceAlt,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    scoreBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
    },
    domainChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    domainChip: {
        backgroundColor: colors.primaryBg,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    domainChipText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.primary,
    },
    // ── Empty State Card ───────────────────────────────────
    emptyCard: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.primaryBorder,
    },
    emptyCardGradient: {
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
    },
    emptyCardTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        textAlign: 'center',
    },
    emptyCardSub: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    emptyCardBtn: {
        marginTop: spacing.sm,
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
    },
    emptyCardBtnText: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.md,
    },
    // ── Mentor CTA──────────────────────────────────────────
    mentorCTA: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.info + '30',
    },
    mentorCTAInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
    },
    mentorCTAContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    mentorCTAIcon: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.info + '18',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mentorCTATitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    mentorCTASub: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
});

export default DashboardScreen;
