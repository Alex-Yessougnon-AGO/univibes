# 03-Architecture.md

# Architecture Technique

## Stack V1

### Frontend

* Next.js
* TypeScript
* TailwindCSS
* Shadcn/UI

---

### Backend

Supabase

Services :

* Auth
* PostgreSQL
* Storage
* Realtime

---

# Architecture Générale

Frontend
|
Next.js
|
Supabase API
|
PostgreSQL

---

# Services

## Auth

Fonctions :

* inscription
* connexion
* mot de passe oublié
* vérification email

---

## Storage

Contenu :

* affiches événements
* avatars
* bannières

---

## Notifications

V1

* Email

V2

* Push
* SMS

---

# Paiements

## Providers

* Kkiapay
* FedaPay

Flux :

Utilisateur
|
Paiement
|
Webhook
|
Validation
|
Ticket

---

# Monitoring

## Logs

* erreurs backend
* erreurs frontend
* paiements

---

## Outils

* Sentry
* Supabase Logs

---

# Environnements

## Local

Développement

---

## Staging

Tests

---

## Production

Utilisateurs réels

---

# Git Flow

main

production

develop

développement

feature/*

nouvelles fonctionnalités

---

# Déploiement

Frontend

Vercel

Backend

Supabase

CDN

Vercel Edge Network

---

# Scalabilité Future

Phase 2

Migration vers :

* NestJS
* PostgreSQL dédié
* Redis

Phase 3

Microservices :

* Event Service
* Payment Service
* Notification Service
* Analytics Service
