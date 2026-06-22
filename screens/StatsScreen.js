import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
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
};

const goalScorers = [
  { rank: 2, flag: '🇳🇴', name: 'E. Haaland',    country: 'Norway',    pos: 'FW', ast: 1,  gls: 5 },
  { rank: 3, flag: '🇦🇷', name: 'L. Martinez',   country: 'Argentina', pos: 'FW', ast: 0,  gls: 5 },
  { rank: 4, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'H. Kane',      country: 'England',   pos: 'FW', ast: 3,  gls: 4 },
  { rank: 5, flag: '🇧🇷', name: 'Vinícius Jr.',  country: 'Brazil',    pos: 'FW', ast: 4,  gls: 4 },
];

const topAssisters = [
  { flag: '🇩🇪', name: 'J. Musiala',   value: 5 },
  { flag: '🇧🇪', name: 'K. De Bruyne', value: 4 },
];

const mostSaved = [
  { flag: '🇦🇷', name: 'E. Martinez',  value: 22 },
  { flag: '🇭🇷', name: 'D. Livakovic', value: 19 },
];

const TABS = ['Goals', 'Assists', 'Clean Sheets'];

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState('Goals');

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
        {/* Featured Player */}
        <View style={styles.featuredCard}>
          <View style={styles.goldenBadge}>
            <Text style={styles.goldenBadgeText}>GOLDEN BOOT LEADER</Text>
          </View>

          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 44 }}>🇫🇷</Text>
          </View>

          <Text style={styles.playerName}>KYLIAN MBAPPÉ</Text>
          <Text style={styles.playerSub}>FRANCE • FORWARD</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>GOALS</Text>
              <Text style={styles.statValue}>6</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>ASSISTS</Text>
              <Text style={[styles.statValue, { color: C.primary }]}>2</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>MP</Text>
              <Text style={styles.statValue}>5</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard header */}
        <View style={styles.lbHeader}>
          <Text style={[styles.lbCol, styles.lbColRank]}>#</Text>
          <Text style={[styles.lbCol, styles.lbColPlayer]}>PLAYER</Text>
          <Text style={styles.lbCol}>AST</Text>
          <Text style={styles.lbCol}>GLS</Text>
        </View>

        {goalScorers.map((p, i) => (
          <View key={i} style={styles.lbRow}>
            <Text style={[styles.lbCol, styles.lbColRank, styles.rankText]}>{p.rank}</Text>
            <View style={[styles.lbCol, styles.lbColPlayer, { flexDirection: 'row', alignItems: 'center' }]}>
              <View style={styles.lbAvatar}>
                <Text style={{ fontSize: 18 }}>{p.flag}</Text>
              </View>
              <View>
                <Text style={styles.lbName}>{p.name}</Text>
                <Text style={styles.lbSub}>{p.country} • {p.pos}</Text>
              </View>
            </View>
            <Text style={[styles.lbCol, styles.lbStat]}>{p.ast}</Text>
            <Text style={[styles.lbCol, styles.lbGls]}>{p.gls}</Text>
          </View>
        ))}

        {/* Top Assisters */}
        <View style={styles.miniCard}>
          <View style={styles.miniCardHeader}>
            <Text style={styles.cardTitle}>Top Assisters</Text>
            <Ionicons name="trending-up" size={18} color={C.primary} />
          </View>
          {topAssisters.map((p, i) => (
            <View key={i} style={styles.miniRow}>
              <View style={styles.miniLeft}>
                <View style={styles.miniAvatar}>
                  <Text style={{ fontSize: 18 }}>{p.flag}</Text>
                </View>
                <Text style={styles.miniName}>{p.name}</Text>
              </View>
              <Text style={styles.miniValue}>{p.value}</Text>
            </View>
          ))}
        </View>

        {/* Most Saved */}
        <View style={[styles.miniCard, { marginBottom: 24 }]}>
          <View style={styles.miniCardHeader}>
            <Text style={styles.cardTitle}>Most Saved</Text>
            <Ionicons name="hand-left-outline" size={18} color={C.primary} />
          </View>
          {mostSaved.map((p, i) => (
            <View key={i} style={styles.miniRow}>
              <View style={styles.miniLeft}>
                <View style={styles.miniAvatar}>
                  <Text style={{ fontSize: 18 }}>{p.flag}</Text>
                </View>
                <Text style={styles.miniName}>{p.name}</Text>
              </View>
              <Text style={styles.miniValue}>{p.value}</Text>
            </View>
          ))}
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
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.primary, letterSpacing: 1 },
  scroll: { flex: 1, paddingHorizontal: 16 },

  featuredCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },
  goldenBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: C.tertiary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  goldenBadgeText: { color: C.bg, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: C.primary,
    marginTop: 12,
    marginBottom: 14,
  },
  playerName: { color: C.primary, fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  playerSub: { color: C.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginTop: 4, marginBottom: 18 },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    gap: 0,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statLabel: { color: C.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  statValue: { color: C.text, fontSize: 22, fontWeight: '900' },
  statDivider: { width: 1, height: 36, backgroundColor: C.border },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 10,
    padding: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: C.textMuted, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: C.bg, fontWeight: '700' },

  lbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  lbCol: { color: C.textMuted, fontSize: 11, fontWeight: '700', flex: 1, textAlign: 'center' },
  lbColRank: { flex: 0.5 },
  lbColPlayer: { flex: 3, textAlign: 'left' },

  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  rankText: { color: C.text, fontSize: 14, fontWeight: '700' },
  lbAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  lbName: { color: C.text, fontSize: 13, fontWeight: '700' },
  lbSub: { color: C.textMuted, fontSize: 11, marginTop: 1 },
  lbStat: { color: C.text, fontSize: 14, fontWeight: '600' },
  lbGls: { color: C.primary, fontSize: 16, fontWeight: '900' },

  miniCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  miniCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: '700' },
  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: C.border,
  },
  miniLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  miniName: { color: C.text, fontSize: 14, fontWeight: '600' },
  miniValue: { color: C.primary, fontSize: 16, fontWeight: '900' },
});
