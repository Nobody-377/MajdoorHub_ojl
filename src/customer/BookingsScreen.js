import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, X, Phone, RefreshCw, Star, Trash2 } from 'lucide-react-native';
import colors from '../utils/colors';

const MOCK_BOOKINGS = [
  {
    id: 'MH-8429',
    workerName: 'Ramesh Kumar',
    skill: 'Expert Plumber',
    date: 'June 01, 2026',
    time: '10:00 AM - 12:00 PM',
    status: 'In Progress', // 'In Progress', 'Completed'
    address: 'B-402, Green Park Society, Link Road, Andheri West, Mumbai',
    cost: '₹400/hr',
    baseRate: 400,
    problem: 'Bathroom pipe is leaking and causing water logging.',
  },
  {
    id: 'MH-7104',
    workerName: 'Suresh Singh',
    skill: 'Master Electrician',
    date: 'May 28, 2026',
    time: '02:00 PM - 04:00 PM',
    status: 'Completed',
    address: 'A-102, Sunshine Apartments, Bandra West, Mumbai',
    cost: '₹450/hr',
    baseRate: 450,
    problem: 'Living room fan switch not working, needs replacement.',
  },
  {
    id: 'MH-5201',
    workerName: 'Amit Sharma',
    skill: 'Professional Painter',
    date: 'May 15, 2026',
    time: '09:00 AM - 05:00 PM',
    status: 'Completed',
    address: 'Plot 42, Juhu Beach Road, Juhu, Mumbai',
    cost: '₹350/hr',
    baseRate: 350,
    problem: 'Bedroom wall requires a touch-up coat of paint.',
  }
];

