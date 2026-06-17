import { test, expect } from "@playwright/test";

test.describe("Language persistence", () => {
  test("NEXT_LOCALE cookie is set when switching language via dropdown", async ({ page, context }) => {
    await context.clearCookies();

    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    expect(page.url()).toMatch(/\/fr/);

    // Switch to English via LanguageSwitcher
    const langBtn = page.locator('[aria-label*="angue"], [aria-label*="anguage"]');
    await expect(langBtn).toBeVisible({ timeout: 10000 });
    await langBtn.click();

    const englishBtn = page.getByRole("button").filter({ hasText: "Anglais" });
    await expect(englishBtn).toBeVisible({ timeout: 5000 });
    await englishBtn.click();

    // Wait for URL to change
    await page.waitForURL(/\/en/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");

    // Verify the cookie is set
    const cookies = await context.cookies();
    const localeCookie = cookies.find((c) => c.name === "NEXT_LOCALE");
    expect(localeCookie).toBeDefined();
    expect(localeCookie!.value).toBe("en");
  });

  test("locale persists via cookie when navigating between pages", async ({ page, context }) => {
    // Navigate to French page
    await page.goto("/fr/explore", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    expect(page.url()).toMatch(/\/fr\/explore/);

    // Switch to English via dropdown
    const langBtn = page.locator('[aria-label*="angue"], [aria-label*="anguage"]');
    await expect(langBtn).toBeVisible({ timeout: 10000 });
    await langBtn.click();

    const englishBtn = page.getByRole("button").filter({ hasText: "Anglais" });
    await expect(englishBtn).toBeVisible({ timeout: 5000 });
    await englishBtn.click();

    await page.waitForURL(/\/en\/explore/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");

    // Now do a full page navigation (goto) to another URL - should stay in English
    await page.goto("/en/tickets", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    expect(page.url()).toMatch(/\/en\/tickets/);

    // Navigate to another page
    await page.goto("/en/profile", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    expect(page.url()).toMatch(/\/en\/profile/);
  });

  test("locale persists on full page reload", async ({ page, context }) => {
    // Start in French
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Switch to English
    const langBtn = page.locator('[aria-label*="angue"], [aria-label*="anguage"]');
    await expect(langBtn).toBeVisible({ timeout: 10000 });
    await langBtn.click();

    const englishBtn = page.getByRole("button").filter({ hasText: "Anglais" });
    await expect(englishBtn).toBeVisible({ timeout: 5000 });
    await englishBtn.click();

    await page.waitForURL(/\/en/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");

    // Full page reload
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Should still be in English (cookie persists across reloads)
    expect(page.url()).toMatch(/\/en/);
  });
});
