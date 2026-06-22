"use client";
import { useTranslations } from "next-intl";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Bell, Ticket, Heart, Calendar, Megaphone, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useAuth } from "@/lib/auth-context";
import { notificationsService } from "@/lib/services/user-service";

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  ticket: { icon: Ticket, color: "text-[var(--brand)]", bg: "bg-[var(--brand-subtle)]" },
  favorite: { icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/10" },
  reminder: { icon: Calendar, color: "text-[var(--brand)]", bg: "bg-[var(--brand-subtle)]" },
  boost: { icon: Megaphone, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/10" },
  system: { icon: Bell, color: "text-[var(--text-secondary)]", bg: "bg-[var(--border-subtle)]" },
  default: { icon: Bell, color: "text-[var(--text-secondary)]", bg: "bg-[var(--border-subtle)]" },
};

export default function NotificationsPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    notificationsService.findAll()
      .then((data: any) => {
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === "unread" ? notifications.filter((n: any) => !n.read) : notifications;
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const markAllRead = () => {
    notificationsService.markAllRead()
      .then(() => setNotifications(notifications.map((n: any) => ({ ...n, read: true }))))
      .catch(() => {});
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-4 overflow-hidden reveal">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <div
              >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Bell className="w-3 h-3" />
                {t("nav.notifications")}
              </span>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
                  {t("nav.notifications")}
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {unreadCount} {t("notifications.unread")}{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1.5 pressable" onClick={markAllRead}>
                    <Check className="w-3.5 h-3.5" />
                    {t("notifications.markAllRead")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filter tabs */}
        <div
          className="max-w-3xl mx-auto px-4 sm:px-6 mb-4"
        >
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: t("explore.allCategories"), count: notifications.length },
              { key: "unread", label: t("notifications.unreadFilter"), count: unreadCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as "all" | "unread")}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                  filter === tab.key
                    ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                    : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    "ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                    filter === tab.key ? "bg-white/20" : "bg-[var(--border)]"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 reveal">
            {filtered.length > 0 ? (
              <div
                key={filter}
                className="space-y-2"
              >
                {filtered.map((notif: any, i: number) => {
                  const config = typeConfig[notif.type] || typeConfig.default;
                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "rounded-2xl p-4 border transition-colors",
                        notif.read
                          ? "bg-[var(--surface)] border-[var(--border)]"
                          : "bg-[var(--surface)] border-[var(--brand)]/20 shadow-[var(--shadow-sm)]"
                      )}>
                      <div className="flex gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.bg)}>
                          <config.icon className={cn("w-5 h-5", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className={cn("text-sm", notif.read ? "font-medium text-[var(--text)]" : "font-semibold text-[var(--text)]")}>
                                {notif.title}
                              </h3>
                              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{notif.description}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[var(--brand)] shrink-0 mt-1.5" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[11px] text-[var(--text-tertiary)]">{notif.time}</span>
                            {notif.actionable && (
                              <Link href="/tickets" className="text-[11px] font-medium text-[var(--brand)] hover:underline">
                                {t("notifications.see")}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                key="empty"
                className="text-center py-20"
              >
                <div
                  className="w-20 h-20 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5 card-hover"
                >
                  <Bell className="w-8 h-8 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
                  {t("nav.notifications")}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2 max-w-xs mx-auto leading-relaxed">
                  {t("notifications.youAreUpToDate")} ! On te préviendra ici dès qu&apos;il se passe quelque chose — confirmation de billet, rappel d&apos;événement ou nouvelle de tes organisateurs préférés.
                </p>
              </div>
            )}
          
        </section>
      </main>
      <BottomNav />
    </>
  );
}
