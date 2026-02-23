// MentorListScreen.js — Premium redesign with useTheme()
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
    RefreshControl, Modal, ScrollView, Image, ActivityIndicator,
    Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import mentorshipAPI from '../../services/mentorshipAPI';

const { width } = Dimensions.get('window');
const BRAND = '#5B5FEF';

const DOMAINS = [
    'Frontend', 'Backend', 'Fullstack', 'DevOps / Cloud',
    'QA / Testing', 'Data Science / AI', 'Mobile Dev', 'System Design',
];
const MENTEE_TYPES = ['Fresher', 'Working Professional', 'Student', 'Career Switch'];
const SORT_OPTIONS = [
    { value: 'recommended', label: 'Recommended', icon: 'sparkles-outline' },
    { value: 'rating', label: 'Highest Rated', icon: 'star-outline' },
    { value: 'experience', label: 'Most Experienced', icon: 'ribbon-outline' },
];

// Avatar helper
const MentorAvatar = ({ mentor, size = 56, theme }) => {
    const colors = ['#5B5FEF', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];
    const color = colors[(mentor.displayName || mentor.name || '?').charCodeAt(0) % colors.length];
    const initial = (mentor.displayName || mentor.name || '?').charAt(0).toUpperCase();

    if (mentor.profileImage || mentor.avatar) {
        return (
            <Image
                source={{ uri: mentor.profileImage || mentor.avatar }}
                style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: theme.border }}
            />
        );
    }
    return (
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: size * 0.38, fontWeight: '800', color: '#fff' }}>{initial}</Text>
        </View>
    );
};

