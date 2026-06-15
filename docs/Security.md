# Security Specification

## Roles

### student

Permissions :

* consulter événements
* favoris
* achats

---

### organizer

Permissions :

* créer événements
* modifier ses événements
* consulter statistiques

---

### moderator

Permissions :

* valider événements
* suspendre événements

---

### admin

Permissions :

* accès total

---

# Authentification

Méthode :

JWT

Access Token :

15 min

Refresh Token :

30 jours (stocké en base, rotation à chaque usage)

Hashage :

bcrypt (rounds: 12)

---

# Protection API

Rate Limiting

100 requêtes / minute

Par IP

Librairie : @nestjs/throttler + Redis store

---

# Anti Spam

Limiter :

* création événements (max 5/jour par organisateur)
* création comptes (max 3 par IP/heure)
* envoi email (max 5/heure par utilisateur)

---

# Validation

Tous les inputs validés avec class-validator (côté API).

Tous les formulaires validés avec Zod (côté frontend).

---

# Uploads

Formats acceptés :

jpg, png, webp

Taille max :

5 MB

Vérification MIME type côté serveur.

Stockage : Cloudinary (pas de fichiers sur le serveur).

---

# CORS

Origines autorisées :

* https://univibes.com
* https://admin.univibes.com
* http://localhost:3000 (dev uniquement)

---

# Journalisation

Logs obligatoires (via AuditService) :

* login (succès + échec)
* paiements (initiation + webhook)
* validation événement
* suppression événement
* changement de rôle utilisateur
* erreurs 5xx

Tous les logs d'audit sont persistés en base via le modèle `AuditLog` et le service `AuditService` (injectable global).

---

# Paiements

Ne jamais faire confiance au frontend.

Toujours :

* vérifier signature webhook (HMAC)
* vérifier montant côté serveur
* vérifier statut paiement avant génération billet
* idempotence webhook (ignorer doublons)

---

# Sauvegardes

Database :

quotidienne

Rétention :

30 jours

---

# Monitoring

## Outils

| Outil | Usage | Statut |
|-------|-------|--------|
| Sentry | Erreurs frontend + backend | ✅ Configuré (DSN requis) |
| Winston | Logs structurés (console + fichiers rotatifs) | ✅ Configuré |
| Prisma Query Logs | Logs de requêtes (dev uniquement) | ✅ Actif |
| Health Check | `GET /api/v1/health` (DB + Redis) | ✅ Actif |
| AuditLog | Traçabilité des actions critiques en base | ✅ Configuré |
| Uptime Robot | Disponibilité externe | 🔲 À configurer |

## Sentry

- **API**: initialisé dans `main.ts` via `@sentry/node`. Filtre global capturant les exceptions 5xx.
- **Web**: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`. Error boundary `global-error.tsx`.
- **Variables d'environnement** : `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_TRACES_SAMPLE_RATE`.

## Winston

- Transport **console** (couleurs en dev, JSON-like en prod)
- Transport **fichier** `logs/error.log` (level: error, rotation 10×10MB)
- Transport **fichier** `logs/combined.log` (tous niveaux, rotation 5×10MB)
- Format: timestamp, stack traces, namespace NestJS

## Health check

`GET /api/v1/health` → statut DB + Redis + version + timestamp.
Le endpoint est accessible sans authentification.

---

# Gestion des incidents

Niveaux

P1 : paiement cassé → intervention immédiate

P2 : création événement impossible → < 2h

P3 : bug mineur → prochain sprint

---

# RGPD Local

L'utilisateur doit pouvoir :

* télécharger ses données
* supprimer son compte

---

# Checklist avant production

- [ ] HTTPS activé
- [ ] Rate limiting configuré
- [ ] Logs en place (Sentry + Winston)
- [ ] Backups automatiques configurés
- [ ] Monitoring Uptime Robot actif
- [ ] Variables d'environnement vérifiées
- [ ] CORS configuré
- [ ] Validation DTOs activée
- [ ] Tests sécurité effectués
- [ ] Secrets rotatifs (FEDAPAY, KKIAPAY, JWT_SECRET)
