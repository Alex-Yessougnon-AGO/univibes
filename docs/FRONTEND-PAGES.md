# Univibes — Catalogue des Pages Frontend

> Document généré le 14 Juin 2026
> Framework : Next.js 16.2.9 (App Router) · TypeScript · Tailwind CSS v4

---

## Comment lancer le frontend

```bash
# Depuis la racine du projet
cd /home/alex/Web/univibes/apps/web

# Lancer le serveur de développement sur le port 3000
npx next dev --port 3000

# Le serveur sera accessible sur :
# → http://localhost:3000
```

> **Note :** Le backend NestJS n'est pas requis pour la démo frontend. Toutes les données sont mockées (fichier `apps/web/src/lib/mock-data.ts`).

---

## 1. Pages Publiques (Accessibles sans authentification)

### `/` — Page d'accueil (Landing)
| Détail | Description |
|--------|-------------|
| **Rôle** | Première impression du produit. Conversion. |
| **Sections** | Hero avec recherche · Catégories · Événements à la une (scroll horizontal) · Événements à venir (grille) · Top organisateurs · CTA "Devenir organisateur" · Footer |
| **Fichier** | `apps/web/src/app/page.tsx` |
| **État** | ✅ Complète |

### `/explore` — Catalogue des événements
| Détail | Description |
|--------|-------------|
| **Rôle** | Découverte et recherche d'événements |
| **Fonctionnalités** | Barre de recherche · Filtres (catégorie, ville, prix gratuit/payant) · Tri (date, popularité, prix) · Vue grille/liste · Filtres sidebar desktop + drawer mobile |
| **Fichier** | `apps/web/src/app/explore/page.tsx` |
| **État** | ✅ Complète |

### `/event/[slug]` — Détail d'un événement
| Détail | Description |
|--------|-------------|
| **Rôle** | Page de conversion la plus critique. Affiche tous les détails et permet la réservation. |
| **Sections** | Cover image · Infos (date, lieu, heure) · Description · Tags · Types de billets avec prix · Profil de l'organisateur · Événements similaires · Modale d'achat avec sélecteur de quantité |
| **Spécificités** | CTA sticky "Réserver" en bas sur mobile · Modale d'achat avec sélection de billet + quantité + total |
| **Fichier** | `apps/web/src/app/event/[slug]/page.tsx` |
| **État** | ✅ Complète |

### `/organizer/[slug]` — Profil d'un organisateur
| Détail | Description |
|--------|-------------|
| **Rôle** | Page publique d'un organisateur / association étudiante |
| **Sections** | Logo · Description · Badge vérifié · Stats (abonnés, événements) · Boutons (Suivre, Site web, Instagram) · Événements à venir · Événements passés |
| **Fichier** | `apps/web/src/app/organizer/[slug]/page.tsx` |
| **État** | ✅ Complète |

---

## 2. Pages d'Authentification

### `/login` — Connexion
| Détail | Description |
|--------|-------------|
| **Rôle** | Authentification utilisateur |
| **Fonctionnalités** | Email · Mot de passe (toggle visibilité) · Lien mot de passe oublié · Lien inscription · Indicateur credentials de démo |
| **Fichier** | `apps/web/src/app/login/page.tsx` |
| **État** | ✅ Complète (mockée) |

### `/register` — Inscription
| Détail | Description |
|--------|-------------|
| **Rôle** | Création de compte |
| **Fonctionnalités** | Flow en 2 étapes avec indicateur · Étape 1 : infos perso (nom, email, téléphone, université, mot de passe) · Étape 2 : choix du rôle (Étudiant / Organisateur) |
| **Fichier** | `apps/web/src/app/register/page.tsx` |
| **État** | ✅ Complète (mockée) |

### `/forgot-password` — Mot de passe oublié
| Détail | Description |
|--------|-------------|
| **Rôle** | Réinitialisation de mot de passe |
| **Fonctionnalités** | Formulaire email · État de confirmation avec message de succès |
| **Fichier** | `apps/web/src/app/forgot-password/page.tsx` |
| **État** | ✅ Complète (mockée) |

---

## 3. Pages Privées (Espace étudiant)

### `/profile` — Profil utilisateur
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion du profil personnel |
| **Fonctionnalités** | Avatar avec initiales · Édition des champs (nom, email, téléphone, université, ville) · Menu (Mes infos, Notifications, Paramètres) · Statistiques (événements, favoris, billets) · Bouton déconnexion |
| **Fichier** | `apps/web/src/app/profile/page.tsx` |
| **État** | ✅ Complète |

