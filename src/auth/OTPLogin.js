import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Phone } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function OTPLogin({ navigation }) {
  const { usersLogs, setUser, setRole, setAuthenticated } = useStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState(null); // Simulated
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSendOTP = () => {
    // In a real app, integrate Firebase Auth signInWithPhoneNumber
    if (phone.length === 10) {
      setConfirmResult(true);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 4) {
      const typedClean = phone.replace(/\D/g, '');
      const existingUser = (usersLogs || []).find((u) => {
        if (!u.phone) return false;
        const storedClean = u.phone.replace(/\D/g, '');
        return storedClean.endsWith(typedClean);
      });

      if (existingUser) {
        setUser(existingUser);
        setRole(existingUser.role);
        setAuthenticated(true);
      } else {
        navigation.navigate('RoleSelection', { phone: phone, isSignUp: isSignUp });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{isSignUp ? 'Create an Account 🚀' : 'Welcome Back! 👋'}</Text>
          <Text style={styles.subtitle}>
            {!confirmResult 
              ? (isSignUp ? 'Enter your phone number to sign up' : 'Enter your phone number to log in') 
              : 'Enter the 4-digit code sent to you'}
          </Text>
        </View>

        {!confirmResult ? (
          <View style={styles.form}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="00000 00000"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
              <Phone color={colors.textLight} size={20} />
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity 
              style={[styles.button, phone.length !== 10 && styles.buttonDisabled]} 
              onPress={handleSendOTP}
              disabled={phone.length !== 10}
            >
              <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.toggleContainer} 
              onPress={() => setIsSignUp(!isSignUp)}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleText}>
                {isSignUp ? "Already have an account? " : "New to MazdoorHub? "}
                <Text style={styles.toggleTextBold}>{isSignUp ? "Log In" : "Sign Up"}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Enter OTP</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { paddingLeft: 16, letterSpacing: 8, fontSize: 24 }]}
                placeholder="0000"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                autoFocus
              />
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity 
              style={[styles.button, otp.length !== 4 && styles.buttonDisabled]} 
              onPress={handleVerifyOTP}
              disabled={otp.length !== 4}
            >
              <Text style={styles.buttonText}>Verify & Proceed</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  prefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
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
  toggleContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  toggleText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  toggleTextBold: {
    fontWeight: 'bold',
    color: colors.accent,
  },
});