export default function BookingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Active' | 'Completed'
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return booking.status === 'In Progress' || booking.status === 'Pending';
    if (activeTab === 'Completed') return booking.status === 'Completed';
    return true;
  });

  const getStatusStyle = (status) => {
    if (status === 'In Progress') {
      return { bg: '#FEF3C7', text: '#D97706' }; // Orange-ish/Yellow
    } else if (status === 'Completed') {
      return { bg: '#D1FAE5', text: '#059669' }; // Green
    }
    return { bg: '#E5E7EB', text: '#4B5563' }; // Grey
  };

  const handleCancelBooking = (id) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            setSelectedBooking(null);
            Alert.alert('Cancelled', `Booking ${id} has been cancelled successfully.`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['All', 'Active', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 80 + insets.bottom }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookings found</Text>
            <Text style={styles.emptySubtext}>You don't have any bookings in this category.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.9}
              onPress={() => setSelectedBooking(item)}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bookingId}>Booking {item.id}</Text>
                  <Text style={styles.workerName}>{item.workerName}</Text>
                  <Text style={styles.workerSkill}>{item.skill}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusTextBadge, { color: statusStyle.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Details */}
              <View style={styles.divider} />
              
              <View style={styles.detailRow}>
                <Calendar size={16} color={colors.textLight} />
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color={colors.textLight} />
                <Text style={styles.detailText}>{item.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.textLight} />
                <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
              </View>

              {/* Card Footer */}
              <View style={styles.divider} />
              <View style={styles.cardFooter}>
                <Text style={styles.priceLabel}>Estimated Cost</Text>
                <Text style={styles.priceVal}>{item.cost}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Booking Details Modal */}
      <Modal
        visible={selectedBooking !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedBooking(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeaderHeader}>
              <Text style={styles.modalHeaderTitle}>Booking Details</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedBooking(null)}>
                <X size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            {selectedBooking && (
              <ScrollView contentContainerStyle={styles.modalScroll}>
                {/* Status Section */}
                <View style={styles.statusBox}>
                  <Text style={styles.modalBookingId}>Booking ID: {selectedBooking.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(selectedBooking.status).bg, alignSelf: 'flex-start', marginTop: 6 }]}>
                    <Text style={[styles.statusTextBadge, { color: getStatusStyle(selectedBooking.status).text }]}>
                      {selectedBooking.status}
                    </Text>
                  </View>
                </View>

                {/* Worker Info Card */}
                <View style={styles.workerSummary}>
                  <View style={styles.workerAvatar} />
                  <View style={styles.workerTextDetails}>
                    <Text style={styles.workerNameDetail}>{selectedBooking.workerName}</Text>
                    <Text style={styles.workerSkillDetail}>{selectedBooking.skill}</Text>
                    <Text style={styles.workerCostDetail}>{selectedBooking.cost}</Text>
                  </View>
                </View>

                {/* Job Details */}
                <Text style={styles.sectionHeading}>Job details</Text>
                
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>Problem Description</Text>
                  <Text style={styles.detailValue}>{selectedBooking.problem}</Text>

                  <View style={styles.innerDivider} />

                  <View style={styles.iconDetailRow}>
                    <Calendar size={18} color={colors.textLight} />
                    <View>
                      <Text style={styles.iconDetailLabel}>Date</Text>
                      <Text style={styles.iconDetailVal}>{selectedBooking.date}</Text>
                    </View>
                  </View>

                  <View style={styles.iconDetailRow}>
                    <Clock size={18} color={colors.textLight} />
                    <View>
                      <Text style={styles.iconDetailLabel}>Time Slot</Text>
                      <Text style={styles.iconDetailVal}>{selectedBooking.time}</Text>
                    </View>
                  </View>

                  <View style={styles.iconDetailRow}>
                    <MapPin size={18} color={colors.textLight} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.iconDetailLabel}>Service Address</Text>
                      <Text style={styles.iconDetailVal}>{selectedBooking.address}</Text>
                    </View>
                  </View>
                </View>

                {/* Bill Details */}
                <Text style={styles.sectionHeading}>Bill Summary</Text>
                <View style={styles.detailCard}>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Base Hourly Rate</Text>
                    <Text style={styles.billValue}>₹{selectedBooking.baseRate}</Text>
                  </View>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Platform Fee</Text>
                    <Text style={styles.billValue}>₹20</Text>
                  </View>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Taxes & GST (18%)</Text>
                    <Text style={styles.billValue}>₹{Math.round(selectedBooking.baseRate * 0.18)}</Text>
                  </View>
                  <View style={styles.billDivider} />
                  <View style={styles.billRow}>
                    <Text style={styles.billLabelBold}>Estimated Total</Text>
                    <Text style={styles.billValueBold}>₹{selectedBooking.baseRate + 20 + Math.round(selectedBooking.baseRate * 0.18)}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                  {selectedBooking.status === 'In Progress' ? (
                    <>
                      <TouchableOpacity 
                        style={styles.callButton}
                        onPress={() => Alert.alert('Calling Provider', `Connecting call to ${selectedBooking.workerName}...`)}
                      >
                        <Phone size={20} color={colors.surface} />
                        <Text style={styles.callButtonText}>Call Provider</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => handleCancelBooking(selectedBooking.id)}
                      >
                        <Trash2 size={18} color={colors.danger} />
                        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.callButton}
                        onPress={() => Alert.alert('Book Again', 'Initiating service booking form...')}
                      >
                        <RefreshCw size={20} color={colors.surface} />
                        <Text style={styles.callButtonText}>Book Again</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.reviewButton}
                        onPress={() => Alert.alert('Leave Review', 'Feedback forms coming soon!')}
                      >
                        <Star size={18} color={colors.accent} fill={colors.accent} />
                        <Text style={styles.reviewButtonText}>Write a Review</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </ScrollView>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.accent,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingId: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  workerSkill: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextBadge: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: colors.textLight,
  },
  priceVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
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
    paddingHorizontal: 32,
  },
  // Modal details
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeaderHeader: {
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
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    padding: 24,
    paddingBottom: 40,
  },
  statusBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  modalBookingId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  workerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
    marginBottom: 20,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
  },
  workerTextDetails: {
    flex: 1,
  },
  workerNameDetail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  workerSkillDetail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workerCostDetail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  innerDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  iconDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconDetailLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  iconDetailVal: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  // Bill Summary styles
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  billDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  billLabelBold: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  billValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Action styles
  actionsContainer: {
    gap: 12,
    marginTop: 10,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  callButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  cancelButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  reviewButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
