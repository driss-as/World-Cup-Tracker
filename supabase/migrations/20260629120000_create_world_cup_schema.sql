-- World Cup Tracker schema for Supabase.
-- This keeps the denormalized columns currently used by the app on matches,
-- while adding normalized tables for the rest of the product.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'match_status' and typnamespace = 'public'::regnamespace) then
    create type public.match_status as enum (
      'scheduled',
      'live',
      'finished',
      'postponed',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'match_stage' and typnamespace = 'public'::regnamespace) then
    create type public.match_stage as enum (
      'group',
      'round_of_16',
      'quarter_final',
      'semi_final',
      'final'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'match_event_type' and typnamespace = 'public'::regnamespace) then
    create type public.match_event_type as enum (
      'goal',
      'own_goal',
      'penalty_goal',
      'penalty_miss',
      'yellow_card',
      'red_card',
      'substitution',
      'var',
      'kickoff',
      'half_time',
      'full_time'
    );
  end if;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  favorite_team_id uuid,
  fan_since integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  flag text,
  group_id uuid references public.groups(id) on delete set null,
  confederation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_favorite_team_id_fkey') then
    alter table public.profiles
      add constraint profiles_favorite_team_id_fkey
      foreign key (favorite_team_id) references public.teams(id) on delete set null;
  end if;
end;
$$;

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country text,
  capacity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, city)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  stage public.match_stage not null default 'group',
  status public.match_status not null default 'scheduled',
  kickoff_at timestamptz not null,
  minute integer,
  group_id uuid references public.groups(id) on delete set null,
  group_name text,
  venue_id uuid references public.venues(id) on delete set null,
  venue text,
  city text,
  home_team_id uuid references public.teams(id) on delete restrict,
  away_team_id uuid references public.teams(id) on delete restrict,
  home_team text not null,
  away_team text not null,
  home_flag text,
  away_flag text,
  home_score integer,
  away_score integer,
  home_penalties integer,
  away_penalties integer,
  external_key text unique,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint matches_distinct_teams check (
    home_team_id is null
    or away_team_id is null
    or home_team_id <> away_team_id
  ),
  constraint matches_scores_non_negative check (
    (home_score is null or home_score >= 0)
    and (away_score is null or away_score >= 0)
  ),
  constraint matches_minute_range check (minute is null or minute between 0 and 130)
);

alter table public.matches add column if not exists stage public.match_stage not null default 'group';
alter table public.matches add column if not exists status public.match_status not null default 'scheduled';
alter table public.matches add column if not exists kickoff_at timestamptz;
alter table public.matches add column if not exists minute integer;
alter table public.matches add column if not exists group_id uuid references public.groups(id) on delete set null;
alter table public.matches add column if not exists group_name text;
alter table public.matches add column if not exists venue_id uuid references public.venues(id) on delete set null;
alter table public.matches add column if not exists venue text;
alter table public.matches add column if not exists city text;
alter table public.matches add column if not exists home_team_id uuid references public.teams(id) on delete restrict;
alter table public.matches add column if not exists away_team_id uuid references public.teams(id) on delete restrict;
alter table public.matches add column if not exists home_team text;
alter table public.matches add column if not exists away_team text;
alter table public.matches add column if not exists home_flag text;
alter table public.matches add column if not exists away_flag text;
alter table public.matches add column if not exists home_score integer;
alter table public.matches add column if not exists away_score integer;
alter table public.matches add column if not exists home_penalties integer;
alter table public.matches add column if not exists away_penalties integer;
alter table public.matches add column if not exists external_key text;
alter table public.matches add column if not exists notes text;
alter table public.matches add column if not exists created_at timestamptz not null default now();
alter table public.matches add column if not exists updated_at timestamptz not null default now();

create unique index if not exists matches_external_key_key on public.matches(external_key);

create table if not exists public.match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  player_id uuid,
  related_player_id uuid,
  event_type public.match_event_type not null,
  minute integer not null,
  stoppage_minute integer,
  description text,
  created_at timestamptz not null default now(),
  constraint match_events_minute_range check (minute between 0 and 130)
);

create table if not exists public.standings (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  position integer not null,
  played integer not null default 0,
  won integer not null default 0,
  drawn integer not null default 0,
  lost integer not null default 0,
  goals_for integer not null default 0,
  goals_against integer not null default 0,
  goal_difference integer generated always as (goals_for - goals_against) stored,
  points integer not null default 0,
  status text,
  updated_at timestamptz not null default now(),
  unique (group_id, team_id),
  unique (group_id, position)
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  position text,
  shirt_number integer,
  flag text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, name)
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'match_events_player_id_fkey') then
    alter table public.match_events
      add constraint match_events_player_id_fkey
      foreign key (player_id) references public.players(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'match_events_related_player_id_fkey') then
    alter table public.match_events
      add constraint match_events_related_player_id_fkey
      foreign key (related_player_id) references public.players(id) on delete set null;
  end if;
end;
$$;

