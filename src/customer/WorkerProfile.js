import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, Star, Phone, MessageCircle, ShieldCheck, Clock, ThumbsUp } from 'lucide-react-native';
import colors from '../utils/colors';
import { MOCK_WORKERS } from '../utils/mockData';
import useStore from '../store/useStore';

export default function WorkerProfile({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const workerId = route.params?.id || 1;
  const worker = MOCK_WORKERS.find(w => w.id === workerId) || MOCK_WORKERS[0];
  const { reviews } = useStore();

  const workerReviews = (reviews || []).filter(r => r.workerId === workerId);

  return (
    <View style={styles.container}>
      {/* Header Image Area */}
      <View style={styles.headerImagePlaceholder}>
        <SafeAreaView edges={['top']} style={styles.topNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Heart size={20} color={colors.surface} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Main Content Card */}
        <View style={styles.mainCard}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.name}>{worker.name}</Text>
              <Text style={styles.skill}>{worker.skill}</Text>
              <View style={styles.ratingRow}>
                <Star size={16} color={colors.warning} fill={colors.warning} />
                <Text style={styles.ratingText}>{worker.rating}</Text>
                <Text style={styles.reviewsText}>({worker.reviews} reviews)</Text>
              </View>
            </View>
            {worker.verified && (
              <View style={styles.verifiedBox}>
                <ShieldCheck size={28} color={colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtnPrimary}>
              <Phone size={18} color={colors.surface} />
              <Text style={styles.actionBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnSecondary}>
              <MessageCircle size={18} color={colors.surface} />
              <Text style={styles.actionBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{worker.completedJobs}</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.success }]}>{worker.reliabilityScore}%</Text>
              <Text style={styles.statLabel}>Reliability</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{worker.distance}</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{worker.about}</Text>
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingRow}>
              <View style={[styles.pricingCard, { borderColor: colors.accent, borderWidth: 2 }]}>
                <Clock size={24} color={colors.accent} style={styles.pricingIcon} />
                <Text style={styles.pricingLabel}>Hourly</Text>
                <Text style={styles.pricingVal}>{worker.price}</Text>
              </View>
              <View style={styles.pricingCard}>
                <ThumbsUp size={24} color={colors.primary} style={styles.pricingIcon} />
                <Text style={styles.pricingLabel}>Daily Rate</Text>
                <Text style={styles.pricingVal}>{worker.dailyRate}</Text>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews ({workerReviews.length})</Text>
            {workerReviews.length === 0 ? (
              <Text style={styles.noReviewsText}>No reviews yet. Be the first to leave one!</Text>
            ) : (
              <View style={styles.reviewsList}>
                {workerReviews.map((rev) => (
                  <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAuthorBg}>
                        <Text style={styles.reviewAuthorInitial}>{rev.customerName.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewAuthorName}>{rev.customerName}</Text>
                        <Text style={styles.reviewDate}>{rev.date}</Text>
                      </View>
                      <View style={styles.reviewStarsRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            color={s <= rev.rating ? colors.warning : colors.border}
                            fill={s <= rev.rating ? colors.warning : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewBody}>{rev.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Hire Button fixed at bottom */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }]}>
        <TouchableOpacity 
          style={styles.hireBtn}
          onPress={() => navigation.navigate('Booking', { id: worker.id })}
        >
          <Text style={styles.hireBtnText}>Hire {worker.name.split(' ')[0]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerImagePlaceholder: {
    height: 280,
    backgroundColor: colors.border,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  navBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: -32,
  },
  mainCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 100, // space for bottom bar
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  skill: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  reviewsText: {
    color: colors.textLight,
    fontSize: 14,
  },
  verifiedBox: {
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 16,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pricingIcon: {
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  pricingVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  hireBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  hireBtnText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  noReviewsText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  reviewsList: {
    gap: 12,
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewAuthorBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(13, 59, 102, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAuthorInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  reviewAuthorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 1,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    paddingLeft: 4,
  },
});
