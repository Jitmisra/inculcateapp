import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import AppNavigator from './navigation/appNavigation';
import * as SplashScreen from 'expo-splash-screen';
import * as amplitude from '@amplitude/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Replace font loading with a simple ready state
  const [appReady, setAppReady] = useState(true);

  // Use a ref to store the session start time
  const sessionStartTimeRef = useRef(Date.now());

  // Listen for app state changes and track session duration
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App came to foreground: reset start time
        sessionStartTimeRef.current = Date.now();
      } else if (nextAppState === 'background') {
        // App went to background: calculate duration in minutes (2 decimal places)
        const sessionDurationMinutes = parseFloat(
          ((Date.now() - sessionStartTimeRef.current) / (1000 * 60)).toFixed(2)
        );
        amplitude.track('App Session Duration', { 
          duration_minutes: sessionDurationMinutes,
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const initializeAnalytics = async () => {
      if (appReady) {
        // Get email from AsyncStorage
        const userEmail = await AsyncStorage.getItem('userEmail');
        // Initialize Amplitude using the retrieved email (fall back to 'anonymousUser' if not found)
        await amplitude.init('e175d2083cd45a89348353d06185ca37', userEmail || 'anonymousUser');

        amplitude.track('App Loaded');
        await SplashScreen.hideAsync();
      }
    };

    initializeAnalytics();
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  // Set the default font for all Text components
  if (Text.defaultProps == null) {
    Text.defaultProps = {};
  }
  Text.defaultProps.style = { fontFamily: 'mona-sans' };

  return (
    <AppNavigator/>
  );
}