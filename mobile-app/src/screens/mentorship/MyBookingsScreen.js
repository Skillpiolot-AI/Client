// My Bookings Screen - White Theme
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, Alert, Image, ActivityIndicator, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';

// White Theme Colors
const whiteTheme = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#FF6B35',
    primaryLight: '#FF6B3520',
    success: '#10B981',
    successLight: '#10B98120',
    warning: '#F59E0B',
    warningLight: '#F59E0B20',
    error: '#EF4444',
    errorLight: '#EF444420',
    border: '#E5E7EB',
    white: '#FFFFFF',
};

const MyBookingsScreen = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await mentorshipAPI.getMyBookings();
            // API returns: { bookings: [...] } or just array
            console.log('Bookings response keys:', Object.keys(response || {}));
            const bookingData = response?.bookings || response?.data?.bookings || response || [];
            console.log('Bookings count:', bookingData.length);
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
        : bookings.filter(b => b.status?.toLowerCase() === filter);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return { bg: whiteTheme.successLight, color: whiteTheme.success };
            case 'pending':
                return { bg: whiteTheme.warningLight, color: whiteTheme.warning };
            case 'cancelled':
                return { bg: whiteTheme.errorLight, color: whiteTheme.error };
            case 'completed':
                return { bg: whiteTheme.primaryLight, color: whiteTheme.primary };
            default:
                return { bg: whiteTheme.surface, color: whiteTheme.textSecondary };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleCancel = async (id) => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await mentorshipAPI.cancelBooking(id);
                            Alert.alert('Success', 'Booking cancelled successfully');
                            fetchBookings();
                        } catch (error) {
                            Alert.alert('Error', 'Could not cancel booking');
                        }
                    }
                }
            ]
        );
    };

    const handleJoinMeeting = (link) => {
        if (link) {
            Linking.openURL(link);
        } else {
            Alert.alert('No Link', 'Meeting link is not available yet');
        }
    };

    const renderBooking = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);

        // Backend populates: 
        // - mentorId with User: { name, email, imageUrl }
        // - mentorProfileId with MentorProfile: { displayName, tagline, profileImage }
        const mentorName = item.mentorProfileId?.displayName ||
            item.mentorId?.name ||
            item.mentor?.name ||
            'Mentor';
        const mentorImage = item.mentorProfileId?.profileImage ||
            item.mentorId?.imageUrl;

        // Use scheduledAt field (from backend) or fallback to date/time
        const sessionDate = item.scheduledAt || item.date;

        return (
            <View style={styles.card}>
                {/* Mentor Info Row */}
                <View style={styles.row}>
                    {mentorImage ? (
                        <Image source={{ uri: mentorImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {mentorName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}

                    <View style={styles.info}>
                        <Text style={styles.name}>{mentorName}</Text>
                        <View style={styles.dateRow}>
                            <Ionicons name="calendar-outline" size={14} color={whiteTheme.textSecondary} />
                            <Text style={styles.dateText}>{formatDate(sessionDate)}</Text>
                        </View>
                        <View style={styles.dateRow}>
                            <Ionicons name="time-outline" size={14} color={whiteTheme.textSecondary} />
                            <Text style={styles.dateText}>
                                {formatTime(sessionDate)} • {item.duration || 60} min
                            </Text>
                        </View>
                    </View>

                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending'}
                        </Text>
                    </View>
                </View>

                {/* Booking ID */}
                {item.bookingId && (
                    <View style={styles.bookingIdRow}>
                        <Ionicons name="ticket-outline" size={14} color={whiteTheme.textMuted} />
                        <Text style={styles.bookingId}>ID: {item.bookingId}</Text>
                    </View>
                )}

                {/* Topics if any */}
                {item.topics && item.topics.length > 0 && (
                    <View style={styles.topicsRow}>
                        <Text style={styles.topicsLabel}>Topics:</Text>
                        <Text style={styles.topicsText} numberOfLines={1}>
                            {item.topics.join(', ')}
                        </Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actions}>
                    {(item.status === 'confirmed' || item.status === 'pending') && item.meetingLink && (
                        <TouchableOpacity
                            style={styles.joinBtn}
                            onPress={() => handleJoinMeeting(item.meetingLink)}
                        >
                            <Ionicons name="videocam" size={18} color={whiteTheme.white} />
                            <Text style={styles.joinBtnText}>Join Meeting</Text>
                        </TouchableOpacity>
                    )}

                    {item.status === 'pending' && (
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => handleCancel(item._id)}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    )}

                    {item.status === 'completed' && !item.rating && (
                        <TouchableOpacity
                            style={styles.rateBtn}
                            onPress={() => navigation.navigate('RateMentor', { booking: item })}
                        >
                            <Ionicons name="star-outline" size={16} color={whiteTheme.primary} />
                            <Text style={styles.rateBtnText}>Rate Session</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    // Loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={whiteTheme.primary} />
                <Text style={styles.loadingText}>Loading bookings...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={whiteTheme.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filters}>
                {['all', 'pending', 'confirmed', 'completed'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, filter === f && styles.filterActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bookings List */}
            <FlatList
                data={filteredBookings}
                keyExtractor={(item) => item._id || item.bookingId || Math.random().toString()}
                renderItem={renderBooking}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={whiteTheme.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="calendar-outline" size={64} color={whiteTheme.textMuted} />
                        <Text style={styles.emptyTitle}>No Bookings Found</Text>
                        <Text style={styles.emptyText}>
                            {filter === 'all'
                                ? "You haven't booked any sessions yet"
                                : `No ${filter} bookings`}
                        </Text>
                        <TouchableOpacity
                            style={styles.browseBtn}
                            onPress={() => navigation.navigate('MentorList')}
                        >
                            <Text style={styles.browseBtnText}>Browse Mentors</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteTheme.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: whiteTheme.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: fontSize.md,
        color: whiteTheme.textSecondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: whiteTheme.white,
        borderBottomWidth: 1,
        borderBottomColor: whiteTheme.border,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: whiteTheme.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: whiteTheme.text,
    },
    filters: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
        backgroundColor: whiteTheme.white,
    },
    filterBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: whiteTheme.surface,
        borderRadius: 20,
    },
    filterActive: {
        backgroundColor: whiteTheme.primary,
    },
    filterText: {
        fontSize: 13,
        color: whiteTheme.textSecondary,
        fontWeight: '500',
    },
    filterTextActive: {
        color: whiteTheme.white,
    },
    list: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: whiteTheme.white,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: whiteTheme.surface,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: whiteTheme.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '700',
        color: whiteTheme.white,
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: whiteTheme.text,
        marginBottom: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    dateText: {
        fontSize: 13,
        color: whiteTheme.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    bookingIdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: whiteTheme.border,
    },
    bookingId: {
        fontSize: 12,
        color: whiteTheme.textMuted,
    },
    topicsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    topicsLabel: {
        fontSize: 13,
        color: whiteTheme.textSecondary,
        marginRight: 6,
    },
    topicsText: {
        flex: 1,
        fontSize: 13,
        color: whiteTheme.text,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: whiteTheme.border,
    },
    joinBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: whiteTheme.success,
        paddingVertical: 12,
        borderRadius: 10,
    },
    joinBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: whiteTheme.white,
    },
    cancelBtn: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: whiteTheme.errorLight,
        borderRadius: 10,
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: whiteTheme.error,
    },
    rateBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: whiteTheme.primaryLight,
        paddingVertical: 12,
        borderRadius: 10,
    },
    rateBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: whiteTheme.primary,
    },
    empty: {
        alignItems: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: whiteTheme.text,
        marginTop: spacing.md,
    },
    emptyText: {
        fontSize: 14,
        color: whiteTheme.textSecondary,
        marginTop: 6,
        textAlign: 'center',
    },
    browseBtn: {
        marginTop: spacing.lg,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: whiteTheme.primary,
        borderRadius: 10,
    },
    browseBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: whiteTheme.white,
    },
});

export default MyBookingsScreen;
