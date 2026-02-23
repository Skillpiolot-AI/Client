// AdminDashboardScreen.js — Live charts, new theme, full production quality
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, ActivityIndicator, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { adminAPI } from '../../services/adminAPI';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const BRAND = '#5B5FEF';
const CHART_W = width - 56;

const DEMO_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const DEMO_REG = [12, 28, 34, 42, 55, 71];
const DEMO_BOOK = [4, 9, 14, 18, 26, 33];

const QUICK_ACTIONS = [
    { icon: 'people-outline', label: 'Users', screen: 'UserManagement', color: '#6366F1' },
    { icon: 'person-add-outline', label: 'Applications', screen: 'MentorApplications', color: '#10B981' },
    { icon: 'settings-outline', label: 'Settings', screen: 'SystemSettings', color: '#F59E0B' },
    { icon: 'megaphone-outline', label: 'Announcements', screen: 'AdminUpdates', color: '#EF4444' },
];

export default function AdminDashboardScreen({ navigation }) {
    const { theme, isDark } = useTheme();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
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
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const chartLabels = analytics?.labels || DEMO_LABELS;
    const regData = (analytics?.registrations || DEMO_REG).map(n => Math.max(n, 0));
    const bookData = (analytics?.bookings || DEMO_BOOK).map(n => Math.max(n, 0));

    const chartConfig = {
        backgroundColor: theme.card,
        backgroundGradientFrom: theme.card,
        backgroundGradientTo: theme.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(91, 95, 239, ${opacity})`,
        labelColor: () => theme.textMuted,
        propsForDots: { r: '4', strokeWidth: '2', stroke: BRAND },
        propsForBackgroundLines: { stroke: theme.border, strokeWidth: 0.5 },
    };

    const barConfig = {
        ...chartConfig,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    };

    const kpis = [
        { icon: 'people-outline', label: 'Total Users', value: stats?.totalUsers ?? '—', color: '#6366F1', sub: `+${stats?.newUsersThisWeek ?? 0} this week` },
        { icon: 'school-outline', label: 'Mentors', value: stats?.totalMentors ?? '—', color: BRAND, sub: `${stats?.activeMentors ?? 0} active` },
        { icon: 'calendar-outline', label: 'Sessions', value: stats?.totalSessions ?? '—', color: '#10B981', sub: 'all time' },
        { icon: 'hourglass-outline', label: 'Pending', value: stats?.pendingApplications ?? '—', color: '#F59E0B', sub: 'applications' },
    ];

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} colors={[BRAND]} />}
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: BRAND }]}>
                    {[170, 120, 70].map((r, i) => (
                        <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.06 + i * 0.03 }]} />
                    ))}
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerSub}>Admin Panel</Text>
                            <Text style={styles.headerTitle}>Dashboard</Text>
                        </View>
                        <View style={styles.adminBadge}>
                            <Ionicons name="shield-checkmark" size={14} color={BRAND} />
                            <Text style={styles.adminBadgeText}>{user?.name?.split(' ')[0] || 'Admin'}</Text>
                        </View>
                    </View>
                    {/* Inline stat chips */}
                    <View style={styles.headerChips}>
                        {[
                            { label: 'Users', value: stats?.totalUsers ?? '—' },
                            { label: 'Mentors', value: stats?.totalMentors ?? '—' },
                            { label: 'Sessions', value: stats?.totalSessions ?? '—' },
                        ].map(c => (
                            <View key={c.label} style={styles.headerChip}>
                                <Text style={styles.headerChipValue}>{c.value}</Text>
                                <Text style={styles.headerChipLabel}>{c.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ padding: 20, gap: 20 }}>
                    {/* KPI Grid */}
                    {loading ? (
                        <ActivityIndicator color={BRAND} />
                    ) : (
                        <View style={styles.kpiGrid}>
                            {kpis.map(k => (
                                <View key={k.label} style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                                    <View style={[styles.kpiIcon, { backgroundColor: k.color + '18' }]}>
                                        <Ionicons name={k.icon} size={20} color={k.color} />
                                    </View>
                                    <Text style={[styles.kpiValue, { color: theme.text }]}>{k.value}</Text>
                                    <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>{k.label}</Text>
                                    <Text style={[styles.kpiSub, { color: theme.textMuted }]}>{k.sub}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Registrations line chart */}
                    <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <View style={styles.chartHeader}>
                            <Text style={[styles.chartTitle, { color: theme.text }]}>User Registrations</Text>
                            <View style={[styles.chartBadge, { backgroundColor: BRAND + '15' }]}>
                                <Text style={[styles.chartBadgeText, { color: BRAND }]}>6 months</Text>
                            </View>
                        </View>
                        <LineChart
                            data={{ labels: chartLabels, datasets: [{ data: regData, strokeWidth: 2 }] }}
                            width={CHART_W}
                            height={180}
                            chartConfig={chartConfig}
                            bezier
                            style={{ borderRadius: 12 }}
                            withInnerLines={false}
                            withOuterLines={false}
                        />
                    </View>

                    {/* Bookings bar chart */}
                    <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <View style={styles.chartHeader}>
                            <Text style={[styles.chartTitle, { color: theme.text }]}>Sessions Booked</Text>
                            <View style={[styles.chartBadge, { backgroundColor: '#10B981' + '18' }]}>
                                <Text style={[styles.chartBadgeText, { color: '#10B981' }]}>6 months</Text>
                            </View>
                        </View>
                        <BarChart
                            data={{ labels: chartLabels, datasets: [{ data: bookData }] }}
                            width={CHART_W}
                            height={180}
                            chartConfig={barConfig}
                            style={{ borderRadius: 12 }}
                            withInnerLines={false}
                            showValuesOnTopOfBars
                        />
                    </View>

                    {/* Quick actions */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {QUICK_ACTIONS.map(a => (
                            <TouchableOpacity
                                key={a.label}
                                style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                                onPress={() => navigation.navigate(a.screen)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
                                    <Ionicons name={a.icon} size={24} color={a.color} />
                                </View>
                                <Text style={[styles.actionLabel, { color: theme.text }]}>{a.label}</Text>
                                <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Pending applications alert */}
                    {(stats?.pendingApplications ?? 0) > 0 && (
                        <TouchableOpacity
                            style={styles.alertCard}
                            onPress={() => navigation.navigate('MentorApplications')}
                            activeOpacity={0.85}
                        >
                            <View style={styles.alertDot} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.alertTitle}>{stats.pendingApplications} pending mentor application{stats.pendingApplications > 1 ? 's' : ''}</Text>
                                <Text style={styles.alertSub}>Tap to review and approve</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={16} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { padding: 20, paddingTop: 24, overflow: 'hidden', gap: 16 },
    ring: { position: 'absolute', borderWidth: 1, borderColor: '#fff' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
    adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
    adminBadgeText: { fontSize: 13, fontWeight: '700', color: BRAND },
    headerChips: { flexDirection: 'row', gap: 10 },
    headerChip: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, alignItems: 'center' },
    headerChipValue: { fontSize: 20, fontWeight: '900', color: '#fff' },
    headerChipLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
    kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    kpiCard: { width: (width - 50) / 2, borderRadius: 16, padding: 14, borderWidth: 1, gap: 4 },
    kpiIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    kpiValue: { fontSize: 26, fontWeight: '900' },
    kpiLabel: { fontSize: 13, fontWeight: '600' },
    kpiSub: { fontSize: 11 },
    chartCard: { borderRadius: 18, padding: 16, borderWidth: 1, gap: 12 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    chartTitle: { fontSize: 16, fontWeight: '700' },
    chartBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    chartBadgeText: { fontSize: 12, fontWeight: '600' },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    actionsGrid: { gap: 10 },
    actionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 14, borderWidth: 1 },
    actionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    alertCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F59E0B', borderRadius: 16, padding: 16 },
    alertDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
    alertTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
    alertSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
});
