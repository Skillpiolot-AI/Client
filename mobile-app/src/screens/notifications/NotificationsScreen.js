// NotificationsScreen.js — Premium redesign with date sections, theme-aware, live server data
import React, { useState, useCallback, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, SectionList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, NOTIF_META } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { Loading } from '../../components/ui';

const BRAND = '#5B5FEF';
const FILTERS = ['All', 'Unread', 'Booking', 'Assessment', 'Mentor', 'System'];

// ── Time helpers ──────────────────────────────────────────────────────────────
const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const getDayLabel = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);

    if (d >= startOfToday) return 'Today';
    if (d >= startOfYesterday) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

// ── Group notifications by day ────────────────────────────────────────────────
const groupByDay = (items) => {
    const map = {};
    items.forEach((n) => {
        const label = getDayLabel(n.createdAt || n.sentAt || Date.now());
        if (!map[label]) map[label] = [];
        map[label].push(n);
    });
    return Object.entries(map).map(([title, data]) => ({ title, data }));
};

// ── Notification Card ─────────────────────────────────────────────────────────
const NotifCard = ({ item, onPress, theme }) => {
    const meta = NOTIF_META[item.type] || NOTIF_META.default || { icon: 'notifications-outline', color: BRAND };
    const isUnread = !item.isRead && !item.read;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
                isUnread && { backgroundColor: BRAND + '0E', borderColor: BRAND + '40' },
            ]}
            onPress={() => onPress(item)}
            activeOpacity={0.78}
        >
            {/* Left: icon */}
            <View style={[styles.iconWrap, { backgroundColor: meta.color + '18' }]}>
                <Ionicons name={meta.icon} size={22} color={meta.color} />
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                    <Text
                        style={[
                            styles.cardTitle,
                            { color: theme.text },
                            isUnread && { fontWeight: '700' },
                        ]}
                        numberOfLines={1}
                    >
                        {item.subject || item.title}
                    </Text>
                    {isUnread && <View style={[styles.dot, { backgroundColor: meta.color }]} />}
                </View>
                <Text style={[styles.cardMsg, { color: theme.textSecondary }]} numberOfLines={2}>
                    {item.description || item.message}
                </Text>
                <View style={styles.cardFooter}>
                    <View style={[styles.typePill, { backgroundColor: meta.color + '15' }]}>
                        <Text style={[styles.typePillText, { color: meta.color }]}>
                            {item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'System'}
                        </Text>
                    </View>
                    <Text style={[styles.cardTime, { color: theme.textMuted }]}>
                        {timeAgo(item.createdAt || item.sentAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function NotificationsScreen({ navigation }) {
    const { notifications, unreadCount, loading, markRead, markAllRead, refresh } = useNotifications();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('All');
    const [refreshing, setRefreshing] = useState(false);

    const handlePress = useCallback(async (item) => {
        if (!item.isRead && !item.read) await markRead(item._id);
        switch (item.type) {
            case 'booking': navigation.navigate('Mentorship', { screen: 'MyBookings' }); break;
            case 'assessment': navigation.navigate('Career', { screen: 'Assessment' }); break;
            case 'mentor': navigation.navigate('Mentorship', { screen: 'MentorList' }); break;
            default: break;
        }
    }, [markRead, navigation]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    }, [refresh]);

    const filtered = useMemo(() => {
        return notifications.filter((n) => {
            if (activeFilter === 'All') return true;
            if (activeFilter === 'Unread') return !n.isRead && !n.read;
            return n.type === activeFilter.toLowerCase();
        });
    }, [notifications, activeFilter]);

    const sections = useMemo(() => groupByDay(filtered), [filtered]);

    const filterCount = (f) => {
        if (f === 'All') return notifications.length;
        if (f === 'Unread') return unreadCount;
        return notifications.filter((n) => n.type === f.toLowerCase()).length;
    };

    if (loading) return <Loading fullScreen text="Loading notifications…" />;

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            {/* ── Header ── */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.openDrawer?.()}
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={22} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn} activeOpacity={0.7}>
                        <Ionicons name="checkmark-done-outline" size={20} color={BRAND} />
                    </TouchableOpacity>
                )}
            </View>

            {/* ── Unread banner ── */}
            {unreadCount > 0 && (
                <View style={[styles.unreadBanner, { backgroundColor: BRAND + '12' }]}>
                    <View style={styles.liveDot} />
                    <Text style={styles.unreadBannerText}>
                        You have <Text style={{ fontWeight: '700' }}>{unreadCount}</Text> unread{' '}
                        notification{unreadCount > 1 ? 's' : ''}
                    </Text>
                    <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
                        <Text style={styles.markAllInline}>Mark all read</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ── Filter chips ── */}
            <View style={{ flexGrow: 0, flexShrink: 0 }}>
                <FlatList
                    data={FILTERS}
                    horizontal
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(f) => f}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item: f }) => {
                        const isActive = f === activeFilter;
                        const count = filterCount(f);
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.chip,
                                    { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
                                    isActive && { backgroundColor: BRAND, borderColor: BRAND },
                                ]}
                                onPress={() => setActiveFilter(f)}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.chipLabel, { color: theme.textSecondary }, isActive && { color: '#fff' }]}>
                                    {f}
                                </Text>
                                {count > 0 && (
                                    <View style={[styles.chipBadge, isActive ? { backgroundColor: 'rgba(255,255,255,0.25)' } : { backgroundColor: BRAND + '20' }]}>
                                        <Text style={[styles.chipBadgeText, { color: isActive ? '#fff' : BRAND }]}>{count}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* ── Notification list with sections ── */}
            {filtered.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <View style={[styles.emptyIconBox, { backgroundColor: theme.surfaceAlt }]}>
                        <Ionicons name="notifications-off-outline" size={40} color={theme.textMuted} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>No notifications</Text>
                    <Text style={[styles.emptySub, { color: theme.textMuted }]}>
                        {activeFilter === 'All'
                            ? "You're all caught up! 🎉"
                            : `No ${activeFilter.toLowerCase()} notifications yet.`}
                    </Text>
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item._id}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} colors={[BRAND]} />
                    }
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeaderRow}>
                            <Text style={[styles.sectionHeaderText, { color: theme.textMuted }]}>{section.title}</Text>
                            <View style={[styles.sectionLine, { backgroundColor: theme.border }]} />
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <NotifCard item={item} onPress={handlePress} theme={theme} />
                    )}
                />
            )}
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1 },
    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, gap: 8,
    },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerBadge: {
        backgroundColor: BRAND, borderRadius: 30,
        minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 6,
    },
    headerBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    markAllBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    // Unread banner
    unreadBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 16, paddingVertical: 10,
    },
    liveDot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: BRAND,
    },
    unreadBannerText: { flex: 1, fontSize: 13, color: BRAND },
    markAllInline: { fontSize: 13, color: BRAND, fontWeight: '700' },
    // Filter chips
    filterList: { paddingHorizontal: 16, paddingVertical: 6, gap: 8 },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 5,
        borderRadius: 30, borderWidth: 1,
    },
    chipLabel: { fontSize: 13, fontWeight: '600' },
    chipBadge: { minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
    chipBadgeText: { fontSize: 10, fontWeight: '800' },
    // Section headers
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, marginTop: 4 },
    sectionHeaderText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 },
    sectionLine: { flex: 1, height: 1 },
    // List
    list: { paddingHorizontal: 16, paddingTop: 4 },
    // Card
    card: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 12,
        borderRadius: 16, padding: 14, marginBottom: 8,
        borderWidth: 1,
    },
    iconWrap: {
        width: 46, height: 46, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    cardBody: { flex: 1, gap: 4 },
    cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    cardTitle: { flex: 1, fontSize: 14, fontWeight: '500' },
    dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
    cardMsg: { fontSize: 13, lineHeight: 18 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    typePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 30 },
    typePillText: { fontSize: 11, fontWeight: '700' },
    cardTime: { fontSize: 11 },
    // Empty
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12, paddingHorizontal: 40 },
    emptyIconBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    emptyTitle: { fontSize: 20, fontWeight: '700' },
    emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
