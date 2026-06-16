"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Search, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeUp, containerStagger } from "@/lib/motion";

const ORGS = [
  { name: "Club Culturel UAC", verified: true, events: 24, revenue: "450 000 FCFA" },
  { name: "BDE FASEG", verified: true, events: 18, revenue: "280 000 FCFA" },
  { name: "TECH HUB UAC", verified: false, events: 12, revenue: "0 FCFA" },
];

export default function AdminOrganizersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={containerStagger(0.06)} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Organisateurs</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Tous les organisateurs de la plateforme.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30" />
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {ORGS.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
              >
                <Link href={`/admin/organizers/${org.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent)]/20 flex items-center justify-center font-bold text-sm">{org.name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm text-[var(--text)]">{org.name}</span>
                        {org.verified && <Check className="w-3.5 h-3.5 text-[var(--brand)]" />}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{org.events} événements · CA {org.revenue}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
