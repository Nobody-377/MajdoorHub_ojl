import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Bell, Calendar, Percent, ShieldAlert, CloudRain, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';

// Enable layout animation for smooth expand/collapse on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Booking Confirmed!',
    shortDesc: 'Your plumbing booking with Ramesh Kumar is confirmed.',
    fullDesc: 'Your professional plumbing service booking (ID: MH-8429) with Ramesh Kumar has been officially confirmed by the worker. He is scheduled to arrive at Andheri West, Mumbai, on June 01, 2026, at 10:00 AM. Please ensure someone is available at the address. Base rate is ₹400/hr. Contact him via the booking screen if you need to coordinate.',
    date: 'Just now',
    type: 'booking',
    read: false,
  },
  {
    id: 'n2',
    title: 'Job Marked as Completed!',
    shortDesc: 'Ramesh Kumar has marked your pipe leakage task as completed.',
    fullDesc: 'The bathroom pipe leakage job has been completed by Ramesh Kumar. Total duration: 2 hours. Please inspect the work, clear the payment of ₹964 (including GST and platform fees), and take a moment to write a review of your experience on his profile to help others in the community.',
    date: '2 hours ago',
    type: 'completed',
    read: false,
  },
  {
    id: 'n3',
    title: 'Huge Discount: 20% Off!',
    shortDesc: 'Exclusive discount code for your next home service booking.',
    fullDesc: 'Welcome to MajdoorHub! We are excited to offer you a special 20% discount on your next electrician, plumber, or painter booking. Use code MAZDOOR20 during checkout. This offer is valid till June 15, 2026, for a maximum discount of ₹150. Claim it today and hire high-quality verified labor!',
    date: '1 day ago',
    type: 'offer',
    read: true,
  },
  {
    id: 'n4',
    title: 'Security Update: 2FA is Live!',
    shortDesc: 'Protect your account by enabling Two-Factor Authentication.',
    fullDesc: 'Your account security is our top priority. We have launched Two-Factor Authentication (2FA) support. You can now enable 2FA directly from your Profile > Privacy & Security menu to require an OTP code every time you log in to your account. We highly recommend turning this on immediately.',
    date: '3 days ago',
    type: 'security',
    read: true,
  },
  {
    id: 'n5',
    title: 'Rainy Season Alert',
    shortDesc: 'Expect minor delays due to heavy monsoon rains in Mumbai.',
    fullDesc: 'Due to heavy water logging and active monsoon rainfall across Mumbai, our service providers might face transport delays. We recommend booking urgent tasks 1-2 hours in advance. Thank you for your cooperation and understanding! Stay safe!',
    date: '4 days ago',
    type: 'weather',
    read: true,
  },
];

export default function NotificationsScreen({ navigation }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const getIcon = (type) => {
    const iconColor = colors.primary;
    switch (type) {
      case 'booking':
        return <Calendar size={20} color={iconColor} />;
      case 'completed':
        return <CheckCircle size={20} color={iconColor} />;
      case 'offer':
        return <Percent size={20} color={iconColor} />;
      case 'security':
        return <ShieldAlert size={20} color={iconColor} />;
      case 'weather':
        return <CloudRain size={20} color={iconColor} />;
      default:
        return <Bell size={20} color={iconColor} />;
    }
  };

  const getIconBg = () => {
    return 'rgba(13, 59, 102, 0.08)'; // Light translucent brand primary (navy)
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          return (
            <View style={[styles.card, !item.read && styles.unreadCard]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBg, { backgroundColor: getIconBg(item.type) }]}>
                  {getIcon(item.type)}
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>

              {/* Short Description */}
              <Text style={styles.shortDesc}>{item.shortDesc}</Text>

              {/* Expanded Description */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />
                  <Text style={styles.fullDesc}>{item.fullDesc}</Text>
                </View>
              )}

              {/* See More Button */}
              <TouchableOpacity
                style={styles.seeMoreBtn}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.seeMoreText}>
                  {isExpanded ? 'See Less' : 'See More'}
                </Text>
                {isExpanded ? (
                  <ChevronUp size={16} color={colors.accent} />
                ) : (
                  <ChevronDown size={16} color={colors.accent} />
                )}
              </TouchableOpacity>
            </View>
          );
        }}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  backBtnText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  unreadCard: {
    backgroundColor: 'rgba(249, 115, 22, 0.02)',
    borderColor: 'rgba(249, 115, 22, 0.3)', // Subtle orange border to emphasize unread status
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  date: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  shortDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  expandedContent: {
    paddingLeft: 4,
  },
  fullDesc: {
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 20,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    marginTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.accent,
  },
});
