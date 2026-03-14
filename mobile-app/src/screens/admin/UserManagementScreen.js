// UserManagementScreen.js — Theme-aware via useTheme()
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    TextInput, RefreshControl, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/adminAPI';
import { useTheme } from '../../context/ThemeContext';

const BRAND = '#5B5FEF';
const ROLES = ['Student', 'Mentor', 'Admin'];
const ROLE_COLORS = { Student: '#6366F1', Mentor: '#10B981', Admin: '#EF4444' };

export default function UserManagementScreen({ navigation }) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await adminAPI.getUsers();
            const list = res?.users || res?.data || res || [];
            setUsers(list); setFiltered(list);
        } catch { setUsers([]); setFiltered([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(q ? users.filter(u => (u.name + u.email).toLowerCase().includes(q)) : users);
    }, [search, users]);

    const handleChangeRole = (user) => {
        Alert.alert('Change Role', `Current: ${user.role}`, [
            ...ROLES.filter(r => r !== user.role).map(r => ({
                text: `Set as ${r}`,
                onPress: async () => {
                    try {
                        await adminAPI.updateUserRole(user._id, r);
                        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: r } : u));
                    } catch { Alert.alert('Error', 'Could not update role.'); }
                },
            })),
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleDelete = (user) => {
        Alert.alert('Delete User', `Remove ${user.name || user.email}?`, [
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    try { await adminAPI.deleteUser(user._id); setUsers(prev => prev.filter(u => u._id !== user._id)); }
                    catch { Alert.alert('Error', 'Could not delete user.'); }
                }
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={[styles.avatar, { backgroundColor: (ROLE_COLORS[item.role] || BRAND) + '18' }]}>
                <Text style={[styles.avatarText, { color: ROLE_COLORS[item.role] || BRAND }]}>
                    {(item.name || item.email || '?')[0].toUpperCase()}
                </Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={[styles.cardName, { color: theme.text }]} numberOfLines={1}>{item.name || 'No Name'}</Text>
                <Text style={[styles.cardEmail, { color: theme.textSecondary }]} numberOfLines={1}>{item.email}</Text>
                <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLORS[item.role || 'Student'] || BRAND) + '15' }]}>
                    <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[item.role || 'Student'] || BRAND }]}>
                        {item.role || 'Student'}
                    </Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: BRAND + '15' }]} onPress={() => handleChangeRole(item)}>
                    <Ionicons name="swap-horizontal-outline" size={17} color={BRAND} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]} onPress={() => handleDelete(item)}>
                    <Ionicons name="trash-outline" size={17} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surfaceAlt }]}>
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>User Management</Text>
            </View>
            <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="search-outline" size={17} color={theme.textMuted} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search by name or email…"
                    placeholderTextColor={theme.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
                {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={17} color={theme.textMuted} /></TouchableOpacity> : null}
            </View>
            <Text style={[styles.countText, { color: theme.textMuted }]}>{filtered.length} users</Text>
            {loading ? (
                <ActivityIndicator color={BRAND} style={{ marginTop: 32 }} />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={u => u._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={BRAND} colors={[BRAND]} />}
                    ListEmptyComponent={<View style={styles.emptyWrap}><Ionicons name="people-outline" size={48} color={theme.textMuted} /><Text style={[styles.emptyText, { color: theme.textMuted }]}>No users found</Text></View>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
    backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    searchWrap: { flexDirection: 'row', alignItems: 'center', margin: 16, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, gap: 10 },
    searchInput: { flex: 1, fontSize: 15, paddingVertical: 12 },
    countText: { fontSize: 13, marginHorizontal: 16, marginBottom: 4 },
    list: { paddingHorizontal: 16, paddingBottom: 24 },
    card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, gap: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    avatarText: { fontSize: 18, fontWeight: '800' },
    cardBody: { flex: 1, gap: 3 },
    cardName: { fontSize: 15, fontWeight: '600' },
    cardEmail: { fontSize: 13 },
    roleBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
    roleBadgeText: { fontSize: 11, fontWeight: '700' },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText: { fontSize: 15 },
});
