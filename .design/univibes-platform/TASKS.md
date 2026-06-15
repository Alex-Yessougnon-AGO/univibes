# Build Tasks: Univibes Platform

Generated from: `.design/univibes-platform/DESIGN_BRIEF.md`
Palette: Terra (clay #7A4D3A · amber #C4956A · warm neutrals)
Date: Juin 2026

> **Toujours actifs pendant le build :**
> - `/full-output-enforcement` — zéro troncature
> - Palette Terra déjà appliquée dans `globals.css` (vars `--brand`, `--accent`, `--gold`)

---

## Foundation (déjà fait)

- [x] **Design brief** — `.design/univibes-platform/DESIGN_BRIEF.md`
- [x] **Design tokens** — Palette Terra dans `apps/web/src/app/globals.css`
- [x] **Composants existants** — Button, Badge, Input, Skeleton, EventCard, Navbar, BottomNav (couleurs mises à jour)

---

## Phase 1 — Pages Publiques

### Groupe 1.1 — Layout & Navigation
- [ ] **Header/Navbar responsive** — Nav desktop + mobile hamburger. Lien actif, scroll detection, glass effect. Mobile bottom nav.
- [ ] **Footer** — Liens rapides, légal, réseaux sociaux.

### Groupe 1.2 — Landing Page
- [ ] **Hero section** — Titre, sous-titre, barre recherche (ville + input), CTA, quick stats.
- [ ] **Categories grid** — Grille 2→4→8 colonnes des catégories d'événements.
- [ ] **Featured events** — Scroll horizontal, cards featured avec overlay gradient.
- [ ] **Upcoming events** — Grille 1→2→3 colonnes, cards standard.
- [ ] **Top organizers** — Cartes organisateurs avec logo, nom, stats.
- [ ] **CTA banner** — Section "Devenir organisateur" avec fond brand.
- [ ] **Footer** — Liens, logo, réseaux.

### Groupe 1.3 — Catalogue & Détail
- [ ] **Catalogue événements** — Grille/liste, filtres (catégorie, ville, date), recherche, tri.
- [ ] **Fiche événement** — Cover image, infos, description, organisateur, CTA sticky "Réserver".
- [ ] **Profil organisateur (public)** — Logo, description, liste événements de l'orga.

### Groupe 1.4 — Pages statiques
- [ ] **À propos** — Mission, équipe, vision.
- [ ] **Tarifs** — Plans gratuit/premium, comparatif.
- [ ] **Contact** — Formulaire, FAQ rapide.
- [ ] **Recherche globale** — Résultats unifiés événements + organisateurs.

---

## Phase 2 — Auth Flow

- [ ] **Inscription** — Formulaire multi-champ, validation Zod.
- [ ] **Connexion** — Email + password, lien MDP oublié.
- [ ] **Mot de passe oublié** — Email input, confirmation envoi.
- [ ] **Réinitialisation MDP** — Nouveau MDP + confirmation, token.
- [ ] **Vérification email** — Attente + renvoi.
- [ ] **Confirmation email** — Succès/erreur après clic token.
- [ ] **Onboarding** — Étapes post-inscription (rôle, université, centres d'intérêt, photo).

---

## Phase 3 — Espace Étudiant

- [ ] **Accueil étudiant** — Feed personnalisé, événements recommandés.
- [ ] **Mes Favoris** — Liste événements sauvegardés, tri.
- [ ] **Notifications** — Centre de notifications.
- [ ] **Mon Profil** — Photo, nom, téléphone, université, faculté, ville.
- [ ] **Modifier profil** — Formulaire d'édition.
- [ ] **Paramètres compte** — MDP, notifications, confidentialité, suppression.

---

## Phase 4 — Espace Organisateur

- [ ] **Dashboard orga** — KPIs : vues, favoris, billets vendus, revenus.
- [ ] **Liste événements orga** — Tableau avec statuts + actions rapides.
- [ ] **Créer événement** — Formulaire multi-étapes (infos → affiche → billets → publication).
- [ ] **Modifier événement** — Édition complète.
- [ ] **Détail événement (orga)** — Stats vues/conversions/ventes.
- [ ] **Profil organisateur** — Logo, description, réseaux.
- [ ] **Modifier profil orga** — Formulaire édition.
- [ ] **Paramètres orga** — Abonnement, paiements, notifications.

---

## Phase 5 — Billetterie (Phase 2)

- [ ] **Mes Billets** — Liste billets achetés, statuts.
- [ ] **Détail billet** — QR Code, infos événement, partage.
- [ ] **Checkout** — Sélection quantité/type → récap → paiement.
- [ ] **Confirmation achat** — QR Code, lien voir billet.
- [ ] **Annulation achat** — Message, retour catalogue.
- [ ] **Gestion billets (orga)** — Types, stock, prix.
- [ ] **Participants** — Tableau acheteurs, export CSV.

---

## Phase 6 — Modération & Admin

- [ ] **Dashboard modérateur** — File d'attente validation.
- [ ] **File de modération** — Liste événements soumis + actions.
- [ ] **Revue événement** — Infos complètes + Approuver/Rejeter.
- [ ] **Signalements** — Liste contenus signalés.
- [ ] **Détail signalement** — Actions ignorer/supprimer/avertir.
- [ ] **Journal modérateur** — Historique décisions.
- [ ] **Dashboard admin** — Vue macro utilisateurs/revenus/événements.
- [ ] **Gestion utilisateurs** — Tableau, recherche, filtres, actions.
- [ ] **Gestion organisateurs** — Liste, vérification, suspension.
- [ ] **Gestion événements (admin)** — Tableau global, actions.
- [ ] **Tous les paiements** — Transactions, revenus plateforme.
- [ ] **Retraits orga** — Demandes, approbation.
- [ ] **Revenus & Finances** — Graphiques.
- [ ] **Publicités** — CRUD campagnes.
- [ ] **Boosts** — Gestion boosts.
- [ ] **Catégories** — CRUD.
- [ ] **Universités** — CRUD.
- [ ] **Villes** — CRUD.
- [ ] **Paramètres généraux** — Config, commissions, features flags.
- [ ] **Journal d'audit** — Toutes les actions admin.

---

## Phase 7 — Pages Utilitaires

- [ ] **404** — Message clair + liens + CTA accueil.
- [ ] **500** — Erreur technique, bouton réessayer.
- [ ] **Maintenance** — Page temporaire.
- [ ] **Accès refusé** — Redirection rôle insuffisant.
- [ ] **CGU** — Conditions d'utilisation.
- [ ] **Confidentialité** — Politique données.
- [ ] **Cookies** — Gestion préférences.
- [ ] **Désabonnement** — Confirmation.

---

## Phase 8 — Phantom Build : Phase 3 (Monétisation)

- [ ] **Boosts événements** — Sélection, durée, paiement, historique.
- [ ] **Détail boost** — Statut, impressions, clics, ROI.
- [ ] **Analytics détaillés** — Graphiques audience/ventes/géo.
- [ ] **Blog** — Liste articles.
- [ ] **Article blog** — Contenu, auteur, partage.

---

## Polish & Validation (cross-phase)

- [ ] **Motion & micro-interactions** — Animations intentionnelles sur tous les composants.
- [ ] **Empty/Loading/Error states** — Skeleton, empty state, error state par composant.
- [ ] **Dark mode cohérent** — Vérifier toutes les pages.
- [ ] **Accessibilité** — WCAG 2.1 AA, navigation clavier, ARIA.
- [ ] **QA visuelle** — Design review complète.
- [ ] **UX Writing** — Microcopy de toutes les pages.
