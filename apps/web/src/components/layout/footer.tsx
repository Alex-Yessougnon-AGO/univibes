"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const t = useTranslations();

  const columns = [
    {
      title: t("nav.explore"),
      links: [
        { href: "/explore", label: t("nav.explore") },
        { href: "/pricing", label: t("nav.pricing") },
        { href: "/about", label: t("nav.about") },
        { href: "/blog", label: t("nav.blog") },
      ],
    },
    {
      title: t("nav.profile"),
      links: [
        { href: "/tickets", label: t("nav.tickets") },
        { href: "/favorites", label: t("nav.favorites") },
        { href: "/dashboard", label: t("nav.dashboard") },
        { href: "/contact", label: t("nav.contact") },
      ],
    },
    {
      title: t("nav.legal"),
      links: [
        { href: "/legal/terms", label: t("legal.terms") },
        { href: "/legal/privacy", label: t("legal.privacy") },
        { href: "/legal/cookies", label: t("legal.cookies") },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-x py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-2">
            <Logo size="lg" />
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mt-5">
              {t("footer.madeWith")}
            </p>
            <p className="eyebrow mt-6 !text-[var(--text-tertiary)]">
              {t("common.appTagline")}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-xs uppercase tracking-[0.14em] text-[var(--text)] mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} Univibes. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/legal/terms" className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text)] transition-colors">
              {t("legal.terms")}
            </Link>
            <Link href="/legal/privacy" className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text)] transition-colors">
              {t("legal.privacy")}
            </Link>
          </div>
        </div>
      </div>
      {/* Espace pour la BottomNav mobile */}
      <div className="h-[76px] md:hidden" aria-hidden="true" />
    </footer>
  );
}
