import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, LogOut } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function WorkerProfileEdit() {
  const { setAuthenticated, setRole, user, setUser } = useStore();
  const [name, setName] = useState(user?.name || 'Ramesh Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [skill, setSkill] = useState(user?.skill || 'Plumber');
  const [hourly, setHourly] = useState(user?.hourlyRate || '400');
  const [daily, setDaily] = useState(user?.dailyRate || '1200');
  const [experience, setExperience] = useState(user?.experience || '3-5 years');
  const [availability, setAvailability] = useState(user?.availability || 'Full-time');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const handleLogout = () => {
    setAuthenticated(false);
    setRole(null);
  };

  const getInitials = (name) => {
    if (!name) return 'W';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload your profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (setUser) {
      setUser({
        ...user,
        name,
        phone,
        skill,
        hourlyRate: hourly,
        dailyRate: daily,
        experience,
        availability,
        profileImage,
      });
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(name)}</Text>
              )}
              <Camera color={colors.accent} size={24} style={styles.cameraIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Primary Skill</Text>
          <TextInput style={styles.input} value={skill} onChangeText={setSkill} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Years of Experience</Text>
          <View style={styles.chipsContainer}>
            {['Less than 1 year', '1-2 years', '3-5 years', '5+ years'].map((exp) => (
              <TouchableOpacity
                key={exp}
                style={[styles.chip, experience === exp && styles.chipActive]}
                onPress={() => setExperience(exp)}
              >
                <Text style={[styles.chipText, experience === exp && styles.chipTextActive]}>{exp}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Availability</Text>
          <View style={styles.chipsContainer}>
            {['Full-time', 'Part-time', 'Weekends only'].map((avail) => (
              <TouchableOpacity
                key={avail}
                style={[styles.chip, availability === avail && styles.chipActive]}
                onPress={() => setAvailability(avail)}
              >
                <Text style={[styles.chipText, availability === avail && styles.chipTextActive]}>{avail}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pricing Details</Text>
        
        <View style={styles.priceRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Hourly Rate (₹)</Text>
            <TextInput style={styles.input} value={hourly} onChangeText={setHourly} keyboardType="numeric" />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Daily Rate (₹)</Text>
            <TextInput style={styles.input} value={daily} onChangeText={setDaily} keyboardType="numeric" />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color={colors.danger} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: colors.textSecondary },
  cameraIcon: { position: 'absolute', bottom: 6, right: 6 },
  changePhoto: { color: colors.accent, fontWeight: 'bold', marginTop: 12 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 15,
    color: colors.text,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 10, marginBottom: 16 },
  priceRow: { flexDirection: 'row', gap: 16 },
  saveBtn: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 32 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.danger, justifyContent: 'center' },
  logoutText: { color: colors.danger, fontSize: 16, fontWeight: 'bold' },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.surface,
  },
});
