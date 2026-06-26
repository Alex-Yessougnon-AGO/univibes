# Audit complet du projet Univibes

> **Date :** 2026-06-25
> **Méthode :** audit chirurgical — code source lu, tests exécutés, builds lancés, déploiements sondés en live, secrets scannés.
> **Aucune modification de code n'a été faite** — ce document est une analyse, pas une exécution.

---

## TL;DR — verdict exécutif

| Critère | Statut |
|---|---|
| Stack technologique | ✅ **Excellente et cohérente — ne pas changer** |
| Qualité du code | ✅ Propre (0 TODO/FIXME/console.log côté API) |
| Tests automatisés | ✅ 14 suites / 93 tests verts (API) |
| Build | ✅ API (`nest build`) et Web (`next build`) compilent sans erreur |
| i18n | ✅ 701 clés parfaitement synchronisées fr/en |
| Sécurité des secrets | ✅ Aucun secret leaké (code, git, historique) |
| **Produit fonctionnel** | ❌ **NON — bug fatal sur la génération des billets** |
| **Sécurité du paiement** | ❌ **NON — webhook non protégé** |
| **Déploiement API** | ❌ **NON — l'API répond 404 en production** |
| Déploiement Web | ✅ En ligne (`univibes.vercel.app`) |

**Conclusion : la fondation est solide et moderne. Le projet n'a PAS besoin de changer de stack. Il a besoin de finition : 2 bugs d'intégration critiques, 1 config de prod dangereuse, et 1 déploiement API à réparer.**

---

## 1. La stack — faut-il changer ?

**NON.** La stack est moderne, cohérente et appropriée au produit.

| Couche | Techno | Version | Verdict |
|---|---|---|---|
| Backend | NestJS | 11.0.0 | ✅ Dernière majeure, architecture modulaire propre |
| Frontend | Next.js (App Router) | 16.2.9 | ✅ Très récent, RSC, i18n natif |
| UI | React + Tailwind v4 | 19.2.4 | ✅ À jour |
| ORM | Prisma | 5.22.0 | ✅ Standard de l'industrie |
| DB | PostgreSQL | 16 | ✅ |
| Cache | Redis | 7 | ✅ Câblé et utilisé (events, categories, admin) |
| Auth | JWT + Passport + bcrypt | — | ✅ Conçue correctement |
| Paiements | FedaPay + Kkiapay | — | ⚠️ Adapté au marché ouest-africain (Bénin/Togo) |
| Upload | Cloudinary | — | ✅ Implémenté avec validation |
| Email | Resend | — | ✅ |
| Monitoring | Sentry + Winston | — | ✅ Configuré |

**Note AGENTS.md incorrecte :** indique « NestJS 10 » alors que c'est NestJS 11. À corriger dans `AGENTS.md`.

---

## 2. Ce qui est solide (ne pas régresser)

