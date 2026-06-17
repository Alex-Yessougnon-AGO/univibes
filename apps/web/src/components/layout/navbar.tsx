"use client";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const pathWithoutLocale = '/' + pathname.split('/').slice(2).join('/');
  const isRootWithoutLocale = pathname.split('/').length === 2;
  const isActive = (href: string) => href === '/' ? isRootWithoutLocale : pathWithoutLocale === href;
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/explore", label: t("nav.explore") },
  ];

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-[var(--border)] shadow-[var(--shadow-sm)]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[var(--brand)] flex items-center justify-center shadow-[var(--shadow-brand)]">
              <span className="text-white font-black text-sm">UV</span>
            </div>
            <span className="font-extrabold text-lg text-[var(--text)] hidden sm:block tracking-tight">
              {t("common.appName")}
            </span>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                transitionTypes={["nav-forward"]}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link href="/explore" className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] text-sm hover:border-[var(--brand)]/50 transition-colors min-w-[180px]">
              <Search className="w-4 h-4" />
              <span>{t("common.search")}…</span>
              <kbd className="ml-auto text-xs bg-[var(--border-subtle)] px-1.5 py-0.5 rounded">⌘K</kbd>
            </Link>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors"
                aria-label={t("nav.settings")}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* CTA */}
            <Button variant="primary" size="sm" className="hidden sm:flex gap-1.5" asChild>
              <Link href="/login">
                <span>{t("nav.login")}</span>
              </Link>
            </Button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute top-16 left-4 right-4 rounded-2xl card-base p-4 shadow-[var(--shadow-lg)] space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                transitionTypes={["nav-forward"]}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                    : "text-[var(--text)] hover:bg-[var(--border-subtle)]"
                )}
              >
                {link.label}
              </Link>
            ))}
            {/* Language switcher in mobile menu */}
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="px-3 py-1.5 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                {t("nav.language")}
              </p>
              <div className="flex gap-1 px-3 pb-2">
                <Link
                  href={pathWithoutLocale}
                  locale="fr"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                >
                  🇫🇷 {t("nav.french")}
                </Link>
                <Link
                  href={pathWithoutLocale}
                  locale="en"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                >
                  🇬🇧 {t("nav.english")}
                </Link>
              </div>
            </div>
            <div className="border-t border-[var(--border)] pt-2">
              <Button variant="primary" size="md" className="w-full" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
