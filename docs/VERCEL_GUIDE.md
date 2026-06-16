# Guide Vercel — Univibes

## Pourquoi j'ai d'abord fait un déploiement Preview ?

**Parce que c'est la bonne pratique.** Quand on déploie une app pour la première fois, on ne va JAMAIS directement en production. On fait un **preview deployment** pour :

1. **Vérifier** que le build passe sans erreur
2. **Tester** que le site s'affiche correctement
3. **Valider** les routes, le rendu, les assets
4. **Corriger** les problèmes AVANT d'exposer le site aux utilisateurs

C'est comme faire un essai en coulisses avant le spectacle. La preview a sa propre URL temporaire (ex: `univibes-xyz.vercel.app`) et ne remplace pas le site existant.

Ensuite, quand tout est bon, on déploie en production avec `--prod`. Le `deploy-to-vercel` skill de Codebuff le dit explicitement : *"Always deploy as preview (not production) unless the user explicitly asks for production."*

---

## Résumé des erreurs rencontrées et solutions

### 1. `npm error Unsupported URL Type "workspace:"`

**Erreur :**
```
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

**Cause :** Le `package.json` utilise le protocole `workspace:*` de pnpm pour les dépendances internes (`@univibes/types`, `@univibes/ui`, `@univibes/utils`). Ce protocole est spécifique à pnpm. Mais Vercel utilisait `npm install` par défaut, qui ne comprend pas `workspace:*`.

**Solution :** Faire détecter pnpm par Vercel. Pour ça, il faut déployer DEPUIS LA RACINE du monorepo (pas depuis `apps/web/`), car Vercel détecte pnpm via la présence de `pnpm-lock.yaml` à la racine.

**Leçon :** Ne jamais déployer un sous-dossier d'un monorepo pnpm. Déploie toujours depuis la racine et configure `rootDirectory` pour pointer vers l'app.

---

### 2. Builds à 0ms (plantage immédiat)

**Cause :** Conflits de configuration. J'ai fait plusieurs tentatives :
- `rootDirectory` dans `vercel.json` → propriété non valide à cet endroit
- `framework: "nextjs"` en dur dans le projet → Vercel cherchait Next.js à la racine mais l'app est dans `apps/web/`
- `installCommand` mal configuré → pnpm pas trouvé car exécuté depuis le mauvais dossier

**Solution finale :** 
- `rootDirectory` est un **project-level setting** (dashboard Vercel ou API), PAS dans `vercel.json`
- J'ai configuré `rootDirectory: "apps/web"` via l'API Vercel : le working directory devient `apps/web/`
- J'ai configuré `framework: "nextjs"` via l'API aussi
- Les commandes dans `vercel.json` sont relatives à `rootDirectory` :
  - `installCommand: "cd ../.. && pnpm install --no-frozen-lockfile"` → remonte à la racine pour installer
  - `buildCommand: "next build"` → s'exécute dans `apps/web/` où se trouve `next.config.ts`

**Leçon :** `rootDirectory` se configure dans le dashboard Vercel ou via l'API, pas dans `vercel.json`. Toutes les commandes dans `vercel.json` sont relatives au `rootDirectory`.

---

### 3. `[ERR_PNPM_LOCKFILE_CONFIG_MISMATCH]: pnpmfileChecksum`

**Erreur :**
```
"The current 'pnpmfileChecksum' configuration doesn't match the value found in the lockfile"
```

**Cause :** Le fichier `.pnpmfile.cjs` (hooks pnpm) a un checksum stocké dans `pnpm-lock.yaml`. Quand j'ai régénéré le lock file, ou que Vercel l'a vérifié, le checksum ne correspondait pas. En mode `--frozen-lockfile`, pnpm bloque si le checksum diffère.

**Solution :** 
- Supprimer `pnpm-lock.yaml`
- `pnpm install` pour le regénérer
- Utiliser `--no-frozen-lockfile` dans la commande d'install (via `installCommand` dans `vercel.json`)

**Leçon :** Quand tu utilises `.pnpmfile.cjs`, le lock file stocke un checksum de ce fichier. Si tu le modifies, regénère le lock file. Et pour Vercel, préfère `--no-frozen-lockfile` pour éviter ce genre de blocage.

---

### 4. `allowBuilds` bloqués (build scripts non approuvés)

**Erreur :**
```
build scripts blocked for @nestjs/core, @prisma/engines, sharp
```

**Cause :** Le fichier `pnpm-workspace.yaml` avait des valeurs `"set this to true or false"` pour les `allowBuilds` — c'était des placeholders. pnpm bloquait donc les scripts postinstall de ces packages.

**Solution :** Mettre tous les `allowBuilds` à `true` :
```yaml
allowBuilds:
  '@nestjs/core': true
  '@prisma/client': true
  '@prisma/engines': true
  '@sentry/cli': true
  bcrypt: true
  prisma: true
  sharp: true
