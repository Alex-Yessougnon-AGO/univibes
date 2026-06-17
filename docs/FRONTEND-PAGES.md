# UnivVibes — Catalogue des Pages Frontend

> Document généré le 17 Juin 2026
> Framework : Next.js 16.2.9 (App Router) · TypeScript · Tailwind CSS v4 · next-intl v4
> Internationalisation : Français (fr) / Anglais (en) — préfixe `[locale]` obligatoire sur toutes les routes

---

## Comment lancer le frontend

```bash
# Depuis la racine du projet
cd /home/alex/Web/univibes/apps/web

# Lancer le serveur de développement sur le port 3000
npx next dev --port 3000

# Le serveur sera accessible sur :
# → http://localhost:3000/fr   (français)
# → http://localhost:3000/en   (anglais)
```

> **Note :** Le backend NestJS n'est pas requis pour la démo frontend. Toutes les données sont mockées (fichier `apps/web/src/lib/mock-data.ts`). L'i18n utilise `next-intl` — toutes les pages sont sous le segment dynamique `[locale]` (ex: `/fr/explore`, `/en/explore`).

---

## 1. Pages Publiques (Accessibles sans authentification)

### `/fr/` ou `/en/` — Page d'accueil (Landing)
| Détail | Description |
|--------|-------------|
| **Rôle** | Première impression du produit. Conversion. |
| **Sections** | Hero avec recherche · Catégories · Événements à la une (scroll horizontal) · Événements à venir (grille) · Top organisateurs · CTA "Devenir organisateur" · Footer |
| **Fichier** | `apps/web/src/app/[locale]/page.tsx` |
| **État** | ✅ Complète (+ i18n) |

### `/fr/explore` ou `/en/explore` — Catalogue des événements
| Détail | Description |
|--------|-------------|
| **Rôle** | Découverte et recherche d'événements |
| **Fonctionnalités** | Barre de recherche · Filtres (catégorie, ville, prix gratuit/payant) · Tri (date, popularité, prix) · Vue grille/liste · Filtres sidebar desktop + drawer mobile |
| **Fichier** | `apps/web/src/app/[locale]/explore/page.tsx` |
| **État** | ✅ Complète (+ i18n) |

### `/fr/event/[slug]` ou `/en/event/[slug]` — Détail d'un événement
| Détail | Description |
|--------|-------------|
| **Rôle** | Page de conversion la plus critique. Affiche tous les détails et permet la réservation. |
| **Sections** | Cover image · Infos (date, lieu, heure) · Description · Tags · Types de billets avec prix · Profil de l'organisateur · Événements similaires · Modale d'achat avec sélecteur de quantité |
| **Spécificités** | CTA sticky "Réserver" en bas sur mobile · Modale d'achat avec sélection de billet + quantité + total |
| **Fichier** | `apps/web/src/app/[locale]/event/[slug]/page.tsx` |
| **État** | ✅ Complète |

### `/fr/organizer/[slug]` ou `/en/organizer/[slug]` — Profil d'un organisateur
| Détail | Description |
|--------|-------------|
| **Rôle** | Page publique d'un organisateur / association étudiante |
| **Sections** | Logo · Description · Badge vérifié · Stats (abonnés, événements) · Boutons (Suivre, Site web, Instagram) · Événements à venir · Événements passés |
| **Fichier** | `apps/web/src/app/[locale]/organizer/[slug]/page.tsx` |
| **État** | ✅ Complète |

### `/fr/search` ou `/en/search` — Recherche globale
| Détail | Description |
|--------|-------------|
| **Rôle** | Recherche rapide d'événements et organisateurs |
| **Fichier** | `apps/web/src/app/[locale]/search/page.tsx` |
| **État** | ✅ Complète |

### `/fr/about` ou `/en/about` — À propos
| Détail | Description |
|--------|-------------|
| **Rôle** | Page de présentation de la plateforme |
| **Sections** | Mission, valeurs, statistiques |
| **Fichier** | `apps/web/src/app/[locale]/about/page.tsx` |
| **État** | ✅ Complète |

