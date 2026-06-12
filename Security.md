# 06-Security.md

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

Durée :

15 min

Refresh Token :

30 jours

---

# Protection API

Rate Limiting

100 requêtes / minute

Par IP

---

# Anti Spam

Limiter :

* création événements
* création comptes

---

# Validation

Tous les champs validés avec Zod.

---

# Uploads

Formats :

jpg
png
webp

Taille max :

5 MB

---

# Stockage

Bucket public :

event-images

Bucket privé :

documents

---

# Journalisation

Logs obligatoires :

* login
* paiements
* validation événement
* suppression événement

---

# Paiements

Ne jamais faire confiance au frontend.

Toujours :

* vérifier webhook
* vérifier signature
* vérifier montant

---

# Sauvegardes

Database :

quotidienne

Rétention :

30 jours

---

# Monitoring

Outils

* Sentry
* Supabase Logs

---

# Gestion des incidents

Niveaux

P1 : paiement cassé

P2 : création événement impossible

P3 : bug mineur

---

# RGPD Local

L'utilisateur doit pouvoir :

* télécharger ses données
* supprimer son compte

---

# Checklist avant production

HTTPS

Rate limiting

Logs

Backups

Monitoring

RLS activé

Tests sécurité
