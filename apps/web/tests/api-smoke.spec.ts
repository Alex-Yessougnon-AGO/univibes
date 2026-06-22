// Playwright API tests — appellent directement le backend NestJS
// Nécessite le serveur API sur http://localhost:3001

import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:3001/api/v1';

// =====================================================
// HELPERS
// =====================================================

async function apiPost(
  request: any,
  path: string,
  data: any,
  token?: string,
): Promise<{ status: number; body: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await request.post(`${API_BASE}${path}`, { headers, data });
  const body = await res.json().catch(() => ({}));
  return { status: res.status(), body };
}

async function apiGet(
  request: any,
  path: string,
  token?: string,
): Promise<{ status: number; body: any }> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await request.get(`${API_BASE}${path}`, { headers });
  const body = await res.json().catch(() => ({}));
  return { status: res.status(), body };
}

/**
 * L'API wrap toutes les réponses dans { success, data } via TransformInterceptor.
 * Les erreurs (400, 401, 429) sont sous { success: false, error: { code, message } }.
 */
function extractData(body: any): any {
  return body?.data ?? body;
}

// =====================================================
// HEALTH
// =====================================================

test.describe('API — Health', () => {
  test('GET /health — retourne status OK', async ({ request }) => {
    const { status, body } = await apiGet(request, '/health');
    expect(status).toBe(200);
    const data = extractData(body);
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('timestamp');
  });

  test('GET /health — a des métriques services', async ({ request }) => {
    const { status, body } = await apiGet(request, '/health');
    expect(status).toBe(200);
    const data = extractData(body);
    expect(data).toHaveProperty('services');
    expect(data.services).toHaveProperty('database');
    expect(data.services).toHaveProperty('redis');
  });
});

// =====================================================
// AUTH — Register validation
// =====================================================

test.describe('API — Auth (Register validation)', () => {
  test('POST /auth/register — rejette un mot de passe faible (regex)', async ({ request }) => {
    const { status, body } = await apiPost(request, '/auth/register', {
      email: `weak-${Date.now()}@test.com`,
      fullname: 'Weak Password',
      password: 'short',
    });
    expect(status).toBe(400);
    expect(body.error?.code).toBe('BAD_REQUEST');
  });

  test('POST /auth/register — rejette un email invalide', async ({ request }) => {
    const { status } = await apiPost(request, '/auth/register', {
      email: 'pas-un-email',
      fullname: 'Invalid Email',
      password: 'Password123!',
    });
    expect(status).toBe(400);
  });

  test('POST /auth/register — rejette sans fullname', async ({ request }) => {
    const { status } = await apiPost(request, '/auth/register', {
      email: `nofullname-${Date.now()}@test.com`,
      password: 'Password123!',
    });
    expect(status).toBe(400);
  });

  test('POST /auth/register — rejette un corps vide (400)', async ({ request }) => {
    const { status } = await apiPost(request, '/auth/register', {});
    expect(status).toBe(400);
  });
});

// =====================================================
// AUTH — Registration + Full Flow
// =====================================================

test.describe('API — Auth (Flow complet)', () => {
  // Crée un user unique pour ce bloc de tests
  const email = `pw-flow-${Date.now()}@test.com`;
  const password = 'Playwright123!';
  let token = '';

  test('Register → Login → Profile → Refresh → Logout', async ({ request }) => {
    // 1. Register
    const reg = await apiPost(request, '/auth/register', {
      email,
      fullname: 'Flow Tester',
      password,
      city: 'Cotonou',
      university: 'UAC',
    });
    expect([201, 409, 429]).toContain(reg.status);

    // 2. Login
    const login = await apiPost(request, '/auth/login', { email, password });
    // Si rate limité (429) par des runs précédents, on skip le flow complet
    test.skip(login.status === 429 || reg.status === 429, 'Rate limité — skip le reste du flow');
    expect(login.status).toBe(200);
    const loginData = extractData(login.body);
    expect(loginData.tokens.accessToken).toBeTruthy();
    token = loginData.tokens.accessToken;

    // 3. Accès endpoint protégé
    const profile = await apiGet(request, '/users/profile', token);
    expect(profile.status).toBe(200);
    const profileData = extractData(profile.body);
    expect(profileData.email).toBe(email);
    expect(profileData).toHaveProperty('stats');

    // 4. Refresh token
    const refresh = await apiPost(request, '/auth/refresh', {
      refreshToken: loginData.tokens.refreshToken,
    });
    expect(refresh.status).toBe(200);
    const refreshData = extractData(refresh.body);
    expect(refreshData.accessToken).toBeTruthy();

    // 5. Logout
    const logout = await apiPost(request, '/auth/logout', {}, token);
    expect([200, 204]).toContain(logout.status);
  });

  test('POST /auth/login — rejette un mauvais mot de passe', async ({ request }) => {
    const { status, body } = await apiPost(request, '/auth/login', {
      email,
      password: 'WrongPassword1!',
    });
    expect([401, 429]).toContain(status);
    if (status === 401) {
      expect(body.error?.code).toBe('INVALID_CREDENTIALS');
    }
  });

  test('POST /auth/login — rejette un email inconnu', async ({ request }) => {
    const { status } = await apiPost(request, '/auth/login', {
      email: 'inexistant@test.com',
      password,
    });
    expect(status).toBe(401);
  });
});

