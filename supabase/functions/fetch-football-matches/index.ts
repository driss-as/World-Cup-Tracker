import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sync-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type SyncRequest = {
  league?: number;
  season?: number;
  date?: string;
  from?: string;
  to?: string;
  fixture?: number;
};

type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      elapsed: number | null;
    };
    venue?: {
      id?: number;
      name?: string;
      city?: string;
    };
  };
  league: {
    id: number;
    season: number;
    round?: string;
  };
  teams: {
    home: { id: number; name: string; logo?: string };
    away: { id: number; name: string; logo?: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    penalty?: {
      home: number | null;
      away: number | null;
    };
  };
};

type ApiFootballResponse = {
  response?: ApiFootballFixture[];
  errors?: unknown;
  message?: string;
};

type SupabaseClient = ReturnType<typeof createClient>;

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
  const syncSecret = Deno.env.get('FOOTBALL_SYNC_SECRET');
  if (!syncSecret) return null;

  const auth = req.headers.get('authorization') ?? '';
  const headerSecret = req.headers.get('x-sync-secret');
  const bearerSecret = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;

  if (headerSecret === syncSecret || bearerSecret === syncSecret) return null;
  return jsonResponse({ error: 'Unauthorized' }, 401);
}

function normalizeStatus(short: string) {
  if (['NS', 'TBD'].includes(short)) return 'scheduled';
  if (['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'].includes(short)) return 'live';
  if (['FT', 'AET', 'PEN'].includes(short)) return 'finished';
  if (['PST'].includes(short)) return 'postponed';
  if (['CANC', 'ABD', 'AWD', 'WO'].includes(short)) return 'cancelled';
  return 'scheduled';
}

function normalizeStage(round?: string) {
  const value = (round ?? '').toLowerCase();
  if (value.includes('round of 16')) return 'round_of_16';
  if (value.includes('quarter')) return 'quarter_final';
  if (value.includes('semi')) return 'semi_final';
  if (value.includes('final')) return 'final';
  return 'group';
}

function extractGroupName(round?: string) {
  const match = round?.match(/group\s+([a-z0-9]+)/i);
  return match?.[1]?.toUpperCase() ?? null;
}

function makeCode(name: string, apiFootballId: number) {
  const letters = name.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase();
  return `${letters || 'TM'}${apiFootballId}`;
}

async function upsertTeam(
  supabase: SupabaseClient,
  team: { id: number; name: string; logo?: string },
) {
  const { data: existingByApiId } = await supabase
    .from('teams')
    .select('id, flag')
    .eq('api_football_id', team.id)
    .maybeSingle();

  const { data: existingByName } = existingByApiId ? { data: null } : await supabase
    .from('teams')
    .select('id, flag')
    .eq('name', team.name)
    .maybeSingle();

  const existing = existingByApiId ?? existingByName;

  if (existing) {
    const { data, error } = await supabase
      .from('teams')
      .update({
        api_football_id: team.id,
        name: team.name,
        logo_url: team.logo ?? null,
      })
      .eq('id', existing.id)
      .select('id, name, flag')
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('teams')
    .insert({
      api_football_id: team.id,
      name: team.name,
      code: makeCode(team.name, team.id),
      logo_url: team.logo ?? null,
    })
    .select('id, name, flag')
    .single();

  if (error) throw error;
  return data;
}

async function upsertVenue(
  supabase: SupabaseClient,
  venue?: { id?: number; name?: string; city?: string },
) {
  if (!venue?.name) return null;

  const { data: existingByApiId } = venue.id
    ? await supabase
      .from('venues')
      .select('id')
      .eq('api_football_id', venue.id)
      .maybeSingle()
    : { data: null };

  const { data: existingByName } = existingByApiId ? { data: null } : await supabase
    .from('venues')
    .select('id')
    .eq('name', venue.name)
    .eq('city', venue.city ?? '')
    .maybeSingle();

  const existing = existingByApiId ?? existingByName;

  if (existing) {
    const { data, error } = await supabase
      .from('venues')
      .update({
        api_football_id: venue.id ?? null,
        name: venue.name,
        city: venue.city ?? null,
      })
      .eq('id', existing.id)
      .select('id, name, city')
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('venues')
    .insert({
      api_football_id: venue.id ?? null,
      name: venue.name,
      city: venue.city ?? null,
    })
    .select('id, name, city')
    .single();

  if (error) throw error;
  return data;
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

  const apiKey = Deno.env.get('API_FOOTBALL_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!apiKey) return jsonResponse({ error: 'Missing API_FOOTBALL_KEY secret' }, 500);
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Missing Supabase service secrets' }, 500);
  }

  const body = await req.json().catch(() => ({})) as SyncRequest;
  const league = body.league ?? Number(Deno.env.get('API_FOOTBALL_LEAGUE_ID') ?? 1);
  const season = body.season ?? Number(Deno.env.get('API_FOOTBALL_SEASON') ?? 2022);

  const url = new URL('https://v3.football.api-sports.io/fixtures');
  if (body.fixture) {
    url.searchParams.set('id', String(body.fixture));
  } else {
    url.searchParams.set('league', String(league));
    url.searchParams.set('season', String(season));
    if (body.date) url.searchParams.set('date', body.date);
    if (body.from) url.searchParams.set('from', body.from);
    if (body.to) url.searchParams.set('to', body.to);
  }

  const apiResponse = await fetch(url, {
    headers: {
      'x-apisports-key': apiKey,
    },
  });

  const payload = await apiResponse.json() as ApiFootballResponse;

  if (!apiResponse.ok) {
    return jsonResponse({
      error: 'API-Football request failed',
      detail: payload.message ?? payload.errors ?? apiResponse.statusText,
    }, 502);
  }

  const fixtures = payload.response ?? [];
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  let upserted = 0;

  for (const fixture of fixtures) {
    const homeTeam = await upsertTeam(supabase, fixture.teams.home);
    const awayTeam = await upsertTeam(supabase, fixture.teams.away);
    const venue = await upsertVenue(supabase, fixture.fixture.venue);
    const status = normalizeStatus(fixture.fixture.status.short);
    const stage = normalizeStage(fixture.league.round);
    const groupName = extractGroupName(fixture.league.round);

    const { error } = await supabase
      .from('matches')
      .upsert({
        api_football_fixture_id: fixture.fixture.id,
        external_key: `api-football-fixture-${fixture.fixture.id}`,
        league_id: fixture.league.id,
        season: fixture.league.season,
        stage,
        status,
        kickoff_at: fixture.fixture.date,
        minute: fixture.fixture.status.elapsed,
        group_name: groupName,
        venue_id: venue?.id ?? null,
        venue: venue?.name ?? fixture.fixture.venue?.name ?? null,
        city: venue?.city ?? fixture.fixture.venue?.city ?? null,
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        home_team: homeTeam.name,
        away_team: awayTeam.name,
        home_flag: homeTeam.flag,
        away_flag: awayTeam.flag,
        home_score: fixture.goals.home,
        away_score: fixture.goals.away,
        home_penalties: fixture.score.penalty?.home ?? null,
        away_penalties: fixture.score.penalty?.away ?? null,
      }, {
        onConflict: 'api_football_fixture_id',
      });

    if (error) throw error;
    upserted += 1;
  }

  return jsonResponse({
    fetched: fixtures.length,
    upserted,
    league,
    season,
  });
});
