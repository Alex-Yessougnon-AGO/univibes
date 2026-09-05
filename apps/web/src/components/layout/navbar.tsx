"use client";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoLink } from "@/components/shared/logo";

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
  const isRootWithoutLocale = pathname.split("/").length === 2;
  const isActive = (href: string) =>
    href === "/" ? isRootWithoutLocale : pathWithoutLocale === href;
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
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/about", label: t("nav.about") },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Raccourci clavier : ⌘K / Ctrl+K ── */
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

  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const q = searchVal.trim();
      router.push(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
      setSearchActive(false);
      setSearchVal("");
    },
    [searchVal, router]
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
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
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="container-x h-[72px] flex items-center justify-between gap-4">
          <LogoLink />

          {/* Liens — desktop */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                transitionTypes={["nav-forward"]}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                  isActive(link.href)
                    ? "bg-[var(--text)] text-[var(--bg)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            <form
              onSubmit={handleSearchSubmit}
              className={cn(
                "hidden lg:flex items-center gap-2 pl-3.5 pr-2 h-10 rounded-full border transition-all min-w-[200px]",
                searchActive
                  ? "border-[var(--brand)] ring-[3px] ring-[var(--brand)]/15 bg-[var(--surface)]"
                  : "border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--brand)]/40"
              )}
            >
              <Search className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchActive(true)}
                onBlur={() => !searchVal && setSearchActive(false)}
                placeholder={t("common.search") + "…"}
                aria-label={t("common.search")}
                className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none min-w-0"
              />
              <kbd className="text-[11px] text-[var(--text-tertiary)] bg-[var(--border-subtle)] px-1.5 py-0.5 rounded-md font-mono shrink-0">
                ⌘K
              </kbd>
            </form>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 hidden sm:flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
              >
                {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="md" className="rounded-full" asChild>
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
              <Button variant="primary" size="md" className="rounded-full" asChild>
                <Link href="/register">{t("nav.register")}</Link>
              </Button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text)]"
              aria-label={mobileOpen ? t("nav.close_menu") : t("nav.open_menu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute top-[84px] left-4 right-4 rounded-[1.5rem] bg-[var(--surface)] border border-[var(--border)] p-3 shadow-[var(--shadow-lg)] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                transitionTypes={["nav-forward"]}
                className={cn(
                  "flex items-center px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-colors",
                  isActive(link.href)
                    ? "bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                    : "text-[var(--text)]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 p-1 pt-3 mt-2 border-t border-[var(--border-subtle)]">
              <Link
                href={pathWithoutLocale}
                locale="fr"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2.5 rounded-xl text-sm font-bold border border-[var(--border)] text-[var(--text)]"
              >
                FR
              </Link>
              <Link
                href={pathWithoutLocale}
                locale="en"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2.5 rounded-xl text-sm font-bold border border-[var(--border)] text-[var(--text)]"
              >
                EN
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 pt-2">
              <Button variant="outline" size="md" className="w-full rounded-full" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  {t("nav.login")}
                </Link>
              </Button>
              <Button variant="primary" size="md" className="w-full rounded-full" asChild>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  {t("nav.register")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[72px]" aria-hidden="true" />
    </>
  );
}
