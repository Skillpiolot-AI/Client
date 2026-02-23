// AssessmentScreen.js — Hub with RIASEC featured card + history + theme-aware
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import assessmentAPI from '../../services/assessmentAPI';

const { width } = Dimensions.get('window');
const BRAND = '#5B5FEF';

const TRAITS = {
    R: { name: 'Realistic', color: '#F59E0B' },
    I: { name: 'Investigative', color: '#5B5FEF' },
    A: { name: 'Artistic', color: '#EC4899' },
    S: { name: 'Social', color: '#10B981' },
    E: { name: 'Enterprising', color: '#EF4444' },
    C: { name: 'Conventional', color: '#6366F1' },
};

const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
};

export default function AssessmentScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = useCallback(async () => {
        try {
            const res = await assessmentAPI.getMyHistory();
            setHistory(res?.data || null);
        } catch (e) {
            // user may not have taken assessment yet
            setHistory({ assessments: [], latestResult: null, trends: null, totalAssessments: 0 });
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const latest = history?.latestResult;
    const latestCodes = latest?.results?.hollandCode || '';
    const latestTop = latest?.results?.topThreeDomains || [];
    const trends = history?.trends;

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND} colors={[BRAND]} />}
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            >
                {/* Header */}
                <View style={styles.topbar}>
                    <View>
                        <Text style={[styles.pageTitle, { color: theme.text }]}>Assessments</Text>
                        <Text style={[styles.pageSub, { color: theme.textMuted }]}>Discover your career personality</Text>
                    </View>
                    {history?.totalAssessments > 0 && (
                        <View style={[styles.totalBadge, { backgroundColor: BRAND + '15' }]}>
                            <Text style={[styles.totalText, { color: BRAND }]}>{history.totalAssessments} taken</Text>
                        </View>
                    )}
                </View>

                <View style={{ paddingHorizontal: 20, gap: 20 }}>
                    {/* RIASEC featured card */}
                    <TouchableOpacity
                        style={styles.featuredCard}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('RiasecAssessment')}
                    >
                        <View style={styles.featuredRings}>
                            {[100, 70].map((r, i) => (
                                <View key={i} style={[styles.ring, { width: r * 2, height: r * 2, borderRadius: r, opacity: 0.08 + i * 0.04 }]} />
                            ))}
                        </View>
                        <View style={styles.featuredLeft}>
                            <View style={styles.featuredIconBox}>
                                <Ionicons name="compass-outline" size={28} color="#fff" />
                            </View>
                            <View style={{ gap: 4 }}>
                                <View style={styles.featuredPill}>
                                    <Text style={styles.featuredPillText}>RIASEC Holland Code</Text>
                                </View>
                                <Text style={styles.featuredTitle}>Career Personality{'\n'}Assessment</Text>
                                <Text style={styles.featuredSub}>60 questions · ~15 mins</Text>
                            </View>
                        </View>
                        <View style={styles.featuredArrow}>
                            <Ionicons name="arrow-forward" size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    {/* Previous result quick-view */}
                    {latest && (
                        <TouchableOpacity
                            style={[styles.resultPreview, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                            onPress={() => navigation.navigate('RiasecResult', { result: latest })}
                            activeOpacity={0.8}
                        >
                            <View style={styles.resultPreviewTop}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.resultPreviewLabel, { color: theme.textMuted }]}>Latest Result</Text>
                                    <Text style={[styles.resultPreviewCode, { color: theme.text }]}>
                                        Holland Code: <Text style={{ color: BRAND }}>{latestCodes}</Text>
                                    </Text>
                                    <Text style={[styles.resultPreviewDate, { color: theme.textMuted }]}>
                                        {timeAgo(latest.completedAt)}
                                    </Text>
                                </View>
                                <View style={styles.codeLetters}>
                                    {latestTop.map(c => (
                                        <View key={c} style={[styles.codeLetter, { backgroundColor: TRAITS[c]?.color || BRAND }]}>
                                            <Text style={styles.codeLetterText}>{c}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Trend indicators */}
                            {trends && (
                                <View style={[styles.trendRow, { borderTopColor: theme.border }]}>
                                    <Ionicons
                                        name={trends.hasImproved ? 'trending-up' : 'trending-down'}
                                        size={16}
                                        color={trends.hasImproved ? '#10B981' : '#F59E0B'}
                                    />
                                    <Text style={[styles.trendText, { color: trends.hasImproved ? '#10B981' : '#F59E0B' }]}>
                                        {trends.hasImproved ? '+' : ''}{trends.percentageChange}% change from last time
                                        {trends.dominantTraitChange ? ` · ${trends.dominantTraitChange}` : ''}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.viewResultBtn}>
                                <Text style={[styles.viewResultText, { color: BRAND }]}>View Full Result →</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* History list */}
                    {history?.assessments?.length > 1 && (
                        <View style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Assessment History</Text>
                            {history.assessments.slice(1).map((a, idx) => (
                                <TouchableOpacity
                                    key={a._id || idx}
                                    style={[styles.historyRow, { borderBottomColor: theme.border }]}
                                    onPress={() => navigation.navigate('RiasecResult', { result: a })}
                                >
                                    <View style={[styles.historyDot, { backgroundColor: BRAND }]} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.historyCode, { color: theme.text }]}>
                                            {a.results?.hollandCode || '—'}
                                        </Text>
                                        <Text style={[styles.historyDate, { color: theme.textMuted }]}>
                                            {timeAgo(a.completedAt)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.historyTop, { color: BRAND }]}>
                                        {a.results?.topThreeDomains?.join('·') || ''}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Empty state */}
                    {!loading && !latest && (
                        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                            <Ionicons name="compass-outline" size={44} color={theme.textMuted} />
                            <Text style={[styles.emptyTitle, { color: theme.text }]}>No assessments yet</Text>
                            <Text style={[styles.emptySub, { color: theme.textMuted }]}>
                                Take the RIASEC assessment to discover your career personality and get personalized recommendations.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topbar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
    pageTitle: { fontSize: 24, fontWeight: '800' },
    pageSub: { fontSize: 13, marginTop: 2 },
    totalBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    totalText: { fontSize: 13, fontWeight: '700' },
    // Featured RIASEC card
    featuredCard: { backgroundColor: BRAND, borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', minHeight: 140 },
    featuredRings: { ...StyleSheet.absoluteFillObject, alignItems: 'flex-end', justifyContent: 'center' },
    ring: { position: 'absolute', right: -20, borderWidth: 1, borderColor: '#fff' },
    featuredLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
    featuredIconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    featuredPill: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
    featuredPillText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    featuredTitle: { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 24 },
    featuredSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
    featuredArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    // Result preview
    resultPreview: { borderRadius: 18, padding: 16, borderWidth: 1, gap: 12 },
    resultPreviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    resultPreviewLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    resultPreviewCode: { fontSize: 17, fontWeight: '700', marginTop: 2 },
    resultPreviewDate: { fontSize: 12, marginTop: 2 },
    codeLetters: { flexDirection: 'row', gap: 5 },
    codeLetter: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    codeLetterText: { fontSize: 14, fontWeight: '900', color: '#fff' },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, paddingTop: 10 },
    trendText: { fontSize: 13, fontWeight: '600', flex: 1 },
    viewResultBtn: { alignItems: 'flex-end' },
    viewResultText: { fontSize: 14, fontWeight: '700' },
    // History
    historyCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
    historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
    historyDot: { width: 8, height: 8, borderRadius: 4 },
    historyCode: { fontSize: 14, fontWeight: '600' },
    historyDate: { fontSize: 12 },
    historyTop: { fontSize: 13, fontWeight: '700' },
    // Empty
    emptyCard: { borderRadius: 18, padding: 28, borderWidth: 1, alignItems: 'center', gap: 10 },
    emptyTitle: { fontSize: 18, fontWeight: '700' },
    emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
