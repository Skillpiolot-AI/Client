// RiasecResultScreen.js — Shows RIASEC result with radar scores, careers, history
import React, { useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const BRAND = '#5B5FEF';

const TRAITS = {
    R: { name: 'Realistic', color: '#F59E0B', icon: 'construct-outline', careers: ['Mechanical Engineer', 'Electrician', 'Pilot', 'Surgeon', 'Athletic Trainer', 'Architect'] },
    I: { name: 'Investigative', color: '#5B5FEF', icon: 'flask-outline', careers: ['Data Scientist', 'Research Scientist', 'Physician', 'Psychologist', 'Economist', 'Astronomer'] },
    A: { name: 'Artistic', color: '#EC4899', icon: 'color-palette-outline', careers: ['Graphic Designer', 'Writer', 'Musician', 'Actor', 'Fashion Designer', 'UX Designer'] },
    S: { name: 'Social', color: '#10B981', icon: 'people-outline', careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker', 'HR Manager', 'Therapist'] },
    E: { name: 'Enterprising', color: '#EF4444', icon: 'trending-up-outline', careers: ['Entrepreneur', 'Sales Manager', 'Marketing Director', 'Lawyer', 'Real Estate Agent', 'CEO'] },
    C: { name: 'Conventional', color: '#6366F1', icon: 'grid-outline', careers: ['Accountant', 'Financial Analyst', 'Office Manager', 'Data Analyst', 'Auditor', 'Administrative Manager'] },
};

const DOMAIN_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];

// Simple horizontal bar chart for each trait
const TraitBar = ({ code, pct, isTop, theme }) => {
    const t = TRAITS[code];
    return (
        <View style={styles.barRow}>
            <View style={[styles.barIconBox, { backgroundColor: t.color + '18' }]}>
                <Ionicons name={t.icon} size={16} color={t.color} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.barLabelRow}>
                    <Text style={[styles.barLabel, { color: theme.text }]}>{t.name}</Text>
                    <Text style={[styles.barPct, { color: isTop ? t.color : theme.textMuted }]}>{pct}%</Text>
                </View>
                <View style={[styles.barTrack, { backgroundColor: theme.surfaceAlt }]}>
                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: t.color, opacity: isTop ? 1 : 0.5 }]} />
                </View>
            </View>
            {isTop && <View style={[styles.topBadge, { backgroundColor: t.color }]}><Text style={styles.topBadgeText}>★</Text></View>}
        </View>
    );
};

