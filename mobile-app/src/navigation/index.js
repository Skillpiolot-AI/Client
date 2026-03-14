// navigation/index.js — Drawer + Stack navigation with role-based menu
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Loading } from '../components/ui';

// Auth Screens
import {
    WelcomeScreen, LoginScreen, SignupScreen, ForgotPasswordScreen,
    VerifyEmailScreen, OtpVerificationScreen, ResetPasswordScreen
} from '../screens/auth';

// Main Screens
import { HomeScreen, DashboardScreen } from '../screens/home';
import {
    MentorListScreen, BookSessionScreen, MyBookingsScreen,
    MentorDashboardScreen, EditMentorProfileScreen, MentorDetailScreen,
    BecomeMentorScreen
} from '../screens/mentorship';

import { ProfileScreen, EditProfileScreen } from '../screens/profile';
import { CareerQuizScreen, RecommendationsScreen } from '../screens/career';
import { AssessmentScreen, AssessmentQuizScreen, RiasecAssessmentScreen, RiasecResultScreen } from '../screens/assessment';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

// Admin Screens
import {
    AdminDashboardScreen, UserManagementScreen,
    MentorApplicationsScreen, SystemSettingsScreen, UpdatesScreen,
} from '../screens/admin';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ── Stack navigators ─────────────────────────────────────────────────────────

const SO = { headerShown: false };

const HomeStack = () => (
    <Stack.Navigator screenOptions={SO}>
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
);

