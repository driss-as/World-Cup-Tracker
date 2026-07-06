alter table public.teams add column if not exists api_football_id integer;
alter table public.teams add column if not exists logo_url text;

alter table public.venues add column if not exists api_football_id integer;

alter table public.matches add column if not exists api_football_fixture_id integer;
alter table public.matches add column if not exists league_id integer;
alter table public.matches add column if not exists season integer;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'teams_api_football_id_key') then
    alter table public.teams
      add constraint teams_api_football_id_key unique (api_football_id);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'venues_api_football_id_key') then
    alter table public.venues
      add constraint venues_api_football_id_key unique (api_football_id);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'matches_api_football_fixture_id_key') then
    alter table public.matches
      add constraint matches_api_football_fixture_id_key unique (api_football_fixture_id);
  end if;
end;
$$;
