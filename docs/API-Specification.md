# API Specification — Univibes

Version : 2.0
Base URL : `/api/v1`
Documentation interactive : `/api/docs` (Swagger UI)

---

# Conventions

## Headers

Tous les endpoints protégés nécessitent :

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## Format de réponse succès

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

## Format de réponse erreur

```json
{
  "success": false,
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "L'événement demandé n'existe pas.",
    "statusCode": 404
  }
}
```

## Codes d'erreur communs

| Code | HTTP | Description |
|------|------|-------------|
| UNAUTHORIZED | 401 | Token manquant ou invalide |
| FORBIDDEN | 403 | Droits insuffisants |
| NOT_FOUND | 404 | Ressource introuvable |
| VALIDATION_ERROR | 422 | Données invalides |
| RATE_LIMITED | 429 | Trop de requêtes |
| INTERNAL_ERROR | 500 | Erreur serveur |

---

# Authentication

## POST /auth/register

Créer un compte.

**Request**
```json
{
  "fullname": "Koffi Mensah",
  "email": "koffi@email.com",
  "password": "Password123!",
  "phone": "+22997000000",
  "university": "UAC",
  "city": "Cotonou"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "message": "Vérifiez votre email pour activer votre compte."
  }
}
```

---

## POST /auth/login

Connexion.

**Request**
```json
{
  "email": "koffi@email.com",
  "password": "Password123!"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "uuid-refresh-token",
    "user": {
      "id": "uuid",
      "email": "koffi@email.com",
      "role": "student",
      "fullname": "Koffi Mensah"
    }
  }
}
```

---

## POST /auth/refresh

Renouveler l'access token.

**Request**
```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "new-uuid-refresh-token"
  }
}
```

---

## POST /auth/logout

Déconnexion (révoque le refresh token).

🔒 Auth requis

**Request**
```json
{
  "refreshToken": "uuid-refresh-token"
}
```

---

## POST /auth/verify-email

Vérifier l'email après inscription.

**Request**
```json
{
  "token": "verification-token"
}
```

---

## POST /auth/forgot-password

Demander la réinitialisation de mot de passe.

**Request**
```json
{
  "email": "koffi@email.com"
}
```

---

## POST /auth/reset-password

Réinitialiser le mot de passe.

**Request**
```json
{
  "token": "reset-token",
  "password": "NewPassword123!"
}
```

---

# Profile

## GET /profile

🔒 Auth requis

Retourne le profil de l'utilisateur connecté.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullname": "Koffi Mensah",
    "email": "koffi@email.com",
    "avatarUrl": "https://res.cloudinary.com/...",
    "phone": "+22997000000",
    "city": "Cotonou",
    "university": "UAC",
    "faculty": "FAST",
    "role": "student"
  }
}
```

---

## PATCH /profile

🔒 Auth requis

Modifier le profil.

**Request**
```json
{
  "fullname": "Koffi A. Mensah",
  "phone": "+22997111111",
  "city": "Porto-Novo",
  "university": "UNSTIM",
  "faculty": "Informatique"
}
```

---

## POST /profile/avatar

🔒 Auth requis

Upload avatar. `Content-Type: multipart/form-data`

**Form Data**
```
file: <image JPG/PNG/WEBP, max 5MB>
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://res.cloudinary.com/univibes/avatars/uuid.jpg"
  }
}
```

---

# Events

## GET /events

Liste paginée des événements approuvés.

**Query Params**

| Param | Type | Description |
|-------|------|-------------|
| page | number | Page (défaut: 1) |
| limit | number | Par page (défaut: 20, max: 50) |
| city | string | Filtrer par ville |
| category | string | Slug de catégorie |
| university | string | Filtrer par université |
| search | string | Recherche texte libre |
| from | date | Date de début (ISO 8601) |
| to | date | Date de fin |
| isFree | boolean | Événements gratuits uniquement |
| sort | string | `recent`, `popular`, `upcoming` |

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Gala de l'UAC",
      "slug": "gala-uac-2026",
      "coverImage": "https://res.cloudinary.com/...",
      "city": "Cotonou",
      "location": "Salle des Fêtes UAC",
      "startDate": "2026-07-15T18:00:00Z",
      "category": { "name": "Gala", "slug": "gala" },
      "organizer": { "name": "AEUAC", "logoUrl": "..." },
      "isFree": false,
      "views": 342,
      "isFavorited": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 85
  }
}
```

---

## GET /events/:id

Détails d'un événement.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Gala de l'UAC",
    "slug": "gala-uac-2026",
    "description": "Le gala annuel...",
    "coverImage": "https://...",
    "city": "Cotonou",
    "location": "Salle des Fêtes UAC",
    "latitude": 6.3702,
    "longitude": 2.3912,
    "startDate": "2026-07-15T18:00:00Z",
    "endDate": "2026-07-15T23:00:00Z",
    "status": "approved",
    "views": 342,
    "isFree": false,
    "category": { "id": "uuid", "name": "Gala", "slug": "gala" },
    "organizer": {
      "id": "uuid",
      "name": "AEUAC",
      "logoUrl": "https://...",
      "verified": true
    },
    "tickets": [
      {
        "id": "uuid",
        "name": "VIP",
        "price": 5000,
        "remaining": 48
      }
    ],
    "isFavorited": false,
    "isBosted": true
  }
}
```

---

## POST /events

🔒 Auth requis (role: organizer)

Créer un événement.

**Request**
```json
{
  "title": "Concert Jazz UAC",
  "description": "Une soirée jazz...",
  "categoryId": "uuid",
  "location": "Amphithéâtre UAC",
  "city": "Cotonou",
  "latitude": 6.3702,
  "longitude": 2.3912,
  "startDate": "2026-08-01T19:00:00Z",
  "endDate": "2026-08-01T22:00:00Z",
  "isFree": false
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "concert-jazz-uac-2026",
    "status": "pending"
  }
}
```

---

## PATCH /events/:id

🔒 Auth requis (role: organizer, owner)

Modifier un événement.

---

## DELETE /events/:id

🔒 Auth requis (role: organizer, owner)

Supprimer un événement.

---

## POST /events/:id/cover

🔒 Auth requis (role: organizer, owner)

Upload affiche événement. `Content-Type: multipart/form-data`

---

# Categories

## GET /categories

Liste toutes les catégories.

**Response 200**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Concert", "slug": "concert", "icon": "🎵" },
    { "id": "uuid", "name": "Gala", "slug": "gala", "icon": "🎉" },
    { "id": "uuid", "name": "Conférence", "slug": "conference", "icon": "🎤" },
    { "id": "uuid", "name": "Sport", "slug": "sport", "icon": "⚽" }
  ]
}
```

