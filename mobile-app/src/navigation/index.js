// Navigation Configuration
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/ui';
import { fontSize } from '../theme';

// Auth Screens
import { WelcomeScreen, LoginScreen, SignupScreen, ForgotPasswordScreen, VerifyEmailScreen } from '../screens/auth';

// Main Screens
import { HomeScreen, DashboardScreen } from '../screens/home';
import { MentorListScreen, BookSessionScreen, MyBookingsScreen, MentorDashboardScreen, EditMentorProfileScreen } from '../screens/mentorship';
import { ProfileScreen } from '../screens/profile';
import { CareerQuizScreen, RecommendationsScreen } from '../screens/career';
import { AssessmentScreen, AssessmentQuizScreen } from '../screens/assessment';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: '#FFFFFF' },
};

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
);

// Home Stack
const HomeStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
);

// Mentorship Stack
const MentorshipStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="MentorList" component={MentorListScreen} />
        <Stack.Screen name="BookSession" component={BookSessionScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
    </Stack.Navigator>
);

// Career Stack
const CareerStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="CareerQuiz" component={CareerQuizScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
        <Stack.Screen name="Assessment" component={AssessmentScreen} />
        <Stack.Screen name="AssessmentQuiz" component={AssessmentQuizScreen} />
    </Stack.Navigator>
);

// Profile Stack  
const ProfileStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
    const { user } = useAuth();
    const isMentor = user?.role === 'Mentor';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#E5E7EB',
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                tabBarActiveTintColor: '#FF6B35',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: '600' },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
                        case 'Mentorship': iconName = focused ? 'people' : 'people-outline'; break;
                        case 'Dashboard': iconName = focused ? 'stats-chart' : 'stats-chart-outline'; break;
                        case 'Career': iconName = focused ? 'compass' : 'compass-outline'; break;
                        case 'Profile': iconName = focused ? 'person' : 'person-outline'; break;
                    }
                    return <Ionicons name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Mentorship" component={MentorshipStack} />

            {/* Conditional Dashboard for Mentors */}
            {isMentor && (
                <Tab.Screen name="Dashboard" component={MentorDashboardScreen} />
            )}

            <Tab.Screen name="Career" component={CareerStack} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
};

// Root Navigator
const RootNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <Loading fullScreen text="Loading..." />;
    }

    return (
        <Stack.Navigator screenOptions={screenOptions}>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="Notifications" component={NotificationsScreen} />
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
};

const Navigation = () => (
    <NavigationContainer>
        <RootNavigator />
    </NavigationContainer>
);

export default Navigation;
