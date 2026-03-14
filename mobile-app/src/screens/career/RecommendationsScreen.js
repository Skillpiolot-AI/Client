// Recommendations Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, Loading } from '../../components/ui';
import { Header } from '../../components/layout';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import careerAPI from '../../services/careerAPI';

const RecommendationsScreen = ({ navigation }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchRecommendations(); }, []);

    const fetchRecommendations = async () => {
        try {
            const response = await careerAPI.getRecommendations();
            setRecommendations(response.data || response || [
                { id: 1, title: 'Software Engineer', match: 95, salary: '₹8-25 LPA', demand: 'High', skills: ['JavaScript', 'React', 'Node.js'] },
                { id: 2, title: 'Data Scientist', match: 88, salary: '₹10-30 LPA', demand: 'High', skills: ['Python', 'ML', 'Statistics'] },
                { id: 3, title: 'Product Manager', match: 82, salary: '₹12-35 LPA', demand: 'Medium', skills: ['Strategy', 'Analytics', 'Leadership'] },
            ]);
        } catch (error) {
            console.log('Error:', error);
        }
        setLoading(false);
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: item })}>
            <Card style={styles.card}>
                <View style={styles.header}>
                    <View style={[styles.rank, index === 0 && styles.rankTop]}>
                        <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.salary}>{item.salary}</Text>
                    </View>
                    <View style={styles.matchContainer}>
                        <Text style={styles.matchNum}>{item.match}%</Text>
                        <Text style={styles.matchLabel}>match</Text>
                    </View>
                </View>
                <View style={styles.skills}>
                    {item.skills?.slice(0, 3).map((skill, i) => <Badge key={i} text={skill} variant="primary" size="sm" />)}
                </View>
                <View style={styles.footer}>
                    <Badge text={`${item.demand} Demand`} variant={item.demand === 'High' ? 'success' : 'warning'} size="sm" />
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
            </Card>
        </TouchableOpacity>
    );

    if (loading) return <Loading fullScreen />;

    return (
        <View style={styles.container}>
            <Header title="Recommendations" showBack />
            <LinearGradient colors={[colors.primary + '30', colors.background]} style={styles.headerBg}>
                <Text style={styles.headerTitle}>Your Career Matches</Text>
                <Text style={styles.headerText}>Based on your quiz and profile</Text>
            </LinearGradient>
            <FlatList data={recommendations} keyExtractor={(item) => item.id?.toString()} renderItem={renderItem} contentContainerStyle={styles.list} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerBg: { padding: spacing.lg, paddingTop: spacing.sm },
    headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    headerText: { fontSize: fontSize.sm, color: colors.textSecondary },
    list: { padding: spacing.md, paddingBottom: 100 },
    card: { marginBottom: spacing.md },
    header: { flexDirection: 'row', alignItems: 'center' },
    rank: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
    rankTop: { backgroundColor: colors.warning },
    rankText: { fontWeight: fontWeight.bold, color: colors.text, fontSize: fontSize.sm },
    info: { flex: 1, marginLeft: spacing.md },
    title: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text },
    salary: { fontSize: fontSize.sm, color: colors.textSecondary },
    matchContainer: { alignItems: 'center' },
    matchNum: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
    matchLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
    skills: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});

export default RecommendationsScreen;
