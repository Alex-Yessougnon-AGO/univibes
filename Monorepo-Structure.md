# 11-Monorepo-Structure.md

# Monorepo Structure

apps/
├── web
├── admin
├── mobile

packages/
├── ui
├── types
├── database
├── auth
├── utils

docs/

supabase/

.github/

---

# apps/web

Site principal étudiant

Pages :

/

/explore

/event/[slug]

/favorites

/profile

---

# apps/admin

Administration

/admin

/admin/events

/admin/users

/admin/payments

/admin/ads

---

# apps/mobile

Flutter

lib/

features/

core/

shared/

---

# packages/ui

Composants partagés

Button

Card

Input

Dialog

Badge

Calendar

Map

QRCode

---

# packages/types

Types TypeScript

User

Event

Ticket

Payment

---

# packages/database

Supabase Client

Queries

Repositories

---

# packages/auth

Gestion Auth

Roles

Permissions

Middleware

---

# packages/utils

Helpers

Date

Validation

Formatters

---

# Branches

main

production

develop

feature/*

hotfix/*
