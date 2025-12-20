// Mentor Detail Screen - Modern White Theme
import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, SafeAreaView, Dimensions, Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

const uiTheme = {
    primary: '#FF6B35',
    primaryLight: '#FF6B3515',
    secondary: '#1A1A2E',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    white: '#FFFFFF',
    success: '#10B981',
};

const MentorDetailScreen = ({ route, navigation }) => {
    const { mentor } = route.params;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${mentor.displayName || mentor.name} on SkillPilot! A ${mentor.tagline || mentor.jobTitle} with ${mentor.experience} years of experience.`,
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={uiTheme.text} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
                        <Ionicons name="share-social-outline" size={22} color={uiTheme.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {(mentor.profileImage || mentor.avatar) ? (
                            <Image
                                source={{ uri: mentor.profileImage || mentor.avatar }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarInitial}>
                                    {(mentor.displayName || mentor.name || '?').charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                        {mentor.badge === 'verified' && (
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={18} color={uiTheme.primary} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.name}>{mentor.displayName || mentor.name}</Text>
                    <Text style={styles.tagline}>{mentor.tagline || mentor.jobTitle}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{mentor.averageRating?.toFixed(1) || '0.0'}</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={12} color="#F59E0B" />
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{mentor.totalReviews || 0}</Text>
                            <Text style={styles.statLabel}>Reviews</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{mentor.experience || 0}+</Text>
                            <Text style={styles.statLabel}>Years Exp</Text>
                        </View>
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.bio}>
                        {mentor.bio || 'Highly experienced professional dedicated to helping mentees achieve their career goals and master new skills.'}
                    </Text>
                </View>

                {/* Expertise Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Expertise</Text>
                    <View style={styles.chipContainer}>
                        {(mentor.expertise || mentor.targetingDomains || []).map((skill, index) => (
                            <View key={index} style={styles.chip}>
                                <Text style={styles.chipText}>{skill.trim()}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Companies Worked */}
                {mentor.companiesWorked && mentor.companiesWorked.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Worked At</Text>
                        <View style={styles.chipContainer}>
                            {mentor.companiesWorked.map((company, index) => (
                                <View key={index} style={[styles.chip, styles.companyChip]}>
                                    <Ionicons name="business-outline" size={14} color={uiTheme.textSecondary} style={{ marginRight: 4 }} />
                                    <Text style={styles.chipText}>{company}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Pricing / Session Info */}
                <View style={[styles.section, styles.pricingCard]}>
                    <View style={styles.pricingHeader}>
                        <View>
                            <Text style={styles.pricingTitle}>Mentorship Setting</Text>
                            <Text style={styles.pricingSubtitle}>
                                {mentor.isFree ? 'Promotional pricing active' : 'Standard session rates'}
                            </Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceValue}>{mentor.isFree ? 'FREE' : 'Paid'}</Text>
                        </View>
                    </View>

                    <View style={styles.featureRow}>
                        <Ionicons name="time-outline" size={20} color={uiTheme.primary} />
                        <Text style={styles.featureText}>{mentor.sessionDuration || 60} Min Sessions</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <Ionicons name="videocam-outline" size={20} color={uiTheme.primary} />
                        <Text style={styles.featureText}>1-on-1 Personalized Guidance</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <Ionicons name="chatbubbles-outline" size={20} color={uiTheme.primary} />
                        <Text style={styles.featureText}>Unlimited Support for Mentees</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('BookSession', { mentor })}
                >
                    <Text style={styles.bookBtnText}>Book a Free Session</Text>
                    <Ionicons name="arrow-forward" size={20} color={uiTheme.white} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: uiTheme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        height: 60,
        alignItems: 'center',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: uiTheme.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: uiTheme.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
    },
    profileCard: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        backgroundColor: uiTheme.surface,
        borderRadius: 24,
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: uiTheme.white,
    },
    avatarPlaceholder: {
        backgroundColor: uiTheme.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 40,
        fontWeight: '700',
        color: uiTheme.white,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: uiTheme.white,
        borderRadius: 12,
        padding: 2,
    },
    name: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        color: uiTheme.text,
    },
    tagline: {
        fontSize: fontSize.md,
        color: uiTheme.textSecondary,
        marginTop: 4,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xl,
        paddingHorizontal: spacing.xl,
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: fontSize.lg,
        fontWeight: '700',
        color: uiTheme.text,
    },
    statLabel: {
        fontSize: 12,
        color: uiTheme.textSecondary,
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: uiTheme.border,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: '700',
        color: uiTheme.text,
        marginBottom: spacing.md,
    },
    bio: {
        fontSize: fontSize.md,
        color: uiTheme.textSecondary,
        lineHeight: 24,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        backgroundColor: uiTheme.surface,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: uiTheme.border,
    },
    companyChip: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipText: {
        fontSize: 14,
        color: uiTheme.text,
        fontWeight: '500',
    },
    pricingCard: {
        backgroundColor: uiTheme.primaryLight,
        padding: spacing.lg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: uiTheme.primary + '20',
    },
    pricingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    pricingTitle: {
        fontSize: fontSize.md,
        fontWeight: '700',
        color: uiTheme.primary,
    },
    pricingSubtitle: {
        fontSize: 12,
        color: uiTheme.textSecondary,
        marginTop: 2,
    },
    priceContainer: {
        backgroundColor: uiTheme.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    priceValue: {
        color: uiTheme.white,
        fontWeight: '700',
        fontSize: 12,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.sm,
    },
    featureText: {
        fontSize: 14,
        color: uiTheme.text,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.md,
        paddingBottom: 30,
        backgroundColor: uiTheme.white,
        borderTopWidth: 1,
        borderTopColor: uiTheme.border,
    },
    bookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: uiTheme.primary,
        height: 56,
        borderRadius: 16,
        gap: spacing.sm,
        elevation: 4,
        shadowColor: uiTheme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    bookBtnText: {
        color: uiTheme.white,
        fontSize: fontSize.lg,
        fontWeight: '700',
    },
});

export default MentorDetailScreen;
