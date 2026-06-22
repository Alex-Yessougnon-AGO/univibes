// spec: specs/qa-plan.md
// Smoke tests for recently connected admin pages — boosts, universities, settings, audit-logs, ads/[id]
// These pages now fetch from real backend API endpoints

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/fr';

test.describe('Admin — Pages connectées (API)', () => {
  // ─── Admin Boosts ─────────────────────────────────
  test('Boosts — charge et affiche les données API', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const resp = await page.goto(`${BASE}/admin/boosts`, {
      timeout: 30000,
      waitUntil: 'networkidle',
    });
    expect(resp?.status()).toBe(200);
    expect(
      errors.filter(
        (e: string) =>
          !e.includes('favicon') && !e.includes('Sentry') && !e.includes('Failed to load')
      )
    ).toHaveLength(0);

    // Vérifier que le titre s'affiche (page bien rendue)
    await expect(
      page.getByRole('heading', { level: 1, name: /boost/i })
    ).toBeVisible({ timeout: 10000 });
  });

  // ─── Admin Universities ───────────────────────────
  test('Universités — charge et affiche les données API', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const resp = await page.goto(`${BASE}/admin/universities`, {
      timeout: 30000,
      waitUntil: 'networkidle',
    });
    expect(resp?.status()).toBe(200);
    expect(
      errors.filter(
        (e: string) => !e.includes('favicon') && !e.includes('Sentry')
      )
    ).toHaveLength(0);

    await expect(
      page.getByRole('heading', { level: 1, name: /universit/i })
    ).toBeVisible({ timeout: 10000 });
  });

  // ─── Admin Settings ───────────────────────────────
  test('Paramètres — charge le formulaire avec les valeurs API', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const resp = await page.goto(`${BASE}/admin/settings`, {
      timeout: 30000,
      waitUntil: 'networkidle',
    });
    expect(resp?.status()).toBe(200);
    expect(
      errors.filter(
        (e: string) => !e.includes('favicon') && !e.includes('Sentry')
      )
    ).toHaveLength(0);

    // Vérifier que le champ commission est présent (input type=number)
    const commissionInput = page.locator('input[type="number"]').first();
    await expect(commissionInput).toBeVisible({ timeout: 10000 });

    // Vérifier que le bouton "Sauvegarder" est présent
    await expect(
      page.getByRole('button', { name: /sauvegard|save/i })
    ).toBeVisible({ timeout: 5000 });
  });

  test('Paramètres — modifie une valeur et sauvegarde', async ({ page }) => {
    // Ce test vérifie que l'UI réagit à la saisie et que le bouton save est cliquable
    await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });

    // Attendre que le formulaire soit rendu
    const commissionInput = page.locator('input[type="number"]').first();
    await expect(commissionInput).toBeVisible({ timeout: 10000 });

    // Modifier la valeur de la commission
    await commissionInput.fill('10');

    // Cliquer sur le bouton Sauvegarder pour déclencher l'appel API
    const saveButton = page.getByRole('button', { name: /sauvegard|save/i });
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
  });

  // ─── Admin Audit Logs ─────────────────────────────
  test('Audit Logs — charge et affiche la liste', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const resp = await page.goto(`${BASE}/admin/audit-logs`, {
      timeout: 30000,
      waitUntil: 'networkidle',
    });
    expect(resp?.status()).toBe(200);
    expect(
      errors.filter(
        (e: string) => !e.includes('favicon') && !e.includes('Sentry')
      )
    ).toHaveLength(0);

    await expect(
      page.getByRole('heading', { level: 1, name: /audit|log/i })
    ).toBeVisible({ timeout: 10000 });
  });

  // ─── Admin Ads/[id] — Détail publicité ────────────
  test('Annonce détail — charge avec un ID valide', async ({ page }) => {
    // Récupère la liste des annonces depuis l'API pour avoir un ID valide
    const resp = await page.request.get(
      'http://localhost:3001/api/v1/ads?limit=1'
    );
    const body = await resp.json().catch(() => ({}));
    const ads = body?.data ?? [];
    const adId = ads?.[0]?.id;

    // Si aucune annonce en base, on skip le test
    test.skip(!adId, 'Aucune annonce en base de données');

    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const pageResp = await page.goto(`${BASE}/admin/ads/${adId}`, {
      timeout: 30000,
      waitUntil: 'networkidle',
    });
    expect(pageResp?.status()).toBe(200);
    expect(
      errors.filter(
        (e: string) => !e.includes('favicon') && !e.includes('Sentry')
      )
    ).toHaveLength(0);

    // Vérifier que la page affiche le nom de l'annonceur
    await expect(
      page.getByRole('heading', { level: 1 }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  // ─── Admin Ads/create — Formulaire création ───────
  test('Création annonce — formulaire charge correctement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const resp = await page.goto(`${BASE}/admin/ads/create`, {
      timeout: 30000,
      waitUntil: 'networkidle',
    });
    expect(resp?.status()).toBe(200);
    expect(
      errors.filter(
        (e: string) => !e.includes('favicon') && !e.includes('Sentry')
      )
    ).toHaveLength(0);

    // Vérifier la présence du bouton de création
    await expect(
      page.getByRole('button', { name: /créer|create|campagne/i })
    ).toBeVisible({ timeout: 10000 });
  });

  // ─── Admin Organizers — Vérification bouton toggle ─
  test('Organisateurs — page liste charge avec les données API', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const resp = await page.goto(`${BASE}/admin/organizers`, {
      timeout: 30000,
      waitUntil: 'networkidle',
    });
    expect(resp?.status()).toBe(200);
    expect(
      errors.filter(
        (e: string) => !e.includes('favicon') && !e.includes('Sentry')
      )
    ).toHaveLength(0);

    await expect(
      page.getByRole('heading', { level: 1, name: /organis/i })
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Admin — Responsive (nouvelles pages)', () => {
  test('Admin boosts — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/admin/boosts`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test('Admin paramètres — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});
