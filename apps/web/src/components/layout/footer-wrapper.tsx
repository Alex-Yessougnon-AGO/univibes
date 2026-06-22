"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

const HIDE_FOOTER_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/",
  "/checkout/",
  "/dashboard/",
  "/admin/",
  "/moderator/",
  "/error",
  "/maintenance",
  "/unauthorized",
];

export function FooterWrapper() {
  const pathname = usePathname();

  // pathname includes locale prefix, e.g. /fr/login, /en/dashboard/events
  const shouldHide = HIDE_FOOTER_PATHS.some((path) => pathname.includes(path));

  if (shouldHide) return null;

  return <Footer />;
}
