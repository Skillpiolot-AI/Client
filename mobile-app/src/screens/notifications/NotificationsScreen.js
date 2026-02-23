// NotificationsScreen.js — Phase 3: Real API data via NotificationContext + type filters + deep-link
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, NOTIF_META } from '../../context/NotificationContext';
import { Loading } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

// ── Filter tabs ───────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Unread', 'Booking', 'Assessment', 'Mentor', 'System'];

const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

// ── Notification Card ─────────────────────────────────────────────────────────
const NotifCard = ({ item, onPress }) => {
    const meta = NOTIF_META[item.type] || NOTIF_META.default;
    return (
        <TouchableOpacity
            style={[styles.card, !item.read && styles.cardUnread]}
            onPress={() => onPress(item)}
            activeOpacity={0.78}
        >
            {!item.read && <View style={styles.unreadDot} />}
            <View style={[styles.iconWrap, { backgroundColor: meta.color + '18' }]}>
                <Ionicons name={meta.icon} size={22} color={meta.color} />
            </View>
            <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                    <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.cardTime}>{timeAgo(item.createdAt)}</Text>
                </View>
                <Text style={styles.cardMsg} numberOfLines={2}>{item.message}</Text>
            </View>
        </TouchableOpacity>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const NotificationsScreen = ({ navigation }) => {
    const { notifications, unreadCount, loading, markRead, markAllRead, refresh } = useNotifications();
    const [activeFilter, setActiveFilter] = useState('All');
    const [refreshing, setRefreshing] = useState(false);

    // ── Deep-link routing by type ─────────────────────────────────────────────
    const handlePress = useCallback(async (item) => {
        if (!item.read) await markRead(item._id);
        switch (item.type) {
            case 'booking':    navigation.navigate('Mentorship', { screen: 'MyBookings' }); break;
            case 'assessment': navigation.navigate('Career',     { screen: 'Assessment' }); break;
            case 'mentor':     navigation.navigate('Mentorship', { screen: 'MentorList' }); break;
            default: break; // stay on screen for system/reminder
        }
    }, [markRead, navigation]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    }, [refresh]);

    // ── Filter logic ──────────────────────────────────────────────────────────
    const filtered = notifications.filter((n) => {
        if (activeFilter === 'All')    return true;
        if (activeFilter === 'Unread') return !n.read;
        return n.type === activeFilter.toLowerCase();
    });

    // ── Empty state ────────────────────────────────────────────────────────────
    const renderEmpty = () => (
        <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={56} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySub}>
                {activeFilter === 'All'
                    ? "You're all caught up!"
                    : `No ${activeFilter.toLowerCase()} notifications yet.`}
            </Text>
        </View>
    );

    if (loading) return <Loading fullScreen text="Loading notifications…" />;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Unread summary chip */}
            {unreadCount > 0 && (
                <View style={styles.summaryRow}>
                    <View style={styles.summaryChip}>
                        <View style={styles.liveDot} />
                        <Text style={styles.summaryText}>
                            {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                        </Text>
                    </View>
                </View>
            )}

            {/* ── Filter tabs ── */}
            <View>
                <FlatList
                    data={FILTERS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(f) => f}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item: f }) => {
                        const isActive = f === activeFilter;
                        const count = f === 'Unread'
                            ? unreadCount
                            : f === 'All'
                            ? notifications.length
                            : notifications.filter((n) => n.type === f.toLowerCase()).length;
                        return (
                            <TouchableOpacity
                                style={[styles.filterTab, isActive && styles.filterTabActive]}
                                onPress={() => setActiveFilter(f)}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                                    {f}
                                </Text>
                                {count > 0 && (
                                    <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
                                        <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
                                            {count}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* ── Notification list ── */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <NotifCard item={item} onPress={handlePress} />}
                contentContainerStyle={[styles.list, !filtered.length && styles.listEmpty]}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            />
        </SafeAreaView>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    headerTitle: {
        flex: 1,
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    markAllBtn: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    markAllText: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    // Summary chip
    summaryRow: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    summaryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: colors.primaryBg,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 5,
        gap: spacing.xs,
    },
    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    summaryText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        color: colors.primary,
    },
    // Filter tabs
    filterList: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.xs,
    },
    filterTabActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    filterLabelActive: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
    },
    filterBadge: {
        backgroundColor: colors.border,
        borderRadius: borderRadius.full,
        paddingHorizontal: 6,
        paddingVertical: 1,
        minWidth: 20,
        alignItems: 'center',
    },
    filterBadgeActive: {
        backgroundColor: colors.white + '35',
    },
    filterBadgeText: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
    },
    filterBadgeTextActive: {
        color: colors.white,
    },
    // List
    list: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xl,
    },
    listEmpty: {
        flex: 1,
    },
    // Notification card
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        gap: spacing.sm,
        position: 'relative',
        ...shadows.xs,
    },
    cardUnread: {
        backgroundColor: colors.primaryBg,
        borderColor: colors.primaryBorder,
    },
    unreadDot: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    iconWrap: {
        width: 46,
        height: 46,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    cardBody: {
        flex: 1,
        gap: 3,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: spacing.xs,
    },
    cardTitle: {
        flex: 1,
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.text,
    },
    cardTitleUnread: {
        fontWeight: fontWeight.bold,
    },
    cardTime: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        flexShrink: 0,
    },
    cardMsg: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    // Empty
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    emptySub: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default NotificationsScreen;
