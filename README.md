# World Cup Tracker

World Cup Tracker est une application Expo React Native dédiée au suivi de la Coupe du Monde de la FIFA Qatar 2022. Elle propose une expérience mobile et web autour des matchs, des équipes, des actualités football, de l'authentification utilisateur et d'un parcours Premium avec RevenueCat.

Ce projet fait partie des exemples construits dans le cadre de [Studio IA](https://formation.drissas.com/studio-ia), une méthode complète pour concevoir, construire et publier une application avec l'IA, même sans expérience en développement.

## Fonctionnalités

- Liste des matchs de la Coupe du Monde 2022 avec statuts et drapeaux
- Page d'accueil avec matchs en direct, prochains matchs et actualités
- Authentification Supabase
- Page profil utilisateur
- Parcours Premium avec deux offres : mensuelle et annuelle
- Intégration RevenueCat préparée pour les abonnements
- Interface responsive avec onglets mobiles et sidebar desktop
- Export web statique pour Vercel

## Stack Technique

- Expo SDK 56
- React Native 0.85
- React 19
- React Navigation
- Supabase
- RevenueCat
- Vercel

## Studio IA

Ce projet illustre le type d'application construit dans [Studio IA](https://formation.drissas.com/studio-ia).

Studio IA est un programme conçu pour apprendre à transformer une idée en application concrète avec les bons outils IA et une méthode structurée. Le parcours couvre notamment :

- la conception d'une application à partir d'une idée
- l'utilisation de l'IA en mode agent pour construire le projet
- la mise en place d'un backend Supabase sécurisé
- la création d'une app Expo compatible iOS, Android et Web
- l'intégration d'abonnements avec RevenueCat
- le déploiement d'une version web
- la publication progressive d'un projet réel

La formation inclut aussi un bootcamp : pendant 30 jours, les participants avancent en direct sur un projet fil rouge pour obtenir une première version concrète, testable et publiable de leur application.

En savoir plus : [formation.drissas.com/studio-ia](https://formation.drissas.com/studio-ia)

## Installation

Installer les dépendances :

```bash
npm install
```

Créer le fichier d'environnement local :

```bash
cp .env.example .env
```

Renseigner les variables obligatoires :

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_REVENUECAT_API_KEY=
```

Lancer l'application web en développement :

```bash
npm run web
```

Construire l'export web statique :

```bash
bash build-web.sh
```

Le build web est généré dans le dossier `dist/`.

## Variables D'environnement

Variables obligatoires :

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUECAT_API_KEY`

Variables RevenueCat optionnelles par plateforme :

- `EXPO_PUBLIC_REVENUECAT_WEB_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID`

## Supabase

L'application utilise Supabase pour l'authentification, les données de Coupe du Monde et les données utilisateur. Les migrations et Edge Functions sont disponibles dans le dossier `supabase/`.

Les règles RLS sont activées sur les tables applicatives :

- les données football publiques sont lisibles publiquement
- les préférences, favoris et prédictions sont limitées à l'utilisateur authentifié
- les clés privées restent dans les variables d'environnement Supabase ou Vercel

## Déploiement

L'application est configurée pour un hébergement web statique sur Vercel. Avant de déployer, configure les variables d'environnement nécessaires dans Vercel pour les environnements Production et Preview.

## Licence

Ce projet est distribué sous les conditions définies dans `LICENSE`.
