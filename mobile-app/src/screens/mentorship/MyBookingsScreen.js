// MyBookingsScreen.js — Full theme-aware redesign with rating support
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, Alert, Image, ActivityIndicator, Linking, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import mentorshipAPI from '../../services/mentorshipAPI';

const BRAND = '#5B5FEF';

const STATUS_COLORS = {
    confirmed: { bg: '#ECFDF5', text: '#065F46' },
    pending: { bg: '#FFFBEB', text: '#92400E' },
    cancelled: { bg: '#FEF2F2', text: '#991B1B' },
    completed: { bg: '#EEF2FF', text: BRAND },
};

const FILTERS = ['all', 'confirmed', 'pending', 'completed', 'cancelled'];

const getStatusStyle = (status) =>
    STATUS_COLORS[status?.toLowerCase()] || { bg: '#F9FAFB', text: '#6B7280' };

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
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isMentor = user?.role === 'Mentor';

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');
    const [ratingModal, setRatingModal] = useState(null); // { bookingId, name }
    const [rating, setRating] = useState(0);
    const [submittingRating, setSubmittingRating] = useState(false);

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

    const handleRate = (booking) => {
        const name = isMentor
            ? booking.menteeId?.name || 'Mentee'
            : booking.mentorProfile?.displayName || booking.mentor?.name || 'Mentor';
        setRating(0);
        setRatingModal({ bookingId: booking._id || booking.id, name });
    };

    const submitRating = async () => {
        if (!rating || !ratingModal) return;
        setSubmittingRating(true);
        try {
            await mentorshipAPI.rateBooking?.(ratingModal.bookingId, rating);
            Alert.alert('Thank you!', `You rated this session ${rating} star${rating > 1 ? 's' : ''}.`);
            setRatingModal(null);
            fetchBookings();
        } catch {
            Alert.alert('Error', 'Could not submit rating. Please try again.');
        } finally { setSubmittingRating(false); }
    };

    // ── Booking Card ─────────────────────────────────────────────────────────
    const renderBookingCard = ({ item: booking }) => {
        const status = booking.status?.toLowerCase();
        const statusStyle = getStatusStyle(status);
        const isUpcoming = status === 'confirmed' || status === 'pending';
        const isCompleted = status === 'completed';
        const otherPerson = isMentor
            ? booking.menteeId || booking.student
            : booking.mentorProfile || booking.mentor;

        return (
            <View style={[styles.bookingCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <View style={styles.cardHeader}>
                    {(otherPerson?.profileImage || otherPerson?.avatar) ? (
                        <Image source={{ uri: otherPerson.profileImage || otherPerson.avatar }} style={styles.personAvatar} />
                    ) : (
                        <View style={[styles.personAvatarPlaceholder, { backgroundColor: BRAND }]}>
                            <Text style={styles.personAvatarInitial}>
                                {(otherPerson?.name || otherPerson?.displayName || '?').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.cardHeaderInfo}>
                        <Text style={[styles.personName, { color: theme.text }]} numberOfLines={1}>
                            {otherPerson?.displayName || otherPerson?.name || (isMentor ? 'Student' : 'Mentor')}
                        </Text>
                        <Text style={[styles.sessionTitle, { color: theme.textSecondary }]} numberOfLines={1}>
                            {booking.remark || booking.topics?.[0] || (isMentor ? 'Mentoring Session' : 'Career Guidance')}
                        </Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{booking.status || 'Unknown'}</Text>
                    </View>
                </View>

                <View style={[styles.detailsContainer, { backgroundColor: theme.surfaceAlt }]}>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={15} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{formatDate(booking.scheduledAt)}</Text>
                    </View>
                    {booking.scheduledAt && (
                        <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={15} color={theme.textSecondary} />
                            <Text style={[styles.detailText, { color: theme.text }]}>
                                {formatTime(booking.scheduledAt)}{booking.duration ? ` · ${booking.duration} min` : ''}
                            </Text>
                        </View>
                    )}
                    {booking.meetingLink && (
                        <View style={styles.detailRow}>
                            <Ionicons name="videocam-outline" size={15} color={theme.textSecondary} />
                            <Text style={[styles.detailText, { color: theme.text }]}>Meeting link available</Text>
                        </View>
                    )}
                </View>

                {isUpcoming && (
                    <View style={styles.actionRow}>
                        {booking.meetingLink && (
                            <TouchableOpacity style={styles.joinBtn} onPress={() => handleJoin(booking.meetingLink)} activeOpacity={0.85}>
                                <Ionicons name="videocam" size={16} color="#fff" />
                                <Text style={styles.joinBtnText}>Join Session</Text>
                            </TouchableOpacity>
                        )}
                        {!isMentor && status === 'pending' && (
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(booking._id || booking.id)} activeOpacity={0.75}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {isCompleted && !isMentor && (
                    <TouchableOpacity style={styles.rateBtn} onPress={() => handleRate(booking)} activeOpacity={0.85}>
                        <Ionicons name="star-outline" size={16} color={BRAND} />
                        <Text style={styles.rateBtnText}>Rate This Session</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // ── Empty State ─────────────────────────────────────────────────────────
    const ListEmpty = () => (
        <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={52} color={theme.border} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No {filter === 'all' ? '' : filter} bookings found
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                {isMentor
                    ? 'Your upcoming sessions from students will appear here'
                    : 'Book your first free mentorship session to get started'}
            </Text>
            {!isMentor && filter === 'all' && (
                <TouchableOpacity style={styles.bookNowBtn} onPress={() => navigation.navigate('MentorList')} activeOpacity={0.85}>
                    <Text style={styles.bookNowBtnText}>Find a Mentor</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) return (
        <View style={[styles.loadingContainer, { paddingTop: insets.top, backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={BRAND} />
        </View>
    );

    // ── Stats Banner ────────────────────────────────────────────────────────
    const totalCount = bookings.length;
    const upcomingCount = bookings.filter(
        (b) => b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'pending'
    ).length;

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
            <View style={[styles.pageHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.pageTitle, { color: theme.text }]}>
                    {isMentor ? 'Mentor Sessions' : 'My Bookings'}
                </Text>
                <TouchableOpacity style={[styles.refreshIconBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]} onPress={fetchBookings}>
                    <Ionicons name="refresh-outline" size={20} color={theme.text} />
                </TouchableOpacity>
            </View>

            {totalCount > 0 && (
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderTopColor: BRAND }]}>
                        <Text style={[styles.statValue, { color: theme.text }]}>{totalCount}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderTopColor: '#10B981' }]}>
                        <Text style={[styles.statValue, { color: theme.text }]}>{upcomingCount}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Upcoming</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderTopColor: '#6366F1' }]}>
                        <Text style={[styles.statValue, { color: theme.text }]}>
                            {bookings.filter((b) => b.status?.toLowerCase() === 'completed').length}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completed</Text>
                    </View>
                </View>
            )}

            <View style={[styles.filterTabsWrap, { borderBottomColor: theme.border }]}>
                <FlatList
                    horizontal
                    data={FILTERS}
                    keyExtractor={(f) => f}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterTabs}
                    renderItem={({ item: f }) => {
                        const count = f === 'all' ? bookings.length : bookings.filter((b) => b.status?.toLowerCase() === f).length;
                        const active = filter === f;
                        return (
                            <TouchableOpacity
                                style={[styles.filterTab, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND : theme.surface }]}
                                onPress={() => setFilter(f)}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.filterTabText, { color: active ? '#fff' : theme.textSecondary }]}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
                                <View style={[styles.filterTabBadge, { backgroundColor: active ? 'rgba(255,255,255,0.3)' : theme.border }]}>
                                    <Text style={[styles.filterTabBadgeText, { color: active ? '#fff' : theme.textSecondary }]}>{count}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <FlatList
                data={filteredBookings}
                keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
                renderItem={renderBookingCard}
                ListEmptyComponent={ListEmpty}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} colors={[BRAND]} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />

            {/* Rating modal */}
            <Modal visible={!!ratingModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modal, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Rate Your Session</Text>
                        <Text style={[styles.modalSub, { color: theme.textMuted }]}>with {ratingModal?.name}</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={36} color={s <= rating ? '#F59E0B' : theme.border} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.surfaceAlt }]} onPress={() => setRatingModal(null)}>
                                <Text style={[styles.modalBtnText, { color: theme.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: BRAND, opacity: rating === 0 ? 0.5 : 1 }]} onPress={submitRating} disabled={!rating || submittingRating}>
                                {submittingRating ? <ActivityIndicator color="#fff" /> : <Text style={[styles.modalBtnText, { color: '#fff' }]}>Submit</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
    pageTitle: { fontSize: 24, fontWeight: '800' },
    refreshIconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginVertical: 10 },
    statBox: { flex: 1, borderRadius: 14, padding: 10, alignItems: 'center', borderWidth: 1, borderTopWidth: 3 },
    statValue: { fontSize: 20, fontWeight: '900' },
    statLabel: { fontSize: 11, marginTop: 2 },
    filterTabsWrap: { borderBottomWidth: 1 },
    filterTabs: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
    filterTab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
    filterTabText: { fontSize: 13, fontWeight: '600' },
    filterTabBadge: { borderRadius: 20, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
    filterTabBadgeText: { fontSize: 11, fontWeight: '700' },
    listContent: { padding: 16, paddingBottom: 100, flexGrow: 1 },
    bookingCard: { borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, gap: 12 },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    personAvatar: { width: 50, height: 50, borderRadius: 25 },
    personAvatarPlaceholder: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    personAvatarInitial: { fontSize: 20, fontWeight: '900', color: '#fff' },
    cardHeaderInfo: { flex: 1, gap: 3 },
    personName: { fontSize: 15, fontWeight: '700' },
    sessionTitle: { fontSize: 13 },
    statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
    detailsContainer: { borderRadius: 12, padding: 12, gap: 8 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailText: { fontSize: 13, fontWeight: '500' },
    actionRow: { flexDirection: 'row', gap: 10 },
    joinBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: BRAND, paddingVertical: 11, borderRadius: 12 },
    joinBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    cancelBtn: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444' },
    cancelBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
    rateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: BRAND, borderRadius: 12, paddingVertical: 10 },
    rateBtnText: { color: BRAND, fontWeight: '700', fontSize: 14 },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 10 },
    emptyTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
    emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
    bookNowBtn: { marginTop: 10, backgroundColor: BRAND, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
    bookNowBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    // Rating modal
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center' },
    modal: { width: '88%', borderRadius: 20, padding: 24, gap: 14, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    modalSub: { fontSize: 14 },
    starsRow: { flexDirection: 'row', gap: 10, paddingVertical: 8 },
    modalBtns: { flexDirection: 'row', gap: 10, width: '100%' },
    modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    modalBtnText: { fontSize: 15, fontWeight: '700' },
});

export default MyBookingsScreen;
