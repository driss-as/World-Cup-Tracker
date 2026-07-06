-- Starter data so the current app has live and upcoming matches to display.

insert into public.groups (name, sort_order) values
  ('A', 1),
  ('B', 2),
  ('C', 3),
  ('D', 4)
on conflict (name) do nothing;

insert into public.teams (name, code, flag, group_id, confederation) values
  ('Brazil', 'BRA', '🇧🇷', (select id from public.groups where name = 'A'), 'CONMEBOL'),
  ('France', 'FRA', '🇫🇷', (select id from public.groups where name = 'A'), 'UEFA'),
  ('South Korea', 'KOR', '🇰🇷', (select id from public.groups where name = 'A'), 'AFC'),
  ('Ghana', 'GHA', '🇬🇭', (select id from public.groups where name = 'A'), 'CAF'),
  ('Argentina', 'ARG', '🇦🇷', (select id from public.groups where name = 'B'), 'CONMEBOL'),
  ('Germany', 'GER', '🇩🇪', (select id from public.groups where name = 'B'), 'UEFA'),
  ('England', 'ENG', '🏴', (select id from public.groups where name = 'C'), 'UEFA'),
  ('Belgium', 'BEL', '🇧🇪', (select id from public.groups where name = 'C'), 'UEFA')
on conflict (code) do update set
  name = excluded.name,
  flag = excluded.flag,
  group_id = excluded.group_id,
  confederation = excluded.confederation;

insert into public.venues (name, city, country, capacity) values
  ('Lusail Stadium', 'Lusail', 'Qatar', 88966),
  ('Al Bayt Stadium', 'Al Khor', 'Qatar', 68895),
  ('Education City Stadium', 'Al Rayyan', 'Qatar', 44667),
  ('Stadium 974', 'Doha', 'Qatar', 44089)
on conflict (name, city) do update set
  country = excluded.country,
  capacity = excluded.capacity;

insert into public.matches (
  external_key,
  stage,
  status,
  kickoff_at,
  minute,
  group_id,
  group_name,
  venue_id,
  venue,
  city,
  home_team_id,
  away_team_id,
  home_team,
  away_team,
  home_flag,
  away_flag,
  home_score,
  away_score
) values
  (
    'seed-bra-fra-live',
    'group',
    'live',
    now() - interval '58 minutes',
    58,
    (select id from public.groups where name = 'A'),
    'A',
    (select id from public.venues where name = 'Lusail Stadium'),
    'Lusail Stadium',
    'Lusail',
    (select id from public.teams where code = 'BRA'),
    (select id from public.teams where code = 'FRA'),
    'Brazil',
    'France',
    '🇧🇷',
    '🇫🇷',
    2,
    1
  ),
  (
    'seed-arg-ger-live',
    'group',
    'live',
    now() - interval '31 minutes',
    31,
    (select id from public.groups where name = 'B'),
    'B',
    (select id from public.venues where name = 'Al Bayt Stadium'),
    'Al Bayt Stadium',
    'Al Khor',
    (select id from public.teams where code = 'ARG'),
    (select id from public.teams where code = 'GER'),
    'Argentina',
    'Germany',
    '🇦🇷',
    '🇩🇪',
    0,
    0
  ),
  (
    'seed-kor-gha-upcoming',
    'group',
    'scheduled',
    now() + interval '1 day',
    null,
    (select id from public.groups where name = 'A'),
    'A',
    (select id from public.venues where name = 'Education City Stadium'),
    'Education City Stadium',
    'Al Rayyan',
    (select id from public.teams where code = 'KOR'),
    (select id from public.teams where code = 'GHA'),
    'South Korea',
    'Ghana',
    '🇰🇷',
    '🇬🇭',
    null,
    null
  ),
  (
    'seed-eng-bel-upcoming',
    'round_of_16',
    'scheduled',
    now() + interval '2 days',
    null,
    null,
    null,
    (select id from public.venues where name = 'Stadium 974'),
    'Stadium 974',
    'Doha',
    (select id from public.teams where code = 'ENG'),
    (select id from public.teams where code = 'BEL'),
    'England',
    'Belgium',
    '🏴',
    '🇧🇪',
    null,
    null
  )