### `/fr/contact` ou `/en/contact` — Contact
| Détail | Description |
|--------|-------------|
| **Rôle** | Formulaire de contact |
| **Fichier** | `apps/web/src/app/[locale]/contact/page.tsx` |
| **État** | ✅ Complète |

### `/fr/pricing` ou `/en/pricing` — Tarifs
| Détail | Description |
|--------|-------------|
| **Rôle** | Grille de tarifs pour les organisateurs |
| **Fichier** | `apps/web/src/app/[locale]/pricing/page.tsx` |
| **État** | ✅ Complète |

### `/fr/blog` ou `/en/blog` — Blog
| Détail | Description |
|--------|-------------|
| **Rôle** | Articles et actualités |
| **Fichier** | `apps/web/src/app/[locale]/blog/page.tsx` |
| **État** | ✅ Complète |

### `/fr/blog/[slug]` ou `/en/blog/[slug]` — Article de blog
| Détail | Description |
|--------|-------------|
| **Rôle** | Lecture d'un article |
| **Fichier** | `apps/web/src/app/[locale]/blog/[slug]/page.tsx` |
| **État** | ✅ Complète |

### `/fr/legal/terms` — Conditions d'utilisation
| Fichier | `apps/web/src/app/[locale]/legal/terms/page.tsx` | ✅ |
### `/fr/legal/privacy` — Politique de confidentialité
| Fichier | `apps/web/src/app/[locale]/legal/privacy/page.tsx` | ✅ |
### `/fr/legal/cookies` — Politique de cookies
| Fichier | `apps/web/src/app/[locale]/legal/cookies/page.tsx` | ✅ |

---

## 2. Pages d'Authentification

### `/fr/login` ou `/en/login` — Connexion
| Détail | Description |
|--------|-------------|
| **Rôle** | Authentification utilisateur |
| **Fonctionnalités** | Email · Mot de passe (toggle visibilité) · Lien mot de passe oublié · Lien inscription · Indicateur credentials de démo |
| **Fichier** | `apps/web/src/app/[locale]/login/page.tsx` |
| **État** | ✅ Complète (mockée, + i18n) |

### `/fr/register` ou `/en/register` — Inscription
| Détail | Description |
|--------|-------------|
| **Rôle** | Création de compte |
| **Fonctionnalités** | Flow en 2 étapes avec indicateur · Étape 1 : infos perso (nom, email, téléphone, université, mot de passe) · Étape 2 : choix du rôle (Étudiant / Organisateur) |
| **Fichier** | `apps/web/src/app/[locale]/register/page.tsx` |
| **État** | ✅ Complète (mockée) |

### `/fr/forgot-password` ou `/en/forgot-password` — Mot de passe oublié
| Détail | Description |
|--------|-------------|
| **Rôle** | Réinitialisation de mot de passe |
| **Fonctionnalités** | Formulaire email · État de confirmation avec message de succès |
| **Fichier** | `apps/web/src/app/[locale]/forgot-password/page.tsx` |
| **État** | ✅ Complète (mockée) |

### `/fr/auth/reset-password` — Réinitialisation
| Fichier | `apps/web/src/app/[locale]/auth/reset-password/page.tsx` | ✅ |
### `/fr/auth/verify-email` — Vérification email
| Fichier | `apps/web/src/app/[locale]/auth/verify-email/page.tsx` | ✅ |
### `/fr/auth/verify-email/[token]` — Vérification avec token
| Fichier | `apps/web/src/app/[locale]/auth/verify-email/[token]/page.tsx` | ✅ |
### `/fr/auth/onboarding` — Onboarding
| Fichier | `apps/web/src/app/[locale]/auth/onboarding/page.tsx` | ✅ |

---

## 3. Pages Privées (Espace étudiant)

