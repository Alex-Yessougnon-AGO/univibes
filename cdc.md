# CAHIER DES CHARGES OFFICIEL – UNIVIBES

Version : 1.0

Date : Juin 2026

Statut : Pré-développement

---

# 1. PRÉSENTATION DU PROJET

## Nom du projet

Univibes

## Slogan

The Hub of Student Life

## Type de projet

Plateforme web et mobile de découverte, promotion et gestion des événements universitaires.

## Contexte

Les étudiants découvrent aujourd'hui les événements universitaires via plusieurs canaux :

* WhatsApp
* Telegram
* Facebook
* Instagram
* TikTok
* Affiches physiques

Les informations sont dispersées, difficiles à retrouver et souvent perdues.

Univibes a pour objectif de centraliser toute la vie événementielle étudiante sur une seule plateforme.

---

# 2. OBJECTIFS DU PROJET

## Objectif Principal

Permettre aux étudiants de découvrir facilement les événements, activités et opportunités disponibles sur leur campus ou dans leur ville.

## Objectifs Secondaires

* Augmenter la visibilité des événements.
* Faciliter la communication entre organisateurs et étudiants.
* Digitaliser la gestion des événements.
* Offrir une solution de billetterie moderne.
* Créer un écosystème étudiant connecté.

---

# 3. UTILISATEURS CIBLES

## Étudiants

Fonctions :

* Recherche d'événements
* Réservation de billets
* Gestion favoris
* Réception notifications

---

## Organisateurs

Fonctions :

* Création événements
* Gestion événements
* Vente billets
* Consultation statistiques

---

## Modérateurs

Fonctions :

* Validation événements
* Contrôle qualité contenu

---

## Administrateurs

Fonctions :

* Gestion plateforme
* Gestion utilisateurs
* Gestion revenus
* Gestion publicités

---

# 4. PÉRIMÈTRE DU MVP

## Authentification

Fonctionnalités :

* Inscription
* Connexion
* Déconnexion
* Réinitialisation mot de passe
* Vérification email

---

## Gestion de Profil

Informations :

* Nom complet
* Photo
* Téléphone
* Université
* Faculté
* Ville

---

## Gestion des Événements

Créer événement

Modifier événement

Supprimer événement

Archiver événement

---

Informations d'un événement :

* Titre
* Description
* Affiche
* Catégorie
* Lieu
* Ville
* Date
* Heure
* Organisateur

---

## Catalogue d'Événements

Recherche

Filtres :

* Ville
* Université
* Catégorie
* Date

Tri :

* Plus récents
* Plus populaires
* Plus proches

---

## Favoris

Ajouter favori

Supprimer favori

Liste favoris

---

## Tableau de Bord Organisateur

KPIs :

* Nombre de vues
* Nombre de favoris
* Billets vendus
* Revenus générés

---

## Tableau de Bord Administrateur

Gestion :

* Utilisateurs
* Organisateurs
* Événements
* Publicités
* Paiements

---

# 5. BILLETTERIE (PHASE 2)

Fonctionnalités :

* Création billets
* Gestion stock billets
* Achat billet
* QR Code unique
* Contrôle d'accès

---

# 6. PAIEMENTS (PHASE 2)

Solutions :

* FedaPay
* Kkiapay

Moyens :

* Mobile Money
* Cartes bancaires

---

# 7. NOTIFICATIONS

Canaux :

* Email
* Notifications Push

Événements :

* Nouveau billet
* Confirmation paiement
* Rappel événement
* Modification événement

---

# 8. MONÉTISATION

## Boost d'Événements

Options :

* 24 heures
* 72 heures
* 7 jours

---

## Publicités

Formats :

* Bannière
* Événement sponsorisé

---

## Abonnements Organisateurs

Fonctionnalités Premium :

* Statistiques avancées
* Boosts inclus
* Priorité support

---

# 9. EXIGENCES TECHNIQUES

## Frontend

* Next.js
* TypeScript
* TailwindCSS
* Shadcn UI

---

## Backend

* Supabase

Services :

* Auth
* PostgreSQL
* Storage
* Realtime

---

## Hébergement

Frontend :

Vercel

Backend :

Supabase Cloud

---

# 10. BASE DE DONNÉES

Tables principales :

* profiles
* organizers
* events
* event_categories
* tickets
* orders
* payments
* favorites
* notifications
* boosts
* ads
* audit_logs

---

# 11. SÉCURITÉ

Mesures :

* HTTPS obligatoire
* JWT
* Vérification email
* Rate Limiting
* Row Level Security
* Journalisation actions
* Sauvegardes automatiques

---

# 12. PERFORMANCE

Objectifs :

Temps de chargement :

< 2 secondes

Disponibilité :

99.9 %

Responsive :

Mobile
Tablette
Desktop

---

# 13. DESIGN

Style :

* Moderne
* Étudiant
* Premium
* Mobile First

Couleurs :

Vert principal

Or secondaire

Blanc

Gris clair

Police :

Inter

---

# 14. ROADMAP

Phase 1 :

MVP

* Auth
* Profils
* Événements
* Favoris
* Dashboard

---

Phase 2 :

* Billetterie
* Paiements
* Notifications

---

Phase 3 :

* Publicités
* Boosts
* Analytics avancées

---

Phase 4 :

* Application Flutter
* Assistant IA
* Marketplace étudiante

---

# 15. INDICATEURS DE SUCCÈS

3 mois :

* 1 000 utilisateurs
* 100 événements

6 mois :

* 5 000 utilisateurs
* 500 événements

12 mois :

* 20 000 utilisateurs
* 5 000 événements
* Rentabilité atteinte

---

# 16. LIVRABLE FINAL

Plateforme Univibes permettant :

* Découverte d'événements universitaires
* Publication d'événements
* Gestion des organisateurs
* Billetterie numérique
* Paiements en ligne
* Monétisation par publicité et boosts

avec une architecture moderne, évolutive et prête à être déployée à grande échelle dans les universités africaines.
