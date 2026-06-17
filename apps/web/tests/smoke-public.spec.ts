// spec: specs/qa-plan.md
// Smoke tests for all public pages — landing, explore, events, blog, etc.

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/fr';

// Helper: check page loads without console errors  
async function checkPageLoad(page: any, url: string) {
  const errors: string[] = [];
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  const resp = await page.goto(url, { timeout: 30000, waitUntil: 'networkidle' });
  expect(resp?.status()).toBe(200);
  expect(errors.filter((e: string) => !e.includes('favicon') && !e.includes('Sentry'))).toHaveLength(0);
  return page;
}

test.describe('Pages Publiques', () => {
  // Landing page
  test('Landing page — charges sans erreur', async ({ page }) => {
    await checkPageLoad(page, BASE);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Landing page — barre de recherche affichée', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await expect(page.getByPlaceholder('Nom, description, mot-clé…')).toBeVisible({ timeout: 10000 });
  });

  test('Landing page — catégories affichées', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const categories = page.locator('a[href*="/explore?category="]');
    await expect(categories.first()).toBeVisible({ timeout: 10000 });
  });

  // Explore
  test('Explore — charges et affiche des événements', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/explore`);
    await expect(page.getByText('Explorer')).toBeVisible({ timeout: 10000 });
  });

  test('Explore — filtres fonctionnels', async ({ page }) => {
    await page.goto(`${BASE}/explore`, { waitUntil: 'networkidle' });
    const filterButton = page.getByText('Filtres');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await expect(page.getByText('Toutes')).toBeVisible();
    }
  });

  // Event detail
  test('Événement — page détail charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/event/soiree-bde`);
  });

  // About
  test('À propos — page charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/about`);
    await expect(page.getByText('UnivVibes')).toBeVisible({ timeout: 10000 });
  });

  // Contact
  test('Contact — formulaire visible', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/contact`);
    await expect(page.getByText('Contact')).toBeVisible({ timeout: 10000 });
  });

  // Blog list
  test('Blog — liste des articles', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/blog`);
    await expect(page.getByText('Blog')).toBeVisible({ timeout: 10000 });
  });

  // Blog article
  test('Blog — article charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/blog/premier-article`);
  });

  // Pricing
  test('Tarifs — page charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/pricing`);
  });

  // Search
  test('Recherche — page charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/search`);
  });

  // Favorites
  test('Favoris — page charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/favorites`);
  });

  // Organizer
  test('Organisateur — page charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/organizer/bde-faseg`);
  });

  // Notifications
  test('Notifications — page charge', async ({ page }) => {
    await checkPageLoad(page, `${BASE}/notifications`);
  });
});

test.describe('Responsive — Pages Publiques', () => {
  test('Landing page — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test('Explore — pas de débordement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/explore`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
