import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = ".design/univibes-platform/screenshots";

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "desktop-1280", width: 1280, height: 800 },
];

const PAGES = [
  { path: "/", name: "homepage" },
  { path: "/explore", name: "explore" },
  { path: "/event/gala-fin-annee-faseg-2025", name: "event-detail" },
  { path: "/login", name: "login" },
  { path: "/register", name: "register" },
  { path: "/dashboard", name: "dashboard" },
  { path: "/dashboard/events", name: "dashboard-events" },
  { path: "/dashboard/events/new", name: "dashboard-events-new" },
  { path: "/admin", name: "admin" },
  { path: "/admin/users", name: "admin-users" },
  { path: "/admin/events", name: "admin-events" },
  { path: "/admin/payments", name: "admin-payments" },
  { path: "/admin/boosts", name: "admin-boosts" },
  { path: "/admin/ads", name: "admin-ads" },
  { path: "/favorites", name: "favorites" },
  { path: "/tickets", name: "tickets" },
  { path: "/notifications", name: "notifications" },
  { path: "/profile", name: "profile" },
  { path: "/moderator/events", name: "moderator" },
  { path: "/forgot-password", name: "forgot-password" },
  { path: "/checkout/gala-fin-annee-faseg-2025", name: "checkout" },
  { path: "/organizer/bde-faseg", name: "organizer" },
];

async function run() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    deviceScaleFactor: 2,
    locale: "fr-FR",
  });

  let allPassed = true;

  for (const pageConfig of PAGES) {
    for (const vp of VIEWPORTS) {
      const page = await ctx.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const url = `${BASE_URL}${pageConfig.path}`;
      const filename = `${SCREENSHOT_DIR}/review-${pageConfig.name}-${vp.name}.png`;

      try {
        console.log(`📸 Capturing ${url} @ ${vp.name}...`);
        await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(500);

        // Check for console errors
        const consoleErrors = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") {
            consoleErrors.push(msg.text());
          }
        });

        await page.screenshot({ path: filename, fullPage: true });

        console.log(`   ✅ Saved: ${filename}`);
        if (consoleErrors.length > 0) {
          console.log(`   ⚠️  Console errors (${consoleErrors.length}):`);
          consoleErrors.forEach((e) => console.log(`      ❌ ${e}`));
          allPassed = false;
        }
      } catch (err) {
        console.log(`   ❌ Failed: ${err.message}`);
        allPassed = false;
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log(allPassed ? "\n✅ All screenshots captured successfully!" : "\n⚠️  Some screenshots had errors (see above)");
}

run().catch(console.error);
