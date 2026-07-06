import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const REVENUECAT_API_KEY =
  (Platform.OS === 'ios' && process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY) ||
  (Platform.OS === 'android' && process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY) ||
  (Platform.OS === 'web' && process.env.EXPO_PUBLIC_REVENUECAT_WEB_API_KEY) ||
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ||
  '';

const PREMIUM_ENTITLEMENT_ID =
  process.env.EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID || 'premium';

let configured = false;

function getCurrentOffering(offerings) {
  return offerings?.current ?? Object.values(offerings?.all ?? {})[0] ?? null;
}

function matchesPlan(packageItem, planId) {
  const value = [
    packageItem?.identifier,
    packageItem?.packageType,
    packageItem?.product?.identifier,
    packageItem?.product?.title,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (planId === 'yearly') return value.includes('annual') || value.includes('yearly');
  return value.includes('monthly');
}

export function hasRevenueCatKey() {
  return Boolean(REVENUECAT_API_KEY);
}

export async function configureRevenueCat(appUserID) {
  if (!REVENUECAT_API_KEY) {
    return { configured: false, reason: 'missing_api_key' };
  }

  if (configured) return { configured: true };

  Purchases.setLogLevel(LOG_LEVEL.WARN);
  Purchases.configure({
    apiKey: REVENUECAT_API_KEY,
    appUserID: appUserID || null,
  });

  configured = true;
  return { configured: true };
}

export async function getPremiumCustomerInfo(appUserID) {
  const setup = await configureRevenueCat(appUserID);
  if (!setup.configured) return { isConfigured: false, isPremium: false };

  const customerInfo = await Purchases.getCustomerInfo();
  return {
    isConfigured: true,
    isPremium: Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]),
    customerInfo,
  };
}

export async function getPremiumOfferings(appUserID) {
  const setup = await configureRevenueCat(appUserID);
  if (!setup.configured) return { isConfigured: false, packages: [] };

  const offerings = await Purchases.getOfferings();
  const currentOffering = getCurrentOffering(offerings);

  return {
    isConfigured: true,
    offering: currentOffering,
    packages: currentOffering?.availablePackages ?? [],
  };
}

export async function purchasePremiumPlan(planId, appUserID) {
  const { isConfigured, packages } = await getPremiumOfferings(appUserID);
  if (!isConfigured) return { ok: false, reason: 'missing_api_key' };

  const selectedPackage = packages.find((packageItem) => matchesPlan(packageItem, planId));
  if (!selectedPackage) return { ok: false, reason: 'package_not_found' };

  const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
  return {
    ok: true,
    isPremium: Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]),
    customerInfo,
  };
}
