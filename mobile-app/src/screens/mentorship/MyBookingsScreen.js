// MyBookingsScreen.js — Centralized-theme refactor
// Removes local `whiteTheme`; uses centralized theme tokens throughout.
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, Alert, Image, ActivityIndicator, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';

const STATUS_COLORS = {
    confirmed: { bg: colors.successBg, text: colors.successDark },
    pending:   { bg: colors.warningBg, text: colors.warningDark },
    cancelled: { bg: colors.errorBg,   text: colors.errorDark },
    completed: { bg: colors.primaryBg, text: colors.primary },
};

const FILTERS = ['all', 'confirmed', 'pending', 'completed', 'cancelled'];

const getStatusStyle = (status) =>
    STATUS_COLORS[status?.toLowerCase()] || { bg: colors.surface, text: colors.textSecondary };

const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

const MyBookingsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const isMentor = user?.role === 'Mentor';

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = isMentor
                ? await mentorshipAPI.getMentorSessions()
                : await mentorshipAPI.getMyBookings();
            const bookingData = response?.bookings || response?.data?.bookings || response || [];
            setBookings(Array.isArray(bookingData) ? bookingData : []);
        } catch (error) {
            console.log('Fetch bookings error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBookings();
        setRefreshing(false);
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter((b) => b.status?.toLowerCase() === filter);

    const handleCancel = (id) => {
        Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await mentorshipAPI.cancelBooking(id);
                        Alert.alert('Cancelled', 'Booking cancelled successfully');
                        fetchBookings();
                    } catch (err) {
                        Alert.alert('Error', err?.response?.data?.error || 'Failed to cancel booking');
                    }
                },
            },
        ]);
    };

    const handleJoin = (meetingLink) => {
        if (meetingLink) {
            Linking.openURL(meetingLink);
        } else {
            Alert.alert('Link Unavailable', 'The meeting link will be available closer to your session time.');
        }
    };

    // ── Booking Card ─────────────────────────────────────────────────────────
    const renderBookingCard = ({ item: booking }) => {
        const status = booking.status?.toLowerCase();
        const statusStyle = getStatusStyle(status);
        const isUpcoming = status === 'confirmed' || status === 'pending';
        const otherPerson = isMentor
            ? booking.menteeId || booking.student
            : booking.mentorProfile || booking.mentor;

        return (
            <View style={styles.bookingCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                    {(otherPerson?.profileImage || otherPerson?.avatar) ? (
                        <Image
                            source={{ uri: otherPerson.profileImage || otherPerson.avatar }}
                            style={styles.personAvatar}
                        />
                    ) : (
                        <View style={styles.personAvatarPlaceholder}>
                            <Text style={styles.personAvatarInitial}>
                                {(otherPerson?.name || otherPerson?.displayName || '?').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.cardHeaderInfo}>
                        <Text style={styles.personName} numberOfLines={1}>
                            {otherPerson?.displayName || otherPerson?.name || (isMentor ? 'Student' : 'Mentor')}
                        </Text>
                        <Text style={styles.sessionTitle} numberOfLines={1}>
                            {booking.remark || booking.topics?.[0] || (isMentor ? 'Mentoring Session' : 'Career Guidance')}
                        </Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                            {booking.status || 'Unknown'}
                        </Text>
                    </View>
                </View>

                {/* Session Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.detailText}>{formatDate(booking.scheduledAt)}</Text>
                    </View>
                    {booking.scheduledAt && (
                        <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.detailText}>
                                {formatTime(booking.scheduledAt)}
                                {booking.duration && ` · ${booking.duration} min`}
                            </Text>
                        </View>
                    )}
                    {booking.meetingLink && (
                        <View style={styles.detailRow}>
                            <Ionicons name="videocam-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.detailText}>Meeting link available</Text>
                        </View>
                    )}
                    {booking.bookingId && (
                        <View style={styles.detailRow}>
                            <Ionicons name="receipt-outline" size={16} color={colors.textSecondary} />
                            <Text style={[styles.detailText, styles.bookingId]}>#{booking.bookingId}</Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                {isUpcoming && (
                    <View style={styles.actionRow}>
                        {booking.meetingLink && (
                            <TouchableOpacity
                                style={styles.joinBtn}
                                onPress={() => handleJoin(booking.meetingLink)}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="videocam" size={16} color={colors.white} />
                                <Text style={styles.joinBtnText}>Join Session</Text>
                            </TouchableOpacity>
                        )}
                        {!isMentor && status === 'pending' && (
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => handleCancel(booking._id || booking.id)}
                                activeOpacity={0.75}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    };

    // ── Empty State ─────────────────────────────────────────────────────────
    const ListEmpty = () => (
        <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={52} color={colors.border} />
            <Text style={styles.emptyTitle}>
                No {filter === 'all' ? '' : filter} bookings found
            </Text>
            <Text style={styles.emptySubtitle}>
                {isMentor
                    ? 'Your upcoming sessions from students will appear here'
                    : 'Book your first free mentorship session to get started'}
            </Text>
            {!isMentor && filter === 'all' && (
                <TouchableOpacity
                    style={styles.bookNowBtn}
                    onPress={() => navigation.navigate('MentorList')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.bookNowBtnText}>Find a Mentor</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    // ── Loading ─────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // ── Stats Banner ────────────────────────────────────────────────────────
    const totalCount = bookings.length;
    const upcomingCount = bookings.filter(
        (b) => b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'pending'
    ).length;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* ── Page Header ── */}
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>
                    {isMentor ? 'Mentor Sessions' : 'My Bookings'}
                </Text>
                <TouchableOpacity style={styles.refreshIconBtn} onPress={fetchBookings}>
                    <Ionicons name="refresh-outline" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* ── Stats ── */}
            {totalCount > 0 && (
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { borderTopColor: colors.primary }]}>
                        <Text style={styles.statValue}>{totalCount}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={[styles.statBox, { borderTopColor: colors.success }]}>
                        <Text style={styles.statValue}>{upcomingCount}</Text>
                        <Text style={styles.statLabel}>Upcoming</Text>
                    </View>
                    <View style={[styles.statBox, { borderTopColor: colors.info }]}>
                        <Text style={styles.statValue}>
                            {bookings.filter((b) => b.status?.toLowerCase() === 'completed').length}
                        </Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                </View>
            )}

            {/* ── Filter Tabs ── */}
            <View style={styles.filterTabsWrap}>
                <FlatList
                    horizontal
                    data={FILTERS}
                    keyExtractor={(f) => f}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterTabs}
                    renderItem={({ item: f }) => {
                        const count = f === 'all'
                            ? bookings.length
                            : bookings.filter((b) => b.status?.toLowerCase() === f).length;
                        const active = filter === f;
                        return (
                            <TouchableOpacity
                                style={[styles.filterTab, active && styles.filterTabActive]}
                                onPress={() => setFilter(f)}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
                                <View style={[styles.filterTabBadge, active && styles.filterTabBadgeActive]}>
                                    <Text style={[styles.filterTabBadgeText, active && styles.filterTabBadgeTextActive]}>
                                        {count}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* ── Bookings List ── */}
            <FlatList
                data={filteredBookings}
                keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
                renderItem={renderBookingCard}
                ListEmptyComponent={ListEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ── Page Header ────────────────────────────────
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    pageTitle: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
    },
    refreshIconBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    // ── Stats Row ───────────────────────────────────
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    statBox: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderTopWidth: 3,
        ...shadows.xs,
    },
    statValue: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    // ── Filter Tabs ─────────────────────────────────
    filterTabsWrap: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterTabs: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.xs,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    filterTabActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterTabText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    filterTabTextActive: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
    },
    filterTabBadge: {
        backgroundColor: colors.border,
        borderRadius: borderRadius.full,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    filterTabBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    filterTabBadgeText: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: fontWeight.bold,
    },
    filterTabBadgeTextActive: {
        color: colors.white,
    },
    // ── List ─────────────────────────────────────────
    listContent: {
        padding: spacing.md,
        paddingBottom: 100,
        flexGrow: 1,
    },
    // ── Booking Card ──────────────────────────────────
    bookingCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.sm,
        gap: spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    personAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: colors.border,
    },
    personAvatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    personAvatarInitial: {
        fontSize: 20,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
    },
    cardHeaderInfo: {
        flex: 1,
        gap: 3,
    },
    personName: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    sessionTitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    statusPill: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    statusText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        textTransform: 'capitalize',
    },
    // ── Details ───────────────────────────────────────
    detailsContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        gap: spacing.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    detailText: {
        fontSize: fontSize.sm,
        color: colors.text,
        fontWeight: fontWeight.medium,
    },
    bookingId: {
        color: colors.textMuted,
        fontFamily: 'monospace',
    },
    // ── Action Row ────────────────────────────────────
    actionRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    joinBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.lg,
        ...shadows.primary,
    },
    joinBtnText: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.md,
    },
    cancelBtn: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.error,
    },
    cancelBtnText: {
        color: colors.error,
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.md,
    },
    // ── Empty State ────────────────────────────────────
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        gap: spacing.sm,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
        lineHeight: 20,
    },
    bookNowBtn: {
        marginTop: spacing.md,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        ...shadows.primary,
    },
    bookNowBtnText: {
        color: colors.white,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
    },
});

export default MyBookingsScreen;
