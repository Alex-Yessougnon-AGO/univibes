// spec: specs/qa-plan.md
// Smoke tests for moderation, legal, and special pages

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/fr';

test.describe('Modération', () => {
  test('Modération — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/moderator`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Modération événements — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/moderator/events`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Modération review — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/moderator/events/1/review`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Modération logs — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/moderator/logs`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Modération signalements — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/moderator/reports`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });
});

test.describe('Pages Légales & Spéciales', () => {
  test('CGU — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/legal/terms`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Politique de confidentialité — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/legal/privacy`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Cookies — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/legal/cookies`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Erreur — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/error`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Maintenance — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/maintenance`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Non autorisé — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/unauthorized`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Désabonnement — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/unsubscribe`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Page introuvable (404) — redirige ou affiche erreur', async ({ page }) => {
    const resp = await page.goto(`${BASE}/page-inexistante-12345`, { timeout: 30000 });
    // 404 or redirect to not-found page
    expect(resp?.status() === 200 || resp?.status() === 404).toBe(true);
  });
});