### `/fr/profile` ou `/en/profile` — Profil utilisateur
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion du profil personnel |
| **Fonctionnalités** | Avatar avec initiales · Édition des champs (nom, email, téléphone, université, ville) · Menu (Mes infos, Notifications, Paramètres) · Statistiques (événements, favoris, billets) · Bouton déconnexion |
| **Fichier** | `apps/web/src/app/[locale]/profile/page.tsx` |
| **État** | ✅ Complète |

### `/fr/profile/edit` ou `/en/profile/edit` — Édition du profil
| Fichier | `apps/web/src/app/[locale]/profile/edit/page.tsx` | ✅ |
### `/fr/profile/settings` ou `/en/profile/settings` — Paramètres
| Fichier | `apps/web/src/app/[locale]/profile/settings/page.tsx` | ✅ |

### `/fr/profile/security` ou `/en/profile/security` — Sécurité (NOUVEAU)
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion du mot de passe et des sessions |
| **Fonctionnalités** | Changement de mot de passe · Sessions actives · Double authentification · Historique des connexions |
| **Fichier** | `apps/web/src/app/[locale]/profile/security/page.tsx` |
| **État** | ✅ Nouvelle page (+ i18n) |

### `/fr/profile/notifications` ou `/en/profile/notifications` — Préférences de notifications (NOUVEAU)
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion des préférences de notifications |
| **Fonctionnalités** | Toggle push/email · Types de notification (achat, rappel, approbation, refus, paiement, promo) |
| **Fichier** | `apps/web/src/app/[locale]/profile/notifications/page.tsx` |
| **État** | ✅ Nouvelle page (+ i18n) |

### `/fr/favorites` ou `/en/favorites` — Mes favoris
| Détail | Description |
|--------|-------------|
| **Rôle** | Événements sauvegardés |
| **Fonctionnalités** | Grille d'événements favoris · Bouton "Tout effacer" · État vide avec CTA "Découvrir des événements" |
| **Fichier** | `apps/web/src/app/[locale]/favorites/page.tsx` |
| **État** | ✅ Complète |

### `/fr/tickets` ou `/en/tickets` — Mes billets
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion des billets achetés |
| **Fonctionnalités** | Section "À venir" (billets actifs) · Section "Passés" · Modale QR code simulé pour chaque billet · État vide |
| **Fichier** | `apps/web/src/app/[locale]/tickets/page.tsx` |
| **État** | ✅ Complète |

### `/fr/tickets/[id]` ou `/en/tickets/[id]` — Détail d'un billet
| Détail | Description |
|--------|-------------|
| **Rôle** | Visualisation du QR code et détails du billet |
| **Fichier** | `apps/web/src/app/[locale]/tickets/[id]/page.tsx` |
| **État** | ✅ Complète |

### `/fr/tickets/[id]/invoice` ou `/en/tickets/[id]/invoice` — Facture (NOUVEAU)
| Détail | Description |
|--------|-------------|
| **Rôle** | Facture détaillée d'une commande |
| **Fonctionnalités** | En-tête facture · Tableau des articles · Total · Infos paiement · Actions (PDF, impression, email) |
| **Fichier** | `apps/web/src/app/[locale]/tickets/[id]/invoice/page.tsx` |
| **État** | ✅ Nouvelle page (+ i18n) |

### `/fr/notifications` ou `/en/notifications` — Centre de notifications
| Détail | Description |
|--------|-------------|
| **Rôle** | Liste des notifications de l'utilisateur |
| **Fonctionnalités** | Types de notification · Statut lu/non lu · Horodatage |
| **Fichier** | `apps/web/src/app/[locale]/notifications/page.tsx` |
| **État** | ✅ Complète |

