import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, CheckCircle } from 'lucide-react-native';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function ActiveJob({ route, navigation }) {
  const { updateJobStatus } = useStore();
  const { job: routeJob } = route.params || {};
  
  // Fallback to a default job if none is passed
  const fallbackJob = { 
    id: 6, 
    title: 'Toilet flush valve repair', 
    customer: 'Rahul Sharma', 
    address: 'Flat 10, Ashoka Apartments, Nepean Sea Road', 
    price: '₹400' 
  };
  const job = routeJob || fallbackJob;

  const [timer, setTimer] = useState(4500); // 1h 15m in seconds
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (!completed) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [completed]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndWork = () => {
    if (updateJobStatus) {
      updateJobStatus(job.id, 'completed');
    }
    setCompleted(true);
  };

  if (completed) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <View style={styles.successIcon}>
          <CheckCircle size={48} color={colors.surface} />
        </View>
        <Text style={styles.successTitle}>Job Completed!</Text>
        <Text style={styles.successSubtitle}>Waiting for customer confirmation.</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryRowBorder}>
            <Text style={styles.summaryLabel}>Total Time</Text>
            <Text style={styles.summaryValBold}>{formatTime(timer)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Earned</Text>
            <Text style={[styles.summaryVal, { color: colors.primary, fontSize: 18 }]}>{job.price}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.primaryBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Job</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Current Session Time</Text>
          <Text style={styles.timerValue}>{formatTime(timer)}</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCustomer}>Customer: {job.customer}</Text>
          <View style={styles.divider} />
          <Text style={styles.addressTitle}>Address</Text>
          <Text style={styles.address}>{job.address}</Text>
        </View>

        <View style={styles.proofSection}>
          <Text style={styles.proofTitle}>Location / Photo Proof (Optional)</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Camera color={colors.textLight} size={24} style={{ marginBottom: 8 }} />
            <Text style={styles.uploadText}>Capture Photo of Completed Work</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.endJobBtn} onPress={handleEndWork}>
          <Text style={styles.endJobBtnText}>End Work Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 16 },
  backBtn: { width: 40, height: 40, backgroundColor: colors.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  content: { flex: 1, padding: 20 },
  timerCard: { backgroundColor: colors.primary, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 },
  timerLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
  timerValue: { color: colors.surface, fontSize: 40, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  detailsCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  jobTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  jobCustomer: { fontSize: 14, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  addressTitle: { fontSize: 12, fontWeight: '600', color: colors.textLight, marginBottom: 4 },
  address: { fontSize: 14, color: colors.text },
  proofSection: { marginBottom: 20 },
  proofTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  uploadBox: { height: 120, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.border, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  uploadText: { color: colors.textLight, fontSize: 14 },
  endJobBtn: { backgroundColor: colors.danger, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  endJobBtnText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: colors.success, shadowOpacity: 0.4, shadowRadius: 24, elevation: 10 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  successSubtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  summaryCard: { backgroundColor: colors.surface, width: '100%', padding: 20, borderRadius: 16, marginBottom: 32, borderWidth: 1, borderColor: colors.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  summaryRowBorder: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, borderStyle: 'dashed' },
  summaryLabel: { color: colors.textSecondary, fontSize: 14 },
  summaryVal: { color: colors.text, fontWeight: '600', fontSize: 14 },
  summaryValBold: { color: colors.text, fontWeight: 'bold', fontSize: 14 },
  primaryBtn: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: 16, alignItems: 'center', width: '100%' },
  primaryBtnText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' },
});
