import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, ArrowUpRight, TrendingUp, Calendar, CheckCircle2, ChevronRight, X, Building, CreditCard } from 'lucide-react-native';
import colors from '../utils/colors';
import useStore from '../store/useStore';

export default function WorkerEarnings() {
  const { user } = useStore();
  const [balance, setBalance] = useState(3450);
  const [isWithdrawVisible, setIsWithdrawVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi' | 'bank'

  const [transactions, setTransactions] = useState([
    { id: '1', title: 'Water Tank Installation', customer: 'Anita Sharma', date: 'Today, 2:00 PM', amount: 600, status: 'Credited' },
    { id: '2', title: 'Kitchen Sink Repair', customer: 'Rohan Verma', date: 'Yesterday, 11:30 AM', amount: 300, status: 'Credited' },
    { id: '3', title: 'Full Home Plumbing Check', customer: 'Suresh Mehta', date: '15 Jun, 4:00 PM', amount: 1200, status: 'Credited' },
    { id: '4', title: 'Bathroom Pipe Leakage', customer: 'Amit Patel', date: '12 Jun, 10:30 AM', amount: 1350, status: 'Credited' },
  ]);

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }
    if (amt > balance) {
      Alert.alert('Insufficient Balance', 'You cannot withdraw more than your available wallet balance.');
      return;
    }

    if (selectedMethod === 'upi' && !upiId.trim()) {
      Alert.alert('Required Info', 'Please enter a valid UPI ID.');
      return;
    }
    if (selectedMethod === 'bank' && (!bankAccount.trim() || !ifscCode.trim())) {
      Alert.alert('Required Info', 'Please enter both your bank account number and IFSC code.');
      return;
    }

    // Success Simulation
    setBalance(balance - amt);
    
    // Add to transactions list
    const newTx = {
      id: Date.now().toString(),
      title: `Withdrawal to ${selectedMethod === 'upi' ? 'UPI' : 'Bank'}`,
      customer: selectedMethod === 'upi' ? upiId : 'A/C Ending in ' + bankAccount.slice(-4),
      date: 'Just now',
      amount: -amt,
      status: 'Withdrawn'
    };
    setTransactions([newTx, ...transactions]);

    setWithdrawAmount('');
    setIsWithdrawVisible(false);
    Alert.alert('Success', `Withdrawal of ₹${amt} initiated successfully! It will reflect in your account in 2-4 hours.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings & Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Wallet Overview Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletHeaderLeft}>
              <Wallet size={20} color={colors.surface} />
              <Text style={styles.walletLabel}>Available Balance</Text>
            </View>
            <Text style={styles.walletBadge}>Secure</Text>
          </View>
          <Text style={styles.balanceText}>₹{balance.toLocaleString('en-IN')}</Text>
          
          <TouchableOpacity 
            style={styles.withdrawBtn} 
            activeOpacity={0.8}
            onPress={() => setIsWithdrawVisible(true)}
          >
            <Text style={styles.withdrawBtnText}>Withdraw to Bank</Text>
            <ArrowUpRight size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <Text style={styles.sectionTitle}>Performance Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <TrendingUp size={20} color={colors.primary} />
            <Text style={styles.statVal}>₹18,450</Text>
            <Text style={styles.statLabelText}>This Month</Text>
          </View>
          <View style={styles.statBox}>
            <CheckCircle2 size={20} color={colors.success} />
            <Text style={styles.statVal}>24</Text>
            <Text style={styles.statLabelText}>Jobs Done</Text>
          </View>
          <View style={styles.statBox}>
            <Calendar size={20} color={colors.warning} />
            <Text style={styles.statVal}>68h</Text>
            <Text style={styles.statLabelText}>Hrs Worked</Text>
          </View>
        </View>

        {/* Transaction Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <Text style={styles.seeAll}>Recent</Text>
        </View>

        <View style={styles.transactionsContainer}>
          {transactions.map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <View key={tx.id} style={styles.transactionCard}>
                <View style={[styles.txIconBg, { backgroundColor: isCredit ? `${colors.success}10` : `${colors.danger}10` }]}>
                  <Text style={[styles.txIconText, { color: isCredit ? colors.success : colors.danger }]}>
                    {isCredit ? '+' : '-'}
                  </Text>
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txMeta}>{tx.customer} • {tx.date}</Text>
                </View>
                <View style={styles.txAmountSection}>
                  <Text style={[styles.txAmount, { color: isCredit ? colors.success : colors.text }]}>
                    {isCredit ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.txStatus}>{tx.status}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Withdrawal Form Modal */}
      <Modal
        visible={isWithdrawVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsWithdrawVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Withdrawal</Text>
              <TouchableOpacity onPress={() => setIsWithdrawVisible(false)}>
                <X size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.modalSubtitle}>Withdraw funds instantly from your earnings wallet.</Text>

              {/* Amount input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount to Withdraw (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Max ₹${balance}`}
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                />
              </View>

              {/* Transfer Method Selector */}
              <Text style={styles.label}>Transfer Option</Text>
              <View style={styles.methodSelector}>
                <TouchableOpacity 
                  style={[styles.methodBtn, selectedMethod === 'upi' && styles.methodBtnActive]}
                  onPress={() => setSelectedMethod('upi')}
                >
                  <CreditCard size={18} color={selectedMethod === 'upi' ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.methodBtnText, selectedMethod === 'upi' && styles.methodBtnTextActive]}>UPI Transfer</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.methodBtn, selectedMethod === 'bank' && styles.methodBtnActive]}
                  onPress={() => setSelectedMethod('bank')}
                >
                  <Building size={18} color={selectedMethod === 'bank' ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.methodBtnText, selectedMethod === 'bank' && styles.methodBtnTextActive]}>Bank Transfer</Text>
                </TouchableOpacity>
              </View>

              {/* Conditional Inputs */}
              {selectedMethod === 'upi' ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>UPI ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. mobile@upi"
                    placeholderTextColor={colors.textLight}
                    autoCapitalize="none"
                    value={upiId}
                    onChangeText={setUpiId}
                  />
                </View>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Account Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 123456789012"
                      placeholderTextColor={colors.textLight}
                      keyboardType="numeric"
                      value={bankAccount}
                      onChangeText={setBankAccount}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>IFSC Code</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. HDFC0001234"
                      placeholderTextColor={colors.textLight}
                      autoCapitalize="characters"
                      value={ifscCode}
                      onChangeText={setIfscCode}
                    />
                  </View>
                </>
              )}

              <TouchableOpacity style={styles.primaryBtn} onPress={handleWithdraw}>
                <Text style={styles.primaryBtnText}>Confirm Withdrawal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.background,
  },
  walletCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  walletBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: colors.surface,
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  balanceText: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  withdrawBtn: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  withdrawBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
    marginBottom: 2,
  },
  statLabelText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  txIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  txMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  txAmountSection: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  txStatus: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: colors.text,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  methodBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodBtnText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  methodBtnTextActive: {
    color: colors.surface,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryBtnText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
