# 15-Supabase-Setup.md

# Création du projet

1. Créer un projet Supabase

2. Récupérer :

* Project URL
* Anon Key
* Service Role Key

3. Activer :

* Email Auth
* Storage
* Realtime

---

# Buckets Storage

event-images

Public

---

avatars

Public

---

documents

Privé

---

ads

Public

---

# Auth Providers

Version 1

Email + Password

---

Version 2

Google

Facebook

Apple

---

# Row Level Security

Activer RLS sur toutes les tables.

---

# Policies

Student

* lecture événements validés

Organizer

* lecture ses événements
* écriture ses événements

Moderator

* lecture tous événements
* validation événements

Admin

* accès total

---

# Edge Functions

create-payment

payment-webhook

send-notification

send-reminder

weekly-newsletter

---

# Cron Jobs

Chaque jour

08h00

Envoi rappels

---

Chaque jeudi

20h00

Newsletter hebdomadaire

---

# Secrets

FEDAPAY_SECRET

KKIAPAY_SECRET

RESEND_API_KEY

GOOGLE_MAPS_KEY

---

# Monitoring

Supabase Logs

Supabase Dashboard

Sentry

Uptime Robot
