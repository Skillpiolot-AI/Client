// screens/admin/AdminDashboardScreen.js — Phase 5 Admin Panel
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { adminAPI } from '../../services/adminAPI';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
    { icon: 'people-outline', label: 'Users', screen: 'UserManagement', color: colors.info },
    { icon: 'person-add-outline', label: 'Applications', screen: 'MentorApplications', color: colors.success },
    { icon: 'settings-outline', label: 'Settings', screen: 'SystemSettings', color: colors.warning },
    { icon: 'megaphone-outline', label: 'Updates', screen: 'AdminUpdates', color: colors.primary },
];

const KpiCard = ({ icon, label, value, color, sub }) => (
    <View style={styles.kpiCard}>
        <View style={[styles.kpiIcon, { backgroundColor: color + '18' }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.kpiValue}>{value ?? '—'}</Text>
        <Text style={styles.kpiLabel}>{label}</Text>
        {sub ? <Text style={styles.kpiSub}>{sub}</Text> : null}
    </View>
);

const AdminDashboardScreen = ({ navigation }) => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            const [s, a] = await Promise.allSettled([
                adminAPI.getDashboardStats(),
                adminAPI.getAnalytics(),
            ]);
            if (s.status === 'fulfilled') setStats(s.value?.data || s.value);
            if (a.status === 'fulfilled') setAnalytics(a.value?.data || a.value);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    // Chart data — fallback to demo
    const chartLabels = analytics?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const chartData = analytics?.registrations || [12, 28, 34, 42, 55, 71];

    const kpis = [
        { icon: 'people-outline', label: 'Users', value: stats?.totalUsers, color: colors.info, sub: '+12 this week' },
        { icon: 'school-outline', label: 'Mentors', value: stats?.totalMentors, color: colors.primary, sub: null },
        { icon: 'calendar-outline', label: 'Sessions', value: stats?.totalSessions, color: colors.success, sub: null },
        { icon: 'hourglass-outline', label: 'Pending', value: stats?.pendingApplications, color: colors.warning, sub: 'applications' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
            >
                {/* Header gradient */}
                <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerSub}>Admin Panel</Text>
                            <Text style={styles.headerTitle}>Dashboard</Text>
                        </View>
                        <View style={styles.adminBadge}>
                            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
                            <Text style={styles.adminBadgeText}>Admin</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.body}>
                    {/* KPI cards */}
                    {loading ? (
                        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
                    ) : (
                        <View style={styles.kpiGrid}>
                            {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
                        </View>
                    )}

                    {/* User growth chart */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>User Registrations</Text>
                        <View style={styles.chartCard}>
                            <LineChart
                                data={{ labels: chartLabels, datasets: [{ data: chartData }] }}
                                width={width - spacing.md * 2 - spacing.md * 2}
                                height={180}
                                chartConfig={{
                                    backgroundColor: colors.card,
                                    backgroundGradientFrom: colors.card,
                                    backgroundGradientTo: colors.card,
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                                    labelColor: () => colors.textMuted,
                                    propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
                                }}
                                bezier
                                style={{ borderRadius: borderRadius.lg }}
                                withInnerLines={false}
                            />
                        </View>
                    </View>

                    {/* Quick actions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickGrid}>
                            {QUICK_ACTIONS.map((a) => (
                                <TouchableOpacity
                                    key={a.label}
                                    style={styles.quickCard}
                                    onPress={() => navigation.navigate(a.screen)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.quickIcon, { backgroundColor: a.color + '18' }]}>
                                        <Ionicons name={a.icon} size={26} color={a.color} />
                                    </View>
                                    <Text style={styles.quickLabel}>{a.label}</Text>
                                    <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: spacing.md, paddingVertical: spacing.xl },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerSub: { fontSize: fontSize.sm, color: colors.white + 'AA', fontWeight: fontWeight.medium },
    headerTitle: { fontSize: fontSize.xxxl, fontWeight: fontWeight.extrabold, color: colors.white },
    adminBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: colors.white, borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm + 2, paddingVertical: 5,
    },
    adminBadgeText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.primary },
    body: { padding: spacing.md, gap: spacing.lg },
    kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    kpiCard: {
        width: (width - spacing.md * 2 - spacing.sm) / 2,
        backgroundColor: colors.card, borderRadius: borderRadius.xl,
        padding: spacing.md, gap: 4, borderWidth: 1,
        borderColor: colors.cardBorder, ...shadows.sm,
    },
    kpiIcon: { width: 42, height: 42, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
    kpiValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold, color: colors.text },
    kpiLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary },
    kpiSub: { fontSize: fontSize.xs, color: colors.success },
    section: { gap: spacing.sm },
    sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
    chartCard: {
        backgroundColor: colors.card, borderRadius: borderRadius.xl,
        padding: spacing.md, borderWidth: 1, borderColor: colors.cardBorder, ...shadows.sm,
    },
    quickGrid: { gap: spacing.sm },
    quickCard: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.md,
        backgroundColor: colors.card, borderRadius: borderRadius.xl,
        padding: spacing.md, borderWidth: 1, borderColor: colors.cardBorder, ...shadows.xs,
    },
    quickIcon: { width: 48, height: 48, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
    quickLabel: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
});

export default AdminDashboardScreen;
