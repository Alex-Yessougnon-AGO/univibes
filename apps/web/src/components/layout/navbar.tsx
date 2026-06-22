"use client";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
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

  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/explore", label: t("nav.explore") },
    { href: "/about", label: t("nav.about") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => { setMounted(true); }, []);

  /* ── Keyboard shortcut: ⌘K / Ctrl+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchActive(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === "Escape" && searchActive) {
        setSearchActive(false);
        setSearchVal("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchActive]);

  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchVal.trim();
    if (q) {
      router.push(`/explore?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/explore");
    }
    setSearchActive(false);
    setSearchVal("");
  }, [searchVal, router]);

  const handleSearchBlur = useCallback(() => {
    // Small delay to allow click on search button
    setTimeout(() => {
      if (!searchVal) {
        setSearchActive(false);
      }
    }, 200);
  }, [searchVal]);
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
            <form
              onSubmit={handleSearchSubmit}
              className={`hidden sm:flex items-center gap-2 px-3 h-9 rounded-xl border transition-colors min-w-[180px] ${
                searchActive
                  ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/20 bg-[var(--surface)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/50"
              }`}
            >
              <Search className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchActive(true)}
                onBlur={handleSearchBlur}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
                placeholder={t("common.search") + "…"}
                className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none min-w-0"
              />
              {searchActive ? (
                <button
                  type="submit"
                  className="text-xs text-[var(--brand)] font-medium whitespace-nowrap hover:text-[var(--brand-hover)] transition-colors"
                >
                  Go
                </button>
              ) : (
                <kbd className="text-xs text-[var(--text-tertiary)] bg-[var(--border-subtle)] px-1.5 py-0.5 rounded font-mono shrink-0">⌘K</kbd>
              )}
            </form>

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
              aria-label={mobileOpen ? t("nav.close_menu") : t("nav.open_menu")}
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
