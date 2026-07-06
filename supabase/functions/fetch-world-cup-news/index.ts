import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sync-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type NewsApiArticle = {
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  source?: { name?: string };
};

type NewsApiResponse = {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  message?: string;
};

const NEWS_QUERY = [
  '"World Cup"',
  '(football OR soccer)',
  '(FIFA OR tournament OR national team)',
].join(' AND ');

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function requireSecret(req: Request) {
  const syncSecret = Deno.env.get('NEWS_SYNC_SECRET');
  if (!syncSecret) return null;

  const auth = req.headers.get('authorization') ?? '';
  const headerSecret = req.headers.get('x-sync-secret');
  const bearerSecret = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;

  if (headerSecret === syncSecret || bearerSecret === syncSecret) return null;
  return jsonResponse({ error: 'Unauthorized' }, 401);
}

function sanitizeArticle(article: NewsApiArticle) {
  if (!article.title || !article.url) return null;

  return {
    tag: article.source?.name?.slice(0, 32) || 'WORLD CUP',
    tag_color: '#2ECC71',
    title: article.title.slice(0, 240),
    summary: article.description?.slice(0, 500) ?? null,
    image_url: article.urlToImage ?? null,
    source_url: article.url,
    published_at: article.publishedAt ?? new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const secretError = requireSecret(req);
  if (secretError) return secretError;

  const newsApiKey = Deno.env.get('NEWS_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!newsApiKey) {
    return jsonResponse({ error: 'Missing NEWS_API_KEY secret' }, 500);
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Missing Supabase service secrets' }, 500);
  }

  const url = new URL('https://newsapi.org/v2/everything');
  url.searchParams.set('q', NEWS_QUERY);
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('pageSize', '25');

  const newsResponse = await fetch(url, {
    headers: {
      'X-Api-Key': newsApiKey,
    },
  });

  const payload = await newsResponse.json() as NewsApiResponse;

  if (!newsResponse.ok || payload.status !== 'ok') {
    return jsonResponse({
      error: 'NewsAPI request failed',
      detail: payload.message ?? newsResponse.statusText,
    }, 502);
  }

  const articles = (payload.articles ?? [])
    .map(sanitizeArticle)
    .filter((article): article is NonNullable<ReturnType<typeof sanitizeArticle>> => Boolean(article));

  if (articles.length === 0) {
    return jsonResponse({ fetched: 0, inserted: 0, skipped: 0 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: insertedArticles, error: insertError } = await supabase
    .from('news_articles')
    .upsert(articles, {
      onConflict: 'source_url',
      ignoreDuplicates: true,
    })
    .select('id');

  if (insertError) {
    return jsonResponse({ error: insertError.message }, 500);
  }

  const inserted = insertedArticles?.length ?? 0;

  return jsonResponse({
    fetched: articles.length,
    inserted,
    skipped: articles.length - inserted,
  });
});
