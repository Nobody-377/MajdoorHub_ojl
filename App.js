import React, { useEffect } from 'react';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(false);
      RNStatusBar.setBackgroundColor('#ffffff');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
