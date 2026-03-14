// MentorDetailScreen.js — Premium redesign with useTheme()
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, Share, Dimensions, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

const BRAND = '#5B5FEF';

const MentorAvatar = ({ mentor, size = 90 }) => {
    const colorList = ['#5B5FEF', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];
    const color = colorList[(mentor.displayName || mentor.name || '?').charCodeAt(0) % colorList.length];
    const initial = (mentor.displayName || mentor.name || '?').charAt(0).toUpperCase();
    if (mentor.profileImage || mentor.avatar) {
        return <Image source={{ uri: mentor.profileImage || mentor.avatar }} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 3, borderColor: '#fff' }} />;
    }
    return (
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' }}>
            <Text style={{ fontSize: size * 0.38, fontWeight: '800', color: '#fff' }}>{initial}</Text>
        </View>
    );
};

export default function MentorDetailScreen({ route, navigation }) {
    const { mentor } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [showAllBio, setShowAllBio] = useState(false);

    const bio = mentor.bio || 'Experienced professional dedicated to helping mentees achieve their career goals.';
    const socialLinks = mentor.socialLinks || {};

    const handleShare = async () => {
        await Share.share({ message: `Check out ${mentor.displayName || mentor.name} on SkillPilot!\n${mentor.tagline || ''}` });
    };

    return (
        <View style={[styles.root, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>

                {/* Hero */}
                <View style={styles.hero}>
                    {[240, 180, 120].map((r, i) => (
                        <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.05 + i * 0.03 }]} />
                    ))}
                    <View style={[styles.heroNav, { paddingTop: insets.top + 8 }]}>
                        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleBtn} onPress={handleShare}>
                            <Ionicons name="share-social-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.heroProfile}>
                        <View style={{ position: 'relative', marginBottom: 8 }}>
                            <MentorAvatar mentor={mentor} size={90} />
                            {mentor.isVerified && (
                                <View style={{ position: 'absolute', bottom: 2, right: 2, backgroundColor: '#fff', borderRadius: 12, padding: 1 }}>
                                    <Ionicons name="checkmark-circle" size={20} color={BRAND} />
                                </View>
                            )}
                        </View>
                        <Text style={styles.heroName}>{mentor.displayName || mentor.name}</Text>
                        <Text style={styles.heroSub}>{mentor.tagline || (mentor.targetingDomains || []).join(' · ')}</Text>
                        {mentor.location?.city && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
                                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{mentor.location.city}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.kpiRow}>
                        {[
                            { val: (mentor.averageRating || 0).toFixed(1), label: 'Rating', icon: 'star' },
                            { val: mentor.totalReviews || 0, label: 'Reviews', icon: 'chatbubble-outline' },
                            { val: mentor.totalMentees || 0, label: 'Mentees', icon: 'people-outline' },
                            { val: mentor.totalPlacements || 0, label: 'Placed', icon: 'briefcase-outline' },
                        ].map((k, i) => (
                            <View key={i} style={[styles.kpiItem, i < 3 && styles.kpiBorder]}>
                                <Ionicons name={k.icon} size={13} color="rgba(255,255,255,0.8)" />
                                <Text style={styles.kpiVal}>{k.val}</Text>
                                <Text style={styles.kpiLabel}>{k.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={[styles.wave, { backgroundColor: BRAND }]}>
                    <View style={[styles.waveCurve, { backgroundColor: theme.background }]} />
                </View>

                <View style={{ paddingHorizontal: 20, gap: 16 }}>
                    {/* About */}
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <View style={styles.cardHead}>
                            <View style={[styles.cardIcon, { backgroundColor: BRAND + '12' }]}><Ionicons name="person-outline" size={17} color={BRAND} /></View>
                            <Text style={[styles.cardTitle, { color: theme.text }]}>About</Text>
                        </View>
                        <Text style={[styles.bioText, { color: theme.textSecondary }]} numberOfLines={showAllBio ? undefined : 4}>{bio}</Text>
                        {bio.length > 200 && (
                            <TouchableOpacity onPress={() => setShowAllBio(!showAllBio)}>
                                <Text style={{ color: BRAND, fontWeight: '700', fontSize: 13, marginTop: 4 }}>{showAllBio ? 'Less' : 'Read more'}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Quick details */}
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <View style={styles.cardHead}>
                            <View style={[styles.cardIcon, { backgroundColor: BRAND + '12' }]}><Ionicons name="information-circle-outline" size={17} color={BRAND} /></View>
                            <Text style={[styles.cardTitle, { color: theme.text }]}>Details</Text>
                        </View>
                        <View style={{ gap: 0 }}>
                            {[
                                mentor.sessionDuration && { icon: 'time-outline', label: 'Session Duration', value: `${mentor.sessionDuration} min` },
                                mentor.sessionsPerWeek && { icon: 'calendar-outline', label: 'Sessions/Week', value: `${mentor.sessionsPerWeek}` },
                                mentor.pricingType && { icon: 'cash-outline', label: 'Pricing', value: mentor.pricingType.charAt(0).toUpperCase() + mentor.pricingType.slice(1) },
                                (mentor.languages || []).length > 0 && { icon: 'language-outline', label: 'Languages', value: mentor.languages.join(', ') },
                                (mentor.preferredMenteeType || []).length > 0 && { icon: 'people-outline', label: 'Best For', value: mentor.preferredMenteeType.join(', ') },
                            ].filter(Boolean).map((row, i) => (
                                <View key={i} style={[styles.infoRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.border }]}>
                                    <View style={[styles.infoIcon, { backgroundColor: BRAND + '10' }]}><Ionicons name={row.icon} size={16} color={BRAND} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 }}>{row.label}</Text>
                                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600', marginTop: 1 }}>{row.value}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Expertise */}
                    {(mentor.expertise || []).length > 0 && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <View style={styles.cardHead}>
                                <View style={[styles.cardIcon, { backgroundColor: '#10B981' + '12' }]}><Ionicons name="code-slash-outline" size={17} color="#10B981" /></View>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>Expertise</Text>
                            </View>
                            <View style={styles.tagWrap}>
                                {(mentor.expertise || []).map((s, i) => (
                                    <View key={i} style={[styles.tag, { backgroundColor: '#10B981' + '12', borderColor: '#10B981' + '30' }]}>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#10B981' }}>{s}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Domains */}
                    {(mentor.targetingDomains || []).length > 0 && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <View style={styles.cardHead}>
                                <View style={[styles.cardIcon, { backgroundColor: BRAND + '12' }]}><Ionicons name="layers-outline" size={17} color={BRAND} /></View>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>Target Domains</Text>
                            </View>
                            <View style={styles.tagWrap}>
                                {(mentor.targetingDomains || []).map((d, i) => (
                                    <View key={i} style={[styles.tag, { backgroundColor: BRAND + '10', borderColor: BRAND + '25' }]}>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: BRAND }}>{d}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Top companies */}
                    {mentor.referralsInTopCompanies && (mentor.topCompanies || []).length > 0 && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <View style={styles.cardHead}>
                                <View style={[styles.cardIcon, { backgroundColor: '#F59E0B15' }]}><Ionicons name="business-outline" size={17} color="#F59E0B" /></View>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>Referrals At</Text>
                            </View>
                            <View style={styles.tagWrap}>
                                {(mentor.topCompanies || []).map((c, i) => (
                                    <View key={i} style={[styles.tag, { backgroundColor: '#F59E0B12', borderColor: '#F59E0B30', flexDirection: 'row', gap: 4 }]}>
                                        <Ionicons name="business-outline" size={12} color="#D97706" />
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#D97706' }}>{c}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Trial session */}
                    {mentor.trialSession?.available && (
                        <View style={[styles.card, { backgroundColor: '#10B981' + '10', borderColor: '#10B981' + '30', flexDirection: 'row', alignItems: 'flex-start', gap: 12 }]}>
                            <Ionicons name="gift-outline" size={24} color="#10B981" />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 15, fontWeight: '700', color: '#10B981' }}>Free Trial Session {mentor.trialSession.price > 0 ? `@ ₹${mentor.trialSession.price}` : ''}</Text>
                                {mentor.trialSession.description ? <Text style={{ fontSize: 13, color: '#047857', marginTop: 4 }}>{mentor.trialSession.description}</Text> : null}
                            </View>
                        </View>
                    )}

                    {/* Pricing plans */}
                    {(mentor.pricingPlans || []).length > 0 && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <View style={styles.cardHead}>
                                <View style={[styles.cardIcon, { backgroundColor: BRAND + '12' }]}><Ionicons name="pricetag-outline" size={17} color={BRAND} /></View>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>Pricing Plans</Text>
                            </View>
                            <View style={{ gap: 10 }}>
                                {(mentor.pricingPlans || []).map((plan, i) => (
                                    <View key={i} style={[styles.planBox, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>{plan.duration}</Text>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 18, fontWeight: '900', color: BRAND }}>₹{plan.price}</Text>
                                                {plan.discountPercent > 0 && <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '600' }}>{plan.discountPercent}% off</Text>}
                                            </View>
                                        </View>
                                        {(plan.features || []).map((f, j) => (
                                            <View key={j} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                                <Text style={{ fontSize: 13, color: theme.textSecondary }}>{f}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Education */}
                    {(mentor.education || []).length > 0 && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <View style={styles.cardHead}>
                                <View style={[styles.cardIcon, { backgroundColor: '#EC489912' }]}><Ionicons name="school-outline" size={17} color="#EC4899" /></View>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>Education</Text>
                            </View>
                            <View style={{ gap: 8 }}>
                                {(mentor.education || []).map((edu, i) => (
                                    <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                                        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#EC4899', marginTop: 5 }} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>{edu.degree} in {edu.field}</Text>
                                            <Text style={{ fontSize: 13, color: theme.textMuted }}>{edu.institution}{edu.year ? ` · ${edu.year}` : ''}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Social links */}
                    {Object.values(socialLinks).some(Boolean) && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <View style={styles.cardHead}>
                                <View style={[styles.cardIcon, { backgroundColor: BRAND + '12' }]}><Ionicons name="link-outline" size={17} color={BRAND} /></View>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>Connect</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {[
                                    { key: 'linkedIn', icon: 'logo-linkedin', color: '#0A66C2' },
                                    { key: 'github', icon: 'logo-github', color: '#24292E' },
                                    { key: 'twitter', icon: 'logo-twitter', color: '#1DA1F2' },
                                    { key: 'portfolio', icon: 'globe-outline', color: '#6366F1' },
                                    { key: 'youtube', icon: 'logo-youtube', color: '#FF0000' },
                                ].filter(s => socialLinks[s.key]).map(s => (
                                    <TouchableOpacity key={s.key} style={[styles.socialBtn, { backgroundColor: s.color + '12', borderColor: s.color + '30' }]} onPress={() => Linking.openURL(socialLinks[s.key])}>
                                        <Ionicons name={s.icon} size={20} color={s.color} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Reviews */}
                    {(mentor.reviews || []).length > 0 && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <View style={styles.cardHead}>
                                <View style={[styles.cardIcon, { backgroundColor: '#F59E0B18' }]}><Ionicons name="star-outline" size={17} color="#F59E0B" /></View>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>Reviews</Text>
                                <Text style={{ marginLeft: 'auto', fontSize: 13, color: theme.textMuted }}>{mentor.totalReviews || 0} total</Text>
                            </View>
                            <View style={{ gap: 10 }}>
                                {(mentor.reviews || []).slice(0, 3).map((r, i) => (
                                    <View key={i} style={[styles.reviewBox, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                                        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 6 }}>
                                            {[1, 2, 3, 4, 5].map(s => <Ionicons key={s} name={s <= r.rating ? 'star' : 'star-outline'} size={12} color="#F59E0B" />)}
                                        </View>
                                        {r.comment ? <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 18 }}>{r.comment}</Text> : null}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Footer CTA */}
            <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <MentorAvatar mentor={mentor} size={38} />
                    <View>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }} numberOfLines={1}>{mentor.displayName || mentor.name}</Text>
                        <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                            {mentor.trialSession?.available ? '🎁 Free trial available' : mentor.pricingType === 'free' ? '✅ Free' : '💼 Paid'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate('BookSession', { mentor })} activeOpacity={0.85}>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Book Session</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    hero: { backgroundColor: BRAND, alignItems: 'center', overflow: 'hidden', gap: 4, minHeight: 280 },
    ring: { position: 'absolute', borderWidth: 1, borderColor: '#fff' },
    heroNav: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
    circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    heroProfile: { alignItems: 'center', paddingHorizontal: 20, gap: 4 },
    heroName: { fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center' },
    heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
    kpiRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 20, paddingTop: 14, width: '100%' },
    kpiItem: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6 },
    kpiBorder: { borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.2)' },
    kpiVal: { fontSize: 16, fontWeight: '900', color: '#fff' },
    kpiLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
    wave: { height: 36, overflow: 'hidden' },
    waveCurve: { height: 60, borderTopLeftRadius: 36, borderTopRightRadius: 36, marginTop: -24 },
    card: { borderRadius: 20, padding: 16, borderWidth: 1, gap: 10 },
    cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cardIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '700' },
    bioText: { fontSize: 14, lineHeight: 22 },
    tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    infoIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    planBox: { borderRadius: 14, padding: 14, borderWidth: 1 },
    socialBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    reviewBox: { borderRadius: 12, padding: 12, borderWidth: 1 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, gap: 12 },
    footerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: BRAND, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, shadowColor: BRAND, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});