export default function RiasecResultScreen({ navigation, route }) {
    const { result } = route.params || {};
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const results = result?.results || result;
    const percentages = results?.percentages || {};
    const hollandCode = results?.hollandCode || '---';
    const topThree = results?.topThreeDomains || [];
    const careers = results?.recommendedCareers || [];
    const completedAt = result?.completedAt ? new Date(result.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just completed';

    const handleShare = useCallback(async () => {
        try {
            await Share.share({
                message: `My RIASEC Holland Code is ${hollandCode}! \nTop traits: ${topThree.map(t => TRAITS[t]?.name).join(', ')}.\nDiscover your career path with SkillPilot!`,
            });
        } catch (e) { /* ignore */ }
    }, [hollandCode, topThree]);

    return (
        <View style={[styles.root, { backgroundColor: theme.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            >
                {/* Hero header */}
                <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
                    {[180, 130, 80].map((r, i) => (
                        <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.06 + i * 0.03 }]} />
                    ))}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Assessment')}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.heroEyebrow}>your holland code</Text>
                    <View style={styles.codeBox}>
                        {hollandCode.split('').map((c, i) => (
                            <View key={i} style={[styles.codeLetter, { backgroundColor: TRAITS[c]?.color || '#fff', borderColor: 'rgba(255,255,255,0.4)' }]}>
                                <Text style={styles.codeLetterText}>{c}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.codeNames}>
                        {topThree.map(c => TRAITS[c]?.name).filter(Boolean).join(' · ')}
                    </Text>
                    <Text style={styles.heroDate}>{completedAt}</Text>

                    <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={16} color={BRAND} />
                        <Text style={styles.shareBtnText}>Share Result</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.waveBox}><View style={[styles.waveCurve, { backgroundColor: theme.background }]} /></View>

                <View style={{ paddingHorizontal: 20, gap: 24, marginTop: 4 }}>
                    {/* Trait breakdown */}
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Trait Breakdown</Text>
                        <View style={{ gap: 14 }}>
                            {DOMAIN_ORDER.map(code => (
                                <TraitBar
                                    key={code}
                                    code={code}
                                    pct={percentages[code] || 0}
                                    isTop={topThree.includes(code)}
                                    theme={theme}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Top 3 sections */}
                    {topThree.map((code, idx) => {
                        const t = TRAITS[code];
                        if (!t) return null;
                        return (
                            <View key={code} style={[styles.traitCard, { backgroundColor: t.color + '10', borderColor: t.color + '30' }]}>
                                <View style={styles.traitCardHeader}>
                                    <View style={[styles.traitCardIcon, { backgroundColor: t.color + '20' }]}>
                                        <Ionicons name={t.icon} size={20} color={t.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.traitCardBadge, { color: t.color }]}>#{idx + 1} Trait</Text>
                                        <Text style={[styles.traitCardName, { color: theme.text }]}>{t.name}</Text>
                                    </View>
                                    <Text style={[styles.traitCardPct, { color: t.color }]}>{percentages[code] || 0}%</Text>
                                </View>
                                <Text style={[styles.traitCardSub, { color: theme.textSecondary }]}>Career matches:</Text>
                                <View style={styles.careerChips}>
                                    {t.careers.slice(0, 4).map(career => (
                                        <View key={career} style={[styles.careerChip, { backgroundColor: t.color + '18' }]}>
                                            <Text style={[styles.careerChipText, { color: t.color }]}>{career}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    })}

                    {/* Server-matched careers */}
                    {careers.length > 0 && (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <Text style={[styles.cardTitle, { color: theme.text }]}>Career Recommendations</Text>
                            <Text style={[styles.cardSub, { color: theme.textMuted }]}>Based on your Holland Code from our career database</Text>
                            {careers.slice(0, 8).map((career, idx) => (
                                <View key={career.careerId || idx} style={[styles.careerRow, { borderBottomColor: theme.border }]}>
                                    <View style={[styles.careerRank, { backgroundColor: BRAND + '18' }]}>
                                        <Text style={[styles.careerRankText, { color: BRAND }]}>#{idx + 1}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.careerName, { color: theme.text }]}>{career.name}</Text>
                                        <Text style={[styles.careerCluster, { color: theme.textMuted }]}>{career.cluster}</Text>
                                    </View>
                                    <View style={[styles.matchBadge, { backgroundColor: career.matchScore >= 70 ? '#ECFDF5' : '#FEF9C3' }]}>
                                        <Text style={[styles.matchText, { color: career.matchScore >= 70 ? '#065F46' : '#854D0E' }]}>{career.matchScore}%</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Retake + History buttons */}
                    <TouchableOpacity style={styles.retakeBtn} onPress={() => navigation.replace('RiasecAssessment')}>
                        <Ionicons name="refresh-outline" size={18} color="#fff" />
                        <Text style={styles.retakeBtnText}>Retake Assessment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.historyBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                        onPress={() => navigation.navigate('Assessment')}
                    >
                        <Ionicons name="time-outline" size={18} color={BRAND} />
                        <Text style={[styles.historyBtnText, { color: BRAND }]}>View History</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    hero: { backgroundColor: BRAND, paddingHorizontal: 20, paddingBottom: 0, alignItems: 'center', overflow: 'hidden', gap: 8, minHeight: 260 },
    ring: { position: 'absolute', borderWidth: 1, borderColor: '#fff' },
    backBtn: { position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    heroEyebrow: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.5 },
    codeBox: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    codeLetter: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    codeLetterText: { fontSize: 22, fontWeight: '900', color: '#fff' },
    codeNames: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
    heroDate: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
    shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 12 },
    shareBtnText: { fontSize: 13, fontWeight: '700', color: BRAND },
    waveBox: { height: 40, overflow: 'hidden', backgroundColor: BRAND },
    waveCurve: { height: 70, borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30 },
    card: { borderRadius: 18, padding: 18, borderWidth: 1, gap: 14 },
    cardTitle: { fontSize: 17, fontWeight: '700' },
    cardSub: { fontSize: 13, marginTop: -10 },
    traitCard: { borderRadius: 18, padding: 16, borderWidth: 1, gap: 10 },
    traitCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    traitCardIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    traitCardBadge: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    traitCardName: { fontSize: 18, fontWeight: '700' },
    traitCardPct: { fontSize: 22, fontWeight: '900' },
    traitCardSub: { fontSize: 13, fontWeight: '600' },
    careerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    careerChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    careerChipText: { fontSize: 12, fontWeight: '600' },
    barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    barIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    barLabel: { fontSize: 13, fontWeight: '600' },
    barPct: { fontSize: 13, fontWeight: '700' },
    barTrack: { height: 7, borderRadius: 4, overflow: 'hidden' },
    barFill: { height: 7, borderRadius: 4 },
    topBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    topBadgeText: { fontSize: 10, color: '#fff' },
    careerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
    careerRank: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    careerRankText: { fontSize: 12, fontWeight: '700' },
    careerName: { fontSize: 14, fontWeight: '600' },
    careerCluster: { fontSize: 12 },
    matchBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    matchText: { fontSize: 13, fontWeight: '700' },
    retakeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: BRAND, height: 52, borderRadius: 26, shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
    retakeBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
    historyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 26, borderWidth: 1 },
    historyBtnText: { fontSize: 15, fontWeight: '600' },
});
