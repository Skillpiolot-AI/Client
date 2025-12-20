import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useAuth } from '../../context/AuthContext';
import mentorshipAPI from '../../services/mentorshipAPI';
import { uiTheme } from '../profile/ProfileScreen'; // Reusing theme colors for consistency
import { fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const screenWidth = Dimensions.get('window').width;

const MentorDashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, graphRes] = await Promise.all([
                mentorshipAPI.getDashboardStats(),
                mentorshipAPI.getActivityGraph()
            ]);
            setStats(statsRes);
            setGraphData(graphRes);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1A237E" />
            </View>
        );
    }

    const chartConfig = {
        backgroundGradientFrom: '#FFFFFF',
        backgroundGradientTo: '#FFFFFF',
        color: (opacity = 1) => `rgba(26, 35, 126, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
    };

    const lineChartData = {
        labels: graphData.map(d => d.day),
        datasets: [{
            data: graphData.map(d => d.count),
            color: (opacity = 1) => `rgba(26, 35, 126, ${opacity})`,
            strokeWidth: 2
        }]
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Dashboard</Text>
                    <Text style={styles.subtitle}>Welcome back, {user?.name.split(' ')[0]}!</Text>
                </View>
                <TouchableOpacity style={styles.bellIcon}>
                    <Ionicons name="notifications-outline" size={24} color="#000" />
                    <View style={styles.dot} />
                </TouchableOpacity>
            </View>

            {/* Session Stats Section */}
            <Text style={styles.sectionTitle}>Session Stats</Text>
            <View style={styles.kpiRow}>
                <View style={[styles.kpiCard, { backgroundColor: '#E8EAF6' }]}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="calendar-outline" size={20} color="#1A237E" />
                    </View>
                    <Text style={styles.kpiValue}>{stats?.upcomingSessions || 0}</Text>
                    <Text style={styles.kpiLabel}>Upcoming</Text>
                    <Text style={styles.kpiSubLabel}>Sessions</Text>
                </View>
                <View style={[styles.kpiCard, { backgroundColor: '#FFF9C4' }]}>
                    <View style={[styles.iconCircle, { backgroundColor: '#FBC02D' }]}>
                        <Ionicons name="checkmark-done" size={20} color="#FFF" />
                    </View>
                    <Text style={styles.kpiValue}>{stats?.completedSessions || 0}</Text>
                    <Text style={styles.kpiLabel}>Completed</Text>
                    <Text style={styles.kpiSubLabel}>Overall</Text>
                </View>
            </View>

            {/* Activity KPI */}
            <Text style={styles.sectionTitle}>Activity KPI</Text>
            <View style={styles.kpiGrid}>
                <View style={[styles.kpiBox, { backgroundColor: '#1A237E' }]}>
                    <Ionicons name="call-outline" size={24} color="#FFF" />
                    <Text style={styles.kpiBoxLabel}>Avg.Call Per Day</Text>
                    <Text style={styles.kpiBoxValue}>{stats?.avgCallsPerDay || 0}</Text>
                </View>
                <View style={[styles.kpiBox, { backgroundColor: '#1E88E5' }]}>
                    <Ionicons name="calendar-outline" size={24} color="#FFF" />
                    <Text style={styles.kpiBoxLabel}>This Week</Text>
                    <Text style={styles.kpiBoxValue}>{stats?.thisWeek || 0}</Text>
                </View>
                <View style={[styles.kpiBox, { backgroundColor: '#4FC3F7' }]}>
                    <Ionicons name="calendar" size={24} color="#FFF" />
                    <Text style={styles.kpiBoxLabel}>This Month</Text>
                    <Text style={styles.kpiBoxValue}>{stats?.thisMonth || 0}</Text>
                </View>
            </View>

            {/* Performance Graph */}
            <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Your Activities</Text>
                </View>
                <LineChart
                    data={lineChartData}
                    width={screenWidth - 48}
                    height={180}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                />
            </View>

            {/* Growth Section Mock (Matching Reference) */}
            <View style={styles.growthCard}>
                <View style={styles.growthText}>
                    <Ionicons name="sparkles" size={20} color="#1A237E" />
                    <Text style={styles.growthMessage}>AI suggests focusing more on Frontend topics this week.</Text>
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    bellIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    kpiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    kpiCard: {
        width: (screenWidth - 60) / 2,
        padding: 20,
        borderRadius: 20,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    kpiValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
    },
    kpiLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginTop: 4,
    },
    kpiSubLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    kpiGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    kpiBox: {
        width: (screenWidth - 64) / 3,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    kpiBoxLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 8,
        textAlign: 'center',
    },
    kpiBoxValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        marginTop: 4,
    },
    chartContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    growthCard: {
        backgroundColor: '#1A237E',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    growthText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    growthMessage: {
        color: '#FFF',
        fontSize: 12,
        marginLeft: 10,
        fontWeight: '500',
        flex: 1,
    }
});

export default MentorDashboardScreen;
