import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, Platform } from 'react-native';
import useStore from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MapPin, Bell, Star, Wrench, Zap, PaintRoller, Hammer } from 'lucide-react-native';
import colors from '../utils/colors';

const CATEGORIES = [
  { id: 'plumber', name: 'Plumber', icon: Wrench, color: '#3B82F6' },
  { id: 'electrician', name: 'Electrician', icon: Zap, color: '#F59E0B' },
  { id: 'painter', name: 'Painter', icon: PaintRoller, color: '#10B981' },
  { id: 'carpenter', name: 'Carpenter', icon: Hammer, color: '#8B5CF6' },
];

const NEARBY_WORKERS = [
  { id: 1, name: 'Ramesh Kumar', skill: 'Expert Plumber', rating: 4.8, distance: '1.2 km', price: '₹400/hr', verified: true },
  { id: 2, name: 'Suresh Singh', skill: 'Master Electrician', rating: 4.9, distance: '2.5 km', price: '₹450/hr', verified: true },
];

export default function CustomerHome({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useStore();
  const [currentLocation, setCurrentLocation] = useState(user?.location || 'Andheri West, Mumbai');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [tempLocation, setTempLocation] = useState(currentLocation);

  useEffect(() => {
    if (user?.location) {
      setCurrentLocation(user.location);
    }
  }, [user?.location]);

  const handleSaveLocation = (newLoc) => {
    setCurrentLocation(newLoc);
    if (user && setUser) {
      setUser({ ...user, location: newLoc });
    }
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
        bounces={false}
      >
        {/* Header Area */}
        <View style={styles.headerBg}>
          <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => { setTempLocation(currentLocation); setLocationModalVisible(true); }}>
            <Text style={styles.locationLabel}>Current Location</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.accent} />
              <Text style={styles.locationText}>{currentLocation}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bellContainer}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={24} color={colors.surface} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.searchBar}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Search')}
        >
          <Search size={20} color={colors.textLight} />
          <Text style={styles.searchText}>Search for plumbers, electricians...</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllCategories')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => navigation.navigate('Search', { category: cat.name })}>
              <View style={[styles.categoryIconBg, { backgroundColor: `${cat.color}15` }]}>
                <cat.icon size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Special Offer Banner */}
      <View style={[styles.section, { paddingTop: 0 }]}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Get 20% Off</Text>
          <Text style={styles.bannerSub}>On your first booking today!</Text>
          <TouchableOpacity 
            style={styles.bannerBtn}
            onPress={() => navigation.navigate('AllCategories')}
          >
            <Text style={styles.bannerBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Rated Workers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Top Rated</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllWorkers')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.workersList}>
          {NEARBY_WORKERS.map(worker => (
            <TouchableOpacity 
              key={worker.id} 
              style={styles.workerCard}
              onPress={() => navigation.navigate('WorkerProfile', { id: worker.id })}
            >
              <View style={styles.avatarPlaceholder} />
              <View style={styles.workerInfo}>
                <View style={styles.workerHeader}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  {worker.verified && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.workerSkill}>{worker.skill}</Text>
                
                <View style={styles.workerStatsRow}>
                  <View style={styles.stat}>
                    <Star size={14} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.statText}>{worker.rating}</Text>
                  </View>
                  <View style={styles.stat}>
                    <MapPin size={14} color={colors.textLight} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>{worker.distance}</Text>
                  </View>
                </View>
                <Text style={styles.price}>{worker.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>

    {/* Location Modal */}
    <Modal
      visible={locationModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setLocationModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Location</Text>
            <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Enter City / Neighborhood</Text>
            <TextInput
              style={styles.locationInput}
              value={tempLocation}
              onChangeText={setTempLocation}
              placeholder="e.g. Bandra West, Mumbai"
              placeholderTextColor={colors.textLight}
            />
            <Text style={styles.suggestionsTitle}>Popular Suggestions</Text>
            <View style={styles.suggestionsGrid}>
              {['Andheri West, Mumbai', 'Bandra West, Mumbai', 'Juhu, Mumbai', 'Colaba, Mumbai'].map(loc => (
                <TouchableOpacity 
                  key={loc} 
                  style={styles.suggestionBtn} 
                  onPress={() => { handleSaveLocation(loc); setLocationModalVisible(false); }}
                >
                  <Text style={styles.suggestionBtnText}>{loc.split(',')[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.saveLocationBtn}
              onPress={() => {
                if (tempLocation.trim()) {
                  handleSaveLocation(tempLocation.trim());
                  setLocationModalVisible(false);
                }
              }}
            >
              <Text style={styles.saveLocationBtnText}>Save Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBg: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  locationLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: colors.danger,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 16,
    gap: 12,
  },
  searchText: {
    color: colors.textLight,
    fontSize: 15,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  banner: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: 20,
  },
  bannerTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  bannerBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  workersList: {
    gap: 16,
  },
  workerCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  workerInfo: {
    flex: 1,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#1E40AF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  workerSkill: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  workerStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Location selection modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeText: {
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  locationInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: colors.text,
    marginBottom: 20,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  suggestionBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  suggestionBtnText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  saveLocationBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveLocationBtnText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
