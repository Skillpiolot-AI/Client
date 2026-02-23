// RiasecAssessmentScreen.js — Full RIASEC Holland Code quiz
// Submits answers to POST /assessments and navigates to result
import React, { useState, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Dimensions, Animated, ActivityIndicator, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import assessmentAPI from '../../services/assessmentAPI';

const { width } = Dimensions.get('window');
const BRAND = '#5B5FEF';

// ── RIASEC Question bank (60 questions, 10 per trait) ─────────────────────────
const TRAITS = {
    R: { name: 'Realistic', color: '#F59E0B', icon: 'construct-outline', desc: 'Practical, hands-on, physical' },
    I: { name: 'Investigative', color: '#5B5FEF', icon: 'flask-outline', desc: 'Analytical, research-oriented' },
    A: { name: 'Artistic', color: '#EC4899', icon: 'color-palette-outline', desc: 'Creative, expressive, original' },
    S: { name: 'Social', color: '#10B981', icon: 'people-outline', desc: 'Helping, teaching, advising' },
    E: { name: 'Enterprising', color: '#EF4444', icon: 'trending-up-outline', desc: 'Leading, persuading, selling' },
    C: { name: 'Conventional', color: '#6366F1', icon: 'grid-outline', desc: 'Organized, detail-oriented, data' },
};

const QUESTIONS = [
    // Realistic
    { id: 'R1', trait: 'R', text: 'I enjoy working with tools, machines, or equipment.' },
    { id: 'R2', trait: 'R', text: 'I like doing physical activities and working outdoors.' },
    { id: 'R3', trait: 'R', text: 'I prefer practical problem-solving over theoretical discussions.' },
    { id: 'R4', trait: 'R', text: 'I am skilled at building or repairing things.' },
    { id: 'R5', trait: 'R', text: 'I enjoy working with plants, animals, or nature.' },
    { id: 'R6', trait: 'R', text: 'I like activities that produce something tangible.' },
    { id: 'R7', trait: 'R', text: 'I prefer hands-on training over reading or lectures.' },
    { id: 'R8', trait: 'R', text: 'I enjoy mechanical or technical tasks.' },
    { id: 'R9', trait: 'R', text: 'I am comfortable operating machines or vehicles.' },
    { id: 'R10', trait: 'R', text: 'I enjoy sports, fitness, or physical challenges.' },
    // Investigative
    { id: 'I1', trait: 'I', text: 'I enjoy doing research and solving complex problems.' },
    { id: 'I2', trait: 'I', text: 'I like analyzing data and finding patterns.' },
    { id: 'I3', trait: 'I', text: 'I enjoy reading scientific or technical material.' },
    { id: 'I4', trait: 'I', text: 'I am curious about how things work in nature and science.' },
    { id: 'I5', trait: 'I', text: 'I enjoy experimenting and testing new ideas.' },
    { id: 'I6', trait: 'I', text: 'I prefer thinking through problems independently.' },
    { id: 'I7', trait: 'I', text: 'I like puzzles, logic games, and brain teasers.' },
    { id: 'I8', trait: 'I', text: 'I enjoy learning about biology, chemistry, or physics.' },
    { id: 'I9', trait: 'I', text: 'I like developing theories or frameworks.' },
    { id: 'I10', trait: 'I', text: 'I am drawn to mathematics and statistical analysis.' },
    // Artistic
    { id: 'A1', trait: 'A', text: 'I enjoy expressing myself through art, music, or writing.' },
    { id: 'A2', trait: 'A', text: 'I like creating original designs or creative works.' },
    { id: 'A3', trait: 'A', text: 'I prefer unstructured environments where I can be creative.' },
    { id: 'A4', trait: 'A', text: 'I enjoy performing arts like acting, dance, or music.' },
    { id: 'A5', trait: 'A', text: 'I like working on creative writing or storytelling.' },
    { id: 'A6', trait: 'A', text: 'I am drawn to aesthetics, design, and beauty.' },
    { id: 'A7', trait: 'A', text: 'I enjoy fashion, photography, or visual arts.' },
    { id: 'A8', trait: 'A', text: 'I prefer to work on things in my own unique way.' },
    { id: 'A9', trait: 'A', text: 'I like brainstorming unconventional solutions.' },
    { id: 'A10', trait: 'A', text: 'I find inspiration in culture, history, and the arts.' },
    // Social
    { id: 'S1', trait: 'S', text: 'I enjoy helping others solve their personal or work problems.' },
    { id: 'S2', trait: 'S', text: 'I like teaching, mentoring, or training people.' },
    { id: 'S3', trait: 'S', text: 'I feel energized when interacting with a large group of people.' },
    { id: 'S4', trait: 'S', text: 'I am a good listener who empathizes with others.' },
    { id: 'S5', trait: 'S', text: 'I enjoy volunteering or community service activities.' },
    { id: 'S6', trait: 'S', text: 'I like counseling or guiding others through challenges.' },
    { id: 'S7', trait: 'S', text: 'I am comfortable working in healthcare or social services.' },
    { id: 'S8', trait: 'S', text: 'I prefer team-based work over working alone.' },
    { id: 'S9', trait: 'S', text: 'I enjoy facilitating group discussions or workshops.' },
    { id: 'S10', trait: 'S', text: 'I care deeply about fairness and social justice.' },
    // Enterprising
    { id: 'E1', trait: 'E', text: 'I enjoy leading or managing a team of people.' },
    { id: 'E2', trait: 'E', text: 'I like persuading others to adopt my point of view.' },
    { id: 'E3', trait: 'E', text: 'I am comfortable with risk and making big decisions.' },
    { id: 'E4', trait: 'E', text: 'I enjoy sales, marketing, or business development.' },
    { id: 'E5', trait: 'E', text: 'I like setting goals and motivating others to achieve them.' },
    { id: 'E6', trait: 'E', text: 'I enjoy negotiating and finding deals.' },
    { id: 'E7', trait: 'E', text: 'I aspire to start my own business or lead an organization.' },
    { id: 'E8', trait: 'E', text: 'I enjoy competitive environments.' },
    { id: 'E9', trait: 'E', text: 'I am naturally confident and assertive in groups.' },
    { id: 'E10', trait: 'E', text: 'I find it exciting to develop and present new projects.' },
    // Conventional
    { id: 'C1', trait: 'C', text: 'I enjoy working with numbers, data, and records.' },
    { id: 'C2', trait: 'C', text: 'I like following established procedures and systems.' },
    { id: 'C3', trait: 'C', text: 'I am comfortable with administrative and clerical tasks.' },
    { id: 'C4', trait: 'C', text: 'I enjoy organizing files, databases, or information systems.' },
    { id: 'C5', trait: 'C', text: 'I prefer structured environments with clear expectations.' },
    { id: 'C6', trait: 'C', text: 'I like proofreading, fact-checking, and attention to detail.' },
    { id: 'C7', trait: 'C', text: 'I enjoy accounting, bookkeeping, or finance.' },
    { id: 'C8', trait: 'C', text: 'I am reliable and consistent in completing tasks.' },
    { id: 'C9', trait: 'C', text: 'I like working in office environments with clear schedules.' },
    { id: 'C10', trait: 'C', text: 'I enjoy using spreadsheets, databases, or ERP software.' },
];

const SCALE = [
    { val: 1, label: 'Strongly\nDisagree' },
    { val: 2, label: 'Disagree' },
    { val: 3, label: 'Neutral' },
    { val: 4, label: 'Agree' },
    { val: 5, label: 'Strongly\nAgree' },
];

export default function RiasecAssessmentScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [answers, setAnswers] = useState({});
    const [currentQ, setCurrentQ] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;

    const q = QUESTIONS[currentQ];
    const trait = TRAITS[q.trait];
    const progress = (currentQ + 1) / QUESTIONS.length;
    const answered = answers[q.id];

    const animateTransition = (direction, cb) => {
        Animated.sequence([
            Animated.timing(slideAnim, { toValue: direction * -30, duration: 150, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(cb);
    };

    const handleAnswer = (val) => {
        setAnswers(prev => ({ ...prev, [q.id]: val }));
    };

    const goNext = () => {
        if (!answered) { Alert.alert('Please select an answer before continuing'); return; }
        if (currentQ < QUESTIONS.length - 1) {
            animateTransition(1, () => setCurrentQ(prev => prev + 1));
        }
    };

    const goPrev = () => {
        if (currentQ > 0) {
            animateTransition(-1, () => setCurrentQ(prev => prev - 1));
        }
    };

    const handleSubmit = async () => {
        const unanswered = QUESTIONS.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            Alert.alert('Incomplete', `You have ${unanswered.length} unanswered question(s). Please answer all questions.`);
            setCurrentQ(QUESTIONS.indexOf(unanswered[0]));
            return;
        }
        setSubmitting(true);
        try {
            const response = await assessmentAPI.submitRiasec(user?._id, answers);
            // Backend returns: { success: true, data: { _id, results, completedAt, improvement, ... } }
            const assessment = response?.data || response;
            navigation.replace('RiasecResult', { result: assessment });
        } catch (err) {
            console.error('Submit error:', err?.response?.data || err.message);
            Alert.alert('Error', err?.response?.data?.error || 'Failed to submit assessment. Please try again.');
        } finally { setSubmitting(false); }
    };

    const isLast = currentQ === QUESTIONS.length - 1;
    const answeredCount = Object.keys(answers).length;

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => Alert.alert('Exit Quiz', 'Your progress will be lost. Exit?', [
                    { text: 'Cancel' },
                    { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() }
                ])} style={styles.headerBtn}>
                    <Ionicons name="close" size={22} color={theme.text} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>RIASEC Assessment</Text>
                    <Text style={[styles.headerSub, { color: theme.textMuted }]}>{currentQ + 1} / {QUESTIONS.length}</Text>
                </View>
                <View style={[styles.headerAnswer, { backgroundColor: BRAND + '15' }]}>
                    <Text style={[styles.headerAnswerText, { color: BRAND }]}>{answeredCount}</Text>
                </View>
            </View>

            {/* Progress bar */}
            <View style={[styles.progressTrack, { backgroundColor: theme.surfaceAlt }]}>
                <Animated.View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: trait.color }]} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Trait badge */}
                <View style={[styles.traitBadge, { backgroundColor: trait.color + '15' }]}>
                    <Ionicons name={trait.icon} size={18} color={trait.color} />
                    <Text style={[styles.traitName, { color: trait.color }]}>{trait.name}</Text>
                    <Text style={[styles.traitDesc, { color: trait.color + 'AA' }]}>— {trait.desc}</Text>
                </View>

                {/* Question */}
                <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                    <View style={[styles.questionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <Text style={[styles.qNum, { color: theme.textMuted }]}>Q{currentQ + 1}</Text>
                        <Text style={[styles.qText, { color: theme.text }]}>{q.text}</Text>
                    </View>
                </Animated.View>

                {/* Scale */}
                <Text style={[styles.scaleLabel, { color: theme.textMuted }]}>How much does this describe you?</Text>
                <View style={styles.scaleRow}>
                    {SCALE.map(s => {
                        const isSelected = answered === s.val;
                        return (
                            <TouchableOpacity
                                key={s.val}
                                style={[
                                    styles.scaleBtn,
                                    { backgroundColor: isSelected ? trait.color : theme.surfaceAlt, borderColor: isSelected ? trait.color : theme.border },
                                ]}
                                onPress={() => handleAnswer(s.val)}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.scaleNum, { color: isSelected ? '#fff' : theme.text }]}>{s.val}</Text>
                                <Text style={[styles.scaleText, { color: isSelected ? '#fff' : theme.textMuted }]} numberOfLines={2}>{s.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Navigation */}
            <View style={[styles.nav, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={[styles.navBtn, { backgroundColor: theme.surfaceAlt, opacity: currentQ === 0 ? 0.4 : 1 }]}
                    onPress={goPrev}
                    disabled={currentQ === 0}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                    <Text style={[styles.navBtnText, { color: theme.text }]}>Back</Text>
                </TouchableOpacity>

                {isLast ? (
                    <TouchableOpacity
                        style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Text style={styles.submitBtnText}>Submit</Text>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.nextBtn, { opacity: answered ? 1 : 0.5 }]}
                        onPress={goNext}
                    >
                        <Text style={styles.nextBtnText}>Next</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 15, fontWeight: '700' },
    headerSub: { fontSize: 12 },
    headerAnswer: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    headerAnswerText: { fontSize: 13, fontWeight: '800' },
    progressTrack: { height: 4 },
    progressFill: { height: 4, borderRadius: 2 },
    content: { padding: 20, gap: 20 },
    traitBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 30 },
    traitName: { fontSize: 14, fontWeight: '700' },
    traitDesc: { fontSize: 12 },
    questionCard: { borderRadius: 18, padding: 20, borderWidth: 1, gap: 8 },
    qNum: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
    qText: { fontSize: 17, fontWeight: '600', lineHeight: 26 },
    scaleLabel: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
    scaleRow: { flexDirection: 'row', gap: 8 },
    scaleBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, gap: 4 },
    scaleNum: { fontSize: 18, fontWeight: '800' },
    scaleText: { fontSize: 9, textAlign: 'center', lineHeight: 12 },
    nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
    navBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 25 },
    navBtnText: { fontSize: 15, fontWeight: '600' },
    nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: BRAND, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
    nextBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
    submitBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
    submitBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
