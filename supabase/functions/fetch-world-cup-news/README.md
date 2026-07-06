# fetch-world-cup-news

Edge Function Supabase qui récupère des articles NewsAPI liés au football et à la Coupe du monde, puis insère les nouveaux articles dans `public.news_articles`.

## Secrets

```bash
supabase secrets set NEWS_API_KEY="remplace-moi"
```

Optionnel, pour protéger l'appel HTTP :

```bash
supabase secrets set NEWS_SYNC_SECRET="une-valeur-secrete"
```

Si `NEWS_SYNC_SECRET` est défini, appelle la fonction avec `x-sync-secret` ou `Authorization: Bearer ...`.

## Déploiement

```bash
supabase functions deploy fetch-world-cup-news --no-verify-jwt
```

## Appel manuel

```bash
curl -X POST \
  "$SUPABASE_URL/functions/v1/fetch-world-cup-news" \
  -H "Authorization: Bearer $NEWS_SYNC_SECRET"
```
