"use client";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Search, Ticket, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
  const isRootWithoutLocale = pathname.split("/").length === 2;

  const NAV_ITEMS = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/explore", icon: Search, label: t("nav.explore") },
    { href: "/tickets", icon: Ticket, label: t("nav.tickets") },
    { href: "/favorites", icon: Heart, label: t("nav.favorites") },
    { href: "/profile", icon: User, label: t("nav.profile") },
  ];

  return (
    <nav
      aria-label={t("nav.explore")}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-[var(--border)] safe-area-pb"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? isRootWithoutLocale : pathWithoutLocale === href;
          return (
            <Link
              key={href}
              href={href}
              transitionTypes={["nav-forward"]}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl min-w-[60px] transition-colors",
                active ? "text-[var(--brand-text)]" : "text-[var(--text-tertiary)]"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center px-5 py-1.5 rounded-full transition-all duration-200",
                  active && "bg-[var(--brand-subtle)]"
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
              </span>
              <span className={cn("text-[10px] leading-none", active ? "font-bold" : "font-medium")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
