// SkillPilot Mobile App - Main Entry Point
import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ToastBanner } from './src/components/ui';
import Navigation from './src/navigation';
import { colors } from './src/theme';
import { useThemeStore } from './src/store/themeStore';

export default function App() {
  const navigationRef = useRef(null);
  const [toast, setToast] = useState(null);

  // Theme store
  const { themeKey, initTheme } = useThemeStore();

  // Load saved theme once on startup (mutates colors object before first render)
  useEffect(() => { initTheme(); }, []);

  const handleToastPress = (notification) => {
    setToast(null);
    const nav = navigationRef.current;
    if (!nav) return;
    switch (notification.type) {
      case 'booking':    nav.navigate('Mentorship',  { screen: 'MyBookings' }); break;
      case 'assessment': nav.navigate('Career',      { screen: 'Assessment' }); break;
      case 'mentor':     nav.navigate('Mentorship',  { screen: 'MentorList' }); break;
      default:           nav.navigate('Notifications'); break;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NotificationProvider onNewNotification={(n) => n._isLive && setToast(n)}>
            <StatusBar style="auto" backgroundColor={colors.background} />
            {/*
              key={themeKey} forces a full re-mount of the navigation tree
              whenever the user switches themes, so every StyleSheet.create()
              re-evaluates with the newly mutated colors object.
            */}
            <Navigation key={themeKey} navigationRef={navigationRef} />
            {/* Global foreground toast banner */}
            <ToastBanner
              notification={toast}
              onDismiss={() => setToast(null)}
              onPress={handleToastPress}
            />
          </NotificationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
