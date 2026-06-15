# Error Handling — Univibes

---

# Format d'erreur standard

Toutes les erreurs de l'API retournent ce format :

```json
{
  "success": false,
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "L'événement demandé n'existe pas.",
    "statusCode": 404,
    "details": []
  }
}
```

---

# Codes d'erreur par module

## Auth

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_CREDENTIALS | 401 | Email ou mot de passe incorrect |
| EMAIL_NOT_VERIFIED | 403 | Email non vérifié |
| TOKEN_EXPIRED | 401 | Access token expiré |
| REFRESH_TOKEN_INVALID | 401 | Refresh token invalide ou révoqué |
| EMAIL_ALREADY_EXISTS | 409 | Email déjà utilisé |
| VERIFICATION_TOKEN_EXPIRED | 400 | Token de vérification expiré |
| RESET_TOKEN_INVALID | 400 | Token de réinitialisation invalide |

---

## Users / Profile

| Code | HTTP | Description |
|------|------|-------------|
| USER_NOT_FOUND | 404 | Utilisateur introuvable |
| PROFILE_NOT_FOUND | 404 | Profil introuvable |
| INVALID_FILE_TYPE | 422 | Format de fichier non accepté |
| FILE_TOO_LARGE | 422 | Fichier trop volumineux (max 5MB) |

---

## Events

| Code | HTTP | Description |
|------|------|-------------|
| EVENT_NOT_FOUND | 404 | Événement introuvable |
| EVENT_NOT_APPROVED | 403 | Événement non approuvé |
| EVENT_ALREADY_ARCHIVED | 409 | Événement déjà archivé |
| NOT_EVENT_OWNER | 403 | Pas propriétaire de l'événement |
| INVALID_EVENT_DATES | 422 | Date de fin avant date de début |

---

## Tickets / Orders

| Code | HTTP | Description |
|------|------|-------------|
| TICKET_NOT_FOUND | 404 | Ticket introuvable |
| TICKET_SOLD_OUT | 409 | Plus de billets disponibles |
| INSUFFICIENT_STOCK | 409 | Stock insuffisant pour la quantité demandée |
| ORDER_NOT_FOUND | 404 | Commande introuvable |
| ORDER_ALREADY_PAID | 409 | Commande déjà payée |

---

## Payments

| Code | HTTP | Description |
|------|------|-------------|
| PAYMENT_FAILED | 402 | Paiement échoué |
| INVALID_WEBHOOK_SIGNATURE | 401 | Signature webhook invalide |
| PAYMENT_ALREADY_PROCESSED | 409 | Webhook déjà traité (idempotence) |

---

## Permissions

| Code | HTTP | Description |
|------|------|-------------|
| UNAUTHORIZED | 401 | Non authentifié |
| FORBIDDEN | 403 | Droits insuffisants |
| ACCOUNT_BANNED | 403 | Compte suspendu |
| ORGANIZER_NOT_VERIFIED | 403 | Organisateur non vérifié |

---

## Général

| Code | HTTP | Description |
|------|------|-------------|
| VALIDATION_ERROR | 422 | Données de requête invalides |
| RATE_LIMITED | 429 | Trop de requêtes |
| INTERNAL_ERROR | 500 | Erreur serveur interne |
| NOT_FOUND | 404 | Route ou ressource introuvable |

---

# Erreur de validation (422)

Quand plusieurs champs sont invalides :

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données soumises sont invalides.",
    "statusCode": 422,
    "details": [
      { "field": "email", "message": "L'email est invalide." },
      { "field": "password", "message": "Le mot de passe doit contenir au moins 8 caractères." }
    ]
  }
}
```

---

# Implémentation NestJS

```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    response.status(status).json({
      success: false,
      error: {
        code: exceptionResponse.code || 'INTERNAL_ERROR',
        message: exceptionResponse.message || 'Une erreur est survenue.',
        statusCode: status,
        details: exceptionResponse.details || [],
      },
    });
  }
}
```

---

# Logging des erreurs

- Erreurs 5xx → Loggées dans Sentry + Winston (obligatoire)
- Erreurs 4xx → Loggées dans Winston (optionnel, selon le type)
- Erreurs de paiement → Toujours loggées, quel que soit le code HTTP
