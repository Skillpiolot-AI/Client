// MentorDashboardScreen.js — Centralized-theme refactor
// Removes import of uiTheme from ProfileScreen; uses centralized colors directly.
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import mentorshipAPI from '../../services/mentorshipAPI';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const screenWidth = Dimensions.get('window').width;

const MentorDashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, graphRes] = await Promise.all([
                mentorshipAPI.getDashboardStats(),
                mentorshipAPI.getActivityGraph(),
            ]);
            setStats(statsRes);
            setGraphData(graphRes);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    const chartConfig = {
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // #4F46E5 = primary
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        strokeWidth: 2.5,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
    };

    const lineChartData = {
        labels: graphData.length > 0 ? graphData.map((d) => d.day) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
            data: graphData.length > 0 ? graphData.map((d) => d.count) : [0, 1, 0, 2, 1],
            color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
            strokeWidth: 2.5,
        }],
    };

    const sessionKPIs = [
        {
            icon: 'calendar-outline',
            label: 'Upcoming',
            sub: 'Sessions',
            value: stats?.upcomingSessions || 0,
            bg: colors.primaryBg,
            iconColor: colors.primary,
        },
        {
            icon: 'checkmark-done',
            label: 'Completed',
            sub: 'Overall',
            value: stats?.completedSessions || 0,
            bg: colors.successBg,
            iconColor: colors.success,
        },
    ];

    const activityKPIs = [
        { icon: 'call-outline', label: 'Avg / Day', value: stats?.avgCallsPerDay || 0, color: colors.primary },
        { icon: 'calendar-outline', label: 'This Week', value: stats?.weekSessions || 0, color: colors.info },
        { icon: 'calendar', label: 'This Month', value: stats?.monthSessions || 0, color: colors.secondary },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ── Header ── */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                        <Text style={styles.headerSub}>
                            Welcome back, {user?.name?.split(' ')[0] || 'Mentor'}!
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.bellBtn}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Ionicons name="notifications-outline" size={22} color={colors.text} />
                        <View style={styles.notifDot} />
                    </TouchableOpacity>
                </View>

                {/* ── Session Stats ── */}
                <Text style={styles.sectionTitle}>Session Stats</Text>
                <View style={styles.kpiRow}>
                    {sessionKPIs.map((kpi) => (
                        <View key={kpi.label} style={[styles.kpiCard, { backgroundColor: kpi.bg }]}>
                            <View style={[styles.kpiIconCircle, { backgroundColor: kpi.iconColor + '20' }]}>
                                <Ionicons name={kpi.icon} size={22} color={kpi.iconColor} />
                            </View>
                            <Text style={styles.kpiValue}>{kpi.value}</Text>
                            <Text style={styles.kpiLabel}>{kpi.label}</Text>
                            <Text style={styles.kpiSub}>{kpi.sub}</Text>
                        </View>
                    ))}
                </View>

                {/* ── Activity KPI ── */}
                <Text style={styles.sectionTitle}>Activity KPI</Text>
                <View style={styles.activityGrid}>
                    {activityKPIs.map((kpi) => (
                        <View key={kpi.label} style={[styles.activityBox, { borderTopColor: kpi.color }]}>
                            <View style={[styles.activityIconWrap, { backgroundColor: kpi.color + '15' }]}>
                                <Ionicons name={kpi.icon} size={22} color={kpi.color} />
                            </View>
                            <Text style={styles.activityValue}>{kpi.value}</Text>
                            <Text style={styles.activityLabel}>{kpi.label}</Text>
                        </View>
                    ))}
                </View>

                {/* ── Activity Chart ── */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Your Activities</Text>
                    <LineChart
                        data={lineChartData}
                        width={screenWidth - spacing.md * 2 - spacing.md * 2}
                        height={170}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withInnerLines={false}
                        withOuterLines={false}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        withDots={true}
                        withShadow={false}
                    />
                </View>

                {/* ── Sessions Link ── */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Sessions</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.sessionsRow}
                    onPress={() => navigation.navigate('MyBookings')}
                    activeOpacity={0.8}
                >
                    <View style={styles.sessionsIconWrap}>
                        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.sessionsText}>
                        <Text style={styles.sessionsTitle}>Track all your mentor sessions</Text>
                        <Text style={styles.sessionsSub}>View history and upcoming student calls</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>

                {/* ── AI Suggestion ── */}
                <View style={styles.aiCard}>
                    <View style={styles.aiCardInner}>
                        <Ionicons name="sparkles" size={20} color={colors.primary} />
                        <Text style={styles.aiMessage}>
                            AI suggests focusing more on Frontend topics this week to better serve your mentees.
                        </Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
    },
    loadingText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    // ── Header ────────────────────────────────────
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    headerTitle: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
    },
    headerSub: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    bellBtn: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    notifDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error,
        borderWidth: 1.5,
        borderColor: colors.white,
    },
    // ── Section Titles ─────────────────────────────
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.xs,
    },
    viewAll: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    // ── Session KPI Row ────────────────────────────
    kpiRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    kpiCard: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    kpiIconCircle: {
        width: 42,
        height: 42,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    kpiValue: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
    },
    kpiLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textSecondary,
        marginTop: 2,
    },
    kpiSub: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
    },
    // ── Activity KPI Grid ──────────────────────────
    activityGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    activityBox: {
        flex: 1,
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderTopWidth: 3,
        alignItems: 'center',
        ...shadows.sm,
    },
    activityIconWrap: {
        width: 42,
        height: 42,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    activityValue: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
    },
    activityLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 2,
        textAlign: 'center',
    },
    // ── Chart ─────────────────────────────────────
    chartCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xxl,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    chartTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    chart: {
        borderRadius: borderRadius.lg,
    },
    // ── Sessions Row ──────────────────────────────
    sessionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        marginBottom: spacing.lg,
        ...shadows.xs,
    },
    sessionsIconWrap: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionsText: {
        flex: 1,
    },
    sessionsTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
    },
    sessionsSub: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    // ── AI Card ───────────────────────────────────
    aiCard: {
        backgroundColor: colors.primaryBg,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
    },
    aiCardInner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
    },
    aiMessage: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.text,
        lineHeight: 20,
        fontWeight: fontWeight.medium,
    },
});

export default MentorDashboardScreen;
