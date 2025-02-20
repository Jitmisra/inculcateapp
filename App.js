import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './navigation/appNavigation';
import * as SplashScreen from 'expo-splash-screen';

import { 
  useFonts, 
  Outfit_400Regular, 
  Outfit_500Medium, 
  Outfit_600SemiBold 
} from '@expo-google-fonts/outfit';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  let [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        // Hide the splash screen after fonts are loaded
        await SplashScreen.hideAsync();
      }
    };
    
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Return null instead of AppLoading
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