// Dashboard Screen - White Theme
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Avatar, Badge, Loading } from '../../components/ui';
import { fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';
import mentorshipAPI from '../../services/mentorshipAPI';
import careerAPI from '../../services/careerAPI';

// White Theme Colors
const whiteTheme = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#FF6B35',
    primaryDark: '#E85A2A',
    success: '#10B981',
    accent: '#FF6B35',
    border: '#E5E7EB',
    white: '#FFFFFF',
};

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        completedAssessments: 0,
        upcomingSessions: 0,
        applicationStatus: null,
        careerPath: null,
    });
    const [upcomingBookings, setUpcomingBookings] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [bookings] = await Promise.all([
                mentorshipAPI.getMyBookings(),
            ]);

            setUpcomingBookings(bookings?.data?.slice(0, 3) || []);
            setStats({
                completedAssessments: user?.assessments || 0,
                upcomingSessions: bookings?.data?.length || 0,
                applicationStatus: user?.mentorApplication?.status || null,
                careerPath: user?.careerPath || null,
            });
        } catch (error) {
            console.log('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    const quickStats = [
        { label: 'Sessions', value: stats.upcomingSessions, icon: 'calendar', color: whiteTheme.primary },
        { label: 'Assessments', value: stats.completedAssessments, icon: 'checkmark-circle', color: whiteTheme.success },
        { label: 'Progress', value: '75%', icon: 'trending-up', color: whiteTheme.accent },
    ];

    const menuItems = [
        { icon: 'calendar-outline', title: 'My Bookings', subtitle: 'Scheduled sessions', tab: 'Mentorship', screen: 'MyBookings', badge: stats.upcomingSessions },
        { icon: 'document-text-outline', title: 'Assessments', subtitle: 'View your results', tab: 'Career', screen: 'Assessment' },
        { icon: 'compass-outline', title: 'Find Mentors', subtitle: 'Get guidance', tab: 'Mentorship', screen: 'MentorList' },
        { icon: 'rocket-outline', title: 'Career Quiz', subtitle: 'Discover your path', tab: 'Career', screen: 'CareerQuiz' },
        { icon: 'person-outline', title: 'Profile', subtitle: 'View & edit profile', tab: 'Profile', screen: 'ProfileMain' },
        { icon: 'settings-outline', title: 'Settings', subtitle: 'Account preferences', tab: 'Profile', screen: 'ProfileMain' },
    ];

    if (loading) {
        return <Loading fullScreen text="Loading dashboard..." />;
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={whiteTheme.primary}
                />
            }
        >
            {/* Header */}
            <LinearGradient
                colors={[whiteTheme.primary, whiteTheme.primaryDark]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.greeting}>Hello,</Text>
                        <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Avatar
                            source={user?.profileImage}
                            name={user?.name}
                            size="lg"
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    {quickStats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '30' }]}>
                                <Ionicons name={stat.icon} size={20} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>
            </LinearGradient>

            {/* Upcoming Sessions */}
            {upcomingBookings.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {upcomingBookings.map((booking, index) => (
                        <Card key={index} style={styles.bookingCard}>
                            <View style={styles.bookingContent}>
                                <Avatar
                                    source={booking.mentor?.profileImage}
                                    name={booking.mentor?.name}
                                    size="md"
                                />
                                <View style={styles.bookingInfo}>
                                    <Text style={styles.bookingMentor}>{booking.mentor?.name}</Text>
                                    <Text style={styles.bookingTime}>
                                        <Ionicons name="time-outline" size={14} color={whiteTheme.textSecondary} />
                                        {' '}{new Date(booking.date).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Badge
                                    text={booking.status}
                                    variant={booking.status === 'confirmed' ? 'success' : 'warning'}
                                    size="sm"
                                />
                            </View>
                        </Card>
                    ))}
                </View>
            )}

            {/* Quick Actions Menu */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.menuGrid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => {
                                // Use CommonActions for cross-tab navigation
                                navigation.dispatch(
                                    CommonActions.navigate({
                                        name: item.tab,
                                        params: {
                                            screen: item.screen,
                                        },
                                    })
                                );
                            }}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name={item.icon} size={24} color={whiteTheme.primary} />
                                {item.badge > 0 && (
                                    <View style={styles.menuBadge}>
                                        <Text style={styles.menuBadgeText}>{item.badge}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Career Progress */}
            <View style={styles.section}>
                <Card gradient gradientColors={[whiteTheme.accent + '30', whiteTheme.accent + '10']}>
                    <View style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <Ionicons name="rocket" size={32} color={whiteTheme.accent} />
                            <View style={styles.progressInfo}>
                                <Text style={styles.progressTitle}>Career Progress</Text>
                                <Text style={styles.progressSubtitle}>Keep up the great work!</Text>
                            </View>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '75%' }]} />
                        </View>
                        <Text style={styles.progressText}>75% of profile completed</Text>
                        <Button
                            title="Complete Profile"
                            variant="outline"
                            size="sm"
                            onPress={() => navigation.navigate('Profile')}
                            style={styles.progressButton}
                        />
                    </View>
                </Card>
            </View>

            <View style={styles.bottomPadding} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteTheme.background,
    },
    header: {
        padding: spacing.lg,
        paddingTop: spacing.xxl + 20,
        borderBottomLeftRadius: borderRadius.xxl,
        borderBottomRightRadius: borderRadius.xxl,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    headerLeft: {},
    greeting: {
        fontSize: fontSize.md,
        color: whiteTheme.white + 'CC',
    },
    userName: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: whiteTheme.white,
    },
    avatar: {
        borderWidth: 3,
        borderColor: whiteTheme.white,
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: whiteTheme.white + '15',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    statValue: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: whiteTheme.white,
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: whiteTheme.white + 'CC',
    },
    section: {
        padding: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: whiteTheme.text,
    },
    seeAll: {
        fontSize: fontSize.sm,
        color: whiteTheme.primary,
        fontWeight: fontWeight.medium,
    },
    bookingCard: {
        marginBottom: spacing.sm,
    },
    bookingContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookingInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    bookingMentor: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: whiteTheme.text,
    },
    bookingTime: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        marginTop: 2,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    menuItem: {
        width: (width - spacing.md * 3) / 2,
        backgroundColor: whiteTheme.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        ...shadows.sm,
    },
    menuIconContainer: {
        position: 'relative',
        marginBottom: spacing.sm,
    },
    menuBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: whiteTheme.error,
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuBadgeText: {
        fontSize: 10,
        color: whiteTheme.white,
        fontWeight: fontWeight.bold,
    },
    menuTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: whiteTheme.text,
    },
    menuSubtitle: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        marginTop: 2,
    },
    progressCard: {
        padding: spacing.sm,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    progressInfo: {
        marginLeft: spacing.md,
    },
    progressTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: whiteTheme.text,
    },
    progressSubtitle: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
    },
    progressBar: {
        height: 8,
        backgroundColor: whiteTheme.background,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: spacing.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: whiteTheme.accent,
        borderRadius: 4,
    },
    progressText: {
        fontSize: fontSize.sm,
        color: whiteTheme.textSecondary,
        marginBottom: spacing.md,
    },
    progressButton: {
        alignSelf: 'flex-start',
    },
    bottomPadding: {
        height: 100,
    },
});

export default DashboardScreen;
