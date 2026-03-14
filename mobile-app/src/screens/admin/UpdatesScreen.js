// UpdatesScreen.js — Theme-aware via useTheme()
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, ActivityIndicator, Alert, TextInput, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/adminAPI';
import { useTheme } from '../../context/ThemeContext';

const BRAND = '#5B5FEF';

const timeAgo = (iso) => {
    if (!iso) return '';
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
};

export default function UpdatesScreen({ navigation }) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [titleVal, setTitleVal] = useState('');
    const [bodyVal, setBodyVal] = useState('');
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
        if (!titleVal.trim()) { Alert.alert('Error', 'Title is required.'); return; }
        setCreating(true);
        try {
            const res = await adminAPI.createUpdate({ title: titleVal.trim(), body: bodyVal.trim() });
            const newItem = res?.update || res?.data || { _id: Date.now().toString(), title: titleVal.trim(), body: bodyVal.trim(), createdAt: new Date().toISOString() };
            setUpdates(prev => [newItem, ...prev]);
            setModalVisible(false); setTitleVal(''); setBodyVal('');
        } catch { Alert.alert('Error', 'Could not create update.'); }
        finally { setCreating(false); }
    };

    const handleDelete = (id, updateTitle) => {
        Alert.alert('Delete Update', `Remove "${updateTitle}"?`, [
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    try { await adminAPI.deleteUpdate(id); setUpdates(prev => prev.filter(u => u._id !== id)); }
                    catch { Alert.alert('Error', 'Could not delete update.'); }
                }
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.cardIconWrap, { backgroundColor: BRAND + '18' }]}>
                    <Ionicons name="megaphone-outline" size={20} color={BRAND} />
                </View>
                <View style={styles.cardMeta}>
                    <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.cardDate, { color: theme.textMuted }]}>{timeAgo(item.createdAt)}</Text>
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id, item.title)}>
                    <Ionicons name="trash-outline" size={17} color="#EF4444" />
                </TouchableOpacity>
            </View>
            {item.body ? <Text style={[styles.cardBody, { color: theme.textSecondary }]} numberOfLines={3}>{item.body}</Text> : null}
        </View>
    );

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surfaceAlt }]}>
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>App Updates</Text>
                <View style={[styles.countChip, { backgroundColor: BRAND + '18' }]}>
                    <Text style={[styles.countChipText, { color: BRAND }]}>{updates.length}</Text>
                </View>
            </View>

            {loading ? <ActivityIndicator color={BRAND} style={{ marginTop: 32 }} /> : (
                <FlatList
                    data={updates}
                    keyExtractor={u => u._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} colors={[BRAND]} />}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Ionicons name="megaphone-outline" size={48} color={theme.textMuted} />
                            <Text style={[styles.emptyTitle, { color: theme.text }]}>No updates yet</Text>
                            <Text style={[styles.emptySub, { color: theme.textMuted }]}>Tap + to create your first announcement</Text>
                        </View>
                    }
                />
            )}

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
                <View style={styles.fabInner}>
                    <Ionicons name="add" size={26} color="#fff" />
                </View>
            </TouchableOpacity>

            {/* Create modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modal, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>New Update</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setTitleVal(''); setBodyVal(''); }}>
                                <Ionicons name="close" size={22} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[styles.inputField, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surfaceAlt }]}
                            placeholder="Title *"
                            placeholderTextColor={theme.textMuted}
                            value={titleVal}
                            onChangeText={setTitleVal}
                        />
                        <TextInput
                            style={[styles.inputField, styles.inputMulti, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surfaceAlt }]}
                            placeholder="Message (optional)"
                            placeholderTextColor={theme.textMuted}
                            value={bodyVal}
                            onChangeText={setBodyVal}
                            multiline
                        />
                        <TouchableOpacity style={[styles.createBtn, creating && { opacity: 0.7 }]} onPress={handleCreate} disabled={creating}>
                            {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.createBtnText}>Publish Update</Text>}
                        </TouchableOpacity>
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
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
    countChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    countChipText: { fontSize: 13, fontWeight: '700' },
    list: { padding: 16, gap: 10, paddingBottom: 100 },
    card: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    cardIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardMeta: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700' },
    cardDate: { fontSize: 12, marginTop: 2 },
    cardBody: { fontSize: 13, lineHeight: 20 },
    deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
    emptyWrap: { alignItems: 'center', paddingTop: 80, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '700' },
    emptySub: { fontSize: 14 },
    fab: { position: 'absolute', bottom: 28, right: 20 },
    fabInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 14 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    inputField: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
    inputMulti: { minHeight: 100, textAlignVertical: 'top' },
    createBtn: { backgroundColor: BRAND, borderRadius: 26, height: 52, alignItems: 'center', justifyContent: 'center' },
    createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
