"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Megaphone,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const ADMIN_LINKS = [
    { href: "/admin", icon: LayoutDashboard, label: t("nav.dashboard") },
    { href: "/admin/users", icon: Users, label: t("admin.users") },
    { href: "/admin/events", icon: Calendar, label: t("admin.events") },
    { href: "/admin/payments", icon: CreditCard, label: t("admin.payments") },
    { href: "/admin/boosts", icon: TrendingUp, label: t("admin.boosts") },
    { href: "/admin/ads", icon: Megaphone, label: t("admin.ads") },
  ];

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center" onClick={() => setOpen(!open)}>
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold text-sm text-[var(--text)]">{t("admin.dashboard")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)]">{t("nav.viewSite")}</Link>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside className={cn(
          "fixed lg:sticky top-14 left-0 z-30 w-64 h-[calc(100dvh-3.5rem)] bg-[var(--surface)] border-r border-[var(--border)] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}>
          <nav className="p-4 space-y-1">
            {ADMIN_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400"
                      : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)]"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
