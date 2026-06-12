# PRD – Plateforme de Centralisation et Promotion des Événements Universitaires

Version : 2.0

Statut : Pré-Alpha

Date : Juin 2026

---

# 1. Vision Produit

## Nom du projet

Nom provisoire : Campus Events

Le nom définitif sera déterminé avant le lancement public.

---

## Mission

Créer la plateforme numérique de référence permettant aux étudiants de découvrir, suivre et participer à tous les événements universitaires d'une région depuis un seul endroit.

---

## Vision Long Terme

Devenir l'infrastructure numérique des communautés étudiantes en Afrique francophone.

À terme, la plateforme devra permettre :

* Découverte d'événements
* Billetterie
* Réseautage étudiant
* Promotion associative
* Publicité ciblée
* Marketplace de services étudiants
* Gestion complète d'associations étudiantes

---

# 2. Problème

Aujourd'hui les événements étudiants sont diffusés sur :

* WhatsApp
* Telegram
* Instagram
* Facebook
* Affiches physiques

Les informations sont dispersées.

Conséquences :

* Faible visibilité
* Faible participation
* Difficulté de promotion
* Difficulté de monétisation
* Absence de statistiques fiables

---

# 3. Objectifs Business

## Court terme

* 100 événements publiés
* 10 associations partenaires
* 1 000 étudiants inscrits

## Moyen terme

* 10 000 étudiants
* 100 organisateurs actifs
* Billetterie opérationnelle

## Long terme

* Couverture nationale
* Expansion régionale
* Plateforme rentable

---

# 4. Utilisateurs

## Étudiant

Objectifs :

* Trouver des événements
* Acheter des billets
* Recevoir des notifications

---

## Organisateur

Objectifs :

* Publier des événements
* Vendre des billets
* Obtenir de la visibilité

---

## Administrateur

Objectifs :

* Modérer
* Superviser
* Gérer les revenus

---

## Annonceur

Objectifs :

* Acheter de la visibilité
* Cibler les étudiants

---

# 5. MVP V1

## Authentification

Fonctionnalités :

* Inscription email
* Connexion
* Réinitialisation mot de passe
* Vérification email

---

## Gestion Profil

Informations :

* Nom
* Photo
* Université
* Faculté
* Ville

---

## Catalogue Événements

Fonctionnalités :

* Liste des événements
* Recherche
* Filtres
* Tri
* Pagination

Filtres :

* Date
* Ville
* Université
* Catégorie

---

## Détails Événement

Informations :

* Affiche
* Description
* Organisateur
* Lieu
* Date
* Heure

Actions :

* Ajouter aux favoris
* Partager

---

## Tableau de Bord Organisateur

Fonctionnalités :

* Créer un événement
* Modifier un événement
* Supprimer un événement
* Voir les statistiques

---

## Tableau de Bord Admin

Fonctionnalités :

* Valider événement
* Suspendre événement
* Gérer utilisateurs
* Gérer organisateurs

---

# 6. V2

## Billetterie

Fonctionnalités :

* Création de tickets
* QR Code
* Contrôle d'accès
* Historique achats

---

## Paiement

Méthodes :

* Mobile Money
* Carte bancaire

Passerelles :

* Kkiapay
* FedaPay

---

## Notifications

Canaux :

* Email
* Push
* SMS (optionnel)

---

## Géolocalisation

Fonctionnalités :

* Carte interactive
* Événements proches

---

# 7. V3

## Monétisation

### Boost

Mise en avant d'événement

Options :

* 24h
* 72h
* 7 jours

---

### Publicité

Formats :

* Bannière
* Article sponsorisé
* Événement sponsorisé

---

### Abonnement Premium Organisateur

Fonctionnalités :

* Statistiques avancées
* Événements illimités
* Boost mensuel inclus

---

# 8. Architecture Technique

## Frontend

Technologies :

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn/UI

---

## Backend

Phase 1 :

* Supabase

Services :

* Auth
* PostgreSQL
* Storage
* Realtime

---

Phase 2 :

* NestJS
* PostgreSQL
* Redis

---

# 9. Base de Données

## users

* id
* email
* created_at

## profiles

* id
* user_id
* fullname
* avatar
* university

## organizers

* id
* user_id
* organization_name
* verified

## events

* id
* title
* description
* location
* city
* category
* start_date
* end_date

## tickets

* id
* event_id
* price
* quantity

## orders

* id
* user_id
* event_id
* amount

## payments

* id
* order_id
* status

## favorites

* id
* user_id
* event_id

## boosts

* id
* event_id
* start_date
* end_date

## ads

* id
* advertiser
* banner_url

---

# 10. Sécurité

Mesures :

* HTTPS obligatoire
* Vérification email
* Rate limiting
* Protection anti-spam
* Protection XSS
* Protection CSRF
* Sauvegardes automatiques
* Journalisation des actions

---

# 11. Analytics

Indicateurs :

* Nombre d'utilisateurs
* Nombre d'événements
* Nombre de vues
* Nombre de favoris
* Nombre de billets vendus
* Revenus
* Taux de conversion

---

# 12. Déploiement

## Développement

GitHub

Branches :

* main
* staging
* develop

---

## Hébergement

Frontend :

* Vercel

Backend :

* Supabase Cloud

Stockage :

* Supabase Storage

---

# 13. Roadmap

## Phase 0

* Recherche marché
* Maquettes
* Branding

Durée : 2 semaines

---

## Phase 1

* Authentification
* Gestion événements
* Dashboard

Durée : 6 semaines

---

## Phase 2

* Alpha privée

Durée : 2 semaines

---

## Phase 3

* Billetterie
* Paiements

Durée : 4 semaines

---

## Phase 4

* Monétisation

Durée : 4 semaines

---

# 14. KPIs

Après 12 mois :

* 20 000 utilisateurs
* 500 organisateurs
* 5 000 événements
* 50 000 billets vendus
* Rentabilité opérationnelle
