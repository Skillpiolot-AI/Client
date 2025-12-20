// Assessment Quiz Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Loading } from '../../components/ui';
import { Header } from '../../components/layout';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import assessmentAPI from '../../services/assessmentAPI';

const AssessmentQuizScreen = ({ navigation, route }) => {
    const { assessment } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            // In a real app, you might fetch questions here or use startAssessment
            const response = await assessmentAPI.startAssessment(assessment.id);
            // Fallback for demo if API doesn't return questions
            const demoQuestions = [
                { id: 1, question: 'What is the output of console.log(typeof [])?', options: ['object', 'array', 'undefined', 'null'] },
                { id: 2, question: 'Which method adds elements to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'] },
                { id: 3, question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'] },
                { id: 4, question: 'Which tag is used for the largest heading?', options: ['<h1>', '<heading>', '<h6>', '<head>'] },
                { id: 5, question: 'What is Node.js?', options: ['JavaScript Runtime', 'Framework', 'Library', 'Language'] },
            ];

            setQuestions(response.questions || demoQuestions);
        } catch (error) {
            console.log('Error starting assessment:', error);
            // Fallback to demo questions on error for now
            setQuestions([
                { id: 1, question: 'What is the output of console.log(typeof [])?', options: ['object', 'array', 'undefined', 'null'] },
                { id: 2, question: 'Which method adds elements to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'] },
                { id: 3, question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'] },
                { id: 4, question: 'Which tag is used for the largest heading?', options: ['<h1>', '<heading>', '<h6>', '<head>'] },
                { id: 5, question: 'What is Node.js?', options: ['JavaScript Runtime', 'Framework', 'Library', 'Language'] },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (option) => {
        setAnswers({ ...answers, [questions[currentQ].id]: option });
    };

    const handleNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQ > 0) {
            setCurrentQ(currentQ - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await assessmentAPI.submitAssessment(assessment.id, answers);
            Alert.alert('Success', 'Assessment submitted successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Assessment') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit assessment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading fullScreen text="Preparing assessment..." />;

    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
        <View style={styles.container}>
            <Header title={assessment?.title || 'Assessment'} showBack />

            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>Question {currentQ + 1} of {questions.length}</Text>

            <ScrollView style={styles.content}>
                <Text style={styles.question}>{q?.question}</Text>

                {q?.options.map((opt, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[
                            styles.option,
                            answers[q.id] === opt && styles.optionSelected
                        ]}
                        onPress={() => handleSelect(opt)}
                    >
                        <Text style={[
                            styles.optionText,
                            answers[q.id] === opt && styles.optionTextSelected
                        ]}>
                            {opt}
                        </Text>
                        {answers[q.id] === opt && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                ))}

                <View style={styles.buttons}>
                    <Button
                        title="Previous"
                        variant="outline"
                        onPress={handlePrevious}
                        disabled={currentQ === 0}
                        style={styles.btn}
                    />

                    {currentQ === questions.length - 1 ? (
                        <Button
                            title="Submit"
                            variant="gradient"
                            loading={submitting}
                            onPress={handleSubmit}
                            disabled={!answers[q.id]}
                            style={styles.btn}
                        />
                    ) : (
                        <Button
                            title="Next"
                            variant="primary"
                            onPress={handleNext}
                            disabled={!answers[q.id]}
                            style={styles.btn}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    progressBar: { height: 4, backgroundColor: colors.surface, marginHorizontal: spacing.md },
    progressFill: { height: '100%', backgroundColor: colors.primary },
    progressText: { textAlign: 'center', fontSize: fontSize.sm, color: colors.textSecondary, marginVertical: spacing.sm },
    content: { padding: spacing.md },
    question: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xl, lineHeight: 30 },
    option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm, borderWidth: 2, borderColor: 'transparent' },
    optionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '20' },
    optionText: { fontSize: fontSize.md, color: colors.text },
    optionTextSelected: { color: colors.primary, fontWeight: fontWeight.semibold },
    buttons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, marginBottom: 100 },
    btn: { flex: 1 },
});

export default AssessmentQuizScreen;
