"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BOOSTS = [
  { event: "Gala FASEG", organizer: "BDE FASEG", type: "72h", start: "19 Juil 2025", status: "Actif", cost: "5 000 FCFA" },
  { event: "HackBénin", organizer: "TECH HUB UAC", type: "24h", start: "25 Juil 2025", status: "Planifié", cost: "2 000 FCFA" },
  { event: "AfroBeats Night", organizer: "Élite Events", type: "7 jours", start: "02 Août 2025", status: "Actif", cost: "10 000 FCFA" },
  { event: "Speed Networking", organizer: "BDE FASEG", type: "24h", start: "15 Juin 2025", status: "Expiré", cost: "2 000 FCFA" },
];

const statusVariant = (s: string) => {
  if (s === "Actif") return "success" as const;
  if (s === "Planifié") return "warning" as const;
  return "soft" as const;
};

export default function AdminBoostsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Boosts</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Gestion des événements sponsorisés</p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Boosts actifs", value: "12" },
          { label: "Revenus boosts", value: "45 000 FCFA" },
          { label: "Expirés (30j)", value: "8" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 shadow-[var(--shadow-sm)]">
            <p className="text-xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">{s.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Événement</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Organisateur</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Début</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">Coût</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {BOOSTS.map((boost) => (
                <tr key={boost.event} className="hover:bg-[var(--border-subtle)]/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-medium text-[var(--text)]">{boost.event}</td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--text-secondary)]">{boost.organizer}</td>
                  <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">{boost.type}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-sm text-[var(--text-secondary)]">{boost.start}</td>
                  <td className="px-4 py-3.5"><Badge variant={statusVariant(boost.status)}>{boost.status}</Badge></td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-sm font-medium text-[var(--brand)]">{boost.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
