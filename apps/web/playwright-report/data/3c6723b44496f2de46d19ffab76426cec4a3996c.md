# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: language-persistence.spec.ts >> Language persistence >> NEXT_LOCALE cookie is set when switching language via dropdown
- Location: tests/language-persistence.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/fr
Call log:
  - navigating to "http://localhost:3000/fr", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Language persistence", () => {
  4  |   test("NEXT_LOCALE cookie is set when switching language via dropdown", async ({ page, context }) => {
  5  |     await context.clearCookies();
  6  | 
> 7  |     await page.goto("/fr", { waitUntil: "domcontentloaded" });
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/fr
  8  |     await page.waitForLoadState("networkidle");
  9  |     await page.waitForTimeout(1500);
  10 | 
  11 |     expect(page.url()).toMatch(/\/fr/);
  12 | 
  13 |     // Switch to English via LanguageSwitcher
  14 |     const langBtn = page.locator('[aria-label*="angue"], [aria-label*="anguage"]');
  15 |     await expect(langBtn).toBeVisible({ timeout: 10000 });
  16 |     await langBtn.click();
  17 | 
  18 |     const englishBtn = page.getByRole("button").filter({ hasText: "Anglais" });
  19 |     await expect(englishBtn).toBeVisible({ timeout: 5000 });
  20 |     await englishBtn.click();
  21 | 
  22 |     // Wait for URL to change
  23 |     await page.waitForURL(/\/en/, { timeout: 15000 });
  24 |     await page.waitForLoadState("networkidle");
  25 | 
  26 |     // Verify the cookie is set
  27 |     const cookies = await context.cookies();
  28 |     const localeCookie = cookies.find((c) => c.name === "NEXT_LOCALE");
  29 |     expect(localeCookie).toBeDefined();
  30 |     expect(localeCookie!.value).toBe("en");
  31 |   });
  32 | 
  33 |   test("locale persists via cookie when navigating between pages", async ({ page, context }) => {
  34 |     // Navigate to French page
  35 |     await page.goto("/fr/explore", { waitUntil: "domcontentloaded" });
  36 |     await page.waitForLoadState("networkidle");
  37 |     await page.waitForTimeout(1500);
  38 | 
  39 |     expect(page.url()).toMatch(/\/fr\/explore/);
  40 | 
  41 |     // Switch to English via dropdown
  42 |     const langBtn = page.locator('[aria-label*="angue"], [aria-label*="anguage"]');
  43 |     await expect(langBtn).toBeVisible({ timeout: 10000 });
  44 |     await langBtn.click();
  45 | 
  46 |     const englishBtn = page.getByRole("button").filter({ hasText: "Anglais" });
  47 |     await expect(englishBtn).toBeVisible({ timeout: 5000 });
  48 |     await englishBtn.click();
  49 | 
  50 |     await page.waitForURL(/\/en\/explore/, { timeout: 15000 });
  51 |     await page.waitForLoadState("networkidle");
  52 | 
  53 |     // Now do a full page navigation (goto) to another URL - should stay in English
  54 |     await page.goto("/en/tickets", { waitUntil: "domcontentloaded" });
  55 |     await page.waitForLoadState("networkidle");
  56 |     await page.waitForTimeout(1000);
  57 | 
  58 |     expect(page.url()).toMatch(/\/en\/tickets/);
  59 | 
  60 |     // Navigate to another page
  61 |     await page.goto("/en/profile", { waitUntil: "domcontentloaded" });
  62 |     await page.waitForLoadState("networkidle");
  63 |     await page.waitForTimeout(1000);
  64 | 
  65 |     expect(page.url()).toMatch(/\/en\/profile/);
  66 |   });
  67 | 
  68 |   test("locale persists on full page reload", async ({ page, context }) => {
  69 |     // Start in French
  70 |     await page.goto("/fr", { waitUntil: "domcontentloaded" });
  71 |     await page.waitForLoadState("networkidle");
  72 |     await page.waitForTimeout(1000);
  73 | 
  74 |     // Switch to English
  75 |     const langBtn = page.locator('[aria-label*="angue"], [aria-label*="anguage"]');
  76 |     await expect(langBtn).toBeVisible({ timeout: 10000 });
  77 |     await langBtn.click();
  78 | 
  79 |     const englishBtn = page.getByRole("button").filter({ hasText: "Anglais" });
  80 |     await expect(englishBtn).toBeVisible({ timeout: 5000 });
  81 |     await englishBtn.click();
  82 | 
  83 |     await page.waitForURL(/\/en/, { timeout: 15000 });
  84 |     await page.waitForLoadState("networkidle");
  85 | 
  86 |     // Full page reload
  87 |     await page.reload({ waitUntil: "domcontentloaded" });
  88 |     await page.waitForLoadState("networkidle");
  89 |     await page.waitForTimeout(1000);
  90 | 
  91 |     // Should still be in English (cookie persists across reloads)
  92 |     expect(page.url()).toMatch(/\/en/);
  93 |   });
  94 | });
  95 | 
```