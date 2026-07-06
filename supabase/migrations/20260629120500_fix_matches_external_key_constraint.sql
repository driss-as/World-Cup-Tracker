drop index if exists public.matches_external_key_key;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'matches_external_key_key') then
    alter table public.matches
      add constraint matches_external_key_key unique (external_key);
  end if;
end;
$$;
