import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { User, HardHat, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function RoleSelection({ navigation, route }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const { setRole, setAuthenticated, setUser } = useStore();

  const handleContinue = () => {
    if (selectedRole) {
      const phone = route.params?.phone || '9876543210';
      const isSignUp = route.params?.isSignUp ?? true;

      if (isSignUp) {
        navigation.navigate('SignupQuestions', { phone, role: selectedRole });
      } else {
        const formattedPhone = `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
        setUser({
          uid: 'temp-uid',
          role: selectedRole,
          phone: formattedPhone,
          name: selectedRole === 'worker' ? 'Your name' : 'null',
          email: 'nandini@example.com',
          location: 'Mumbai',
          skill: selectedRole === 'worker' ? 'null' : null,
          hourlyRate: selectedRole === 'worker' ? 'null' : null,
          dailyRate: selectedRole === 'worker' ? 'null' : null,
          experience: selectedRole === 'worker' ? 'null' : null,
          availability: selectedRole === 'worker' ? 'null' : null,
          preferredCategories: selectedRole === 'customer' ? ['Cleaning', 'Plumbing'] : [],
        });
        setRole(selectedRole);
        setAuthenticated(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Who are you?</Text>
          <Text style={styles.subtitle}>Choose how you want to use MazdoorHub</Text>
        </View>

        <View style={styles.options}>
          {/* Customer Option */}
          <TouchableOpacity 
            style={[styles.card, selectedRole === 'customer' && styles.cardSelected]}
            onPress={() => setSelectedRole('customer')}
            activeOpacity={0.8}
          >
            {selectedRole === 'customer' && (
              <View style={styles.checkIcon}>
                <CheckCircle2 color={colors.accent} size={24} />
              </View>
            )}
            <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
              <User color={colors.surface} size={32} />
            </View>
            <Text style={styles.cardTitle}>I am a Customer</Text>
            <Text style={styles.cardSubtitle}>I want to hire skilled workers for my projects or daily needs.</Text>
          </TouchableOpacity>

          {/* Worker Option */}
          <TouchableOpacity 
            style={[styles.card, selectedRole === 'worker' && styles.cardSelected]}
            onPress={() => setSelectedRole('worker')}
            activeOpacity={0.8}
          >
            {selectedRole === 'worker' && (
              <View style={styles.checkIcon}>
                <CheckCircle2 color={colors.accent} size={24} />
              </View>
            )}
            <View style={[styles.iconBox, { backgroundColor: colors.accent }]}>
              <HardHat color={colors.surface} size={32} />
            </View>
            <Text style={styles.cardTitle}>I am a Worker</Text>
            <Text style={styles.cardSubtitle}>I want to find jobs, track hours, and earn money.</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, !selectedRole && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  options: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(249, 115, 22, 0.05)',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  checkIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.accentLight,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
