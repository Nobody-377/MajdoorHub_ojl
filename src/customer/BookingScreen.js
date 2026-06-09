import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from 'lucide-react-native';
import colors from '../utils/colors';
import { MOCK_WORKERS } from '../utils/mockData';

export default function BookingScreen({ route, navigation }) {
  const [submitted, setSubmitted] = useState(false);
  const workerId = route.params?.id || 1;
  const worker = MOCK_WORKERS.find(w => w.id === workerId) || MOCK_WORKERS[0];

  if (submitted) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <View style={styles.successIcon}>
          <CheckCircle2 size={48} color={colors.surface} />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>Your request has been sent to the worker. They will contact you shortly.</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryRowBorder}>
            <Text style={styles.summaryLabel}>Booking ID</Text>
            <Text style={styles.summaryValBold}>#MH-8429</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Worker</Text>
            <Text style={styles.summaryVal}>{worker.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Cost</Text>
            <Text style={[styles.summaryVal, { color: colors.primary }]}>{worker.price}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.primaryBtnText}>Back to Home</Text>
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
        <Text style={styles.headerTitle}>Request Service</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.workerBrief}>
          <View style={styles.workerAvatar} />
          <View>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerSkill}>{worker.skill} • {worker.price}</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title / Problem</Text>
          <TextInput style={styles.input} placeholder="e.g., Leaking bathroom pipe" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.inputWithIcon}>
            <CalendarIcon color={colors.textLight} size={20} style={styles.iconPos} />
            <TextInput style={styles.inputPadded} placeholder="YYYY-MM-DD" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time Slot</Text>
          <View style={styles.inputWithIcon}>
            <Clock color={colors.textLight} size={20} style={styles.iconPos} />
            <TextInput style={styles.inputPadded} placeholder="10:00 AM - 12:00 PM" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWithIcon}>
            <MapPin color={colors.textLight} size={20} style={[styles.iconPos, { top: 16 }]} />
            <TextInput 
              style={[styles.inputPadded, { height: 100, textAlignVertical: 'top' }]} 
              placeholder="Enter your full address" 
              multiline
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Add Photos (Optional)</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Text style={styles.uploadText}>+ Upload Images of the problem</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => setSubmitted(true)}>
          <Text style={styles.primaryBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 16 },
  backBtn: { width: 40, height: 40, backgroundColor: colors.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  formContainer: { padding: 20, paddingBottom: 40 },
  workerBrief: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 16, marginBottom: 24, gap: 16, borderWidth: 1, borderColor: colors.border },
  workerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.border },
  workerName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  workerSkill: { fontSize: 14, color: colors.textSecondary },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15 },
  inputWithIcon: { position: 'relative' },
  iconPos: { position: 'absolute', left: 16, top: 15, zIndex: 1 },
  inputPadded: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingLeft: 44, paddingRight: 16, height: 50, fontSize: 15 },
  uploadBox: { height: 100, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.border, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  uploadText: { color: colors.textLight, fontSize: 14 },
  primaryBtn: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 16, width: '100%' },
  primaryBtnText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: colors.success, shadowOpacity: 0.4, shadowRadius: 24, elevation: 10 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  successSubtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  summaryCard: { backgroundColor: colors.surface, width: '100%', padding: 20, borderRadius: 16, marginBottom: 32, borderWidth: 1, borderColor: colors.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  summaryRowBorder: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, borderStyle: 'dashed' },
  summaryLabel: { color: colors.textSecondary, fontSize: 14 },
  summaryVal: { color: colors.text, fontWeight: '600', fontSize: 14 },
  summaryValBold: { color: colors.text, fontWeight: 'bold', fontSize: 14 },
});
