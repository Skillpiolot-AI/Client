// Mentor List Screen - White Theme with Advanced Filters
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
    RefreshControl, Modal, ScrollView, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';

// White Theme Colors
const whiteTheme = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceAlt: '#F1F3F5',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#FF6B35',
    primaryLight: '#FF6B3520',
    success: '#10B981',
    successLight: '#10B98118',
    warning: '#F59E0B',
    border: '#E5E7EB',
    white: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.5)',
};

// Filter domains
const DOMAINS = [
    'Frontend', 'Backend', 'Fullstack',
    'DevOps / Cloud', 'QA / Testing',
    'Data Science / AI', 'Data Analyst',
    'Mobile Dev', 'System Design'
];

// Mentee types / Offering
const MENTEE_TYPES = [
    'Fresher',
    'Working Professional',
    'Student',
    'Career Switch'
];

const MentorListScreen = ({ navigation }) => {
    // User context - disabled for now
    const user = null;
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedMenteeType, setSelectedMenteeType] = useState('');
    const [priceRange, setPriceRange] = useState(40000);
    const [experienceRange, setExperienceRange] = useState(15);
    const [sortBy, setSortBy] = useState('recommended');

    // Active filter count
    const activeFilterCount = selectedDomains.length +
        (selectedMenteeType ? 1 : 0) +
        (priceRange < 40000 ? 1 : 0) +
        (experienceRange < 15 ? 1 : 0);

    useEffect(() => {
        fetchMentors();
    }, []);

    useEffect(() => {
        filterMentors();
    }, [searchQuery, selectedDomains, selectedMenteeType, priceRange, experienceRange, sortBy, mentors]);

    const fetchMentors = async () => {
        try {
            const response = await mentorshipAPI.getMentors();
            // API returns: { mentors: [...], pagination: {...}, filters: {...} }
            // mentorshipAPI.getMentors() returns response.data directly
            console.log('Mentors API response:', Object.keys(response || {}));
            const mentorData = response?.mentors || response?.data?.mentors || response || [];
            console.log('Mentor count:', mentorData.length);
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

        // Hide self if logged in as mentor
        if (user?.id || user?._id) {
            const userId = user.id || user._id;
            filtered = filtered.filter(mentor => {
                const mentorUserId = mentor.userId?._id || mentor.userId || mentor._id;
                return mentorUserId !== userId;
            });
        }

        // Search filter
        if (searchQuery) {
            const term = searchQuery.toLowerCase();
            filtered = filtered.filter(mentor =>
                (mentor.displayName || mentor.name || '').toLowerCase().includes(term) ||
                (mentor.expertise || mentor.tagline || '').toLowerCase().includes(term) ||
                (mentor.targetingDomains || []).some(d => d.toLowerCase().includes(term))
            );
        }

        // Domain filter
        if (selectedDomains.length > 0) {
            filtered = filtered.filter(mentor => {
                const mentorDomains = (mentor.targetingDomains || []).map(d => d.toLowerCase());
                return selectedDomains.some(domain =>
                    mentorDomains.some(d => d.includes(domain.toLowerCase()) || domain.toLowerCase().includes(d))
                );
            });
        }

        // Mentee type filter
        if (selectedMenteeType) {
            filtered = filtered.filter(mentor => {
                const types = (mentor.preferredMenteeType || []).map(t => t.toLowerCase());
                return types.some(t => t.includes(selectedMenteeType.toLowerCase()));
            });
        }

        // Experience filter
        if (experienceRange < 15) {
            filtered = filtered.filter(mentor => {
                const exp = parseInt(mentor.experience) || 0;
                return exp <= experienceRange;
            });
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
                // Recommended - featured first
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return (b.averageRating || 0) - (a.averageRating || 0);
                });
        }

        setFilteredMentors(filtered);
    };

    const toggleDomain = (domain) => {
        setSelectedDomains(prev =>
            prev.includes(domain)
                ? prev.filter(d => d !== domain)
                : [...prev, domain]
        );
    };

    const clearAllFilters = () => {
        setSelectedDomains([]);
        setSelectedMenteeType('');
        setPriceRange(40000);
        setExperienceRange(15);
        setSortBy('recommended');
    };

    const renderMentorCard = ({ item: mentor }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('MentorDetail', { mentor })}
            activeOpacity={0.8}
        >
            <View style={styles.mentorCard}>
                <View style={styles.mentorHeader}>
                    {(mentor.profileImage || mentor.avatar) ? (
                        <Image
                            source={{ uri: mentor.profileImage || mentor.avatar }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {(mentor.displayName || mentor.name || '?').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.mentorInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.mentorName}>{mentor.displayName || mentor.name}</Text>
                            {mentor.verified && (
                                <Ionicons name="checkmark-circle" size={18} color={whiteTheme.primary} />
                            )}
                        </View>
                        <Text style={styles.mentorTitle} numberOfLines={1}>
                            {mentor.tagline || mentor.expertise || mentor.jobTitle}
                        </Text>
                        <View style={styles.ratingRow}>
                            {mentor.averageRating > 0 ? (
                                <>
                                    <Ionicons name="star" size={14} color={whiteTheme.warning} />
                                    <Text style={styles.rating}>{mentor.averageRating.toFixed(1)}</Text>
                                    <Text style={styles.sessions}>({mentor.totalReviews || 0} reviews)</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="sparkles-outline" size={14} color={whiteTheme.primary} />
                                    <Text style={[styles.rating, { color: whiteTheme.primary }]}>New</Text>
                                </>
                            )}
                            <Text style={styles.sessions}>• {mentor.experience || 0} yrs</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.mentorBio} numberOfLines={2}>
                    {mentor.bio || 'Experienced professional ready to guide you on your career journey.'}
                </Text>

                <View style={styles.skillsRow}>
                    {(mentor.targetingDomains || mentor.expertise?.split(',') || []).slice(0, 3).map((skill, index) => (
                        <View key={index} style={styles.skillChip}>
                            <Text style={styles.skillText}>{skill.trim()}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.mentorFooter}>
                    <View style={styles.freeContainer}>
                        <Ionicons name="gift" size={16} color={whiteTheme.success} />
                        <Text style={styles.freeText}>FREE SESSION</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={() => navigation.navigate('BookSession', { mentor })}
                    >
                        <Text style={styles.bookBtnText}>Book Now</Text>
                        <Ionicons name="arrow-forward" size={16} color={whiteTheme.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Filter Modal
    const FilterModal = () => (
        <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilterModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                            <Ionicons name="close" size={24} color={whiteTheme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                        {/* Sort By */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Sort By</Text>
                            <View style={styles.sortOptions}>
                                {[
                                    { value: 'recommended', label: 'Recommended' },
                                    { value: 'rating', label: 'Highest Rated' },
                                    { value: 'experience', label: 'Most Experienced' },
                                ].map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[styles.sortChip, sortBy === option.value && styles.sortChipActive]}
                                        onPress={() => setSortBy(option.value)}
                                    >
                                        <Text style={[styles.sortChipText, sortBy === option.value && styles.sortChipTextActive]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Domain Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Domain</Text>
                            <View style={styles.domainGrid}>
                                {DOMAINS.map((domain) => (
                                    <TouchableOpacity
                                        key={domain}
                                        style={[
                                            styles.domainChip,
                                            selectedDomains.includes(domain) && styles.domainChipActive
                                        ]}
                                        onPress={() => toggleDomain(domain)}
                                    >
                                        <Text style={[
                                            styles.domainText,
                                            selectedDomains.includes(domain) && styles.domainTextActive
                                        ]}>
                                            {domain}
                                        </Text>
                                        {selectedDomains.includes(domain) && (
                                            <Ionicons name="checkmark" size={14} color={whiteTheme.white} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Offering For */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Offering Mentorship For</Text>
                            <View style={styles.menteeOptions}>
                                <TouchableOpacity
                                    style={[styles.menteeChip, !selectedMenteeType && styles.menteeChipActive]}
                                    onPress={() => setSelectedMenteeType('')}
                                >
                                    <Text style={[styles.menteeText, !selectedMenteeType && styles.menteeTextActive]}>
                                        All Types
                                    </Text>
                                </TouchableOpacity>
                                {MENTEE_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.menteeChip,
                                            selectedMenteeType === type && styles.menteeChipActive
                                        ]}
                                        onPress={() => setSelectedMenteeType(type)}
                                    >
                                        <Text style={[
                                            styles.menteeText,
                                            selectedMenteeType === type && styles.menteeTextActive
                                        ]}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Experience Range */}
                        <View style={styles.filterSection}>
                            <View style={styles.rangeHeader}>
                                <Text style={styles.filterSectionTitle}>Max Experience</Text>
                                <Text style={styles.rangeValue}>
                                    {experienceRange}{experienceRange === 15 ? '+' : ''} years
                                </Text>
                            </View>
                            <View style={styles.rangeRow}>
                                {[3, 5, 8, 10, 15].map((val) => (
                                    <TouchableOpacity
                                        key={val}
                                        style={[styles.rangeBtn, experienceRange === val && styles.rangeBtnActive]}
                                        onPress={() => setExperienceRange(val)}
                                    >
                                        <Text style={[styles.rangeBtnText, experienceRange === val && styles.rangeBtnTextActive]}>
                                            {val}{val === 15 ? '+' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Modal Footer */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.clearBtn} onPress={clearAllFilters}>
                            <Text style={styles.clearBtnText}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => setShowFilterModal(false)}
                        >
                            <Text style={styles.applyBtnText}>
                                Apply Filters ({filteredMentors.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={whiteTheme.primary} />
                <Text style={styles.loadingText}>Loading mentors...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Header */}
            <View style={styles.searchHeader}>
                <Text style={styles.headerTitle}>Find Mentors</Text>
                <View style={styles.searchRow}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color={whiteTheme.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name, skill, domain..."
                            placeholderTextColor={whiteTheme.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color={whiteTheme.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Filter Button */}
                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <Ionicons
                            name="options-outline"
                            size={22}
                            color={activeFilterCount > 0 ? whiteTheme.white : whiteTheme.text}
                        />
                        {activeFilterCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Active Filters */}
                {(selectedDomains.length > 0 || selectedMenteeType) && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.activeFilters}
                    >
                        {selectedDomains.map((domain) => (
                            <TouchableOpacity
                                key={domain}
                                style={styles.activeFilterChip}
                                onPress={() => toggleDomain(domain)}
                            >
                                <Text style={styles.activeFilterText}>{domain}</Text>
                                <Ionicons name="close" size={14} color={whiteTheme.primary} />
                            </TouchableOpacity>
                        ))}
                        {selectedMenteeType && (
                            <TouchableOpacity
                                style={styles.activeFilterChip}
                                onPress={() => setSelectedMenteeType('')}
                            >
                                <Text style={styles.activeFilterText}>{selectedMenteeType}</Text>
                                <Ionicons name="close" size={14} color={whiteTheme.primary} />
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                )}
            </View>

            {/* Results Count */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} available
                </Text>
            </View>

            {/* Mentor List */}
            <FlatList
                data={filteredMentors}
                keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                renderItem={renderMentorCard}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={whiteTheme.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color={whiteTheme.textMuted} />
                        <Text style={styles.emptyTitle}>No mentors found</Text>
                        <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
                        {activeFilterCount > 0 && (
                            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearAllFilters}>
                                <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            {/* Filter Modal */}
            <FilterModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteTheme.background,
    },
    searchHeader: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xxl + 10,
        paddingBottom: spacing.md,
        backgroundColor: whiteTheme.white,
        borderBottomWidth: 1,
        borderBottomColor: whiteTheme.border,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: whiteTheme.text,
        marginBottom: spacing.md,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: fontSize.md,
        color: whiteTheme.text,
    },
    filterBtn: {
        width: 48,
        height: 48,
        backgroundColor: whiteTheme.surface,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    filterBtnActive: {
        backgroundColor: whiteTheme.primary,
        borderColor: whiteTheme.primary,
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: whiteTheme.success,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: whiteTheme.white,
    },
    activeFilters: {
        marginTop: spacing.sm,
    },
    activeFilterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: spacing.xs,
        gap: 4,
    },
    activeFilterText: {
        fontSize: 13,
        color: whiteTheme.primary,
        fontWeight: '500',
    },
    resultsHeader: {
        padding: spacing.md,
        paddingBottom: spacing.sm,
    },
    resultsCount: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
    },
    list: {
        padding: spacing.md,
        paddingTop: 0,
        paddingBottom: 100,
    },
    mentorCard: {
        marginBottom: spacing.md,
        backgroundColor: whiteTheme.white,
        borderRadius: 16,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    mentorHeader: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    avatarImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: whiteTheme.surface,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: whiteTheme.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: whiteTheme.white,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: whiteTheme.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: fontSize.md,
        color: whiteTheme.textSecondary,
    },
    mentorInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    mentorName: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: whiteTheme.text,
    },
    mentorTitle: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: spacing.xs,
    },
    rating: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: whiteTheme.text,
    },
    sessions: {
        fontSize: fontSize.sm,
        color: whiteTheme.textMuted,
    },
    mentorBio: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    skillChip: {
        backgroundColor: whiteTheme.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    skillText: {
        fontSize: 12,
        color: whiteTheme.textSecondary,
    },
    mentorFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: whiteTheme.border,
    },
    freeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.successLight,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    freeText: {
        fontSize: fontSize.sm,
        fontWeight: '700',
        color: whiteTheme.success,
    },
    bookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    bookBtnText: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: whiteTheme.white,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: whiteTheme.text,
        marginTop: spacing.md,
    },
    emptyText: {
        fontSize: fontSize.md,
        color: whiteTheme.textSecondary,
        marginTop: spacing.xs,
    },
    clearFiltersBtn: {
        marginTop: spacing.md,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: whiteTheme.primaryLight,
        borderRadius: 8,
    },
    clearFiltersBtnText: {
        color: whiteTheme.primary,
        fontWeight: '600',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: whiteTheme.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: whiteTheme.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: whiteTheme.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: whiteTheme.text,
    },
    modalScroll: {
        padding: spacing.md,
    },
    filterSection: {
        marginBottom: spacing.lg,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: whiteTheme.text,
        marginBottom: spacing.sm,
    },
    sortOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    sortChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: whiteTheme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    sortChipActive: {
        backgroundColor: whiteTheme.primary,
        borderColor: whiteTheme.primary,
    },
    sortChipText: {
        fontSize: 13,
        color: whiteTheme.textSecondary,
    },
    sortChipTextActive: {
        color: whiteTheme.white,
        fontWeight: '600',
    },
    domainGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    domainChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: whiteTheme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: whiteTheme.border,
        gap: 4,
    },
    domainChipActive: {
        backgroundColor: whiteTheme.primary,
        borderColor: whiteTheme.primary,
    },
    domainText: {
        fontSize: 13,
        color: whiteTheme.textSecondary,
    },
    domainTextActive: {
        color: whiteTheme.white,
        fontWeight: '500',
    },
    menteeOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    menteeChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: whiteTheme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    menteeChipActive: {
        backgroundColor: whiteTheme.primary,
        borderColor: whiteTheme.primary,
    },
    menteeText: {
        fontSize: 13,
        color: whiteTheme.textSecondary,
    },
    menteeTextActive: {
        color: whiteTheme.white,
        fontWeight: '500',
    },
    rangeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    rangeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: whiteTheme.primary,
    },
    rangeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    rangeBtn: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: whiteTheme.surface,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    rangeBtnActive: {
        backgroundColor: whiteTheme.primary,
        borderColor: whiteTheme.primary,
    },
    rangeBtnText: {
        fontSize: 13,
        color: whiteTheme.textSecondary,
    },
    rangeBtnTextActive: {
        color: whiteTheme.white,
        fontWeight: '600',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: whiteTheme.border,
    },
    clearBtn: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: whiteTheme.surface,
        borderRadius: 12,
        alignItems: 'center',
    },
    clearBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: whiteTheme.textSecondary,
    },
    applyBtn: {
        flex: 2,
        paddingVertical: 14,
        backgroundColor: whiteTheme.primary,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: whiteTheme.white,
    },
});

export default MentorListScreen;
