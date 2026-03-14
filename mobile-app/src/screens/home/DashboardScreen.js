// DashboardScreen.js — Student dashboard with AI assessment and progress
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const BRAND = '#5B5FEF';

export default function DashboardScreen({ navigation }) {
    const { user } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 900);
    }, []);

    const isMentor = user?.role === 'Mentor';
    const isAdmin = user?.role === 'Admin';

    const quickActions = [
        { icon: 'school-outline', label: 'Assessment', color: BRAND, bg: '#EEF2FF', nav: () => navigation.navigate('Career', { screen: 'Assessment' }) },
        { icon: 'people-outline', label: 'Find Mentors', color: '#10B981', bg: '#ECFDF5', nav: () => navigation.navigate('Mentorship') },
        { icon: 'calendar-outline', label: 'My Bookings', color: '#F59E0B', bg: '#FFFBEB', nav: () => navigation.navigate('Mentorship', { screen: 'MyBookings' }) },
        { icon: 'person-outline', label: 'Profile', color: '#EF4444', bg: '#FEF2F2', nav: () => navigation.navigate('Profile') },
    ];

    const mentorActions = [
        { icon: 'calendar-outline', label: 'Sessions', color: BRAND, bg: '#EEF2FF', nav: () => navigation.navigate('MentorSection') },
        { icon: 'star-outline', label: 'Reviews', color: '#F59E0B', bg: '#FFFBEB', nav: () => navigation.navigate('Profile') },
        { icon: 'people-outline', label: 'Students', color: '#10B981', bg: '#ECFDF5', nav: () => navigation.navigate('Mentorship') },
        { icon: 'settings-outline', label: 'Settings', color: '#6B7280', bg: '#F3F4F6', nav: () => navigation.navigate('Profile') },
    ];

    const actions = isMentor ? mentorActions : quickActions;

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} />}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.headerBtn}>
                        <Ionicons name="menu" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Dashboard</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.headerBtn}>
                        <Ionicons name="notifications-outline" size={22} color={theme.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Summary header card */}
                    <View style={[styles.summaryCard, { backgroundColor: BRAND }]}>
                        <View style={styles.summaryTop}>
                            <View>
                                <Text style={styles.summaryGreet}>Your Progress</Text>
                                <Text style={styles.summaryName}>
                                    {isMentor ? 'Mentor Dashboard' : isAdmin ? 'Admin Overview' : 'Student Dashboard'}
                                </Text>
                            </View>
                            <View style={[styles.roleChip, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <Ionicons name={isMentor ? 'ribbon-outline' : isAdmin ? 'shield-outline' : 'school-outline'} size={13} color="#fff" />
                                <Text style={styles.roleChipText}>{user?.role || 'User'}</Text>
                            </View>
                        </View>

                        {/* KPI row */}
                        <View style={styles.kpiRow}>
                            {(isMentor
                                ? [{ label: 'Sessions', val: '12' }, { label: 'Students', val: '48' }, { label: 'Rating', val: '4.8★' }]
                                : [{ label: 'Assessments', val: '2' }, { label: 'Bookings', val: '3' }, { label: 'Skills', val: '8' }]
                            ).map((k, i) => (
                                <View key={i} style={[styles.kpiBox, i > 0 && { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' }]}>
                                    <Text style={styles.kpiVal}>{k.val}</Text>
                                    <Text style={styles.kpiLabel}>{k.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {actions.map((a, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.actionCard, { backgroundColor: a.bg }]}
                                onPress={a.nav}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: a.color + '25' }]}>
                                    <Ionicons name={a.icon} size={22} color={a.color} />
                                </View>
                                <Text style={[styles.actionLabel, { color: theme.text }]}>{a.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Skill Progress (students) */}
                    {!isMentor && !isAdmin && (
                        <>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Skill Progress</Text>
                            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                                {[
                                    { skill: 'Communication', pct: 72, color: BRAND },
                                    { skill: 'Problem Solving', pct: 55, color: '#10B981' },
                                    { skill: 'Leadership', pct: 40, color: '#F59E0B' },
                                    { skill: 'Technical Skills', pct: 68, color: '#EF4444' },
                                ].map((s, i) => (
                                    <View key={i} style={[styles.progressRow, i > 0 && { marginTop: 14 }]}>
                                        <View style={styles.progressLabelRow}>
                                            <Text style={[styles.progressSkill, { color: theme.text }]}>{s.skill}</Text>
                                            <Text style={[styles.progressPct, { color: s.color }]}>{s.pct}%</Text>
                                        </View>
                                        <View style={[styles.progressTrack, { backgroundColor: theme.surfaceAlt }]}>
                                            <View style={[styles.progressFill, { width: `${s.pct}%`, backgroundColor: s.color }]} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {/* Expert Guidance CTA */}
                    {!isMentor && !isAdmin && (
                        <TouchableOpacity
                            style={styles.mentorCTA}
                            onPress={() => navigation.navigate('Mentorship')}
                            activeOpacity={0.88}
                        >
                            <View style={styles.mentorCTAIcon}>
                                <Ionicons name="people" size={26} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.mentorCTATitle}>Get Expert Guidance</Text>
                                <Text style={styles.mentorCTASub}>Browse 120+ vetted industry mentors</Text>
                            </View>
                            <Ionicons name="arrow-forward-circle" size={32} color="rgba(255,255,255,0.7)" />
                        </TouchableOpacity>
                    )}

                    {/* Admin quick links */}
                    {isAdmin && (
                        <>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Admin Controls</Text>
                            {[
                                { label: 'User Management', sub: 'View & manage all users', icon: 'people-outline', nav: () => navigation.navigate('Admin', { screen: 'UserManagement' }) },
                                { label: 'Mentor Applications', sub: 'Review pending applications', icon: 'checkmark-circle-outline', nav: () => navigation.navigate('Admin', { screen: 'MentorApplications' }) },
                                { label: 'Send Announcements', sub: 'Notify all users', icon: 'megaphone-outline', nav: () => navigation.navigate('Admin', { screen: 'AdminUpdates' }) },
                                { label: 'System Settings', sub: 'Configure platform settings', icon: 'settings-outline', nav: () => navigation.navigate('Admin', { screen: 'SystemSettings' }) },
                            ].map((item, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.adminRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                                    onPress={item.nav}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.adminIcon, { backgroundColor: '#EEF2FF' }]}>
                                        <Ionicons name={item.icon} size={20} color={BRAND} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.adminLabel, { color: theme.text }]}>{item.label}</Text>
                                        <Text style={[styles.adminSub, { color: theme.textMuted }]}>{item.sub}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const aW = (width - 16 * 2 - 12) / 2;

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    content: { padding: 16, gap: 20 },
    summaryCard: { borderRadius: 20, padding: 20, overflow: 'hidden' },
    summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    summaryGreet: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
    summaryName: { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 2 },
    roleChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 30 },
    roleChipText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    kpiRow: { flexDirection: 'row' },
    kpiBox: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    kpiVal: { fontSize: 24, fontWeight: '800', color: '#fff' },
    kpiLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    sectionTitle: { fontSize: 17, fontWeight: '700' },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: { width: aW, borderRadius: 16, padding: 16, gap: 10 },
    actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { fontSize: 14, fontWeight: '700' },
    progressCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
    progressRow: {},
    progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progressSkill: { fontSize: 13, fontWeight: '600' },
    progressPct: { fontSize: 13, fontWeight: '700' },
    progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
    mentorCTA: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: BRAND, borderRadius: 18, padding: 18 },
    mentorCTAIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    mentorCTATitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
    mentorCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
    adminRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 14, padding: 14, borderWidth: 1 },
    adminIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    adminLabel: { fontSize: 14, fontWeight: '700' },
    adminSub: { fontSize: 12, marginTop: 2 },
});