### `/fr/checkout/[eventId]` — Paiement
| Fichier | `apps/web/src/app/[locale]/checkout/[eventId]/page.tsx` | ✅ |
### `/fr/checkout/success` — Succès paiement
| Fichier | `apps/web/src/app/[locale]/checkout/success/page.tsx` | ✅ |
### `/fr/checkout/cancel` — Annulation paiement
| Fichier | `apps/web/src/app/[locale]/checkout/cancel/page.tsx` | ✅ |

---

## 4. Dashboard Organisateur

**Layout partagé :** `apps/web/src/app/[locale]/dashboard/layout.tsx`
- Sidebar de navigation avec liens : Vue d'ensemble · Mes événements · Créer un événement
- Header avec logo et avatar
- Responsive (sidebar se transforme en drawer mobile)

### `/fr/dashboard` — Vue d'ensemble
| Détail | Description |
|--------|-------------|
| **Rôle** | Tableau de bord principal de l'organisateur |
| **Fonctionnalités** | 4 KPIs (vues, favoris, billets vendus, revenus) avec badge de variation · Événements récents avec statut · Actions rapides (créer, gérer) |
| **Fichier** | `apps/web/src/app/[locale]/dashboard/page.tsx` |
| **État** | ✅ Complète |

### `/fr/dashboard/events` — Mes événements
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion de la liste des événements |
| **Fonctionnalités** | Tableau complet (Événement, Date, Statut, Vues, Prix) · Bouton Nouvel événement · Actions par événement |
| **Fichier** | `apps/web/src/app/[locale]/dashboard/events/page.tsx` |
| **État** | ✅ Complète |

### `/fr/dashboard/events/new` — Créer un événement
| Détail | Description |
|--------|-------------|
| **Rôle** | Formulaire de création d'événement |
| **Fonctionnalités** | **Étape 1** : Upload affiche, titre, description, catégorie, ville, lieu, dates · **Étape 2** : Billetterie (nom, prix, quantité, ajout multiple) · **Étape 3** : Publication maintenant ou brouillon |
| **Fichier** | `apps/web/src/app/[locale]/dashboard/events/new/page.tsx` |
| **État** | ✅ Complète |

### `/fr/dashboard/events/[id]` — Modifier un événement
| Détail | Description |
|--------|-------------|
| **Rôle** | Édition d'un événement existant |
| **Fonctionnalités** | Formulaire pré-rempli · Actions (Supprimer, Enregistrer) · Sidebar statut et actions rapides |
| **Fichier** | `apps/web/src/app/[locale]/dashboard/events/[id]/page.tsx` |
| **État** | ✅ Complète |

### `/fr/dashboard/events/[id]/checkin` — Scan QR Code (NOUVEAU)
| Détail | Description |
|--------|-------------|
| **Rôle** | Validation des billets à l'entrée de l'événement |
| **Fonctionnalités** | Scanner QR simulé · Saisie manuelle · Résultat (valide/déjà utilisé/invalide) · Liste des scans récents · Compteur de scans |
| **Fichier** | `apps/web/src/app/[locale]/dashboard/events/[id]/checkin/page.tsx` |
| **État** | ✅ Nouvelle page (+ i18n) |

### `/fr/dashboard/analytics` — Analytiques (NOUVEAU)
| Détail | Description |
|--------|-------------|
| **Rôle** | Analyse des performances des événements |
| **Fonctionnalités** | Sélecteur de période · 5 KPIs · Graphiques CSS · Ventes par événement · Top événements · Export |
| **Fichier** | `apps/web/src/app/[locale]/dashboard/analytics/page.tsx` |
| **État** | ✅ Nouvelle page (+ i18n) |

---

## 5. Dashboard Modérateur

**Layout partagé :** Pas de layout dédié

