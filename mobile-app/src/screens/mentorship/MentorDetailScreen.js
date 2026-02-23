// MentorDetailScreen.js — Centralized-theme refactor
import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, SafeAreaView, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const MentorDetailScreen = ({ route, navigation }) => {
    const { mentor } = route.params;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${mentor.displayName || mentor.name} on SkillPilot! A ${mentor.tagline || mentor.jobTitle} with ${mentor.experience} years of experience.`,
            });
        } catch (error) {
            console.log('Share error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn} activeOpacity={0.75}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.iconBtn} activeOpacity={0.75}>
                    <Ionicons name="share-social-outline" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* ── Profile Card ── */}
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
                                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.name}>{mentor.displayName || mentor.name}</Text>
                    <Text style={styles.tagline}>{mentor.tagline || mentor.jobTitle}</Text>

                    <View style={styles.statsRow}>
                        {[
                            { value: mentor.averageRating?.toFixed(1) || '0.0', label: 'Rating', icon: 'star', iconColor: '#F59E0B' },
                            { value: mentor.totalReviews || 0, label: 'Reviews' },
                            { value: `${mentor.experience || 0}+`, label: 'Yrs Exp' },
                        ].map((stat, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <View style={styles.statDivider} />}
                                <View style={styles.statItem}>
                                    <View style={styles.statValueRow}>
                                        {stat.icon && (
                                            <Ionicons name={stat.icon} size={13} color={stat.iconColor} />
                                        )}
                                        <Text style={styles.statValue}>{stat.value}</Text>
                                    </View>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* ── About ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.bio}>
                        {mentor.bio || 'Highly experienced professional dedicated to helping mentees achieve their career goals and master new skills.'}
                    </Text>
                </View>

                {/* ── Expertise ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Expertise</Text>
                    <View style={styles.chipContainer}>
                        {(mentor.expertise || mentor.targetingDomains || []).map((skill, i) => (
                            <View key={i} style={styles.chip}>
                                <Text style={styles.chipText}>{skill.trim()}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Companies ── */}
                {mentor.companiesWorked?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Worked At</Text>
                        <View style={styles.chipContainer}>
                            {mentor.companiesWorked.map((company, i) => (
                                <View key={i} style={[styles.chip, styles.companyChip]}>
                                    <Ionicons name="business-outline" size={13} color={colors.textSecondary} />
                                    <Text style={styles.chipText}>{company}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* ── Pricing Card ── */}
                <View style={[styles.section, styles.pricingCard]}>
                    <View style={styles.pricingHeader}>
                        <View>
                            <Text style={styles.pricingTitle}>Mentorship Settings</Text>
                            <Text style={styles.pricingSubtitle}>
                                {mentor.isFree ? 'Promotional pricing active' : 'Standard session rates'}
                            </Text>
                        </View>
                        <View style={styles.priceBadge}>
                            <Text style={styles.priceValue}>{mentor.isFree ? 'FREE' : 'Paid'}</Text>
                        </View>
                    </View>

                    {[
                        { icon: 'time-outline', text: `${mentor.sessionDuration || 60} Min Sessions` },
                        { icon: 'videocam-outline', text: '1-on-1 Personalized Guidance' },
                        { icon: 'chatbubbles-outline', text: 'Unlimited Support for Mentees' },
                    ].map((row, i) => (
                        <View key={i} style={styles.featureRow}>
                            <Ionicons name={row.icon} size={19} color={colors.primary} />
                            <Text style={styles.featureText}>{row.text}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 110 }} />
            </ScrollView>

            {/* ── Footer CTA ── */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('BookSession', { mentor })}
                    activeOpacity={0.85}
                >
                    <Text style={styles.bookBtnText}>Book a Free Session</Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.white} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
    },
    // ── Profile Card ──────────────────────────────
    profileCard: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xxl,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 4,
        borderColor: colors.white,
        ...shadows.md,
    },
    avatarPlaceholder: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 38,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 2,
        ...shadows.xs,
    },
    name: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
    },
    tagline: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.lg,
        paddingHorizontal: spacing.xl,
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        gap: 3,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    statValue: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: colors.border,
    },
    // ── Content Sections ──────────────────────────
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    bio: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    companyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    chipText: {
        fontSize: fontSize.sm,
        color: colors.text,
        fontWeight: fontWeight.medium,
    },
    // ── Pricing Card ──────────────────────────────
    pricingCard: {
        backgroundColor: colors.primaryBg,
        padding: spacing.lg,
        borderRadius: borderRadius.xxl,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
    },
    pricingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    pricingTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    pricingSubtitle: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    priceBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 5,
        borderRadius: borderRadius.md,
    },
    priceValue: {
        color: colors.white,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.sm,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.sm,
    },
    featureText: {
        fontSize: fontSize.md,
        color: colors.text,
        fontWeight: fontWeight.medium,
    },
    // ── Footer ────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.md,
        paddingBottom: spacing.xl + spacing.xs,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    bookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: borderRadius.xl,
        gap: spacing.sm,
        ...shadows.primary,
    },
    bookBtnText: {
        color: colors.white,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
    },
});

export default MentorDetailScreen;