### `/favorites` — Mes favoris
| Détail | Description |
|--------|-------------|
| **Rôle** | Événements sauvegardés |
| **Fonctionnalités** | Grille d'événements favoris · Bouton "Tout effacer" · État vide avec CTA "Découvrir des événements" |
| **Fichier** | `apps/web/src/app/favorites/page.tsx` |
| **État** | ✅ Complète |

### `/tickets` — Mes billets
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion des billets achetés |
| **Fonctionnalités** | Section "À venir" (billets actifs) · Section "Passés" · Modale QR code simulé pour chaque billet · État vide |
| **Fichier** | `apps/web/src/app/tickets/page.tsx` |
| **État** | ✅ Complète |

---

## 4. Dashboard Organisateur

**Layout partagé :** `apps/web/src/app/dashboard/layout.tsx`
- Sidebar de navigation avec liens : Vue d'ensemble · Mes événements · Créer un événement
- Header avec logo et avatar
- Responsive (sidebar se transforme en drawer mobile)

### `/dashboard` — Vue d'ensemble
| Détail | Description |
|--------|-------------|
| **Rôle** | Tableau de bord principal de l'organisateur |
| **Fonctionnalités** | 4 KPIs (vues, favoris, billets vendus, revenus) avec badge de variation · Événements récents avec statut · Actions rapides (créer, gérer) |
| **Fichier** | `apps/web/src/app/dashboard/page.tsx` |
| **État** | ✅ Complète |

### `/dashboard/events` — Mes événements
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion de la liste des événements |
| **Fonctionnalités** | Tableau complet avec colonnes (Événement, Date, Statut, Vues, Prix) · Bouton Nouvel événement · Actions par événément |
| **Fichier** | `apps/web/src/app/dashboard/events/page.tsx` |
| **État** | ✅ Complète |

### `/dashboard/events/new` — Créer un événement
| Détail | Description |
|--------|-------------|
| **Rôle** | Formulaire de création d'événement |
| **Fonctionnalités** | **Étape 1** : Upload affiche, titre, description, catégorie, ville, lieu, dates · **Étape 2** : Billetterie (nom, prix, quantité, ajout multiple) · **Étape 3** : Publication maintenant ou brouillon · Navigation précédent/suivant |
| **Fichier** | `apps/web/src/app/dashboard/events/new/page.tsx` |
| **État** | ✅ Complète |

### `/dashboard/events/[id]` — Modifier un événement
| Détail | Description |
|--------|-------------|
| **Rôle** | Édition d'un événement existant |
| **Fonctionnalités** | Formulaire pré-rempli · Actions (Supprimer, Enregistrer) · Sidebar statut et actions rapides (Voir sur le site, Dupliquer, Archiver) |
| **Fichier** | `apps/web/src/app/dashboard/events/[id]/page.tsx` |
| **État** | ✅ Complète |

---

## 5. Dashboard Modérateur

### `/moderator/events` — Modération des événements
| Détail | Description |
|--------|-------------|
| **Rôle** | Validation des événements en attente |
| **Fonctionnalités** | Liste des événements avec aperçu · Boutons Approuver / Refuser / Prévisualiser · Header avec badge Modération |
| **Fichier** | `apps/web/src/app/moderator/events/page.tsx` |
| **État** | ✅ Complète |

---

## 6. Dashboard Administrateur

**Layout partagé :** `apps/web/src/app/admin/layout.tsx`
- Sidebar avec liens : Dashboard, Utilisateurs, Événements, Paiements, Boosts, Publicités
- Header avec logo Admin rouge

### `/admin` — Dashboard Admin
| Détail | Description |
|--------|-------------|
| **Rôle** | Vue d'ensemble de la plateforme |
| **Fonctionnalités** | 4 stats (utilisateurs, événements, paiements, boosts) · Événements en attente de validation · Fil d'activité récente |
| **Fichier** | `apps/web/src/app/admin/page.tsx` |
| **État** | ✅ Complète |

### `/admin/users` — Gestion des utilisateurs
| Détail | Description |
|--------|-------------|
| **Rôle** | Administration des comptes utilisateurs |
| **Fonctionnalités** | Barre de recherche · Tableau (nom, email, rôle, statut, événements) · Filtrage par recherche |
| **Fichier** | `apps/web/src/app/admin/users/page.tsx` |
| **État** | ✅ Complète |

