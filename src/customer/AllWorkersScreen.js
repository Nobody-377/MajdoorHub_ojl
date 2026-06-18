import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, ShieldCheck, ArrowUpDown } from 'lucide-react-native';
import colors from '../utils/colors';
import { MOCK_WORKERS } from '../utils/mockData';

const FILTER_CHIPS = [
  'All', 
  'Plumber', 
  'Electrician', 
  'Painter', 
  'Carpenter', 
  'Cleaner', 
  'Pest Control', 
  'Appliance Repair', 
  'Gardener', 
  'AC Service', 
  'Home Salon', 
  'Packers & Movers', 
  'Other Services'
];
const SORT_MODES = [
  { id: 'rating', label: 'Highest Rated' },
  { id: 'distance', label: 'Closest' },
  { id: 'price_low', label: 'Price: Low to High' },
];

export default function AllWorkersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortMode, setSortMode] = useState('rating'); // 'rating' | 'distance' | 'price_low'

  const filteredAndSortedWorkers = useMemo(() => {
    // 1. Filter
    let result = [...MOCK_WORKERS];
    if (selectedFilter !== 'All') {
      result = result.filter(w => {
        const workerSkillLower = w.skill.toLowerCase();
        const filterLower = selectedFilter.toLowerCase();
        return workerSkillLower.includes(filterLower) || filterLower.includes(workerSkillLower);
      });
    }

    // 2. Sort
    result.sort((a, b) => {
      if (sortMode === 'rating') {
        return b.rating - a.rating;
      }
      if (sortMode === 'distance') {
        const distA = parseFloat(a.distance.split(' ')[0]);
        const distB = parseFloat(b.distance.split(' ')[0]);
        return distA - distB;
      }
      if (sortMode === 'price_low') {
        return a.baseRate - b.baseRate;
      }
      return 0;
    });

    return result;
  }, [selectedFilter, sortMode]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Nearby Providers</Text>
          <Text style={styles.headerSubtitle}>{filteredAndSortedWorkers.length} workers available</Text>
        </View>
      </View>

      {/* Category Chips Selector */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_CHIPS.map(chip => {
            const isSelected = selectedFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedFilter(chip)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort Section */}
      <View style={styles.sortSection}>
        <ArrowUpDown size={16} color={colors.textSecondary} />
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
          {SORT_MODES.map(mode => {
            const isSelected = sortMode === mode.id;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[styles.sortTab, isSelected && styles.sortTabActive]}
                onPress={() => setSortMode(mode.id)}
              >
                <Text style={[styles.sortTabText, isSelected && styles.sortTabTextActive]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Workers List */}
      <FlatList
        data={filteredAndSortedWorkers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 20 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No service providers online</Text>
            <Text style={styles.emptySubtext}>Try switching filters or check back later.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.workerCard}
            onPress={() => navigation.navigate('WorkerProfile', { id: item.id })}
          >
            {/* Avatar block with colored initial */}
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
              <Text style={styles.avatarInitial}>{item.name.charAt(0)}</Text>
            </View>

            <View style={styles.workerInfo}>
              <View style={styles.workerHeader}>
                <View style={styles.nameRow}>
                  <Text style={styles.workerName}>{item.name}</Text>
                  {item.verified && (
                    <ShieldCheck size={16} color={colors.success} style={styles.verifiedIcon} />
                  )}
                </View>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>

              <Text style={styles.workerSkill}>{item.skill} • {item.experience}</Text>

              {/* Extra content: Jobs completed + rating */}
              <Text style={styles.jobsDoneText}>{item.completedJobs} jobs completed • {item.reliabilityScore}% reliability</Text>

              <View style={styles.workerStatsRow}>
                <View style={styles.stat}>
                  <Star size={14} color={colors.warning} fill={colors.warning} />
                  <Text style={styles.statText}>{item.rating} ({item.reviews} reviews)</Text>
                </View>
                <View style={styles.stat}>
                  <MapPin size={14} color={colors.textLight} />
                  <Text style={styles.statText}>{item.distance} away</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* Bottom Safe Area White Strip */}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: colors.border }} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  filterSection: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginLeft: 6,
    marginRight: 10,
  },
  sortScroll: {
    gap: 8,
  },
  sortTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortTabActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  sortTabText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortTabTextActive: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  workerInfo: {
    flex: 1,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  verifiedIcon: {
    marginTop: 2,
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  workerSkill: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 1,
  },
  jobsDoneText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
  workerStatsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
