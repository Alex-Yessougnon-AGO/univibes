"use client";

import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, MousePointer, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp, containerStagger } from "@/lib/motion";

export default function AdminAdDetailPage() {
  const params = useParams();

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={containerStagger(0.07)} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Link href="/admin/ads" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
            <div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.3, ease: [0.25, 0.1, 0, 1] }}>
                <Badge variant="success" className="mb-2">Active</Badge>
              </motion.div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Campagne — Rentrée UAC</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Ciblage : Abomey-Calavi · 50 000 FCFA</p>
            </div>
            <Button variant="outline" size="sm">Mettre en pause</Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="aspect-[3/1] rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center mb-6 text-sm text-[var(--text-tertiary)]"
          >
            Aperçu de la bannière
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Eye, color: "var(--brand)", label: "Impressions", value: "12.4k" },
              { icon: MousePointer, color: "text-[var(--accent)]", label: "Clics", value: "843" },
              { icon: TrendingUp, color: "text-emerald-500", label: "CTR", value: "6.8%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center"
              >
                <stat.icon className={`w-5 h-5 ${stat.color === "var(--brand)" ? "text-[var(--brand)]" : stat.color} mx-auto mb-1`} />
                <p className="text-xl font-bold text-[var(--text)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-2 text-sm"
          >
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Début</span><span className="text-[var(--text)]">12 juin 2025</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Fin</span><span className="text-[var(--text)]">12 juillet 2025</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Budget</span><span className="text-[var(--text)] font-medium">50 000 FCFA</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Dépensé</span><span className="text-[var(--text)] font-medium">32 500 FCFA</span></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
