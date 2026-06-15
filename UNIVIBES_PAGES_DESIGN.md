# UNIVIBES — PAGES & DIRECTION ARTISTIQUE
**Version :** 1.0 · Juin 2026  
**Statut :** Pré-développement  
**Stack Frontend :** Next.js · TypeScript · TailwindCSS · Shadcn UI

---

## TABLE DES MATIÈRES

1. [Inventaire Complet des Pages](#1-inventaire-complet-des-pages)
   - Public / Non connecté
   - Étudiant
   - Organisateur
   - Modérateur
   - Administrateur
   - Partagées / Utilitaires
2. [Direction Artistique](#2-direction-artistique)
   - Identité visuelle
   - Palette de couleurs
   - Typographie
   - Iconographie & Illustrations
   - Composants & Motifs
   - Ton & Voix

---

# 1. INVENTAIRE COMPLET DES PAGES

> **Conventions de nommage**
> - `[PUBLIC]` = visible sans connexion
> - `[ÉTUDIANT]` = espace étudiant connecté
> - `[ORGA]` = espace organisateur
> - `[MOD]` = espace modérateur
> - `[ADMIN]` = espace administrateur
> - `[SHARED]` = page partagée entre plusieurs rôles

---

## 🌐 PAGES PUBLIQUES (non connecté)

Ces pages sont accessibles à tout visiteur, y compris les moteurs de recherche.

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 01 | `/` | **Landing Page** | Hero, valeur proposition, catégories phares, événements à la une, CTA inscription |
| 02 | `/events` | **Catalogue d'événements** | Grille/liste de tous les événements publics, filtres, recherche, tri |
| 03 | `/events/[slug]` | **Détail d'un événement** | Affiche, description, lieu, date, organisateur, bouton favori / achat billet |
| 04 | `/organizers/[slug]` | **Profil public d'un organisateur** | Nom, logo, description, liste de ses événements publiés |
| 05 | `/about` | **À propos** | Mission, équipe, vision, valeurs Univibes |
| 06 | `/pricing` | **Tarifs organisateurs** | Plans gratuit, premium, comparatif fonctionnalités |
| 07 | `/contact` | **Contact** | Formulaire de contact, FAQ rapide, liens réseaux sociaux |
| 08 | `/blog` | **Blog / Actualités** | Articles, annonces, conseils organisateurs *(Phase 3+)* |
| 09 | `/blog/[slug]` | **Article de blog** | Contenu d'un article, auteur, partage |
| 10 | `/search` | **Recherche globale** | Résultats unifiés : événements + organisateurs + catégories |

---

## 🔐 AUTHENTIFICATION [PUBLIC]

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 11 | `/auth/register` | **Inscription** | Formulaire : nom, email, mot de passe, université, ville |
| 12 | `/auth/login` | **Connexion** | Email + mot de passe, lien "mot de passe oublié", OAuth optionnel |
| 13 | `/auth/forgot-password` | **Mot de passe oublié** | Saisie de l'email, envoi lien de réinitialisation |
| 14 | `/auth/reset-password` | **Réinitialisation MDP** | Nouveau mot de passe + confirmation via token email |
| 15 | `/auth/verify-email` | **Vérification email** | Page d'attente + bouton renvoi du mail de vérification |
| 16 | `/auth/verify-email/[token]` | **Confirmation email** | Page de succès ou d'erreur après clic sur le lien email |
| 17 | `/auth/onboarding` | **Onboarding** | Étapes post-inscription : rôle, université, centres d'intérêt, photo |

---

## 🎓 ESPACE ÉTUDIANT [ÉTUDIANT]

### Découverte & Favoris

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 18 | `/home` | **Accueil étudiant** | Feed personnalisé : événements recommandés, proches, tendances |
| 19 | `/favorites` | **Mes Favoris** | Liste des événements sauvegardés, tri par date |
| 20 | `/notifications` | **Notifications** | Centre de toutes les notifications (billets, rappels, modif.) |

### Billetterie Étudiant *(Phase 2)*

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 21 | `/tickets` | **Mes Billets** | Liste des billets achetés, statuts (à venir / passé) |
| 22 | `/tickets/[id]` | **Détail d'un billet** | QR Code, infos événement, bouton partage |
| 23 | `/checkout/[eventId]` | **Achat de billet** | Sélection quantité/type, récap commande, choix paiement |
| 24 | `/checkout/success` | **Confirmation d'achat** | Message succès, QR Code, bouton "Voir mon billet" |
| 25 | `/checkout/cancel` | **Annulation d'achat** | Message d'annulation, retour au catalogue |

### Profil Étudiant

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 26 | `/profile` | **Mon Profil** | Infos personnelles : photo, nom, téléphone, université, faculté, ville |
| 27 | `/profile/edit` | **Modifier le profil** | Formulaire d'édition des informations personnelles |
| 28 | `/profile/settings` | **Paramètres du compte** | Mot de passe, notifications, confidentialité, suppression compte |

---

## 📋 ESPACE ORGANISATEUR [ORGA]

### Dashboard

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 29 | `/organizer` | **Dashboard Organisateur** | KPIs : vues, favoris, billets vendus, revenus, événements actifs |
| 30 | `/organizer/analytics` | **Analytics détaillés** | Graphiques : audience, ventes dans le temps, géographie *(Premium)* |

### Gestion des Événements

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 31 | `/organizer/events` | **Liste de mes événements** | Tableau : draft, publié, archivé, annulé — avec actions rapides |
| 32 | `/organizer/events/create` | **Créer un événement** | Formulaire multi-étapes : info → affiche → billets → publication |
| 33 | `/organizer/events/[id]/edit` | **Modifier un événement** | Édition complète d'un événement existant |
| 34 | `/organizer/events/[id]` | **Détail événement (orga)** | Stats spécifiques : vues, conversions, ventes par type de billet |
| 35 | `/organizer/events/[id]/tickets` | **Gestion des billets** | Types de billets, stock, prix, activation/désactivation *(Phase 2)* |
| 36 | `/organizer/events/[id]/attendees` | **Liste des participants** | Tableau des acheteurs, export CSV, scan QR *(Phase 2)* |

### Boosts & Publicités

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 37 | `/organizer/boosts` | **Boosts d'événements** | Sélection événement, durée (24h/72h/7j), paiement, historique |
| 38 | `/organizer/boosts/[id]` | **Détail d'un boost** | Statut, impressions, clics, ROI estimé |

### Finance & Paiements

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 39 | `/organizer/payouts` | **Mes Revenus** | Tableau des revenus, solde disponible, historique retraits *(Phase 2)* |
| 40 | `/organizer/payouts/request` | **Demander un retrait** | Montant, méthode (Mobile Money / bancaire), confirmation |

### Profil Organisateur

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 41 | `/organizer/profile` | **Profil Organisateur** | Logo, nom orga, description, réseaux, coordonnées |
| 42 | `/organizer/profile/edit` | **Modifier profil orga** | Formulaire d'édition du profil public de l'organisateur |
| 43 | `/organizer/settings` | **Paramètres organisateur** | Abonnement, moyens de paiement, notifications, compte |
| 44 | `/organizer/upgrade` | **Passer en Premium** | Avantages, comparatif plans, CTA paiement abonnement |

---

## 🛡️ ESPACE MODÉRATEUR [MOD]

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 45 | `/moderator` | **Dashboard Modérateur** | File d'attente des événements en attente de validation |
| 46 | `/moderator/events` | **File de modération** | Liste événements soumis : en attente, approuvés, rejetés |
| 47 | `/moderator/events/[id]/review` | **Revue d'un événement** | Affiche, infos complètes, actions : Approuver / Rejeter + motif |
| 48 | `/moderator/reports` | **Signalements** | Liste des contenus signalés par les utilisateurs, actions |
| 49 | `/moderator/reports/[id]` | **Détail d'un signalement** | Contenu signalé, signalant, actions : ignorer / supprimer / avertir |
| 50 | `/moderator/logs` | **Journal des actions** | Historique de toutes les décisions du modérateur |

---

## ⚙️ ESPACE ADMINISTRATEUR [ADMIN]

### Dashboard Général

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 51 | `/admin` | **Dashboard Admin** | Vue macro : utilisateurs, revenus, événements, activité temps réel |

### Gestion Utilisateurs

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 52 | `/admin/users` | **Tous les utilisateurs** | Tableau paginé, recherche, filtres par rôle/statut |
| 53 | `/admin/users/[id]` | **Profil d'un utilisateur** | Détails complets, historique, actions : suspendre / bannir / promouvoir |
| 54 | `/admin/organizers` | **Tous les organisateurs** | Liste, statut (vérifié / suspendu), revenus générés |
| 55 | `/admin/organizers/[id]` | **Profil d'un organisateur** | Détails, événements, revenus, actions admin |

### Gestion des Événements

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 56 | `/admin/events` | **Tous les événements** | Tableau global, filtres statut, actions rapides |
| 57 | `/admin/events/[id]` | **Détail événement (admin)** | Vue complète + actions : mettre en avant, archiver, supprimer |

### Finance & Paiements

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 58 | `/admin/payments` | **Tous les paiements** | Tableau des transactions, revenus plateforme, exports |
| 59 | `/admin/payments/[id]` | **Détail d'une transaction** | Infos complètes : montant, acheteur, événement, statut, logs |
| 60 | `/admin/payouts` | **Retraits organisateurs** | Demandes en attente, approuvées, refusées, actions |
| 61 | `/admin/revenue` | **Revenus & Finances** | Graphiques : revenus par période, commissions, abonnements, boosts |

### Publicités & Boosts

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 62 | `/admin/ads` | **Gestion publicités** | Liste des campagnes pub : bannières, événements sponsorisés |
| 63 | `/admin/ads/create` | **Créer une publicité** | Format, ciblage, dates, budget, visuel |
| 64 | `/admin/ads/[id]` | **Détail d'une publicité** | Impressions, clics, CTR, performances |
| 65 | `/admin/boosts` | **Gestion des boosts** | Tous les boosts actifs, historique, revenus générés |

### Configuration Plateforme

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 66 | `/admin/categories` | **Catégories d'événements** | CRUD des catégories (BDE, Concert, Sport, Conférence…) |
| 67 | `/admin/universities` | **Universités** | CRUD de la liste des universités référencées |
| 68 | `/admin/cities` | **Villes** | CRUD des villes disponibles sur la plateforme |
| 69 | `/admin/settings` | **Paramètres généraux** | Config globale : commissions, limites, features flags |
| 70 | `/admin/audit-logs` | **Journal d'audit** | Toutes les actions admin/mod sur la plateforme |

---

## 🔧 PAGES PARTAGÉES & UTILITAIRES [SHARED]

| # | Route | Nom de la page | Description |
|---|-------|----------------|-------------|
| 71 | `/404` | **Page introuvable** | Message clair + liens utiles + CTA retour accueil |
| 72 | `/500` | **Erreur serveur** | Message d'erreur technique, bouton réessayer |
| 73 | `/maintenance` | **Maintenance** | Page temporaire pendant les mises à jour |
| 74 | `/unauthorized` | **Accès refusé** | Redirection si rôle insuffisant |
| 75 | `/legal/terms` | **Conditions d'utilisation** | CGU complètes de la plateforme |
| 76 | `/legal/privacy` | **Politique de confidentialité** | Règles de traitement des données personnelles |
| 77 | `/legal/cookies` | **Politique de cookies** | Gestion des cookies, préférences |
| 78 | `/unsubscribe` | **Désabonnement emails** | Confirmation désabonnement des notifications email |

---

## 📊 RÉCAPITULATIF PAR PHASE

| Phase | Pages concernées | Total |
|-------|-----------------|-------|
| **Phase 1 — MVP** | Auth (01–17), Étudiant base (18–20, 26–28), Orga base (29, 31–35, 41–43), Modérateur (45–50), Admin base (51–57, 66–70), Utilitaires (71–78) | ~45 pages |
| **Phase 2 — Billetterie & Paiements** | Billetterie (21–25), Orga billets (36, 39–40), Admin paiements (58–61) | +10 pages |
| **Phase 3 — Monétisation** | Boosts (37–38, 62–65), Analytics (30), Blog (08–09) | +8 pages |
| **Phase 4 — Expansion** | Application Flutter (pages natives) | + TBD |
| **TOTAL** | **78 pages web recensées** | |

---
