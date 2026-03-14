// App.js — SkillPilot entry point with theme, splash, toast
import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ToastBanner } from './src/components/ui';
import Navigation from './src/navigation';
import SplashScreen from './src/screens/SplashScreen';

// Inner app — access theme after ThemeProvider is mounted
const InnerApp = () => {
  const navigationRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const { theme, isDark } = useTheme();

  const handleToastPress = (notification) => {
    setToast(null);
    const nav = navigationRef.current;
    if (!nav) return;
    switch (notification.type) {
      case 'booking': nav.navigate('Mentorship', { screen: 'MyBookings' }); break;
      case 'assessment': nav.navigate('Career', { screen: 'Assessment' }); break;
      case 'mentor': nav.navigate('Mentorship', { screen: 'MentorList' }); break;
      default: nav.navigate('Notifications'); break;
    }
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.background} />
      <AuthProvider>
        <NotificationProvider onNewNotification={(n) => n._isLive && setToast(n)}>
          <Navigation navigationRef={navigationRef} />
          <ToastBanner
            notification={toast}
            onDismiss={() => setToast(null)}
            onPress={handleToastPress}
          />
          {/* Splash shown on top until finished */}
          {showSplash && (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          )}
        </NotificationProvider>
      </AuthProvider>
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <InnerApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
