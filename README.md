# World Cup Tracker

World Cup Tracker is an Expo React Native app for following the FIFA World Cup Qatar 2022. It includes match browsing, football news, authentication, profile management, and a Premium subscription flow powered by RevenueCat.

## Features

- World Cup 2022 match list with team flags and match status
- Home dashboard with live/upcoming match sections and news
- Supabase authentication and user profile screen
- Premium membership screen with monthly and annual plans
- RevenueCat integration scaffolded for subscription purchases
- Responsive web layout with mobile tabs and desktop sidebar

## Tech Stack

- Expo SDK 56
- React Native 0.85
- React 19
- React Navigation
- Supabase
- RevenueCat
- Vercel web deployment

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill in the required values:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_REVENUECAT_API_KEY=
```

Start the Expo web app:

```bash
npm run web
```

Build the static web export:

```bash
bash build-web.sh
```

The web build is exported to `dist/`.

## Environment Variables

Required:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUECAT_API_KEY`

Optional RevenueCat platform-specific keys:

- `EXPO_PUBLIC_REVENUECAT_WEB_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID`

## Supabase

The app uses Supabase for authentication and World Cup data. Migrations and edge functions live in `supabase/`.

Row Level Security is enabled for app tables. Public football data is readable publicly, while user-owned data such as preferences, favorite teams, and predictions is scoped to the authenticated user.

## Deployment

The app is configured for Vercel static hosting. Make sure the required environment variables are configured in Vercel for Production and Preview before deploying.

## License

This project is licensed under the terms in `LICENSE`.
