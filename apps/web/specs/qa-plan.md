# Plan de Test QA — UnivVibes

## Contexte
Projet Next.js 16 (App Router) avec i18n (fr/en) et Tailwind v4.  
Serveur de dev sur `http://localhost:3000`. Toutes les routes sont préfixées par `[locale]` (fr/en).

## Pages à tester (67 pages au total)

### Groupe 1 — Pages Publiques (13 pages)
| Page | URL | Priorité |
|---|---|---|
| Landing | `/fr` | Critique |
| Home (connecté) | `/fr/home` | Haute |
| Explorer | `/fr/explore` | Critique |
| Détail événement | `/fr/event/[slug]` | Haute |
| À propos | `/fr/about` | Moyenne |
| Contact | `/fr/contact` | Moyenne |
| Blog liste | `/fr/blog` | Moyenne |
| Blog article | `/fr/blog/[slug]` | Moyenne |
| Tarifs | `/fr/pricing` | Moyenne |
| Recherche | `/fr/search` | Haute |
| Favoris | `/fr/favorites` | Haute |
| Organisateur | `/fr/organizer/[slug]` | Haute |
| Notifications | `/fr/notifications` | Haute |

### Groupe 2 — Authentification (7 pages)
| Page | URL | Priorité |
|---|---|---|
| Connexion | `/fr/login` | Critique |
| Inscription | `/fr/register` | Critique |
| Mot de passe oublié | `/fr/forgot-password` | Haute |
| Onboarding | `/fr/auth/onboarding` | Haute |
| Réinitialisation | `/fr/auth/reset-password` | Haute |
| Vérification email | `/fr/auth/verify-email` | Haute |
| Vérification token | `/fr/auth/verify-email/[token]` | Haute |

### Groupe 3 — Dashboard & Événements (6 pages)
| Page | URL | Priorité |
|---|---|---|
| Dashboard | `/fr/dashboard` | Haute |
| Mes événements | `/fr/dashboard/events` | Haute |
| Créer événement | `/fr/dashboard/events/new` | Haute |
| Détail événement | `/fr/dashboard/events/[id]` | Haute |
| Analytics | `/fr/dashboard/analytics` | Haute |
| Check-in | `/fr/dashboard/events/[id]/checkin` | Haute |

### Groupe 4 — Profil (5 pages)
| Page | URL | Priorité |
|---|---|---|
| Profil | `/fr/profile` | Haute |
| Modifier profil | `/fr/profile/edit` | Haute |
| Paramètres | `/fr/profile/settings` | Moyenne |
| Sécurité | `/fr/profile/security` | Haute |
| Notifications | `/fr/profile/notifications` | Haute |

### Groupe 5 — Checkout & Tickets (5 pages)
| Page | URL | Priorité |
|---|---|---|
| Checkout | `/fr/checkout/[eventId]` | Critique |
| Succès | `/fr/checkout/success` | Haute |
| Annulation | `/fr/checkout/cancel` | Haute |
| Mes billets | `/fr/tickets` | Haute |
| Détail billet | `/fr/tickets/[id]` | Haute |
| Facture | `/fr/tickets/[id]/invoice` | Haute |

### Groupe 6 — Admin (15 pages)
| Page | URL | Priorité |
|---|---|---|
| Dashboard admin | `/fr/admin` | Haute |
| Utilisateurs | `/fr/admin/users` | Haute |
| Événements | `/fr/admin/events` | Haute |
| Paiements | `/fr/admin/payments` | Haute |
| Boosts | `/fr/admin/boosts` | Moyenne |
| Publicités | `/fr/admin/ads` | Moyenne |
| Catégories | `/fr/admin/categories` | Moyenne |
| Villes | `/fr/admin/cities` | Moyenne |
| Universités | `/fr/admin/universities` | Moyenne |
| Paramètres | `/fr/admin/settings` | Moyenne |
| Journal d'audit | `/fr/admin/audit-logs` | Basse |
| Organisateurs | `/fr/admin/organizers` | Haute |
| Payouts | `/fr/admin/payouts` | Moyenne |
| Détail événement | `/fr/admin/events/[id]` | Haute |
| Détail organisateur | `/fr/admin/organizers/[id]` | Haute |

### Groupe 7 — Moderation (5 pages)
| Page | URL | Priorité |
|---|---|---|
| Modération | `/fr/moderator` | Haute |
| Événements | `/fr/moderator/events` | Haute |
| Review événement | `/fr/moderator/events/[id]/review` | Haute |
| Logs | `/fr/moderator/logs` | Moyenne |
| Signalements | `/fr/moderator/reports` | Haute |

### Groupe 8 — Pages spéciales (6 pages)
| Page | URL | Priorité |
|---|---|---|
| Erreur | `/fr/error` | Moyenne |
| Maintenance | `/fr/maintenance` | Basse |
| Page introuvable | `/fr/unauthorized` | Basse |
| Désabonnement | `/fr/unsubscribe` | Basse |
| Légal : CGU | `/fr/legal/terms` | Basse |
| Légal : Privacy | `/fr/legal/privacy` | Basse |
| Légal : Cookies | `/fr/legal/cookies` | Basse |

## Critères de test par page

Pour chaque page :
1. ✅ **HTTP 200** — la page charge sans erreur serveur
2. ✅ **Console** — pas d'erreur JS dans la console
3. ✅ **Titre** — le `<h1>` est présent
4. ✅ **i18n** — les textes sont traduits (check visuel sur la locale fr)
5. ✅ **Navigation** — les liens principaux pointent vers des routes valides
6. ✅ **Responsive** — pas de débordement horizontal en mobile (375px)
7. ✅ **Accessibilité WCAG** — scan de base sur les pages critiques

## Stratégie d'exécution
- Tests regroupés par groupe fonctionnel
- Parallélisation intra-groupe quand possible
- Rapport HTML + traces sur premier échec
