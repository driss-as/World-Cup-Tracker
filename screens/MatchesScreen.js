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

const FILTERS = ['Groups', 'Knockout', 'Final'];

const liveMatch = {
  home: { name: 'Germany', flag: '🇩🇪' },
  away: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  homeScore: 2,
  awayScore: 1,
  minute: "64' Minutes",
};

const upcomingMatches = [
  { home: { name: 'Spain', flag: '🇪🇸' }, away: { name: 'Croatia', flag: '🇭🇷' }, time: '15:00', venue: 'Berlin' },
  { home: { name: 'Italy', flag: '🇮🇹' }, away: { name: 'Albania', flag: '🇦🇱' }, time: '18:00', venue: 'Dortmund' },
];

const pastResults = [
  { home: { name: 'Brazil', flag: '🇧🇷' }, away: { name: 'Serbia', flag: '🇷🇸' }, homeScore: 3, awayScore: 0 },
];

export default function MatchesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WORLD CUP 2024</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={C.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTERS.map((f, i) => (
          <TouchableOpacity key={f} style={[styles.filterTab, i === 0 && styles.filterTabActive]}>
            <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Today */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today, June 14</Text>
            <View style={styles.liveCount}>
              <View style={styles.liveDot} />
              <Text style={styles.liveCountText}>2 MATCHES LIVE</Text>
            </View>
          </View>

          {/* Live Featured Card */}
          <View style={styles.featuredCard}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>

            <View style={styles.featuredMatchRow}>
              <View style={styles.teamCol}>
                <View style={styles.flagCircle}>
                  <Text style={styles.flagEmoji}>{liveMatch.home.flag}</Text>
                </View>
                <Text style={styles.teamName}>{liveMatch.home.name}</Text>
              </View>

              <View style={styles.scoreCol}>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreNum}>{liveMatch.homeScore}</Text>
                  <Text style={styles.scoreSep}>:</Text>
                  <Text style={styles.scoreNum}>{liveMatch.awayScore}</Text>
                </View>
                <Text style={styles.minuteText}>{liveMatch.minute}</Text>
              </View>

              <View style={styles.teamCol}>
                <View style={styles.flagCircle}>
                  <Text style={styles.flagEmoji}>{liveMatch.away.flag}</Text>
                </View>
                <Text style={styles.teamName}>{liveMatch.away.name}</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <TouchableOpacity style={styles.matchCenterBtn}>
              <Text style={styles.matchCenterText}>MATCH CENTER</Text>
              <Ionicons name="chevron-forward" size={14} color={C.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Saturday, June 15 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saturday, June 15</Text>

          {upcomingMatches.map((match, i) => (
            <TouchableOpacity key={i} style={styles.matchCard}>
              <View style={styles.flagCircleSmall}>
                <Text style={styles.flagEmojiSmall}>{match.home.flag}</Text>
              </View>
              <Text style={styles.teamNameSmall}>{match.home.name}</Text>

              <View style={styles.timeCol}>
                <Text style={styles.timeText}>{match.time}</Text>
                <Text style={styles.venueText}>{match.venue}</Text>
              </View>

              <Text style={styles.teamNameSmall}>{match.away.name}</Text>
              <View style={styles.flagCircleSmall}>
                <Text style={styles.flagEmojiSmall}>{match.away.flag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Past Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Results</Text>

          {pastResults.map((match, i) => (
            <View key={i} style={styles.matchCard}>
              <View style={styles.flagCircleSmall}>
                <Text style={styles.flagEmojiSmall}>{match.home.flag}</Text>
              </View>
              <Text style={styles.teamNameSmall}>{match.home.name}</Text>

              <View style={styles.timeCol}>
                <Text style={styles.pastScore}>{match.homeScore} - {match.awayScore}</Text>
                <Text style={styles.finalText}>FINAL</Text>
              </View>

              <Text style={styles.teamNameSmall}>{match.away.name}</Text>
              <View style={styles.flagCircleSmall}>
                <Text style={styles.flagEmojiSmall}>{match.away.flag}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bracket Challenge */}
        <View style={styles.bracketCard}>
          <Text style={styles.bracketTitle}>Bracket{'\n'}Challenge</Text>
          <Text style={styles.bracketSubtitle}>Predict the knockouts and win exclusive rewards.</Text>
          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>Join Now</Text>
          </TouchableOpacity>
        </View>

        {/* Fan Rank */}
        <View style={[styles.fanRankCard, { marginBottom: 32 }]}>
          <Ionicons name="podium" size={40} color={C.tertiary} />
          <Text style={styles.fanRankLabel}>Fan Rank</Text>
          <Text style={styles.fanRankValue}>#1,204</Text>
          <Text style={styles.fanRankSub}>Global Standings</Text>
        </View>

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 1,
  },

  filtersScroll: { flexGrow: 0, marginBottom: 8 },
  filtersContainer: { paddingHorizontal: 16, gap: 10, paddingVertical: 4 },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterTabActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { color: C.textMuted, fontWeight: '600', fontSize: 14 },
  filterTextActive: { color: '#0F143C' },

  scroll: { flex: 1, paddingHorizontal: 16 },

  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { color: C.text, fontSize: 17, fontWeight: '700' },
  liveCount: { flexDirection: 'row', alignItems: 'center' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.primary, marginRight: 5 },
  liveCountText: { color: C.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },

  // Featured live card
  featuredCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  liveBadge: {
    alignSelf: 'flex-end',
    backgroundColor: C.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 12,
  },
  liveBadgeText: { color: '#0F143C', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  featuredMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamCol: { alignItems: 'center', flex: 1 },
  flagCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.border,
    marginBottom: 8,
  },
  flagEmoji: { fontSize: 28 },
  teamName: { color: C.text, fontSize: 14, fontWeight: '600' },
  scoreCol: { alignItems: 'center', flex: 1 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreNum: { fontSize: 36, fontWeight: '900', color: C.text },
  scoreSep: { fontSize: 28, fontWeight: '300', color: C.textMuted },
  minuteText: { color: C.textMuted, fontSize: 12, marginTop: 4 },
  cardDivider: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  matchCenterBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  matchCenterText: { color: C.primary, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },

  // Upcoming / past match cards
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  flagCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  flagEmojiSmall: { fontSize: 18 },
  teamNameSmall: { color: C.text, fontSize: 13, fontWeight: '600', flex: 1, marginHorizontal: 8 },
  timeCol: { alignItems: 'center', paddingHorizontal: 8 },
  timeText: { color: C.primary, fontSize: 18, fontWeight: '800' },
  venueText: { color: C.textMuted, fontSize: 11, marginTop: 2 },
  pastScore: { color: C.text, fontSize: 18, fontWeight: '800' },
  finalText: { color: C.tertiary, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },

  // Bracket Challenge
  bracketCard: {
    backgroundColor: '#1A2666',
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  bracketTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: C.primary,
    lineHeight: 32,
    marginBottom: 10,
  },
  bracketSubtitle: { color: C.textMuted, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  joinBtn: {
    backgroundColor: C.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  joinBtnText: { color: '#0F143C', fontWeight: '800', fontSize: 15 },

  // Fan Rank
  fanRankCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  fanRankLabel: { color: C.textMuted, fontSize: 14, fontWeight: '600', marginTop: 12 },
  fanRankValue: { color: C.text, fontSize: 28, fontWeight: '900', marginTop: 4 },
  fanRankSub: { color: C.textMuted, fontSize: 13, marginTop: 4 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
