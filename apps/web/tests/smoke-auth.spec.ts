// spec: specs/qa-plan.md
// Smoke tests for all authentication pages

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/fr';

test.describe('Authentification', () => {
  // Login
  test('Login — page charge', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    const resp = await page.goto(`${BASE}/login`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
    expect(errors.filter((e: string) => !e.includes('favicon'))).toHaveLength(0);
    // Wait for staggered animations to finish
    await page.waitForTimeout(600);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('Login — champs email et mot de passe présents', async ({ page }) => {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  // Register
  test('Inscription — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/register`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  // Forgot password
  test('Mot de passe oublié — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/forgot-password`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  // Auth pages
  test('Onboarding — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/auth/onboarding`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Réinitialisation mot de passe — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/auth/reset-password`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Vérification email — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/auth/verify-email`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });

  test('Vérification email token — page charge', async ({ page }) => {
    const resp = await page.goto(`${BASE}/auth/verify-email/test-token`, { timeout: 30000, waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
  });
});

test.describe('Responsive — Auth', () => {
  test('Login — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test('Register — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
