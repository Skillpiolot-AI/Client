// AssessmentQuizScreen.js — Phase 1: Progress Bar + Timer + Card Question Layout
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Animated, Alert, SafeAreaView, Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Loading } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';
import assessmentAPI from '../../services/assessmentAPI';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];
const DEFAULT_TIMER = 45; // seconds per question

// ── Timer color helper ──────────────────────────────────────────────────────
const getTimerStyle = (seconds) => {
    if (seconds > 15) return { color: colors.success, bg: colors.successBg };
    if (seconds > 5)  return { color: colors.warning, bg: colors.warningBg };
    return { color: colors.error, bg: colors.errorBg };
};

// ── Option Row ──────────────────────────────────────────────────────────────
const OptionRow = ({ label, text, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.optionRow, selected && styles.optionRowSelected]}
        onPress={onPress}
        activeOpacity={0.75}
    >
        <View style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
            <Text style={[styles.optionLabelText, selected && styles.optionLabelTextSelected]}>
                {label}
            </Text>
        </View>
        <Text style={[styles.optionText, selected && styles.optionTextSelected]} numberOfLines={3}>
            {text}
        </Text>
        {selected && (
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={styles.checkIcon} />
        )}
    </TouchableOpacity>
);

// ── Main Screen ─────────────────────────────────────────────────────────────
const AssessmentQuizScreen = ({ navigation, route }) => {
    const { assessment } = route.params || {};
    const timePerQuestion = assessment?.timePerQuestion || DEFAULT_TIMER;

    const [loading, setLoading]       = useState(true);
    const [questions, setQuestions]   = useState([]);
    const [currentQ, setCurrentQ]     = useState(0);
    const [answers, setAnswers]       = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft]     = useState(timePerQuestion);

    // Animated values
    const progressAnim = useRef(new Animated.Value(0)).current;
    const timerPulse   = useRef(new Animated.Value(1)).current;
    const timerRef     = useRef(null);

    // ── Load questions ───────────────────────────────────────────────────────
    const loadQuestions = useCallback(async () => {
        const demo = [
            { id: 1, question: 'What is the output of console.log(typeof [])?', options: ['object', 'array', 'undefined', 'null'] },
            { id: 2, question: 'Which Array method adds elements to the end?', options: ['push()', 'pop()', 'shift()', 'unshift()'] },
            { id: 3, question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'] },
            { id: 4, question: 'Which HTML tag is used for the largest heading?', options: ['<h1>', '<heading>', '<h6>', '<head>'] },
            { id: 5, question: 'What is Node.js primarily used for?', options: ['Server-side JavaScript runtime', 'UI framework', 'CSS preprocessor', 'Database'] },
        ];
        try {
            const response = await assessmentAPI.startAssessment(assessment?.id);
            setQuestions(response?.questions || demo);
        } catch {
            setQuestions(demo);
        } finally {
            setLoading(false);
        }
    }, [assessment?.id]);

    useEffect(() => { loadQuestions(); }, [loadQuestions]);

    // ── Progress bar animation ───────────────────────────────────────────────
    useEffect(() => {
        if (!questions.length) return;
        const target = (currentQ + 1) / questions.length;
        Animated.timing(progressAnim, {
            toValue: target,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start();
    }, [currentQ, questions.length]);

    // ── Countdown timer ──────────────────────────────────────────────────────
    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        setTimeLeft(timePerQuestion);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [timePerQuestion, currentQ]);

    useEffect(() => {
        if (!loading) startTimer();
        return () => clearInterval(timerRef.current);
    }, [currentQ, loading]);

    // Pulse animation when ≤ 5 s
    useEffect(() => {
        if (timeLeft <= 5 && timeLeft > 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(timerPulse, { toValue: 1.15, duration: 300, useNativeDriver: true }),
                    Animated.timing(timerPulse, { toValue: 1, duration: 300, useNativeDriver: true }),
                ]),
            ).start();
        } else {
            timerPulse.setValue(1);
        }
    }, [timeLeft <= 5]);

    const handleTimeUp = () => {
        const q = questions[currentQ];
        if (!q) return;
        if (currentQ < questions.length - 1) {
            setCurrentQ((prev) => prev + 1);
        } else {
            // Last question — prompt submit
            Alert.alert(
                "Time's Up!",
                "Time expired on the last question. Submit your answers?",
                [
                    { text: 'Submit', onPress: handleSubmit },
                    { text: 'Skip', style: 'cancel', onPress: () => navigation.goBack() },
                ],
            );
        }
    };

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSelect = (option) => {
        const q = questions[currentQ];
        setAnswers((prev) => ({ ...prev, [q.id]: option }));
    };

    const handleNext = () => {
        if (currentQ < questions.length - 1) setCurrentQ((p) => p + 1);
    };

    const handlePrevious = () => {
        if (currentQ > 0) setCurrentQ((p) => p - 1);
    };

    const handleSubmit = async () => {
        clearInterval(timerRef.current);
        setSubmitting(true);
        try {
            await assessmentAPI.submitAssessment(assessment?.id, answers);
            Alert.alert('Submitted!', 'Your assessment has been submitted successfully.', [
                { text: 'OK', onPress: () => navigation.navigate('Assessment') },
            ]);
        } catch {
            Alert.alert('Error', 'Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmSubmit = () => {
        const answeredCount = Object.keys(answers).length;
        const remaining = questions.length - answeredCount;
        if (remaining > 0) {
            Alert.alert(
                'Submit Assessment',
                `You have ${remaining} unanswered question${remaining > 1 ? 's' : ''}. Submit anyway?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Submit', onPress: handleSubmit },
                ],
            );
        } else {
            handleSubmit();
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return <Loading fullScreen text="Preparing your assessment…" />;

    const q           = questions[currentQ];
    const isLast      = currentQ === questions.length - 1;
    const selected    = answers[q?.id];
    const answeredCnt = Object.keys(answers).length;
    const timerStyle  = getTimerStyle(timeLeft);
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    clearInterval(timerRef.current);
                    Alert.alert('Quit Assessment', 'Your progress will be lost.', [
                        { text: 'Cancel', style: 'cancel', onPress: () => startTimer() },
                        { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
                    ]);
                }} style={styles.headerBtn}>
                    <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {assessment?.title || 'Assessment'}
                    </Text>
                    <Text style={styles.headerSub}>
                        {answeredCnt} of {questions.length} answered
                    </Text>
                </View>

                {/* Timer */}
                <Animated.View style={[
                    styles.timerChip,
                    { backgroundColor: timerStyle.bg, transform: [{ scale: timerPulse }] }
                ]}>
                    <Ionicons name="time-outline" size={14} color={timerStyle.color} />
                    <Text style={[styles.timerText, { color: timerStyle.color }]}>
                        {timeLeft}s
                    </Text>
                </Animated.View>
            </View>

            {/* ── Animated Progress Bar ── */}
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            {/* ── Segmented dot pills ── */}
            <View style={styles.dotRow}>
                {questions.map((_, i) => {
                    const isDone    = answers[questions[i].id];
                    const isCurrent = i === currentQ;
                    return (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.dot,
                                isCurrent && styles.dotCurrent,
                                isDone && !isCurrent && styles.dotDone,
                            ]}
                            onPress={() => setCurrentQ(i)}
                        />
                    );
                })}
            </View>

            {/* ── Scrollable Content ── */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Question Card */}
                <View style={styles.questionCard}>
                    <View style={styles.questionBadge}>
                        <Text style={styles.questionBadgeText}>Q{currentQ + 1}</Text>
                    </View>
                    <Text style={styles.questionText}>{q?.question}</Text>
                </View>

                {/* Options */}
                {q?.options?.map((opt, i) => (
                    <OptionRow
                        key={i}
                        label={OPTION_LABELS[i]}
                        text={opt}
                        selected={selected === opt}
                        onPress={() => handleSelect(opt)}
                    />
                ))}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ── Sticky Footer ── */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.footerBtn, styles.prevBtn, currentQ === 0 && styles.btnDisabled]}
                    onPress={handlePrevious}
                    disabled={currentQ === 0}
                    activeOpacity={0.75}
                >
                    <Ionicons name="arrow-back" size={18} color={currentQ === 0 ? colors.textDisabled : colors.text} />
                    <Text style={[styles.prevBtnText, currentQ === 0 && styles.btnDisabledText]}>Prev</Text>
                </TouchableOpacity>

                {isLast ? (
                    <TouchableOpacity
                        style={[styles.footerBtn, styles.submitBtn]}
                        onPress={confirmSubmit}
                        disabled={submitting}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={[colors.primary, colors.primaryDark]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.gradientInner}
                        >
                            {submitting
                                ? <Text style={styles.submitBtnText}>Submitting…</Text>
                                : <>
                                    <Text style={styles.submitBtnText}>Submit</Text>
                                    <Ionicons name="checkmark-circle" size={18} color={colors.white} />
                                </>
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.footerBtn, styles.nextBtn, !selected && styles.btnDisabled]}
                        onPress={handleNext}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={selected
                                ? [colors.primary, colors.primaryDark]
                                : [colors.surfaceAlt, colors.surfaceAlt]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.gradientInner}
                        >
                            <Text style={[styles.nextBtnText, !selected && styles.btnDisabledText]}>
                                Next
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color={selected ? colors.white : colors.textDisabled}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        gap: spacing.sm,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    headerSub: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: 1,
    },
    timerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    timerText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        minWidth: 26,
    },

    // Progress
    progressTrack: {
        height: 5,
        backgroundColor: colors.surfaceAlt,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
    },

    // Dot pills
    dotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        flexWrap: 'wrap',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
    },
    dotCurrent: {
        width: 20,
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    dotDone: {
        backgroundColor: colors.success,
    },

    // Scroll
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },

    // Question card
    questionCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.primaryBorder,
        ...shadows.sm,
    },
    questionBadge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primaryBg,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 3,
        marginBottom: spacing.sm,
    },
    questionBadgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    questionText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        lineHeight: 26,
    },

    // Option rows
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1.5,
        borderColor: colors.border,
        gap: spacing.sm,
        ...shadows.xs,
    },
    optionRowSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryBg,
    },
    optionLabel: {
        width: 34,
        height: 34,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    optionLabelSelected: {
        backgroundColor: colors.primary,
    },
    optionLabelText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
    },
    optionLabelTextSelected: {
        color: colors.white,
    },
    optionText: {
        flex: 1,
        fontSize: fontSize.md,
        color: colors.text,
        lineHeight: 22,
    },
    optionTextSelected: {
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    checkIcon: {
        flexShrink: 0,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        ...shadows.md,
    },
    footerBtn: {
        flex: 1,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        height: 52,
    },
    prevBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
    },
    prevBtnText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
    },
    nextBtn: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    submitBtn: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    gradientInner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
    },
    nextBtnText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.white,
    },
    submitBtnText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.white,
    },
    btnDisabled: {
        opacity: 0.45,
    },
    btnDisabledText: {
        color: colors.textDisabled,
    },
});

export default AssessmentQuizScreen;
