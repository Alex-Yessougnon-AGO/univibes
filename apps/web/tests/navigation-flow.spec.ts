// spec: specs/qa-plan.md
// Navigation flow tests — verify links work and lead to actual pages

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/fr';

test.describe('Navigation Flows', () => {
  test('Landing → Explorer via CTA', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const exploreLink = page.getByRole('link', { name: /Explorer|Explore/i });
    await expect(exploreLink.first()).toBeVisible({ timeout: 10000 });
    await exploreLink.first().click();
    await page.waitForURL('**/explore**', { timeout: 10000 });
    await expect(page).toHaveURL(/explore/);
  });

  test('Landing → Inscription via lien', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const registerLink = page.getByRole('link', { name: /Inscription|Sign up/i });
    if (await registerLink.isVisible()) {
      await registerLink.first().click();
      await page.waitForURL('**/register**', { timeout: 10000 });
    }
  });

  test('Landing → Connexion via navigation', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const loginLink = page.getByRole('link', { name: /Connexion|Log in/i });
    if (await loginLink.isVisible()) {
      await loginLink.first().click();
      await page.waitForURL('**/login**', { timeout: 10000 });
    }
  });

  test('Admin sidebar navigation — liens fonctionnels', async ({ page }) => {
    await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    // Get all sidebar links
    const sidebarLinks = page.locator('aside a');
    const count = await sidebarLinks.count();
    expect(count).toBeGreaterThan(0);

    // Test at least the first link works
    const firstHref = await sidebarLinks.first().getAttribute('href');
    if (firstHref) {
      await sidebarLinks.first().click();
      await page.waitForURL(`**${firstHref}**`, { timeout: 10000 });
    }
  });

  test('Blog → Article via clic', async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: 'networkidle' });
    const articleLink = page.getByRole('link').filter({ has: page.locator('h2, h3') }).first();
    if (await articleLink.isVisible()) {
      await articleLink.click();
      await page.waitForURL('**/blog/**', { timeout: 10000 });
    }
  });
});

test.describe('Internationalisation (i18n)', () => {
  test('Page FR — contenu en français', async ({ page }) => {
    await page.goto(`${BASE}/explore`, { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('Explorer');
  });

  test('Page EN — contenu en anglais', async ({ page }) => {
    await page.goto('http://localhost:3000/en/explore', { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('Explore');
  });

  test('Redirection locale par défaut — FR', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/fr/);
  });
});
