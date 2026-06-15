"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Bell, Ticket, Heart, Calendar, Megaphone, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "ticket" | "favorite" | "reminder" | "boost" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "ticket", title: "Billet confirmé", description: "Ton billet pour le Gala FASEG est confirmé !", time: "Il y a 5 min", read: false, actionable: true },
  { id: "n2", type: "reminder", title: "Rappel : HackBénin demain", description: "Le hackathon commence dans 24h. Prépare ton laptop !", time: "Il y a 1h", read: false },
  { id: "n3", type: "favorite", title: "Nouvel événement favori", description: "La Nuit des Arts est maintenant dans tes favoris", time: "Il y a 3h", read: false },
  { id: "n4", type: "boost", title: "Boost activé", description: "L'AfroBeats Night est en boost pour 72h", time: "Il y a 6h", read: true },
  { id: "n5", type: "system", title: "Bienvenue sur Univibes", description: "Explore les événements près de chez toi !", time: "Hier", read: true },
  { id: "n6", type: "ticket", title: "Rappel de paiement", description: "Ta réservation pour Speed Networking est en attente de paiement", time: "Hier", read: true, actionable: true },
];

const typeConfig = {
  ticket: { icon: Ticket, color: "text-[var(--brand)]", bg: "bg-[var(--brand-subtle)]" },
  favorite: { icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/10" },
  reminder: { icon: Calendar, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/10" },
  boost: { icon: Megaphone, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/10" },
  system: { icon: Bell, color: "text-[var(--text-secondary)]", bg: "bg-[var(--border-subtle)]" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Bell className="w-3 h-3" />
                Notifications
              </span>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
                    Notifications
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {unreadCount} non lue{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={markAllRead}>
                    <Check className="w-3.5 h-3.5" />
                    Tout marquer lu
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="max-w-3xl mx-auto px-4 sm:px-6 mb-4"
        >
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "Toutes", count: notifications.length },
              { key: "unread", label: "Non lues", count: unreadCount },
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
        </motion.div>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {filtered.map((notif, i) => {
                  const config = typeConfig[notif.type];
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.03, ease: [0.25, 0.1, 0, 1] }}
                      className={cn(
                        "rounded-2xl p-4 border transition-colors",
                        notif.read
                          ? "bg-[var(--surface)] border-[var(--border)]"
                          : "bg-[var(--surface)] border-[var(--brand)]/20 shadow-[var(--shadow-sm)]"
                      )}
                    >
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
                                Voir
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1], delay: 0.1 }}
                  className="w-20 h-20 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5"
                >
                  <Bell className="w-8 h-8 text-[var(--text-tertiary)]" />
                </motion.div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
                  Aucune notification
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2 max-w-xs mx-auto leading-relaxed">
                  Tu es à jour ! On te préviendra ici dès qu&apos;il se passe quelque chose — confirmation de billet, rappel d&apos;événement ou nouvelle de tes organisateurs préférés.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
