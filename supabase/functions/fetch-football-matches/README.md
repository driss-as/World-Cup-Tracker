# fetch-football-matches

Edge Function Supabase qui récupère les matchs depuis API-Football et synchronise :

- `teams`
- `venues`
- `matches`

## Secrets

```bash
supabase secrets set API_FOOTBALL_KEY="remplace-moi"
```

Optionnel :

```bash
supabase secrets set API_FOOTBALL_LEAGUE_ID="1"
supabase secrets set API_FOOTBALL_SEASON="2022"
supabase secrets set FOOTBALL_SYNC_SECRET="une-valeur-secrete"
```

Par défaut, la fonction utilise `league=1` et `season=2022`, généralement la Coupe du monde FIFA dans API-Football. Tu peux surcharger à l'appel.

## Déploiement

```bash
supabase functions deploy fetch-football-matches --no-verify-jwt
```

## Appel manuel

```bash
curl -X POST "$SUPABASE_URL/functions/v1/fetch-football-matches" \
  -H "Content-Type: application/json" \
  -d '{"league":1,"season":2022}'
```

Avec un secret :

```bash
curl -X POST "$SUPABASE_URL/functions/v1/fetch-football-matches" \
  -H "Authorization: Bearer $FOOTBALL_SYNC_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"league":1,"season":2022}'
```
