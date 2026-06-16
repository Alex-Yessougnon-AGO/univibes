"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Users,
  Eye,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/dashboard/events", icon: Calendar, label: "Mes événements" },
  { href: "/dashboard/events/new", icon: Plus, label: "Créer un événement" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--brand)] flex items-center justify-center">
                <span className="text-white font-black text-xs">UV</span>
              </div>
              <span className="font-extrabold text-sm text-[var(--text)] hidden sm:block">Univibes</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Voir le site</Link>
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-subtle)] flex items-center justify-center">
              <span className="text-[var(--brand-text)] font-bold text-xs">AK</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:sticky top-14 left-0 z-30 w-64 h-[calc(100dvh-3.5rem)] bg-[var(--surface)] border-r border-[var(--border)] transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="p-4 space-y-1">
            {SIDEBAR_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)]"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Link>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
