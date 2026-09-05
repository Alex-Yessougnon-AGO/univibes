import type { MetadataRoute } from "next";

const BASE_URL = "https://univibes.vercel.app";
const LOCALES = ["fr", "en"] as const;

/** Routes publiques indexables (hors espaces privés / dashboards). */
const STATIC_ROUTES = [
  "",
  "/explore",
  "/search",
  "/about",
  "/pricing",
  "/contact",
  "/blog",
  "/login",
  "/register",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: (route === "" || route === "/explore"
        ? "daily"
        : "weekly") as "daily" | "weekly",
      priority: route === "" ? 1 : route === "/explore" ? 0.9 : 0.6,
    }))
  );
}
