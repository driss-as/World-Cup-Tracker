import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#0F143C',
  card: '#162052',
  cardDark: '#0D1835',
  primary: '#2ECC71',
  text: '#FFFFFF',
  textMuted: '#8A9CC2',
  border: '#1E2D6B',
};

function formatPublishedAt(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function NewsDetailScreen({ route, navigation }) {
  const { articleId } = route.params ?? {};
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArticle = useCallback(async () => {
    if (!articleId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', articleId)
      .maybeSingle();

    setArticle(data ?? null);
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const openSource = async () => {
    if (!article?.source_url) return;
    await Linking.openURL(article.source_url);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News</Text>
        <View style={styles.headerBtn} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : !article ? (
        <View style={styles.empty}>
          <Ionicons name="newspaper-outline" size={44} color={C.textMuted} />
          <Text style={styles.emptyText}>Article unavailable</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {article.image_url ? (
            <Image source={{ uri: article.image_url }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroFallback}>
              <Ionicons name="football" size={52} color={C.textMuted} />
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.metaRow}>
              <View style={[styles.tag, { borderColor: article.tag_color ?? C.primary, backgroundColor: (article.tag_color ?? C.primary) + '22' }]}>
                <Text style={[styles.tagText, { color: article.tag_color ?? C.primary }]}>
                  {article.tag ?? 'WORLD CUP'}
                </Text>
              </View>
              <Text style={styles.dateText}>{formatPublishedAt(article.published_at)}</Text>
            </View>

            <Text style={styles.title}>{article.title}</Text>

            {!!article.summary && (
              <Text style={styles.summary}>{article.summary}</Text>
            )}

            {!!article.source_url && (
              <TouchableOpacity style={styles.sourceBtn} onPress={openSource} activeOpacity={0.82}>
                <Ionicons name="open-outline" size={18} color={C.bg} />
                <Text style={styles.sourceBtnText}>Read full article</Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.bg,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: C.primary, fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { color: C.textMuted, fontSize: 15, fontWeight: '600' },
  scroll: { flex: 1 },
  heroImage: { width: '100%', aspectRatio: 16 / 9, backgroundColor: C.cardDark },
  heroFallback: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: C.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  content: { padding: 18, paddingBottom: 34 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  dateText: { color: C.textMuted, fontSize: 12, fontWeight: '600', flexShrink: 1 },
  title: { color: C.text, fontSize: 25, fontWeight: '900', lineHeight: 31 },
  summary: { color: C.textMuted, fontSize: 16, lineHeight: 24, marginTop: 16 },
  sourceBtn: {
    marginTop: 24,
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sourceBtnText: { color: C.bg, fontSize: 15, fontWeight: '800' },
});
