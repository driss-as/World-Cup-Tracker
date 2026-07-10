import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { getTeamFlag } from '../lib/flags';

const C = {
  bg: '#190A12',
  card: '#26101A',
  cardDark: '#12070D',
  primary: '#E53935',
  tertiary: '#FFB020',
  danger: '#E74C3C',
  text: '#FFFFFF',
  textMuted: '#B48A96',
  border: '#5A1E2A',
};

const FILTERS = ['All', 'Live', 'Upcoming', 'Finished'];

const STAGE_LABEL = {
  group:         'Group Stage',
  round_of_16:   'Round of 16',
  quarter_final: 'Quarter-Final',
  semi_final:    'Semi-Final',
  final:         'Final',
};

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });
}

function groupByDate(matches) {
  const groups = {};
  for (const m of matches) {
    const key = new Date(m.kickoff_at).toDateString();
    if (!groups[key]) groups[key] = { label: formatDate(m.kickoff_at), matches: [] };
    groups[key].matches.push(m);
  }
  return Object.values(groups);
}

function StatusBadge({ status, minute }) {
  if (status === 'live') return (
    <View style={styles.badgeLive}>
      <View style={styles.liveDot} />
      <Text style={styles.badgeLiveText}>{minute}' LIVE</Text>
    </View>
  );
  if (status === 'finished') return (
    <View style={styles.badgeFinished}>
      <Text style={styles.badgeFinishedText}>FINAL</Text>
    </View>
  );
  if (status === 'postponed') return (
    <View style={styles.badgePostponed}>
      <Text style={styles.badgePostponedText}>POSTPONED</Text>
    </View>
  );
  return null;
}

function MatchCard({ match }) {
  const isLive     = match.status === 'live';
  const isFinished = match.status === 'finished';
  const hasScore   = match.home_score !== null;

  return (
    <TouchableOpacity style={[styles.matchCard, isLive && styles.matchCardLive]} activeOpacity={0.8}>
      {/* Stage + status */}
      <View style={styles.matchTop}>
        <Text style={styles.stageText}>
          {match.group_name ? `Group ${match.group_name} · ` : ''}{STAGE_LABEL[match.stage]}
        </Text>
        <StatusBadge status={match.status} minute={match.minute} />
      </View>

      {/* Teams + score */}
      <View style={styles.matchBody}>
        {/* Home */}
        <View style={styles.teamSide}>
          <View style={styles.flagCircle}>
            <Text style={styles.flagEmoji}>{getTeamFlag(match.home_team, match.home_flag)}</Text>
          </View>
          <Text style={styles.teamName} numberOfLines={1}>{match.home_team}</Text>
        </View>

        {/* Center */}
        <View style={styles.matchCenter}>
          {hasScore ? (
            <Text style={[styles.scoreText, isLive && { color: C.primary }]}>
              {match.home_score} : {match.away_score}
            </Text>
          ) : (
            <View style={styles.kickoffBox}>
              <Text style={styles.kickoffTime}>{formatTime(match.kickoff_at)}</Text>
              <Text style={styles.kickoffDate}>{new Date(match.kickoff_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
            </View>
          )}
        </View>

        {/* Away */}
        <View style={styles.teamSide}>
          <View style={styles.flagCircle}>
            <Text style={styles.flagEmoji}>{getTeamFlag(match.away_team, match.away_flag)}</Text>
          </View>
          <Text style={styles.teamName} numberOfLines={1}>{match.away_team}</Text>
        </View>
      </View>

      {/* Venue */}
      {match.venue && (
        <View style={styles.matchFooter}>
          <Ionicons name="location-outline" size={11} color={C.textMuted} />
          <Text style={styles.venueText}>{match.venue}{match.city ? `, ${match.city}` : ''}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function MatchesScreen() {
  const [filter, setFilter]   = useState('All');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    let query = supabase
      .from('matches')
      .select('*')
      .order('kickoff_at', { ascending: true });

    if (filter === 'Live')     query = query.eq('status', 'live');
    if (filter === 'Upcoming') query = query.eq('status', 'scheduled');
    if (filter === 'Finished') query = query.eq('status', 'finished');

    const { data } = await query;
    setMatches(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchMatches();

    const channel = supabase
      .channel('matches_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchMatches)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchMatches]);

  const liveCount = matches.filter(m => m.status === 'live').length;
  const groups    = groupByDate(matches);

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

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            {f === 'Live' && liveCount > 0 && (
              <View style={styles.liveCountBadge}>
                <Text style={styles.liveCountText}>{liveCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={48} color={C.textMuted} />
          <Text style={styles.emptyText}>No matches found</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            <View key={group.label} style={styles.dateGroup}>
              <View style={styles.dateLabelRow}>
                <Text style={styles.dateLabel}>{group.label}</Text>
                {group.matches.some(m => m.status === 'live') && (
                  <View style={styles.livePill}>
                    <View style={styles.liveDot} />
                    <Text style={styles.livePillText}>
                      {group.matches.filter(m => m.status === 'live').length} LIVE
                    </Text>
                  </View>
                )}
              </View>
              {group.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </View>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.primary, letterSpacing: 1 },

  filtersScroll: { flexGrow: 0, marginBottom: 8 },
  filtersContainer: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  filterTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: C.border,
  },
  filterTabActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { color: C.textMuted, fontWeight: '600', fontSize: 14 },
  filterTextActive: { color: C.bg },
  liveCountBadge: {
    backgroundColor: C.danger, borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  liveCountText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },

  scroll: { flex: 1, paddingHorizontal: 16 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { color: C.textMuted, fontSize: 15, fontWeight: '500' },

  dateGroup: { marginBottom: 24 },
  dateLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  dateLabel: { color: C.text, fontSize: 16, fontWeight: '700' },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.primary + '22', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary },
  livePillText: { color: C.primary, fontSize: 11, fontWeight: '700' },

  matchCard: {
    backgroundColor: C.card, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  matchCardLive: { borderColor: C.primary + '55', backgroundColor: C.card },

  matchTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  stageText: { color: C.textMuted, fontSize: 11, fontWeight: '600' },

  badgeLive: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.primary + '22', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeLiveText: { color: C.primary, fontSize: 11, fontWeight: '800' },
  badgeFinished: {
    backgroundColor: C.tertiary + '22', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeFinishedText: { color: C.tertiary, fontSize: 11, fontWeight: '700' },
  badgePostponed: {
    backgroundColor: C.danger + '22', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgePostponedText: { color: C.danger, fontSize: 11, fontWeight: '700' },

  matchBody: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamSide: { alignItems: 'center', flex: 1, gap: 8 },
  flagCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: C.cardDark, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.border,
  },
  flagEmoji: { fontSize: 26 },
  teamName: { color: C.text, fontSize: 13, fontWeight: '700', textAlign: 'center' },

  matchCenter: { flex: 1, alignItems: 'center' },
  scoreText: { fontSize: 28, fontWeight: '900', color: C.text },
  kickoffBox: { alignItems: 'center', gap: 2 },
  kickoffTime: { color: C.primary, fontSize: 20, fontWeight: '800' },
  kickoffDate: { color: C.textMuted, fontSize: 11 },

  matchFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  venueText: { color: C.textMuted, fontSize: 11 },
});
