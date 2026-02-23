// screens/admin/UpdatesScreen.js — Phase 5
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, ActivityIndicator, Alert, TextInput, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { adminAPI } from '../../services/adminAPI';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const timeAgo = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
};

const UpdatesScreen = ({ navigation }) => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [creating, setCreating] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await adminAPI.getUpdates();
            const list = res?.updates || res?.data || res || [];
            setUpdates(Array.isArray(list) ? list : []);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const handleCreate = async () => {
        if (!title.trim()) { Alert.alert('Error', 'Title is required.'); return; }
        setCreating(true);
        try {
            const res = await adminAPI.createUpdate({ title: title.trim(), body: body.trim() });
            const newUpdate = res?.update || res?.data || { _id: Date.now().toString(), title: title.trim(), body: body.trim(), createdAt: new Date().toISOString() };
            setUpdates((prev) => [newUpdate, ...prev]);
            setModalVisible(false);
            setTitle(''); setBody('');
        } catch { Alert.alert('Error', 'Could not create update.'); }
        finally { setCreating(false); }
    };

    const handleDelete = (id, updateTitle) => {
        Alert.alert('Delete Update', `Remove "${updateTitle}"?`, [
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    try {
                        await adminAPI.deleteUpdate(id);
                        setUpdates((prev) => prev.filter((u) => u._id !== id));
                    } catch { Alert.alert('Error', 'Could not delete update.'); }
                }
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardIconWrap}>
                    <Ionicons name="megaphone-outline" size={20} color={colors.primary} />
                </View>
                <View style={styles.cardMeta}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardDate}>{timeAgo(item.createdAt)}</Text>
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id, item.title)}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
            </View>
            {item.body ? <Text style={styles.cardBody} numberOfLines={3}>{item.body}</Text> : null}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>App Updates</Text>
                <View style={styles.countChip}>
                    <Text style={styles.countChipText}>{updates.length}</Text>
                </View>
            </View>

            {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} /> : (
                <FlatList
                    data={updates}
                    keyExtractor={(u) => u._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Ionicons name="megaphone-outline" size={48} color={colors.textMuted} />
                            <Text style={styles.emptyText}>No updates yet</Text>
                            <Text style={styles.emptySub}>Tap + to create your first announcement</Text>
                        </View>
                    }
                />
            )}

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
                <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.fabGradient}>
                    <Ionicons name="add" size={26} color={colors.white} />
                </LinearGradient>
            </TouchableOpacity>

            {/* Create modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Update</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setTitle(''); setBody(''); }}>
                                <Ionicons name="close" size={22} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.inputField}
                            placeholder="Title *"
                            placeholderTextColor={colors.textMuted}
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={[styles.inputField, styles.inputMulti]}
                            placeholder="Message (optional)"
                            placeholderTextColor={colors.textMuted}
                            value={body}
                            onChangeText={setBody}
                            multiline
                        />
                        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={creating}>
                            {creating
                                ? <ActivityIndicator color={colors.white} />
                                : <Text style={styles.createBtnText}>Publish Update</Text>
                            }
                        </TouchableOpacity>
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
    headerTitle: { flex: 1, fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    countChip: { backgroundColor: colors.primaryBg, borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
    countChipText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.primary },
    list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 100 },
    card: { backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder, gap: spacing.sm, ...shadows.xs },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    cardIconWrap: { width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
    cardMeta: { flex: 1 },
    cardTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
    cardDate: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
    cardBody: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
    deleteBtn: { width: 36, height: 36, borderRadius: borderRadius.lg, backgroundColor: colors.errorBg || '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
    emptyWrap: { alignItems: 'center', paddingTop: 80, gap: spacing.sm },
    emptyText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    emptySub: { fontSize: fontSize.md, color: colors.textSecondary },
    fab: { position: 'absolute', bottom: spacing.xl, right: spacing.lg, borderRadius: 30, ...shadows.lg },
    fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modal: { backgroundColor: colors.white, borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl, padding: spacing.lg, gap: spacing.md },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    inputField: { borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, fontSize: fontSize.md, color: colors.text },
    inputMulti: { minHeight: 100, textAlignVertical: 'top' },
    createBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.xl, height: 52, alignItems: 'center', justifyContent: 'center' },
    createBtnText: { color: colors.white, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});

export default UpdatesScreen;