1. **14 suites de tests / 93 tests unitaires verts** — couverture service sur tous les modules métier (auth, orders, payments, events, tickets, checkin, upload, etc.). Lancés : tous passent.
2. **Authentification bien conçue** — `auth.service.ts` : bcrypt rounds 12, tokens access (15m) + refresh (30d) séparés, **rotation des refresh tokens** (l'ancien est supprimé à chaque usage), gestion des collisions avec retry, audit trail de chaque action.
3. **Build web OK** — ~45 routes, compile en 76s sans erreur.
4. **i18n complet** — 701 clés dans `en.json` ET `fr.json`, 70 fichiers utilisent `useTranslations`.
5. **Aucun secret leaké** — scan du code source, des `.env`, de l'historique git (50 derniers commits) : rien.
6. **Hygiène backend** — 0 `TODO`, 0 `FIXME`, 0 `console.log` dans l'API.
7. **Sécurité de base HTTP** — Helmet (CSP durci en prod), CORS configuré, ValidationPipe global (`whitelist` + `forbidNonWhitelisted`), rate limiting (100 req/min/IP), SanitizePipe anti-XSS avant validation.
8. **Audit trail** — `AuditService` global trace chaque action sensible (login, register, paiement, etc.).
9. **Schéma DB complet** — 20 modèles, index pertinents (city, status, startDate, etc.), relations `onDelete: Cascade` cohérentes.

---

## 3. 🚨 BLOQUANTS — à corriger en premier (P0)

### P0-1. 🎫 Les billets ne sont JAMAIS générés après un paiement réussi

**C'est le bug le plus grave du projet. Le produit ne fonctionne pas.**

- `OrdersService.issueTickets()` existe (`apps/api/src/orders/orders.service.ts:156`) — il génère les `IssuedTicket` avec QR codes HMAC.
- **Mais cette méthode n'est appelée NULLE PART.**
- Dans `payments.service.ts:146-164`, après qu'un paiement passe à `success`, il n'y a qu'un `this.logger.log(...)` — aucune génération de billets.

**Conséquence :** un étudiant paie → sa commande passe à `paid` → **il ne reçoit aucun billet, aucun QR code**. Le check-in (qui scanne les QR) est donc inutilisable.

**Correctif :** appeler `ordersService.issueTickets(orderId)` dans le bloc `if (newStatus === 'success')` du webhook, et injecter `OrdersService` dans `PaymentsService` (avec `forwardRef` si dépendance circulaire). Idéalement rendre l'opération idempotente (ne pas régénérer si déjà émis).

---

### P0-2. 🔓 Le webhook de paiement n'est pas sécurisé

**Faille critique — exploitable en quelques secondes.**

- `PaymentsController.webhook()` (`payments.controller.ts:47`) est décoré `@Public()`.
- Le `PaymentWebhookDto` n'exige que `{ provider, providerReference, status }` — **aucune vérification de signature**.
- `FedaPayService.verifyWebhook()` existe (`fedapay.service.ts:71`) mais **n'est jamais appelé** dans le controller.

**Conséquence :** n'importe qui peut envoyer :
```http
POST /api/v1/payments/webhook
{ "provider": "fedapay", "providerReference": "<ref d'une commande>", "status": "success" }
```
…et valider **gratuitement** n'importe quelle commande. Avant d'ouvrir au public, c'est une obligation absolue.

**Correctif :**
1. Lire la signature FedaPay depuis les headers (souvent `x-fEDAPAY-SIGNATURE` ou body signé).
2. Appeler `fedapay.verifyWebhook(signature, rawBody)` et rejeter si invalide.
3. Ajouter `FEDAPAY_WEBHOOK_SECRET` dans `render.yaml` / `railway.json` (présent dans `.env.example` mais **absent** des fichiers de déploiement).
4. Idéalement ajouter de l'idempotency (clé unique sur `(provider, providerReference)` + statut déjà traité).

---

### P0-3. 💾 `prisma db push --accept-data-loss` en production

**Dangereux.** `Dockerfile:62` :
```dockerfile
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && node dist/main.js"]
```

- `db push` **recalcule le schéma à partir de `schema.prisma` à chaque démarrage**. Avec `--accept-data-loss`, si une colonne change, **Prisma peut silencieusement détruire des données** (ex. : renommer un champ = perte de la colonne).
- En production, la règle d'or est `prisma migrate deploy` (applique uniquement les migrations versionnées, jamais de perte).
- De plus, le `db push` tourne **deux fois** : une fois dans le `CMD` Docker, une fois dans `preDeployCommand` du `railway.json` (qui remplace le `CMD`). Et le `startCommand: node dist/main.js` du `railway.json` écrase le `CMD`.

**Correctif :**
- Dockerfile CMD → `["node", "dist/main.js"]`
- `railway.json` `preDeployCommand` → `./node_modules/.bin/prisma migrate deploy`
- S'assurer qu'une migration existe (`prisma/migrations/20260622000000_init`) et que son `migration.sql` est committé (actuellement **gitigné** — voir P1-7).

---

### P0-4. 🌐 L'API n'est PAS fonctionnellement déployée

Sondage en live le 2026-06-25 :

| URL | Résultat |
|---|---|
| `https://univibes.vercel.app` | ✅ **HTTP 200** (redirige vers `/fr`) — frontend en ligne |
| `https://univvibes.vercel.app` | ⚠️ HTTP 307 (existe aussi, typo à 2 « v » dans render.yaml) |
| `https://univibes-api.onrender.com/api/v1/health` | ❌ **HTTP 404** |
| `https://univibes-api.onrender.com/api/docs` | ❌ HTTP 404 |
| `https://univibes-api.onrender.com/` | ❌ HTTP 404 (« Not Found ») |
| `*.up.railway.app` (variantes) | ❌ 404 / inexistant |

**Conséquence :** le frontend en ligne pointe vers une API **injoignable**. Le site public est donc **cassé** (aucun appel API ne fonctionne).

**Causes possibles (à confirmer dans les logs Render) :**
- Le service Render n'est pas déployé / est suspendu (plan free).
- Le `startCommand: node dist/main.js` du `railway.json` est appliqué par erreur sur Render, mais `dist/` n'existe pas (Render utilise le Dockerfile, mais le `preDeployCommand` `prisma db push` échoue peut-être).
- L'app écoute sur le port 3001 au lieu du `PORT` Render.

**Correctif :** déployer réellement l'API sur **une** plateforme (Render OU Railway, pas les deux), vérifier les logs de build, confirmer `GET /api/v1/health` → 200, puis mettre à jour `NEXT_PUBLIC_API_URL` côté Vercel.

---

## 4. ⚠️ À corriger avant ouverture publique (P1)

### P1-1. `JWT_ACCESS_SECRET` avec fallback faible
`apps/api/src/auth/strategies/jwt.strategy.ts:13` :
```ts
secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'fallback_secret',
```
Si la variable d'env manque en prod, l'API démarre avec un secret prédictible = compromission totale des tokens.
**Correctif :** valider les secrets critiques au bootstrap (`main.ts`) et `throw` si manquant.

### P1-2. Typo `univvibes.vercel.app` (deux « v »)
`render.yaml:39` :
```yaml
FRONTEND_URL: https://univvibes.vercel.app
```
L'URL officielle est `univibes.vercel.app` (un seul v). Conséquence : CORS et emails (liens de vérification/reset) pointent vers la mauvaise URL côté API.
**Correctif :** `https://univibes.vercel.app`.

### P1-3. Migrations SQL gitignorées
`.gitignore` contient `prisma/migrations/*/migration.sql`. Conséquence : `prisma migrate deploy` **échouera en production** car les SQL ne sont pas versionnés. C'est en contradiction directe avec P0-3.
**Correctif :** retirer cette ligne du `.gitignore`, committer `migration.sql`.

### P1-4. Pas de CI/CD
`.github/workflows/` est vide. Aucun gate qualité avant merge : on peut casser `main` sans rien voir.
**Correctif minimal :** un workflow GitHub Actions qui lance `pnpm install && pnpm db:generate && pnpm --filter api lint && pnpm --filter api test && pnpm --filter api build && (cd apps/web && pnpm build)` sur chaque PR.

### P1-5. `FEDAPAY_WEBHOOK_SECRET` absent des fichiers de déploiement
Présent dans `.env.example` et `.env`, mais ni `render.yaml` ni `railway.json` ne le déclarent. Lien direct avec P0-2.

### P1-6. Webhook sans idempotency
`payments.service.ts:handleWebhook` ne vérifie pas si le paiement a déjà été traité. Un webhook FedaPay renvoyé (ce qui arrive) peut causer des incohérences (et, une fois P0-1 corrigé, des billets dupliqués).
**Correctif :** guard « si `payment.status === 'success'` déjà → return tôt ».

### P1-7. Tests e2e inexistants
`apps/api/test/app.e2e-spec.ts` est un placeholder. Le parcours critique (register → créer event → commander → payer → recevoir billet → check-in) n'est testé de bout en bout nulle part.
**Correctif :** e2e Jest + supertest sur ce parcours, avec une DB de test.

### P1-8. Admin app (`apps/admin`) est un scaffold vide
Pas de `src/`. Or, l'admin existe déjà dans `apps/web/[locale]/admin/*` (14 routes admin complètes). Donc `apps/admin` est **redondant et mort**.
**Décision à prendre :** soit le supprimer, soit le développer. Recommandation : **supprimer** pour réduire la charge de maintenance.

---

## 5. 🔧 Améliorations produit & qualité (P2)

| # | Sujet | Constat | Recommandation |
|---|---|---|---|
| P2-1 | Tokens en `localStorage` | `api-client.ts:27` — vulnérable au XSS | Cookies httpOnly + middleware Next.js server-side pour l'auth (plus sûr, permet SSR protégé) |
| P2-2 | Notifications temps réel | Seulement in-app (DB), pas de push | WebSocket (Socket.io) ou Server-Sent Events pour les notifications de paiement/check-in |
| P2-3 | SEO faible | `robots.txt` présent, mais **pas de `sitemap.ts`**, seulement 2 fichiers `metadata` | Ajouter `app/sitemap.ts`, `generateMetadata` sur les pages event/organizer, OpenGraph images |
| P2-4 | Error/loading boundaries | `global-error.tsx` + `not-found.tsx` OK, mais **pas de `error.tsx`/`loading.tsx` par route** | Ajouter au moins sur les routes critiques (checkout, dashboard) |
| P2-5 | Rate limiting auth | Throttler global (100/min) mais pas de limite spécifique login/register | Limiter login/register à ~5/min/IP pour bloquer le brute-force |
| P2-6 | Index de recherche | Pas de recherche full-text sur les events (titre/description) | Prisma ne gère pas le FTS ; envisager la recherche Postgres native (`tsvector`) ou un filtre LIKE indexé |
| P2-7 | Pagination | À vérifier sur `events.findAll` | S'assurer que tous les `findMany` listes sont paginés (sinon N+1 et mémoire) |

---

## 6. 🧹 Nettoyage du repo (P2 hygiène)

| Fichier | Problème | Action |
|---|---|---|
| `index.html` (73 KB, racine) | Vieux prototype HTML statique (commit `092eafa`) | Supprimer |
| `demo.txt` | Note de débug personnelle (« Le bloc 2 ne marche pas ») | Supprimer |
| `apps/web/.next/dev/` | **1,9 GB** de cache dev | Ajouter au `.gitignore` (déjà fait pour `.next`) + nettoyer |
| `pnpm.yaml` | Fichier ambigu à la racine (à côté de `pnpm-workspace.yaml`) | Vérifier son utilité, supprimer si obsolète |
| `PLAYWRIGHT_QA_EXPERT.md` (34 KB) | Rapport Playwright à la racine | Déplacer dans `docs/` |
| `DEPLOYMENT_REPORT.md` | Incomplet (phases 4-10 vides) | Soit le terminer, soit le supprimer au profit de ce document |
| `SKILLS-INSTALLES.md`, `skills-lock.json` | Artefacts d'outil IA | Déplacer dans `.agents/` ou gitignorer |
| `.playwright/`, `.impeccable/`, `.design/` | Dossiers d'outils à la racine | Gitignorer |

---

## 7. 📊 Couverture fonctionnelle observée (frontend)

Pages substantielles (mesurées en lignes, preuve de complétude) :

| Parcours | Pages | Lignes (page principale) |
|---|---|---|
| Landing / Home | `/`, `/home` | 523, 218 |
| Explore / Event | `/explore`, `/event/[slug]`, `/search` | 483, 517 |
| Auth | `/login`, `/register`, `/forgot-password`, `/auth/*` | 210, 310, 152 |
| Checkout | `/checkout/[eventId]`, `/success`, `/cancel` | 288 |
| Tickets | `/tickets`, `/tickets/[id]`, `/invoice` | 207, 195, 301 |
| Dashboard orga | `/dashboard`, `/events/*`, `/checkin`, `/analytics` | 423, 352 |
| Profil | `/profile/*`, `/security`, `/notifications`, `/settings` | 311, 245 |
| Admin | 14 routes (`/admin/*`) | 138-166 chacune |
| Modération | `/moderator/*` | scaffold |
| Légal | `/legal/*` | OK |

**Conclusion :** le frontend est **largement construit**. Le trou est côté intégration backend (P0-1, P0-2, P0-4), pas côté UI.

---

## 8. Checklist de mise en production

À cocher avant d'ouvrir au public :

- [ ] **P0-1** Câbler `issueTickets()` dans le webhook paiement réussi
- [ ] **P0-2** Sécuriser le webhook (vérification signature FedaPay) + `FEDAPAY_WEBHOOK_SECRET` en prod
- [ ] **P0-3** Remplacer `db push --accept-data-loss` par `migrate deploy` ; dédoublonner CMD/preDeploy
- [ ] **P0-4** Déployer l'API réellement (1 plateforme), vérifier `/api/v1/health` → 200
- [ ] **P1-1** Faire échouer le bootstrap si `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` manquent
- [ ] **P1-2** Corriger typo `univvibes` → `univibes` dans render.yaml
- [ ] **P1-3** Dé-gitignorer et committer `migration.sql`
- [ ] **P1-4** Ajouter une CI GitHub Actions (lint + test + build)
- [ ] **P1-6** Idempotency du webhook
- [ ] **P2-5** Rate limiting spécifique sur login/register
- [ ] Tester le parcours complet en staging : register → email verify → créer event → commander → payer → recevoir billet → check-in QR
- [ ] Configurer Sentry DSN en prod (API + Web)
- [ ] Configurer `NEXT_PUBLIC_API_URL` côté Vercel vers l'API prod
- [ ] Activer les webhooks FedaPay en mode production (`FEDAPAY_SANDBOX=false`) avec de vraies clés
- [ ] Mettre en place les sauvegardes Postgres (automatiques sur Render/Railway, à vérifier)

---

## 9. Détails techniques pour la correction

### P0-1 — Câblage de `issueTickets`

```ts
// payments.service.ts — dans handleWebhook, bloc success
if (newStatus === 'success') {
  await tx.order.update({ where: { id: payment.orderId }, data: { status: 'paid' } });
  // ↓ À AJOUTER (hors transaction pour ne pas la bloquer trop longtemps)
}
// ... après la transaction :
if (newStatus === 'success') {
  await this.ordersService.issueTickets(payment.orderId); // injecté via constructor
}
```
Penser à l'idempotency : ne pas régénérer si des `IssuedTicket` existent déjà pour cet order.

### P0-2 — Sécurité webhook

```ts
// payments.controller.ts
@Post('webhook')
@Public()
async webhook(@Req() req: RawBodyRequest<Request>, @Headers() headers) {
  const signature = headers['x-fedapay-signature'] as string;
  const raw = req.rawBody.toString(); // nécessite express raw body pour /webhook
  const ok = await this.fedapay.verifyWebhook(signature, raw);
  if (!ok) throw new UnauthorizedException({ code: 'INVALID_SIGNATURE' });
  await this.paymentsService.handleWebhook(dto);
}
```

### P0-3 — Dockerfile

```dockerfile
# Avant (dangereux)
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && node dist/main.js"]
# Après
CMD ["node", "dist/main.js"]
```
Et dans `railway.json` / `render.yaml` : `preDeployCommand: ./node_modules/.bin/prisma migrate deploy`.

---

## 10. Décisions à trancher (par le propriétaire)

1. **Plateforme API :** Render (déjà partiellement configuré) OU Railway ? *(réponse reportée)*
2. **`apps/admin` :** supprimer (recommandé) ou développer ?
3. **Paiements :** garder FedaPay (Bénin/Togo) ou viser d'autres marchés (Stripe) ? La stack actuelle est cohérente avec une cible ouest-africaine.
4. **Real-time :** prioriser les notifications WebSocket maintenant ou plus tard ?
5. **Tests e2e :** investir maintenant (recommandé avant ouverture) ou après ?

---

*Document généré par audit automatisé du code source et des déploiements live. Toutes les affirmations sont vérifiables par les commandes exécutées durant l'audit.*
