// spec: specs/qa-plan.md
// Smoke tests for dashboard, profile, tickets, checkout

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/fr';

test.describe('Dashboard', () => {
  test('Dashboard — page charge', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => { if (msg.type() === 'error') errors.push(msg.text()); });
    const resp = await page.goto(`${BASE}/dashboard`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
    expect(errors.filter((e: string) => !e.includes('favicon') && !e.includes('Sentry'))).toHaveLength(0);
  });

  test('Dashboard événements — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/dashboard/events`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Dashboard nouvel événement — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/dashboard/events/new`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Dashboard analytics — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/dashboard/analytics`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Dashboard checkin — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/dashboard/events/1/checkin`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });
});

test.describe('Profil', () => {
  test('Profil — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/profile`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Modifier profil — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/profile/edit`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Paramètres profil — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/profile/settings`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Sécurité — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/profile/security`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Notifications profil — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/profile/notifications`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });
});

test.describe('Tickets & Checkout', () => {
  test('Tickets — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/tickets`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Détail ticket — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/tickets/1`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Facture — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/tickets/1/invoice`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Checkout — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/checkout/event-1`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Checkout succès — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/checkout/success`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Checkout annulation — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/checkout/cancel`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });
});

test.describe('Responsive — Profil & Tickets', () => {
  test('Profil — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test('Tickets — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/tickets`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
