do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'news_articles_source_url_key') then
    alter table public.news_articles
      add constraint news_articles_source_url_key unique (source_url);
  end if;
end;
$$;