on conflict (external_key) do update set
  stage = excluded.stage,
  status = excluded.status,
  kickoff_at = excluded.kickoff_at,
  minute = excluded.minute,
  group_id = excluded.group_id,
  group_name = excluded.group_name,
  venue_id = excluded.venue_id,
  venue = excluded.venue,
  city = excluded.city,
  home_team_id = excluded.home_team_id,
  away_team_id = excluded.away_team_id,
  home_team = excluded.home_team,
  away_team = excluded.away_team,
  home_flag = excluded.home_flag,
  away_flag = excluded.away_flag,
  home_score = excluded.home_score,
  away_score = excluded.away_score;

insert into public.standings (
  group_id,
  team_id,
  position,
  played,
  won,
  drawn,
  lost,
  goals_for,
  goals_against,
  points,
  status
) values
  ((select id from public.groups where name = 'A'), (select id from public.teams where code = 'BRA'), 1, 3, 3, 0, 0, 8, 2, 9, 'Qualified'),
  ((select id from public.groups where name = 'A'), (select id from public.teams where code = 'FRA'), 2, 3, 2, 0, 1, 7, 4, 6, 'Qualified'),
  ((select id from public.groups where name = 'A'), (select id from public.teams where code = 'KOR'), 3, 3, 1, 0, 2, 3, 5, 3, 'Eliminated'),
  ((select id from public.groups where name = 'A'), (select id from public.teams where code = 'GHA'), 4, 3, 0, 0, 3, 1, 8, 0, 'Eliminated')
on conflict (group_id, team_id) do update set
  position = excluded.position,
  played = excluded.played,
  won = excluded.won,
  drawn = excluded.drawn,
  lost = excluded.lost,
  goals_for = excluded.goals_for,
  goals_against = excluded.goals_against,
  points = excluded.points,
  status = excluded.status;

insert into public.players (team_id, name, position, shirt_number, flag) values
  ((select id from public.teams where code = 'FRA'), 'Kylian Mbappe', 'FW', 10, '🇫🇷'),
  ((select id from public.teams where code = 'BRA'), 'Vinicius Jr.', 'FW', 7, '🇧🇷'),
  ((select id from public.teams where code = 'ARG'), 'Lautaro Martinez', 'FW', 22, '🇦🇷'),
  ((select id from public.teams where code = 'ENG'), 'Harry Kane', 'FW', 9, '🏴'),
  ((select id from public.teams where code = 'GER'), 'Jamal Musiala', 'MF', 10, '🇩🇪'),
  ((select id from public.teams where code = 'BEL'), 'Kevin De Bruyne', 'MF', 7, '🇧🇪')
on conflict (team_id, name) do update set
  position = excluded.position,
  shirt_number = excluded.shirt_number,
  flag = excluded.flag;

insert into public.player_tournament_stats (
  player_id,
  matches_played,
  goals,
  assists,
  clean_sheets,
  saves
) values
  ((select p.id from public.players p join public.teams t on t.id = p.team_id where t.code = 'FRA' and p.name = 'Kylian Mbappe'), 5, 6, 2, 0, 0),
  ((select p.id from public.players p join public.teams t on t.id = p.team_id where t.code = 'BRA' and p.name = 'Vinicius Jr.'), 5, 4, 4, 0, 0),
  ((select p.id from public.players p join public.teams t on t.id = p.team_id where t.code = 'ARG' and p.name = 'Lautaro Martinez'), 4, 5, 0, 0, 0),
  ((select p.id from public.players p join public.teams t on t.id = p.team_id where t.code = 'ENG' and p.name = 'Harry Kane'), 5, 4, 3, 0, 0),
  ((select p.id from public.players p join public.teams t on t.id = p.team_id where t.code = 'GER' and p.name = 'Jamal Musiala'), 5, 2, 5, 0, 0),
  ((select p.id from public.players p join public.teams t on t.id = p.team_id where t.code = 'BEL' and p.name = 'Kevin De Bruyne'), 5, 1, 4, 0, 0)
on conflict (player_id) do update set
  matches_played = excluded.matches_played,
  goals = excluded.goals,
  assists = excluded.assists,
  clean_sheets = excluded.clean_sheets,
  saves = excluded.saves;

insert into public.news_articles (tag, tag_color, title, summary, published_at) values
  ('INJURY UPDATE', '#F1C40F', 'Mbappe cleared for duty', 'Team doctors confirm fitness before the next knockout match.', now() - interval '2 hours'),
  ('ANALYSIS', '#2ECC71', 'Brazil pressing system explained', 'A tactical look at Brazil''s aggressive defensive shape.', now() - interval '5 hours')
on conflict do nothing;
