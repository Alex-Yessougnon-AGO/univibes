"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-[var(--border)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[var(--brand)] flex items-center justify-center shadow-[var(--shadow-brand)]">
                <span className="text-white font-black text-sm">UV</span>
              </div>
              <span className="font-extrabold text-base text-[var(--text)]">{t("common.appName")}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              {t("footer.madeWith")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">{t("nav.explore")}</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/blog" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.blog")}</Link></li>
              <li><Link href="/pricing" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.pricing")}</Link></li>
              <li><Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">{t("nav.dashboard")}</h3>
            <ul className="space-y-3">
              <li><Link href="/profile" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.profile")}</Link></li>
              <li><Link href="/tickets" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.tickets")}</Link></li>
              <li><Link href="/favorites" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.favorites")}</Link></li>
              <li><Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.dashboard")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">{t("nav.legal")}</h3>
            <ul className="space-y-3">
              <li><Link href="/legal/terms" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("legal.terms")}</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("legal.privacy")}</Link></li>
              <li><Link href="/legal/cookies" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("legal.cookies")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)]">&copy; 2025 {t("common.appName")}. {t("footer.rights")}</p>
          <p className="text-sm text-[var(--text-tertiary)]">{t("common.appTagline")}</p>
        </div>
      </div>
    </footer>
  );
}