export default function MentorListScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const [mentors, setMentors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedMenteeType, setSelectedMenteeType] = useState('');
    const [sortBy, setSortBy] = useState('recommended');

    const activeFilterCount = selectedDomains.length + (selectedMenteeType ? 1 : 0);

    const fetchMentors = useCallback(async () => {
        try {
            const res = await mentorshipAPI.getMentors();
            const list = res?.mentors || res?.data?.mentors || res || [];
            setMentors(Array.isArray(list) ? list : []);
        } catch (e) {
            console.log('Fetch mentors error:', e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMentors(); }, [fetchMentors]);

    useEffect(() => {
        let list = [...mentors];
        // hide self
        const selfId = user?._id || user?.id;
        if (selfId) list = list.filter(m => (m.userId?._id || m.userId || m._id) !== selfId);
        // search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(m =>
                (m.displayName || m.name || '').toLowerCase().includes(q) ||
                (m.tagline || '').toLowerCase().includes(q) ||
                (m.expertise || []).some(e => e.toLowerCase().includes(q)) ||
                (m.targetingDomains || []).some(d => d.toLowerCase().includes(q))
            );
        }
        // domain filter
        if (selectedDomains.length > 0) {
            list = list.filter(m =>
                (m.targetingDomains || []).some(d =>
                    selectedDomains.some(sd => d.toLowerCase().includes(sd.toLowerCase()) || sd.toLowerCase().includes(d.toLowerCase()))
                )
            );
        }
        // mentee type
        if (selectedMenteeType) {
            list = list.filter(m =>
                (m.preferredMenteeType || []).some(t => t.toLowerCase().includes(selectedMenteeType.toLowerCase()))
            );
        }
        // sort
        if (sortBy === 'rating') list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        else if (sortBy === 'experience') list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.averageRating || 0) - (a.averageRating || 0));

        setFiltered(list);
    }, [mentors, searchQuery, selectedDomains, selectedMenteeType, sortBy, user]);

    const onRefresh = async () => { setRefreshing(true); await fetchMentors(); setRefreshing(false); };
    const toggleDomain = d => setSelectedDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    const clearFilters = () => { setSelectedDomains([]); setSelectedMenteeType(''); setSortBy('recommended'); };

    // ── Mentor Card ──────────────────────────────────────────────────────────
    const renderMentorCard = ({ item: m }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => navigation.navigate('MentorDetail', { mentor: m })}
            activeOpacity={0.85}
        >
            {/* Featured ribbon */}
            {m.featured && (
                <View style={styles.featuredRibbon}>
                    <Ionicons name="ribbon" size={11} color="#fff" />
                    <Text style={styles.featuredRibbonText}>Featured</Text>
                </View>
            )}

            <View style={styles.cardTop}>
                <MentorAvatar mentor={m} size={60} theme={theme} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.cardName, { color: theme.text }]} numberOfLines={1}>
                            {m.displayName || m.name}
                        </Text>
                        {m.isVerified && <Ionicons name="checkmark-circle" size={15} color={BRAND} />}
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.textSecondary }]} numberOfLines={1}>
                        {m.tagline || (m.targetingDomains || []).join(' · ') || 'Industry Professional'}
                    </Text>
                    <View style={styles.metaRow}>
                        {(m.averageRating || 0) > 0 ? (
                            <>
                                <Ionicons name="star" size={12} color="#F59E0B" />
                                <Text style={[styles.metaStrong, { color: theme.text }]}>{m.averageRating?.toFixed(1)}</Text>
                                <Text style={[styles.metaMuted, { color: theme.textMuted }]}>({m.totalReviews || 0})</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="sparkles-outline" size={12} color={BRAND} />
                                <Text style={[styles.metaStrong, { color: BRAND }]}>New</Text>
                            </>
                        )}
                        {(m.totalPlacements || 0) > 0 && (
                            <Text style={[styles.metaMuted, { color: theme.textMuted }]}>· {m.totalPlacements} placements</Text>
                        )}
                        {(m.location?.city) && (
                            <Text style={[styles.metaMuted, { color: theme.textMuted }]}>· {m.location.city}</Text>
                        )}
                    </View>
                </View>
            </View>

            {(m.bio) && (
                <Text style={[styles.cardBio, { color: theme.textSecondary }]} numberOfLines={2}>{m.bio}</Text>
            )}

            {/* Domain tags */}
            {(m.targetingDomains || m.expertise || []).length > 0 && (
                <View style={styles.tagRow}>
                    {(m.targetingDomains || m.expertise || []).slice(0, 3).map((tag, i) => (
                        <View key={i} style={[styles.tag, { backgroundColor: BRAND + '12', borderColor: BRAND + '30' }]}>
                            <Text style={[styles.tagText, { color: BRAND }]}>{tag}</Text>
                        </View>
                    ))}
                    {(m.targetingDomains || m.expertise || []).length > 3 && (
                        <View style={[styles.tag, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                            <Text style={[styles.tagText, { color: theme.textMuted }]}>+{(m.targetingDomains || m.expertise || []).length - 3}</Text>
                        </View>
                    )}
                </View>
            )}

            <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <View style={styles.pricingInfo}>
                    {m.trialSession?.available ? (
                        <>
                            <Ionicons name="gift-outline" size={14} color="#10B981" />
                            <Text style={styles.freeText}>Free trial</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="cash-outline" size={14} color={theme.textMuted} />
                            <Text style={[styles.paidText, { color: theme.textMuted }]}>
                                {m.pricingType === 'free' ? 'Free' : m.pricingType === 'freemium' ? 'Free + Paid' : 'Paid'}
                            </Text>
                        </>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('BookSession', { mentor: m })}
                    activeOpacity={0.85}
                >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // ── Filter Modal ─────────────────────────────────────────────────────────
    const FilterModal = () => (
        <Modal visible={showFilter} animationType="slide" transparent onRequestClose={() => setShowFilter(false)}>
            <View style={styles.overlay}>
                <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
                    <View style={styles.sheetHandle} />
                    <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.sheetTitle, { color: theme.text }]}>Filters</Text>
                        <TouchableOpacity
                            style={[styles.closeBtn, { backgroundColor: theme.surfaceAlt }]}
                            onPress={() => setShowFilter(false)}
                        >
                            <Ionicons name="close" size={20} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
                        {/* Sort */}
                        <Text style={[styles.filterLabel, { color: theme.text }]}>Sort By</Text>
                        <View style={styles.chipWrap}>
                            {SORT_OPTIONS.map(o => {
                                const active = sortBy === o.value;
                                return (
                                    <TouchableOpacity
                                        key={o.value}
                                        style={[styles.chip, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND : theme.card }]}
                                        onPress={() => setSortBy(o.value)}
                                    >
                                        <Ionicons name={o.icon} size={13} color={active ? '#fff' : theme.textMuted} />
                                        <Text style={[styles.chipText, { color: active ? '#fff' : theme.text }]}>{o.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Domain */}
                        <Text style={[styles.filterLabel, { color: theme.text }]}>Domain</Text>
                        <View style={styles.chipWrap}>
                            {DOMAINS.map(d => {
                                const active = selectedDomains.includes(d);
                                return (
                                    <TouchableOpacity
                                        key={d}
                                        style={[styles.chip, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND : theme.card }]}
                                        onPress={() => toggleDomain(d)}
                                    >
                                        {active && <Ionicons name="checkmark" size={12} color="#fff" />}
                                        <Text style={[styles.chipText, { color: active ? '#fff' : theme.text }]}>{d}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Mentee Type */}
                        <Text style={[styles.filterLabel, { color: theme.text }]}>For</Text>
                        <View style={styles.chipWrap}>
                            {['All', ...MENTEE_TYPES].map(t => {
                                const val = t === 'All' ? '' : t;
                                const active = selectedMenteeType === val;
                                return (
                                    <TouchableOpacity
                                        key={t}
                                        style={[styles.chip, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND : theme.card }]}
                                        onPress={() => setSelectedMenteeType(val)}
                                    >
                                        <Text style={[styles.chipText, { color: active ? '#fff' : theme.text }]}>{t}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    <View style={[styles.sheetFooter, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
                        <TouchableOpacity
                            style={[styles.clearBtn, { borderColor: theme.border }]}
                            onPress={() => { clearFilters(); setShowFilter(false); }}
                        >
                            <Text style={[styles.clearBtnText, { color: theme.text }]}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
                            <Text style={styles.applyBtnText}>Show {filtered.length} Results</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.background, paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={BRAND} />
                <Text style={[styles.loadingText, { color: theme.textMuted }]}>Finding mentors for you…</Text>
            </View>
        );
    }

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            {/* ── Header ── */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Find Mentors</Text>
                    <Text style={[styles.headerSub, { color: theme.textMuted }]}>{filtered.length} available now</Text>
                </View>
                <TouchableOpacity
                    style={[styles.filterIconBtn, { backgroundColor: activeFilterCount > 0 ? BRAND : theme.surfaceAlt }]}
                    onPress={() => setShowFilter(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="options-outline" size={20} color={activeFilterCount > 0 ? '#fff' : theme.text} />
                    {activeFilterCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* ── Search ── */}
            <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="search-outline" size={18} color={theme.textMuted} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search by name, skill or domain…"
                    placeholderTextColor={theme.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* ── Sort pills ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                {SORT_OPTIONS.map(o => {
                    const active = sortBy === o.value;
                    return (
                        <TouchableOpacity
                            key={o.value}
                            style={[styles.sortPill, { borderColor: active ? BRAND : theme.border, backgroundColor: active ? BRAND + '12' : theme.card }]}
                            onPress={() => setSortBy(o.value)}
                        >
                            <Ionicons name={o.icon} size={13} color={active ? BRAND : theme.textMuted} />
                            <Text style={[styles.sortPillText, { color: active ? BRAND : theme.textSecondary }]}>{o.label}</Text>
                        </TouchableOpacity>
                    );
                })}
                {activeFilterCount > 0 && (
                    <TouchableOpacity
                        style={[styles.sortPill, { borderColor: '#EF4444', backgroundColor: '#FEF2F2' }]}
                        onPress={clearFilters}
                    >
                        <Ionicons name="close" size={13} color="#EF4444" />
                        <Text style={[styles.sortPillText, { color: '#EF4444' }]}>Clear filters</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* ── List ── */}
            <FlatList
                data={filtered}
                keyExtractor={item => (item._id || item.id || Math.random()).toString()}
                renderItem={renderMentorCard}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100, flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} colors={[BRAND]} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <View style={[styles.emptyIcon, { backgroundColor: BRAND + '12' }]}>
                            <Ionicons name="people-outline" size={40} color={BRAND} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>No mentors found</Text>
                        <Text style={[styles.emptySub, { color: theme.textMuted }]}>
                            {searchQuery || activeFilterCount > 0 ? 'Try adjusting your filters' : 'Check back soon for new mentors'}
                        </Text>
                        {activeFilterCount > 0 && (
                            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
                                <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            <FilterModal />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { fontSize: 14 },
    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    headerSub: { fontSize: 13, marginTop: 2 },
    filterIconBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    filterBadge: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
    filterBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },
    // Search
    searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 12, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, gap: 10, height: 48 },
    searchInput: { flex: 1, fontSize: 15 },
    // Sort pills
    sortScroll: { marginBottom: 8, flexShrink: 0 },
    sortPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 30, borderWidth: 1.5 },
    sortPillText: { fontSize: 13, fontWeight: '600' },
    // Cards
    card: { borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, gap: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    featuredRibbon: { position: 'absolute', top: 14, right: -20, backgroundColor: BRAND, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 24, paddingVertical: 4, transform: [{ rotate: '35deg' }] },
    featuredRibbonText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
    cardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    cardName: { fontSize: 16, fontWeight: '700' },
    cardTitle: { fontSize: 13, marginTop: 2 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, flexWrap: 'wrap' },
    metaStrong: { fontSize: 13, fontWeight: '700' },
    metaMuted: { fontSize: 12 },
    cardBio: { fontSize: 13, lineHeight: 19 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
    tagText: { fontSize: 12, fontWeight: '600' },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, marginTop: 2 },
    pricingInfo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    freeText: { fontSize: 13, fontWeight: '700', color: '#10B981' },
    paidText: { fontSize: 13, fontWeight: '600' },
    bookBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: BRAND, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 22, shadowColor: BRAND, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    bookBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    // Empty
    empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    emptyTitle: { fontSize: 18, fontWeight: '700' },
    emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
    clearFiltersBtn: { marginTop: 4, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: BRAND + '15', borderRadius: 30, borderWidth: 1.5, borderColor: BRAND + '40' },
    clearFiltersBtnText: { color: BRAND, fontWeight: '700', fontSize: 14 },
    // Modal
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '85%' },
    sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
    sheetTitle: { fontSize: 18, fontWeight: '700' },
    closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    filterLabel: { fontSize: 14, fontWeight: '700', marginBottom: 10, marginTop: 16 },
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 30, borderWidth: 1.5 },
    chipText: { fontSize: 13, fontWeight: '600' },
    sheetFooter: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1 },
    clearBtn: { flex: 1, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
    clearBtnText: { fontSize: 15, fontWeight: '600' },
    applyBtn: { flex: 2, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: BRAND },
    applyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
