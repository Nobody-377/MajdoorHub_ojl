import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Clock, Check, X, Phone, CheckCircle2 } from 'lucide-react-native';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function JobRequests({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, jobs, updateJobStatus, declineJob } = useStore();
  const workerSkills = user?.skills && user.skills.length > 0 ? user.skills : [user?.skill || 'Plumber'];
  const [activeTab, setActiveTab] = useState('New'); // 'New' | 'Accepted' | 'Completed'

  const handleAccept = (id) => {
    updateJobStatus(id, 'accepted');
    Alert.alert('Job Accepted!', 'The request has been moved to your Accepted jobs tab.');
  };

  const handleDecline = (id) => {
    Alert.alert(
      'Decline Job',
      'Are you sure you want to decline this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          style: 'destructive',
          onPress: () => {
            declineJob(id);
          }
        }
      ]
    );
  };

  const handleComplete = (id) => {
    updateJobStatus(id, 'completed');
    Alert.alert('Congratulations!', 'Job marked as completed. Earnings added to your wallet.');
  };

  const handleCall = (name) => {
    Alert.alert('Calling Customer', `Connecting you to ${name}...`);
  };

  // Helper to filter jobs by worker skill
  const getFilteredJobsBySkill = () => {
    return jobs.filter(job => {
      if (!job.category) return true;
      const catNorm = job.category.trim().toLowerCase();
      return workerSkills.some(skill => {
        const skillNorm = skill.trim().toLowerCase();
        return catNorm.includes(skillNorm) || skillNorm.includes(catNorm) ||
               (skillNorm === 'plumber' && catNorm === 'plumbing') ||
               (skillNorm === 'electrician' && catNorm === 'electrical') ||
               (skillNorm === 'carpenter' && catNorm === 'carpentry') ||
               (skillNorm === 'painter' && catNorm === 'painting') ||
               (skillNorm === 'cleaner' && catNorm === 'cleaning') ||
               (skillNorm === 'gardener' && catNorm === 'gardening') ||
               (skillNorm === 'other' && catNorm === 'other');
      });
    });
  };

  // Filter jobs based on active tab
  const getFilteredJobs = () => {
    const skillFiltered = getFilteredJobsBySkill();
    if (activeTab === 'New') {
      return skillFiltered.filter(job => job.status === 'pending');
    }
    if (activeTab === 'Accepted') {
      return skillFiltered.filter(job => job.status === 'accepted');
    }
    if (activeTab === 'Completed') {
      return skillFiltered.filter(job => job.status === 'completed');
    }
    return [];
  };

  const filteredJobs = getFilteredJobs();

  // Tab counts
  const skillFiltered = getFilteredJobsBySkill();
  const newCount = skillFiltered.filter(job => job.status === 'pending').length;
  const acceptedCount = skillFiltered.filter(job => job.status === 'accepted').length;
  const completedCount = skillFiltered.filter(job => job.status === 'completed').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Management</Text>
      </View>

      {/* Interactive Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {[
            { key: 'New', label: `New (${newCount})` },
            { key: 'Accepted', label: `Accepted (${acceptedCount})` },
            { key: 'Completed', label: `Completed (${completedCount})` }
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Jobs List */}
      <ScrollView 
        contentContainerStyle={[styles.listContainer, { paddingBottom: 80 + insets.bottom }]} 
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No requests in this tab.</Text>
          </View>
        ) : (
          filteredJobs.map(job => (
            <View key={job.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.cardTitle}>{job.title}</Text>
                  <Text style={styles.cardCustomer}>Customer: {job.customer}</Text>
                </View>
                <Text style={styles.cardPrice}>{job.price}</Text>
              </View>

              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Clock size={15} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{job.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={15} color={colors.textSecondary} />
                  <Text style={styles.detailText} numberOfLines={1}>{job.distance} away • {job.address}</Text>
                </View>
              </View>

              {/* Dynamic Actions per Tab */}
              {job.status === 'pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.btnDecline}
                    onPress={() => handleDecline(job.id)}
                  >
                    <X size={18} color={colors.danger} />
                    <Text style={styles.btnDeclineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.btnAccept}
                    onPress={() => handleAccept(job.id)}
                  >
                    <Check size={18} color={colors.surface} />
                    <Text style={styles.btnAcceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}

              {job.status === 'accepted' && (
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.btnCall}
                    onPress={() => handleCall(job.customer)}
                  >
                    <Phone size={18} color={colors.primary} />
                    <Text style={styles.btnCallText}>Call Customer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.btnComplete}
                    onPress={() => handleComplete(job.id)}
                  >
                    <CheckCircle2 size={18} color={colors.surface} />
                    <Text style={styles.btnCompleteText}>Complete Job</Text>
                  </TouchableOpacity>
                </View>
              )}

              {job.status === 'completed' && (
                <View style={styles.completedBadgeRow}>
                  <View style={styles.completedBadge}>
                    <CheckCircle2 size={14} color={colors.success} />
                    <Text style={styles.completedBadgeText}>Job Completed</Text>
                  </View>
                  <Text style={styles.settledText}>Payment Received</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    gap: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    backgroundColor: colors.surface, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  tabsContainer: { 
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    gap: 4
  },
  tab: { 
    flex: 1,
    paddingVertical: 10, 
    borderRadius: 8, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { 
    backgroundColor: colors.surface, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  tabText: { 
    color: colors.textSecondary, 
    fontWeight: '500', 
    fontSize: 13 
  },
  tabTextActive: { 
    color: colors.primary, 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  listContainer: { 
    padding: 20, 
    gap: 16 
  },
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 80 
  },
  emptyText: { 
    color: colors.textSecondary, 
    fontSize: 15,
    fontWeight: '500'
  },
  card: { 
    backgroundColor: colors.surface, 
    borderRadius: 20, 
    padding: 16, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  cardCustomer: { 
    fontSize: 13, 
    color: colors.textSecondary, 
    marginTop: 2 
  },
  cardPrice: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.primary 
  },
  details: { 
    gap: 6, 
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12
  },
  detailRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  detailText: { 
    fontSize: 13, 
    color: colors.textSecondary,
    flex: 1
  },
  actions: { 
    flexDirection: 'row', 
    gap: 12 
  },
  btnDecline: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.surface, 
    paddingVertical: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.danger, 
    gap: 6 
  },
  btnDeclineText: { 
    color: colors.danger, 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  btnAccept: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.success, 
    paddingVertical: 12, 
    borderRadius: 12, 
    gap: 6 
  },
  btnAcceptText: { 
    color: colors.surface, 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  btnCall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6
  },
  btnCallText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14
  },
  btnComplete: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6
  },
  btnCompleteText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14
  },
  completedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  completedBadgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold'
  },
  settledText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500'
  }
});