### `/fr/moderator` — Dashboard modérateur
| Fichier | `apps/web/src/app/[locale]/moderator/page.tsx` | ✅ |
### `/fr/moderator/events` — Modération des événements
| Détail | Description |
|--------|-------------|
| **Rôle** | Validation des événements en attente |
| **Fonctionnalités** | Liste des événements avec aperçu · Boutons Approuver / Refuser / Prévisualiser · Header avec badge Modération |
| **Fichier** | `apps/web/src/app/[locale]/moderator/events/page.tsx` |
| **État** | ✅ Complète |
### `/fr/moderator/events/[id]/review` — Examen d'un événement
| Fichier | `apps/web/src/app/[locale]/moderator/events/[id]/review/page.tsx` | ✅ |
### `/fr/moderator/reports` — Signalements
| Fichier | `apps/web/src/app/[locale]/moderator/reports/page.tsx` | ✅ |
### `/fr/moderator/logs` — Journal d'actions
| Fichier | `apps/web/src/app/[locale]/moderator/logs/page.tsx` | ✅ |

---

## 6. Dashboard Administrateur

**Layout partagé :** `apps/web/src/app/[locale]/admin/layout.tsx`
- Sidebar avec liens : Dashboard, Utilisateurs, Événements, Paiements, Boosts, Publicités
- Header avec logo Admin rouge

### `/fr/admin` — Dashboard Admin
| Détail | Description |
|--------|-------------|
| **Rôle** | Vue d'ensemble de la plateforme |
| **Fonctionnalités** | 4 stats (utilisateurs, événements, paiements, boosts) · Événements en attente de validation · Fil d'activité récente |
| **Fichier** | `apps/web/src/app/[locale]/admin/page.tsx` |
| **État** | ✅ Complète |

### `/fr/admin/users` — Gestion des utilisateurs
| Fichier | `apps/web/src/app/[locale]/admin/users/page.tsx` | ✅ |
### `/fr/admin/users/[id]` — Détail utilisateur
| Fichier | `apps/web/src/app/[locale]/admin/users/[id]/page.tsx` | ✅ |
### `/fr/admin/events` — Gestion des événements
| Fichier | `apps/web/src/app/[locale]/admin/events/page.tsx` | ✅ |
### `/fr/admin/events/[id]` — Détail événement admin
| Fichier | `apps/web/src/app/[locale]/admin/events/[id]/page.tsx` | ✅ |
### `/fr/admin/organizers` — Organisateurs
| Fichier | `apps/web/src/app/[locale]/admin/organizers/page.tsx` | ✅ |
### `/fr/admin/organizers/[id]` — Détail organisateur
| Fichier | `apps/web/src/app/[locale]/admin/organizers/[id]/page.tsx` | ✅ |
### `/fr/admin/payments` — Suivi des paiements
| Fichier | `apps/web/src/app/[locale]/admin/payments/page.tsx` | ✅ |
### `/fr/admin/payouts` — Retraits
| Fichier | `apps/web/src/app/[locale]/admin/payouts/page.tsx` | ✅ |
### `/fr/admin/boosts` — Gestion des boosts
| Fichier | `apps/web/src/app/[locale]/admin/boosts/page.tsx` | ✅ |
### `/fr/admin/ads` — Campagnes publicitaires
| Fichier | `apps/web/src/app/[locale]/admin/ads/page.tsx` | ✅ |
### `/fr/admin/ads/create` — Nouvelle publicité
| Fichier | `apps/web/src/app/[locale]/admin/ads/create/page.tsx` | ✅ |
### `/fr/admin/ads/[id]` — Détail publicité
| Fichier | `apps/web/src/app/[locale]/admin/ads/[id]/page.tsx` | ✅ |
### `/fr/admin/categories` — Catégories
| Fichier | `apps/web/src/app/[locale]/admin/categories/page.tsx` | ✅ |
### `/fr/admin/cities` — Villes
| Fichier | `apps/web/src/app/[locale]/admin/cities/page.tsx` | ✅ |
### `/fr/admin/universities` — Universités
| Fichier | `apps/web/src/app/[locale]/admin/universities/page.tsx` | ✅ |
### `/fr/admin/settings` — Paramètres
| Fichier | `apps/web/src/app/[locale]/admin/settings/page.tsx` | ✅ |
### `/fr/admin/audit-logs` — Journal d'audit
| Fichier | `apps/web/src/app/[locale]/admin/audit-logs/page.tsx` | ✅ |

