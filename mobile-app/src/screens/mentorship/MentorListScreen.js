// Mentor List Screen - White Theme
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Avatar, Badge, Loading, Button } from '../../components/ui';
import { ScreenWrapper, Header } from '../../components/layout';
import { fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';

// White Theme Colors
const whiteTheme = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#FF6B35',
    success: '#10B981',
    warning: '#F59E0B',
    border: '#E5E7EB',
    white: '#FFFFFF',
};

const MentorListScreen = ({ navigation }) => {
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Technology', 'Business', 'Design', 'Marketing', 'Finance'];

    useEffect(() => {
        fetchMentors();
    }, []);

    useEffect(() => {
        filterMentors();
    }, [searchQuery, selectedCategory, mentors]);

    const fetchMentors = async () => {
        try {
            const response = await mentorshipAPI.getMentors();
            setMentors(response.data || response || []);
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
        let filtered = mentors;

        if (searchQuery) {
            filtered = filtered.filter(mentor =>
                mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mentor.expertise?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(mentor =>
                mentor.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        setFilteredMentors(filtered);
    };

    const renderMentorCard = ({ item: mentor }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('MentorDetail', { mentor })}
            activeOpacity={0.8}
        >
            <Card style={styles.mentorCard}>
                <View style={styles.mentorHeader}>
                    <Avatar
                        source={mentor.profileImage || mentor.avatar}
                        name={mentor.name}
                        size="lg"
                    />
                    <View style={styles.mentorInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.mentorName}>{mentor.name}</Text>
                            {mentor.verified && (
                                <Ionicons name="checkmark-circle" size={18} color={whiteTheme.primary} />
                            )}
                        </View>
                        <Text style={styles.mentorTitle}>{mentor.title || mentor.expertise}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color={whiteTheme.warning} />
                            <Text style={styles.rating}>{mentor.rating || '4.8'}</Text>
                            <Text style={styles.sessions}>({mentor.sessions || 0} sessions)</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.mentorBio} numberOfLines={2}>
                    {mentor.bio || mentor.description || 'Experienced professional ready to guide you.'}
                </Text>

                <View style={styles.skillsRow}>
                    {(mentor.skills || mentor.expertise?.split(',') || []).slice(0, 3).map((skill, index) => (
                        <Badge key={index} text={skill.trim()} variant="primary" size="sm" />
                    ))}
                    {(mentor.skills?.length || 0) > 3 && (
                        <Text style={styles.moreSkills}>+{mentor.skills.length - 3} more</Text>
                    )}
                </View>

                <View style={styles.mentorFooter}>
                    <View style={styles.freeContainer}>
                        <Ionicons name="gift" size={16} color={whiteTheme.success} />
                        <Text style={styles.freeText}>FREE SESSION</Text>
                    </View>
                    <Button
                        title="Book Now"
                        variant="gradient"
                        size="sm"
                        onPress={() => navigation.navigate('BookSession', { mentor })}
                    />
                </View>
            </Card>
        </TouchableOpacity>
    );

    if (loading) {
        return <Loading fullScreen text="Loading mentors..." />;
    }

    return (
        <View style={styles.container}>
            {/* Search Header */}
            <View style={styles.searchHeader}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={whiteTheme.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search mentors..."
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
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                selectedCategory === item && styles.categoryChipActive,
                            ]}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === item && styles.categoryTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.categoriesList}
                />
            </View>

            {/* Results Count */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
                </Text>
            </View>

            {/* Mentor List */}
            <FlatList
                data={filteredMentors}
                keyExtractor={(item) => item._id || item.id}
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
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteTheme.background,
    },
    searchHeader: {
        padding: spacing.md,
        paddingTop: spacing.xxl + 10,
        backgroundColor: whiteTheme.surface,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteTheme.background,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: fontSize.md,
        color: whiteTheme.text,
    },
    categoriesContainer: {
        backgroundColor: whiteTheme.surface,
        paddingBottom: spacing.md,
    },
    categoriesList: {
        paddingHorizontal: spacing.md,
    },
    categoryChip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: whiteTheme.background,
        marginRight: spacing.sm,
    },
    categoryChipActive: {
        backgroundColor: whiteTheme.primary,
    },
    categoryText: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        fontWeight: fontWeight.medium,
    },
    categoryTextActive: {
        color: whiteTheme.white,
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
    },
    mentorHeader: {
        flexDirection: 'row',
        marginBottom: spacing.md,
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
        fontWeight: fontWeight.semibold,
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
        fontWeight: fontWeight.semibold,
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
    moreSkills: {
        fontSize: fontSize.sm,
        color: whiteTheme.textMuted,
        alignSelf: 'center',
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
        backgroundColor: whiteTheme.success + '18',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    freeText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: whiteTheme.success,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: whiteTheme.text,
        marginTop: spacing.md,
    },
    emptyText: {
        fontSize: fontSize.md,
        color: whiteTheme.textSecondary,
        marginTop: spacing.xs,
    },
});

export default MentorListScreen;
