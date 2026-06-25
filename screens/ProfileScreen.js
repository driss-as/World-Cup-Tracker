import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#0F143C',
  card: '#162052',
  cardDark: '#0D1835',
  primary: '#2ECC71',
  tertiary: '#F1C40F',
  text: '#FFFFFF',
  textMuted: '#8A9CC2',
  border: '#1E2D6B',
  danger: '#E74C3C',
};

const stats = [
  { label: 'Matches\nWatched', value: '48' },
  { label: 'Favourite\nTeam',  value: '🇫🇷' },
  { label: 'Predictions\nCorrect', value: '73%' },
];

const favourites = [
  { flag: '🇫🇷', name: 'France',    group: 'Group A' },
  { flag: '🇧🇷', name: 'Brazil',    group: 'Group A' },
  { flag: '🇦🇷', name: 'Argentina', group: 'Group B' },
];

const SETTINGS = [
  {
    section: 'Notifications',
    items: [
      { icon: 'notifications-outline', label: 'Match Alerts',      toggle: true,  defaultOn: true  },
      { icon: 'megaphone-outline',     label: 'Goal Notifications', toggle: true,  defaultOn: true  },
      { icon: 'mail-outline',          label: 'Weekly Digest',      toggle: true,  defaultOn: false },
    ],
  },
  {
    section: 'Preferences',
    items: [
      { icon: 'flag-outline',       label: 'Default Team',   value: 'France',  chevron: true },
      { icon: 'language-outline',   label: 'Language',       value: 'English', chevron: true },
      { icon: 'trophy-outline',     label: 'My Predictions',                   chevron: true },
    ],
  },
  {
    section: 'Account',
    items: [
      { icon: 'person-outline',     label: 'Edit Profile',   chevron: true },
      { icon: 'shield-outline',     label: 'Privacy',        chevron: true },
      { icon: 'log-out-outline',    label: 'Sign Out',       danger: true, onPress: () => supabase.auth.signOut() },
    ],
  },
];

export default function ProfileScreen() {
  const [toggles, setToggles] = useState({ 'Match Alerts': true, 'Goal Notifications': true, 'Weekly Digest': false });

  const flipToggle = (label) =>
    setToggles((t) => ({ ...t, [label]: !t[label] }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WORLD CUP 2024</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={C.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + name */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>D</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={C.bg} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Driss</Text>
          <Text style={styles.userHandle}>@driss • Fan since 2018</Text>

          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statBlock}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Favourite Teams */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Favourite Teams</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={22} color={C.primary} />
            </TouchableOpacity>
          </View>
          {favourites.map((t, i) => (
            <View key={i} style={[styles.favRow, i < favourites.length - 1 && styles.favBorder]}>
              <View style={styles.favLeft}>
                <View style={styles.favFlag}>
                  <Text style={{ fontSize: 22 }}>{t.flag}</Text>
                </View>
                <View>
                  <Text style={styles.favName}>{t.name}</Text>
                  <Text style={styles.favSub}>{t.group}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="star" size={18} color={C.tertiary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Settings sections */}
        {SETTINGS.map((section) => (
          <View key={section.section} style={styles.card}>
            <Text style={styles.sectionLabel}>{section.section.toUpperCase()}</Text>
            {section.items.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.settingRow, i < section.items.length - 1 && styles.settingBorder]}
                activeOpacity={item.toggle ? 1 : 0.6}
                onPress={item.onPress}
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
                  {item.toggle && (
                    <Switch
                      value={toggles[item.label]}
                      onValueChange={() => flipToggle(item.label)}
                      trackColor={{ false: C.border, true: C.primary }}
                      thumbColor={C.text}
                    />
                  )}
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

  statsRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: C.border,
    paddingTop: 16,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statValue: { color: C.primary, fontSize: 20, fontWeight: '900', marginBottom: 4 },
  statLabel: { color: C.textMuted, fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 15 },

  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: '700' },

  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  favBorder: { borderBottomWidth: 1, borderColor: C.border },
  favLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  favFlag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  favName: { color: C.text, fontSize: 14, fontWeight: '700' },
  favSub: { color: C.textMuted, fontSize: 12, marginTop: 2 },

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