---

## 7. Pages Système

| Route | Fichier | Statut |
|-------|---------|--------|
| `/fr/error` | `apps/web/src/app/[locale]/error/page.tsx` | ✅ |
| `/fr/maintenance` | `apps/web/src/app/[locale]/maintenance/page.tsx` | ✅ |
| `/fr/unauthorized` | `apps/web/src/app/[locale]/unauthorized/page.tsx` | ✅ |
| `/fr/unsubscribe` | `apps/web/src/app/[locale]/unsubscribe/page.tsx` | ✅ |
| `/fr/home` | `apps/web/src/app/[locale]/home/page.tsx` | ✅ |

---

## Résumé des pages

| # | Route | Page | Type | Statut |
|---|-------|------|------|--------|
| 1 | `/` | Accueil | Public | ✅ (+i18n) |
| 2 | `/explore` | Catalogue | Public | ✅ (+i18n) |
| 3 | `/event/[slug]` | Détail événement | Public | ✅ |
| 4 | `/organizer/[slug]` | Profil organisateur | Public | ✅ |
| 5 | `/search` | Recherche | Public | ✅ |
| 6 | `/about` | À propos | Public | ✅ |
| 7 | `/contact` | Contact | Public | ✅ |
| 8 | `/pricing` | Tarifs | Public | ✅ |
| 9 | `/blog` | Blog | Public | ✅ |
| 10 | `/blog/[slug]` | Article | Public | ✅ |
| 11 | `/legal/terms` | CGU | Public | ✅ |
| 12 | `/legal/privacy` | Confidentialité | Public | ✅ |
| 13 | `/legal/cookies` | Cookies | Public | ✅ |
| 14 | `/login` | Connexion | Auth | ✅ (+i18n) |
| 15 | `/register` | Inscription | Auth | ✅ |
| 16 | `/forgot-password` | Mot de passe oublié | Auth | ✅ |
| 17 | `/auth/reset-password` | Réinitialisation | Auth | ✅ |
| 18 | `/auth/verify-email` | Vérification email | Auth | ✅ |
| 19 | `/auth/verify-email/[token]` | Confirmation token | Auth | ✅ |
| 20 | `/auth/onboarding` | Onboarding | Auth | ✅ |
| 21 | `/profile` | Profil utilisateur | Privé | ✅ |
| 22 | `/profile/edit` | Édition profil | Privé | ✅ |
| 23 | `/profile/settings` | Paramètres | Privé | ✅ |
| 24 | `/profile/security` | Sécurité (mdp) | Privé | ✅ Nouveau |
| 25 | `/profile/notifications` | Préférences notif. | Privé | ✅ Nouveau |
| 26 | `/favorites` | Favoris | Privé | ✅ |
| 27 | `/tickets` | Billets | Privé | ✅ |
| 28 | `/tickets/[id]` | Détail billet | Privé | ✅ |
| 29 | `/tickets/[id]/invoice` | Facture | Privé | ✅ Nouveau |
| 30 | `/notifications` | Notifications | Privé | ✅ |
| 31 | `/checkout/[eventId]` | Paiement | Privé | ✅ |
| 32 | `/checkout/success` | Succès | Privé | ✅ |
| 33 | `/checkout/cancel` | Annulation | Privé | ✅ |
| 34 | `/dashboard` | Dashboard org. | Organisateur | ✅ |
| 35 | `/dashboard/events` | Mes événements | Organisateur | ✅ |
| 36 | `/dashboard/events/new` | Créer événement | Organisateur | ✅ |
| 37 | `/dashboard/events/[id]` | Modifier événement | Organisateur | ✅ |
| 38 | `/dashboard/events/[id]/checkin` | Scan QR code | Organisateur | ✅ Nouveau |
| 39 | `/dashboard/analytics` | Analytiques | Organisateur | ✅ Nouveau |
| 40 | `/moderator` | Dashboard modérateur | Modérateur | ✅ |
| 41 | `/moderator/events` | Modération | Modérateur | ✅ |
| 42 | `/moderator/events/[id]/review` | Examen événement | Modérateur | ✅ |
| 43 | `/moderator/reports` | Signalements | Modérateur | ✅ |
| 44 | `/moderator/logs` | Journal d'actions | Modérateur | ✅ |
| 45 | `/admin` | Dashboard admin | Admin | ✅ |
| 46 | `/admin/users` | Utilisateurs | Admin | ✅ |
| 47 | `/admin/users/[id]` | Détail utilisateur | Admin | ✅ |
| 48 | `/admin/events` | Événements admin | Admin | ✅ |
| 49 | `/admin/events/[id]` | Détail événement | Admin | ✅ |
| 50 | `/admin/organizers` | Organisateurs | Admin | ✅ |
| 51 | `/admin/organizers/[id]` | Détail organisateur | Admin | ✅ |
| 52 | `/admin/payments` | Paiements | Admin | ✅ |
| 53 | `/admin/payouts` | Retraits | Admin | ✅ |
| 54 | `/admin/boosts` | Boosts | Admin | ✅ |
| 55 | `/admin/ads` | Publicités | Admin | ✅ |
| 56 | `/admin/ads/create` | Nouvelle pub | Admin | ✅ |
| 57 | `/admin/ads/[id]` | Détail pub | Admin | ✅ |
| 58 | `/admin/categories` | Catégories | Admin | ✅ |
| 59 | `/admin/cities` | Villes | Admin | ✅ |
| 60 | `/admin/universities` | Universités | Admin | ✅ |
| 61 | `/admin/settings` | Paramètres | Admin | ✅ |
| 62 | `/admin/audit-logs` | Journal d'audit | Admin | ✅ |
| 63 | `/error` | Erreur | Système | ✅ |
| 64 | `/maintenance` | Maintenance | Système | ✅ |
| 65 | `/unauthorized` | Non autorisé | Système | ✅ |
| 66 | `/unsubscribe` | Désabonnement | Système | ✅ |
| 67 | `/home` | Accueil étudiant | Système | ✅ |

