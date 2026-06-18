import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, LogOut, Eye, Trash2, Image as ImageIcon, Check, Star } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function WorkerProfileEdit() {
  const { setAuthenticated, setRole, user, setUser, reviews } = useStore();
  const [name, setName] = useState(user?.name || 'Ramesh Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  const workerId = user?.id || 1; 
  const myReviews = (reviews || []).filter(r => r.workerId === workerId);
  
  const getInitialSkills = () => {
    if (user?.skills && user.skills.length > 0) return user.skills;
    if (user?.skill) return user.skill.split(', ');
    return ['Plumber'];
  };
  const [skills, setSkills] = useState(getInitialSkills());
  
  const getInitialCustomSkill = () => {
    const s = getInitialSkills();
    const custom = s.find(item => !['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'AC Service', 'Gardener'].includes(item));
    return custom || '';
  };
  const [customSkill, setCustomSkill] = useState(getInitialCustomSkill());
  
  const [hourly, setHourly] = useState(user?.hourlyRate || '400');
  const [daily, setDaily] = useState(user?.dailyRate || '1200');
  const [experience, setExperience] = useState(user?.experience || '3-5 years');
  const [availability, setAvailability] = useState(user?.availability || 'Full-time');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [isViewImageVisible, setIsViewImageVisible] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

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

  const handleAvatarPress = () => {
    setIsOptionsVisible(true);
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
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      if (setUser) {
        setUser({
          ...user,
          profileImage: uri,
        });
      }
      setIsOptionsVisible(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      if (setUser) {
        setUser({
          ...user,
          profileImage: uri,
        });
      }
      setIsOptionsVisible(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setProfileImage(null);
            setIsOptionsVisible(false);
          }
        }
      ]
    );
  };

  const handleSave = () => {
    if (skills.length === 0) {
      Alert.alert('Required', 'Please select at least one skill.');
      return;
    }
    const hasOther = skills.includes('Other') || skills.some(s => !['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'AC Service', 'Gardener', 'Other'].includes(s));
    if (hasOther && !customSkill.trim()) {
      Alert.alert('Required', 'Please enter your custom skill.');
      return;
    }

    const finalSkills = skills.map(s => s === 'Other' ? customSkill.trim() : s).filter(Boolean);
    const skillsDisplay = finalSkills.join(', ');

    if (setUser) {
      setUser({
        ...user,
        name,
        phone,
        skills: finalSkills,
        skill: skillsDisplay,
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
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(name)}</Text>
              )}
              <Camera color={colors.accent} size={24} style={styles.cameraIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAvatarPress}>
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
          <Text style={styles.label}>Skills / Occupations</Text>
          <View style={styles.categoriesGrid}>
            {['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'AC Service', 'Gardener', 'Other'].map((item) => {
              const isSelected = skills.includes(item) || (item === 'Other' && skills.some(s => !['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'AC Service', 'Gardener', 'Other'].includes(s)));
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                  onPress={() => {
                    if (item === 'Other') {
                      if (skills.includes('Other')) {
                        setSkills(skills.filter(s => s !== 'Other'));
                        setCustomSkill('');
                      } else {
                        setSkills([...skills, 'Other']);
                      }
                    } else {
                      if (skills.includes(item)) {
                        setSkills(skills.filter(s => s !== item));
                      } else {
                        setSkills([...skills, item]);
                      }
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryCardText, isSelected && styles.categoryCardTextSelected]}>{item}</Text>
                  {isSelected && <Check color={colors.surface} size={16} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {(skills.includes('Other') || skills.some(s => !['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'AC Service', 'Gardener', 'Other'].includes(s))) && (
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Type your skill (e.g. Mason, Welder)"
              placeholderTextColor={colors.textLight}
              value={customSkill}
              onChangeText={(text) => {
                setCustomSkill(text);
                const baseSkills = skills.filter(s => ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'AC Service', 'Gardener'].includes(s));
                if (text.trim()) {
                  setSkills([...baseSkills, text.trim()]);
                } else {
                  setSkills(baseSkills);
                }
              }}
            />
          )}
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

        {/* Customer Reviews Section for the Labor themselves */}
        <Text style={styles.sectionTitle}>Reviews from Customers ({myReviews.length})</Text>
        {myReviews.length === 0 ? (
          <Text style={styles.noReviewsText}>No reviews received yet.</Text>
        ) : (
          <View style={styles.reviewsList}>
            {myReviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAuthorBg}>
                    <Text style={styles.reviewAuthorInitial}>{rev.customerName.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthorName}>{rev.customerName}</Text>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                  <View style={styles.reviewStarsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        color={s <= rev.rating ? colors.warning : colors.border}
                        fill={s <= rev.rating ? colors.warning : 'transparent'}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewBody}>{rev.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color={colors.danger} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Full Screen Image Viewer Modal */}
      <Modal
        visible={isViewImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsViewImageVisible(false)}
      >
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity 
            style={styles.imageViewerCloseArea} 
            activeOpacity={1} 
            onPress={() => setIsViewImageVisible(false)}
          />
          <View style={styles.imageViewerContainer}>
            {profileImage && (
              <Image source={{ uri: profileImage }} style={styles.fullScreenImage} resizeMode="contain" />
            )}
            <TouchableOpacity 
              style={styles.imageViewerCloseBtn} 
              onPress={() => setIsViewImageVisible(false)}
            >
              <Text style={styles.imageViewerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Premium Photo Options Bottom Sheet */}
      <Modal
        visible={isOptionsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOptionsVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity 
            style={styles.sheetCloseArea} 
            activeOpacity={1} 
            onPress={() => setIsOptionsVisible(false)}
          />
          <View style={styles.sheetContainer}>
            {/* Top Drag Handle Indicator */}
            <View style={styles.sheetHandle} />

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.sheetAvatarPreview} />
                ) : (
                  <View style={styles.sheetAvatarPlaceholder}>
                    <Text style={styles.sheetAvatarPlaceholderText}>{getInitials(name)}</Text>
                  </View>
                )}
                <Text style={styles.sheetTitle}>Profile Picture Options</Text>
              </View>
            </View>

            {/* Options List */}
            <View style={styles.sheetOptionsList}>
              <TouchableOpacity style={styles.sheetOptionBtn} onPress={pickImage}>
                <View style={[styles.sheetIconContainer, { backgroundColor: `${colors.primary}12` }]}>
                  <ImageIcon size={22} color={colors.primary} />
                </View>
                <View style={styles.sheetOptionTextContainer}>
                  <Text style={styles.sheetOptionTitle}>Upload</Text>
                  <Text style={styles.sheetOptionSubtitle}>Choose an image from your library</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetOptionBtn} onPress={takePhoto}>
                <View style={[styles.sheetIconContainer, { backgroundColor: `${colors.accent}12` }]}>
                  <Camera size={22} color={colors.accent} />
                </View>
                <View style={styles.sheetOptionTextContainer}>
                  <Text style={styles.sheetOptionTitle}>Update</Text>
                  <Text style={styles.sheetOptionSubtitle}>Take a new photo with camera</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity 
              style={styles.sheetCancelBtn} 
              onPress={() => setIsOptionsVisible(false)}
            >
              <Text style={styles.sheetCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerCloseArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imageViewerContainer: {
    width: '90%',
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imageViewerCloseBtn: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  imageViewerCloseText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetCloseArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetAvatarPreview: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  sheetAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAvatarPlaceholderText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  sheetOptionsList: {
    gap: 12,
    marginBottom: 24,
  },
  sheetOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 16,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptionTextContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  sheetOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sheetOptionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sheetCancelBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sheetCancelBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryCardTextSelected: {
    color: colors.surface,
  },
  noReviewsText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  reviewsList: {
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewAuthorBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(13, 59, 102, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAuthorInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  reviewAuthorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 1,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    paddingLeft: 4,
  },
});
