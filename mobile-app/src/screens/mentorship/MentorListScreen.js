// MentorListScreen.js — Centralized-theme refactor
// Removes local `whiteTheme` object; uses centralized theme tokens throughout.
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
    RefreshControl, Modal, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';

const DOMAINS = [
    'Frontend', 'Backend', 'Fullstack',
    'DevOps / Cloud', 'QA / Testing',
    'Data Science / AI', 'Data Analyst',
    'Mobile Dev', 'System Design',
];

const MENTEE_TYPES = ['Fresher', 'Working Professional', 'Student', 'Career Switch'];

const SORT_OPTIONS = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
];

const MentorListScreen = ({ navigation }) => {
    const user = null; // context disabled
    const insets = useSafeAreaInsets();

    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedMenteeType, setSelectedMenteeType] = useState('');
    const [experienceRange, setExperienceRange] = useState(15);
    const [sortBy, setSortBy] = useState('recommended');

    const activeFilterCount =
        selectedDomains.length +
        (selectedMenteeType ? 1 : 0) +
        (experienceRange < 15 ? 1 : 0);

    useEffect(() => { fetchMentors(); }, []);

    useEffect(() => {
        filterMentors();
    }, [searchQuery, selectedDomains, selectedMenteeType, experienceRange, sortBy, mentors]);

    const fetchMentors = async () => {
        try {
            const response = await mentorshipAPI.getMentors();
            const mentorData = response?.mentors || response?.data?.mentors || response || [];
            setMentors(Array.isArray(mentorData) ? mentorData : []);
        } catch (error) {
            console.log('Fetch mentors error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMentors();
        setRefreshing(false);
    };

    const filterMentors = () => {
        let filtered = [...mentors];

        // Hide self
        if (user?.id || user?._id) {
            const userId = user.id || user._id;
            filtered = filtered.filter((m) => {
                const mId = m.userId?._id || m.userId || m._id;
                return mId !== userId;
            });
        }

        // Search
        if (searchQuery) {
            const term = searchQuery.toLowerCase();
            filtered = filtered.filter((m) =>
                (m.displayName || m.name || '').toLowerCase().includes(term) ||
                (m.expertise || m.tagline || '').toLowerCase().includes(term) ||
                (m.targetingDomains || []).some((d) => d.toLowerCase().includes(term))
            );
        }

        // Domain
        if (selectedDomains.length > 0) {
            filtered = filtered.filter((m) => {
                const mDomains = (m.targetingDomains || []).map((d) => d.toLowerCase());
                return selectedDomains.some((domain) =>
                    mDomains.some((d) => d.includes(domain.toLowerCase()) || domain.toLowerCase().includes(d))
                );
            });
        }

        // Mentee type
        if (selectedMenteeType) {
            filtered = filtered.filter((m) => {
                const types = (m.preferredMenteeType || []).map((t) => t.toLowerCase());
                return types.some((t) => t.includes(selectedMenteeType.toLowerCase()));
            });
        }

        // Experience
        if (experienceRange < 15) {
            filtered = filtered.filter((m) => (parseInt(m.experience) || 0) <= experienceRange);
        }

        // Sort
        switch (sortBy) {
            case 'rating':
                filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'experience':
                filtered.sort((a, b) => (b.experience || 0) - (a.experience || 0));
                break;
            default:
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return (b.averageRating || 0) - (a.averageRating || 0);
                });
        }

        setFilteredMentors(filtered);
    };

    const toggleDomain = (domain) => {
        setSelectedDomains((prev) =>
            prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
        );
    };

    const clearAllFilters = () => {
        setSelectedDomains([]);
        setSelectedMenteeType('');
        setExperienceRange(15);
        setSortBy('recommended');
    };

    // ── Mentor card ─────────────────────────────────────────────────────────
    const renderMentorCard = ({ item: mentor }) => (
        <TouchableOpacity
            style={styles.mentorCard}
            onPress={() => navigation.navigate('MentorDetail', { mentor })}
            activeOpacity={0.8}
        >
            <View style={styles.mentorCardHeader}>
                {(mentor.profileImage || mentor.avatar) ? (
                    <Image source={{ uri: mentor.profileImage || mentor.avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>
                            {(mentor.displayName || mentor.name || '?').charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
                <View style={styles.mentorInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.mentorName} numberOfLines={1}>
                            {mentor.displayName || mentor.name}
                        </Text>
                        {mentor.verified && (
                            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                        )}
                    </View>
                    <Text style={styles.mentorTitle} numberOfLines={1}>
                        {mentor.tagline || mentor.expertise || mentor.jobTitle}
                    </Text>
                    <View style={styles.metaRow}>
                        {mentor.averageRating > 0 ? (
                            <>
                                <Ionicons name="star" size={13} color={colors.warning} />
                                <Text style={styles.metaText}>{mentor.averageRating.toFixed(1)}</Text>
                                <Text style={styles.metaTextMuted}>({mentor.totalReviews || 0})</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="sparkles-outline" size={13} color={colors.primary} />
                                <Text style={[styles.metaText, { color: colors.primary }]}>New</Text>
                            </>
                        )}
                        <Text style={styles.metaTextMuted}>• {mentor.experience || 0} yrs exp</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.mentorBio} numberOfLines={2}>
                {mentor.bio || 'Experienced professional ready to guide you on your career journey.'}
            </Text>

            <View style={styles.skillsRow}>
                {(mentor.targetingDomains || mentor.expertise?.split(',') || []).slice(0, 3).map((skill, i) => (
                    <View key={i} style={styles.skillChip}>
                        <Text style={styles.skillText}>{skill.trim()}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.freeBadge}>
                    <Ionicons name="gift" size={14} color={colors.success} />
                    <Text style={styles.freeText}>FREE SESSION</Text>
                </View>
                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('BookSession', { mentor })}
                    activeOpacity={0.85}
                >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={15} color={colors.white} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // ── Filter Modal ─────────────────────────────────────────────────────────
    const FilterModal = () => (
        <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowFilterModal(false)}
        >
            <View style={styles.overlay}>
                <View style={styles.modalSheet}>
                    <View style={styles.modalHandle} />
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity
                            onPress={() => setShowFilterModal(false)}
                            style={styles.modalCloseBtn}
                        >
                            <Ionicons name="close" size={22} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                        {/* Sort By */}
                        <Text style={styles.filterSectionTitle}>Sort By</Text>
                        <View style={styles.chipRow}>
                            {SORT_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[styles.filterChip, sortBy === opt.value && styles.filterChipActive]}
                                    onPress={() => setSortBy(opt.value)}
                                >
                                    <Text style={[styles.filterChipText, sortBy === opt.value && styles.filterChipTextActive]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Domain */}
                        <Text style={styles.filterSectionTitle}>Domain</Text>
                        <View style={styles.chipWrap}>
                            {DOMAINS.map((domain) => {
                                const active = selectedDomains.includes(domain);
                                return (
                                    <TouchableOpacity
                                        key={domain}
                                        style={[styles.filterChip, active && styles.filterChipActive]}
                                        onPress={() => toggleDomain(domain)}
                                    >
                                        {active && <Ionicons name="checkmark" size={13} color={colors.white} />}
                                        <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                            {domain}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Mentee Type */}
                        <Text style={styles.filterSectionTitle}>Offering For</Text>
                        <View style={styles.chipWrap}>
                            {['All Types', ...MENTEE_TYPES].map((type) => {
                                const val = type === 'All Types' ? '' : type;
                                const active = selectedMenteeType === val;
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[styles.filterChip, active && styles.filterChipActive]}
                                        onPress={() => setSelectedMenteeType(val)}
                                    >
                                        <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Experience */}
                        <View style={styles.filterRangeHeader}>
                            <Text style={styles.filterSectionTitle}>Max Experience</Text>
                            <Text style={styles.filterRangeValue}>
                                {experienceRange}{experienceRange === 15 ? '+' : ''} yrs
                            </Text>
                        </View>
                        <View style={styles.chipRow}>
                            {[3, 5, 8, 10, 15].map((val) => (
                                <TouchableOpacity
                                    key={val}
                                    style={[styles.filterChip, experienceRange === val && styles.filterChipActive]}
                                    onPress={() => setExperienceRange(val)}
                                >
                                    <Text style={[styles.filterChipText, experienceRange === val && styles.filterChipTextActive]}>
                                        {val}{val === 15 ? '+' : ''} yrs
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ height: 16 }} />
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.clearBtn} onPress={clearAllFilters}>
                            <Text style={styles.clearBtnText}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => setShowFilterModal(false)}
                        >
                            <Text style={styles.applyBtnText}>
                                Apply ({filteredMentors.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    // ── Empty State ───────────────────────────────────────────────────────────
    const ListEmpty = () => (
        <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={52} color={colors.border} />
            <Text style={styles.emptyTitle}>No mentors found</Text>
            <Text style={styles.emptySubtitle}>
                {searchQuery || activeFilterCount > 0
                    ? 'Try adjusting your search or filters'
                    : 'Check back later for new mentors'}
            </Text>
            {activeFilterCount > 0 && (
                <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearAllFilters}>
                    <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    // ── Main render ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* ── Search Bar ── */}
            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color={colors.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search mentors, skills..."
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                        <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons
                        name="options-outline"
                        size={20}
                        color={activeFilterCount > 0 ? colors.white : colors.text}
                    />
                    {activeFilterCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* ── Results Count ── */}
            <View style={styles.resultsRow}>
                <Text style={styles.resultsCount}>
                    {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} available
                </Text>
                {sortBy !== 'recommended' && (
                    <Text style={styles.sortLabel}>
                        Sorted: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    </Text>
                )}
            </View>

            {/* ── Mentor List ── */}
            <FlatList
                data={filteredMentors}
                keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
                renderItem={renderMentorCard}
                ListEmptyComponent={ListEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />

            <FilterModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ── Search ─────────────────────────────────────
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        marginHorizontal: spacing.md,
        marginVertical: spacing.sm,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        paddingRight: spacing.sm,
        height: 50,
    },
    searchIcon: {
        paddingHorizontal: spacing.md,
    },
    searchInput: {
        flex: 1,
        fontSize: fontSize.md,
        color: colors.text,
    },
    clearSearchBtn: {
        padding: spacing.xs,
        marginRight: spacing.xs,
    },
    filterBtn: {
        width: 38,
        height: 38,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterBtnActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.error,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadgeText: {
        fontSize: 10,
        color: colors.white,
        fontWeight: fontWeight.bold,
    },
    // ── Results row ────────────────────────────────
    resultsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    resultsCount: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    sortLabel: {
        fontSize: fontSize.xs,
        color: colors.primary,
    },
    // ── List ───────────────────────────────────────
    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: 100,
        flexGrow: 1,
    },
    // ── Mentor Card ────────────────────────────────
    mentorCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.sm,
        gap: spacing.sm,
    },
    mentorCardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.border,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 24,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
    },
    mentorInfo: {
        flex: 1,
        gap: 3,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    mentorName: {
        flex: 1,
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    mentorTitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    metaText: {
        fontSize: fontSize.sm,
        color: colors.text,
        fontWeight: fontWeight.semibold,
    },
    metaTextMuted: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
    },
    mentorBio: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    // ── Skill Chips ────────────────────────────────
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    skillChip: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    skillText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    // ── Card Footer ────────────────────────────────
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingTop: spacing.sm,
        marginTop: spacing.xs,
    },
    freeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.successBg,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 5,
        borderRadius: borderRadius.full,
    },
    freeText: {
        fontSize: fontSize.xs,
        color: colors.successDark,
        fontWeight: fontWeight.bold,
    },
    bookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        ...shadows.xs,
    },
    bookBtnText: {
        color: colors.white,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
    },
    // ── Empty State ────────────────────────────────
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        gap: spacing.sm,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    emptySubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
    },
    clearFiltersBtn: {
        marginTop: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: colors.primaryBg,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
    },
    clearFiltersBtnText: {
        color: colors.primary,
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.sm,
    },
    // ── Filter Modal ────────────────────────────────
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        maxHeight: '85%',
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBody: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    filterSectionTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.full,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    filterChipTextActive: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
    },
    filterRangeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    filterRangeValue: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    clearBtn: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    clearBtnText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        fontWeight: fontWeight.semibold,
    },
    applyBtn: {
        flex: 2,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        ...shadows.primary,
    },
    applyBtnText: {
        fontSize: fontSize.md,
        color: colors.white,
        fontWeight: fontWeight.bold,
    },
});

export default MentorListScreen;
