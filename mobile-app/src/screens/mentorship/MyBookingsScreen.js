// My Bookings Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Avatar, Badge, Loading, Button } from '../../components/ui';
import { Header } from '../../components/layout';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';

const MyBookingsScreen = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const response = await mentorshipAPI.getMyBookings();
            setBookings(response.data || response || []);
        } catch (error) {
            console.log('Error:', error);
        }
        setLoading(false);
    };

    const onRefresh = async () => { setRefreshing(true); await fetchBookings(); setRefreshing(false); };

    const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'info';
        }
    };

    const handleCancel = async (id) => {
        Alert.alert('Cancel Booking', 'Are you sure?', [
            { text: 'No' },
            {
                text: 'Yes', onPress: async () => {
                    try { await mentorshipAPI.cancelBooking(id); fetchBookings(); } catch (e) { Alert.alert('Error', 'Could not cancel'); }
                }
            }
        ]);
    };

    const renderBooking = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.row}>
                <Avatar source={item.mentor?.profileImage} name={item.mentor?.name} size="md" />
                <View style={styles.info}>
                    <Text style={styles.name}>{item.mentor?.name || 'Mentor'}</Text>
                    <Text style={styles.date}><Ionicons name="calendar" size={12} color={colors.textSecondary} /> {new Date(item.date).toLocaleDateString()}</Text>
                    <Text style={styles.time}><Ionicons name="time" size={12} color={colors.textSecondary} /> {item.time}</Text>
                </View>
                <Badge text={item.status} variant={getStatusColor(item.status)} size="sm" />
            </View>
            {item.status === 'confirmed' && item.meetingLink && (
                <Button title="Join Meeting" variant="gradient" size="sm" onPress={() => { }} style={styles.joinBtn} />
            )}
            {item.status === 'pending' && (
                <Button title="Cancel" variant="outline" size="sm" onPress={() => handleCancel(item._id)} style={styles.cancelBtn} />
            )}
        </Card>
    );

    if (loading) return <Loading fullScreen />;

    return (
        <View style={styles.container}>
            <Header title="My Bookings" showBack />
            <View style={styles.filters}>
                {['all', 'confirmed', 'pending', 'completed'].map(f => (
                    <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <FlatList
                data={filteredBookings}
                keyExtractor={(item) => item._id}
                renderItem={renderBooking}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                ListEmptyComponent={<View style={styles.empty}><Ionicons name="calendar-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>No bookings found</Text></View>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    filters: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
    filterBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, backgroundColor: colors.surface, borderRadius: borderRadius.full },
    filterActive: { backgroundColor: colors.primary },
    filterText: { fontSize: fontSize.sm, color: colors.textSecondary },
    filterTextActive: { color: colors.white },
    list: { padding: spacing.md, paddingBottom: 100 },
    card: { marginBottom: spacing.md },
    row: { flexDirection: 'row', alignItems: 'center' },
    info: { flex: 1, marginLeft: spacing.md },
    name: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
    date: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
    time: { fontSize: fontSize.sm, color: colors.textSecondary },
    joinBtn: { marginTop: spacing.md },
    cancelBtn: { marginTop: spacing.md },
    empty: { alignItems: 'center', padding: spacing.xxl },
    emptyText: { fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.md },
});

export default MyBookingsScreen;
