import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ArrowRight, User, Mail, MapPin, Wrench, DollarSign, Clock, Briefcase, Calendar, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';
import useStore from '../store/useStore';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai'];

export default function SignupQuestions({ navigation, route }) {
  const { phone, role } = route.params || { phone: '', role: 'customer' };
  const { setRole, setAuthenticated, setUser } = useStore();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Worker-specific states
  const [skill, setSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');

  // Customer-specific states
  const [preferredCategories, setPreferredCategories] = useState([]);

  const totalSteps = role === 'worker' ? 7 : 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const formattedPhone = `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
      const finalSkill = role === 'worker' ? (skill === 'Other' ? customSkill : skill) : null;
      
      setUser({
        uid: 'temp-uid',
        role: role,
        phone: formattedPhone,
        name: name.trim(),
        email: email.trim() || 'Not Provided',
        location: selectedCity,
        skill: finalSkill,
        hourlyRate: role === 'worker' ? hourlyRate : null,
        dailyRate: role === 'worker' ? dailyRate : null,
        experience: role === 'worker' ? experience : null,
        availability: role === 'worker' ? availability : null,
        preferredCategories: role === 'customer' ? preferredCategories : [],
      });
      setRole(role);
      setAuthenticated(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  // Check if button should be disabled for current step
  const isButtonDisabled = () => {
    if (role === 'worker') {
      if (step === 1) return name.trim().length === 0;
      if (step === 2) return skill === '' || (skill === 'Other' && customSkill.trim().length === 0);
      if (step === 3) return !experience; // Require user to select an experience option
      if (step === 4) return !availability; // Require user to select an availability option
      if (step === 5) return hourlyRate.trim().length === 0 || dailyRate.trim().length === 0;
      if (step === 6) return !selectedCity;
      return false; // Step 7 (Email) is optional
    } else {
      if (step === 1) return name.trim().length === 0;
      if (step === 2) return preferredCategories.length === 0;
      if (step === 3) return !selectedCity;
      return false; // Step 4 (Email) is optional
    }
  };

  // Render progress bar
  const renderProgress = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of {totalSteps}</Text>
      </View>
    );
  };

  const renderStepContent = () => {
    let stepType = '';
    if (role === 'worker') {
      if (step === 1) stepType = 'name';
      else if (step === 2) stepType = 'skill';
      else if (step === 3) stepType = 'experience';
      else if (step === 4) stepType = 'availability';
      else if (step === 5) stepType = 'pricing';
      else if (step === 6) stepType = 'city';
      else if (step === 7) stepType = 'email';
    } else {
      if (step === 1) stepType = 'name';
      else if (step === 2) stepType = 'preferredCategories';
      else if (step === 3) stepType = 'city';
      else if (step === 4) stepType = 'email';
    }

    switch (stepType) {
      case 'name':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>What is your name? 👤</Text>
              <Text style={styles.subtitle}>Enter your full name so others can identify you on MazdoorHub.</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={40}
              />
              <User color={colors.textLight} size={20} />
            </View>
          </View>
        );

      case 'email':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>What is your email? 📧</Text>
              <Text style={styles.subtitle}>Optional. Enter your email for digital receipts, support, and updates.</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
                maxLength={50}
              />
              <Mail color={colors.textLight} size={20} />
            </View>
          </View>
        );

      case 'city':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Where are you located? 📍</Text>
              <Text style={styles.subtitle}>Select your primary operating city to help us match you with nearby users.</Text>
            </View>

            <View style={styles.citiesGrid}>
              {CITIES.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={[styles.cityChip, isSelected && styles.cityChipSelected]}
                    onPress={() => setSelectedCity(city)}
                    activeOpacity={0.8}
                  >
                    <MapPin color={isSelected ? colors.surface : colors.textSecondary} size={16} />
                    <Text style={[styles.cityText, isSelected && styles.cityTextSelected]}>{city}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'skill':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>What is your primary skill? 🛠️</Text>
              <Text style={styles.subtitle}>Select your specialty so customers can find and hire you.</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skillsRow} style={styles.skillsScrollContainer}>
              {['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'AC Service', 'Gardener', 'Other'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.skillChip, skill === item && styles.skillChipActive]}
                  onPress={() => setSkill(item)}
                >
                  <Text style={[styles.skillChipText, skill === item && styles.skillChipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {skill === 'Other' && (
              <View style={[styles.inputContainer, { marginTop: 16 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your skill (e.g. Mason, Welder)"
                  placeholderTextColor={colors.textLight}
                  value={customSkill}
                  onChangeText={setCustomSkill}
                  autoFocus
                  maxLength={30}
                />
                <Wrench color={colors.textLight} size={20} />
              </View>
            )}
          </View>
        );

      case 'pricing':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>What are your rates? 💰</Text>
              <Text style={styles.subtitle}>Set your target hourly and daily service rates in Rupees.</Text>
            </View>
            
            <View style={styles.rateInputsRow}>
              <View style={styles.rateInputGroup}>
                <Text style={styles.rateLabel}>Hourly Rate (₹)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="400"
                    placeholderTextColor={colors.textLight}
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <Clock color={colors.textLight} size={18} />
                </View>
              </View>

              <View style={styles.rateInputGroup}>
                <Text style={styles.rateLabel}>Daily Rate (₹)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="1200"
                    placeholderTextColor={colors.textLight}
                    value={dailyRate}
                    onChangeText={setDailyRate}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <DollarSign color={colors.textLight} size={18} />
                </View>
              </View>
            </View>
          </View>
        );

      case 'experience':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>How much experience do you have? ⏳</Text>
              <Text style={styles.subtitle}>Select your years of working experience in this field.</Text>
            </View>

            <View style={styles.optionsVertical}>
              {['Less than 1 year', '1-2 years', '3-5 years', '5+ years'].map((exp) => {
                const isSelected = experience === exp;
                return (
                  <TouchableOpacity
                    key={exp}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setExperience(exp)}
                    activeOpacity={0.8}
                  >
                    <Briefcase color={isSelected ? colors.surface : colors.textSecondary} size={20} />
                    <Text style={[styles.optionCardText, isSelected && styles.optionCardTextSelected]}>{exp}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'availability':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>What is your availability? 📅</Text>
              <Text style={styles.subtitle}>Let us know when you are ready to take on job requests.</Text>
            </View>

            <View style={styles.optionsVertical}>
              {['Full-time', 'Part-time', 'Weekends only'].map((avail) => {
                const isSelected = availability === avail;
                return (
                  <TouchableOpacity
                    key={avail}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setAvailability(avail)}
                    activeOpacity={0.8}
                  >
                    <Calendar color={isSelected ? colors.surface : colors.textSecondary} size={20} />
                    <Text style={[styles.optionCardText, isSelected && styles.optionCardTextSelected]}>{avail}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'preferredCategories':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>What services do you need? 🛠️</Text>
              <Text style={styles.subtitle}>Select one or more categories you are interested in.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.categoriesGrid} showsVerticalScrollIndicator={false}>
              {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Gardening', 'AC Service'].map((cat) => {
                const isSelected = preferredCategories.includes(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    onPress={() => {
                      if (isSelected) {
                        setPreferredCategories(preferredCategories.filter(c => c !== cat));
                      } else {
                        setPreferredCategories([...preferredCategories, cat]);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.categoryCardText, isSelected && styles.categoryCardTextSelected]}>{cat}</Text>
                    {isSelected && <Check color={colors.surface} size={16} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        {renderProgress()}

        {renderStepContent()}

        <View style={{ flex: 1 }} />

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.button, isButtonDisabled() && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={isButtonDisabled()}
        >
          <Text style={styles.buttonText}>
            {step === totalSteps ? 'Complete Sign Up' : 'Continue'}
          </Text>
          <ArrowRight color={colors.surface} size={20} />
        </TouchableOpacity>
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
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 16,
    marginBottom: 16,
  },
  backBtnText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
    textAlign: 'right',
  },
  stepContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: '45%',
  },
  cityChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  cityText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  cityTextSelected: {
    color: colors.surface,
  },
  skillsScrollContainer: {
    maxHeight: 50,
    marginBottom: 10,
  },
  skillsRow: {
    gap: 8,
    alignItems: 'center',
  },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  skillChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  skillChipTextActive: {
    color: colors.surface,
  },
  rateInputsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rateInputGroup: {
    flex: 1,
  },
  rateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
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
  optionsVertical: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionCardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionCardTextSelected: {
    color: colors.surface,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: '45%',
    flexGrow: 1,
  },
  categoryCardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  categoryCardTextSelected: {
    color: colors.surface,
  },
});
