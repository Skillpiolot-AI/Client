// Book Session Screen - White Theme with FREE Badge
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Avatar, Button } from '../../components/ui';
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
    success: '#10B981',
    border: '#E5E7EB',
    white: '#FFFFFF',
};

const BookSessionScreen = ({ navigation, route }) => {
    const { mentor } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(60);
    const [remark, setRemark] = useState('');
    const [topics, setTopics] = useState('');

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return {
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' })
        };
    });

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const durations = [
        { value: 30, label: '30 min' },
        { value: 60, label: '1 hour' },
        { value: 90, label: '1.5 hours' },
    ];

    const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Missing Information', 'Please select both date and time for your session');
            return;
        }

        setLoading(true);
        try {
            // Create ISO datetime string
            const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

            // Prepare booking data
            const bookingData = {
                mentorProfileId: mentor?._id || mentor?.profileId,
                scheduledAt,
                duration: selectedDuration,
                remark: remark.trim() || undefined,
                topics: topics.trim() ? topics.split(',').map(t => t.trim()) : undefined,
            };

            const response = await mentorshipAPI.bookSession(bookingData);

            Alert.alert(
                '🎉 Session Booked!',
                `Your FREE mentorship session has been ${response.booking?.status === 'confirmed' ? 'confirmed' : 'submitted'}!\n\nBooking ID: ${response.booking?.bookingId}\n\nA Jitsi meeting link has been sent to your email.`,
                [{ text: 'View Bookings', onPress: () => navigation.replace('MyBookings') }]
            );
        } catch (error) {
            console.error('Booking error:', error);
            Alert.alert(
                'Booking Failed',
                error.response?.data?.error || error.message || 'Unable to book session. Please try again.'
            );
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={whiteTheme.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Session</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Mentor Card */}
                <View style={styles.mentorCard}>
                    <Avatar source={mentor?.profileImage} name={mentor?.displayName || mentor?.name} size="lg" />
                    <View style={styles.mentorInfo}>
                        <Text style={styles.mentorName}>{mentor?.displayName || mentor?.name}</Text>
                        <Text style={styles.mentorTitle}>{mentor?.tagline || mentor?.expertise}</Text>
                    </View>
                    <View style={styles.freeBadge}>
                        <Ionicons name="gift" size={14} color={whiteTheme.success} />
                        <Text style={styles.freeBadgeText}>FREE</Text>
                    </View>
                </View>

                {/* Free Session Notice */}
                <View style={styles.freeNotice}>
                    <Ionicons name="information-circle" size={20} color={whiteTheme.success} />
                    <Text style={styles.freeNoticeText}>
                        Mentorship sessions are currently FREE! Video call link will be auto-generated.
                    </Text>
                </View>

                {/* Select Date */}
                <Text style={styles.sectionTitle}>Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                    {dates.map((d) => (
                        <TouchableOpacity
                            key={d.date}
                            style={[styles.dateCard, selectedDate === d.date && styles.dateCardActive]}
                            onPress={() => setSelectedDate(d.date)}
                        >
                            <Text style={[styles.dateDay, selectedDate === d.date && styles.dateTextActive]}>{d.day}</Text>
                            <Text style={[styles.dateNum, selectedDate === d.date && styles.dateTextActive]}>{d.dayNum}</Text>
                            <Text style={[styles.dateMonth, selectedDate === d.date && styles.dateTextActive]}>{d.month}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Select Time */}
                <Text style={styles.sectionTitle}>Select Time</Text>
                <View style={styles.timeGrid}>
                    {timeSlots.map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.timeSlot, selectedTime === t && styles.timeSlotActive]}
                            onPress={() => setSelectedTime(t)}
                        >
                            <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]}>
                                {formatTime(t)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Duration */}
                <Text style={styles.sectionTitle}>Session Duration</Text>
                <View style={styles.durationRow}>
                    {durations.map((d) => (
                        <TouchableOpacity
                            key={d.value}
                            style={[styles.durationBtn, selectedDuration === d.value && styles.durationBtnActive]}
                            onPress={() => setSelectedDuration(d.value)}
                        >
                            <Text style={[styles.durationText, selectedDuration === d.value && styles.durationTextActive]}>
                                {d.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Topics */}
                <Text style={styles.sectionTitle}>Topics to Discuss</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Career guidance, resume review, interview prep..."
                    placeholderTextColor={whiteTheme.textMuted}
                    value={topics}
                    onChangeText={setTopics}
                />

                {/* Notes */}
                <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
                <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Any specific questions or areas you'd like to focus on..."
                    placeholderTextColor={whiteTheme.textMuted}
                    value={remark}
                    onChangeText={setRemark}
                    multiline
                    numberOfLines={3}
                />

                {/* Summary */}
                {selectedDate && selectedTime && (
                    <View style={styles.summary}>
                        <Text style={styles.summaryTitle}>Session Summary</Text>
                        <View style={styles.summaryRow}>
                            <Ionicons name="calendar-outline" size={18} color={whiteTheme.primary} />
                            <Text style={styles.summaryText}>
                                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Ionicons name="time-outline" size={18} color={whiteTheme.primary} />
                            <Text style={styles.summaryText}>{formatTime(selectedTime)} ({selectedDuration} minutes)</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Ionicons name="videocam-outline" size={18} color={whiteTheme.primary} />
                            <Text style={styles.summaryText}>Jitsi Video Call (link sent via email)</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Ionicons name="pricetag-outline" size={18} color={whiteTheme.success} />
                            <Text style={[styles.summaryText, { color: whiteTheme.success, fontWeight: '600' }]}>FREE SESSION</Text>
                        </View>
                    </View>
                )}

                {/* Book Button */}
                <TouchableOpacity
                    style={[styles.bookBtn, loading && styles.bookBtnDisabled]}
                    onPress={handleBook}
                    disabled={loading}
                >
                    <Text style={styles.bookBtnText}>
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteTheme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
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
    content: {
        padding: 16,
    },
    mentorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    mentorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    mentorName: {
        fontSize: 18,
        fontWeight: '700',
        color: whiteTheme.text,
    },
    mentorTitle: {
        fontSize: 14,
        color: whiteTheme.textSecondary,
        marginTop: 2,
    },
    freeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.success + '20',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    freeBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: whiteTheme.success,
    },
    freeNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.success + '15',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        gap: 10,
    },
    freeNoticeText: {
        flex: 1,
        fontSize: 13,
        color: whiteTheme.success,
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: whiteTheme.text,
        marginBottom: 12,
        marginTop: 8,
    },
    dateScroll: {
        marginBottom: 8,
    },
    dateCard: {
        width: 70,
        padding: 12,
        backgroundColor: whiteTheme.surface,
        borderRadius: 12,
        marginRight: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    dateCardActive: {
        borderColor: whiteTheme.primary,
        backgroundColor: whiteTheme.primary + '15',
    },
    dateDay: {
        fontSize: 12,
        color: whiteTheme.textMuted,
    },
    dateNum: {
        fontSize: 22,
        fontWeight: '700',
        color: whiteTheme.text,
        marginVertical: 4,
    },
    dateMonth: {
        fontSize: 11,
        color: whiteTheme.textSecondary,
    },
    dateTextActive: {
        color: whiteTheme.primary,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 8,
    },
    timeSlot: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: whiteTheme.surface,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeSlotActive: {
        borderColor: whiteTheme.primary,
        backgroundColor: whiteTheme.primary + '15',
    },
    timeText: {
        fontSize: 14,
        color: whiteTheme.textSecondary,
    },
    timeTextActive: {
        color: whiteTheme.primary,
        fontWeight: '600',
    },
    durationRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    durationBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: whiteTheme.surface,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    durationBtnActive: {
        borderColor: whiteTheme.primary,
        backgroundColor: whiteTheme.primary + '15',
    },
    durationText: {
        fontSize: 14,
        color: whiteTheme.textSecondary,
    },
    durationTextActive: {
        color: whiteTheme.primary,
        fontWeight: '600',
    },
    textInput: {
        backgroundColor: whiteTheme.surface,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: whiteTheme.text,
        borderWidth: 1,
        borderColor: whiteTheme.border,
        marginBottom: 8,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    summary: {
        backgroundColor: whiteTheme.primary + '10',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: whiteTheme.primary + '30',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: whiteTheme.text,
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    summaryText: {
        fontSize: 14,
        color: whiteTheme.text,
    },
    bookBtn: {
        backgroundColor: whiteTheme.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    bookBtnDisabled: {
        opacity: 0.7,
    },
    bookBtnText: {
        color: whiteTheme.white,
        fontSize: 17,
        fontWeight: '700',
    },
});

export default BookSessionScreen;
