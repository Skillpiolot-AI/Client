// HomeScreen.js — Full student-focused redesign
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, Dimensions, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const BRAND = '#5B5FEF';
const ACCENT = '#F59E0B';

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 900);
    }, []);

    const name = user?.name?.split(' ')[0] || 'Student';
    const isMentor = user?.role === 'Mentor';

    const features = isMentor ? [
        { icon: 'calendar', label: 'My Sessions', desc: 'View scheduled sessions', color: '#5B5FEF', bg: '#EEF2FF', nav: () => navigation.navigate('MentorSection') },
        { icon: 'people', label: 'Find Students', desc: 'Browse applicants', color: '#10B981', bg: '#ECFDF5', nav: () => navigation.navigate('Mentorship') },
        { icon: 'star', label: 'My Ratings', desc: 'See your reviews', color: '#F59E0B', bg: '#FFFBEB', nav: () => navigation.navigate('Profile') },
        { icon: 'chatbubbles', label: 'Community', desc: 'Mentor network', color: '#EF4444', bg: '#FEF2F2', nav: () => { } },
    ] : [
        { icon: 'school', label: 'AI Assessment', desc: 'Personalized skill gaps', color: '#5B5FEF', bg: '#EEF2FF', nav: () => navigation.navigate('Career', { screen: 'Assessment' }) },
        { icon: 'people', label: 'Find Mentors', desc: 'Browse top industry experts', color: '#10B981', bg: '#ECFDF5', nav: () => navigation.navigate('Mentorship') },
        { icon: 'calendar', label: 'My Bookings', desc: 'Upcoming sessions', color: '#F59E0B', bg: '#FFFBEB', nav: () => navigation.navigate('Mentorship', { screen: 'MyBookings' }) },
        { icon: 'compass', label: 'Career Path', desc: 'Explore your future', color: '#EF4444', bg: '#FEF2F2', nav: () => navigation.navigate('Career') },
    ];

    const stats = isMentor
        ? [{ label: 'Sessions', val: '12', icon: 'calendar-outline', color: BRAND }, { label: 'Students', val: '48', icon: 'people-outline', color: '#10B981' }, { label: 'Rating', val: '4.8', icon: 'star-outline', color: ACCENT }]
        : [{ label: 'Assessment', val: '2', icon: 'school-outline', color: BRAND }, { label: 'Sessions', val: '3', icon: 'calendar-outline', color: '#10B981' }, { label: 'Skills', val: '8', icon: 'flash-outline', color: ACCENT }];

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} />}
            >
                {/* ── Header ── */}
                <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
                        <Ionicons name="menu" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Ionicons name="rocket" size={18} color={BRAND} />
                        <Text style={[styles.headerBrand, { color: theme.text }]}>SkillPilot</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifBtn}>
                        <Ionicons name="notifications-outline" size={22} color={theme.text} />
                        <View style={styles.notifDot} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* ── Greeting ── */}
                    <View style={[styles.greetCard, { backgroundColor: BRAND }]}>
                        <View style={styles.greetCardBg}>
                            {[100, 70, 45].map((r, i) => (
                                <View key={i} style={[styles.greetRing, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.1 + i * 0.08, right: -r * 0.4, top: -r * 0.4 }]} />
                            ))}
                        </View>
                        <View style={styles.greetLeft}>
                            <Text style={styles.greetHi}>Good morning 👋</Text>
                            <Text style={styles.greetName}>{name}!</Text>
                            <Text style={styles.greetSub}>
                                {isMentor ? "Let's make a difference today" : "Let's grow your skills today"}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.greetAvatar} onPress={() => navigation.navigate('Profile')}>
                            <Text style={styles.greetAvatarText}>{name[0].toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Quick Stats ── */}
                    <View style={styles.statsRow}>
                        {stats.map((s, i) => (
                            <View key={i} style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                                <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
                                    <Ionicons name={s.icon} size={18} color={s.color} />
                                </View>
                                <Text style={[styles.statVal, { color: theme.text }]}>{s.val}</Text>
                                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Search ── */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholder="Search mentors, skills, topics..."
                            placeholderTextColor={theme.textMuted}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    {/* ── Feature Grid ── */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>What would you like to do?</Text>
                    <View style={styles.grid}>
                        {features.map((f, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.featureCard, { backgroundColor: isDark ? theme.card : f.bg, borderColor: isDark ? theme.cardBorder : 'transparent' }]}
                                onPress={f.nav}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.featureIconBox, { backgroundColor: isDark ? f.bg : f.color + '20' }]}>
                                    <Ionicons name={f.icon} size={24} color={f.color} />
                                </View>
                                <Text style={[styles.featureLabel, { color: theme.text }]}>{f.label}</Text>
                                <Text style={[styles.featureDesc, { color: theme.textMuted }]}>{f.desc}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ── CTA banner ── */}
                    {!isMentor && (
                        <TouchableOpacity
                            style={styles.ctaBanner}
                            onPress={() => navigation.navigate('Mentorship')}
                            activeOpacity={0.88}
                        >
                            <View style={styles.ctaDecor}>
                                {[80, 55, 30].map((r, i) => (
                                    <View key={i} style={[styles.greetRing, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.12 + i * 0.08, right: -r * 0.3, top: -r * 0.2 }]} />
                                ))}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.ctaTitle}>Book a Free Mentor Session</Text>
                                <Text style={styles.ctaSub}>Connect with top industry professionals</Text>
                            </View>
                            <View style={styles.ctaArrow}>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* ── Tips ── */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        {isMentor ? 'Mentor Tips' : 'Growth Tips'}
                    </Text>
                    <View style={[styles.tipsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        {(isMentor ? [
                            { icon: '⭐', text: 'Track your feedback regularly to improve session quality' },
                            { icon: '📅', text: 'Keep your availability calendar up to date' },
                            { icon: '💬', text: 'Follow up with mentees after each session' },
                        ] : [
                            { icon: '🎯', text: 'Complete your profile to attract better mentor matches' },
                            { icon: '📊', text: 'Regular assessments help track your skill growth' },
                            { icon: '🤝', text: 'First sessions are always free — book yours today!' },
                        ]).map((tip, i, arr) => (
                            <View key={i} style={[styles.tipRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}>
                                <Text style={styles.tipIcon}>{tip.icon}</Text>
                                <Text style={[styles.tipText, { color: theme.textSecondary }]}>{tip.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const cardW = (width - 16 * 2 - 12) / 2;

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1,
    },
    menuBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerBrand: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
    notifBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
    content: { padding: 16, gap: 20 },
    greetCard: {
        borderRadius: 20, padding: 20,
        flexDirection: 'row', alignItems: 'center',
        overflow: 'hidden',
    },
    greetCardBg: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    greetRing: { position: 'absolute', borderWidth: 1.5, borderColor: '#fff' },
    greetLeft: { flex: 1, gap: 3 },
    greetHi: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
    greetName: { fontSize: 24, fontWeight: '800', color: '#fff' },
    greetSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    greetAvatar: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    },
    greetAvatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
    statsRow: { flexDirection: 'row', gap: 10 },
    statCard: {
        flex: 1, borderRadius: 14, padding: 14,
        alignItems: 'center', gap: 4,
        borderWidth: 1,
    },
    statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statVal: { fontSize: 20, fontWeight: '800' },
    statLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
    searchBox: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        borderRadius: 14, paddingHorizontal: 14, height: 48,
        borderWidth: 1,
    },
    searchInput: { flex: 1, fontSize: 14 },
    sectionTitle: { fontSize: 17, fontWeight: '700' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    featureCard: {
        width: cardW, borderRadius: 18, padding: 16, gap: 8,
        borderWidth: 1,
    },
    featureIconBox: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    featureLabel: { fontSize: 14, fontWeight: '700' },
    featureDesc: { fontSize: 12, lineHeight: 17 },
    ctaBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: '#5B5FEF', borderRadius: 18, padding: 18,
        overflow: 'hidden',
    },
    ctaDecor: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    ctaTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
    ctaSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
    ctaArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    tipsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
    tipIcon: { fontSize: 18, marginTop: 1 },
    tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
