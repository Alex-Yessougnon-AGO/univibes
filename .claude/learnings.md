# UnivVibes — Learnings & Pitfalls

Ce fichier documente les erreurs fréquentes rencontrées pendant le développement
et comment les éviter. À lire avant toute modification du code.

---

## 1. Conflit de nom `t` (traduction vs variable locale)

### Problème
Utiliser `t` comme nom de variable dans un callback `.map()`, `.find()` ou
`.reduce()` crée un conflit avec la fonction `t = useTranslations()`.

### Symptôme
```
Type error: This expression is not callable.
  Type 'MockTicketType' has no call signatures.
```
Build Vercel échoue (le typecheck local peut passer selon la config).

### Code fautif
```tsx
const t = useTranslations(); // ← fonction de traduction

event.tickets?.map((t) => (        // ← t est un MockTicketType !
  <span>{t.remaining} / {t.total} {t("event.remaining")}</span>
  //                                      ^ erreur : t n'est pas callable
))
```

### Correction
```tsx
const t = useTranslations();

event.tickets?.map((ticket) => (    // ← renommer en ticket
  <span>{ticket.remaining} / {ticket.total} {t("event.remaining")}</span>
  //                                     ^ t() fonctionne car c'est la translation
))
```

Ou utiliser `tk`, `ti`, `item`, etc.

### Règle
**Ne JAMAIS utiliser `t` comme nom de variable locale** dans `.map()`,
`.find()`, `.reduce()`, `.filter()` ou tout callback, car `t` est réservé
pour `useTranslations()`.

---

## 2. Pathname de `next/navigation` vs `@/i18n/routing`

### Problème
`usePathname()` de `next/navigation` **inclut** le préfixe locale (`/fr/explore`),
tandis que `usePathname()` de `@/i18n/routing` **exclut** le préfixe (`/explore`).

### Symptôme
- Navigation vers `/fr/fr/explore` (double locale)
- `router.replace(pathname, { locale: 'en' })` ne fonctionne pas

### Correction
```tsx
// ✅ Pour la navigation locale-aware
import { usePathname, useRouter } from "@/i18n/routing";
const pathname = usePathname(); // → "/explore" (sans locale)
router.replace(pathname, { locale: "en" });

// ❌ NE PAS utiliser next/navigation pour la navigation locale
import { usePathname } from "next/navigation"; // → "/fr/explore" (avec locale)
```

### Règle
- Dans un `LanguageSwitcher` ou tout composant qui change de locale :
  utiliser **`@/i18n/routing`**
- Pour les vérifications de route active (isActive) : utiliser **`next/navigation`**
  (car on a besoin de la locale dans l'URL)

---

## 3. `}` manquant dans les JSX expressions

### Problème
Quand on modifie un bloc JSX contenant `{condition && (...)}`, il est facile
d'oublier le `)}` fermant.

### Symptôme
```
TS1005: '}' expected.
```

### Correction
```tsx
// ✅ Correct
{mounted && (
  <button>...</button>
)}

// ❌ Faux (manque })
{mounted && (
  <button>...</button>
)
```

### Règle
Toujours vérifier que `{condition && (` est fermé par `)}` pas seulement `)`.

---

## 4. Tests Playwright avec middleware Next.js

### Problème
Les tests Playwright qui naviguent vers des URLs avec préfixe locale
(`/fr`, `/en`) peuvent échouer avec `net::ERR_ABORTED` à cause des
redirections du middleware next-intl.

### Correction
```ts
// ✅ Utiliser waitUntil: "domcontentloaded" + waitForLoadState
await page.goto("/fr", { waitUntil: "domcontentloaded" });
await page.waitForLoadState("networkidle");

// ✅ Pour attendre un changement de locale, utiliser waitForURL
await page.waitForURL(/\/en/, { timeout: 10000 });
```

### Playwright browser path
Sur cette machine, les navigateurs Playwright sont dans
`/home/alex/.cache/ms-playwright/`. Pour exécuter les tests :
```bash
PLAYWRIGHT_BROWSERS_PATH=/home/alex/.cache/ms-playwright npx playwright test
```

---

## 5. Dépendance cyclique pnpm + Prisma

### Problème
`prisma generate` crée le client dans `apps/api/src/generated/prisma/`.
Le `.pnpmfile.cjs` désactive le postinstall de `@prisma/client` pour éviter
les boucles récursives.

### Symptôme
```
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL
```

### Correction
Toujours lancer `pnpm db:generate` manuellement après `pnpm install` ou
un changement de schéma.

---

## 6. Dev server lent (slow filesystem)

### Problème
Next.js détecte un système de fichiers lent, ce qui ralentit le serveur de dev
et peut causer des timeouts.

### Symptôme
```
⚠ Slow filesystem detected. The benchmark took 232ms.
```

### Solution
- Nettoyer le cache : `rm -rf apps/web/.next`
- Redémarrer le serveur
- Sur Vercel (production), ce problème ne se pose pas

---

## 7. Ajout de clés de traduction

### Règle
Toujours ajouter les clés dans **les deux fichiers** :
- `apps/web/messages/en.json`
- `apps/web/messages/fr.json`

Utiliser `useTranslations()` avec un namespace (prefixe) ou sans.
Si sans namespace, la clé complète doit être utilisée :
```tsx
const t = useTranslations();
t("nav.home")    // ✅
t("common.save") // ✅
```

---

## 8. Sentry build warning

### Problème
Le build Vercel affiche :
```
Warning: No auth token provided. Will not create release.
```

Ce warning est **non-bloquant** pour le développement. Pour le résoudre en prod,
ajouter `SENTRY_AUTH_TOKEN` dans les env vars Vercel.

---

## Résumé des patterns à suivre

| Fichier | Import `usePathname` depuis |
|---------|---------------------------|
| `language-switcher.tsx` | `@/i18n/routing` |
| `navbar.tsx` (isActive) | `next/navigation` |
| Tout composant i18n | `@/i18n/routing` |

| Contexte | Nom de variable |
|----------|----------------|
| Fonction de traduction | `t` |
| Ticket dans `.map()` | `ticket`, `tk`, `ti` |
| Événement dans `.map()` | `e`, `event` |
| Index dans `.map()` | `i` |
