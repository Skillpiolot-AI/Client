// BookSessionScreen.js — Premium redesign with useTheme()
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, TextInput, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import mentorshipAPI from '../../services/mentorshipAPI';

const BRAND = '#5B5FEF';

const MentorAvatar = ({ mentor, size = 48 }) => {
    const colorList = ['#5B5FEF', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    const color = colorList[(mentor?.displayName || mentor?.name || '?').charCodeAt(0) % colorList.length];
    const initial = (mentor?.displayName || mentor?.name || '?').charAt(0).toUpperCase();
    if (mentor?.profileImage || mentor?.avatar) {
        return <Image source={{ uri: mentor?.profileImage || mentor?.avatar }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
    }
    return (
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: size * 0.4, fontWeight: '800', color: '#fff' }}>{initial}</Text>
        </View>
    );
};

const formatTime = (t) => {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};

export default function BookSessionScreen({ navigation, route }) {
    const { mentor } = route.params || {};
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(60);
    const [topics, setTopics] = useState('');
    const [remark, setRemark] = useState('');

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return {
            date: d.toISOString().split('T')[0],
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' }),
        };
    });

    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    const durations = [{ value: 30, label: '30 min' }, { value: 60, label: '1 hour' }, { value: 90, label: '1.5 hrs' }];

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Missing Info', 'Please select a date and time for your session.');
            return;
        }
        setLoading(true);
        try {
            const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
            const res = await mentorshipAPI.bookSession({
                mentorProfileId: mentor?.mentorProfileId || mentor?.id || mentor?._id,
                scheduledAt,
                duration: selectedDuration,
                remark: remark.trim() || undefined,
                topics: topics.trim() ? topics.split(',').map(t => t.trim()) : undefined,
            });
            Alert.alert(
                '🎉 Session Booked!',
                `Your session has been ${res.booking?.status === 'confirmed' ? 'confirmed' : 'submitted'}!\n\nBooking ID: ${res.booking?.bookingId}\n\nA meeting link has been sent to your email.`,
                [{ text: 'View Bookings', onPress: () => navigation.replace('MyBookings') }]
            );
        } catch (err) {
            Alert.alert('Booking Failed', err.response?.data?.error || err.message || 'Unable to book. Please try again.');
        }
        setLoading(false);
    };

    const selectedDateObj = dates.find(d => d.date === selectedDate);

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surfaceAlt }]} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color={theme.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Book Session</Text>
                    <Text style={[styles.headerSub, { color: theme.textMuted }]}>with {mentor?.displayName || mentor?.name}</Text>
                </View>
                <MentorAvatar mentor={mentor} size={42} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: insets.bottom + 100 }}>

                {/* Mentor summary card */}
                <View style={[styles.mentorBanner, { backgroundColor: BRAND + '08', borderColor: BRAND + '20' }]}>
                    <MentorAvatar mentor={mentor} size={52} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.mentorName, { color: theme.text }]}>{mentor?.displayName || mentor?.name}</Text>
                        <Text style={[styles.mentorSub, { color: theme.textMuted }]} numberOfLines={1}>{mentor?.tagline || (mentor?.targetingDomains || []).join(' · ')}</Text>
                    </View>
                    <View style={styles.freePill}>
                        <Ionicons name="gift-outline" size={13} color="#10B981" />
                        <Text style={styles.freePillText}>FREE</Text>
                    </View>
                </View>

                {/* Info banner */}
                <View style={[styles.infoBanner, { backgroundColor: '#EEF2FF', borderColor: BRAND + '30' }]}>
                    <Ionicons name="information-circle-outline" size={18} color={BRAND} />
                    <Text style={[styles.infoText, { color: '#3730A3' }]}>All sessions are free. A video call link will be auto-generated and emailed to you.</Text>
                </View>

                {/* Date Selector */}
                <Text style={[styles.label, { color: theme.text }]}>Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 10 }}>
                    {dates.map(d => {
                        const active = selectedDate === d.date;
                        return (
                            <TouchableOpacity
                                key={d.date}
                                style={[styles.dateCard, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND : theme.card }]}
                                onPress={() => setSelectedDate(d.date)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.dateDay, { color: active ? 'rgba(255,255,255,0.8)' : theme.textMuted }]}>{d.day}</Text>
                                <Text style={[styles.dateNum, { color: active ? '#fff' : theme.text }]}>{d.dayNum}</Text>
                                <Text style={[styles.dateMonth, { color: active ? 'rgba(255,255,255,0.8)' : theme.textMuted }]}>{d.month}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Time Slots */}
                <Text style={[styles.label, { color: theme.text }]}>Select Time</Text>
                <View style={styles.timeGrid}>
                    {timeSlots.map(t => {
                        const active = selectedTime === t;
                        return (
                            <TouchableOpacity
                                key={t}
                                style={[styles.timeSlot, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND + '12' : theme.card }]}
                                onPress={() => setSelectedTime(t)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="time-outline" size={12} color={active ? BRAND : theme.textMuted} />
                                <Text style={[styles.timeText, { color: active ? BRAND : theme.textSecondary, fontWeight: active ? '700' : '500' }]}>{formatTime(t)}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Duration */}
                <Text style={[styles.label, { color: theme.text }]}>Session Duration</Text>
                <View style={styles.durationRow}>
                    {durations.map(d => {
                        const active = selectedDuration === d.value;
                        return (
                            <TouchableOpacity
                                key={d.value}
                                style={[styles.durationBtn, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND : theme.card }]}
                                onPress={() => setSelectedDuration(d.value)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="hourglass-outline" size={14} color={active ? '#fff' : theme.textMuted} />
                                <Text style={[styles.durationText, { color: active ? '#fff' : theme.textSecondary, fontWeight: active ? '700' : '500' }]}>{d.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Topics */}
                <Text style={[styles.label, { color: theme.text }]}>Topics to Discuss</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    placeholder="Career guidance, resume review, interview prep…"
                    placeholderTextColor={theme.textMuted}
                    value={topics}
                    onChangeText={setTopics}
                />

                {/* Notes */}
                <Text style={[styles.label, { color: theme.text }]}>Additional Notes (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    placeholder="Any specific questions or areas to focus on…"
                    placeholderTextColor={theme.textMuted}
                    value={remark}
                    onChangeText={setRemark}
                    multiline
                    numberOfLines={3}
                />

                {/* Summary */}
                {selectedDate && selectedTime && (
                    <View style={[styles.summary, { backgroundColor: BRAND + '08', borderColor: BRAND + '25' }]}>
                        <Text style={[styles.summaryTitle, { color: theme.text }]}>Session Summary</Text>
                        {[
                            { icon: 'calendar-outline', text: new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), color: BRAND },
                            { icon: 'time-outline', text: `${formatTime(selectedTime)} · ${selectedDuration} minutes`, color: BRAND },
                            { icon: 'videocam-outline', text: 'Video call link sent via email', color: BRAND },
                            { icon: 'pricetag-outline', text: 'FREE SESSION', color: '#10B981' },
                        ].map((row, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
                                <View style={[styles.summaryIcon, { backgroundColor: row.color + '15' }]}>
                                    <Ionicons name={row.icon} size={15} color={row.color} />
                                </View>
                                <Text style={[styles.summaryText, { color: theme.text, ...(row.color === '#10B981' ? { color: '#10B981', fontWeight: '700' } : {}) }]}>{row.text}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Sticky Book Button */}
            <View style={[styles.footerBar, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + 8 }]}>
                {selectedDate && selectedTime ? (
                    <View style={styles.footerMeta}>
                        <Text style={[styles.footerDateText, { color: theme.text }]}>
                            {selectedDateObj?.day} {selectedDateObj?.dayNum} {selectedDateObj?.month}
                        </Text>
                        <Text style={[styles.footerTimeText, { color: theme.textMuted }]}>at {formatTime(selectedTime)} · {selectedDuration}min</Text>
                    </View>
                ) : (
                    <Text style={[{ fontSize: 13, color: theme.textMuted }]}>Select a date & time to continue</Text>
                )}
                <TouchableOpacity
                    style={[styles.bookBtn, (!selectedDate || !selectedTime) && { opacity: 0.5 }]}
                    onPress={handleBook}
                    disabled={loading || !selectedDate || !selectedTime}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <Text style={styles.bookBtnText}>Booking…</Text>
                    ) : (
                        <>
                            <Text style={styles.bookBtnText}>Confirm</Text>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    backBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800' },
    headerSub: { fontSize: 12, marginTop: 1 },
    mentorBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
    mentorName: { fontSize: 15, fontWeight: '700' },
    mentorSub: { fontSize: 13, marginTop: 2 },
    freePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#10B981' + '15', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    freePillText: { fontSize: 12, fontWeight: '800', color: '#10B981' },
    infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 20 },
    infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
    label: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
    dateCard: { width: 66, paddingVertical: 12, borderRadius: 18, alignItems: 'center', borderWidth: 1.5, gap: 2 },
    dateDay: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
    dateNum: { fontSize: 22, fontWeight: '900' },
    dateMonth: { fontSize: 11, fontWeight: '600' },
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    timeSlot: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5 },
    timeText: { fontSize: 13 },
    durationRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    durationBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5 },
    durationText: { fontSize: 14 },
    input: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, borderWidth: 1, marginBottom: 16 },
    textArea: { height: 90, textAlignVertical: 'top' },
    summary: { borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 16 },
    summaryTitle: { fontSize: 15, fontWeight: '700' },
    summaryIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    summaryText: { fontSize: 13, flex: 1 },
    footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
    footerMeta: { flex: 1 },
    footerDateText: { fontSize: 14, fontWeight: '700' },
    footerTimeText: { fontSize: 12, marginTop: 1 },
    bookBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: BRAND, paddingHorizontal: 22, paddingVertical: 13, borderRadius: 26, shadowColor: BRAND, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
    bookBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
