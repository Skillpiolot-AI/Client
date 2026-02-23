// MentorApplicationsScreen.js — Theme-aware via useTheme()
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, ActivityIndicator, Alert, TextInput, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mentorshipAPI } from '../../services/mentorshipAPI';
import { useTheme } from '../../context/ThemeContext';

const BRAND = '#5B5FEF';
const FILTERS = ['Pending', 'Approved', 'Rejected'];
const STATUS = {
    pending: { color: '#F59E0B', bg: '#FFFBEB', label: 'Pending' },
    approved: { color: '#10B981', bg: '#ECFDF5', label: 'Approved' },
    rejected: { color: '#EF4444', bg: '#FEF2F2', label: 'Rejected' },
};

export default function MentorApplicationsScreen({ navigation }) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [applications, setApplications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Pending');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [rejectModal, setRejectModal] = useState(null);
    const [reason, setReason] = useState('');

    const load = useCallback(async () => {
        try {
            const res = await mentorshipAPI.getMentorApplications?.();
            setApplications(res?.applications || res?.data || res || []);
        } catch { setApplications([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const filtered = applications.filter(a => (a.status || 'pending').toLowerCase() === activeFilter.toLowerCase());

    const handleApprove = async (id) => {
        try {
            await mentorshipAPI.updateApplicationStatus?.(id, 'approved');
            setApplications(prev => prev.map(a => a._id === id ? { ...a, status: 'approved' } : a));
        } catch { Alert.alert('Error', 'Could not approve application.'); }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        try {
            await mentorshipAPI.updateApplicationStatus?.(rejectModal.id, 'rejected', reason);
            setApplications(prev => prev.map(a => a._id === rejectModal.id ? { ...a, status: 'rejected' } : a));
        } catch { Alert.alert('Error', 'Could not reject application.'); }
        setRejectModal(null); setReason('');
    };

    const renderItem = ({ item }) => {
        const meta = STATUS[item.status || 'pending'] || STATUS.pending;
        return (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: BRAND + '18' }]}>
                        <Text style={[styles.avatarText, { color: BRAND }]}>{(item.name || '?')[0].toUpperCase()}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={[styles.cardName, { color: theme.text }]}>{item.name || 'Applicant'}</Text>
                        <Text style={[styles.cardRole, { color: theme.textSecondary }]} numberOfLines={1}>{item.jobTitle || item.tagline || ''}</Text>
                        <Text style={[styles.cardDate, { color: theme.textMuted }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
                        <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
                    </View>
                </View>
                {item.bio ? <Text style={[styles.cardBio, { color: theme.textSecondary }]} numberOfLines={2}>{item.bio}</Text> : null}
                {item.expertise?.length > 0 && (
                    <View style={styles.chipRow}>
                        {item.expertise.slice(0, 3).map((e, i) => (
                            <View key={i} style={[styles.chip, { backgroundColor: theme.surfaceAlt }]}>
                                <Text style={[styles.chipText, { color: theme.textSecondary }]}>{e}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {(item.status || 'pending') === 'pending' && (
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={() => handleApprove(item._id)}>
                            <Ionicons name="checkmark" size={15} color="#fff" />
                            <Text style={styles.greenBtnText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#EF4444' }]} onPress={() => setRejectModal({ id: item._id })}>
                            <Ionicons name="close" size={15} color="#EF4444" />
                            <Text style={[styles.redBtnText]}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surfaceAlt }]}>
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Mentor Applications</Text>
            </View>

            <View style={[styles.filterRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                {FILTERS.map(f => {
                    const count = applications.filter(a => (a.status || 'pending').toLowerCase() === f.toLowerCase()).length;
                    const isActive = activeFilter === f;
                    return (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterTab, { backgroundColor: isActive ? BRAND : theme.surfaceAlt }]}
                            onPress={() => setActiveFilter(f)}
                        >
                            <Text style={[styles.filterLabel, { color: isActive ? '#fff' : theme.textSecondary }]}>
                                {f}{count > 0 ? ` (${count})` : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {loading ? <ActivityIndicator color={BRAND} style={{ marginTop: 32 }} /> : (
                <FlatList
                    data={filtered}
                    keyExtractor={i => i._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} colors={[BRAND]} />}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Ionicons name="document-text-outline" size={48} color={theme.textMuted} />
                            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No {activeFilter.toLowerCase()} applications</Text>
                        </View>
                    }
                />
            )}

            <Modal visible={!!rejectModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modal, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Reject Application</Text>
                        <Text style={[styles.modalSub, { color: theme.textMuted }]}>Provide a reason (optional)</Text>
                        <TextInput
                            style={[styles.reasonInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surfaceAlt }]}
                            placeholder="Reason…"
                            placeholderTextColor={theme.textMuted}
                            value={reason}
                            onChangeText={setReason}
                            multiline
                        />
                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={[styles.footerBtn, { backgroundColor: theme.surfaceAlt }]} onPress={() => { setRejectModal(null); setReason(''); }}>
                                <Text style={[styles.footerBtnText, { color: theme.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.footerBtn, { backgroundColor: '#EF4444' }]} onPress={handleReject}>
                                <Text style={[styles.footerBtnText, { color: '#fff' }]}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
    backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    filterRow: { flexDirection: 'row', padding: 12, gap: 8, borderBottomWidth: 1 },
    filterTab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
    filterLabel: { fontSize: 13, fontWeight: '600' },
    list: { padding: 16, gap: 10, paddingBottom: 24 },
    card: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 20, fontWeight: '800' },
    cardInfo: { flex: 1 },
    cardName: { fontSize: 15, fontWeight: '700' },
    cardRole: { fontSize: 13 },
    cardDate: { fontSize: 12, marginTop: 2 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 11, fontWeight: '700' },
    cardBio: { fontSize: 13, lineHeight: 20 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    chipText: { fontSize: 11, fontWeight: '600' },
    actionRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
    greenBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    redBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText: { fontSize: 15 },
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center' },
    modal: { width: '88%', borderRadius: 20, padding: 20, gap: 14 },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    modalSub: { fontSize: 13 },
    reasonInput: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
    modalBtns: { flexDirection: 'row', gap: 10 },
    footerBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    footerBtnText: { fontWeight: '700', fontSize: 14 },
});
