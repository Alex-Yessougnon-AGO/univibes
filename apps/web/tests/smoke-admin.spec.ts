// spec: specs/qa-plan.md
// Smoke tests for all admin pages

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/fr';

const ADMIN_PAGES = [
  { url: '/admin', name: 'Dashboard admin' },
  { url: '/admin/users', name: 'Utilisateurs' },
  { url: '/admin/events', name: 'Événements' },
  { url: '/admin/payments', name: 'Paiements' },
  { url: '/admin/boosts', name: 'Boosts' },
  { url: '/admin/ads', name: 'Publicités' },
  { url: '/admin/categories', name: 'Catégories' },
  { url: '/admin/cities', name: 'Villes' },
  { url: '/admin/universities', name: 'Universités' },
  { url: '/admin/settings', name: 'Paramètres' },
  { url: '/admin/audit-logs', name: 'Audit Logs' },
  { url: '/admin/organizers', name: 'Organisateurs' },
  { url: '/admin/payouts', name: 'Payouts' },
  { url: '/admin/events/1', name: 'Détail événement' },
  { url: '/admin/organizers/club-culturel-uac', name: 'Détail organisateur' },
  { url: '/admin/ads/create', name: 'Nouvelle pub' },
];

test.describe('Admin — Smoke Tests', () => {
  for (const { url, name } of ADMIN_PAGES) {
    test(`Admin ${name} — page charge`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg: any) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      const resp = await page.goto(`${BASE}${url}`, { timeout: 30000, waitUntil: 'networkidle' });
      expect(resp?.status()).toBe(200);
      expect(errors.filter((e: string) => !e.includes('favicon') && !e.includes('Sentry'))).toHaveLength(0);
    });
  }
});

test.describe('Admin — Responsive', () => {
  test('Admin dashboard — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test('Admin utilisateurs — sidebar masquée sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/admin/users`, { waitUntil: 'networkidle' });
    // Verify the menu button is visible (hamburger icon on mobile)
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    await expect(menuButton).toBeVisible({ timeout: 5000 });
  });
});