create table if not exists public.player_tournament_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  matches_played integer not null default 0,
  goals integer not null default 0,
  assists integer not null default 0,
  clean_sheets integer not null default 0,
  saves integer not null default 0,
  yellow_cards integer not null default 0,
  red_cards integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (player_id)
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  tag text,
  tag_color text,
  title text not null,
  summary text,
  image_url text,
  source_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  default_team_id uuid references public.teams(id) on delete set null,
  language text not null default 'en',
  match_alerts boolean not null default true,
  goal_notifications boolean not null default true,
  weekly_digest boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_favorite_teams (
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, team_id)
);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  home_score integer not null,
  away_score integer not null,
  points_awarded integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, match_id),
  constraint predictions_scores_non_negative check (home_score >= 0 and away_score >= 0)
);

create index groups_sort_order_idx on public.groups(sort_order);
create index teams_group_id_idx on public.teams(group_id);
create index matches_status_kickoff_at_idx on public.matches(status, kickoff_at);
create index matches_kickoff_at_idx on public.matches(kickoff_at);
create index matches_group_id_idx on public.matches(group_id);
create index match_events_match_id_minute_idx on public.match_events(match_id, minute);
create index standings_group_position_idx on public.standings(group_id, position);
create index players_team_id_idx on public.players(team_id);
create index player_tournament_stats_goals_idx on public.player_tournament_stats(goals desc);
create index news_articles_published_at_idx on public.news_articles(published_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists teams_set_updated_at on public.teams;
create trigger teams_set_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

drop trigger if exists venues_set_updated_at on public.venues;
create trigger venues_set_updated_at
before update on public.venues
for each row execute function public.set_updated_at();

drop trigger if exists matches_set_updated_at on public.matches;
create trigger matches_set_updated_at
before update on public.matches
for each row execute function public.set_updated_at();

drop trigger if exists standings_set_updated_at on public.standings;
create trigger standings_set_updated_at
before update on public.standings
for each row execute function public.set_updated_at();

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at
before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists player_tournament_stats_set_updated_at on public.player_tournament_stats;
create trigger player_tournament_stats_set_updated_at
before update on public.player_tournament_stats
for each row execute function public.set_updated_at();

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

drop trigger if exists predictions_set_updated_at on public.predictions;
create trigger predictions_set_updated_at
before update on public.predictions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'username', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.teams enable row level security;
alter table public.venues enable row level security;
alter table public.matches enable row level security;
alter table public.match_events enable row level security;
alter table public.standings enable row level security;
alter table public.players enable row level security;
alter table public.player_tournament_stats enable row level security;
alter table public.news_articles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_favorite_teams enable row level security;
alter table public.predictions enable row level security;

drop policy if exists "profiles are readable by authenticated users" on public.profiles;
create policy "profiles are readable by authenticated users"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "public tournament data is readable" on public.groups;
create policy "public tournament data is readable"
on public.groups for select
to anon, authenticated
using (true);

drop policy if exists "public teams are readable" on public.teams;
create policy "public teams are readable"
on public.teams for select
to anon, authenticated
using (true);

drop policy if exists "public venues are readable" on public.venues;
create policy "public venues are readable"
on public.venues for select
to anon, authenticated
using (true);

drop policy if exists "public matches are readable" on public.matches;
create policy "public matches are readable"
on public.matches for select
to anon, authenticated
using (true);

drop policy if exists "public match events are readable" on public.match_events;
create policy "public match events are readable"
on public.match_events for select
to anon, authenticated
using (true);

drop policy if exists "public standings are readable" on public.standings;
create policy "public standings are readable"
on public.standings for select
to anon, authenticated
using (true);

drop policy if exists "public players are readable" on public.players;
create policy "public players are readable"
on public.players for select
to anon, authenticated
using (true);

drop policy if exists "public player stats are readable" on public.player_tournament_stats;
create policy "public player stats are readable"
on public.player_tournament_stats for select
to anon, authenticated
using (true);

drop policy if exists "published news is readable" on public.news_articles;
create policy "published news is readable"
on public.news_articles for select
to anon, authenticated
using (true);

drop policy if exists "users can read own preferences" on public.user_preferences;
create policy "users can read own preferences"
on public.user_preferences for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert own preferences" on public.user_preferences;
create policy "users can insert own preferences"
on public.user_preferences for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update own preferences" on public.user_preferences;
create policy "users can update own preferences"
on public.user_preferences for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can read own favorites" on public.user_favorite_teams;
create policy "users can read own favorites"
on public.user_favorite_teams for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert own favorites" on public.user_favorite_teams;
create policy "users can insert own favorites"
on public.user_favorite_teams for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can delete own favorites" on public.user_favorite_teams;
create policy "users can delete own favorites"
on public.user_favorite_teams for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can read own predictions" on public.predictions;
create policy "users can read own predictions"
on public.predictions for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert own predictions" on public.predictions;
create policy "users can insert own predictions"
on public.predictions for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update own predictions" on public.predictions;
create policy "users can update own predictions"
on public.predictions for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete own predictions" on public.predictions;
create policy "users can delete own predictions"
on public.predictions for delete
to authenticated
using (auth.uid() = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'matches'
  ) then
    alter publication supabase_realtime add table public.matches;
  end if;
end;
$$;