**Total : 67 pages · 67/67 complètes · 2 layouts (dashboard, admin) · i18n (fr/en)**

---

## Nouveautés (Juin 2026)

| Page | Description |
|------|-------------|
| `/profile/security` | Changement de mot de passe, sessions, 2FA |
| `/profile/notifications` | Préférences de notifications push/email |
| `/tickets/[id]/invoice` | Facture détaillée avec récapitulatif |
| `/dashboard/events/[id]/checkin` | Scan QR code pour validation billets |
| `/dashboard/analytics` | KPIs avancés et graphiques de performance |

## Composants partagés

| Composant | Fichier | Rôle |
|-----------|---------|------|
| Navbar | `components/layout/navbar.tsx` | Barre de navigation principale (+ i18n) |
| BottomNav | `components/layout/bottom-nav.tsx` | Navigation mobile 5 onglets (+ i18n) |
| Button | `components/ui/button.tsx` | Bouton (6 variants, 5 tailles) |
| Input | `components/ui/input.tsx` | Champ de formulaire |
| Badge | `components/ui/badge.tsx` | Badge (7 variants) |
| Skeleton | `components/ui/skeleton.tsx` | Loader squelettique |
| EventCard | `components/events/event-card.tsx` | Carte d'événement (3 variants, + i18n) |
| CategoryChip | `components/shared/category-chip.tsx` | Chip catégorie + grille |
| PriceBadge | `components/shared/price-badge.tsx` | Badge de prix |
| ThemeProvider | `components/providers/theme-provider.tsx` | Gestion du thème dark/light |
