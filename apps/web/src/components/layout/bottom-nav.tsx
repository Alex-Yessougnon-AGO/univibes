"use client";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Search, Ticket, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const pathWithoutLocale = '/' + pathname.split('/').slice(2).join('/');
  const isRootWithoutLocale = pathname.split('/').length === 2;

  const NAV_ITEMS = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/explore", icon: Search, label: t("nav.explore") },
    { href: "/tickets", icon: Ticket, label: t("nav.tickets") },
    { href: "/favorites", icon: Heart, label: t("nav.favorites") },
    { href: "/profile", icon: User, label: t("nav.profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-[var(--border)] safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? isRootWithoutLocale : pathWithoutLocale === href;
          return (
            <Link
              key={href}
              href={href}
              transitionTypes={["nav-forward"]}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-w-[52px] relative",
                active
                  ? "text-[var(--brand)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <div className={`nav-icon-wrapper ${active ? 'active' : 'inactive'}`}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] leading-none transition-all duration-200 ${active ? 'font-semibold' : 'font-medium'}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
