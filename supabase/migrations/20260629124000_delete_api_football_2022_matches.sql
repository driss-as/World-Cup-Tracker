delete from public.matches
where season = 2022
  and api_football_fixture_id is not null;
