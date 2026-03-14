// Career Quiz Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../components/ui';
import { Header } from '../../components/layout';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import careerAPI from '../../services/careerAPI';

const questions = [
    { id: 1, question: 'What type of work environment do you prefer?', options: ['Office-based', 'Remote', 'Hybrid', 'Field work'] },
    { id: 2, question: 'Which skill do you enjoy using most?', options: ['Analytical thinking', 'Creative design', 'Communication', 'Technical skills'] },
    { id: 3, question: 'What motivates you in a career?', options: ['High salary', 'Work-life balance', 'Growth opportunities', 'Making an impact'] },
    { id: 4, question: 'Which industry interests you most?', options: ['Technology', 'Healthcare', 'Finance', 'Creative arts'] },
    { id: 5, question: 'How do you prefer to work?', options: ['Independently', 'In teams', 'Leading others', 'Mix of both'] },
];

const CareerQuizScreen = ({ navigation }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSelect = (option) => {
        setAnswers({ ...answers, [questions[currentQ].id]: option });
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(currentQ + 1), 300);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await careerAPI.submitQuiz(answers);
            navigation.navigate('Recommendations');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit quiz');
        }
        setLoading(false);
    };

    const progress = ((currentQ + 1) / questions.length) * 100;
    const q = questions[currentQ];

    return (
        <View style={styles.container}>
            <Header title="Career Quiz" showBack />
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
            <Text style={styles.progressText}>Question {currentQ + 1} of {questions.length}</Text>

            <ScrollView style={styles.content}>
                <Text style={styles.question}>{q.question}</Text>

                {q.options.map((opt, i) => (
                    <TouchableOpacity key={i} style={[styles.option, answers[q.id] === opt && styles.optionSelected]} onPress={() => handleSelect(opt)}>
                        <Text style={[styles.optionText, answers[q.id] === opt && styles.optionTextSelected]}>{opt}</Text>
                        {answers[q.id] === opt && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                    </TouchableOpacity>
                ))}

                <View style={styles.buttons}>
                    {currentQ > 0 && <Button title="Previous" variant="outline" onPress={() => setCurrentQ(currentQ - 1)} style={styles.btn} />}
                    {currentQ === questions.length - 1 && Object.keys(answers).length === questions.length && (
                        <Button title="Get Results" variant="gradient" loading={loading} onPress={handleSubmit} style={styles.btn} />
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
    buttons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
    btn: { flex: 1 },
});

export default CareerQuizScreen;
