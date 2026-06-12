# 05-API-Specification.md

# API Specification

Version 1

Base URL

/api/v1

---

# Authentication

## POST /auth/register

Créer un compte.

Request

{
"email": "[user@email.com](mailto:user@email.com)",
"password": "password"
}

Response

{
"success": true,
"userId": "uuid"
}

---

## POST /auth/login

Connexion.

Request

{
"email": "[user@email.com](mailto:user@email.com)",
"password": "password"
}

Response

{
"accessToken": "jwt",
"refreshToken": "jwt"
}

---

## POST /auth/logout

Déconnexion.

---

## POST /auth/forgot-password

Demande réinitialisation.

---

# Profile

## GET /profile

Retourne le profil connecté.

---

## PATCH /profile

Modifier le profil.

---

# Events

## GET /events

Liste paginée.

Query Params

page
limit
city
category
search

---

## GET /events/:id

Détails événement.

---

## POST /events

Créer événement.

Role :

organizer

---

## PATCH /events/:id

Modifier événement.

---

## DELETE /events/:id

Supprimer événement.

---

# Categories

## GET /categories

Liste catégories.

---

# Favorites

## POST /favorites

Ajouter favori.

---

## DELETE /favorites/:eventId

Supprimer favori.

---

## GET /favorites

Mes favoris.

---

# Organizer

## GET /organizer/dashboard

Dashboard.

Statistiques :

* vues
* favoris
* ventes

---

## GET /organizer/events

Mes événements.

---

# Tickets

## POST /tickets

Créer ticket.

---

## GET /tickets/:eventId

Tickets événement.

---

# Orders

## POST /orders

Créer commande.

---

## GET /orders

Historique.

---

# Payments

## POST /payments/initiate

Créer paiement.

---

## POST /payments/webhook

Webhook FedaPay/Kkiapay.

---

# Admin

## GET /admin/events/pending

Événements en attente.

---

## POST /admin/events/:id/approve

Valider.

---

## POST /admin/events/:id/reject

Refuser.

---

## GET /admin/users

Liste utilisateurs.

---

# Notifications

## GET /notifications

Mes notifications.

---

## PATCH /notifications/:id/read

Marquer lu.

---

# Health

## GET /health

Monitoring.
