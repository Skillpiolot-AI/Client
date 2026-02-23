// BookSessionScreen.js — Centralized-theme refactor
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Avatar, Button } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';

const BookSessionScreen = ({ navigation, route }) => {
    const { mentor } = route.params || {};
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(60);
    const [remark, setRemark] = useState('');
    const [topics, setTopics] = useState('');

    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return {
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
        };
    });

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00', '18:00',
    ];

    const durations = [
        { value: 30, label: '30 min' },
        { value: 60, label: '1 hour' },
        { value: 90, label: '1.5 hrs' },
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
            Alert.alert('Missing Information', 'Please select both a date and time for your session.');
            return;
        }
        setLoading(true);
        try {
            const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
            const bookingData = {
                mentorProfileId: mentor?.mentorProfileId || mentor?.id || mentor?._id,
                scheduledAt,
                duration: selectedDuration,
                remark: remark.trim() || undefined,
                topics: topics.trim() ? topics.split(',').map((t) => t.trim()) : undefined,
            };
            const response = await mentorshipAPI.bookSession(bookingData);
            Alert.alert(
                '🎉 Session Booked!',
                `Your FREE mentorship session has been ${response.booking?.status === 'confirmed' ? 'confirmed' : 'submitted'}!\n\nBooking ID: ${response.booking?.bookingId}\n\nA Jitsi meeting link has been sent to your email.`,
                [{ text: 'View Bookings', onPress: () => navigation.replace('MyBookings') }]
            );
        } catch (error) {
            Alert.alert(
                'Booking Failed',
                error.response?.data?.error || error.message || 'Unable to book session. Please try again.'
            );
        }
        setLoading(false);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
                    <Ionicons name="chevron-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Session</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* ── Mentor Card ── */}
                <View style={styles.mentorCard}>
                    <Avatar source={mentor?.profileImage} name={mentor?.displayName || mentor?.name} size="lg" />
                    <View style={styles.mentorInfo}>
                        <Text style={styles.mentorName}>{mentor?.displayName || mentor?.name}</Text>
                        <Text style={styles.mentorTitle} numberOfLines={1}>
                            {mentor?.tagline || mentor?.expertise}
                        </Text>
                    </View>
                    <View style={styles.freeBadge}>
                        <Ionicons name="gift-outline" size={13} color={colors.success} />
                        <Text style={styles.freeBadgeText}>FREE</Text>
                    </View>
                </View>

                {/* ── Free Notice ── */}
                <View style={styles.freeNotice}>
                    <Ionicons name="information-circle-outline" size={20} color={colors.success} />
                    <Text style={styles.freeNoticeText}>
                        All mentorship sessions are currently FREE. A video call link will be auto-generated.
                    </Text>
                </View>

                <View style={styles.body}>
                    {/* ── Select Date ── */}
                    <Text style={styles.sectionLabel}>Select Date</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                        {dates.map((d) => (
                            <TouchableOpacity
                                key={d.date}
                                style={[styles.dateCard, selectedDate === d.date && styles.dateCardActive]}
                                onPress={() => setSelectedDate(d.date)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.dateDay, selectedDate === d.date && styles.dateTextActive]}>
                                    {d.day}
                                </Text>
                                <Text style={[styles.dateNum, selectedDate === d.date && styles.dateTextActive]}>
                                    {d.dayNum}
                                </Text>
                                <Text style={[styles.dateMonth, selectedDate === d.date && styles.dateTextActive]}>
                                    {d.month}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* ── Select Time ── */}
                    <Text style={styles.sectionLabel}>Select Time</Text>
                    <View style={styles.timeGrid}>
                        {timeSlots.map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.timeSlot, selectedTime === t && styles.timeSlotActive]}
                                onPress={() => setSelectedTime(t)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]}>
                                    {formatTime(t)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ── Duration ── */}
                    <Text style={styles.sectionLabel}>Session Duration</Text>
                    <View style={styles.durationRow}>
                        {durations.map((d) => (
                            <TouchableOpacity
                                key={d.value}
                                style={[styles.durationBtn, selectedDuration === d.value && styles.durationBtnActive]}
                                onPress={() => setSelectedDuration(d.value)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.durationText, selectedDuration === d.value && styles.durationTextActive]}>
                                    {d.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ── Topics ── */}
                    <Text style={styles.sectionLabel}>Topics to Discuss</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Career guidance, resume review, interview prep..."
                        placeholderTextColor={colors.textMuted}
                        value={topics}
                        onChangeText={setTopics}
                    />

                    {/* ── Notes ── */}
                    <Text style={styles.sectionLabel}>Additional Notes (Optional)</Text>
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="Any specific questions or areas you'd like to focus on..."
                        placeholderTextColor={colors.textMuted}
                        value={remark}
                        onChangeText={setRemark}
                        multiline
                        numberOfLines={3}
                    />

                    {/* ── Summary ── */}
                    {selectedDate && selectedTime && (
                        <View style={styles.summary}>
                            <Text style={styles.summaryTitle}>Session Summary</Text>
                            {[
                                {
                                    icon: 'calendar-outline',
                                    text: new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'long', day: 'numeric',
                                    }),
                                },
                                { icon: 'time-outline', text: `${formatTime(selectedTime)} · ${selectedDuration} minutes` },
                                { icon: 'videocam-outline', text: 'Jitsi Video Call (link via email)' },
                                { icon: 'pricetag-outline', text: 'FREE SESSION', highlight: true },
                            ].map((row, i) => (
                                <View key={i} style={styles.summaryRow}>
                                    <Ionicons
                                        name={row.icon}
                                        size={17}
                                        color={row.highlight ? colors.success : colors.primary}
                                    />
                                    <Text style={[styles.summaryText, row.highlight && { color: colors.success, fontWeight: fontWeight.bold }]}>
                                        {row.text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* ── Book Button ── */}
                    <Button
                        title={loading ? 'Booking...' : 'Confirm Booking'}
                        variant="primary"
                        onPress={handleBook}
                        loading={loading}
                        size="lg"
                        style={styles.bookBtn}
                    />

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    scroll: {
        flex: 1,
    },
    // ── Mentor Card ───────────────────────────────
    mentorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        padding: spacing.md,
        gap: spacing.md,
    },
    mentorInfo: {
        flex: 1,
    },
    mentorName: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    mentorTitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    freeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.successBg,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 5,
        borderRadius: borderRadius.full,
    },
    freeBadgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.success,
    },
    // ── Free notice ───────────────────────────────
    freeNotice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        backgroundColor: colors.successBg,
        padding: spacing.md,
    },
    freeNoticeText: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.successDark,
        lineHeight: 18,
    },
    // ── Body ──────────────────────────────────────
    body: {
        padding: spacing.md,
    },
    sectionLabel: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    // ── Date carousel ─────────────────────────────
    dateScroll: {
        marginBottom: spacing.xs,
    },
    dateCard: {
        width: 64,
        paddingVertical: spacing.sm + 2,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginRight: spacing.sm,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    dateCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryBg,
    },
    dateDay: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        fontWeight: fontWeight.medium,
    },
    dateNum: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
        marginVertical: 2,
    },
    dateMonth: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    dateTextActive: {
        color: colors.primary,
    },
    // ── Time Grid ────────────────────────────────
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.xs,
    },
    timeSlot: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    timeSlotActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryBg,
    },
    timeText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    timeTextActive: {
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    // ── Duration ─────────────────────────────────
    durationRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xs,
    },
    durationBtn: {
        flex: 1,
        paddingVertical: spacing.sm + 2,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    durationBtnActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryBg,
    },
    durationText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    durationTextActive: {
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    // ── Text Inputs ───────────────────────────────
    textInput: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        fontSize: fontSize.md,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xs,
    },
    textArea: {
        height: 90,
        textAlignVertical: 'top',
    },
    // ── Summary ───────────────────────────────────
    summary: {
        backgroundColor: colors.primaryBg,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginTop: spacing.md,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
        gap: spacing.sm,
    },
    summaryTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    summaryText: {
        fontSize: fontSize.sm,
        color: colors.text,
        flex: 1,
    },
    // ── Book Button ───────────────────────────────
    bookBtn: {
        marginTop: spacing.lg,
        borderRadius: borderRadius.xl,
        ...shadows.primary,
    },
});

export default BookSessionScreen;
