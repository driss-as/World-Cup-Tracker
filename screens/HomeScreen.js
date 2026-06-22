import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
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

const ongoingMatches = [
  { group: 'B', minute: 42, home: { name: 'Argentina', flag: '🇦🇷' }, away: { name: 'Germany', flag: '🇩🇪' }, homeScore: 10, awayScore: 3 },
  { group: 'D', minute: 60, home: { name: 'Japan', flag: '🇯🇵' }, away: { name: 'Spain', flag: '🇪🇸' }, homeScore: 6, awayScore: 4 },
  { group: 'A', minute: 12, home: { name: 'Morocco', flag: '🇲🇦' }, away: { name: 'Croatia', flag: '🇭🇷' }, homeScore: 8, awayScore: 4 },
];

const news = [
  { tag: 'INJURY UPDATE', tagColor: C.tertiary, title: "Mbappé cleared for Team doctors confirm fitne..." },
  { tag: 'ANALYSIS', tagColor: C.primary, title: "Tactical Shift: Brazil's New... How Tite's successor changed the..." },
];

export default function HomeScreen() {
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
        {/* Featured Match */}
        <View style={styles.featuredCard}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>75' MINUTE • LIVE</Text>
          </View>

          <View style={styles.matchRow}>
            <View style={styles.teamBlock}>
              <View style={styles.flagCircle}>
                <Text style={styles.flagEmoji}>🇫🇷</Text>
              </View>
              <Text style={styles.teamName}>France</Text>
            </View>

            <Text style={styles.score}>2 - 1</Text>

            <View style={styles.teamBlock}>
              <View style={styles.flagCircle}>
                <Text style={styles.flagEmoji}>🇧🇷</Text>
              </View>
              <Text style={styles.teamName}>Brazil</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.watchBtn}>
            <Ionicons name="calendar-outline" size={16} color={C.primary} style={{ marginRight: 8 }} />
            <Text style={styles.watchBtnText}>WATCH MATCH</Text>
          </TouchableOpacity>
        </View>

        {/* Ongoing Matches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ongoing Matches</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {ongoingMatches.map((match, i) => (
            <View key={i} style={styles.matchCard}>
              <View style={styles.matchCardHeader}>
                <Text style={styles.groupText}>Group {match.group} • {match.minute}'</Text>
                <View style={styles.liveSmall}>
                  <View style={styles.liveDotSmall} />
                  <Text style={styles.liveSmallText}>Live</Text>
                </View>
              </View>

              <View style={styles.matchCardRow}>
                <View style={styles.teamRowLeft}>
                  <Text style={styles.flagSmall}>{match.home.flag}</Text>
                  <Text style={styles.teamNameSmall}>{match.home.name}</Text>
                </View>
                <Text style={styles.scoreSmall}>{match.homeScore}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.matchCardRow}>
                <View style={styles.teamRowLeft}>
                  <Text style={styles.flagSmall}>{match.away.flag}</Text>
                  <Text style={styles.teamNameSmall}>{match.away.name}</Text>
                </View>
                <Text style={styles.scoreSmall}>{match.awayScore}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tournament News */}
        <View style={[styles.section, { paddingBottom: 24 }]}>
          <Text style={styles.sectionTitle}>Tournament News</Text>

          {news.map((item, i) => (
            <TouchableOpacity key={i} style={styles.newsCard}>
              <View style={styles.newsImagePlaceholder}>
                <Ionicons name="football" size={28} color={C.textMuted} />
              </View>
              <View style={styles.newsContent}>
                <View style={[styles.newsTag, { backgroundColor: item.tagColor + '22', borderColor: item.tagColor }]}>
                  <Text style={[styles.newsTagText, { color: item.tagColor }]}>{item.tag}</Text>
                </View>
                <Text style={styles.newsTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.bg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Featured Card
  featuredCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.primary + '22',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.primary,
    marginRight: 6,
  },
  liveText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  teamBlock: {
    alignItems: 'center',
    flex: 1,
  },
  flagCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: C.border,
  },
  flagEmoji: {
    fontSize: 30,
  },
  teamName: {
    color: C.text,
    fontSize: 14,
    fontWeight: '600',
  },
  score: {
    fontSize: 40,
    fontWeight: '900',
    color: C.primary,
    flex: 1,
    textAlign: 'center',
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.primary,
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  watchBtnText: {
    color: C.primary,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    color: C.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Match Card
  matchCard: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  groupText: {
    color: C.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  liveSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.primary,
    marginRight: 5,
  },
  liveSmallText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  matchCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  teamRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagSmall: {
    fontSize: 20,
    marginRight: 10,
  },
  teamNameSmall: {
    color: C.text,
    fontSize: 14,
    fontWeight: '500',
  },
  scoreSmall: {
    color: C.text,
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 4,
  },

  // News
  newsCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  newsImagePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  newsTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  newsTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  newsTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
