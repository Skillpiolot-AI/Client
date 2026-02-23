// screens/admin/MentorApplicationsScreen.js — Phase 5
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, ActivityIndicator, Alert, TextInput, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mentorshipAPI } from '../../services/mentorshipAPI';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const FILTERS = ['Pending', 'Approved', 'Rejected'];
const STATUS_COLORS = {
    pending: { color: colors.warning, bg: colors.warningBg || '#FFFBEB', label: 'Pending' },
    approved: { color: colors.success, bg: colors.successBg || '#ECFDF5', label: 'Approved' },
    rejected: { color: colors.error, bg: colors.errorBg || '#FEF2F2', label: 'Rejected' },
};

const StatusBadge = ({ status }) => {
    const meta = STATUS_COLORS[status] || STATUS_COLORS.pending;
    return (
        <View style={[styles.badge, { backgroundColor: meta.bg }]}>
            <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
        </View>
    );
};

const MentorApplicationsScreen = ({ navigation }) => {
    const [applications, setApplications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Pending');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [rejectModal, setRejectModal] = useState(null); // { id }
    const [reason, setReason] = useState('');

    const load = useCallback(async () => {
        try {
            const res = await mentorshipAPI.getMentorApplications?.();
            const list = res?.applications || res?.data || res || [];
            setApplications(list);
        } catch {
            setApplications([]);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const filtered = applications.filter((a) =>
        (a.status || 'pending').toLowerCase() === activeFilter.toLowerCase()
    );

    const handleApprove = async (id) => {
        try {
            await mentorshipAPI.updateApplicationStatus?.(id, 'approved');
            setApplications((prev) => prev.map((a) => a._id === id ? { ...a, status: 'approved' } : a));
        } catch { Alert.alert('Error', 'Could not approve application.'); }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        try {
            await mentorshipAPI.updateApplicationStatus?.(rejectModal.id, 'rejected', reason);
            setApplications((prev) => prev.map((a) => a._id === rejectModal.id ? { ...a, status: 'rejected' } : a));
        } catch { Alert.alert('Error', 'Could not reject application.'); }
        setRejectModal(null);
        setReason('');
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{(item.name || '?')[0].toUpperCase()}</Text>
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.name || 'Applicant'}</Text>
                    <Text style={styles.cardRole} numberOfLines={1}>{item.jobTitle || item.tagline || ''}</Text>
                    <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <StatusBadge status={item.status || 'pending'} />
            </View>
            {item.bio ? <Text style={styles.cardBio} numberOfLines={2}>{item.bio}</Text> : null}
            {item.expertise?.length > 0 && (
                <View style={styles.chipRow}>
                    {item.expertise.slice(0, 3).map((e, i) => (
                        <View key={i} style={styles.chip}><Text style={styles.chipText}>{e}</Text></View>
                    ))}
                </View>
            )}
            {(item.status || 'pending') === 'pending' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleApprove(item._id)}
                    >
                        <Ionicons name="checkmark" size={16} color={colors.white} />
                        <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => setRejectModal({ id: item._id })}
                    >
                        <Ionicons name="close" size={16} color={colors.error} />
                        <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mentor Applications</Text>
            </View>

            {/* Filter tabs */}
            <View style={styles.filterRow}>
                {FILTERS.map((f) => {
                    const count = applications.filter((a) => (a.status || 'pending').toLowerCase() === f.toLowerCase()).length;
                    return (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
                            onPress={() => setActiveFilter(f)}
                        >
                            <Text style={[styles.filterLabel, activeFilter === f && styles.filterLabelActive]}>
                                {f} {count > 0 ? `(${count})` : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} /> : (
                <FlatList
                    data={filtered}
                    keyExtractor={(i) => i._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
                    ListEmptyComponent={<View style={styles.emptyWrap}><Ionicons name="document-text-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>No {activeFilter.toLowerCase()} applications</Text></View>}
                />
            )}

            {/* Reject reason modal */}
            <Modal visible={!!rejectModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Reject Application</Text>
                        <Text style={styles.modalSub}>Provide a reason (optional)</Text>
                        <TextInput
                            style={styles.reasonInput}
                            placeholder="Reason for rejection…"
                            placeholderTextColor={colors.textMuted}
                            value={reason}
                            onChangeText={setReason}
                            multiline
                        />
                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setRejectModal(null); setReason(''); }}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmRejectBtn} onPress={handleReject}>
                                <Text style={styles.confirmRejectText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
    backBtn: { width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
    headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    filterRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
    filterTab: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, backgroundColor: colors.surface, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
    filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary },
    filterLabelActive: { color: colors.white },
    list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    card: { backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder, gap: spacing.sm, ...shadows.xs },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
    cardInfo: { flex: 1 },
    cardName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
    cardRole: { fontSize: fontSize.sm, color: colors.textSecondary },
    cardDate: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
    badge: { borderRadius: borderRadius.full, paddingHorizontal: spacing.sm + 2, paddingVertical: 3 },
    badgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
    cardBio: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
    chipText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: fontWeight.medium },
    actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, borderRadius: borderRadius.lg },
    approveBtn: { backgroundColor: colors.success },
    approveBtnText: { color: colors.white, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
    rejectBtn: { backgroundColor: colors.errorBg || '#FEF2F2', borderWidth: 1, borderColor: colors.error },
    rejectBtnText: { color: colors.error, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
    emptyText: { fontSize: fontSize.md, color: colors.textMuted },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center' },
    modal: { width: '88%', backgroundColor: colors.white, borderRadius: borderRadius.xxl, padding: spacing.lg, gap: spacing.md },
    modalTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    modalSub: { fontSize: fontSize.sm, color: colors.textSecondary },
    reasonInput: { borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md, fontSize: fontSize.md, color: colors.text, minHeight: 80, textAlignVertical: 'top' },
    modalBtns: { flexDirection: 'row', gap: spacing.sm },
    cancelBtn: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.lg, backgroundColor: colors.surface, alignItems: 'center' },
    cancelBtnText: { fontWeight: fontWeight.semibold, color: colors.textSecondary },
    confirmRejectBtn: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.lg, backgroundColor: colors.error, alignItems: 'center' },
    confirmRejectText: { fontWeight: fontWeight.bold, color: colors.white },
});

export default MentorApplicationsScreen;