---

# Favorites

## POST /favorites

🔒 Auth requis

Ajouter aux favoris.

**Request**
```json
{ "eventId": "uuid" }
```

---

## DELETE /favorites/:eventId

🔒 Auth requis

Supprimer des favoris.

---

## GET /favorites

🔒 Auth requis

Mes favoris (liste d'événements).

---

# Organizer

## POST /organizers

🔒 Auth requis (role: student → devient organizer)

Créer un profil organisateur.

**Request**
```json
{
  "organizationName": "AEUAC",
  "description": "Association des étudiants de l'UAC",
  "instagramUrl": "https://instagram.com/aeuac"
}
```

---

## GET /organizer/dashboard

🔒 Auth requis (role: organizer)

Statistiques dashboard.

**Response 200**
```json
{
  "success": true,
  "data": {
    "totalViews": 1250,
    "totalFavorites": 89,
    "totalTicketsSold": 234,
    "totalRevenue": 1170000,
    "events": {
      "total": 12,
      "approved": 8,
      "pending": 3,
      "archived": 1
    },
    "recentActivity": [...]
  }
}
```

---

## GET /organizer/events

🔒 Auth requis (role: organizer)

Mes événements avec statistiques.

---

# Tickets

## POST /tickets

🔒 Auth requis (role: organizer)

Créer un type de billet pour un événement.

**Request**
```json
{
  "eventId": "uuid",
  "name": "VIP",
  "description": "Accès VIP avec repas",
  "price": 5000,
  "quantity": 100
}
```

---

## GET /tickets/:eventId

Billets disponibles pour un événement.

---

# Orders

## POST /orders

🔒 Auth requis

Créer une commande.

**Request**
```json
{
  "eventId": "uuid",
  "items": [
    { "ticketId": "uuid", "quantity": 2 }
  ]
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "amount": 10000,
    "status": "pending"
  }
}
```

---

## GET /orders

🔒 Auth requis

Historique des commandes.

---

## GET /orders/:id

🔒 Auth requis

Détails d'une commande avec billets générés.

---

# Payments

## POST /payments/initiate

🔒 Auth requis

Initier un paiement pour une commande.

**Request**
```json
{
  "orderId": "uuid",
  "provider": "fedapay",
  "callbackUrl": "https://univibes.com/payment/callback"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "paymentUrl": "https://checkout.fedapay.com/...",
    "reference": "FP-2026-001"
  }
}
```

---

## POST /payments/webhook

Webhook FedaPay / Kkiapay.

Vérification HMAC signature obligatoire.

---

# Notifications

## GET /notifications

🔒 Auth requis

Mes notifications.

**Query Params**
- `unread=true` : Uniquement non lues

---

## PATCH /notifications/:id/read

🔒 Auth requis

Marquer comme lue.

---

## PATCH /notifications/read-all

🔒 Auth requis

Tout marquer comme lu.

---

# Boosts

## POST /boosts

🔒 Auth requis (role: organizer)

Créer un boost pour un événement.

**Request**
```json
{
  "eventId": "uuid",
  "boostType": "72h"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "boostId": "uuid",
    "amount": 5000,
    "paymentUrl": "https://checkout.fedapay.com/..."
  }
}
```

---

## GET /boosts/active

Événements actuellement boostés.

---

# Ads

## GET /ads/active

Publicités actives pour une ville.

**Query Params**
- `city` : Ville ciblée

---

# Admin

## GET /admin/events/pending

🔒 Auth requis (role: moderator, admin)

Événements en attente de validation.

---

## POST /admin/events/:id/approve

🔒 Auth requis (role: moderator, admin)

Valider un événement.

---

## POST /admin/events/:id/reject

🔒 Auth requis (role: moderator, admin)

Refuser un événement.

**Request**
```json
{ "reason": "Contenu inapproprié" }
```

---

## GET /admin/users

🔒 Auth requis (role: admin)

Liste des utilisateurs avec pagination.

---

## PATCH /admin/users/:id/ban

🔒 Auth requis (role: admin)

Bannir un utilisateur.

---

## GET /admin/payments

🔒 Auth requis (role: admin)

Toutes les transactions.

---

## GET /admin/analytics

🔒 Auth requis (role: admin)

Statistiques globales de la plateforme.

**Response**
```json
{
  "success": true,
  "data": {
    "users": { "total": 1250, "newThisMonth": 89 },
    "events": { "total": 340, "approved": 290 },
    "revenue": { "total": 2500000, "thisMonth": 450000 },
    "ticketsSold": { "total": 5420 }
  }
}
```

---

# Health

## GET /health

Monitoring et statut de l'API.

**Response 200**
```json
{
  "status": "ok",
  "version": "2.0.0",
  "timestamp": "2026-06-12T10:00:00Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "cloudinary": "ok"
  }
}
```
