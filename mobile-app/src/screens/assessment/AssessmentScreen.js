// Assessment Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, Badge, Loading } from '../../components/ui';
import { Header } from '../../components/layout';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import assessmentAPI from '../../services/assessmentAPI';

const AssessmentScreen = ({ navigation }) => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAssessments(); }, []);

    const fetchAssessments = async () => {
        try {
            const response = await assessmentAPI.getAssessments();
            setAssessments(response.data || response || [
                { id: 1, title: 'Technical Skills', description: 'Test your programming skills', duration: '30 min', questions: 25, category: 'Technical' },
                { id: 2, title: 'Soft Skills', description: 'Evaluate communication & leadership', duration: '20 min', questions: 20, category: 'Behavioral' },
                { id: 3, title: 'Career Aptitude', description: 'Discover your career fit', duration: '25 min', questions: 30, category: 'Aptitude' },
            ]);
        } catch (error) {
            console.log('Error:', error);
        }
        setLoading(false);
    };

    const startAssessment = (assessment) => {
        Alert.alert('Start Assessment', `Are you ready to start ${assessment.title}?`, [
            { text: 'Cancel' },
            { text: 'Start', onPress: () => navigation.navigate('AssessmentQuiz', { assessment }) },
        ]);
    };

    if (loading) return <Loading fullScreen />;

    return (
        <View style={styles.container}>
            <Header title="Assessments" showBack />
            <ScrollView style={styles.content}>
                <LinearGradient colors={[colors.accent + '40', colors.accent + '10']} style={styles.banner}>
                    <Ionicons name="trophy" size={40} color={colors.accent} />
                    <Text style={styles.bannerTitle}>Test Your Skills</Text>
                    <Text style={styles.bannerText}>Complete assessments to unlock personalized recommendations</Text>
                </LinearGradient>

                <Text style={styles.sectionTitle}>Available Assessments</Text>
                {assessments.map((a) => (
                    <Card key={a.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Badge text={a.category} variant="info" size="sm" />
                            <Text style={styles.duration}><Ionicons name="time-outline" size={14} /> {a.duration}</Text>
                        </View>
                        <Text style={styles.title}>{a.title}</Text>
                        <Text style={styles.description}>{a.description}</Text>
                        <View style={styles.cardFooter}>
                            <Text style={styles.questions}>{a.questions} questions</Text>
                            <Button title="Start" variant="gradient" size="sm" onPress={() => startAssessment(a)} />
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md },
    banner: { padding: spacing.xl, borderRadius: borderRadius.xl, alignItems: 'center', marginBottom: spacing.lg },
    bannerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.md },
    bannerText: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' },
    sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md },
    card: { marginBottom: spacing.md },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    duration: { fontSize: fontSize.sm, color: colors.textSecondary },
    title: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text },
    description: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
    questions: { fontSize: fontSize.sm, color: colors.textMuted },
});

export default AssessmentScreen;
