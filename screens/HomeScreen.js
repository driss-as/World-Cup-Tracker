import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

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

const STAGE_LABEL = {
  group: 'Group Stage',
  round_of_16: 'Round of 16',
  quarter_final: 'Quarter-Final',
  semi_final: 'Semi-Final',
  final: 'Final',
};

function formatKickoff(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    + ' • '
    + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const news = [
  { tag: 'INJURY UPDATE', tagColor: C.tertiary, title: "Mbappé cleared for duty — Team doctors confirm fitness" },
  { tag: 'ANALYSIS', tagColor: C.primary, title: "Tactical Shift: Brazil's new pressing system explained" },
];

export default function HomeScreen() {
  const [liveMatches, setLiveMatches]         = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading]                 = useState(true);

  const fetchMatches = useCallback(async () => {
    const [{ data: live }, { data: upcoming }] = await Promise.all([
      supabase
        .from('matches')
        .select('*')
        .eq('status', 'live')
        .order('kickoff_at', { ascending: true }),
      supabase
        .from('matches')
        .select('*')
        .eq('status', 'scheduled')
        .order('kickoff_at', { ascending: true })
        .limit(5),
    ]);
    setLiveMatches(live ?? []);
    setUpcomingMatches(upcoming ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMatches();

    const channel = supabase
      .channel('matches_home')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchMatches)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchMatches]);

  const featured = liveMatches[0] ?? null;
  const ongoing  = liveMatches.slice(1);

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

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Featured live match */}
          {featured ? (
            <View style={styles.featuredCard}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>{featured.minute}' MINUTE • LIVE</Text>
              </View>
              <View style={styles.matchRow}>
                <View style={styles.teamBlock}>
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagEmoji}>{featured.home_flag}</Text>
                  </View>
                  <Text style={styles.teamName}>{featured.home_team}</Text>
                </View>
                <Text style={styles.score}>{featured.home_score} - {featured.away_score}</Text>
                <View style={styles.teamBlock}>
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagEmoji}>{featured.away_flag}</Text>
                  </View>
                  <Text style={styles.teamName}>{featured.away_team}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.watchBtn}>
                <Ionicons name="radio-outline" size={16} color={C.primary} style={{ marginRight: 8 }} />
                <Text style={styles.watchBtnText}>WATCH MATCH</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noLiveCard}>
              <Ionicons name="football-outline" size={32} color={C.textMuted} />
              <Text style={styles.noLiveText}>No live matches right now</Text>
            </View>
          )}

          {/* Ongoing matches */}
          {ongoing.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ongoing Matches</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>
              {ongoing.map((match) => (
                <View key={match.id} style={styles.matchCard}>
                  <View style={styles.matchCardHeader}>
                    <Text style={styles.groupText}>
                      {match.group_name ? `Group ${match.group_name}` : STAGE_LABEL[match.stage]} • {match.minute}'
                    </Text>
                    <View style={styles.liveSmall}>
                      <View style={styles.liveDotSmall} />
                      <Text style={styles.liveSmallText}>Live</Text>
                    </View>
                  </View>
                  <View style={styles.matchCardRow}>
                    <View style={styles.teamRowLeft}>
                      <Text style={styles.flagSmall}>{match.home_flag}</Text>
                      <Text style={styles.teamNameSmall}>{match.home_team}</Text>
                    </View>
                    <Text style={styles.scoreSmall}>{match.home_score}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.matchCardRow}>
                    <View style={styles.teamRowLeft}>
                      <Text style={styles.flagSmall}>{match.away_flag}</Text>
                      <Text style={styles.teamNameSmall}>{match.away_team}</Text>
                    </View>
                    <Text style={styles.scoreSmall}>{match.away_score}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Upcoming matches */}
          {upcomingMatches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Matches</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>
              {upcomingMatches.map((match) => (
                <View key={match.id} style={styles.upcomingCard}>
                  <View style={styles.upcomingLeft}>
                    <View style={styles.upcomingTeams}>
                      <Text style={styles.upcomingFlag}>{match.home_flag}</Text>
                      <Text style={styles.upcomingTeamName}>{match.home_team}</Text>
                    </View>
                    <View style={styles.vsBox}>
                      <Text style={styles.vsText}>VS</Text>
                    </View>
                    <View style={styles.upcomingTeams}>
                      <Text style={styles.upcomingFlag}>{match.away_flag}</Text>
                      <Text style={styles.upcomingTeamName}>{match.away_team}</Text>
                    </View>
                  </View>
                  <View style={styles.upcomingRight}>
                    <Text style={styles.upcomingStage}>{STAGE_LABEL[match.stage]}</Text>
                    <Text style={styles.upcomingTime}>{formatKickoff(match.kickoff_at)}</Text>
                    {match.venue && (
                      <Text style={styles.upcomingVenue} numberOfLines={1}>{match.venue}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: C.bg,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.primary, letterSpacing: 1 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  featuredCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 20,
    marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: C.border,
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary + '22',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 20,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.primary, marginRight: 6 },
  liveText: { color: C.primary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  matchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', marginBottom: 24,
  },
  teamBlock: { alignItems: 'center', flex: 1 },
  flagCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: C.cardDark,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    borderWidth: 2, borderColor: C.border,
  },
  flagEmoji: { fontSize: 30 },
  teamName: { color: C.text, fontSize: 14, fontWeight: '600' },
  score: { fontSize: 40, fontWeight: '900', color: C.primary, flex: 1, textAlign: 'center' },
  watchBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: C.primary,
    borderRadius: 10, paddingHorizontal: 28, paddingVertical: 12,
  },
  watchBtnText: { color: C.primary, fontWeight: '700', fontSize: 14, letterSpacing: 1 },

  noLiveCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 32, marginBottom: 24,
    alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.border,
  },
  noLiveText: { color: C.textMuted, fontSize: 14, fontWeight: '500' },

  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: '700' },
  viewAll: { color: C.primary, fontSize: 13, fontWeight: '600' },

  matchCard: {
    backgroundColor: C.card, borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  matchCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  groupText: { color: C.textMuted, fontSize: 12, fontWeight: '500' },
  liveSmall: { flexDirection: 'row', alignItems: 'center' },
  liveDotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary, marginRight: 5 },
  liveSmallText: { color: C.primary, fontSize: 12, fontWeight: '600' },
  matchCardRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 5,
  },
  teamRowLeft: { flexDirection: 'row', alignItems: 'center' },
  flagSmall: { fontSize: 20, marginRight: 10 },
  teamNameSmall: { color: C.text, fontSize: 14, fontWeight: '500' },
  scoreSmall: { color: C.text, fontSize: 18, fontWeight: '800' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 4 },

  upcomingCard: {
    backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: C.border, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  upcomingLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  upcomingTeams: { alignItems: 'center', gap: 2 },
  upcomingFlag: { fontSize: 22 },
  upcomingTeamName: { color: C.text, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  vsBox: {
    backgroundColor: C.cardDark, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  vsText: { color: C.textMuted, fontSize: 11, fontWeight: '700' },
  upcomingRight: { alignItems: 'flex-end', gap: 3 },
  upcomingStage: {
    color: C.primary, fontSize: 10, fontWeight: '700',
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  upcomingTime: { color: C.text, fontSize: 12, fontWeight: '600' },
  upcomingVenue: { color: C.textMuted, fontSize: 11, maxWidth: 130 },

  newsCard: {
    flexDirection: 'row', backgroundColor: C.card, borderRadius: 12,
    overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  newsImagePlaceholder: {
    width: 90, height: 90, backgroundColor: C.cardDark,
    alignItems: 'center', justifyContent: 'center',
  },
  newsContent: { flex: 1, padding: 12, justifyContent: 'center' },
  newsTag: {
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2, marginBottom: 6,
  },
  newsTagText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  newsTitle: { color: C.text, fontSize: 13, fontWeight: '500', lineHeight: 18 },
});