```

**Leçon :** Si tu utilises pnpm, vérifie que les `allowBuilds` sont correctement configurés AVANT de déployer. Sinon, les dépendances qui ont besoin de compiler des binaires natifs (Prisma, Sharp, bcrypt) vont échouer.

---

### 5. 404 après build réussi

**Symptôme :** Le build passe (Next.js compile tout), mais le site renvoie `404: NOT_FOUND`.

**Cause :** J'avais configuré `"outputDirectory": "apps/web/.next"` dans `vercel.json`. Cette config dit à Vercel : « sers les fichiers statiques depuis ce dossier ». Mais pour un site Next.js, Vercel a besoin de son **Next.js Builder** qui :
1. Prend le `.next` généré par `next build`
2. Crée des **serverless functions** (API routes, SSR, ISR)
3. Configure le routage proprement

En forçant `outputDirectory`, j'ai court-circuité cette étape : Vercel servait le dossier `.next` comme des fichiers bruts sans routage → 404.

**Solution :** Supprimer `outputDirectory` de `vercel.json`. Quand Vercel détecte `framework: "nextjs"`, il utilise automatiquement son Next.js Builder qui gère tout : routage, serverless functions, ISR.

**Leçon :** **NE JAMAIS** mettre `outputDirectory` pour Next.js sur Vercel. Laisse le Next.js Builder gérer l'output automatiquement.

---

## La configuration finale qui fonctionne

### `vercel.json` (à la racine du monorepo)

```json
{
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "buildCommand": "next build"
}
```

### Project settings Vercel (dashboard ou API)

| Setting | Valeur |
|---------|--------|
| **Root Directory** | `apps/web` |
| **Framework** | Next.js |
| **Build Command** | *(laissé vide — lu depuis vercel.json)* |
| **Install Command** | *(laissé vide — lu depuis vercel.json)* |
| **Output Directory** | *(laissé vide — géré par le Next.js Builder)* |

### Pourquoi cette config marche

1. **Root Directory = `apps/web`** → Vercel se place dans `apps/web/` pour tout faire
2. **Install Command = `cd ../.. && pnpm install`** → remonte à la racine pour `pnpm install` car la config pnpm est à la racine
3. **Build Command = `next build`** → Next.js trouve `next.config.ts` dans `apps/web/`
4. **Pas d'outputDirectory** → Vercel utilise son Next.js Builder qui crée les serverless functions

---

## Les bonnes pratiques Vercel pour un pnpm monorepo

1. **Déploie toujours depuis la racine** du monorepo, pas depuis un sous-dossier
2. **Configure `rootDirectory`** dans le dashboard Vercel (pas dans `vercel.json`)
3. **Laisse Vercel détecter pnpm** via `pnpm-lock.yaml` — pas besoin de le forcer
4. **Ne mets JAMAIS `outputDirectory`** pour Next.js
5. **Préfère `--no-frozen-lockfile`** pour éviter les soucis de checksum
6. **Vérifie les `allowBuilds`** dans `pnpm-workspace.yaml` avant de déployer
7. **Toujours en preview d'abord** → tester → puis production
8. **L'idéal : git push** → Vercel détecte le push et déploie automatiquement (lié au repo GitHub)

---

## Preview vs Production

| Preview | Production |
|---------|------------|
| `vercel deploy` (sans flag) | `vercel deploy --prod` |
| URL temporaire : `univibes-xxx.vercel.app` | URL permanente : `univibes.vercel.app` |
| Protégé par mot de passe (Vercel Authentication) | Visible par tout le monde |
| Pour tester avant de lancer | Pour les vrais utilisateurs |
| On peut en faire plusieurs | Un seul à la fois |

La preview est comme un **brouillon en ligne** — personne ne peut y accéder sans être connecté à ton compte Vercel. La production, c'est le **site officiel** ouvert à tous.

---

## Commandes utiles

```bash
# Preview
vercel deploy . -y

# Preview vers un projet spécifique
vercel deploy . -y --project mon-projet

# Production
vercel deploy . -y --prod

# Lier le projet (git push auto)
vercel link --repo --scope mon-equipe

# Voir l'état du déploiement
vercel inspect https://mon-site.vercel.app

# Voir les logs d'un déploiement
vercel logs <deployment-id>

# Supprimer un projet
vercel project remove mon-projet
```
