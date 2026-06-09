import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HardHat } from 'lucide-react-native';
import colors from '../utils/colors';

export default function Splash({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <HardHat color={colors.surface} size={64} />
      </View>
      <Text style={styles.title}>MazdoorHub</Text>
      <Text style={styles.subtitle}>Build Better. Build Together.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colors.accent,
    padding: 24,
    borderRadius: 32,
    marginBottom: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
});
