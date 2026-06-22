import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
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

const standings = [
  { pos: 1, flag: '🇧🇷', name: 'Brazil',      pl: 3, w: 3, d: 0, status: 'Qualified',  statusColor: C.primary },
  { pos: 2, flag: '🇫🇷', name: 'France',      pl: 3, w: 2, d: 0, status: 'Qualified',  statusColor: C.primary },
  { pos: 3, flag: '🇰🇷', name: 'South Korea', pl: 3, w: 1, d: 0, status: 'Eliminated', statusColor: C.textMuted },
  { pos: 4, flag: '🇬🇭', name: 'Ghana',       pl: 3, w: 0, d: 0, status: 'Eliminated', statusColor: C.textMuted },
];

export default function TablesScreen() {
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
        {/* Group Card */}
        <View style={styles.groupCard}>
          <View style={styles.groupCardTop}>
            <View>
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>GROUP STAGE</Text>
              </View>
              <Text style={styles.groupTitle}>Group A{'\n'}Standings</Text>
            </View>
            <View style={styles.stadiumBadge}>
              <Ionicons name="calendar-outline" size={16} color={C.primary} />
              <Text style={styles.stadiumText}>Lusail{'\n'}Stadium</Text>
            </View>
          </View>

          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.col, styles.colPos]}>POS</Text>
            <Text style={[styles.col, styles.colTeam]}>TEAM</Text>
            <Text style={styles.col}>PL</Text>
            <Text style={styles.col}>W</Text>
            <Text style={styles.col}>D</Text>
          </View>

          {standings.map((team, i) => (
            <View
              key={i}
              style={[styles.tableRow, i === 0 && styles.tableRowHighlight]}
            >
              {i === 0 && <View style={styles.qualifiedBar} />}
              <Text style={[styles.col, styles.colPos, styles.posText]}>{team.pos}</Text>
              <View style={[styles.col, styles.colTeam, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={styles.flagSmall}>{team.flag}</Text>
                <View>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <View style={styles.statusRow}>
                    {team.status === 'Qualified' && (
                      <Ionicons name="checkmark-circle" size={11} color={C.primary} style={{ marginRight: 3 }} />
                    )}
                    <Text style={[styles.statusText, { color: team.statusColor }]}>{team.status}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.col, styles.statText]}>{team.pl}</Text>
              <Text style={[styles.col, styles.statText]}>{team.w}</Text>
              <Text style={[styles.col, styles.statText]}>{team.d}</Text>
            </View>
          ))}
        </View>

        {/* Top Scorer */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top Scorer</Text>
            <Ionicons name="bar-chart-outline" size={18} color={C.primary} />
          </View>
          <View style={styles.scorerRow}>
            <View style={styles.scorerAvatar}>
              <Text style={{ fontSize: 28 }}>🇧🇷</Text>
            </View>
            <View>
              <Text style={styles.scorerName}>Vinícius Jr.</Text>
              <Text style={styles.scorerSub}>Brazil • 4 Goals</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Match */}
        <View style={[styles.card, { marginBottom: 8 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upcoming Match</Text>
            <Ionicons name="calendar-outline" size={18} color={C.primary} />
          </View>
          <View style={styles.upcomingRow}>
            <View style={styles.upcomingTeam}>
              <Text style={styles.upcomingCode}>BRA</Text>
              <View style={styles.teamCircle}>
                <Text style={styles.teamCircleText}>B1</Text>
              </View>
            </View>
            <View style={styles.upcomingCenter}>
              <Text style={styles.vsText}>VS</Text>
              <Text style={styles.roundText}>ROUND OF 16</Text>
            </View>
            <View style={styles.upcomingTeam}>
              <Text style={styles.upcomingCode}>GER</Text>
              <View style={[styles.teamCircle, { borderColor: C.border }]}>
                <Text style={styles.teamCircleText}>A2</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.primary }]} />
            <Text style={styles.legendText}>ROUND OF 16 QUALIFICATION</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.tertiary }]} />
            <Text style={styles.legendText}>POSITIVE GOAL DIFF.</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="swap-horizontal" size={22} color={C.bg} />
      </TouchableOpacity>
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

  groupCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  groupCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stageBadge: {
    backgroundColor: C.primary + '33',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  stageBadgeText: { color: C.primary, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  groupTitle: { color: C.text, fontSize: 20, fontWeight: '800', lineHeight: 26 },
  stadiumBadge: {
    backgroundColor: C.cardDark,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    gap: 4,
  },
  stadiumText: { color: C.text, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: C.border,
    marginBottom: 4,
  },
  col: { color: C.textMuted, fontSize: 11, fontWeight: '700', flex: 1, textAlign: 'center' },
  colPos: { flex: 0.6 },
  colTeam: { flex: 3, textAlign: 'left' },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tableRowHighlight: { backgroundColor: C.cardDark, borderRadius: 8 },
  qualifiedBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    backgroundColor: C.primary,
    borderRadius: 2,
  },
  posText: { color: C.text, fontSize: 15, fontWeight: '800' },
  flagSmall: { fontSize: 22, marginRight: 10, marginLeft: 6 },
  teamName: { color: C.text, fontSize: 13, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  statusText: { fontSize: 11, fontWeight: '500' },
  statText: { color: C.text, fontSize: 14, fontWeight: '600' },

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
    marginBottom: 14,
  },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: '700' },

  scorerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  scorerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.border,
  },
  scorerName: { color: C.text, fontSize: 16, fontWeight: '700' },
  scorerSub: { color: C.textMuted, fontSize: 13, marginTop: 2 },

  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upcomingTeam: { alignItems: 'center', gap: 6 },
  upcomingCode: { color: C.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  teamCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamCircleText: { color: C.text, fontSize: 16, fontWeight: '800' },
  upcomingCenter: { alignItems: 'center', gap: 4 },
  vsText: { color: C.primary, fontSize: 22, fontWeight: '900' },
  roundText: { color: C.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  legend: { paddingHorizontal: 4, paddingBottom: 24, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: C.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
