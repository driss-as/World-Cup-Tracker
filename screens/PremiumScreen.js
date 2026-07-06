import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/AuthContext';
import {
  getPremiumCustomerInfo,
  hasRevenueCatKey,
  purchasePremiumPlan,
} from '../lib/revenueCat';

const C = {
  bg: '#0F143C',
  card: '#162052',
  cardDark: '#0D1835',
  primary: '#2ECC71',
  accent: '#2D9CDB',
  text: '#FFFFFF',
  textMuted: '#8A9CC2',
  border: '#1E2D6B',
};

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$4.99',
    period: 'per month',
    icon: 'calendar-outline',
    cta: 'Choose monthly',
    features: ['Premium match insights', 'Personalized alerts', 'Member-only analysis'],
  },
  {
    id: 'yearly',
    name: 'Annual',
    price: '$39.99',
    period: 'per year',
    icon: 'trophy-outline',
    cta: 'Choose annual',
    badge: 'Best value',
    features: ['Everything in monthly', 'Save over 30%', 'Priority access to new features'],
  },
];

export default function PremiumScreen({ navigation }) {
  const { session } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasingPlan, setPurchasingPlan] = useState(null);
  const [message, setMessage] = useState('');

  const appUserID = session?.user?.id;
  const revenueCatReady = hasRevenueCatKey();

  const refreshPremiumStatus = useCallback(async () => {
    setLoading(true);
    setMessage('');

    try {
      const info = await getPremiumCustomerInfo(appUserID);
      setIsPremium(info.isPremium);
      if (!info.isConfigured) {
        setMessage('RevenueCat will be enabled once the API key is added.');
      }
    } catch (error) {
      setMessage(error?.message ?? 'Unable to check premium status.');
    } finally {
      setLoading(false);
    }
  }, [appUserID]);

  useEffect(() => {
    refreshPremiumStatus();
  }, [refreshPremiumStatus]);

  const handlePurchase = async (planId) => {
    setPurchasingPlan(planId);
    setMessage('');

    try {
      const result = await purchasePremiumPlan(planId, appUserID);

      if (result.ok) {
        setIsPremium(result.isPremium);
        setMessage(result.isPremium ? 'Premium is now active.' : 'Purchase completed.');
      } else if (result.reason === 'missing_api_key') {
        setMessage('RevenueCat API key is missing. Add it to enable purchases.');
      } else if (result.reason === 'package_not_found') {
        setMessage('No matching RevenueCat package was found for this plan.');
      } else {
        setMessage('Purchase could not be completed.');
      }
    } catch (error) {
      if (error?.userCancelled) {
        setMessage('Purchase cancelled.');
      } else {
        setMessage(error?.message ?? 'Purchase failed.');
      }
    } finally {
      setPurchasingPlan(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="diamond" size={30} color={C.bg} />
          </View>
          <Text style={styles.title}>Become a Premium member</Text>
          <Text style={styles.subtitle}>
            Get a richer football experience with smarter match context, member insights, and advanced tracking.
          </Text>
          {loading ? (
            <View style={styles.statusPill}>
              <ActivityIndicator size="small" color={C.primary} />
              <Text style={styles.statusText}>Checking membership</Text>
            </View>
          ) : isPremium ? (
            <View style={[styles.statusPill, styles.statusPillActive]}>
              <Ionicons name="checkmark-circle" size={17} color={C.bg} />
              <Text style={[styles.statusText, styles.statusTextActive]}>Premium active</Text>
            </View>
          ) : null}
        </View>

        {!!message && (
          <View style={[styles.notice, revenueCatReady && styles.noticeReady]}>
            <Ionicons
              name={revenueCatReady ? 'information-circle-outline' : 'key-outline'}
              size={18}
              color={revenueCatReady ? C.accent : C.primary}
            />
            <Text style={styles.noticeText}>{message}</Text>
          </View>
        )}

        <View style={styles.plans}>
          {PLANS.map((plan) => {
            const highlighted = plan.id === 'yearly';

            return (
              <View key={plan.id} style={[styles.planCard, highlighted && styles.planCardFeatured]}>
                <View style={styles.planTop}>
                  <View style={[styles.planIcon, highlighted && styles.planIconFeatured]}>
                    <Ionicons name={plan.icon} size={22} color={highlighted ? C.bg : C.primary} />
                  </View>
                  <View style={styles.planNameWrap}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {plan.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>{plan.price}</Text>
                  <Text style={styles.period}>{plan.period}</Text>
                </View>

                <View style={styles.features}>
                  {plan.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <Ionicons name="checkmark-circle" size={18} color={C.primary} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.planButton,
                    highlighted && styles.planButtonFeatured,
                    purchasingPlan && purchasingPlan !== plan.id && styles.planButtonDisabled,
                  ]}
                  activeOpacity={0.82}
                  disabled={Boolean(purchasingPlan)}
                  onPress={() => handlePurchase(plan.id)}
                >
                  {purchasingPlan === plan.id ? (
                    <ActivityIndicator size="small" color={highlighted ? C.bg : C.primary} />
                  ) : (
                    <Text style={[styles.planButtonText, highlighted && styles.planButtonTextFeatured]}>
                      {revenueCatReady ? plan.cta : 'Connect RevenueCat'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.bg,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.primary, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 30 },
  hero: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { color: C.text, fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: C.textMuted, fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 460 },
  statusPill: {
    marginTop: 16,
    minHeight: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusPillActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  statusText: { color: C.textMuted, fontSize: 12, fontWeight: '800' },
  statusTextActive: { color: C.bg },
  notice: {
    backgroundColor: C.cardDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  noticeReady: { borderColor: C.accent },
  noticeText: { color: C.textMuted, fontSize: 13, fontWeight: '600', lineHeight: 18, flex: 1 },
  plans: { gap: 14, marginTop: 8 },
  planCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  planCardFeatured: {
    borderColor: C.primary,
    backgroundColor: '#17305A',
  },
  planTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planIconFeatured: { backgroundColor: C.primary },
  planNameWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  planName: { color: C.text, fontSize: 18, fontWeight: '900' },
  badge: {
    backgroundColor: C.accent,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: C.text, fontSize: 11, fontWeight: '900' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 16 },
  price: { color: C.text, fontSize: 34, fontWeight: '900' },
  period: { color: C.textMuted, fontSize: 13, fontWeight: '700', paddingBottom: 6 },
  features: { gap: 10, marginTop: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { color: C.text, fontSize: 14, fontWeight: '600', flex: 1 },
  planButton: {
    marginTop: 18,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planButtonFeatured: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  planButtonDisabled: { opacity: 0.55 },
  planButtonText: { color: C.primary, fontSize: 15, fontWeight: '900' },
  planButtonTextFeatured: { color: C.bg },
});
