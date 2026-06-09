import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ArrowLeft, Star, MapPin, X } from 'lucide-react-native';
import colors from '../utils/colors';
import { MOCK_WORKERS } from '../utils/mockData';

export default function SearchScreen({ route, navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(MOCK_WORKERS);

  useEffect(() => {
    const cat = route.params?.category || '';
    setQuery(cat);
    if (cat) {
      const filtered = MOCK_WORKERS.filter(
        (w) =>
          w.name.toLowerCase().includes(cat.toLowerCase()) ||
          w.skill.toLowerCase().includes(cat.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(MOCK_WORKERS);
    }
  }, [route.params?.category]);

  const handleSearch = (text) => {
    setQuery(text);
    if (!text.trim()) {
      setResults(MOCK_WORKERS);
      return;
    }
    const filtered = MOCK_WORKERS.filter(
      (w) =>
        w.name.toLowerCase().includes(text.toLowerCase()) ||
        w.skill.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  const clearSearch = () => {
    setQuery('');
    setResults(MOCK_WORKERS);
    navigation.setParams({ category: undefined });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchBarContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            placeholder="Search for plumbers, electricians..."
            placeholderTextColor={colors.textLight}
            style={styles.input}
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No service providers found</Text>
            <Text style={styles.emptySubtext}>Try searching for 'Plumber', 'Electrician', 'Painter'...</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.workerCard}
            onPress={() => navigation.navigate('WorkerProfile', { id: item.id })}
          >
            <View style={styles.avatarPlaceholder} />
            <View style={styles.workerInfo}>
              <View style={styles.workerHeader}>
                <Text style={styles.workerName}>{item.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              </View>
              <Text style={styles.workerSkill}>{item.skill} • {item.experience}</Text>

              <View style={styles.workerStatsRow}>
                <View style={styles.stat}>
                  <Star size={14} color={colors.warning} fill={colors.warning} />
                  <Text style={styles.statText}>{item.rating}</Text>
                </View>
                <View style={styles.stat}>
                  <MapPin size={14} color={colors.textLight} />
                  <Text style={styles.statText}>{item.distance}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
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
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  workerInfo: {
    flex: 1,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  priceContainer: {
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
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
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
