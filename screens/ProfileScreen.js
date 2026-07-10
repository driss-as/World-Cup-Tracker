import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#190A12',
  card: '#26101A',
  primary: '#E53935',
  text: '#FFFFFF',
  textMuted: '#B48A96',
  border: '#5A1E2A',
  danger: '#E74C3C',
  accent: '#FFB020',
};

export default function ProfileScreen({ navigation }) {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!session?.user?.id) return;

    const userId = session.user.id;
    const emailName = session.user.email?.split('@')[0] ?? 'Fan';

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!existingProfile) {
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          display_name: session.user.user_metadata?.display_name ?? emailName,
          username: session.user.user_metadata?.username ?? null,
        });
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*, favorite_team:teams(name, flag)')
      .eq('id', userId)
      .maybeSingle();

    setProfile(profileData);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchProfileData();

    const channel = supabase
      .channel('profile_screen')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchProfileData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchProfileData]);

  const handlePress = async (item) => {
    if (item.label === 'Sign Out') { await signOut(); return; }
    if (item.onPress) item.onPress();
  };

  const settings = [
    {
      section: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', chevron: true },
        { icon: 'shield-outline', label: 'Privacy', chevron: true },
        { icon: 'log-out-outline', label: 'Sign Out', danger: true },
      ],
    },
  ];

  const displayName = profile?.display_name ?? session?.user?.email?.split('@')[0] ?? 'Fan';
  const username = profile?.username ? '@' + profile.username : session?.user?.email ?? '@fan';
  const avatarLetter = displayName.slice(0, 1).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WORLD CUP 2022</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={C.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + name */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={C.bg} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userHandle}>{username}{profile?.fan_since ? ` • Fan since ${profile.fan_since}` : ''}</Text>
        </View>

        <TouchableOpacity
          style={styles.premiumCard}
          activeOpacity={0.82}
          onPress={() => navigation.navigate('Premium')}
        >
          <View style={styles.premiumIcon}>
            <Ionicons name="diamond" size={22} color={C.bg} />
          </View>
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Become Premium</Text>
            <Text style={styles.premiumText}>Unlock advanced World Cup insights and member features.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.text} />
        </TouchableOpacity>

        {/* Settings sections */}
        {settings.map((section) => (
          <View key={section.section} style={styles.card}>
            <Text style={styles.sectionLabel}>{section.section.toUpperCase()}</Text>
            {section.items.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.settingRow, i < section.items.length - 1 && styles.settingBorder]}
                activeOpacity={0.7}
                onPress={() => handlePress(item)}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, item.danger && { backgroundColor: C.danger + '22' }]}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={item.danger ? C.danger : C.primary}
                    />
                  </View>
                  <Text style={[styles.settingLabel, item.danger && { color: C.danger }]}>
                    {item.label}
                  </Text>
                </View>
                <View style={styles.settingRight}>
                  {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                  {item.chevron && (
                    <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <Text style={styles.version}>World Cup Tracker v1.0.0</Text>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.primary, letterSpacing: 1 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  profileCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primary + '33',
    borderWidth: 3,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 34, fontWeight: '900', color: C.primary },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.card,
  },
  userName: { color: C.text, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  userHandle: { color: C.textMuted, fontSize: 13, fontWeight: '500', marginBottom: 20 },

  premiumCard: {
    backgroundColor: C.accent,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumContent: { flex: 1 },
  premiumTitle: { color: C.text, fontSize: 16, fontWeight: '900', marginBottom: 4 },
  premiumText: { color: C.text, fontSize: 13, fontWeight: '600', lineHeight: 18, opacity: 0.88 },

  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionLabel: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingBorder: { borderBottomWidth: 1, borderColor: C.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { color: C.text, fontSize: 14, fontWeight: '600' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { color: C.textMuted, fontSize: 13 },

  version: {
    color: C.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 28,
  },
});
