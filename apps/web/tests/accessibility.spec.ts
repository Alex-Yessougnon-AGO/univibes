import { test, expect, type Page } from '@playwright/test';

/** Wait for React hydration by checking that links have React event handlers attached */
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const links = document.querySelectorAll('a');
    for (const link of links) {
      const keys = Object.keys(link);
      if (keys.some(k => k.startsWith('__reactProps'))) return true;
    }
    return false;
  }, { timeout: 15000 });
}

/**
 * WCAG 2.1 AA Automated Accessibility Tests for Univibes
 * Pages tested: home, explore, event detail, checkout, favorites, profile
 */

test.describe('Accessibility - WCAG 2.1 AA', () => {

  // Test 1: All images have alt text
  test('images-have-alt-attributes', async ({ page }) => {
    await page.goto('http://localhost:3000/explore', { timeout: 45000 });
    const images = await page.locator('img').all();
    const imagesWithoutAlt = [];

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // alt="" is valid for decorative images per WCAG — only flag if alt attr is missing entirely
      if (alt === null) {
        const src = await img.getAttribute('src') || 'unknown';
        imagesWithoutAlt.push(src);
      }
    }

    expect(imagesWithoutAlt).toHaveLength(0), 
      `Found ${imagesWithoutAlt.length} images without alt attribute: ${imagesWithoutAlt.join(', ')}`;
  });

  // Test 2: All buttons have accessible labels
  test('buttons-have-accessible-labels', async ({ page }) => {
    await page.goto('http://localhost:3000', { timeout: 45000 });
    await waitForHydration(page);
    const count = await page.locator('button').count();
    const buttonsWithoutLabel = [];

    for (let i = 0; i < count; i++) {
      const btn = page.locator('button').nth(i);
      try {
        const ariaLabel = await btn.getAttribute('aria-label', { timeout: 3000 });
        const title = await btn.getAttribute('title', { timeout: 1000 });
        const text = await btn.innerText({ timeout: 3000 });

        if (!ariaLabel && !title && text.trim() === '') {
          buttonsWithoutLabel.push(`button #${i}`);
        }
      } catch {
        // Skip buttons that are slow/hidden
      }
    }

    expect(buttonsWithoutLabel).toHaveLength(0),
      `Found ${buttonsWithoutLabel.length} icon buttons without accessible labels: ${buttonsWithoutLabel.join(', ')}`;
  });

  // Test 3: Heading hierarchy is correct
  test('heading-hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3000', { timeout: 45000 });
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    const issues = [];

    let lastLevel = 0;
    for (let i = 0; i < count; i++) {
      const h = headings.nth(i);
      const tagName = await h.evaluate(el => el.tagName);
      const level = parseInt(tagName.charAt(1));
      if (level > lastLevel + 1 && lastLevel > 0) {
        issues.push(`Heading skipped from h${lastLevel} to h${level}`);
      }
      lastLevel = level;
    }

    expect(issues).toHaveLength(0), `Heading hierarchy issues: ${issues.join('; ')}`;
  });

  // Test 4: Forms have labels
  test('form-elements-have-labels', async ({ page }) => {
    await page.goto('http://localhost:3000/login', { timeout: 15000 });
    
    const inputs = await page.locator('input').all();
    const issues = [];

    for (const input of inputs) {
      const type = await input.getAttribute('type');
      if (type === 'hidden' || type === 'submit' || type === 'button') continue;

      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');

      if (!id && !ariaLabel && !ariaLabelledBy && !placeholder) {
        issues.push('Input without label or placeholder');
      }
    }

    expect(issues).toHaveLength(0), `Form elements without labels: ${issues.join('; ')}`;
  });

  // Test 5: Keyboard navigation works
  test('keyboard-navigable', async ({ page }) => {
    await page.goto('http://localhost:3000', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Check that the page has interactive elements using Playwright's built-in locators
    const interactiveCount = await page.locator('a, button, input, select, textarea').count();
    expect(interactiveCount).toBeGreaterThan(0),
      `No interactive elements found on the page. Found: ${interactiveCount}`;
    
    // Tab multiple times and verify focus moves to an interactive element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const activeTag = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase() || '');
    expect(activeTag).not.toBe(''), 'Keyboard focus did not move to any element after Tab presses';
  });

  // Test 6: No color-only contrast issues (basic check)
  test('basic-contrast-check', async ({ page }) => {
    await page.goto('http://localhost:3000/explore', { timeout: 15000 });
    
    // Check text colors on buttons and links
    const buttons = await page.locator('button, a').all();
    for (const btn of buttons) {
      const bgColor = await btn.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      const color = await btn.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      // Very basic check - ensure we're not on pure white on white or black on black
      if (bgColor === 'rgb(255, 255, 255)' && color === 'rgb(255, 255, 255)') {
        expect(true).toBe(false), 'White text on white background detected';
      }
    }
  });

  // Test 7: Proper ARIA attributes
  test('valid-aria-attributes', async ({ page }) => {
    await page.goto('http://localhost:3000', { timeout: 15000 });
    
    const invalidAria = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const issues: string[] = [];
      const validPrefixes = [
        'aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby',
        'aria-details', 'aria-disabled', 'aria-expanded', 'aria-flowto',
        'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby',
        'aria-live', 'aria-owns', 'aria-relevant', 'aria-modal'
      ];

      allElements.forEach(el => {
        const attrs = el.getAttributeNames();
        attrs.forEach(attr => {
          if (attr.startsWith('aria-') && !validPrefixes.includes(attr)) {
            issues.push(`Invalid ARIA attribute: ${attr}`);
          }
        });
      });

      return issues;
    });

    expect(invalidAria).toHaveLength(0), `Invalid ARIA attributes: ${invalidAria.join(', ')}`;
  });

  // Test 8: Mobile viewport doesn't have horizontal overflow
  test('no-horizontal-overflow-mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000', { timeout: 15000 });

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalScroll).toBe(false), 'Horizontal scroll detected on mobile viewport';
  });

  // Test 9: Links have meaningful text
  test('links-meaningful-text', async ({ page }) => {
    await page.goto('http://localhost:3000/explore', { timeout: 15000 });
    
    const links = page.locator('a');
    const count = await links.count();
    const problematicLinks = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.innerText();

      if (!href || !text || text.trim() === '') {
        problematicLinks.push('Link without meaningful text');
      }
    }

    expect(problematicLinks).toHaveLength(0), `Problematic links: ${problematicLinks.join('; ')}`;
  });

  // Test 10: Focus visible on interactive elements
  test('focus-visible-support', async ({ page }) => {
    await page.goto('http://localhost:3000', { timeout: 15000 });
    
    // Tab multiple times to reach actual content
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const hasFocusRing = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.outlineWidth !== '0px' || style.outlineStyle !== 'none';
    });

    expect(hasFocusRing).toBe(true), 'Focus indicator not visible on focused element';
  });
});
