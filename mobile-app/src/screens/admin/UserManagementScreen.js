// screens/admin/UserManagementScreen.js — Phase 5
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    TextInput, RefreshControl, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/adminAPI';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const ROLES = ['Student', 'Mentor', 'Admin'];
const ROLE_COLORS = { Student: colors.info, Mentor: colors.success, Admin: colors.primary };

const RoleBadge = ({ role }) => (
    <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLORS[role] || colors.textMuted) + '18' }]}>
        <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[role] || colors.textMuted }]}>{role}</Text>
    </View>
);

const UserManagementScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await adminAPI.getUsers();
            const list = res?.users || res?.data || res || [];
            setUsers(list);
            setFiltered(list);
        } catch {
            setUsers([]); setFiltered([]);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    // Client-side search filter
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            q ? users.filter((u) => (u.name + u.email).toLowerCase().includes(q)) : users
        );
    }, [search, users]);

    const handleChangeRole = (user) => {
        Alert.alert('Change Role', `Current: ${user.role}`, [
            ...ROLES.filter((r) => r !== user.role).map((r) => ({
                text: `Set as ${r}`,
                onPress: async () => {
                    try {
                        await adminAPI.updateUserRole(user._id, r);
                        setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, role: r } : u));
                    } catch { Alert.alert('Error', 'Could not update role.'); }
                },
            })),
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleDelete = (user) => {
        Alert.alert('Delete User', `Remove ${user.name || user.email}?`, [
            {
                text: 'Delete', style: 'destructive',
                onPress: async () => {
                    try {
                        await adminAPI.deleteUser(user._id);
                        setUsers((prev) => prev.filter((u) => u._id !== user._id));
                    } catch { Alert.alert('Error', 'Could not delete user.'); }
                },
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(item.name || item.email || '?')[0].toUpperCase()}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name || 'No Name'}</Text>
                <Text style={styles.cardEmail} numberOfLines={1}>{item.email}</Text>
                <RoleBadge role={item.role || 'Student'} />
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleChangeRole(item)}>
                    <Ionicons name="swap-horizontal-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item)}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Management</Text>
            </View>

            <View style={styles.searchWrap}>
                <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or email…"
                    placeholderTextColor={colors.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
                {search ? (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <Text style={styles.countText}>{filtered.length} users</Text>

            {loading ? (
                <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(u) => u._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={colors.primary} colors={[colors.primary]} />}
                    ListEmptyComponent={<View style={styles.emptyWrap}><Ionicons name="people-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>No users found</Text></View>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
    backBtn: { width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
    headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    searchWrap: { flexDirection: 'row', alignItems: 'center', margin: spacing.md, backgroundColor: colors.card, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, gap: spacing.sm },
    searchIcon: {},
    searchInput: { flex: 1, fontSize: fontSize.md, color: colors.text, paddingVertical: spacing.sm + 2 },
    countText: { fontSize: fontSize.sm, color: colors.textMuted, marginHorizontal: spacing.md, marginBottom: spacing.xs },
    list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder, gap: spacing.sm, ...shadows.xs },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.primary },
    cardBody: { flex: 1, gap: 3 },
    cardName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
    cardEmail: { fontSize: fontSize.sm, color: colors.textSecondary },
    roleBadge: { alignSelf: 'flex-start', borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
    roleBadgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
    actions: { flexDirection: 'row', gap: spacing.xs },
    actionBtn: { width: 36, height: 36, borderRadius: borderRadius.lg, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
    deleteBtn: { backgroundColor: colors.errorBg || '#FEF2F2' },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
    emptyText: { fontSize: fontSize.md, color: colors.textMuted },
});

export default UserManagementScreen;