// =====================================================
// AUTH — Rate Limiting
// =====================================================

test.describe('API — Rate Limiting', () => {
  test('POST /auth/login — rate limit (429) après 5 tentatives', async ({ request }) => {
    const email = `ratelimit-${Date.now()}@test.com`;
    let got429 = false;

    for (let i = 0; i < 6; i++) {
      const { status } = await apiPost(request, '/auth/login', {
        email,
        password: 'WrongPassword1!',
      });
      if (status === 429) {
        got429 = true;
        break;
      }
    }

    expect(got429).toBe(true);
  });
});

// =====================================================
// AUTH — Edge cases
// =====================================================

test.describe('API — Auth (Edge cases)', () => {
  const email = `pw-edge-${Date.now()}@test.com`;
  const password = 'Playwright123!';
  let token = '';

  test.beforeAll(async ({ request }) => {
    // Crée un user une fois pour tous les tests du bloc
    const { status, body } = await apiPost(request, '/auth/register', {
      email,
      fullname: 'Edge Tester',
      password,
      city: 'Cotonou',
      university: 'UAC',
    });
    if (status === 201) {
      token = extractData(body).tokens.accessToken;
      expect(token).toBeTruthy();
    } else if (status === 409) {
      // User already exists from a previous run — login to get a fresh token
      const login = await apiPost(request, '/auth/login', { email, password });
      expect(login.status).toBe(200);
      token = extractData(login.body).tokens.accessToken;
      expect(token).toBeTruthy();
    }
  });

  test('POST /auth/register — email déjà utilisé retourne 409 (ou 429 si rate limité)', async ({ request }) => {
    const { status } = await apiPost(request, '/auth/register', {
      email,
      fullname: 'Duplicate',
      password,
    });
    // 409 = duplicate, 429 = rate limité (5/min sur register)
    expect([409, 429]).toContain(status);
  });

  test('POST /auth/refresh — token invalide retourne 401', async ({ request }) => {
    const { status } = await apiPost(request, '/auth/refresh', {
      refreshToken: 'token-invalide-pas-un-jwt',
    });
    expect(status).toBe(401);
  });

  test('GET /users/profile — sans token retourne 401', async ({ request }) => {
    const { status } = await apiGet(request, '/users/profile');
    expect(status).toBe(401);
  });

  test('GET /users/:id — UUID invalide retourne 400 (ParseUUIDPipe)', async ({ request }) => {
    const { status } = await apiGet(request, '/users/pas-un-uuid');
    expect(status).toBe(400);
  });

  test('GET /categories/:id — UUID invalide retourne 400 (ParseUUIDPipe)', async ({ request }) => {
    const { status } = await apiGet(request, '/categories/uuid-invalide');
    expect(status).toBe(400);
  });

  test('Flow complet avec token valide — GET /users/profile après register', async ({ request }) => {
    // Si on n'a pas de token (rate limité ou déjà existant), on login
    if (!token) {
      const login = await apiPost(request, '/auth/login', { email, password });
      if (login.status === 200) {
        token = extractData(login.body).tokens.accessToken;
      }
    }

    test.skip(!token, 'Pas de token disponible — skip');

    const profile = await apiGet(request, '/users/profile', token);
    expect(profile.status).toBe(200);
    const data = extractData(profile.body);
    expect(data.email).toBe(email);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('role');
  });

  test('POST /favorites/toggle/:eventId — UUID invalide retourne 400 (ou 401 si pas de token)', async ({ request }) => {
    const { status } = await apiPost(request, '/favorites/toggle/pas-uuid', {}, token);
    // 400 si token valide (ParseUUIDPipe), 401 si token vide (JwtAuthGuard)
    expect([400, 401]).toContain(status);
  });
});

