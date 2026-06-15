"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Plus, Calendar, ArrowRight, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { label: "Vues totales", value: "12 400", icon: "Eye", change: "+12%", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
  { label: "Favoris", value: "843", icon: "Heart", change: "+8%", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/10" },
  { label: "Billets vendus", value: "156", icon: "Ticket", change: "+23%", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
  { label: "Revenus", value: "780 000 FCFA", icon: "DollarSign", change: "+15%", color: "text-[var(--brand)]", bg: "bg-[var(--brand-subtle)]" },
];

const RECENT_EVENTS = [
  { name: "Gala de Fin d'Année FASEG", status: "Approuvé", tickets: 89, views: 12400 },
  { name: "Speed Networking Étudiants", status: "En attente", tickets: 45, views: 2800 },
  { name: "Campus Afterwork", status: "Brouillon", tickets: 0, views: 0 },
];

const statusVariant = (s: string) => {
  if (s === "Approuvé") return "success" as const;
  if (s === "En attente") return "warning" as const;
  return "soft" as const;
};

export default function DashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
            <LayoutDashboard className="w-3 h-3" />
            Tableau de bord
          </span>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
            Tableau de bord
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">Bienvenue sur ton espace organisateur</p>
        </div>
        <Button variant="primary" size="md" asChild>
          <Link href="/dashboard/events/new">
            <Plus className="w-4 h-4" />
            Nouvel événement
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <span className={`w-5 h-5 ${stat.color}`}>
                  {stat.icon === "Eye" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
                  {stat.icon === "Heart" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>}
                  {stat.icon === "Ticket" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>}
                  {stat.icon === "DollarSign" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                </span>
              </div>
              <Badge variant="success" className="text-[10px]">{stat.change}</Badge>
            </div>
            <p className="text-2xl font-extrabold text-[var(--text)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--text)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--brand)]" />
            Événements récents
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/events">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          {RECENT_EVENTS.map((evt) => (
            <div key={evt.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--border-subtle)] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[var(--brand)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{evt.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{evt.views.toLocaleString()} vues · {evt.tickets} billets</p>
                </div>
              </div>
              <Badge variant={statusVariant(evt.status)}>{evt.status}</Badge>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="/dashboard/events/new" className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 card-hover flex items-center gap-4 shadow-[var(--shadow-sm)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center">
            <Plus className="w-5 h-5 text-[var(--brand)]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[var(--text)]">Créer un événement</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Ajoute un nouvel événement à la plateforme</p>
          </div>
        </Link>
        <Link href="/dashboard/events" className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 card-hover flex items-center gap-4 shadow-[var(--shadow-sm)]">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[var(--text)]">Gérer mes événements</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Modifie ou archive tes événements</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
