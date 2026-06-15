"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Users, Calendar, CreditCard, TrendingUp, ArrowUp, ArrowDown, Megaphone, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { label: "Utilisateurs", value: "2 847", icon: Users, change: "+12%", up: true, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
  { label: "Événements", value: "156", icon: Calendar, change: "+8%", up: true, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
  { label: "Paiements", value: "12.4M FCFA", icon: CreditCard, change: "+23%", up: true, color: "text-[var(--brand)]", bg: "bg-[var(--brand-subtle)]" },
  { label: "Boosts actifs", value: "18", icon: TrendingUp, change: "-5%", up: false, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/10" },
];

const PENDING_EVENTS = [
  { title: "Gala de Fin d'Année FASEG 2025", organizer: "BDE FASEG", date: "19 Juil 2025" },
  { title: "Conférence IA & Santé", organizer: "TECH HUB UAC", date: "28 Août 2025" },
];

const ACTIVITIES = [
  { action: "Nouvel utilisateur inscrit", detail: "Koffi A. · Cotonou", time: "2 min" },
  { action: "Paiement reçu", detail: "12 000 FCFA · Gala FASEG", time: "15 min" },
  { action: "Événement approuvé", detail: "HackBénin 48h", time: "1h" },
  { action: "Boost activé", detail: "AfroBeats Night · 72h", time: "2h" },
];

export default function AdminDashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp} className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
          <ShieldCheck className="w-3 h-3" />
          Administration
        </span>
        <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">Dashboard Admin</h1>
        <p className="text-sm text-[var(--text-secondary)]">Vue d&apos;ensemble de la plateforme</p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-emerald-600" : "text-rose-500"}`}>
                {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[var(--text)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
          <h2 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            Événements en attente de validation
          </h2>
          <div className="space-y-3">
            {PENDING_EVENTS.map((evt) => (
              <div key={evt.title} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--border-subtle)] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{evt.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{evt.organizer} · {evt.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200/50">Approuver</button>
                  <button className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-200/50">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
          <h2 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--brand)]" />
            Activité récente
          </h2>
          <div className="space-y-3">
            {ACTIVITIES.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--border-subtle)] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{activity.action}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{activity.detail}</p>
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)]">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
