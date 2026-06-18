import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Switch, Alert, Platform, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, User, MapPin, CreditCard, HelpCircle, Shield, Share2, ChevronRight, Edit3, X, Save, Plus, Key, RefreshCw, Trash2, Smartphone, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { setAuthenticated, setRole, user, setUser } = useStore();
  const [activeModal, setActiveModal] = useState(null);

  // Form states for Edit Profile
  const [name, setName] = useState(user?.name || 'Nandini Patel');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'nandini@example.com');
  const [preferredCategories, setPreferredCategories] = useState(user?.preferredCategories || []);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [isViewImageVisible, setIsViewImageVisible] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleAvatarPress = () => {
    const options = [
      { text: 'Update Picture', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' }
    ];
    
    if (profileImage) {
      options.unshift({ text: 'View Picture', onPress: () => setIsViewImageVisible(true) });
    }
    
    Alert.alert(
      'Profile Photo',
      'Choose an action for your profile picture.',
      options
    );
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
    }
  };

  // Address dynamic state
  const [addresses, setAddresses] = useState([
    { id: '1', type: 'Home', isDefault: true, text: 'B-402, Green Park Society, Link Road, Andheri West, Mumbai - 400053' },
    { id: '2', type: 'Work', isDefault: false, text: 'Unit 12, Pinnacle Business Park, Mahakali Caves Road, Andheri East, Mumbai - 400093' }
  ]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddressType, setNewAddressType] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');

  const handleAddAddress = () => {
    if (!newAddressText.trim()) {
      Alert.alert('Error', 'Please enter a valid address.');
      return;
    }
    const newAddr = {
      id: Date.now().toString(),
      type: newAddressType,
      isDefault: false,
      text: newAddressText
    };
    setAddresses([...addresses, newAddr]);
    setNewAddressText('');
    setNewAddressType('Home');
    setShowAddAddressForm(false);
    Alert.alert('Success', 'Address added successfully!');
  };

  // Sync state if user object changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.preferredCategories) setPreferredCategories(user.preferredCategories);
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  // Toggle states for Privacy Settings
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(true);

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = () => {
    setAuthenticated(false);
    setRole(null);
  };

  const menuItems = [
    { id: 'edit', title: 'Edit Profile', icon: User, color: colors.primaryLight },
    { id: 'addresses', title: 'Saved Addresses', icon: MapPin, color: '#3B82F6' },
    { id: 'payments', title: 'Payment Methods', icon: CreditCard, color: '#10B981' },
    { id: 'support', title: 'Help & Support', icon: HelpCircle, color: '#F59E0B' },
    { id: 'privacy', title: 'Privacy & Security', icon: Shield, color: '#8B5CF6' },
    { id: 'share', title: 'Invite Friends', icon: Share2, color: '#EC4899' },
  ];

  const handleSaveProfile = () => {
    if (setUser) {
      setUser({ ...user, name, phone, email, preferredCategories, profileImage });
    }
    setActiveModal(null);
    Alert.alert('Success', 'Profile details updated successfully!');
  };


  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }
    setOldPassword('');
    setNewPassword('');
    setShowPasswordChange(false);
    Alert.alert('Success', 'Password changed successfully!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'WARNING: This will permanently delete your account and all booking history. This action cannot be undone. Do you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            setActiveModal(null);
            handleLogout();
            Alert.alert('Account Deleted', 'Your account has been successfully removed.');
          }
        }
      ]
    );
  };

  // Helper to render modal contents dynamically
  const renderModalContent = () => {
    switch (activeModal) {
      case 'edit':
        return (
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalDesc}>Update your account personal information below.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Enter phone number" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Enter email" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Service Categories</Text>
              <View style={styles.chipsContainer}>
                {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Gardening', 'AC Service'].map((cat) => {
                  const isSelected = preferredCategories.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => {
                        if (isSelected) {
                          setPreferredCategories(preferredCategories.filter(c => c !== cat));
                        } else {
                          setPreferredCategories([...preferredCategories, cat]);
                        }
                      }}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveProfile}>
              <Save size={20} color={colors.surface} />
              <Text style={styles.primaryBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        );

      case 'addresses':
        return (
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalDesc}>Manage your primary service locations.</Text>

            {addresses.map(addr => (
              <View key={addr.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressType}>{addr.type}</Text>
                  {addr.isDefault && <Text style={styles.addressDefault}>Default</Text>}
                </View>
                <Text style={styles.addressText}>{addr.text}</Text>
              </View>
            ))}

            {showAddAddressForm ? (
              <View style={styles.addAddressForm}>
                <Text style={styles.formTitle}>Add New Address</Text>

                <View style={styles.typeSelectorRow}>
                  {['Home', 'Work', 'Other'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeBtn, newAddressType === type && styles.typeBtnActive]}
                      onPress={() => setNewAddressType(type)}
                    >
                      <Text style={[styles.typeBtnText, newAddressType === type && styles.typeBtnTextActive]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top', paddingVertical: 12, marginBottom: 16 }]}
                  placeholder="Enter full address details..."
                  placeholderTextColor={colors.textLight}
                  value={newAddressText}
                  onChangeText={setNewAddressText}
                  multiline
                />

                <View style={styles.formActionsRow}>
                  <TouchableOpacity style={styles.cancelFormBtn} onPress={() => { setShowAddAddressForm(false); setNewAddressText(''); }}>
                    <Text style={styles.cancelFormBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveFormBtn} onPress={handleAddAddress}>
                    <Text style={styles.saveFormBtnText}>Add Address</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.outlineBtn} onPress={() => setShowAddAddressForm(true)}>
                <Plus size={20} color={colors.accent} />
                <Text style={styles.outlineBtnText}>Add New Address</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        );

      case 'payments':
        return (
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalDesc}>Select or configure your preferred payment methods.</Text>

            <Text style={styles.subSectionTitle}>UPI & Wallets</Text>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentName}>Google Pay / PhonePe UPI</Text>
              <Text style={styles.paymentDetails}>nandini@okaxis</Text>
            </View>

            <Text style={styles.subSectionTitle}>Cards</Text>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentName}>HDFC Bank Credit Card</Text>
              <Text style={styles.paymentDetails}>•••• •••• •••• 4892</Text>
            </View>

            <TouchableOpacity style={styles.outlineBtn} onPress={() => Alert.alert('Add Payment', 'Add payment service coming soon!')}>
              <Plus size={20} color={colors.accent} />
              <Text style={styles.outlineBtnText}>Add UPI / Card</Text>
            </TouchableOpacity>
          </ScrollView>
        );

      case 'support':
        return (
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalDesc}>How can we assist you today? Get in touch with our team.</Text>

            <View style={styles.supportCard}>
              <Text style={styles.supportTitle}>FAQs</Text>
              <Text style={styles.supportBody}>• How long does it take for a worker to arrive?</Text>
              <Text style={styles.supportSub}>Workers typically arrive within 30-45 minutes for emergency tasks.</Text>
              <Text style={styles.supportBody}>• What is the cancellation policy?</Text>
              <Text style={styles.supportSub}>Free cancellations up to 15 minutes before the job starts.</Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Support Call', 'Dialing support helpline: 1800-123-4567')}>
              <HelpCircle size={20} color={colors.surface} />
              <Text style={styles.primaryBtnText}>Call Customer Care</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.outlineBtn, { marginTop: 12 }]} onPress={() => Alert.alert('Support Chat', 'Opening support chat room...')}>
              <Text style={styles.outlineBtnText}>Chat With Us</Text>
            </TouchableOpacity>
          </ScrollView>
        );

      case 'privacy':
        return (
          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalDesc}>Configure your app security, account protection, and data access preferences.</Text>

            {/* Account Protection section */}
            <Text style={styles.subSectionTitle}>Account Security</Text>

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Two-Factor Authentication (2FA)</Text>
                <Text style={styles.toggleSub}>Requires verification code on login</Text>
              </View>
              <Switch value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} trackColor={{ false: colors.border, true: colors.success }} thumbColor={colors.surface} />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Biometric Authentication</Text>
                <Text style={styles.toggleSub}>Use Fingerprint / Face ID to unlock app</Text>
              </View>
              <Switch value={biometricsEnabled} onValueChange={setBiometricsEnabled} trackColor={{ false: colors.border, true: colors.success }} thumbColor={colors.surface} />
            </View>

            {/* Password Change Sub-section */}
            <View style={styles.passwordAccordion}>
              <TouchableOpacity style={styles.accordionHeader} onPress={() => setShowPasswordChange(!showPasswordChange)}>
                <View style={styles.accordionHeaderLeft}>
                  <Key size={18} color={colors.primary} />
                  <Text style={styles.accordionTitle}>Change Account Password</Text>
                </View>
                <ChevronRight size={18} color={colors.textLight} style={{ transform: [{ rotate: showPasswordChange ? '90deg' : '0deg' }] }} />
              </TouchableOpacity>

              {showPasswordChange && (
                <View style={styles.accordionBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput style={styles.input} secureTextEntry value={oldPassword} onChangeText={setOldPassword} placeholder="••••••••" />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="Minimum 6 characters" />
                  </View>
                  <TouchableOpacity style={styles.submitPasswordBtn} onPress={handleChangePassword}>
                    <Text style={styles.submitPasswordText}>Update Password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Data & Permissions Section */}
            <Text style={[styles.subSectionTitle, { marginTop: 24 }]}>Data & Permissions</Text>

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Location Services</Text>
                <Text style={styles.toggleSub}>Allow workers to trace your service site</Text>
              </View>
              <Switch value={locationEnabled} onValueChange={setLocationEnabled} trackColor={{ false: colors.border, true: colors.success }} thumbColor={colors.surface} />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Personalized Ads</Text>
                <Text style={styles.toggleSub}>Allow sharing data for custom discounts</Text>
              </View>
              <Switch value={personalizedAds} onValueChange={setPersonalizedAds} trackColor={{ false: colors.border, true: colors.success }} thumbColor={colors.surface} />
            </View>

            <TouchableOpacity style={styles.outlineBtn} onPress={() => Alert.alert('Cache Cleared', 'App cache and temp storage (18.4 MB) cleared successfully.')}>
              <RefreshCw size={18} color={colors.accent} />
              <Text style={styles.outlineBtnText}>Clear Local Cache</Text>
            </TouchableOpacity>

            {/* Danger Zone Section */}
            <Text style={[styles.subSectionTitle, { marginTop: 28, color: colors.danger }]}>Danger Zone</Text>
            <View style={styles.dangerZoneCard}>
              <Text style={styles.dangerTitle}>Deactivate or Delete Account</Text>
              <Text style={styles.dangerSub}>Permanently delete all your bookings, active jobs, and personal files from MajdoorHub.</Text>
              <TouchableOpacity style={styles.deleteBtnDanger} onPress={handleDeleteAccount}>
                <Trash2 size={16} color={colors.danger} />
                <Text style={styles.deleteTextDanger}>Delete Account Permanently</Text>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={[styles.primaryBtn, { marginTop: 24 }]} onPress={() => { setActiveModal(null); Alert.alert('Saved', 'All security configurations saved.'); }}>
              <Text style={styles.primaryBtnText}>Close Preferences</Text>
            </TouchableOpacity>
          </ScrollView>
        );

      case 'share':
        return (
          <View style={styles.modalScroll}>
            <Text style={styles.modalDesc}>Share the app with your family and friends. When they complete their first booking, both of you get ₹100 credit!</Text>

            <View style={styles.referralBox}>
              <Text style={styles.referralLabel}>Your Referral Code</Text>
              <Text style={styles.referralCode}>MAZDOOR100</Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Share App', 'Sharing link generated! Send it via WhatsApp/SMS.')}>
              <Share2 size={20} color={colors.surface} />
              <Text style={styles.primaryBtnText}>Share Link Now</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 80 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(name)}</Text>
              )}
              <Camera size={16} color={colors.accent} style={styles.cameraIcon} />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.phone}>{phone}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => setActiveModal('edit')}>
            <Edit3 size={16} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => {
              // Reset state triggers when opening modals
              if (item.id === 'privacy') setShowPasswordChange(false);
              setActiveModal(item.id);
            }}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconBg, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={18} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color={colors.danger} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version Info */}
        <Text style={styles.versionText}>Version 1.0.0 (Build 12)</Text>
      </ScrollView>

      {/* Dynamic Pop-up Modal Sheet */}
      <Modal
        visible={activeModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {menuItems.find(m => m.id === activeModal)?.title || 'Settings'}
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModal(null)}>
                <X size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            {renderModalContent()}
          </View>
        </View>
      </Modal>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  phone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  email: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  editBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    borderRadius: 8,
    backgroundColor: `${colors.accent}10`,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.danger,
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 12,
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    padding: 24,
  },
  modalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  // Form input styles
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
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
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 10,
    elevation: 2,
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  primaryBtnText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Address styles
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  addressDefault: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addressText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  outlineBtnText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Payment Styles
  subSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  paymentDetails: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  // Support Styles
  supportCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  supportBody: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  supportSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 8,
  },
  // Privacy Toggle Styles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  // Referral Styles
  referralBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 24,
  },
  referralLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  referralCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
  },
  copyIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: `${colors.primary}10`,
  },
  // Password Change Styles
  passwordAccordion: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  accordionBody: {
    padding: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#F9FAFB',
  },
  submitPasswordBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  submitPasswordText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Danger Zone styles
  dangerZoneCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    padding: 16,
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: 6,
  },
  dangerSub: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 14,
  },
  deleteBtnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  deleteTextDanger: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Dynamic add address styles
  addAddressForm: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  typeBtnActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  typeBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  formActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelFormBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelFormBtnText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  saveFormBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  saveFormBtnText: {
    fontSize: 14,
    color: colors.surface,
    fontWeight: 'bold',
  },
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
});
