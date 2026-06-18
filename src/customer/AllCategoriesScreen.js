import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, ChevronRight, X } from 'lucide-react-native';
import colors from '../utils/colors';
import { MOCK_CATEGORIES, MOCK_WORKERS } from '../utils/mockData';

export default function AllCategoriesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(MOCK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const SUB_SERVICES = {
    washers:["washing cars, wheels, "],
    laborer: ['Debris clearing & site cleanup', 'Heavy material lifting & shifting', 'Digging, trenching & excavation support', 'Loading & unloading supply trucks'],
    plumber: ['Leaking tap & pipe repairs', 'Water tank installation & cleaning', 'Bathroom drainage block removal', 'Sink, toilet, & basin fitting'],
    electrician: ['Short circuit diagnosis', 'Ceiling fan & light installations', 'Inverter setup & socket repair', 'Complete home rewiring'],
    painter: ['Interior home wall painting', 'Textured & decorative wall designs', 'Exterior wall coatings & putty', 'Waterproofing & crack filling'],
    carpenter: ['Furniture assembly & repair', 'Door lock & latch fittings', 'Cabinet & wardrobe repairs', 'Custom modular kitchen woodwork'],
    cleaning: ['Full home deep cleaning', 'Kitchen oil & grime cleaning', 'Sofa & mattress shampoo washing', 'Bathroom sanitization & wash'],
    pest_control: ['Anti-termite wood treatment', 'Cockroach & ant chemical geling', 'Bedbugs elimination treatment', 'Mosquito fogging & disinfection'],
    appliance: ['Smart TV wall mounting & repair', 'Front & top load washing machine fixes', 'Single/double door refrigerator gas refill', 'Microwave oven repairing'],
    gardening: ['Lawn mowing & hedge pruning', 'Soil replacement & fertilization', 'Potted plants & balcony setups', 'General weeds clearing'],
    ac_service: ['AC filter jet wet washing', 'Gas leakage repair & refilling', 'Split/Window AC installations', 'Condenser fan motor replacement'],
    salon: ['Standard haircut & hair styling', 'Face facial, bleach, & clean-up', 'Full body oil massage therapy', 'Waxing, pedicure & manicure'],
    movers: ['Bubble wrapping of fragile items', 'Truck loading & transportation', 'Furniture dismantling & unpacking', 'Intercity & local home shifting'],
    others: ['Helper for lifting & loading', 'Masonry & wall plaster touch-ups', 'Wall drilling & picture mounting', 'General labor support tasks'],
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredCategories(MOCK_CATEGORIES);
      return;
    }
    const filtered = MOCK_CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(text.toLowerCase()) || 
      cat.desc.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredCategories(MOCK_CATEGORIES);
  };

  const renderCategoryModalContent = () => {
    if (!selectedCategory) return null;

    const IconComponent = selectedCategory.icon;
    const categoryWorkers = MOCK_WORKERS.filter(w => {
      const workerSkillLower = w.skill.toLowerCase();
      const catNameLower = selectedCategory.name.toLowerCase();
      return workerSkillLower.includes(catNameLower) || catNameLower.includes(workerSkillLower);
    });
    const workersCount = categoryWorkers.length;
    const minPrice = workersCount > 0 
      ? Math.min(...categoryWorkers.map(w => w.baseRate)) 
      : 250;
    const servicesList = SUB_SERVICES[selectedCategory.id] || [];

    return (
      <>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderTitleRow}>
            <View style={[styles.modalIconBg, { backgroundColor: `${selectedCategory.color}15` }]}>
              {IconComponent && <IconComponent size={22} color={selectedCategory.color} />}
            </View>
            <Text style={styles.modalTitle}>{selectedCategory.name}</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Body */}
        <View style={styles.modalBody}>
          <Text style={styles.modalLabel}>Description</Text>
          <Text style={styles.modalDescText}>{selectedCategory.desc}</Text>

          <Text style={[styles.modalLabel, { marginTop: 16 }]}>What's Included</Text>
          <View style={styles.servicesGrid}>
            {servicesList.map((service, index) => (
              <View key={index} style={styles.serviceItemRow}>
                <View style={[styles.bulletPoint, { backgroundColor: selectedCategory.color }]} />
                <Text style={styles.serviceItemText}>{service}</Text>
              </View>
            ))}
          </View>

          <View style={styles.modalStatsRow}>
            <View style={styles.modalStatCard}>
              <Text style={styles.modalStatValue}>₹{minPrice}/hr</Text>
              <Text style={styles.modalStatLabel}>Starts-at Rate</Text>
            </View>
            <View style={styles.modalStatCard}>
              <Text style={styles.modalStatValue}>{workersCount}</Text>
              <Text style={styles.modalStatLabel}>Available Workers</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.searchBtn, { backgroundColor: selectedCategory.color }]}
            onPress={() => {
              const catName = selectedCategory.name;
              setSelectedCategory(null);
              navigation.navigate('Tabs', {
                screen: 'Search',
                params: { category: catName }
              });
            }}
          >
            <Text style={styles.searchBtnText}>Find {selectedCategory.name}s Nearby</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            placeholder="Search categories..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Grid List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 16 }]}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories match "{searchQuery}"</Text>
            <Text style={styles.emptySubtext}>Try searching for Plumber, Cleaner, or AC Service</Text>
          </View>
        }
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity 
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(item)}
            >
              <View style={[styles.iconBg, { backgroundColor: `${item.color}15` }]}>
                <IconComponent size={28} color={item.color} />
              </View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
              
              <View style={styles.arrowRow}>
                <Text style={[styles.arrowText, { color: item.color }]}>Explore</Text>
                <ChevronRight size={14} color={item.color} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
      
      {/* Category Details Sheet Modal */}
      <Modal
        visible={selectedCategory !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCategory(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {renderCategoryModalContent()}
          </View>
        </View>
      </Modal>

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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    maxWidth: '48%', // Ensure strict 2-column layout spacing
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 12,
    height: 30, // Keeps heights consistent
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 'auto', // push to bottom
  },
  arrowText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Modal layout details
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
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  modalDescText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  servicesGrid: {
    gap: 8,
    marginVertical: 10,
  },
  serviceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  serviceItemText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalStatsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 20,
  },
  modalStatCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  modalStatLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
    fontWeight: '600',
  },
  searchBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 10,
  },
  searchBtnText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
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
