"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EVENTS } from "@/lib/mock-data";
import { formatShortDate } from "@/lib/utils";

export default function AdminEventsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Événements</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Gérer tous les événements de la plateforme</p>
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Événement</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Organisateur</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">Statut</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">Vues</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-[var(--border-subtle)]/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                        <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text)] truncate">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-sm text-[var(--text-secondary)]">{event.organizer.name}</td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--text-secondary)]">{formatShortDate(event.startDate)}</td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <Badge variant={event.isFavorited ? "success" : "warning"}>
                      {event.isFavorited ? "Approuvé" : "En attente"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-[var(--text-secondary)]">{event.views.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200/50">Approuver</button>
                      <button className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-200/50">Refuser</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
