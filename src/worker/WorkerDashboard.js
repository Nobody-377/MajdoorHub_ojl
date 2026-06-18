import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Wallet, Star, ShieldCheck, Clock, MapPin, CheckCircle } from 'lucide-react-native';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function WorkerDashboard({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const { user, jobs } = useStore();
  const workerSkills = user?.skills && user.skills.length > 0 ? user.skills : [user?.skill || 'Plumber'];
  const getFilteredJobsBySkill = () => {
    return (jobs || []).filter(job => {
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

  const skillFiltered = getFilteredJobsBySkill();
  const activeJobs = skillFiltered.filter(job => job.status === 'accepted');
  const pendingRequests = skillFiltered.filter(job => job.status === 'pending');
  const visibleRequests = pendingRequests.slice(0, 3); // Show top 3 on dashboard

  const getInitials = (name) => {
    if (!name) return 'W';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.headerBg}>
          <View style={styles.headerTop}>
            <View style={styles.userInfoRow}>
              <View style={styles.avatar}>
                {user?.profileImage ? (
                  <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{getInitials(user?.name || 'Ramesh Kumar')}</Text>
                )}
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.nameText}>{user?.name || 'Ramesh Kumar'}</Text>
              </View>
            </View>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Bell size={24} color={colors.surface} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
 
          {/* Status Toggle */}
          <View style={styles.statusToggleRow}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.textLight }]} />
              <Text style={styles.statusText}>{isOnline ? 'Online - Accepting Jobs' : 'Offline'}</Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: colors.textSecondary, true: colors.success }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Wallet size={18} color={colors.textSecondary} />
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
          <Text style={styles.statValuePrimary}>₹1,250</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Star size={18} color={colors.warning} />
            <Text style={styles.statLabel}>Overall Rating</Text>
          </View>
          <Text style={styles.statValuePrimary}>4.8 <Text style={styles.statSub}>(124)</Text></Text>
        </View>
      </View>

      {/* Trust Badge */}
      <View style={styles.section}>
        <View style={styles.trustBadge}>
          <ShieldCheck size={32} color={colors.success} />
          <View>
            <Text style={styles.trustTitle}>Reliability Score: 98%</Text>
            <Text style={styles.trustSubtitle}>You're in the top 5% of workers!</Text>
          </View>
        </View>
      </View>

      {/* Active Jobs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Jobs ({activeJobs.length})</Text>
        {activeJobs.length === 0 ? (
          <View style={[styles.activeJobCard, { borderLeftColor: colors.textLight, paddingVertical: 24, alignItems: 'center' }]}>
            <Text style={{ color: colors.textSecondary, fontWeight: '600', marginBottom: 12 }}>No active jobs at the moment.</Text>
            <TouchableOpacity 
              style={[styles.completeBtn, { backgroundColor: colors.accent, width: '80%', paddingVertical: 12, height: 48, justifyContent: 'center' }]}
              onPress={() => navigation.navigate('Jobs')}
            >
              <Text style={styles.completeBtnText}>View Available Jobs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          activeJobs.map(job => (
            <View key={job.id} style={[styles.activeJobCard, { marginBottom: 12 }]}>
              <View style={styles.activeJobHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobCustomer}>Customer: {job.customer} • {job.price}</Text>
                </View>
                <View style={styles.badgeWarning}>
                  <Text style={styles.badgeWarningText}>In Progress</Text>
                </View>
              </View>
              <View style={styles.jobDetails}>
                <View style={styles.jobDetailRow}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={styles.jobDetailText}>{job.time}</Text>
                </View>
                <View style={styles.jobDetailRow}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.jobDetailText} numberOfLines={1}>{job.address}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.completeBtn}
                onPress={() => navigation.navigate('ActiveJob', { job })}
              >
                <CheckCircle size={18} color={colors.surface} />
                <Text style={styles.completeBtnText}>Start Work Session</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* New Requests Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Requests ({pendingRequests.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.requestsContainer}>
          {visibleRequests.length === 0 ? (
            <View style={[styles.requestItem, { justifyContent: 'center', paddingVertical: 20 }]}>
              <Text style={{ color: colors.textSecondary, fontWeight: '500' }}>No pending requests for your selected skills.</Text>
            </View>
          ) : (
            visibleRequests.map(req => (
              <TouchableOpacity key={req.id} style={styles.requestItem} onPress={() => navigation.navigate('Jobs')}>
                <View style={styles.requestIconBg}>
                  <Bell size={20} color={colors.surface} />
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTitle}>{req.title}</Text>
                  <Text style={styles.requestMeta}>{req.distance} away • {req.time}</Text>
                </View>
                <Text style={styles.requestPrice}>{req.price}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1, backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 50, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  avatarText: { color: colors.primary, fontWeight: 'bold', fontSize: 16 },
  welcomeText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  nameText: { color: colors.surface, fontWeight: 'bold', fontSize: 18 },
  notificationDot: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, backgroundColor: colors.danger, borderRadius: 5, borderWidth: 2, borderColor: colors.primary },
  statusToggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { color: colors.surface, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 16, marginTop: -30, zIndex: 10 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  statLabel: { color: colors.textSecondary, fontSize: 12 },
  statValuePrimary: { fontSize: 22, fontWeight: 'bold', color: colors.primary },
  statSub: { fontSize: 14, fontWeight: 'normal', color: colors.textSecondary },
  section: { padding: 20, paddingTop: 10 },
  trustBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, padding: 16, borderRadius: 16, gap: 12 },
  trustTitle: { color: colors.surface, fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  trustSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  seeAll: { color: colors.accent, fontWeight: 'bold', fontSize: 14 },
  activeJobCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: colors.accent, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  activeJobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  jobCustomer: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  badgeWarning: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeWarningText: { color: '#92400E', fontSize: 10, fontWeight: 'bold' },
  jobDetails: { gap: 8, marginBottom: 16 },
  jobDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  jobDetailText: { fontSize: 13, color: colors.textSecondary },
  completeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.success, paddingVertical: 14, borderRadius: 12, gap: 8 },
  completeBtnText: { color: colors.surface, fontWeight: 'bold', fontSize: 14 },
  requestItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  requestIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  requestInfo: { flex: 1 },
  requestTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  requestMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  requestPrice: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  requestsContainer: { gap: 12 },
});
