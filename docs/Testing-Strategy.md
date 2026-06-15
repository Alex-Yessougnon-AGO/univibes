# Testing Strategy — Univibes

---

# Niveaux de tests

## 1. Tests Unitaires

Tester les services isolément (logique métier pure).

Outil : Jest

Exemples :
- `AuthService.hashPassword()`
- `EventService.generateSlug()`
- `PaymentService.calculateCommission()`
- `OrderService.validateStock()`

Couverture cible : **80%** des services

---

## 2. Tests d'Intégration

Tester les modules avec une vraie base de données (PostgreSQL test).

Outil : Jest + Supertest + Prisma (test database)

Exemples :
- `POST /auth/register` → crée un utilisateur
- `POST /events` → crée un événement
- `POST /orders` → décrémente le stock de billets

---

## 3. Tests E2E (End-to-End)

Tester les flux complets utilisateur.

Outil : Playwright (frontend) + Supertest (API)

Flux critiques à tester :
- Inscription → Vérification email → Connexion
- Création d'événement → Validation → Publication
- Achat billet → Paiement → Génération QR Code

---

# Structure des tests

```
apps/api/
├── src/
│   └── modules/
│       └── events/
│           ├── events.service.ts
│           └── events.service.spec.ts    ← Tests unitaires
│
├── test/
│   ├── auth.e2e-spec.ts                  ← Tests E2E auth
│   ├── events.e2e-spec.ts                ← Tests E2E events
│   └── jest-e2e.json
```

---

# Exemple de test unitaire

```typescript
// events.service.spec.ts
describe('EventsService', () => {
  describe('generateSlug', () => {
    it('should generate a slug from title', () => {
      const slug = service.generateSlug('Gala de l\'UAC 2026');
      expect(slug).toBe('gala-de-luac-2026');
    });

    it('should handle duplicate slugs', async () => {
      const slug = await service.generateUniqueSlug('Concert Jazz');
      expect(slug).toMatch(/concert-jazz(-\d+)?/);
    });
  });
});
```

---

# Exemple de test E2E

```typescript
// auth.e2e-spec.ts
describe('Auth (e2e)', () => {
  it('POST /auth/register → 201', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        fullname: 'Test User',
        email: 'test@univibes.com',
        password: 'Password123!'
      })
      .expect(201)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.userId).toBeDefined();
      });
  });

  it('POST /auth/login → 200', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@univibes.com', password: 'Password123!' })
      .expect(200)
      .expect(res => {
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();
      });
  });
});
```

---

# Scripts

```bash
pnpm test              → Tests unitaires
pnpm test:watch        → Mode watch
pnpm test:coverage     → Rapport de couverture
pnpm test:e2e          → Tests E2E
```

---

# Priorités de test

| Priorité | Module | Raison |
|----------|--------|--------|
| 🔴 Critique | Payments | Argent réel |
| 🔴 Critique | Auth | Sécurité |
| 🟠 Haute | Orders + Tickets | Stock critique |
| 🟠 Haute | Events | Cœur du produit |
| 🟡 Moyenne | Notifications | Expérience utilisateur |
| 🟢 Normale | Favorites, Profile | CRUD simple |

---

# Base de données de test

Utiliser une base PostgreSQL dédiée aux tests.

Variable : `DATABASE_URL_TEST`

Avant chaque suite E2E :
1. Reset la base (`prisma migrate reset --force`)
2. Seed les données minimales
3. Exécuter les tests
4. Nettoyer

---

# CI

Les tests s'exécutent automatiquement sur chaque Pull Request via GitHub Actions.

Merge bloqué si les tests échouent.
