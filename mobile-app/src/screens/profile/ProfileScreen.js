// ProfileScreen.js — Full redesign with Indigo theme, stats, full menu
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Switch, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import authAPI from '../../services/authAPI';

const BRAND = '#5B5FEF';
const AMBER = '#F59E0B';

const ROLE_COLORS = {
    Student: { bg: '#EEF2FF', text: BRAND },
    Mentor: { bg: '#FDF3E7', text: AMBER },
    Admin: { bg: '#FEF2F2', text: '#EF4444' },
};

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const role = user?.role || 'Student';
    const roleStyle = ROLE_COLORS[role] || ROLE_COLORS.Student;
    const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

    const handleChangePassword = useCallback(() => {
        Alert.alert('Change Password', 'We will send a verification code to your email. Proceed?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Send Code',
                onPress: async () => {
                    setLoading(true);
                    try {
                        await authAPI.forgotPassword(user.email);
                        navigation.navigate('OtpVerification', { email: user.email, fromProfile: true });
                    } catch (err) {
                        Alert.alert('Error', err.response?.data?.message || 'Failed to send code');
                    } finally { setLoading(false); }
                },
            },
        ]);
    }, [user, navigation]);

    const handleLogout = useCallback(() => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]);
    }, [logout]);

    // Stats row
    const stats = [
        { label: 'Bookings', value: user?.bookingsCount ?? '—', icon: 'calendar-outline', color: '#10B981' },
        { label: 'Skills', value: user?.skills?.length ?? '—', icon: 'code-slash-outline', color: AMBER },
        { label: 'Sessions', value: user?.completedSessions ?? '—', icon: 'school-outline', color: BRAND },
    ];

    const MENU = [
        {
            title: 'Profile',
            items: [
                { icon: 'person-outline', label: 'Edit Profile', sub: 'Personal info & skills', onPress: () => navigation.navigate('EditProfile'), color: BRAND },
                ...(role === 'Mentor' ? [{ icon: 'briefcase-outline', label: 'Mentor Settings', sub: 'Availability, bio, expertise', onPress: () => navigation.navigate('EditMentorProfile'), color: AMBER }] : []),
                { icon: 'lock-closed-outline', label: 'Change Password', sub: 'Send OTP to email', onPress: handleChangePassword, color: '#6366F1' },
            ],
        },
        {
            title: 'Preferences',
            items: [
                {
                    icon: isDark ? 'moon-outline' : 'sunny-outline',
                    label: isDark ? 'Dark Mode' : 'Light Mode',
                    sub: 'Toggle appearance',
                    onPress: toggleTheme,
                    color: '#F59E0B',
                    rightElement: <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#E5E7EB', true: BRAND }} thumbColor="#fff" />,
                },
            ],
        },
        {
            title: 'Account',
            items: [
                { icon: 'log-out-outline', label: 'Sign Out', sub: 'Log out of your account', onPress: handleLogout, color: '#EF4444', danger: true },
            ],
        },
    ];

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>

                {/* Top header */}
                <View style={[styles.topHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <Text style={[styles.pageTitle, { color: theme.text }]}>Profile</Text>
                </View>

                {/* Avatar hero */}
                <View style={[styles.hero, { backgroundColor: theme.surface }]}>
                    {/* Decorative background rings */}
                    <View style={[styles.heroBg, { backgroundColor: BRAND + '08' }]} />

                    <TouchableOpacity
                        style={[styles.avatar, { backgroundColor: BRAND }]}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Text style={styles.avatarInitial}>{initial}</Text>
                        <View style={styles.editBadge}>
                            <Ionicons name="pencil" size={11} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    <Text style={[styles.heroName, { color: theme.text }]}>{user?.name || 'User'}</Text>
                    <Text style={[styles.heroEmail, { color: theme.textMuted }]}>{user?.email}</Text>

                    <View style={[styles.rolePill, { backgroundColor: roleStyle.bg }]}>
                        <Ionicons
                            name={role === 'Admin' ? 'shield-checkmark-outline' : role === 'Mentor' ? 'ribbon-outline' : 'school-outline'}
                            size={13}
                            color={roleStyle.text}
                        />
                        <Text style={[styles.rolePillText, { color: roleStyle.text }]}>{role}</Text>
                    </View>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                        {stats.map((s, i) => (
                            <View key={i} style={[styles.statBox, { borderColor: theme.border }]}>
                                <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                                    <Ionicons name={s.icon} size={16} color={s.color} />
                                </View>
                                <Text style={[styles.statValue, { color: theme.text }]}>{s.value}</Text>
                                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20, gap: 20, marginTop: 20 }}>
                    {/* Menu groups */}
                    {MENU.map((group) => (
                        <View key={group.title}>
                            <Text style={[styles.groupTitle, { color: theme.textMuted }]}>{group.title.toUpperCase()}</Text>
                            <View style={[styles.menuCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                                {group.items.map((item, idx) => (
                                    <TouchableOpacity
                                        key={item.label}
                                        style={[styles.menuRow, idx < group.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}
                                        onPress={item.onPress}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
                                            <Ionicons name={item.icon} size={19} color={item.danger ? '#EF4444' : item.color} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.menuLabel, { color: item.danger ? '#EF4444' : theme.text }]}>{item.label}</Text>
                                            <Text style={[styles.menuSub, { color: theme.textMuted }]}>{item.sub}</Text>
                                        </View>
                                        {item.rightElement ?? <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* App version footer */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.textMuted }]}>SkillPilot v1.0.0 · Made with ❤️</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
    pageTitle: { fontSize: 20, fontWeight: '800' },
    hero: { alignItems: 'center', paddingTop: 30, paddingBottom: 24, paddingHorizontal: 20, marginBottom: 4, overflow: 'hidden' },
    heroBg: { position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: 90 },
    avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    avatarInitial: { fontSize: 34, fontWeight: '900', color: '#fff' },
    editBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
    heroName: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    heroEmail: { fontSize: 14, marginBottom: 10 },
    rolePill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
    rolePillText: { fontSize: 13, fontWeight: '700' },
    statsRow: { flexDirection: 'row', gap: 12, width: '100%' },
    statBox: { flex: 1, alignItems: 'center', gap: 6, padding: 14, borderRadius: 16, borderWidth: 1 },
    statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statValue: { fontSize: 20, fontWeight: '800' },
    statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
    groupTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
    menuCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
    menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
    menuIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    menuLabel: { fontSize: 15, fontWeight: '600' },
    menuSub: { fontSize: 12, marginTop: 1 },
    footer: { alignItems: 'center', paddingTop: 8 },
    footerText: { fontSize: 12 },
});