const MentorshipStack = () => (
    <Stack.Navigator screenOptions={SO}>
        <Stack.Screen name="MentorList" component={MentorListScreen} />
        <Stack.Screen name="MentorDetail" component={MentorDetailScreen} />
        <Stack.Screen name="BookSession" component={BookSessionScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
    </Stack.Navigator>
);

const MentorStack = () => (
    <Stack.Navigator screenOptions={SO}>
        <Stack.Screen name="MentorDashboard" component={MentorDashboardScreen} />
        <Stack.Screen name="EditMentorProfile" component={EditMentorProfileScreen} />
    </Stack.Navigator>
);

const CareerStack = () => (
    <Stack.Navigator screenOptions={SO}>
        <Stack.Screen name="CareerQuiz" component={CareerQuizScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
        <Stack.Screen name="Assessment" component={AssessmentScreen} />
        <Stack.Screen name="AssessmentQuiz" component={AssessmentQuizScreen} />
        <Stack.Screen name="RiasecAssessment" component={RiasecAssessmentScreen} />
        <Stack.Screen name="RiasecResult" component={RiasecResultScreen} />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator screenOptions={SO}>
        <Stack.Screen name="ProfileMain" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="EditMentorProfile" component={EditMentorProfileScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="BecomeMentor" component={BecomeMentorScreen} />
    </Stack.Navigator>

);

const AdminStack = () => (
    <Stack.Navigator screenOptions={SO}>
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen name="MentorApplications" component={MentorApplicationsScreen} />
        <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
        <Stack.Screen name="AdminUpdates" component={UpdatesScreen} />
    </Stack.Navigator>
);

// ── Custom Drawer Content ─────────────────────────────────────────────────────
const CustomDrawer = (props) => {
    const { user, logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const { navigation } = props;

    const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
    const isMentor = user?.role === 'Mentor';
    const isAdmin = user?.role === 'Admin';

    const userLinks = [
        { label: 'Home', icon: 'home-outline', screen: 'Home' },
        { label: 'Find Mentors', icon: 'people-outline', screen: 'Mentorship' },
        { label: 'My Bookings', icon: 'calendar-outline', screen: 'Mentorship', nested: 'MyBookings' },
        { label: 'Assessment', icon: 'school-outline', screen: 'Career', nested: 'Assessment' },
        { label: 'Career Path', icon: 'compass-outline', screen: 'Career', nested: 'Assessment' },
        { label: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
        { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
    ];

    const mentorLinks = [
        { label: 'Home', icon: 'home-outline', screen: 'Home' },
        { label: 'My Sessions', icon: 'calendar-outline', screen: 'MentorSection' },
        { label: 'Find Mentors', icon: 'people-outline', screen: 'Mentorship' },
        { label: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
        { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
    ];

    const adminLinks = [
        { label: 'Dashboard', icon: 'stats-chart-outline', screen: 'Admin' },
        { label: 'Users', icon: 'people-outline', screen: 'Admin', nested: 'UserManagement' },
        { label: 'Mentor Apps', icon: 'checkmark-circle-outline', screen: 'Admin', nested: 'MentorApplications' },
        { label: 'Announcements', icon: 'megaphone-outline', screen: 'Admin', nested: 'AdminUpdates' },
        { label: 'Settings', icon: 'settings-outline', screen: 'Admin', nested: 'SystemSettings' },
    ];

    const links = isAdmin ? adminLinks : isMentor ? mentorLinks : userLinks;

    const navigate = (item) => {
        navigation.closeDrawer();
        if (item.nested) {
            navigation.navigate(item.screen, { screen: item.nested });
        } else {
            navigation.navigate(item.screen);
        }
    };

    const handleLogout = async () => {
        navigation.closeDrawer();
        await logout();
    };

    const roleBadgeColor = isAdmin ? '#EF4444' : isMentor ? '#F59E0B' : '#5B5FEF';
    const roleLabel = isAdmin ? 'Admin' : isMentor ? 'Mentor' : 'Student';

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: theme.surface }} showsVerticalScrollIndicator={false}>
            {/* Profile section */}
            <View style={[drawerStyles.profileSection, { borderBottomColor: theme.border }]}>
                <View style={[drawerStyles.avatar, { backgroundColor: '#EEF2FF' }]}>
                    <Text style={drawerStyles.avatarText}>{initial}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[drawerStyles.userName, { color: theme.text }]} numberOfLines={1}>{user?.name || 'User'}</Text>
                    <Text style={[drawerStyles.userEmail, { color: theme.textMuted }]} numberOfLines={1}>{user?.email || ''}</Text>
                    <View style={[drawerStyles.roleBadge, { backgroundColor: roleBadgeColor + '20' }]}>
                        <View style={[drawerStyles.roleDot, { backgroundColor: roleBadgeColor }]} />
                        <Text style={[drawerStyles.roleText, { color: roleBadgeColor }]}>{roleLabel}</Text>
                    </View>
                </View>
            </View>

            {/* Nav Links */}
            <View style={drawerStyles.linksSection}>
                {links.map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        style={drawerStyles.linkRow}
                        onPress={() => navigate(item)}
                        activeOpacity={0.7}
                    >
                        <View style={[drawerStyles.linkIcon, { backgroundColor: theme.surfaceAlt }]}>
                            <Ionicons name={item.icon} size={19} color={theme.textSecondary} />
                        </View>
                        <Text style={[drawerStyles.linkLabel, { color: theme.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Divider */}
            <View style={[drawerStyles.divider, { backgroundColor: theme.border }]} />

            {/* Theme toggle */}
            <View style={drawerStyles.themeRow}>
                <View style={[drawerStyles.linkIcon, { backgroundColor: theme.surfaceAlt }]}>
                    <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={19} color={theme.textSecondary} />
                </View>
                <Text style={[drawerStyles.linkLabel, { color: theme.text }]}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
                <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#E5E7EB', true: '#5B5FEF' }}
                    thumbColor="#fff"
                    style={{ marginLeft: 'auto' }}
                />
            </View>

            {/* Logout */}
            <TouchableOpacity style={drawerStyles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={19} color="#EF4444" />
                <Text style={drawerStyles.logoutText}>Sign Out</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </DrawerContentScrollView>
    );
};

const drawerStyles = StyleSheet.create({
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        gap: 14,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    avatar: {
        width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 22, fontWeight: '700', color: '#5B5FEF' },
    userName: { fontSize: 16, fontWeight: '700' },
    userEmail: { fontSize: 12, marginTop: 2 },
    roleBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 100, marginTop: 6,
    },
    roleDot: { width: 6, height: 6, borderRadius: 3 },
    roleText: { fontSize: 11, fontWeight: '700' },
    linksSection: { paddingHorizontal: 12, paddingVertical: 4 },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10 },
    linkIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    linkLabel: { fontSize: 15, fontWeight: '600' },
    divider: { height: 1, marginHorizontal: 20, marginVertical: 12 },
    themeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 8 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14, marginTop: 4 },
    logoutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
});

// ── Main Drawer ───────────────────────────────────────────────────────────────
const MainDrawer = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isMentor = user?.role === 'Mentor';
    const isAdmin = user?.role === 'Admin';

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'slide',
                swipeEdgeWidth: 60,
                drawerStyle: { width: '78%', backgroundColor: theme.surface },
            }}
        >
            <Drawer.Screen name="Home" component={HomeStack} />
            <Drawer.Screen name="Mentorship" component={MentorshipStack} />
            {isMentor && <Drawer.Screen name="MentorSection" component={MentorStack} />}
            <Drawer.Screen name="Career" component={CareerStack} />
            <Drawer.Screen name="Profile" component={ProfileStack} />
            <Drawer.Screen name="Notifications" component={NotificationsScreen} />
            {isAdmin && <Drawer.Screen name="Admin" component={AdminStack} />}
        </Drawer.Navigator>
    );
};

// ── Auth Stack ────────────────────────────────────────────────────────────────
const AuthStack = () => (
    <Stack.Navigator screenOptions={SO}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
);

// ── Root Navigator ────────────────────────────────────────────────────────────
const RootNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { theme } = useTheme();

    if (isLoading) return <Loading fullScreen text="Loading..." />;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
            {isAuthenticated ? (
                <Stack.Screen name="Main" component={MainDrawer} />
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
};

const Navigation = ({ navigationRef }) => (
    <NavigationContainer ref={navigationRef}>
        <RootNavigator />
    </NavigationContainer>
);

export default Navigation;