### `/admin/events` — Gestion des événements
| Détail | Description |
|--------|-------------|
| **Rôle** | Administration et validation des événements |
| **Fonctionnalités** | Tableau complet (événement, organisateur, date, statut, vues) · Boutons Approuver / Refuser |
| **Fichier** | `apps/web/src/app/admin/events/page.tsx` |
| **État** | ✅ Complète |

### `/admin/payments` — Suivi des paiements
| Détail | Description |
|--------|-------------|
| **Rôle** | Monitoring des transactions financières |
| **Fonctionnalités** | 3 KPIs (total, réussies, en attente) · Tableau des transactions (ID, client, événement, montant, méthode, statut) |
| **Fichier** | `apps/web/src/app/admin/payments/page.tsx` |
| **État** | ✅ Complète |

### `/admin/boosts` — Gestion des boosts
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion des événements sponsorisés |
| **Fonctionnalités** | 3 KPIs (boosts actifs, revenus, expirés) · Tableau (événement, organisateur, type, début, statut, coût) |
| **Fichier** | `apps/web/src/app/admin/boosts/page.tsx` |
| **État** | ✅ Complète |

### `/admin/ads` — Campagnes publicitaires
| Détail | Description |
|--------|-------------|
| **Rôle** | Gestion des publicités sur la plateforme |
| **Fonctionnalités** | Grille de cartes publicitaires · Aperçu de la bannière · Métriques (impressions, clics) · Actions (Modifier, Suspendre) · Bouton Nouvelle pub |
| **Fichier** | `apps/web/src/app/admin/ads/page.tsx` |
| **État** | ✅ Complète |

---

## Résumé des pages

| # | Route | Page | Type | Statut |
|---|-------|------|------|--------|
| 1 | `/` | Accueil | Public | ✅ |
| 2 | `/explore` | Catalogue | Public | ✅ |
| 3 | `/event/[slug]` | Détail événement | Public | ✅ |
| 4 | `/organizer/[slug]` | Profil organisateur | Public | ✅ |
| 5 | `/login` | Connexion | Auth | ✅ |
| 6 | `/register` | Inscription | Auth | ✅ |
| 7 | `/forgot-password` | Mot de passe oublié | Auth | ✅ |
| 8 | `/profile` | Profil utilisateur | Privé | ✅ |
| 9 | `/favorites` | Favoris | Privé | ✅ |
| 10 | `/tickets` | Billets | Privé | ✅ |
| 11 | `/dashboard` | Dashboard org. | Organisateur | ✅ |
| 12 | `/dashboard/events` | Mes événements | Organisateur | ✅ |
| 13 | `/dashboard/events/new` | Créer événement | Organisateur | ✅ |
| 14 | `/dashboard/events/[id]` | Modifier événement | Organisateur | ✅ |
| 15 | `/moderator/events` | Modération | Modérateur | ✅ |
| 16 | `/admin` | Dashboard admin | Admin | ✅ |
| 17 | `/admin/users` | Utilisateurs | Admin | ✅ |
| 18 | `/admin/events` | Événements admin | Admin | ✅ |
| 19 | `/admin/payments` | Paiements | Admin | ✅ |
| 20 | `/admin/boosts` | Boosts | Admin | ✅ |
| 21 | `/admin/ads` | Publicités | Admin | ✅ |

**Total : 21 pages · 4 layouts · Toutes complètes ✅**

---

## Composants partagés

| Composant | Fichier | Rôle |
|-----------|---------|------|
| Navbar | `components/layout/navbar.tsx` | Barre de navigation principale |
| BottomNav | `components/layout/bottom-nav.tsx` | Navigation mobile (5 onglets) |
| Button | `components/ui/button.tsx` | Bouton (6 variants, 5 tailles) |
| Input | `components/ui/input.tsx` | Champ de formulaire |
| Badge | `components/ui/badge.tsx` | Badge (7 variants) |
| Skeleton | `components/ui/skeleton.tsx` | Loader squelettique |
| EventCard | `components/events/event-card.tsx` | Carte d'événement (3 variants) |
| CategoryChip | `components/shared/category-chip.tsx` | Chip catégorie + grille |
| PriceBadge | `components/shared/price-badge.tsx` | Badge de prix |
| ThemeProvider | `components/providers/theme-provider.tsx` | Gestion du thème dark/light |