// =====================================================
// EVENTS
// =====================================================

test.describe('API — Events', () => {
  test('GET /events — retourne une liste paginée', async ({ request }) => {
    const { status, body } = await apiGet(request, '/events');
    expect(status).toBe(200);
    const result = body.data; // TransformInterceptor: body = { success, data }
    expect(result).toHaveProperty('data');
    expect(Array.isArray(result.data)).toBe(true);
    expect(result).toHaveProperty('meta');
    expect(result.meta).toHaveProperty('total');
    expect(result.meta).toHaveProperty('page');
  });

  test('GET /events — pagination (limit=5)', async ({ request }) => {
    const { status, body } = await apiGet(request, '/events?page=1&limit=5');
    expect(status).toBe(200);
    expect(body.data.data.length).toBeLessThanOrEqual(5);
  });

  test('GET /events — filtre par ville', async ({ request }) => {
    const { status, body } = await apiGet(request, '/events?city=Cotonou');
    expect(status).toBe(200);
    expect(Array.isArray(body.data.data)).toBe(true);
  });

  test('GET /events — recherche par mot-clé', async ({ request }) => {
    const { status, body } = await apiGet(request, '/events?search=concert');
    expect(status).toBe(200);
    expect(Array.isArray(body.data.data)).toBe(true);
  });

  test('GET /events?status=approved — filtre par statut', async ({ request }) => {
    const { status, body } = await apiGet(request, '/events?status=approved');
    expect(status).toBe(200);
    expect(Array.isArray(body.data.data)).toBe(true);
  });

  test('GET /events/:slug — slug invalide retourne 404', async ({ request }) => {
    const { status } = await apiGet(request, '/events/id-invalide');
    expect(status).toBe(404);
  });

  test('GET /events/:slug — slug valide retourne la structure complète', async ({ request }) => {
    // Récupère le premier événement pour avoir un slug valide
    const list = await apiGet(request, '/events?limit=1');
    const events = list.body.data?.data ?? [];
    if (events.length === 0) {
      test.skip(true, 'Aucun événement en base — skip');
      return;
    }

    const slug = events[0].slug;
    expect(slug).toBeTruthy();

    const { status, body } = await apiGet(request, `/events/${slug}`);
    expect(status).toBe(200);
    const event = body.data;
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('title');
    expect(event).toHaveProperty('slug');
    expect(event.slug).toBe(slug);
    expect(event).toHaveProperty('description');
    expect(event).toHaveProperty('startDate');
    expect(event).toHaveProperty('endDate');
    expect(event).toHaveProperty('city');
    expect(event).toHaveProperty('status');
    expect(event).toHaveProperty('category');
    expect(event).toHaveProperty('organizer');
    expect(event).toHaveProperty('tickets');
  });

  test('GET /events/cities — retourne la liste des villes', async ({ request }) => {
    const { status, body } = await apiGet(request, '/events/cities');
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /events/search-suggestions — retourne des suggestions', async ({ request }) => {
    const { status, body } = await apiGet(request, '/events/search-suggestions?q=gal');
    expect(status).toBe(200);
    expect(body.data).toHaveProperty('suggestions');
  });
});

// =====================================================
// CATEGORIES
// =====================================================

test.describe('API — Categories', () => {
  test('GET /categories — retourne la liste', async ({ request }) => {
    const { status, body } = await apiGet(request, '/categories');
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('name');
      expect(body.data[0]).toHaveProperty('slug');
    }
  });
});

// =====================================================
// SWAGGER
// =====================================================

test.describe('API — Documentation', () => {
  test('GET /api/docs — Swagger UI accessible', async ({ request }) => {
    const res = await request.get('http://localhost:3001/api/docs');
    expect([200, 301, 302]).toContain(res.status());
    const text = await res.text();
    expect(text.toLowerCase()).toContain('swagger');
  });
});

// =====================================================
// UPLOAD
// =====================================================

test.describe('API — Upload', () => {
  test('POST /upload — rejette sans authentification (401)', async ({ request }) => {
    const { status } = await apiPost(request, '/upload', {});
    expect(status).toBe(401);
  });
});
